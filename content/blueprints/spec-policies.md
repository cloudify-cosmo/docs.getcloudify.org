---

title: Policies


weight: 1200

---

`policies` provide a way of configuring reusable behavior by referencing [groups]({{< relref "blueprints/spec-groups.md" >}}) for which a policy applies.

{{% gsNote title="Note" %}}
The top level `policies` section described in this page should not be confused with policies defined in the top level `policy_types` and the `policies`
section under groups.

The confusing similar names is something that we are aware of and will work to consolidate in the future. For now, try to keep the differences in mind.
{{% /gsNote %}}

{{% gsNote title="Note" %}}
At the moment, the only supported policy type is the built-in `cloudify.policies.scalable`.
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
targets     | yes      | list        | A list of group names. The policy will be applied on the groups specified in this list.

## `cloudify.policies.scalable` Policy Schema

Keyname           | Required | Type     | Default   | Description
-----------       | -------- | ----     | ---       | -----------
default_instances | no       | integer  | 1         | The number of instances the groups referenced by this policy will have.
min_instances     | no       | integer  | 0         | The minimum number of allowed group instances. (Not enforced by the `scale` workflow)
max_instances     | no       | integer  | UNBOUNDED | The maximum number of allowed group instances. (Not enforced by the `scale` workflow)

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
