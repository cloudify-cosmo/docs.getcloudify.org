---
title: Node Types
category: Blueprints
draft: false
weight: 500
aliases: /blueprints/spec-node-types/
---

`node_types` are used for defining common properties and behaviors for [node-templates]({{< relref "developer/blueprints/spec-node-templates.md" >}}). `node-templates` can then be created based on these types, inheriting their definitions.

# Declaration

{{< highlight  yaml >}}
node_types:

  type1:
    derived_from: cloudify.nodes.Root
    interfaces:
      ...
    properties:
      ...

  type2:
    ...
  ...
{{< /highlight >}}


# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
derived_from| no       | string      | A string referencing a parent type.
interfaces  | no       | dictionary  | A dictionary of node interfaces.
properties  | no       | dictionary  | A dictionary of node properties.


## derived_from

The `derived_from` property can be used to build over and extend an existing type. This is useful for further extracting common properties and behaviors, this time in between *types*.

Using this mechanism, you can build various type hierarchies that can be reused across different application blueprints.


When a type derives from another type, its `interfaces` and `properties` keys are merged with the parent type's `interfaces` and `properties` keys. The merge is on the property/operation level. A property defined on the parent type is overridden by a property with the same name that is defined on the deriving type. The same is true for an interface operation mapping. However, it is important to note that it is possible to add additional operation mappings to an interface defined in the parent type in the deriving type. See the [examples section](#examples) for more information.

{{% note title="Note" %}}
When not deriving from any other type, it is good practice to derive from the `cloudify.nodes.Root` type that is defined in the [built-in types]({{< relref "developer/blueprints/built-in-types.md" >}}). If you do not do this, you must either [write a custom workflow]({{< relref "working_with/workflows/creating-your-own-workflow.md" >}}) or declare the `cloudify.interfaces.lifecycle` interface in this new type. This is required because the [built-in *install* and *uninstall* workflows]({{< relref "working_with/workflows/built-in-workflows.md" >}}) are based on interfaces that are declared for the `cloudify.nodes.Root` type.
{{% /note %}}


## interfaces

The `interfaces` property can be used to define common behaviors for node templates. For additonal information, see the [Interfaces documentation]({{< relref "developer/blueprints/spec-interfaces.md" >}}).


## properties

The `properties` property can be used to define a common properties schema for node templates.

`properties` is a dictionary from a property name to a dictionary describing the property. The nested dictionary includes the following keys:

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | string      | Description for the property.
type        | no       | string      | Property type. Not specifying a data type means the type can be anything (including types not listed in the valid types). Valid types: `string`, `integer`, `float`, `boolean`, `list`, `dict`, `regex` or a [custom data type]({{< relref "developer/blueprints/spec-data-types.md" >}}).
default     | no       | \<any\>     | An optional default value for the property.
required    | no       | boolean     | Specifies whether the property is required. (Default: `true`, Supported since: [cloudify_dsl_1_2]({{< relref "developer/blueprints/spec-versioning.md" >}}))

{{% note title="Built-in Node Types" %}}
Cloudify provides some built-in node types, which you can find out about [here]({{< relref "developer/blueprints/built-in-types.md" >}}).
{{% /note %}}
# Examples

Following is an example node type definition extracted from the [Cloudify-Nodecellar-Example blueprint](https://github.com/cloudify-cosmo/cloudify-nodecellar-example).

{{< highlight  yaml >}}
node_types:
  nodecellar.nodes.MongoDatabase:
    derived_from: cloudify.nodes.DBMS
    properties:
      port:
        description: MongoDB port
        type: integer
    interfaces:
      cloudify.interfaces.lifecycle:
        create: scripts/mongo/install-mongo.sh
        start: scripts/mongo/start-mongo.sh
        stop: scripts/mongo/stop-mongo.sh
{{< /highlight >}}


An example of how to use this type follows:

{{< highlight  yaml >}}
node_templates:
  MongoDB1:
    type: nodecellar.nodes.MongoDatabase
  MongoDB2:
    type: nodecellar.nodes.MongoDatabase
{{< /highlight >}}


Each of these two nodes now have both the `port` property and the three operations defined for the `nodecellar.nodes.MongoDatabase` type.


Finally, here is an example of how to extend an existing type by deriving from it.

{{< highlight  yaml >}}
node_types:
  nodecellar.nodes.MongoDatabaseExtended:
    derived_from: nodecellar.nodes.MongoDatabase
    properties:
      enable_replication:
        description: MongoDB replication enabling flag
        type: boolean
        default: false
    interfaces:
      cloudify.interfaces.lifecycle:
        create: scripts/mongo/install-mongo-extended.sh
        configure: scripts/mongo/configure-mongo-extended.sh
{{< /highlight >}}

The `nodecellar.nodes.MongoDatabaseExtended` type derives from the `nodecellar.nodes.MongoDatabase` type that was defined in the previous example. As such, it derives its properties and interfaces definitions, which are either merged or overridden by the ones it defines itself.

A node template with a `nodecellar.nodes.MongoDatabaseExtended` type therefore has both the `port` and `enable_replication` properties, and the following interfaces mapping:

{{< highlight  yaml >}}
    interfaces:
      cloudify.interfaces.lifecycle:
        create: scripts/mongo/install-mongo-extended.sh
        configure: scripts/mongo/configure-mongo-extended.sh
        start: scripts/mongo/start-mongo.sh
        stop: scripts/mongo/stop-mongo.sh
{{< /highlight >}}

As is evident, the `configure` operation, which is mapped only in the extending type, merged with the `start` and `stop` operations that are only mapped in the parent type, whereas the `create` operation, which is defined on both types, is mapped to the value set in the extending type.
