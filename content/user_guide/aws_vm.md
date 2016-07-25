---
layout: bt_wiki
title: Starting an Instance in AWS
category: User Guide
draft: false
weight: 100

---

Amazon web service is the leading cloud provider today and is used by most.

This Use case will guide you step-by-step to getting your very own Cloudify VM running on AWS.

The following blueprint holds all the vital information to achieve just that (Bear in mind, you'll have to insert some personal detail to access your account)

## Prerequisites

Before going forward with this example please make sure you've go through the [Overview Page](http://stage-docs.getcloudify.org/howto/user_guide/Overview/)

To use AWS you'll need an AWS account and an IAM user with sufficient permissions.
Because this blueprint uses AWS infrastructure, It needs the AWS plugin.

{{% gsNote title="Prerequisites addition" %}}
Credentials used will be access_key and secret_key
For the blueprint to run on local you'll need to install the aws plugin.

How-to Specified below
{{< /gsNote >}}

# Source

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
    type: string
    default: ''

  aws_secret_access_key:
    type: string
    default: ''

  aws_region_name:
    type: string
    default: 'eu-west-1'

  aws_server_image_id:
    type: string
    default: 'ami-b265c7c1'


dsl_definitions:
  aws_config: &AWS_CONFIG
    aws_access_key_id: { get_input: aws_access_key_id }
    aws_secret_access_key: { get_input: aws_secret_access_key }
    ec2_region_name: { get_input: aws_region_name }

node_templates:

  my_host:
    type: cloudify.aws.nodes.Instance
    properties:
      aws_config: *AWS_CONFIG
      install_agent: false
      image_id: { get_input: aws_server_image_id }
      instance_type: m3.medium

outputs:

  My_server:
    description: My server running on AWS
    value:
      Active_Server_IP: { get_attribute: [ my_host, public_ip_address ] }
```

## Blueprints Breakdown

### Specifics

The inputs in this blueprint set the identification for your AWS account and the specifics for the instance type and flavor.

* `aws_access_key_id` & `aws_secret_access_key` is creds for the IAM user in your account.<br>Keeping your credntials in the blueprint file is highly insecure, pass them as inputs in execution command or from inputs file

* `my_server_image_id` is the AMI id that will be used when spawning your instance.<br> Keep in mind that the AMI id will change between regions and some require subscribtion before use

&nbsp;
### General information on the blueprint

Make your adjusmets and add your personal information at the top of the blueprint to make it your own.
To get the line-up of resource used or created by Cloudify go through the node_template section.

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

{{% gsNote title="Install command" %}}
This action is the sum of several steps (uploading blueprint, creating deployment and runing workflow).
{{< /gsNote >}}

{{% gsNote title="task-retries disclaimer" %}}
Adding `--task-retries=9` is recommended for AWS deployment, since we have no control no how long it will take for the instance to initialize or terminate.

Setting the retires to 9 is the safest bet.
{{< /gsNote >}}

# What's Next

Initiate a VM in AWS and execute shell commands on it


