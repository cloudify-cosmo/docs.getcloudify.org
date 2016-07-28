---
layout: bt_wiki
title: Starting an Instance in AWS
category: User Guide
draft: false
weight: 100

---

The purpose of this guide is to walk you through getting your very own Cloudify deployment running on AWS.

## Prerequisites

Before going forward with this example please make sure you've go through the [Overview Page](http://stage-docs.getcloudify.org/howto/user_guide/Overview/)

To use AWS you'll need an AWS account and an IAM user with sufficient permissions.
Because this blueprint uses AWS infrastructure, It needs the AWS plugin.

{{% gsNote title="Prerequisites addition" %}}
Credentials used will be `access_key` and `secret_key`
For the blueprint to run on local you'll need to install the aws plugin.

How-to is Specified below
{{< /gsNote >}}

# Blueprint Source

&nbsp;
This is our `blueprint.yaml` file:

```yaml
tosca_definitions_version: cloudify_dsl_1_3

description: >
  This blueprint uses the Cloudify AWS plugin to initiate an
  instance in AWS Ireland region. It has no keypair so you can't connect to it.
  And no security group so it take the default SG.

imports:
  - http://www.getcloudify.org/spec/cloudify/3.4/types.yaml
  - http://www.getcloudify.org/spec/aws-plugin/1.4.1/plugin.yaml

inputs:

  aws_access_key_id:
    description: Your AWS access key id
    type: string
    default: ''

  aws_secret_access_key:
    description: Your AWS secret key
    type: string
    default: ''

  aws_region_name:
    description: Sets the AWS region
    type: string
    default: 'eu-west-1'

  aws_server_image_id:
    description: Which AMI will be used
    type: string
    default: 'ami-b265c7c1'


dsl_definitions:
  aws_config: &AWS_CONFIG
    aws_access_key_id: { get_input: aws_access_key_id }
    aws_secret_access_key: { get_input: aws_secret_access_key }
    ec2_region_name: { get_input: aws_region_name }

node_templates:

  my_host:
    # Set the sceme to use, based on Cloudify cloudify.aws.nodes.Instance type
    type: cloudify.aws.nodes.Instance
    # Set of properties to define your template
    properties:
      aws_config: *AWS_CONFIG
      install_agent: false
      image_id: { get_input: aws_server_image_id }
      instance_type: m3.medium

outputs:

  my_server:
    description: My server running on AWS
    value:
      active_server_ip: { get_attribute: [ my_host, public_ip_address ] }
```

## Blueprint Breakdown

This blueprint requires AWS access API credentials to be used to deploy a VM in a specific region using a specific AMI.<br>Your personal data is grouped into `dsl_definitions` and used to initiate a VM called `my_host`.

Once the workflow is complete you can fetch the deployments outputs to learn the details of your instances.

&nbsp;
# Getting everything to work

Now that we have IAM user credentials ready and have chosen the Type of instance, region (where it will be hosted) and AMI (source Image for your VM).

We'll need to update it in the blueprint file.

Download and place the file in a directory that will be the working directory for this deployment and name it `blueprint.yaml`

## Step-by-step commands to run the blueprint

The following commands will make everything come to life

&nbsp;
#### Installing required plugins for blueprint

To run this blueprint in a "Local" mode, you'' need to install the aws-plugin.
This command will download the plugin and will make it available for Cloudify

```markdown
$ cfy local install-plugins -p blueprint.yaml
...

Collecting https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip (from -r /var/folders/p3/xrjr1c953yv5fnk719ndljnr0000gn/T/requirements_tftykz.txt (line 1))
  Downloading https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip (124kB)
    100% |################################| 126kB 31kB/s
.
.
.
Installing collected packages: boto, cloudify-aws-plugin
  Running setup.py install for cloudify-aws-plugin ... done
Successfully installed boto-2.38.0 cloudify-aws-plugin-1.4.1

...
```

&nbsp;
#### Executing Blueprint

We are now ready to run the install workflow. This will make everything come to life, Once complete you'll have a AWS instance up and running.

```markdown
$ cfy local install --task-retries=10 --inputs '{"aws_access_key_id": "<your access key id here>", "aws_secret_access_key":"<your secret key here>"}'
...

Processing inputs source: {"aws_access_key_id": "...", "aws_secret_access_key":"..."}
Initiated blueprint.yaml
If you make changes to the blueprint, run `cfy local init -p blueprint.yaml` again to apply them
2016-07-24 11:39:42 CFY <local> Starting 'install' workflow execution
.
.
.
2016-07-24 11:40:31 LOG <local> [my_host_ed0b4.start] INFO: Instance i-8e2c3004 is running.
2016-07-24 11:40:31 CFY <local> [my_host_ed0b4.start] Task succeeded 'ec2.instance.start' [retry 1/10]
2016-07-24 11:40:31 CFY <local> 'install' workflow execution succeeded

...
```

{{% gsNote title="Install command" %}}
This action is the sum of several steps (uploading blueprint, creating deployment and runing workflow).
{{< /gsNote >}}

&nbsp;
#### Getting deployment outputs

Once the workflow has executed successfully you can retrieve information on your current deployment by running the following command. 

Data returned is the current state


```markdown
$ cfy local outputs
...

{
  "My_server": {
    "Active_Server_IP": "52.48.123.105", 
    "keypair_path": "~/.ssh/my_keypair.pem"
  }
}

...
```

&nbsp;
#### Tearing down deployment

Once you are finished with your instance and you no longer need it, go ahead and run the uninstall workflow.

```markdown
$ cfy local uninstall --task-retries=9
...

2016-07-24 11:45:46 CFY <local> Starting 'uninstall' workflow execution
2016-07-24 11:45:46 CFY <local> [my_host_ed0b4] Stopping node
2016-07-24 11:45:46 CFY <local> [my_host_ed0b4.stop] Sending task 'ec2.instance.stop'
.
.
.
2016-07-24 11:46:21 LOG <local> [my_host_ed0b4.delete] INFO: Terminated instance: i-8e2c3004.
2016-07-24 11:46:21 CFY <local> [my_host_ed0b4.delete] Task succeeded 'ec2.instance.terminate' [retry 2/20]
2016-07-24 11:46:21 CFY <local> 'uninstall' workflow execution succeeded

...
```

{{% gsNote title="task-retries disclaimer" %}}
Adding `--task-retries=` is recommended for any deployment. You never have control over how long it takes to initilize ot terminate and instance.<br>Using `--task-retries=` will help you avoid task failures.
{{< /gsNote >}}

# What's Next

Initiate a VM in AWS and executing shell commands on it to [Configure a server remotely](http://stage-docs.getcloudify.org/howto/user_guide/conf_server/)


