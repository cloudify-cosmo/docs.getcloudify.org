---
layout: bt_wiki
title: Data Types
category: Blueprints
draft: false
weight: 1600

---

`data_types` are useful for grouping together and re-using a common set of properties, along with their types and default values.

# Supported Since

To use `data_types`, the [definitions version]({{< relref "blueprints/spec-versioning.md" >}}) must be `cloudify_dsl_1_2` or greater.


# Declaration

{{< gsHighlight yaml >}}

data_types:

  data_type1:
    description: ...
    properties: ...

  data_type2:
    derived_from: data_type1
    description: ...
    properties: ...

{{< /gsHighlight >}}


# Schema

Keyname      | Required | Type        | Description
-----------  | -------- | ----        | -----------
description  | no       | string      | Description for the data type.
properties   | no       | dictionary  | Dictionary of the data type properties.
derived_from | no       | string      | Parent data type.

## description

This property may be used to describe the data type.

## properties

The `properties` property is used to define the data type schema.

`properties` is a dictionary from a property name to a dictionary describing the property.
### Property Schema:

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | string      | Description for the property.
type        | no       | string      | Property type. Not specifying a data type means the type can be anything (including types not listed in the valid types). Valid types: string, integer, float, boolean or a another custom data type.
default     | no       | \<any\>     | An optional default value for the property.
required    | no       | boolean     | Specifies whether the property is required. (Default: `true`, Supported since: [cloudify_dsl_1_2]({{< relref "blueprints/spec-versioning.md" >}}))

## derived_from

The `derived_from` property may be used to build over and extend an existing data type.

When a data type derives from another data type, its `properties` get merged with the parent's `properties`. The merge is on the property level: A property defined on the parent type will be overridden by a property with the same name defined on the deriving type. An exception to this rule is when a property `type` references some other custom data type. This will be explained in detail in the following examples section.


# Features and Examples

## Basic Usage

In the following example, we define a `my.datatypes.Endpoint` data type with two properties: `ip` and `port`.
Next, we define a node type `DatabaseService` to represnt some external database service. In this type's properties, we define an `endpoint` property who's type is the endpoint data type previously defined. Lastly, we define a node template with a `DatabaseService` type. This node template fully configures the endpoint properties (i.e. the `ip` and `port`).

{{< gsHighlight yaml >}}
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
{{< /gsHighlight >}}

## Schema Validations

If we were to miss a property or specify an additional property under `endpoint`, the blueprint will fail validation. For example

{{< gsHighlight yaml >}}
node_templates:
  my_db_service2:
    type: DatabaseService
    properties:
      endpoint:
        ip: 192.168.15.85
{{< /gsHighlight >}}

will fail validation on missing `port` property. (Note that if `port` had its `required` attribute set to `false`, no validation failure would take place)

and
{{< gsHighlight yaml >}}
node_templates:
  my_db_service3:
    type: DatabaseService
    properties:
      endpoint:
        ip: 192.168.15.85
        port: 2233
        some_other_property: the_value
{{< /gsHighlight >}}

will fail validation on unexpected `some_other_property` that is not specified in `endpoint`'s schema.

## Inheritance

We can derive from previously defined data types to extend their schema. For example, consider the `my.datatypes.Endpoint` defined in the previous example. We can derive from it, to create an endpoint data type that also includes a user name.

{{< gsHighlight yaml >}}
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
{{< /gsHighlight >}}

## Composition

Data type property types can be other data types themselves. We will reuse the previously defined `my.datatypes.Endpoint`. This time, we will create a `my.datatypes.Connection` that will hold endpoint information + authentication details.

{{< gsHighlight yaml >}}
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
{{< /gsHighlight >}}

## Default Values

Default values can help make highly configurable components easy to use by setting default values where it makes sense. Consider our previously defined `my.datatypes.Connection`. We can simplify its usage if we know that `port` by default will be `2233` and username by default will be `admin`.

{{< gsHighlight yaml >}}
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
{{< /gsHighlight >}}

Notice how the `my_db_service` node template only specified the `connection.endpoint.ip` and `connection.auth.password`. The other properties got the default `2233` port and `admin` user.

## Overriding Default Values

As its name implies, default values are of course, just defaults. As such, you can override them in same way you would configure properties without default values. For example:

{{< gsHighlight yaml >}}
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
{{< /gsHighlight >}}

Here we have overridden the default `connection.endpoint.port` value and kept the default `connection.auth.username` value.


## Nested Merging Semantics

### Data Type &#8592; Node Type &#8592; Node Template

In this example, we define a data type `datatypes.Data1` with three properties that have their default values set.
Next, we define a node type `nodes.MyApp` which has a `data1` property of type `datatypes.Data1`. In this type, we override a single nested property `prop2` of the `data1` property. Finally, we configure a node template `my_app` of type `nodes.MyApp`. This node template overrides another single nested property `prop3` of the `data1` property.

{{< gsHighlight yaml >}}
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

{{< /gsHighlight >}}

After the blueprint is parsed, the `my_app` node template properties will be:

{{< gsHighlight yaml >}}
data1:
  prop1: prop1_default
  prop2: prop2_override
  prop3: prop3_override
{{< /gsHighlight >}}

This also applies for compound data types, for example:

{{< gsHighlight yaml >}}
data_types:
  datatypes.Data1:
    ...

  datatypes.Data2:
    properties:
      data1:
        type: datatypes.Data1
        default:
          prop2: prop2_override
{{< /gsHighlight >}}

In which case, `datatypes.Data2`'s `data1` property default value will be:
{{< gsHighlight yaml >}}
data1:
  prop1: prop1_default
  prop2: prop2_override
  prop3: prop3_default
{{< /gsHighlight >}}

## Nested Merging and Inheritance

When a node type derives from another node type, if it overrides a property who's type is a custom data type and keeps that type explicitly, a similar nested merging logic will apply as described previously. For example:

{{< gsHighlight yaml >}}
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
{{< /gsHighlight >}}

After the blueprint is parsed, the `my_app` node template properties will be:

{{< gsHighlight yaml >}}
data1:
  prop1: prop1_default
  prop2: prop2_override
  prop3: prop3_override
{{< /gsHighlight >}}

{{% gsNote title="Note" %}}
The nested merging semantics described in the previous section is not yet defined in the [TOSCA simplified YAML profile](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=tosca).
{{% /gsNote %}}
