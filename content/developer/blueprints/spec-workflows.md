---
layout: bt_wiki
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


## Parameter Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | string      | An optional description for the input.
type        | no       | string      | The required data type of the input. If you do not specify a data type, the type can be anything. Valid types: `string`, `integer`, `float`, `boolean`, `list`, `dict`, `regex` or a [custom data type]({{< relref "developer/blueprints/spec-data-types.md" >}}).
default     | no       | \<any\>     | An optional default value for the input.

<br>

# Example

In the following example, a workflow plugin named `maintenance_workflows_plugin` is defined, and two workflows refer to it.

The first workflow is named `test_all_connections_workflow`. It does't accept parameters and so it just maps the relevant implementation - method `validate_all_connections` in module `maintenance_workflows`.

The second workflow is named `test_connection_workflow`. It is mapped to the `validate_connection` method in module `maintenance_workflows`, and accpets three parameters - `protocol` (a mandatory parameter), `port` (an optional parameter, defaulting to 8080) and `connection_properties`. The last parameter has a default value of a map, consisting of 2 entries - `timeout_seconds` and `retry_attempts`.

{{< highlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

imports:
  - http://www.getcloudify.org/spec/cloudify/3.2/types.yaml


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
{{< /highlight >}}


For further reading, refer to the [Workflows]({{< relref "working_with/workflows/_index.md" >}}) section.