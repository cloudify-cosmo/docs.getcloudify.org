---
layout: bt_wiki
title: Initilizing a VM on AWS and executing commands using fabric
category: User Guide
draft: false
weight: 400

---

You are ready to use Cloudify to launch an instance in AWS and you want to Cloudify to prepare your machine with all you favorite application.

This is the easiest way to achieve that.

## Prerequisites

* Install Cloudify on your machine [Overview Page](http://stage-docs.getcloudify.org/howto/user_guide/Overview/)

* AWS account & credentials.<be>Same as in the basic [Starting an Instance in AWS](http://stage-docs.getcloudify.org/howto/user_guide/aws_vm/)

# Source

&nbsp;
This is our `blueprint.yaml` file:

```yaml
tosca_definitions_version: cloudify_dsl_1_3

description: >
  This blueprint uses the Cloudify AWS plugin and fabric plugin to initiate an
  instance in AWS and then run commands on the remote machine.

imports:
  - http://www.getcloudify.org/spec/cloudify/3.4/types.yaml
  - http://www.getcloudify.org/spec/aws-plugin/1.4.1/plugin.yaml
  - http://www.getcloudify.org/spec/fabric-plugin/1.4/plugin.yaml

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

  my_security_group_id:
    type: string
    default: ''

  use_existing_server:
    type: boolean
    default: false

  keypair_name:
    type: string
    default: my_keypair

  ssh_key_filename:
    type: string
    default: ~/.ssh/my_keypair.pem

  my_server_id:
    type: string
    default: ''

  my_server_ssh_user:
    type: string
    default: ubuntu


dsl_definitions:
  aws_config: &AWS_CONFIG
    aws_access_key_id: { get_input: aws_access_key_id }
    aws_secret_access_key: { get_input: aws_secret_access_key }
    ec2_region_name: { get_input: aws_region_name }

  fabric_env: &simple_fabric_env
    host_string: { get_attribute: [ my_host, public_ip_address ] }
    user: { get_input: my_server_ssh_user }
    key_filename: { get_input: ssh_key_filename }

node_templates:

  my_host:
    type: cloudify.aws.nodes.Instance
    properties:
      aws_config: *AWS_CONFIG
      resource_id: { get_input: my_server_id }
      install_agent: false
      image_id: { get_input: aws_server_image_id }
      instance_type: m3.medium
    relationships:
      - target: my_keypair
        type: cloudify.aws.relationships.instance_connected_to_keypair
      - target: my_security_group
        type: cloudify.aws.relationships.instance_connected_to_security_group

  active_host:
    type: cloudify.nodes.Root
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: fabric.fabric_plugin.tasks.run_commands
          inputs:
            commands:
              - command -v apt-get && sudo apt-get update -y || true
            fabric_env:
              *simple_fabric_env
    relationships:
      - target: my_host
        type: cloudify.relationships.contained_in

  my_keypair:
    type: cloudify.aws.nodes.KeyPair
    properties:
      aws_config: *AWS_CONFIG
      resource_id: { get_input: keypair_name }
      private_key_path: { get_input: ssh_key_filename }

  my_security_group:
    type: cloudify.aws.nodes.SecurityGroup
    properties:
      aws_config: *AWS_CONFIG
      resource_id: { get_input: my_security_group_id }
      description: Security group for my_server
      rules:
        - ip_protocol: tcp
          from_port: 22
          to_port: 22
          cidr_ip: 0.0.0.0/0

outputs:

  My_server:
    description: My server running on AWS
    value:
      Active_Server_IP: { get_attribute: [ my_host, public_ip_address ] }
      keypair_path: { get_property: [ my_keypair, private_key_path ] }
```

## Blueprints Breakdown

### Specifics

The inputs in this blueprint set the identification for your AWS account and the specifics for the instance type and flavor.

* `aws_access_key_id` & `aws_secret_access_key` is creds for the IAM user in your account.<br>Keeping your credntials in the blueprint file is highly insecure, pass them as inputs in execution command or from inputs file.

* `my_server_image_id` is the AMI id that will be used when spawning your instance.<br> Keep in mind that the AMI id will change between regions and some require subscribtion before use

* `my_server_ssh_user` is the default system user set by the AMI creator

&nbsp;
### General information on the blueprint

Make your adjusmets and add your personal information at the top of the blueprint to make it your own.
To get the line-up of resource used or created by Cloudify go through the node_template section.

In this case you need to specify enviorment settings to allow fabric to connect to the newly created instance.<br>These can be defined in the `dsl_definitions` section and then called as a group later in the blueprint

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

{{< gsHighlight  markdown  >}}
$ cfy local install-plugins -p blueprint.yaml
...

Collecting https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip (from -r /var/folders/p3/xrjr1c953yv5fnk719ndljnr0000gn/T/requirements_tftykz.txt (line 1))
  Downloading https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip (124kB)
    100% |################################| 126kB 31kB/s
  Downloading https://github.com/cloudify-cosmo/cloudify-fabric-plugin/archive/1.4.zip
     - 36kB 34kB/s
.
.
.
Installing collected packages: boto, cloudify-aws-plugin
  Running setup.py install for cloudify-aws-plugin ... done
Successfully installed boto-2.38.0 cloudify-aws-plugin-1.4.1

Installing collected packages: cloudify-fabric-plugin
  Running setup.py install for cloudify-fabric-plugin ... done
Successfully installed cloudify-fabric-plugin-1.4
...
{{< /gsHighlight >}}

&nbsp;
#### Executing Blueprint

We are now ready to run the install workflow. This will make everything come to life, Once complete you'll have a AWS instance up and running.

{{< gsHighlight  markdown  >}}
$ cfy local install --task-retries=10 --inputs '{"aws_access_key_id": "<your access key id here>", "aws_secret_access_key":"<your secret key here>"}'
...

Initiated blueprint.yaml
If you make changes to the blueprint, run `cfy local init -p blueprint.yaml` again to apply them
2016-07-12 11:13:24 CFY <local> Starting 'install' workflow execution
.
.
.
2016-07-12 11:28:35 LOG <local> [my_host_8a54b->my_server_ip_807e5|establish] INFO: Associated Elastic IP 52.48.123.105 with instance i-d4753e58.
2016-07-12 11:28:35 CFY <local> [my_host_8a54b->my_server_ip_807e5|establish] Task succeeded 'ec2.elasticip.associate'
2016-07-12 11:28:35 CFY <local> 'install' workflow execution succeeded

...
{{< /gsHighlight >}}

&nbsp;
#### Getting deployment outputs

Once the workflow has executed successfully you can retrieve information on your current deployment by running the following command. 

Data returned is the current state


{{< gsHighlight  markdown  >}}
$ cfy local outputs
...

{
  "My_server": {
    "Active_Server_IP": "52.48.123.105", 
    "keypair_path": "~/.ssh/my_keypair.pem"
  }
}

...
{{< /gsHighlight >}}

&nbsp;
#### Tearing down deployment

Once you are finished with your instance and you no longer need it, go ahead and run the uninstall workflow.

{{< gsHighlight  markdown  >}}
$ cfy local uninstall --task-retries=9
...

2016-07-12 11:37:54 CFY <local> Starting 'uninstall' workflow execution
2016-07-12 11:37:54 CFY <local> [my_host_8a54b] Stopping node
2016-07-12 11:37:54 CFY <local> [my_host_8a54b.stop] Sending task 'ec2.instance.stop'
.
.
.
2016-07-12 11:38:13 LOG <local> [keypair_0a104.delete] INFO: Deleted key pair: my_keypair.
2016-07-12 11:38:13 CFY <local> [keypair_0a104.delete] Task succeeded 'ec2.keypair.delete'
2016-07-12 11:38:14 CFY <local> 'uninstall' workflow execution succeeded

...
{{< /gsHighlight >}}

{{% gsNote title="Install command" %}}
This action is the sum of several steps (uploading blueprint, creating deployment and runing workflow).
{{< /gsNote >}}

{{% gsNote title="task-retries disclaimer" %}}
Adding `--task-retries=9` is recommended for AWS deployment, since we have no control no how long it will take for the instance to initialize or terminate.

Setting the retires to 9 is the safest bet.
{{< /gsNote >}}

# What's Next

Initiate a VM in AWS and execute shell commands on it


