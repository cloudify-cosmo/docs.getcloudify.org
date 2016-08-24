---

title: AWS Bootstrap



weight: 2500

---

{{% gsSummary %}}{{% /gsSummary %}}

{{% gsNote title="Disclaimer" %}}All values in the AWS inputs will vary by account and tenancy. While many values will work for a majority of users, there are exceptions to every case.{{% /gsNote %}}

# Overview

To bootstrap a manager in AWS, you will need the [Cloudify Manager Blueprints repository](https://github.com/cloudify-cosmo/cloudify-manager-blueprints). This document refers specifically to the aws-ec2-manager-blueprint.yaml and the aws-ec2-manager-blueprint-inputs.yaml files.

## Environment Specific Inputs

- Credentials and identification in order to connect to AWS
    - `aws_access_key_id` No default. Login to your aws [console](https://console.aws.amazon.com/) and navigate to (credential report)[https://console.aws.amazon.com/iam/home?region=us-east-1#credential_report]. See your account administrator if you don't have permission to download the report.
    - `aws_secret_access_key` No default. 
    - `ec2_region_name` Default: us-east-1. This is the region in AWS that you will create resources in when you run the manager blueprint.


- Resources
    - `image_id` A CentOS Linux 7 x86_64 HVM EBS image to install the Cloudify manager components on.
    - `instance_type` An instance type for the manager server. Minimum of 4 GB. Recommended 8 GB.
    - `use_existing_manager_group` Whether to use an existing security group (true) or create a new one (false).
    - `use_existing_agent_group` Whether to use an existing security group (true) or create a new one (false).
    - `use_existing_manager_keypair` Whether to use an existing key (true) or create a new one (false).
    - `use_existing_agent_keypair` Whether to use an existing key (true) or create a new one (false).
    - `manager_keypair_name`
    - `agent_keypair_name`
    - `ssh_key_filename` Either where to save the key file, or where it already exists.
    - `agent_private_key_path` Either where to save the key file, or where it already exists.
    - `manager_security_group_name`
    - `agent_security_group_name`
    - `ssh_user` The user that the Cloudify Fabric plugin will use to install the manager components over SSH on the manager server.
    - `agents_user` The user that the manager will use to communicate with the agent hosts over SSH.


## Provisioned Resources

These resources will be provisioned in your AWS account.

- Cloudify manager virtual machine
- Manager security group
- Agent security group
- Manager key pair
- Agent key pair
- The following ports will be opened on the Cloudify manager:
    - 80
    - 443
    - 22
    - 8101 (rest service)
    - 5672 (AMQP)
    - 53229 (file server)

{{% gsNote title="Note" %}} Ports 8101, 5672 and 53229 will only be opened for connections within the management security group. {{% /gsNote %}}
