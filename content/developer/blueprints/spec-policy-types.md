---
title: Policy Types
category: Blueprints
draft: false
weight: 1400
aliases: /blueprints/spec-policy-types/
---

`policies` enable you to analyze a stream of events that correspond to a group of nodes (and their instances).

# Declaration

The `policy_types` section is a hash in which each item in the hash represents an policy type.

{{< highlight  yaml >}}
policy_types:
  # my_definitions.policies.my_policy1 is the policy type name
  my_definitions.policies.my_policy1:
    ...
  my_policy2:
    ...
{{< /highlight >}}


# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
source      | yes      | string      | The policy type implementation source (URL or a path relative to the blueprint root directory).
properties  | no       | dict        | Optional properties schema for the policy type.


<br>

# Examples

{{< highlight  yaml >}}
policy_types:

  my_host_failure_policy:

    source: policies/host_failure.clj

    properties:
      policy_operates_on_group:
        description: The policy will maintain its state for each node instance individually.
        default: false

      is_node_started_before_workflow:
        description: The trigger will be processed even if node is not in the started state
        default: false

      interval_between_workflows:
        description: Don't check the last workflow's trigger time before launching workflow
        default: -1

      service:
        description: Operate on events with an "example" being a substring of their service field
        default:
          - example

{{< /highlight >}}

# Usage

This section describes how to define a policy type. To _use_ policy types,
see the [Groups]({{< relref "developer/blueprints/spec-groups.md" >}}) specification.
