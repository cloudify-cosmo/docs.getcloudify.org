---
layout: bt_wiki
title: Policies
category: Blueprints
draft: false
weight: 1200

---

`policies` enable you to configure reusable behavior by referencing the [groups]({{< relref "blueprints/spec-groups.md" >}}) for which a policy applies.

{{% gsNote title="Note" %}}
Do not confuse the top-level `policies` section described here with policies that are defined in the top-level `policy_types` or the `policies` section under groups.
{{% /gsNote %}}

{{% gsNote title="Note" %}}
The only supported policy type is the built-in `cloudify.policies.scalable`.
{{% /gsNote %}}

# Declaration

{{< gsHighlight  yaml >}}
policies:
  my_scaling_policy:
    type: cloudify.policies.scalable
    properties:
      ...
    targets: ...
{{< /gsHighlight >}}


# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
type        | yes      | string      | The policy type.
properties  | no       | dict        | The specific policy properties. The properties schema is defined by the policy type.
targets     | yes      | list        | A list of group names. The policy is applied on the groups specified in this list.

## `cloudify.policies.scalable` Policy Schema

Keyname           | Required | Type     | Default   | Description
-----------       | -------- | ----     | ---       | -----------
default_instances | no       | integer  | 1         | The number of instances the groups referenced by this policy will have.
min_instances     | no       | integer  | 0         | The minimum number of permitted group instances. (Not enforced by the `scale` workflow.)
max_instances     | no       | integer  | UNBOUNDED | The maximum number of permitted group instances. (Not enforced by the `scale` workflow.)

{{% gsNote title="Note" %}}
`UNBOUNDED` may be used literally as the value for `max_instances`. Internally, it is stored as `-1`, which may also be used.
{{% /gsNote %}}

# Example

{{< gsHighlight  yaml >}}
node_templates:
  vm: ...
  ip: ...

groups:
  vm_and_ip:
    members: [vm, ip]

policies:
  scaling_policy1:
    type: cloudify.policies.scaling
    properties:
      default_instances: 2
    targets: [vm_and_ip]
{{< /gsHighlight >}}
