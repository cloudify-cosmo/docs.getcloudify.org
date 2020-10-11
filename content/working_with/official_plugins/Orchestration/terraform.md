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

  * Terraform 0.13.3, or higher, is required.
  * You must already have the Terraform binary on your Cloudify Manager. It should be executable by the `cfyuser` Linux user.

# Node Types

## **cloudify.nodes.terraform**

This is the base node type. The properties are also available in [cloudify.nodes.terraform.Module](#cloudify.nodes.terraform.Module).

**Properties**

  * `use_existing_resource`: a boolean to indicate if the user want use pre-exising installation of terraform , that will skip the installation , but will download the plugins that is specified in `plugins`
  * `installation_source`: Location to download the Terraform installation from. Ignored if 'use_existing' is true.
  * `plugins`: Plugins that you wish to install. A dictionary with, registered path as key and download URL as value.
  * `executable_path`: Where the Terraform binary is located in the Cloudify Manager. Default is null, Cloudify will manage the download of the Terraform binary to the deployment directory. If the default is changed, it is your responsibility to request that your Cloudify Administrator install binary is on the system, and that it is executable by the `cfyuser`.

**Deprecated properties:**

_These properties are no longer supported, however, the they still exist in the model._

  * `storage path`: Optional. A path on the Cloudify Manager to a directory where the plan files are located. The default behavior is to create temporary files.
  * `plugins dir`: Optional. A path on the Cloudify Manager to a directory where Terraform plugins are located.



# Example

In the following example we deploy a Terraform installation:

```yaml
  inputs:
    terraform_plugins:
      type: dict
      default:
        registry.terraform.io/hashicorp/template/2.1.2/linux_amd64: 'https://releases.hashicorp.com/terraform-provider-template/2.1.2/terraform-provider-template_2.1.2_linux_amd64.zip'
        registry.terraform.io/hashicorp/aws/3.9.0/linux_amd64: 'https://releases.hashicorp.com/terraform-provider-aws/3.8.0/terraform-provider-aws_3.8.0_linux_amd64.zip'
  node_templates:
    terraform:
      type: cloudify.nodes.terraform
      properties:
        resource_config:
          plugins: { get_input: terraform_plugins }
```


## **cloudify.nodes.terraform.Module**

This refers to a Terraform Plan module.

**Properties**

  * `resource_config`:
      * `source`: A zip file containing the Terraform plan. This may be a URL or a path relative to the blueprint.
      * `source_path`: The path where the Terraform directory's root may be found in the `source`, if it is not the root directory of `source`. For example, if the `tf` files are located at `foo/bar/main.tf` and `foo/bar/variables.tf`, this value should be `foo/bar`. 
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
        source: https://github.com/cloudify-community/blueprint-examples/archive/master.zip
        source_path: virtual-machine/resources/terraform/template
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
