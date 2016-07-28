---
layout: bt_wiki
title: Configuring a server remotely
category: User Guide
draft: false
weight: 110

---

The purpose of this guide is get you a pre-configured server ready from scratch on AWS.

You are now ready to initialize a VM on AWS. Mange and configure it using Cloudify<br>
Cloudify make it very simple using [fabric](http://www.fabfile.org/) 

## Prerequisites

* Install Cloudify on your machine [Overview Page](http://stage-docs.getcloudify.org/howto/user_guide/Overview/)

* AWS account & credentials.<be>Same as in the basic [Starting an Instance in AWS](http://stage-docs.getcloudify.org/howto/user_guide/aws_vm/)

# Blueprint Source

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

  my_security_group_id:
    description: Security name created by Cloudify
    type: string
    default: ''

  keypair_name:
    description: Keypair name created by Cloudify in AWS
    type: string
    default: my_keypair

  ssh_key_filename:
    description: Keypair local file
    type: string
    default: ~/.ssh/my_keypair.pem

  my_server_id:
    description: instance id in AWS
    type: string
    default: ''

  my_server_ssh_user:
    description: instance user to connect with
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
    # Set the sceme to use, based on Cloudify cloudify.aws.nodes.Instance type
    type: cloudify.aws.nodes.Instance
    capabilities:
      # Set the amount of instances you want
      scalable:
        properties:
          default_instances: 1
    # Set of properties to define your template
    properties:
      aws_config: *AWS_CONFIG
      resource_id: { get_input: my_server_id }
      install_agent: false
      image_id: { get_input: aws_server_image_id }
      instance_type: m3.medium
    relationships:
    # Position the resource in Cloudify hierarchy
      - target: my_keypair
        type: cloudify.aws.relationships.instance_connected_to_keypair
      - target: my_security_group
        type: cloudify.aws.relationships.instance_connected_to_security_group

  active_host:
    # Once the server is ready, you can run commands and scripts on it
    type: cloudify.nodes.Root
    # procedures will run on VM depending on state
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
    # Position the resource in Cloudify hierarchy
      - target: my_host
        type: cloudify.relationships.contained_in

  my_keypair:
    # Resource needed to connect to VM
    type: cloudify.aws.nodes.KeyPair
    properties:
      aws_config: *AWS_CONFIG
      resource_id: { get_input: keypair_name }
      private_key_path: { get_input: ssh_key_filename }

  my_security_group:
    # Creates the Security group for the VM
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

  my_server:
    description: My server running on AWS
    value:
      active_server_ip: { get_attribute: [ my_host, public_ip_address ] }
      keypair_path: { get_property: [ my_keypair, private_key_path ] }
```

## Blueprints Breakdown

This blueprint deploys a VM in AWS.<br>Once the VM is running and can recieve SSH connection uhe `dsl_definitions` object called `fabric_env` is used to provide the information needed to connect to the server to run the command using fabric.<br>A set of procedures are set in the `interfaces` section and will be excuted based on the `relationships` (once a server is ready)

Once the workflow is complete you can fetch the deployments outputs to learn the details of your instances.

&nbsp;
# Getting everything to work

Make your changes to the blueprint and run the following commands from the blueprints directory.

## Step-by-step commands to run the blueprint

* Make sure you have all the required plugins installed on your machine.<br>For more information GOTO:[CLI Guide](http://docs.getcloudify.org/3.4.0/cli/local/#install-plugins)

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

{{% gsNote title="Install command" %}}
This action is the sum of several steps (uploading blueprint, creating deployment and runing workflow).
{{< /gsNote >}}

&nbsp;
#### Outputs and uninstall

To retreave the outputs of the deployment or uninstalling your deployment follow to final stages of the [first guide](http://stage-docs.getcloudify.org/howto/user_guide/aws_vm/#step-by-step-commands-to-run-the-blueprint)


# What's Next

...