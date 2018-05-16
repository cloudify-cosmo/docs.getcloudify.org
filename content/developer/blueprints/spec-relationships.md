---
layout: bt_wiki
title: Relationships
category: Blueprints
draft: false
weight: 700
aliases: /blueprints/spec-relationships/
---

`relationships` enable you to define how nodes relate to one another. For example, a `web_server` node can be `contained_in` a `vm` node or an `application` node can be `connected_to` a `database` node.

# Declaration

{{< highlight  yaml >}}
node_templates:

  node:
    ...
    relationships:
      - type: ""
        target: ""
        properties:
            connection_type: ""
        source_interfaces: {}
        target_interfaces: {}
    ...
{{< /highlight >}}


# Schema

Keyname          | Required | Type        | Description
-----------      | -------- | ----        | -----------
type             | yes      | string      | Either a newly-declared relationship type or one of the relationship types provided by default when importing the [types.yaml](https://github.com/cloudify-cosmo/cloudify-manager/blob/master/resources/rest-service/cloudify/types/types.yaml) file.
target           | yes      | string      | The name of the node to which the current node is related.
connection_type  | no       | string      | Valid values: `all_to_all` and `all_to_one` (See explanation below.)
source_interfaces| no       | dict        | A dictionary of interfaces.
target_interfaces| no       | dict        | A dictionary of interfaces.

<br>

By default, nodes can be related using the relationship types described below. You may also [declare your own](#declaring-relationship-types) relationship types.

## The *cloudify.relationships.depends_on* Relationship Type

Describes a node that depends on another node. For example, the creation of a new subnet depends on the creation of a new network.

{{% note title="Note" %}}
The `cloudify.relationships.depends_on` relationship type is for use as a logical representation of dependencies between nodes. You should only use it in very specific cases when the other two relationship types are not relevant, or when you want to specify that a certain node should be created before or after another for the sake of ordering.
{{% /note %}}

The other two relationship types inherit from the `cloudify.relationships.depends_on` relationship type. The semantics of the `cloudify.relationships.connected_to` relationship type is the same. Therefore, usage reference should be dictated by `cloudify.relationships.connected_to` which is described below.


## The *cloudify.relationships.contained_in* Relationship Type

A node is contained in another node. For example, a Web server is contained within a VM.

Example:

{{< highlight  yaml >}}
node_templates:

  vm:
    type: cloudify.nodes.Compute
    capabilities:
      scalable:
        properties:
          default_instances: 2

  http_web_server:
    type: cloudify.nodes.WebServer
    capabilities:
      scalable:
        properties:
          default_instances: 2
    properties:
      port: { get_input: webserver_port }
    relationships:
      - type: cloudify.relationships.contained_in
        target: vm
    interfaces:
      cloudify.interfaces.lifecycle:
        configure: scripts/configure.sh
        start:
          implementation: scripts/start.sh
          inputs:
            process:
              env:
                port: { get_input: webserver_port }
        stop: scripts/stop.sh
{{< /highlight >}}

In the above example, the `http_web_server` node is contained within a `vm` node.
Practically, this means that:

* The `vm`'s node instances are created before the `http_web_server`'s node instances.
* Two instances of the `http_web_server` node will be created within each of the two node instances of the `vm` node. This means that there will be 4 node instances of the `http_web_server` node. The number of node instances for each node that is contained within another node is determined by multiplying the number of instances requested for the contained node and the actual number of instances of the node it is contained in.   

   To explain further:<br>
   Node 'A' is set to have 'X' node instances. Node 'B' is set to have 'Y' node instances. Node B is `cloudify.relationships.contained_in` node A.<br>
   Then, node 'A' will have X node instances and node 'B' will have X*Y node instances - Y node instances per node instance in 'A'.

{{% warning title="Note" %}}
You may only use one `cloudify.relationships.contained_in` relationship per node.
{{% /warning %}}

Note that the implementation of `cloudify.relationships.contained_in` does not necessarily dictate that a node must be **physically** contained in another node. For instance, a counter-example to the `http_web_server` in a `vm` is an `ip` node that is contained in a `network` node. Although the IP isn't actually contained within the network itself, if two instances of the `ip` node have the `cloudify.relationships.contained_in` relationship type with the `network` node, there will be two `ip` node instances in each instance of the `network` node.

<!--

there's some workflow-related API which also touches on the 'contained_in' type, e.g. "contained_instances" property of the CloudifyWorkflowNodeInstance class - basically these are used to form subgraphs to execute operations on specific nodes etc.
 -->


## The *cloudify.relationships.connected_to* Relationship Type

A node is connected to another node. For example, an application is connected to a database and both of them are contained in a VM.

Example:

{{< highlight  yaml >}}
node_templates:

  application:
    type: web_app
    capabilities:
      scalable:
        properties:
          default_instances: 2
    relationships:
      - type: cloudify.relationships.contained_in
        target: vm
      - type: cloudify.relationships.connected_to
        target: database

  database:
    type: database
    capabilities:
      scalable:
        properties:
          default_instances: 1
    relationships:
      - type: cloudify.relationships.contained_in
        target: vm

  vm:
    type: cloudify.nodes.Compute
    capabilities:
      scalable:
        properties:
          default_instances: 2
{{< /highlight >}}

In the above example, an `application` node is connected to a `database` node (and both the `database` and the `application` nodes are contained in a `vm` node.)

Since there are two vm node instances, two application node instances and one database node instance deployed, each of the  VM's will contain one database node instance and two application node instances, as explained in the [cloudify.relationships.contained_in](#contained-in) relationship type.

This actually means that there are four application node instances (two on each VM node instance) and two database node instances (one on each VM node instance). All application node instances are connected to each of the two databases residing on the two VM's.


# Multi-Instance cloudify.relationships.connected_to semantics

A specific feature in `cloudify.relationships.connected_to` allows you to connect a node to an arbitrary instance of another node.

Example:

{{< highlight  yaml >}}
node_templates:

  application:
    type: web_app
    capabilities:
      scalable:
        properties:
          default_instances: 2
    relationships:
      - type: cloudify.relationships.connected_to
        target: database
        properties:
            connection_type: all_to_one

  database:
    type: database
    capabilities:
      scalable:
        properties:
          default_instances: 2
{{< /highlight >}}

In the above example there two `application` node instances that arbitrarily connect to **one** of the two `database` node instances.

The default configuration for `connection_type` is `all_to_all`.

The same `connection_type` configuration can be applied to a `cloudify.relationships.contained_in` relationship type, although it has virtually no effect.


## *connection_type*: *all_to_all* and *all_to_one*
As mentioned previously, the relationship types `cloudify.relationships.connected_to` and `cloudify.relationships.depends_on` and those that derive from it have a property named `connection_type` for which the value can be either `all_to_all` or `all_to_one` (The default value is `all_to_all`).
The following diagrams make their semantics clearer.

### *all_to_all*
Consider the following blueprint:

{{< highlight  yaml >}}
node_templates:
  application:
    type: web_app
    capabilities:
      scalable:
        properties:
          default_instances: 2
    relationships:
      - type: cloudify.relationships.connected_to
        target: database
        properties:
            connection_type: all_to_all
  database:
    type: database
    capabilities:
      scalable:
        properties:
          default_instances: 2
{{< /highlight >}}

When deployed, there are two node instances of the `application` node and two node instances of the `database` node. *All* `application` node instances are connected to *all* `database` node instances. This would have relevance in the case of two Node.js application servers that must connect to two memcached nodes, for example.

![all_to_all diagram]( /images/guide/relationships-all-to-all.png )

### *all_to_one*
Consider the following blueprint:

{{< highlight  yaml >}}
node_templates:
  application:
    type: web_app
    capabilities:
      scalable:
        properties:
          default_instances: 2
    relationships:
      - type: cloudify.relationships.connected_to
        target: database
        properties:
            connection_type: all_to_one
  database:
    type: database
    capabilities:
      scalable:
        properties:
          default_instances: 2
{{< /highlight >}}

When deployed, there are two node instances of the `application` node and two node instances of the `database` node. *All* `application` node instances are connected to *one* `database` node instance (selected at random). This would have relevance in the case of two Node.js application servers that must add themselves as users on a single cassandra node, for example.

![all_to_one diagram]( /images/guide/relationships-all-to-one.png )


# Relationship Instances

In the case in which you have a node with two instances and two relationships configured for them, when a deployment is created, the node instances are instantiated in the model. In the same way that node instances are instantiated for each node, relationship instances are instantiated for each relationship.


# Declaring Relationship Types

You can declare your own relationship types in the relationships section in the blueprint.
This is useful when you want to change the default implementation of how nodes interact.

## Relationship Type Declaration

Declaring relationship types is done as follows:

{{< highlight  yaml >}}
relationships:

  relationship1:
    derived_from: ""
    source_interfaces: {}
    target_interfaces: {}
    properties:
      connection_type: ""

  relationship2: {}
    ...
{{< /highlight >}}

## Relationship Type Schema

Keyname           | Required | Type        | Description
-----------       | -------- | ----        | -----------
derived_from      | no       | string      | The relationship type from which the new relationship is derived.
source_interfaces | no       | dict        | A dictionary of interfaces.
target_interfaces | no       | dict        | A dictionary of interfaces.
connection_type   | no       | string      | Valid values: `all_to_all` and `all_to_one`

<br>


## Relationship Type Example

{{< highlight  yaml >}}
relationships:
  app_connected_to_db:
    derived_from: cloudify.relationships.connected_to
    source_interfaces:
      cloudify.interfaces.relationship_lifecycle:
        postconfigure:
          implementation: scripts/configure_my_connection.py

node_templates:
  application:
    type: web_app
    capabilities:
      scalable:
        properties:
          default_instances: 2
    relationships:
      - type: cloudify.relationships.contained_in
        target: vm
      - type: app_connected_to_db
        target: database
{{< /highlight >}}

In the above example, a relationship type called `app_connected_to_db` is created that inherits from the base `cloudify.relationships.connected_to` relationship type and implements a specific configuration (by running scripts/configure_my_connection.py) for the type.


# Relationship Interfaces

Each relationship type (and instance) has `source_interfaces` and `target_interfaces`.

For a specific node:

* `source_interfaces` defines interfaces of operations that are executed on the node in which the relationship is declared.
* `target_interfaces` defines interfaces of operations that are executed on the node that its relationship targets.

{{% note title="Note" %}}
Defining interfaces `source_interfaces` and `target_interfaces` does not necessarily mean that their operations will be executed. That is, operations defined in `cloudify.interfaces.relationship_lifecycle` will be executed when running `install`/`uninstall` workflows. You can also add a custom relationship interface and write a custom workflow to execute operations from the new interface.
{{% /note %}}

Example:

{{< highlight  yaml >}}
relationships:
  source_connected_to_target:
    derived_from: cloudify.relationships.connected_to
    source_interfaces:
      cloudify.interfaces.relationship_lifecycle:
        postconfigure:
          implementation: scripts/configure_source_node.py
    target_interfaces:
      cloudify.interfaces.relationship_lifecycle:
        postconfigure:
          implementation: scripts/configure_target_node.py

node_templates:
  source_node:
    type: app
    relationships:
      - type: source_connected_to_target
        target: target_node
{{< /highlight >}}

In the above example, the `postconfigure` lifecycle operation in the `source_connected_to_target` relationship type is configured once in its `source_interfaces` section and in the `target_interfaces` section. This means that the configure_source_node.py script will be executed on host instances of `source_node` and the configure_target_node.py will be executed on host instances of `target_node`. (This assumes that the plugin executor is configured as `host_agent` and not `central_deployment_agent`. Otherwise, `source_interfaces` operations and `target_interfaces` operations are all executed on the Manager.)

# How Relationships Affect Node Creation

Declaring relationships affects the node creation/teardown flow in respect to the `install`/`uninstall` workflows respectively.

When declaring a relationship and using the built in `install` workflow, the first lifecycle operation of the source node is executed after the entire set of lifecycle operations of the target node are executed and completed.
When using the `uninstall` workflow, the opposite is true.

For instance, in the example, all source operations (`node_instance` operations, `source_interfaces` relationships operations and `target_interfaces` relationship operations) for `source_node` are executed after _all_ `target_node` operations are completed. This removes any uncertainties about whether a node is ready to have another node connect to it or be contained in it, due to it not being available. Of course, it's up to you to define what "ready" means.
