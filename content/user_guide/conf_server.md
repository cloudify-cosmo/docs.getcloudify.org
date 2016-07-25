---
layout: bt_wiki
title: Configuring a server remotly using fabric plugin
category: User Guide
draft: false
weight: 110

---

You are now ready to initialize a VM on AWS. Mange and configure it using Cloudify<br>
Cloudify make it very simple using [fabric](http://www.fabfile.org/) 

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

* `my_server_ssh_user` is the default system user set by the AMI creator.<br>Needed for fabric to connect to server.

&nbsp;
### General information on the blueprint

Make your adjusmets and add your personal information at the top of the blueprint to make it your own.
To get the line-up of resource used or created by Cloudify go through the node_template section.

This blueprint has keypair and security group objects to allow the option of connecting from remote.

In this Guide you need to specify enviorment settings to allow fabric to connect to the newly created instance.<br>These can be defined in the `dsl_definitions` section and then called as a group later in the blueprint

&nbsp;
# Getting everything to work

Make your changes to the blueprint and run the following commands from the blueprints directory.

## Step-by-step commands to run the blueprint

The following commands will make everything come to life

&nbsp;
#### Installing required plugins for blueprint

To run this blueprint in a "Local" mode, you'' need to install the aws-plugin.
This command will download the plugin and will make it available for Cloudify

```markdown
$ cfy local install-plugins -p blueprint.yaml
...

Collecting https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip (from -r /var/folders/p3/xrjr1c953yv5fnk719ndljnr0000gn/T/requirements_HrYbtF.txt (line 1))
  Downloading https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip (124kB)
    100% |################################| 126kB 39kB/s 
Collecting https://github.com/cloudify-cosmo/cloudify-fabric-plugin/archive/1.4.zip (from -r /var/folders/p3/xrjr1c953yv5fnk719ndljnr0000gn/T/requirements_HrYbtF.txt (line 2))
  Downloading https://github.com/cloudify-cosmo/cloudify-fabric-plugin/archive/1.4.zip
     - 36kB 42kB/s
.
.
.
Installing collected packages: boto, cloudify-aws-plugin, cloudify-fabric-plugin
  Running setup.py install for cloudify-aws-plugin ... done
  Running setup.py install for cloudify-fabric-plugin ... done
Successfully installed boto-2.38.0 cloudify-aws-plugin-1.4.1 cloudify-fabric-plugin-1.4

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
2016-07-24 14:38:21 CFY <local> Starting 'install' workflow execution
.
.
.
2016-07-24 14:40:29 CFY <local> [active_host_53047.create] Task succeeded 'fabric_plugin.tasks.run_commands'
2016-07-24 14:40:29 CFY <local> [active_host_53047] Configuring node
2016-07-24 14:40:30 CFY <local> [active_host_53047] Starting node
2016-07-24 14:40:30 CFY <local> 'install' workflow execution succeeded

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

2016-07-24 14:40:37 CFY <local> Starting 'uninstall' workflow execution
2016-07-24 14:40:37 CFY <local> [active_host_53047] Stopping node
2016-07-24 14:40:38 CFY <local> [active_host_53047] Deleting node
2016-07-24 14:40:39 CFY <local> [my_host_05631] Stopping node
.
.
.
2016-07-24 14:41:17 LOG <local> [my_security_group_6736c.delete] INFO: Attempted to delete Security Group: sg-69faba0e.
2016-07-24 14:41:17 CFY <local> [my_security_group_6736c.delete] Task succeeded 'ec2.securitygroup.delete'
2016-07-24 14:41:17 CFY <local> 'uninstall' workflow execution succeeded

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


