---
uid: workflows section
title: Workflows
category: Blueprints
draft: false
weight: 1100
aliases: /blueprints/spec-workflows/
---

`workflows` define a set of tasks that can be executed on a node or a group of nodes, and the execution order of these tasks, serially or in parallel. A task may be an operation (implemented by a plugin), but it may also be other actions, including arbitrary code.

# Declaration

Mapping a workflow name to a workflow implementation in the blueprint is done in one of two ways:

* Simple mapping maps a workflow name to its implementation method that does not accept parameters.

{{< highlight  yaml >}}
workflows:
  workflow_1: my_workflow_plugin_name.my_workflow_module_name.my_first_workflow_method
  workflow_2: my_workflow_plugin_name.my_workflow_module_name.my_seconde_workflow_method
{{< /highlight >}}

* Mapping with parameters maps a workflow name to a workflow implementation that uses parameters. Workflow parameters are structured as a schema map, in which each entry specifies the parameter schema.

{{< highlight  yaml >}}
workflows:
  workflow_1:
    mapping: my_workflow_plugin_name.my_workflow_module_name.my_workflow_method
    parameters:
      my_mandatory_parameter:
        description: this parameter is mandatory, it has no default value
      my_optional_parameter:
        description: this parameters is optional, if omitted it will take the default value
        default: optional_parameter_default_value

{{< /highlight >}}

{{% note title="Note" %}}
You cannot set the “mapping” key without also setting “parameters”. If your workflow method does not accept parameters, use the “simple mapping” format described above.
{{% /note %}}


# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
mapping     | yes      | string      | A path to the method implementing this workflow. (In the “Simple mapping” format this value is set without explicitly using the “mapping” key.)
parameters  | no       | dict        | A map of parameters to be passed to the workflow implementation.
availability_rules | no | dict | Rules for deciding whether the workflow can be executed


## Parameter Schema

| Keyname     | Required | Type          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|-------------|----------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| description | no       | string        | An optional description for the input.                                                                                                                                                                                                                                                                                                                                                                                                                |
| type        | no       | string        | The required data type of the input. Not specifying a data type means the type can be anything, including a list, an array or a dictionary. Valid types: `string`, `integer`, `float`, `boolean`, `list`, `dict`, `regex`, `textarea`, `blueprint_id`, `deployment_id`, `secret_key`, `capability_value`, `scaling_group`, `node_id`, `node_type`, `node_instance` or a [custom data type]({{< relref "developer/blueprints/spec-data-types.md" >}}). |
| item_type   | no       | string        | Definition of items' type, only valid for `list` type, if none is provided the items' type can be anything.                                                                                                                                                                                                                                                                                                                                           |
| default     | no       | \<any\>       | An optional default value for the parameter, not available for `blueprint_id`, `deployment_id`, `secret_key`, `capability_value`, `scaling_group`, `node_id`, `node_type`, `node_instance` types. |
| constraints | no       | list of dicts | The constraints the parameter value must comply with. Read more details about the format and usage of the constraints in [the Constraints of input specification]({{< relref "developer/blueprints/spec-inputs.md" >}}#constraints).                                                                                                                                                                                                                  |

## Availability rules schema

Keyname | Required | Type | Description
------- | -------- | ---- | -----------
available | no | boolean | Enable or disable the workflow
node_instances_active | no | list of strings | Toggle the workflow depending on the state of deployment's node instances.  Possible values are `none` – no instance can be active, `partial` – at least one but not all of them should be active, `all` – all of them should be active.  If multiple values are provided, then the workflow is available if at least one of the values matches.  Active node instance is an instance with status set to `started`
node_types_required | no | list of strings | Toggle the workflow depending on the type of nodes used in a given deployment.  Make the workflow available if nodes derived from the required types are present.  If no node type availability rules are present, the workflow will be available (unless other rules fail to provide availability).  Even one matching node type is sufficient to pass this validation


## `deployment_id` Constraint Details

For workflow parameters of [types which require `deployment_id` constraint]({{< relref "developer/blueprints/spec-inputs.md" >}}#deployment_id-details),
the value of the `deployment_id` constraint might be omitted in the blueprint.  In that case
deployment's ID which the workflow is running on will be used.

For a `test_parameters` workflow run on deployment `dep1` and declared as follows:

{{< highlight  yaml >}}
workflows:
  test_parameters:
    mapping: script.py
    parameters:
      my_scaling_group:
        description: the scaling group to be used in a workflow
        type: scaling_group
        constraints:
          deployment_id: my_deployment
{{< /highlight >}}

scaling groups from deployment `my_deployment` will be the valid values for `my_scaling_group`
parameter.  If that constraint is omitted:

{{< highlight  yaml >}}
workflows:
  test_parameters:
    mapping: script.py
    parameters:
      my_scaling_group:
        description: the scaling group to be used in a workflow
        type: scaling_group
{{< /highlight >}}

the scaling groups from deployment `dep1` will be considered valid values for `my_scaling_group`
parameter.

<br>

# Example

In the following example, a workflow plugin named `maintenance_workflows_plugin` is defined, and two workflows refer to it.

The first workflow is named `test_all_connections_workflow`. It doesn't accept parameters and so it just maps the relevant implementation - method `validate_all_connections` in module `maintenance_workflows`.

The second workflow is named `test_connection_workflow`. It is mapped to the `validate_connection` method in module `maintenance_workflows`, and accepts three parameters - `protocol` (a mandatory parameter), `port` (an optional parameter, defaulting to 8080) and `connection_properties`. The last parameter has a default value of a map, consisting of 2 entries - `timeout_seconds` and `retry_attempts`.

The third workflow, `test_unavailable_workflow`, is unavailable, and cannot be executed. It might later be made available, by updating the deployment with an altered blueprint, which enables the workflow.

The fourth one, `test_node_types_availability_workflow`, is available only for the nodes which are
of `cloudify.nodes.ApplicationServer` or `cloudify.nodes.WebServer` types or their derivatives.

The last one, `test_parameters_workflow`, is an example of data-based types used as workflow
parameters.  Notice that even though the parameters' types require a "deployment_id" constraint, it
is sometimes omitted, in which case the `deployment_id` of the current deployment will be used.

{{< highlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_4

imports:
  - cloudify/types/types.yaml

plugins:
  maintenance_workflows_plugin:
    executor: central_deployment_agent
    source: http://example.com/url/to/plugin.zip

workflows:
  test_all_connections_workflow: maintenance_workflows_plugin.maintenance_workflows.validate_all_connections
  test_connection_workflow:
    mapping: maintenance_workflows_plugin.maintenance_workflows.validate_connection
    parameters:
      protocol:
        description: the protocol to use for connection
        type: string
      port:
        description: the port to use for connection
        default: 8080
      connection_properties:
        description: connection properties - timeout (in seconds) and retry attempts
        default:
          timeout_seconds: 60
          retry_attempts: 3
  test_unavailable_workflow:
    mapping: maintenance_workflows_plugin.maintenance_workflows.unavailable
    availability_rules:
      available: false
  test_node_types_availability_workflow:
    mapping: maintenance_workflows_plugin.maintenance_workflows.test_server
    availability_rules:
      node_types_required:
        - cloudify.nodes.ApplicationServer
        - cloudify.nodes.WebServer
  test_parameters_workflow:
    mapping: maintenance_workflows_plugin.maintenance_workflows.test_parameters
    parameters:
      scaling_group:
        type: scaling_group
        constraints:
          - name_pattern:
              contains: foobar
      node_id:
        type: node_id
        constraints:
          - name_pattern:
              starts_with: a
      node_type:
        type: node_type
        constraints:
          - deployment_id: a_different_deployment
{{< /highlight >}}


For further reading, refer to the [Workflows]({{< relref "working_with/workflows/_index.md" >}}) section.
