---
title: Node Templates
category: Blueprints
draft: false
weight: 400
aliases: /blueprints/spec-node-templates/
---

`node_templates` represent the actual instances of [node types]({{< relref "developer/blueprints/spec-node-types.md" >}}) that eventually represent the running application/service, as described in the blueprint.

`node_templates` are more commonly referred to as `nodes`. Nodes can comprise more than one instance. For example, you might define a node that contains two VMs. Each VM is a `node_instance`.

{{% note title="Note" %}}
Beginning with [definitions version]({{< relref "developer/blueprints/spec-versioning.md" >}}) `cloudify_dsl_1_4`, you can import `node_templates` multiple times.
{{% /note %}}

# Declaration

The `node_templates` section in the DSL is a dictionary in which each key is a node template.

{{< highlight  yaml >}}
node_templates:

  node_template_1:
    type: ...
    properties:
      ...
    capabilities:
      scalable:
        properties:
          ...
      ...
    interfaces:
      ...
    relationships:
      ...

  node_template_2:
    ...

{{< /highlight >}}


# Schema


Keyname       | Required | Type          | Description
-----------   | -------- | ----          | -----------
type          | yes      | string        | The [node-type]({{< relref "developer/blueprints/spec-node-types.md" >}}) of this node template.
properties    | no       | dict          | The properties of the node template, matching its node type properties schema.
instances     | no       | dict          | Instances configuration. (Deprecated. Replaced with `capabilities.scalable`)
interfaces    | no       | interfaces    | Used for a mapping plugins to [interfaces]({{< relref "developer/blueprints/spec-interfaces.md" >}}) operation, or for specifying inputs for already-mapped node type operations.
relationships | no       | relationships | Used for specifying the [relationships]({{< relref "developer/blueprints/spec-relationships.md" >}}) that this node template has with other node templates.
capabilities  | no       | dict          | Used for specifying the node template capabilities (Supported since: [cloudify_dsl_1_3]({{< relref "developer/blueprints/spec-versioning.md" >}}).) Only the scalable capability is supported.

<br/>


# Example

{{< highlight  yaml >}}
node_types:
  # The following node type is used in the node templates section
  nodes.Nginx:
    derived_from: cloudify.nodes.WebServer
    properties:
      port:
        description: The default listening port for the Nginx server.
        type: integer
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: scripts/install-nginx.sh
          inputs:
            process:
              default:
                env:
                  port: 80
        start: scripts/start-nginx.sh

node_templates:
  vm:
    type: cloudify.nodes.Compute
    capabilities:
      scalable:
        properties:
          default_instances: 2
    properties:
      ip: 192.168.0.11

  nginx:
    # This node template is specified as being of the node type that was defined in the node types section
    type: nodes.Nginx
    # properties must match the nodes.Nginx type properties schema
    properties:
      port: 80
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          # inputs must match the inputs schema defined in nodes.Nginx for the create operation
          inputs:
            process:
              env:
                port: { get_property: [SELF, port] }
    relationships:
      - type: cloudify.relationships.contained_in
        target: vm
{{< /highlight >}}



# capabilities.scalable Configuration

The `capabilities.scalable.properties` key is used for configuring the deployment characteristics of the node template.

## capabilities.scalable.properties Schema

Keyname           | Required | Type     | Default   | Description
-----------       | -------- | ----     | ---       | -----------
default_instances | no       | integer  | 1         | The number of node-instances this node template has.
min_instances     | no       | integer  | 0         | The minimum number of permitted node instances. (Not enforced by `scale` workflow)
max_instances     | no       | integer  | UNBOUNDED | The maximum number of permitted node instances. (Not enforced by `scale` workflow)

{{% note title="Note" %}}
`UNBOUNDED` may be used literally as the value for `max_instances`. Internally, it is stored as `-1`, which may also be used.
{{% /note %}}

## Example:

{{< highlight  yaml >}}
node_templates:
  vm:
    type: cloudify.openstack.nodes.Compute
    capabilities:
      scalable:
        properties:
          default_instances: 5
{{< /highlight >}}

In the above example, the `vm` node has 5 instances when deployed.

Additional information about number of instances combined with relationships can be found in the [relationships]({{< relref "developer/blueprints/spec-relationships.md" >}}) specification.
