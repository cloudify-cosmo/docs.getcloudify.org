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

The Terraform plugin enables you to maintain Terraform Plan state from {{< param product_name >}} and also to use Terraform resources in your {{< param product_name >}} blueprints.

# Requirements

* Python versions:
  * 2.7.x/3.6.x
* Terraform versions:
  * 0.13.x
  * 0.14.x
  * 0.15.x (Except for version 0.15.0)
  * 1.0.x
  
# Node Types

## **cloudify.nodes.terraform**

This is the base node type, which represents a Terraform installation.

**Properties**

  * `terraform_config`: Configuration regarding installation of Terraform.
    * `executable_path`: Where the Terraform binary is located in the {{< param cfy_manager_name >}}. If using it, It is your {{< param product_name >}} Administrator's responsibility to ensure this binary is on the system and that it is executable by the `cfyuser`.
        
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
        * `location`: A path, or the URL of a ZIP or Git repository. If this is a path, then it must be relative to the blueprint's root.
            
            **required:** true.
        
        * `username`: If location is a URL for downloading a zip or a git, the username to authenticate with basic auth.
            
            **required:** false.
        
        * `password`: If location is a URL for downloading a zip or a git, the password to authenticate with basic auth. 
            
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

    * `tfvars`: The name of the .tfvars file, located in the source_path.

        **required:** false.

  * tflint_config: Configure the usage of TFLint. The configuration is validated during cloudify.interfaces.lifecycle.create. TFlint is actually executed on the module in cloudify.interfaces.lifecycle.configure before apply. Skip TFLint by running cloudify.interfaces.lifecycle.configure with the force parameter.
    * installation_source: The URL to download the tflint binary from, e.g. 'https://github.com/terraform-linters/tflint/releases/download/v0.34.1/tflint_linux_amd64.zip'.
    * executable_path:  If the binary is located on the file system, this is the path on the file system, e.g. /usr/local/bin/tflint. Not that the default is empty and will be populated automatically when downloaded.
    * config: Configuration for terragrunt. A list of dicts, with keys, `type_name`, required, `option_name`, not required, and `option_value` required.  For example, this dict:

        ```yaml
          - type_name: plugin
            option_name: foo
            option_value:
              enabled: true
              version: "0.1.0"
              source: "github.com/org/tflint-ruleset-foo"
        ```
        ...will be translated to:

        ```
          plugin "foo" {
              enabled = true
              version = "0.1.0"
              source = "github.com/org/tflint-ruleset-foo"
          }
        ```

    * flags_override: The plugin has its own internal logic for appending flags to the tflint command.  However, if you wish to add or modify flags, configure here.  For example, "{'loglevel': 'debug'}", becomes "--loglevel=debug".
    * env: Additional env vars for duration of tflint executions,
    * enable: boolean, In order for it to work, must mark True.
    
  * tfsec_config:  tfsec is a static analysis security scanner for your Terraform code.
    * installation_source: The URL to download the tfsec binary from, e.g. 'https://github.com/aquasecurity/tfsec/releases/download/v1.1.3/tfsec-linux-amd64'.
    * executable_path: If the binary is already located on your system (you installed it manually), this is the path on the file system, e.g. /usr/local/bin/tfsec.
    * config: tags, as valid JSON (NOT HCL)
    * flags_override: 'tfsec can by run with no arguments and will act on the current folder.
          For a richer experience, there are many additional command line arguments that you can make use of.
          For example: [ "debug", "run-statistics"] (without --).
          e.g 'https://aquasecurity.github.io/tfsec/v1.2.1/getting-started/usage/'
    * enable: boolean, In order for it to work, must mark True.

    config.yml

    ```yaml      
    tfsec_config:
        config:
            exclude: 
              - 'aws-vpc-add-description-to-security-group-rule'
              - 'aws-vpc-no-public-egress-sgr' 
              - 'aws-vpc-no-public-ingress-sgr'
        flags_override: []
        enable: True
    ```
     or config.json:

    ```yaml      
    tfsec_config:
        config: { 
                    "exclude" : 
                    ['aws-vpc-add-description-to-security-group-rule','aws-vpc-no-public-egress-sgr','aws-vpc-no-public-ingress-sgr']
                }
        flags_override: []
        enable: True
    ```
  * terratag_config: 
    * installation_source: The URL to download the terratag binary from, e.g. 'https://github.com/env0/terratag/releases/download/v0.1.35/terratag_0.1.35_linux_amd64.tar.gz'.
    * executable_path: If the binary is already located on your system (you installed it manually), this is the path on the file system, e.g. /usr/local/bin/terratag.
    * tags: tags, as valid JSON (NOT HCL)
    * flags_override: 
      * dir=<path> - defaults to '.'. Sets the terraform folder to tag .tf files in.
      * skipTerratagFiles=false - Dont skip processing *.terratag.tf files (when running terratag a second time for the same directory).
      * verbose=true - Turn on verbose logging.
      * rename=false - Instead of replacing files named <basename>.tf with <basename>.terratag.tf, keep the original filename.
      * filter=<regular expression> - defaults to .*. Only apply tags to the resource types matched by the regular expression.
    * enable: boolean, In order for it to work, must mark True.

    ```yaml
    terratag_config:
      tags: {'some_tag' : 'some_value'}
      flags_override: 
        - verbose: True
        - rename: False
        - filter: 'aws_vpc'
      enable: True
    ```
**Operations**

  * `terraform.reload`: Reloads the Terraform template given the following inputs:
    * `source`: URL or path to a ZIP/tar.gz file, or a Git repository to obtain new module source from. If omitted, then the module is reloaded from its last location.
    * `source_path`: The path within the source property, where the terraform files may be found.  
    * `destroy_previous`: Boolean. If set to True, it will trigger destroy for the previously created resources, if False it will keep them and maintain the state file; Terraform will calculate the changes needed to be applied to those already-created resources.
  * `terraform.refresh`: Refresh Terraform state file, if any changes were done outside of Terraform so it will update the runtime properties to match the real properties for the created resources under `state` runtime property.
    Moreover, If there are any drifts between the template and the current state it will be saved under the `drifts` runtime property.
  * `terraform.tfsec`:   tfsec is a static analysis security scanner for your Terraform code. For example
    ```yaml
    operation: terraform.tfsec
    operation_kwargs:
     tfsec_config:
       config:
        exclude: ['aws-vpc-add-description-to-security-group-rule']
       flags_override: ['run-statistics']
    allow_kwargs_override: true
    ```

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
  * `terraform_plan`: Executes `terraform.plan` on `terraform.Module` node instances.

**Notes:**

* By default, the aforementioned workflows operate on all `terraform.Module` node instances in the current deployment.
It is possible to limit the scope by using the `node_ids` and `node_instance_ids` parameters, specifying lists of
node ID's and node instance ID's to operate on.
* Since version 0.16.0, Terraform plugin introduce pull operation for `terraform.Module` node to support pull workflow.
For  {{< param product_name >}} versions that don't support `pull` workflow (5.2 and older), call `pull` operation with execute operation workflow.
Pull operation performs exact logic as `terraform.refresh` operation.
* Cloudify 6.3 introduces the validation interface `cloudify.interfaces.validation.check_status`. 
For Terraform modules, this operation checks if the resources in the module exist or not. 
The plugin executes `terraform plan` to gather the list of resources of the current configuration.
It then calls `terraform refresh` in order to pull the remote state. 
Finally, it executes `terraform show state` for each resource. 
An "OK" return value indicates that all resources exist. A "not OK" value indicates that the resource does not exist.

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
      tflint_config:
        installation_source: https://github.com/terraform-linters/tflint/releases/download/v0.34.1/tflint_linux_amd64.zip
        config:
          - type_name: config
            option_value:
              module: "true"
          - type_name: plugin
            option_name: aws
            option_value:
              enabled: "true"
          - type_name: rule
            option_name: terraform_unused_declarations
            option_value:
              enabled: "true"
    relationships:
      - target: terraform
        type: cloudify.terraform.relationships.run_on_host
```

# Workflows

## refresh_terraform_resources

The refresh_terraform_resources workflow pulls the remote state and updates the `cloudify.nodes.terraform.Module` node instance `resources` runtime property with the remote state.

  * `node_instance_ids`: The IDs of `cloudify.nodes.terraform.Module` node_instances, which should have refresh run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `node_ids`: The IDs of `cloudify.nodes.terraform.Module` nodes, which should have refresh run on them. (One of `node_instance_ids` or `node_ids` should be provided.)

To execute refresh terraform resources workflow on node instances of a specific node template:

Example command:

```bash
[user@c540aa7d0efd /]# cfy executions start refresh_terraform_resources -d tf -p node_instance_ids=cloud_resources_j9l2y3
2021-10-10 16:24:32.278  CFY <tf> Starting 'refresh_terraform_resources' workflow execution
Executing workflow `refresh_terraform_resources` on deployment `tf` [timeout=900 seconds]
```

## terraform_plan

The Terraform plan workflow enables to you run the Terraform plan command against your Terraform module and to store the results in the node instances' `plan` runtime property.

__NOTE: Remember that if your Terraform module depends on runtime data, then that data must exist. For example, if it requires a zip file created by a different node template, then the Terraform plan cannot run unless the zip node has already been installed. For this reason, the terraform_plan workflow is executed primarily for day two operations (after install).__

**Parameters**

  * `node_instance_ids`: The IDs of `cloudify.nodes.terraform.Module` node_instances, which should have plan run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `node_ids`: The IDs of `cloudify.nodes.terraform.Module` nodes, which should have plan run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `source`: URL or path to a ZIP/tar.gz file, or a Git repository to obtain new module source from. If omitted, then the module is reloaded from its last location. This is useful if the source contains changes that will impact the plan.
  * `source_path`: The path within the source property, where the terraform files may be found.  This is useful if the source path contains changes that will impact the plan.

Example command:

```bash
# list the node instances in a deployment:
[user@c540aa7d0efd /]# cfy node-inst list -d tf
Listing instances for deployment tf...

Node-instances:
+------------------------+---------------+---------+-----------------+---------+------------+----------------+------------+
|           id           | deployment_id | host_id |     node_id     |  state  | visibility |  tenant_name   | created_by |
+------------------------+---------------+---------+-----------------+---------+------------+----------------+------------+
|    agent_key_cp18tq    |       tf      |         |    agent_key    | started |   tenant   | default_tenant |   admin    |
| cloud_resources_j9l2y3 |       tf      |         | cloud_resources | started |   tenant   | default_tenant |   admin    |
|    terraform_p4e4zy    |       tf      |         |    terraform    | started |   tenant   | default_tenant |   admin    |
+------------------------+---------------+---------+-----------------+---------+------------+----------------+------------+


# Execute the workflow for the cloud resources node instance:
[user@c540aa7d0efd /]# cfy exec start terraform_plan -d tf -p node_instance_ids=cloud_resources_j9l2y3
Executing workflow `terraform_plan` on deployment `tf` [timeout=900 seconds]
2021-10-10 16:18:30.155  CFY <tf> Starting 'terraform_plan' workflow execution...


# Execute the workflow for a new source path (different module in the same zip.
[user@c540aa7d0efd /]# cfy exec start terraform_plan -d tf -p node_instance_ids=cloud_resources_j9l2y3 -p source_path=template/modules/private_vm
Executing workflow `terraform_plan` on deployment `tf` [timeout=900 seconds]
2021-10-10 16:21:03.689  CFY <tf> Starting 'terraform_plan' workflow execution
```


## reload_terraform_template

The reload_terraform_template workflow updates the remote state with new changes in `source` and/or `source_path`, or attempts resets the remote state to the original state if `source` or `source_path` are not provided.

  * `node_instance_ids`: The IDs of `cloudify.nodes.terraform.Module` node_instances, which should have reload run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `node_ids`: The IDs of `cloudify.nodes.terraform.Module` nodes, which should have reload run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `source`: URL or path to a ZIP/tar.gz file, or a Git repository to obtain new module source from. If omitted, then the module is reloaded from its last location.
  * `source_path`: The path within the source property, where the terraform files may be found.

To execute refresh terraform resources workflow on node instances of a specific node template:

Example command:

To execute terraform reload operation:

```bash
[user@c540aa7d0efd /]# cfy executions start reload_terraform_template -d tf -p node_instance_ids=cloud_resources_j9l2y3 -p source_path=template/modules/private_vm
Executing workflow `reload_terraform_template` on deployment `tf` [timeout=900 seconds]
2021-10-10 16:30:34.523  CFY <tf> Starting 'reload_terraform_template' workflow execution
```

## Terraform Outputs

You can expose outputs from your Terraform template to the node instance runtime properties.

For example, you can expose a simple message by adding the outputs block to your main.tf:

```
output "foo" {
  value = "bar"
}
```

You can also expose meaningful information like IP addresses, Subnets, and ports.

```
output "ip" {
  value = aws_instance.example_vm.id
```

This information will be stored during the install workflow, or the reload_terraform_template workflow.

```
[user@cloudify-manager ~]# cfy node-instances get cloud_resources_02mhg1 --json | jq -r '.runtime_properties.outputs'
{
  "foo": {
    "sensitive": false,
    "type": "string",
    "value": "bar"
  }
}
```

You can then use these outputs in blueprint, for example as deployment capabilities:

```yaml
capabilities:
  ip:
    value: { get_attribute: [ cloud_resources , outputs , ip , value ] }
```

__NOTE: You must expose the output in the main terraform file in the source_path provided in your template or in your reload_terraform_template workflow parameters.__

