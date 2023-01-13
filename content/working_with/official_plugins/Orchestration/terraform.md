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

# Overview

The Terraform plugin enables you to do the following tasks from {{< param product_name >}} by using its node_types inside your blueprints:

1. Handle Terraform binary Installation/Uninstallation [if you are not using external system setup] along side its plugins.
1. Manage Terraform modules and sources lifecycle [ init, plan, apply, refresh, state, import, outputs, destroy ]
1. Supports running linters and security checks [ tfsec, tflint, terratag ]
1. Supports cost estimation for the source via [ infracost ]

and the plugin does the managment of the state by storing the state in runtime and a file inside the deployment directory.

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

### **Properties**

  * `terraform_config`: Configuration regarding installation of Terraform.
    * `executable_path`: Where the Terraform binary is located in the {{< param cfy_manager_name >}}. If using it, It is your {{< param product_name >}} Administrator's responsibility to ensure this binary is on the system and that it is executable by the `cfyuser`.
    **required:** false
  * `resource_config`:
    * `plugins`: List of plugins to download and install.
    * `use_existing_resource`: A boolean that indicates if the user want to use pre-existing installation of terraform , that will skip the installation , but will download the plugins that are specified under `plugins`. The default value is false.
    * `installation_source`: Location to download the Terraform installation from. Ignored if 'use_existing_resource' is true. The default value is: `https://releases.hashicorp.com/terraform/1.1.4/terraform_1.1.4_linux_amd64.zip`.

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

### **Properties**

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
    * `providers`: If providers are not defined in source, and you want to use specific providers, define that here. The default value is {}.
        * `filename`: **required:** false. Provider files. **provider.tf** by default.
        * `providers`: **required:** false. List of providers in a format:
        ```yaml
         providers:
           filename: providers.tf
           providers:
            - name: azurerm
              options:
                features: {}
            - name: aws
              options:
                region: us-east-1
        ```
        ...will be translated to:

        **providers.tf**
        ```terraform
          provider "azurerm" {
             features{}
          }

          provider "aws" {
             region = "us-east-1"
          }
        ```
    * `required_providers`: If required_providers are not defined in source, and you want to use specific versions, define that here. The default value is {}.
      * `filename`: **required:** false. Required provider files. **versions.tf.json** by default.
      * `required_providers`: **required:** false. Dictionary of provider versions in a format given below that is provided in JSON notation:
      ```yaml
        required_providers:
          filename: versions.tf.json
          required_providers:
            acme:
              source: "vancluever/acme"
              version: "2.8.0"
      ```
      ...will be translated to:

      ```json
        {
            "terraform": {
                "required_providers": {
                    "acme": {
                        "source": "vancluever/acme",
                        "version": "2.8.0"
                    }
                }
            }
        }

      ```
      which is an equivalent of hcl
      ```hcl
        terraform {
          required_providers {
            acme:
              source: "vancluever/acme"
              version: "2.8.0"
          }
        }
      ```
    * `variables`: A dictionary of variables.
    **required:** false.
    * `environment_variables`: A dictionary of environment variables.
    **required:** false.
    * `flags_override`: A list of flags override that will be appened to terraform commands The default value is []. example input would be [{'loglevel': 'debug'}] which translate to `--loglevel=debug`
    **required:** false.
    * `log_stdout`: A boolean if you wish to suppress stdout logging for apply and plan commands by setting it to false. The default value is true.
    * `tfvars`: The name of the .tfvars file, located in the source_path.
    **required:** false.
    * `store_output_secrets`: A dictionary of outputs that will be create_or_updated inside secert store.
    example format of input would be something like this
    ```yaml
    store_output_secrets:
      terraform_output_name: secrets_to_be_created_or_updated
    ```
    **required:** false.
    * `obfuscate_sensitive`: A boolean if you wish to hide senstive outputs logging by setting it to true. The default value is false.

  * `max_runtime_property_size`: The maximum terraform source size that you want us to store in the runtime properties. The default value is `1000000`.
  * `max_stored_filesize`: The maximum file size that you want us to store in the rest service. The default value is `1000000`.
  * `store_plugins_dir`: Whether to store terraform binary plugins. The default value is false.
  * `provider_upgrade`: boolean Whether to add "--upgrade" to init command. The default is false.
  * `general_executor_process`: A dict of additional keyword args to send the the general executor process argument. the defult value `{'max_sleep_time': 300}`.
  * `tflint_config`:
    * `installation_source`: The URL to download the tflint binary from, The default value is: `https://github.com/terraform-linters/tflint/releases/download/v0.34.1/tflint_linux_amd64.zip`.
    * `executable_path`: Where the tflint binary is located in the {{< param cfy_manager_name >}}. If using it, It is your {{< param product_name >}} Administrator's responsibility to ensure this binary is on the system and that it is executable by the `cfyuser`.
    * `config`: Configuration for terragrunt. A list of dicts, with keys, `type_name`, required, `option_name`, not required, and `option_value` required.  For example, this dict:

        ```yaml
          - type_name: plugin
            option_name: foo
            option_value:
              enabled: true
              version: "0.1.0"
              source: "github.com/org/tflint-ruleset-foo"
        ```
        ...will be translated to:

        ```hcl
          plugin "foo" {
              enabled = true
              version = "0.1.0"
              source = "github.com/org/tflint-ruleset-foo"
          }
        ```

    * `flags_override`: The plugin has its own internal logic for appending flags to the tflint command.
      However, if you wish to add or modify flags, configure here.
      For example, "{'loglevel': 'debug'}", becomes "--loglevel=debug".
      To skip errors and continue 'force' flag should be used.
    * `env`: Additional env vars for duration of tflint executions,
    * `enable`: boolean, In order for it to work, must mark as True.

    ```yaml
          tflint_config:
            config:
              - type_name: config
                option_value:
                  module: 'true'
              - type_name: plugin
                option_name: aws
                option_value:
                  enabled: 'false'
            flags_override:
              - loglevel: info
              - force
            enable: true
    ```
  * `tfsec_config`:
    * `installation_source`: The URL to download the tfsec binary from, The default value is: `https://github.com/aquasecurity/tfsec/releases/download/v1.1.3/tfsec-linux-amd64`.
    * `executable_path`: Where the tfsec binary is located in the {{< param cfy_manager_name >}}. If using it, It is your {{< param product_name >}} Administrator's responsibility to ensure this binary is on the system and that it is executable by the `cfyuser`.
    * `config`: tags, as valid JSON (NOT HCL)
    * `flags_override`: 'tfsec can by run with no arguments and will act on the current folder.
          For a richer experience, there are many additional command line arguments that you can make use of.
          For example: [ "debug", "run-statistics"] (without --).
          To continue even if issues found 'soft-fail' flag should be used.
          e.g 'https://aquasecurity.github.io/tfsec/v0.63.1/getting-started/usage/'
    * `enable`: boolean, In order for it to work, must mark as True.

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

  * `terratag_config`:
    * `installation_source`: The URL to download the terratag binary from, The default value is: `https://github.com/env0/terratag/releases/download/v0.1.35/terratag_0.1.35_linux_amd64.tar.gz`.
    * `executable_path`: Where the terratag binary is located in the {{< param cfy_manager_name >}}. If using it, It is your {{< param product_name >}} Administrator's responsibility to ensure this binary is on the system and that it is executable by the `cfyuser`.
    * `tags`: tags, as valid JSON (NOT HCL)
    * `flags_override`:
      * dir=<path> - defaults to '.'. Sets the terraform folder to tag .tf files in.
      * skipTerratagFiles=false - Dont skip processing *.terratag.tf files (when running terratag a second time for the same directory).
      * verbose=true - Turn on verbose logging.
      * rename=false - Instead of replacing files named <basename>.tf with <basename>.terratag.tf, keep the original filename.
      * filter=<regular expression> - defaults to .*. Only apply tags to the resource types matched by the regular expression.
    * `enable`: boolean, In order for it to work, must mark as True.

    ```yaml
    terratag_config:
      tags: {'some_tag' : 'some_value'}
      flags_override:
        - verbose: True
        - rename: False
        - filter: 'aws_vpc'
      enable: True
    ```

  * `infracost_config`:
    * `installation_source`: The URL to download the infracost binary from, The default value is: `https://github.com/infracost/infracost/releases/download/v0.10.8/infracost-linux-amd64.tar.gz`
    * `executable_path`: Where the infracost binary is located in the {{< param cfy_manager_name >}}. If using it, It is your {{< param product_name >}} Administrator's responsibility to ensure this binary is on the system and that it is executable by the `cfyuser`.
    * `api_key`: api key from Infracost, instructions how to retrieve it give in a [link](https://www.infracost.io/docs/)
    * `enable`: boolean, In order for it to work, must mark as True.
    **NOTE** it wouldn't be called unless the interface is specified or by calling the operation `terraform.infracost` or by executing the worklfow `run_infracost`

### OPA

OPA support was introduced in version 0.19.14 of the Terraform plugin.

The `terraform.opa` interface operation evaluates an [Open Policy Agent (OPA)](https://www.openpolicyagent.org/) decision against a Terraform plan. Calling this interface operation will initialize Terraform (if it has not already been initialized), generate a Terraform plan, and then evaluate the decision against the provided OPA policies.

The operation provides a thing wrapper around running `opa exec` against the Terraform plan in JSON format.

OPA is configured by setting the desired parameters in `cloudify.nodes.terraform.Module:properties.opa_config`:

* `installation_source` - Location to download the OPA binary from. Defaults to `https://github.com/open-policy-agent/opa/releases/download/v0.47.4/opa_linux_amd64_static`
* `executable_path` - Location of an existing OPA binary on the system. If used, the binary will not be downloaded from the `installation_source` and the existing binary will be used for policy evaluations.
* `config` - OPA configuration file to override any default OPA behavior.
* `policy_bundles` - A list of one or more zipped policy [bundles](https://www.openpolicyagent.org/docs/latest/management-bundles/) for use in the policy evaluation. Policy bundles can be local to the blueprint archive, or they can be downloaded from remote sources. The format for policy bundles is described below.
* `flags_override` - A list of flags to additionally pass to the OPA binary. The `opa exec` command runs with the `--bundle` and `--decision` flags by default, and overriding flags is not recommended.
* `enable` - A boolean to indicate whether or not OPA policy evaluation is enabled during normal Terraform operations, such as `terraform apply`. This is currently unused, as the OPA tasks are implemented outside of the normal Terraform workflows. This is reserved for future use when OPA is integrated as part of normal Terraform workflows.

A policy bundle is a ZIP archive that can be passed to the `--bundle` flag for `opa exec`. To create a policy bundle in the format required by Cloudify, simply zip up the contents of an OPA directory containing one or more Rego files. For example:

```bash
$ ls
main.rego  security_groups.rego

$ zip -r policy.zip *
  adding: main.rego (deflated 21%)
  adding: security_groups.rego (deflated 47%)
```

The `policy_bundles` parameter accepts a list of bundles in the same format used by the `source` parameter for the [Terraform module]({{< relref "working_with/official_plugins/Orchestration/terraform#cloudifynodesterraformmodule" >}}). Each policy bundle must have a `name`, which is used to name the directory on the Cloudify Manager when the bundle is extracted.

The example below shows a single policy bundle named `my-policy`. This bundle is located in `resources/policy.zip`, which is within the blueprint archive:
```yaml
  module:
    type: cloudify.nodes.terraform.Module
    properties:
      opa_config:
        policy_bundles:
          - name: my-policy
            location: resources/policy.zip
    relationships:
      - target: terraform
        type: cloudify.terraform.relationships.run_on_host
```

The `terraform.opa` operation also requires that the `decision` parameter be se. See the "Operations" section below for more information.

### **Operations**

  * `terraform.import_resource`: this operation is leveraging terraform import command -which can be used to import remote resources to your local state-. The following example can be used as a parameter file to the execute operation command.

    ```yaml
    operation: terraform.import_resource
    operation_kwargs:
        resource_address: "the address to import the resource to inside terraform module"
        resource_id: "resource-specific ID to identify that resource being imported"
    allow_kwargs_override: true
    ```
  For more information about the import command , you can refer to this documentation [link](https://developer.hashicorp.com/terraform/cli/commands/import)

  * `terraform.reload`: Reloads the Terraform template given the following inputs:
    * `source`: URL or path to a ZIP/tar.gz file, or a Git repository to obtain new module source from. If omitted, then the module is reloaded from its last location.
    * `source_path`: The path within the source property, where the terraform files may be found.
    * `destroy_previous`: Boolean. If set to True, it will trigger destroy for the previously created resources, if False it will keep them and maintain the state file; Terraform will calculate the changes needed to be applied to those already-created resources.
  * `terraform.plan`: Execute terraform plan given the source/source_path:
    * `source`: URL or path to a ZIP/tar.gz file, or a Git repository to obtain new module source from. If omitted, then the module is reloaded from its last location.
    * `source_path`: The path within the source property, where the terraform files may be found.
  * `terraform.refresh`: Refresh Terraform state file, if any changes were done outside of Terraform so it will update the runtime properties to match the real properties for the created resources under `state` runtime property.
  * `terraform.pull`: Refresh Terraform state file, if any changes were done outside of Terraform so it will update the runtime properties to match the real properties for the created resources under `state` runtime property.
    Moreover, If there are any drifts between the template and the current state it will be saved under the `drifts` runtime property.
  * `terraform.tfsec`: TFSec is a static analysis security scanner for your Terraform code. The following example can be used as a parameter file to the execute operation command.

    ```yaml
    operation: terraform.tfsec
    operation_kwargs:
     tfsec_config:
       config:
        exclude: ['aws-vpc-add-description-to-security-group-rule']
       flags_override: ['run-statistics']
    allow_kwargs_override: true
    ```
  * `terraform.tflint`: TFLint is a linter that checks for possible errors, best practices, etc in your terraform code.
The following example can be used as a parameter file to the execute operation command.

    ```yaml
    operation: terraform.tflint
    operation_kwargs:
        tflint_config:
            enable: true
            config:
            - type_name: config
              option_value:
                module: "true"
            - type_name: plugin
              option_name: aws
              option_value:
                enabled: "true"
    allow_kwargs_override: true
    ```
  * `terraform.terratag`: Terratag is a CLI tool allowing for tags or labels to be applied across an entire set of Terraform files. The following example can be used as a parameter file to the execute operation command.

    ```yaml
    operation: terraform.terratag
    operation_kwargs:
        terratag_config:
            tags: {"company": "cloudify_test"}
    allow_kwargs_override: true
    ```
  * `terraform.infracost`: Infracost is a CLI tool allowing for cost estimation. The following example can be used as a parameter file to the execute operation command.

    ```yaml
    operation: terraform.infracost
    operation_kwargs:
        infracost_config:
            api_key: "key_retrieved_from_infracost"
    allow_kwargs_override: true
    ```
Operation outputs are saved in `plain_text_infracost` and `infracost` runtime properties.
  * `terraform.opa`: Runs OPA policy evaluation. This operation will initialize Terraform (if it is not already initialized), generate a Terraform plan, and run OPA policy evaluation against it. You must specify the desired `decision` to evaluate. If no decision is specified, it will default to `terraform/deny`. The decision is passed to the `--decision` flag of the `opa exec` command.

    ```yaml
    opa:
      implementation: tf.cloudify_tf.tasks.evaluate_opa_policy
      inputs:
        # Note that opa_config can be omitted and it will default to the node property.
        opa_config: { get_property: [SELF, opa_config ] }
        decision: "terraform/deny"
    ```


### **Runtime Properties**

 * `state`: Saves the state of the resources created in the format { "resource_name" : <resource state> },
   <resource state> is the state of the resource that was pulled with the `terraform state pull` command.
 * `drifts`: Saves the drifts between the template and the current state in the format:
    { "resource_name" : <change-representation> }, <change-representation> format described [here](https://www.terraform.io/docs/internals/json-format.html#change-representation).
 * `is_drifted`: True if there are drifts between the template and the actual state, else False.
 * `terraform_source`: Base64 encoded representation of the zip containing the Terraform modules.

### Example

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

# **Relationships**

* `cloudify.terraform.relationships.run_on_host`: Executes `tf.cloudify_tf.tasks.set_directory_config` which connects `cloudify.nodes.terraform.Module` node to `cloudify.nodes.terraform` node(binary installation node). .
  It is required to use this relationship on every `cloudify.nodes.terraform.Module` node.

# Workflows


## refresh_terraform_resources

* Executes `terraform.refresh` operation on `terraform.Module` node instances.

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

* Executes `terraform.plan` on `terraform.Module` node instances.

The Terraform plan workflow enables to you run the Terraform plan command against your Terraform module and to store the results in the node instances' `plan` and `plain_text_plan` runtime properties.

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

* Executes `terraform.reload` on `terraform.Module` node instances.

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

## update_terraform_binary

* Executes delete and create operations respectively on `terraform` node instances.

The update_terraform_binary workflow executes delete and create operations respectively on the `cloudify.nodes.terraform` node instance.

  * `node_instance_ids`: The IDs of `cloudify.nodes.terraform` node_instances, which should execute delete then create run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `node_ids`: The IDs of `cloudify.nodes.terraform` nodes, which should execute delete then create run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `installation_source`: The URL to download the new binary from.

To execute update terraform binary workflow on node instances of a specific node template:

Example command:

```bash
[user@c540aa7d0efd /]# cfy executions start update_terraform_binary -d tf -p node_instance_ids=terraform_j2g1y2 -p installation_source='https://releases.hashicorp.com/terraform/1.3.4/terraform_1.3.4_linux_amd64.zip'
2021-10-10 16:24:32.278  CFY <tf> Starting 'update_terraform_binary' workflow execution
Executing workflow `update_terraform_binary` on deployment `tf` [timeout=900 seconds]
```


## import_terraform_resource

* Executes `terraform.import_resource` on `terraform.Module` node instances.

The import_terraform_resource workflow import the remote resources with new changes in `source` and/or `source_path`, or uses the original values if `source` or `source_path` are not provided.

  * `node_instance_ids`: The IDs of `cloudify.nodes.terraform.Module` node_instances, which should execute import run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `node_ids`: The IDs of `cloudify.nodes.terraform.Module` nodes, which should execute import run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `source`: URL or path to a ZIP/tar.gz file, or a Git repository to obtain new module source from. If omitted, then the module is reloaded from its last location.
  * `source_path`: The path within the source property, where the terraform files may be found.
  * `resource_address`: The address to import the resource to inside terraform module.
  * `resource_id`: resource-specific ID to identify that resource being imported.

To execute import terraform resource workflow on node instances of a specific node template:

Example command:

To execute terraform import operation:

```bash
[user@c540aa7d0efd /]# cfy executions start import_terraform_resource -d tf -p node_instance_ids=cloud_resources_j9l2y3 -p source_path=template/modules/private_vm -p resource_address=aws_instance.example_vm -p resource_id=i-0be712xxxxb437
Executing workflow `import_terraform_resource` on deployment `tf` [timeout=900 seconds]
2021-10-10 16:30:34.523  CFY <tf> Starting 'import_terraform_resource' workflow execution
```

## run_infracost

* Executes `terraform.infracost` on `terraform.Module` node instances.

The run_infracost workflow updates the remote state with new changes in `source` and/or `source_path`, or attempts resets the remote state to the original state if `source` or `source_path` are not provided.

  * `node_instance_ids`: The IDs of `cloudify.nodes.terraform.Module` node_instances, which should execute infracost run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `node_ids`: The IDs of `cloudify.nodes.terraform.Module` nodes, which should execute infracost run on them. (One of `node_instance_ids` or `node_ids` should be provided.)
  * `source`: URL or path to a ZIP/tar.gz file, or a Git repository to obtain new module source from. If omitted, then the module is reloaded from its last location.
  * `source_path`: The path within the source property, where the terraform files may be found.
  * `infracost_config`:
    * `api_key`: api key from Infracost, instructions how to retrieve it give in a [link](https://www.infracost.io/docs/), it could be skipped and node config is used instead

Example command:

To execute infracost on Modules:

```bash
[user@c540aa7d0efd /]# cfy executions start run_infracost -d tf
Executing workflow `run_infracost` on deployment `tf` [timeout=900 seconds]
2021-10-10 16:30:34.523  CFY <tf> Starting 'run_infracost' workflow execution
```

Workflow outputs are saved in `plain_text_infracost` and `infracost` runtime properties.

# Terraform Outputs

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


# **Notes**

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
