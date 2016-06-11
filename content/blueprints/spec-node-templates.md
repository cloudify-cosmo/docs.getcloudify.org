---
layout: bt_wiki
title: Node Templates
category: Blueprints
draft: false
weight: 400

---

`node_templates` represent the actual instances of [node types]({{< relref "blueprints/spec-node-types.md" >}}) which would eventually represent a running application/service as described in the blueprint.

`node_templates` are more commonly referred to as `nodes`. nodes can comprise more than one instance. For example, you could define a node which contains two vms. Each vm will then be called a `node_instance`.

{{% gsNote title="Note" %}}
Beginning with [definitions version]({{< relref "blueprints/spec-versioning.md" >}}) `cloudify_dsl_1_3`, you can also import `node_templates` multiple times.
{{% /gsNote %}}

# Declaration

The `node_templates` section in the DSL is a dictionary where each key is a node template.

{{< gsHighlight  yaml >}}
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

{{< /gsHighlight >}}


# Schema


Keyname       | Required | Type          | Description
-----------   | -------- | ----          | -----------
type          | yes      | string        | The [node-type]({{< relref "blueprints/spec-node-types.md" >}}) of this node template.
properties    | no       | dict          | The properties of the node template matching its node type properties schema.
instances     | no       | dict          | Instances configuration. (deprecated, replaced by `capabilities.scalable`)
interfaces    | no       | interfaces    | Used for mapping plugins to [interfaces]({{< relref "blueprints/spec-interfaces.md" >}}) operation or for specifying inputs for already mapped node type operations.
relationships | no       | relationships | Used for specifying the [relationships]({{< relref "blueprints/spec-relationships.md" >}}) this node template has with other node templates.
capabilities  | no       | dict          | Used for specifying the node template capabilities (Supported since: [cloudify_dsl_1_3]({{< relref "blueprints/spec-versioning.md" >}}). At the moment only scalable capability is supported)

<br/>


# Example

{{< gsHighlight  yaml >}}
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
    instances:
      deploy: 2
    properties:
      ip: 192.168.0.11

  nginx:
    # We specify that this node template is of the node type we defined in the node types section
    type: nodes.Nginx
    # properties should match nodes.Nginx type properties schema
    properties:
      port: 80
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          # inputs should match the inputs schema defined in nodes.Nginx for the create operation
          inputs:
            process:
              env:
                port: { get_property: [SELF, port] }
    relationships:
      - type: cloudify.relationships.contained_in
        target: vm
{{< /gsHighlight >}}



# capabilities.scalable Configuration

The `capabilities.scalable.properties` key is used for configuring the deployment characteristics of the node template.

## capabilities.scalable.properties Schema

Keyname           | Required | Type     | Default   | Description
-----------       | -------- | ----     | ---       | -----------
default_instances | no       | integer  | 1         | The number of node-instances this node template will have.
min_instances     | no       | integer  | 0         | The minimum number of allowed node instances. (Not enforced by `scale` workflow)
max_instances     | no       | integer  | UNBOUNDED | The maximum number of allowed node instances. (Not enforced by `scale` workflow)

{{% gsNote title="Note" %}}
`UNBOUNDED` may be used literally as the value for `max_instances`. Internally, it is stored as `-1`, which may also be used.
{{% /gsNote %}}

## Example:

{{< gsHighlight  yaml >}}
node_templates:
  vm:
    type: cloudify.openstack.nodes.Compute
    capabilities:
      scalable:
        properties:
          default_instances: 5
{{< /gsHighlight >}}

In this example, the `vm` node would have 5 instances when deployed.

More information about number of instances combined with relationships can be found in the [relationships]({{< relref "blueprints/spec-relationships.md" >}}) specification.
