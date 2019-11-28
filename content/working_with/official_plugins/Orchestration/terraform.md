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

This is the base node type. The properties are also avaiulable in [cloudify.nodes.terraform.Module](#cloudify.nodes.terraform.Module).

**Properties**

  * `executable_path`: Where the Terraform binary is located in the Cloudify Manager. Default is `/usr/bin/terraform`. It is your Cloudify Administrator's responsibility to ensure this binary is on the system and that it is executable by the `cfyuser`.
  * `storage path`: Optional. A path on the Cloudify Manager to a directory where the plan files are located. The default behavior is to create temporary files.
  * `plugins dir`: Optional. A path on the Cloudify Manager to a directory where Terraform plugins are located.

## **cloudify.nodes.terraform.Module**

This refers to a Terraform Plan module.

**Properties**

  * `resource_config`:
      * `sourece`: A zip file containing the Terraform plan. This may be a URL or a path relative to the blueprint.
      * `backend`: A Terraform backend.
      * `variables`: A dictionary of variables.
      * `environment_variables`: A dictionary of environment variables.

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
```
