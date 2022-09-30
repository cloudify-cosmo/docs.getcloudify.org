---
title: Policy Triggers
category: Blueprints
draft: false
weight: 1500
aliases: /blueprints/spec-policy-triggers/

types_yaml_link: https://github.com/cloudify-cosmo/cloudify-manager/blob/3.3/resources/rest-service/cloudify/types/types.yaml
execute_workflow_trigger_link: https://github.com/cloudify-cosmo/cloudify-manager/blob/3.3/resources/rest-service/cloudify/triggers/execute_workflow.clj
---

`policy_triggers` specify the implementation of actions that are invoked by policies, and declare the properties that define a trigger's behavior.

# Declaration

The `policy_triggers` section is a hash in which each item in the hash represents an policy trigger.

{{< highlight  yaml >}}
policy_triggers:
  # my_definitions.policy_triggers.my_trigger1 is the policy trigger name
  my_definitions.policy_triggers.my_trigger1:
    ...
  my_trigger2:
    ...
{{< /highlight >}}


# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
source      | yes      | string      | The policy trigger implementation source (a URL or a path relative to the blueprint root directory).
parameters  | no       | dict        | Optional parameters schema for the policy trigger.


<br>

# Example

{{< highlight  yaml >}}
policy_triggers:

  my_webhook_trigger:

    source: policy_trigger/webhook_trigger.clj

    properties:
      webhook_endpoint:
        description: >
          URL for making a POST HTTP request to
      webhook_body:
        description: >
          request body (serialized to JSON)
        default: {}

{{< /highlight >}}


# Built-in Policy Triggers

The following policy triggers are defined in [types.yaml]({{< field "types_yaml_link" >}}).

## cloudify.policies.triggers.execute_workflow

### Parameters:

* `workflow` Workflow name to execute.
* `workflow_parameters` Workflow parameters. (Optional, default: `{}`)
* `force` Specifies that the workflow is to be executed, even when another execution for the same workflow is currently in progress. (Optional, default: `false`)
* `allow_custom_parameters` Specifies that parameters that are not defined in the workflow parameters schema are to be accepted. (Optional, default: `false`)
* `socket_timeout` The socket timeout (in ms.) when making a request to the Manager REST API. (Optional, default: `1000`)
* `conn_timeout` The connection timeout (in ms.) when making a request to the Manager REST API. (Optional, default: `1000`)

You can find the implementation for this trigger on [github]({{< field "execute_workflow_trigger_link" >}}). It builds the HTTP request to the Manager REST service and makes the actual REST call using the `clj-http` clojure library.

# Usage
This section describes how to define a policy trigger. To _use_ policy triggers with policies,
see the [Groups]({{< relref "developer/blueprints/spec-groups.md" >}}) specification.
