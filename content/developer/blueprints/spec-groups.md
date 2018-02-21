---
layout: bt_wiki
title: Groups
category: Blueprints
draft: false
weight: 1200

---

`groups` enables you to configuring shared behavior for different sets of`node_templates`.

# Declaration

Within each group, the `policies` section is a dictionary in which each item in the dictionary represents a [policy]({{< relref "blueprints/spec-policy-types.md" >}}).

Within each policy, the `triggers` section is a dictionary in which each item in the dictionary represents a [trigger]({{< relref "blueprints/spec-policy-triggers.md" >}}).

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


# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
members     | yes      | list        | A list of group members. Members are node template names or other group names.
policies    | no       | dict        | A dictionary of policies.

{{% gsNote title="Note" %}}
When using groups as scaling groups in combination with top-level `policies`, you can define nested groups in which group members may be other groups.
See [Policies]({{< relref "blueprints/spec-policies.md" >}}).
{{% /gsNote %}}

## Policy Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
type        | yes      | string      | Policy type.
properties  | no       | dict        | Optional properties for configuring the policy.
triggers    | yes      | dict        | A dictionary of triggers.

### Trigger Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
type        | yes      | string      | Trigger type.
parameters  | no       | dict        | Optional parameters to be passed to the trigger.

<br>

Inside the trigger's `parameters` section, `{ get_property: [SELF, property_name] }` can be used to access properties of the event that caused the trigger to be processed. For example, a policy may add contextual data to an event, such as a node instance ID or the CPU average in the last five minutes, before processing its triggers. An `execute_workflow` trigger, for example, may pass these properties to the workflow it executes.

# Example

For an example on how to use policies, see [Using Policies]({{< relref "manager_policies/overview.md#using-policies" >}}).
