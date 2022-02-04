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

* Python versions:
  * 2.7.x/3.6.x

# Node Types

## **cloudify.nodes.terraform**

This is the base node type, which represents a Terraform installation.

**Properties**

  * `terraform_config`: Configuration regarding installation of Terraform.
    * `executable_path`: Where the Terraform binary is located in the Cloudify Manager. If using it, It is your Cloudify Administrator's responsibility to ensure this binary is on the system and that it is executable by the `cfyuser`.
        
        **required:** false

  * `resource_config`:
    * `plugins`: List of plugins to download and install.
    * `use_existing_resource`: A boolean that indicates if the user want to use pre-existing installation of terraform , that will skip the installation , but will download the plugins that are specified under `plugins`. The default value is false. 
    * `installation_source`: Location to download the Terraform installation from. Ignored if 'use_existing_resource' is true. The default value is: `https://releases.hashicorp.com/terraform/0.13.3/terraform_0.13.3_linux_amd64.zip`. 

# Example

In the following example, we deploy a Terraform installation, the Terraform executable saved under the deployment directory:

```yaml
  inputs:
    
    terraform_plugins:
      default:
        registry.terraform.io/hashicorp/azurerm/2.52.0/linux_amd64/: 'https://releases.hashicorp.com/terraform-provider-azurerm/2.52.0/terraform-provider-azurerm_2.52.0_linux_amd64.zip'

  node_templates:
    terraform:
      type: cloudify.nodes.terraform
      properties:
        resource_config:
          plugins: { get_input: terraform_plugins }
```


## **cloudify.nodes.terraform.Module**

This refers to a Terraform module.

**Properties**

  * `resource_config`:
    * `source`:
        * `location`: Path or URL to the ZIP file containing the Terraform project. If this is a path, then it must be relative to the blueprint's root.
            
            **required:** true.
        
        * `username`: Username to authenticate with. 
            
            **required:** false.
        
        * `password`: Password to authenticate with. 
            
            **required:** false.
        
    * `source_path`: The path within the source property, where the terraform files may be found. The default value is ''. 
    * `backend`: If a backend is not defined in source, and you want to use a specific backend, define that here. The default value is {}.
        * `name`: Name of the backend.
          
            **required:** false.
          
        * `options`: Dictionary of key/values.
          
            **required:** false.
        
    * `variables`: A dictionary of variables.
      
        **required:** false.
      
    * `environment_variables`: A dictionary of environment variables.
      
        **required:** false.



**Operations**

  * `terraform.reload`: Reloads the Terraform template given the following inputs:
    * `source`: URL or path to a ZIP/tar.gz file, or a Git repository to obtain new module source from. If omitted, then the module is reloaded from its last location.
    * `source_path`: The path within the source property, where the terraform files may be found.  
    * `destroy_previous`: Boolean. If set to True, it will trigger destroy for the previously created resources, if False it will keep them and maintain the state file; Terraform will calculate the changes needed to be applied to those already-created resources.
  * `terraform.refresh`: Refresh Terraform state file, if any changes were done outside of Terraform so it will update the runtime properties to match the real properties for the created resources under `state` runtime property.
    Moreover, If there are any drifts between the template and the current state it will be saved under the `drifts` runtime property.

**Runtime Properties**:

 * `state`: Saves the state of the resources created in the format { "resource_name" : <resource state> }, 
   <resource state> is the state of the resource that was pulled with the `terraform state pull` command.
 * `drifts`: Saves the drifts between the template and the current state in the format:
    { "resource_name" : <change-representation> }, <change-representation> format described [here](https://www.terraform.io/docs/internals/json-format.html#change-representation).
 * `is_drifted`: True if there are drifts between the template and the actual state, else False.
 * `terraform_source`: Base64 encoded representation of the zip containing the Terraform modules.

**Workflows**

  * `refresh_terraform_resources`: Executes `terraform.refresh` operation on `terraform.Module` node instances.
  * `reload_terraform_template`: Executes `terraform.reload` on `terraform.Module` node instances.

**Notes:**

* By default, the aforementioned workflows operate on all `terraform.Module` node instances in the current deployment.
It is possible to limit the scope by using the `node_ids` and `node_instance_ids` parameters, specifying lists of
node ID's and node instance ID's to operate on.
* Since version 0.16.0, Terraform plugin introduce pull operation for `terraform.Module` node to support pull workflow.
For  Cloudify versions that don't support `pull` workflow (5.2 and older), call `pull` operation with execute operation workflow.
Pull operation performs exact logic as `terraform.refresh` operation.

**Relationships:**

* `cloudify.terraform.relationships.run_on_host`: Executes `tf.cloudify_tf.tasks.set_directory_config` which connects `cloudify.nodes.terraform.Module` node to `cloudify.nodes.terraform` node(binary installation node). . 
  It is required to use this relationship on every `cloudify.nodes.terraform.Module` node.

# Example

In the following example we deploy a Terraform plan:

```yaml
  cloud_resources:
    type: cloudify.nodes.terraform.Module
    properties:
      resource_config:
        source:
          location: https://github.com/cloudify-community/blueprint-examples/archive/master.zip
        source_path: virtual-machine/resources/terraform/template
        variables:
          access_key: { get_secret: aws_access_key_id }
          secret_key: { get_secret: aws_secret_access_key }
          aws_region: { get_input: aws_region_name }
          aws_zone: { get_input: aws_zone_name }
          admin_user: { get_input: agent_user }
          admin_key_public: { get_attribute: [agent_key, public_key_export] }
    relationships:
      - target: terraform
        type: cloudify.terraform.relationships.run_on_host
```

To execute terraform reload operation:

```bash
cfy executions start reload_terraform_template -d {deployment_id} -p source=/tmp/aws-two-tier.zip
```

To execute refresh terraform resources workflow on node instances of a specific node template:

```bash
cfy executions start refresh_terraform_resources -d {deployment_id} -p node_ids=[cloud_resources]
```
