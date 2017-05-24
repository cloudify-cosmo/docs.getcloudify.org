---
layout: bt_wiki
uid: workflows section
title: Workflows
category: Blueprints
draft: false
weight: 1100

---

`workflows` define a set of tasks that can be executed on a node or a group of nodes, and the execution order of these tasks, serially or in parallel. A task may be an operation (implemented by a plugin), but it may also be other actions, including arbitrary code.

# Declaration

Mapping a workflow name to a workflow implementation in the blueprint is done in one of two ways:

* Simple mapping - maps a workflow name to its implementating method, which doesn't accept parameters.

{{< gsHighlight  yaml >}}
workflows:
  workflow_1: my_workflow_plugin_name.my_workflow_module_name.my_first_workflow_method
  workflow_2: my_workflow_plugin_name.my_workflow_module_name.my_seconde_workflow_method
{{< /gsHighlight >}}

* Mapping with parameters - maps a workflow name to a workflow implementation that uses parameters. Workflow parameters are structured as a schema map, where each entry specifies the parameter schema.

{{< gsHighlight  yaml >}}
workflows:
  workflow_1:
    mapping: my_workflow_plugin_name.my_workflow_module_name.my_workflow_method
    parameters:
      my_mandatory_parameter:
        description: this parameter is mandatory, it has no default value
      my_optional_parameter:
        description: this parameters is optional, if omitted it will take the default value
        default: optional_parameter_default_value

{{< /gsHighlight >}}

{{% gsNote title="Note" %}}
It is currently not allowed to set the “mapping” key without setting “parameters” as well. If your workflow method doesn’t accept parameters - use the “simple mapping” format (described above).
{{% /gsNote %}}


# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
mapping     | yes      | string      | A path to the method implementing this workflow (In the “Simple mapping” format this value is set without explicitly using the “mapping” key)
parameters  | no       | dict        | A map of parameters to be passed to the workflow implementation


## Parameter Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | string      | An optional description for the input.
type        | no       | string      | Represents the required data type of the input. Not specifying a data type means the type can be anything. Valid types: string, integer, boolean
default     | no       | \<any\>     | An optional default value for the input.

<br>

# Example

In the following example, a workflow plugin named `maintenance_workflows_plugin` is defined, and two workflows refer to it.

The first workflow is named `test_all_connections_workflow`. It does't accept parameters and so it just maps the relevant implementation - method `validate_all_connections` in module `maintenance_workflows`.

The second workflow is named `test_connection_workflow`. It is mapped to the method `validate_connection` in module `maintenance_workflows`, and accpets three parameters - `protocol` (a mandatory parameter), `port` (an optional parameter, defaulting to 8080) and `connection_properties`. The last parameter has a default value of a map, consisting of 2 entries - `timeout_seconds` and `retry_attempts`.

{{< gsHighlight  yaml >}}
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
{{< /gsHighlight >}}


For further reading please refer to the [Workflows]({{< relref "workflows/overview.md" >}}) section.