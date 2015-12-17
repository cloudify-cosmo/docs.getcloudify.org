---
layout: bt_wiki
title: Groups
category: Blueprints
draft: false
weight: 1200

---

# Declaration

The `groups` section is a hash where each item in the hash represents a group.

Within each group, the `policies` section is a hash where each item in the hash represents a [policy]({{< relref "blueprints/spec-policy-types.md" >}}).

Within each policy, the `triggers` section is a hash where each item in the hash represents a [trigger]({{< relref "blueprints/spec-policy-triggers.md" >}}).

{{< gsHighlight  yaml >}}
groups:
  group1:
    members: ...
    policies:
      policy1:
        type: ...
        properties:
          ...
        triggers:
          trigger1:
            type: ...
            parameters: ...
          trigger2:
            ...
      policy2:
        ...
  group2:
    ...
{{< /gsHighlight >}}


# Definition

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
members     | yes      | list        | A list of group members. Members are node template names.
policies    | yes      | hash        | A hash of policies.

## Policy Definition

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
type        | yes      | string      | Policy type.
properties  | no       | hash        | Optional properties for configuring the policy.
triggers    | yes      | hash        | A hash of triggers.

## Trigger Definition

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
type        | yes      | string      | Trigger type.
parameters  | no       | hash        | Optional parameters that will be passed to the trigger.

<br>

Inside the trigger's `parameters` section, `{ get_property: [SELF, property_name] }` can be used to access properties of the event that caused the trigger to be processed. For example, a policy may add contextual data to an event, such as a node instance id or the CPU average in the last five minutes, before processing its triggers. An `execute_workflow` trigger, for example, may pass these properties to the workflow it executes.

# Example

For an example on how to use policies see [Using Policies]({{< relref "manager_policies/overview.md#using-policies" >}}).
