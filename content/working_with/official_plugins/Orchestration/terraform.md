---
layout: bt_wiki
title: Terraform Plugin
category: Official Plugins
draft: false
weight: 100
aliases:
    - /plugins/terraform/
    - /developer/official_plugins/terraform/
---

The Terraform plugin enables you to maintain Terraform Plan state from Cloudify and also to use Terraform resources in your Cloudify blueprints.

# Requirements

You must already have the Terraform binary on your Cloudify Manager. It should be executable by the `cfyuser` Linux user.

# Node Types

## **cloudify.nodes.terraform**

This is the base node type. The properties are also available in [cloudify.nodes.terraform.Module](#cloudify.nodes.terraform.Module).

**Properties**

  * `use_existing_resource`: a boolean to indicate if the user want use pre-exising installation of terraform , that will skip the installation , but will download the plugins that is specified in `plugins`
  * `installation_source`: Location to download the Terraform installation from. Ignored if 'use_existing' is true.
  * `plugins`: List of plugins to download and install.
  * `executable_path`: Where the Terraform binary is located in the Cloudify Manager. Default is `/usr/bin/terraform`. It is your Cloudify Administrator's responsibility to ensure this binary is on the system and that it is executable by the `cfyuser`.
  * `storage path`: Optional. A path on the Cloudify Manager to a directory where the plan files are located. The default behavior is to create temporary files.
  * `plugins dir`: Optional. A path on the Cloudify Manager to a directory where Terraform plugins are located.


# Example

In the following example we deploy a Terraform installation:

```yaml
  inputs:
    terraform_installation_source:
      description: >
        Where to get Terraform from.
      type: string
      default: 'https://releases.hashicorp.com/terraform/0.12.21/terraform_0.12.21_linux_amd64.zip'
    terraform_plugins:
      type: list
      default:
        - 'https://releases.hashicorp.com/terraform-provider-template/2.1.2/terraform-provider-template_2.1.2_linux_amd64.zip'
        - 'https://releases.hashicorp.com/terraform-provider-aws/2.49.0/terraform-provider-aws_2.49.0_linux_amd64.zip'
    terraform_executable:
      type: string
      default: '/tmp/terraform/bin/terraform'
    terraform_plugins_dir:
      type: string
      default: '/tmp/terraform/plugins'
    terraform_storage_path:
      type: string
      default: '/tmp/terraform/storage'

  node_templates:
    terraform:
      type: cloudify.nodes.terraform
      properties:
        use_existing_resource: false
        installation_source: { get_input: terraform_installation_source }
        plugins: { get_input: terraform_plugins }
        executable_path: { get_input: terraform_executable }
        plugins_dir: { get_input: terraform_plugins_dir }
        storage_path: { get_input: terraform_storage_path }
```


## **cloudify.nodes.terraform.Module**

This refers to a Terraform Plan module.

**Properties**

  * `resource_config`:
      * `source`: A zip file containing the Terraform plan. This may be a URL or a path relative to the blueprint.
      * `backend`: A Terraform backend.
      * `variables`: A dictionary of variables.
      * `environment_variables`: A dictionary of environment variables.


**Operations**

  * `terraform.reload`: Reloads the Terraform template given the following inputs:
    * `source` : the new template location by default the `last_source_location` but it can be changed to be another location or even URL to a new template
    * `destroy_previous` : boolean if set to True it will trigger destroy for the previously created resources , if False it will keep them and maintain the state file , and terraform will calculate the changes needed to be applied to those already created resources
  * `terraform.refresh`: Refresh Terraform state file, if any changes were done outside of terraform so it will update the runtimes properties to match the real properties for the created resources


**Workflows**

  * `refresh_terraform_resources`: execute `terraform.refresh` operation on `terraform.Module` node instances
  * `reload_terraform_template`: executes `terraform.reload` on `terraform.Module` node instances

By default, the aforementioned workflows operate on all `terraform.Module` node instances in the current deployment.
It is possible to limit the scope by using the `node_ids` and `node_instance_ids` parameters, specifying lists of
node ID's and node instance ID's to operate on.

# Example

In the following example we deploy a Terraform plan:

```yaml
  cloud_resources:
    type: cloudify.nodes.terraform.Module
    properties:
      storage_path: { get_input: terraform_storage_path }
      resource_config:
        environment_variables:
          AWS_ACCESS_KEY_ID: { get_secret: aws_access_key_id }
          AWS_SECRET_ACCESS_KEY: { get_secret: aws_secret_access_key }
          AWS_DEFAULT_REGION: { get_input: ec2_region_name }
        variables:
          server_name: { get_input: server_name }
          aws_region: { get_input: ec2_region_name }
          keypair_name: { get_input: keypair_name }
          vpc_id: { get_input: vpc_id }
          admin_user: { get_input: agent_user }
          subnet_cidr: { get_input: subnet_cidr }
          agents_security_group_id: { get_input: agents_security_group_id }
        source: resources/template.zip
    relationships:
      - target: terraform
        type: cloudify.relationships.depends_on
```

To execute terraform reload operation:

```bash
cfy executions start reload_terraform_template -d {deployment_id} -p source=/tmp/aws-two-tier.zip
```

To execute refresh terraform resources workflow on node instances of a specific node template:

```bash
cfy executions start refresh_terraform_resources -d {deployment_id} -p node_ids=[cloud_resources]
```
