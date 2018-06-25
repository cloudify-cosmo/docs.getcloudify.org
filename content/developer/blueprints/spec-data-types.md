---
layout: bt_wiki
title: Data Types
category: Blueprints
draft: false
weight: 1600
aliases: /blueprints/spec-data-types/
---

`data_types` are useful for grouping and re-using a common set of properties, together with their types and default values.

# Supported Definitions

To use `data_types`, the [definitions version]({{< relref "developer/blueprints/spec-versioning.md" >}}) must be `cloudify_dsl_1_2` or higher.


# Declaration

{{< highlight yaml >}}

data_types:

  data_type1:
    description: ...
    properties: ...

  data_type2:
    derived_from: data_type1
    description: ...
    properties: ...

{{< /highlight >}}


# Schema

Keyname      | Required | Type        | Description
-----------  | -------- | ----        | -----------
description  | no       | string      | Description for the data type.
properties   | no       | dictionary  | Dictionary of the data type properties.
derived_from | no       | string      | Parent data type.

## description

This property can be used to describe the data type.

## properties

The `properties` property is used to define the data type schema.

`properties` is a dictionary from a property name to a dictionary describing the property.
### Property Schema:

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | string      | Description for the property.
type        | no       | string      | Property type. If you do not specify a data type, the type can be anything (including types not listed in the valid types). Valid types: string, integer, float, boolean or a another custom data type.
default     | no       | \<any\>     | An optional default value for the property.
required    | no       | boolean     | Specifies whether the property is required. (Default: `true`, Supported since: [cloudify_dsl_1_2]({{< relref "developer/blueprints/spec-versioning.md" >}}))

## derived_from

The `derived_from` property can be used to build over and extend an existing data type.

When a data type derives from another data type, its `properties` are merged with the parent's `properties`. The merge is at the property level. A property defined on the parent type is overridden by a property with the same name that is defined on the deriving type. An exception to this rule is when a property `type` references some other custom data type. This is explained in detail in the following examples.


# Features and Examples

## Basic Usage

In this example, a `my.datatypes.Endpoint` data type is defined with two properties: `ip` and `port`.
The, a `DatabaseService` node type is defined to represent an external database service. In this type's properties, an `endpoint` property is defined, it's type being the endpoint data type that was previously defined. Finally, a node template with a `DatabaseService` type is defined. This node template fully configures the endpoint properties (i.e. the `ip` and `port`).

{{< highlight yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

data_types:

  my.datatypes.Endpoint:
    description: Socket endpoint details
    properties:
      ip:
        description: the endpoint IP
        type: string
      port:
        description: the endpoint port
        type: integer

node_types:

  DatabaseService:
    derived_from: cloudify.nodes.DBMS
    properties:
      endpoint:
        type: my.datatypes.Endpoint

node_templates:

  my_db_service:
    type: DatabaseService
    properties:
      endpoint:
        ip: 192.168.15.85
        port: 2233
{{< /highlight >}}

## Schema Validations

If a property is missed or an additional property spcified under `endpoint`, the blueprint will fail validation. For example

{{< highlight yaml >}}
node_templates:
  my_db_service2:
    type: DatabaseService
    properties:
      endpoint:
        ip: 192.168.15.85
{{< /highlight >}}

will fail validation because of the missing `port` property. (Note that if `port` had its `required` attribute set to `false`, there would not be a validation failure.)

Similarly,

{{< highlight yaml >}}
node_templates:
  my_db_service3:
    type: DatabaseService
    properties:
      endpoint:
        ip: 192.168.15.85
        port: 2233
        some_other_property: the_value
{{< /highlight >}}

will fail validation because of the unexpected `some_other_property`, which is not specified in `endpoint`'s schema.

## Inheritance

You can derive from previously-defined data types, to extend their schema. For example, consider the `my.datatypes.Endpoint` defined in the previous example. You can derive from it, to create an endpoint data type that also includes a user name, as shown below.

{{< highlight yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

data_types:

  my.datatypes.Endpoint:
    ...

  my.datatypes.ExtendedEndpoint:
    derived_from: my.datatypes.Endpoint
    properties:
      username:
        description: Username used to connect to the endpoint
        type: string

node_types:

  DatabaseService:
    derived_from: cloudify.nodes.DBMS
    properties:
      endpoint:
        type: my.datatypes.ExtendedEndpoint

node_templates:

  my_db_service:
    type: DatabaseService
    properties:
      endpoint:
        ip: 192.168.15.85
        port: 2233
        username: jimmy
{{< /highlight >}}

## Composition

Data type property types can themselves be other data types. Using the previously defined `my.datatypes.Endpoint`, in the following example, a `my.datatypes.Connection` is created that will hold endpoint information and authentication details.

{{< highlight yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

data_types:

  my.datatypes.Endpoint:
    ...

  my.datatypes.Connection:
    properties:
      endpoint:
        type: my.datatypes.Endpoint
      auth:
        type: my.datatypes.Auth

  my.datatypes.Auth:
    properties:
      username:
        type: string
      password:
        type: string

node_types:

  DatabaseService:
    derived_from: cloudify.nodes.DBMS
    properties:
      connection:
        type: my.datatypes.Connection

node_templates:

  my_db_service:
    type: DatabaseService
    properties:
      connection:
        endpoint:
          ip: 192.168.15.85
          port: 2233
        auth:
          username: jimmy
          password: secret
{{< /highlight >}}

## Default Values

Default values can help make highly configurable components easy to use by setting default values where it is logical to do so. Consider the previously defined `my.datatypes.Connection`. Its usage can be simplified if, for example, you know that `port` by default will be `2233` and username by default will be `admin`.

{{< highlight yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

data_types:

  my.datatypes.Connection:
    properties:
      endpoint:
        type: my.datatypes.Endpoint
      auth:
        type: my.datatypes.Auth

  my.datatypes.Endpoint:
    description: Socket endpoint details
    properties:
      ip:
        description: the endpoint IP
        type: string
      port:
        default: 2233
        type: integer

  my.datatypes.Auth:
    properties:
      username:
        default: admin
        type: string
      password:
        type: string

node_types:

  DatabaseService:
    derived_from: cloudify.nodes.DBMS
    properties:
      connection:
        type: my.datatypes.Connection

node_templates:

  my_db_service:
    type: DatabaseService
    properties:
      connection:
        endpoint:
          ip: 192.168.15.85
        auth:
          password: secret
{{< /highlight >}}

Notice how the `my_db_service` node template only specified the `connection.endpoint.ip` and `connection.auth.password`. The other properties received the default `2233` port and `admin` user.

## Overriding Default Values

You can override default values in same way as you would configure properties without default values. For example:

{{< highlight yaml >}}
node_templates:

  my_db_service:
    type: DatabaseService
    properties:
      connection:
        endpoint:
          ip: 192.168.15.85
          port: 2244
        auth:
          password: secret
{{< /highlight >}}

In the example, the default `connection.endpoint.port` value is replaced and the default `connection.auth.username` value is retained.


## Nested Merging Semantics

### Data Types, Node Types, and Node Template

In this example, a data type `datatypes.Data1` is defined with three properties that have their default values set.
Next, a node type `nodes.MyApp` that has a `data1` property of type `datatypes.Data1` is defined. In this type, the single nested property `prop2` of the `data1` property is overridden. Finally, a node template `my_app` of type `nodes.MyApp` is configured. This node template overrides another single nested property, `prop3` of the `data1` property.

{{< highlight yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

data_types:

  datatypes.Data1:
    properties:
      prop1:
        default: prop1_default
      prop2:
        default: prop2_default
      prop3:
        default: prop3_default

node_types:

  nodes.MyApp:
    properties:
      data1:
        type: datatypes.Data1
        default:
          prop2: prop2_override

node_templates:

  my_app:
    type: nodes.MyApp
    properties:
      data1:
        prop3: prop3_override

{{< /highlight >}}

After the blueprint is parsed, the `my_app` node template properties will be:

{{< highlight yaml >}}
data1:
  prop1: prop1_default
  prop2: prop2_override
  prop3: prop3_override
{{< /highlight >}}

This also applies for compound data types, for example:

{{< highlight yaml >}}
data_types:
  datatypes.Data1:
    ...

  datatypes.Data2:
    properties:
      data1:
        type: datatypes.Data1
        default:
          prop2: prop2_override
{{< /highlight >}}

In which case, `datatypes.Data2`'s `data1` property default value will be:
{{< highlight yaml >}}
data1:
  prop1: prop1_default
  prop2: prop2_override
  prop3: prop3_default
{{< /highlight >}}

## Nested Merging and Inheritance

When a node type derives from another node type, if it overrides a property that has a custom data type and it keeps that type explicitly, a similar nested merging logic will apply, as described previously. For example:

{{< highlight yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

data_types:

  datatypes.Data1:
    properties:
      prop1:
        default: prop1_default
      prop2:
        default: prop2_default
      prop3:
        default: prop3_default

node_types:

  nodes.MyApp:
    properties:
      data2:
        type: datatypes.Data1
        default:
          prop2: prop2_override

  nodes.DerivedFromMyApp:
    derived_from: nodes.MyApp
    properties:
      data2:
        type: datatypes.Data1
        default:
          prop3: prop3_override

node_templates:

  my_app:
    type: nodes.DerivedFromMyApp
{{< /highlight >}}

After the blueprint is parsed, the `my_app` node template properties will be:

{{< highlight yaml >}}
data1:
  prop1: prop1_default
  prop2: prop2_override
  prop3: prop3_override
{{< /highlight >}}

{{% note title="Note" %}}
The nested merging semantics described in the previous section have not yet been defined in the [TOSCA simplified YAML profile](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=tosca).
{{% /note %}}
