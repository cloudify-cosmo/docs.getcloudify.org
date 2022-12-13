---
title: Inputs
category: Blueprints
draft: false
weight: 300
aliases: /blueprints/spec-inputs/
---

`inputs` are parameters that are injected into a blueprint when a deployment is created. These parameters can be referenced by using the [get_input]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get_input" >}}) intrinsic function.

Inputs are useful when there is a need to inject parameters in the blueprint that were unknown when the blueprint was created, and they can be used for distinction between different deployments of the same blueprint.

{{% note title="Note" %}}
Beginning with [definitions version]({{< relref "developer/blueprints/spec-versioning.md" >}}) `cloudify_dsl_1_4`, you can also import `inputs` multiple times.
{{% /note %}}

{{% note title="Note" %}}
Also note that you can pass multiple `-i`  flags in the CLI, to pass multiple input structures or to pass wildcard-based paths to input files (e.g. `... -i *.yaml`) and directories containing input files (e.g. `... -i my_inputs_file_dir/`)
{{% /note %}}

# Declaration

{{< highlight  yaml >}}
inputs:

  input1:
    ...
  input2:
    ...
{{< /highlight >}}

# Schema

| Keyname       | Required | Type          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|---------------|----------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| description   | no       | string        | An optional description for the input.                                                                                                                                                                                                                                                                                                                                                                                                                |
| type          | no       | string        | The required data type of the input. Not specifying a data type means the type can be anything, including a list, an array or a dictionary. Valid types: `string`, `integer`, `float`, `boolean`, `list`, `dict`, `regex`, `textarea`, `blueprint_id`, `deployment_id`, `secret_key`, `capability_value`, `scaling_group`, `node_id`, `node_type`, `node_instance`, `operation_name` or a [custom data type]({{< relref "developer/blueprints/spec-data-types.md" >}}). |
| item_type     | no       | string        | Definition of items' type, only valid for `list` type, if none is provided the items' type can be anything.                                                                                                                                                                                                                                                                                                                                           |
| default       | no       | \<any\>       | An optional default value for the input, not available for `blueprint_id`, `deployment_id`, `secret_key`, `capability_value`, `scaling_group`, `node_id`, `node_type`, `node_instance`, `operation_name` types.                                                                                                                                                                                                                                        |
| constraints   | no       | list of dicts | The constraints the input value must comply with. Read more details about the format and usage of the constraints in the Constraints section below.                                                                                                                                                                                                                                                                                                   |
| required      | no       | boolean       | a boolean value to indicate whether the input is required `must be passed` or not, by default all inputs are required.                                                                                                                                                                                                                                                                                                                                |
| display_label | no       | string        | Used in UI instead of the input's name to describe the input.                                                                                                                                                                                                                                                                                                                                                                                         |
| hidden        | no       | boolean       | Used in UI to determine if input should be hidden or not (default).                                                                                                                                                                                                                                                                                                                                                                                   |
| display       | no       | dict          | Hints for the UI on how to display the field.                                                                                                                                                                                                                                                                                                                                                                                                         |

_Note: `display` key is valid only for inputs of type `textarea`, it can contain only a number of rows to be used to display the field.  See the example below._

_Note: if you specify a custom `data_type` in the `type` field, a property validation will occur. See the example below._

# Best Pracice

As inputs provides an option to parametrize a blueprint. As a blueprint developer you have to provide as much information as possible to ensure that the blueprint consumer understands what are the scope of each input.
`type` - Provide a type as it will ensure both input value and based on the type inputs will rendered differently in `create deployment` modal. That will provide a better experience for the blueprint cinsumer.
`display_label` - Ensure that the input name in `create deployment` modal is human readable.
`description` - Describe what the input is about

# Example

{{< highlight  yaml >}}

inputs:

  image_name:
    description: The image name of the server
    type: string
    display_label: Image Name
    default: "Ubuntu 12.04"

  extra_vm_details:
    description: Extra server details
    display_label: Extra VM Details
    type: dict
    default:
      key_name: 'my-openstack-key-name'
      all_my_flavors: [ 1, 2, 3, 4 ]

  extra_blueprint:
    description: Some additional blueprint
    type: blueprint_id

  lenghty_description:
    description: A large field for notes
    type: textarea
    display:
      rows: 20

  deployment_ids:
    description: A list of deployment IDs starting with dep
    type: list
    item_type: deployment_id
    constraints:
      - name_pattern:
          starts_with: dep

node_templates:

  vm:
    type: cloudify.openstack.nodes.Server
    display_label: Virtual Machine Details
    properties:
      server:
        image_name: { get_input: image_name }
        key_name: { get_input: [ extra_vm_details, key_name ] }
        flavor: { get_input: [ extra_vm_details, all_my_flavors, 0 ] }

{{< /highlight >}}

`get_input` is a special function which enables you to use inputs throughout the blueprint. For more information see [intrinsic_functions]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-input" >}}).

## Another example, with data_types

{{< highlight yaml >}}
inputs:
  ports_conf:
    type: port_conf
    display_label: Ports Configuration
data_types:
  port_conf:
    properties:
      webserver_port1:
        type: integer
      webserver_port2:
        type: integer
{{< /highlight >}}

The `ports_conf` input that will be provided must comply with the `port_conf` data_type schema. Meaning that it must have two properties, `webserver_port1` and `webserver_port2`, and both of them must be integers.


# Constraints

## Constraint dict format

Each constraint must be in the following format:

{{< highlight  yaml >}}
{ constraint_operator: argument_or_argument_list }
{{< /highlight >}}

## List of Constraint Operators

| Operator name    | Arguments it accepts             | Value types it can validate                                                                                                 |
|------------------|----------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| equal            | scalar                           | any                                                                                                                         |
| greater_than     | scalar                           | comparable                                                                                                                  |
| greater_or_equal | scalar                           | comparable                                                                                                                  |
| less_than        | scalar                           | comparable                                                                                                                  |
| less_or_equal    | scalar                           | comparable                                                                                                                  |
| in_range         | list of two scalars              | comparable                                                                                                                  |
| valid_values     | list of valid values             | any                                                                                                                         |
| length           | scalar                           | string, list, dict                                                                                                          |
| min_length       | scalar                           | string, list, dict                                                                                                          |
| max_length       | scalar                           | string, list, dict                                                                                                          |
| pattern          | string (that represents a regex) | string                                                                                                                      |
| filter_id        | string                           | blueprint_id, deployment_id                                                                                                 |
| labels           | list of dicts of size one        | blueprint_id, deployment_id                                                                                                 |
| tenants          | list of strings                  | blueprint_id, deployment_id                                                                                                 |
| name_pattern     | dict                             | blueprint_id, deployment_id, capability_value, scaling_group, secret_key, node_id, node_type, node_instance, operation_name |
| deployment_id    | string                           | capability_value, scaling_group, node_id, node_type, node_instance, operation_name                                          |

### `name_pattern` details

The `name_pattern` constraint applies to various data types.  There are different fields
(attributes) being compared to.  In the following table we have included information on the
specifics of these fields.

| Data type        | Cloudify object | Attribute of the object being compared |
|:-----------------|:----------------|:---------------------------------------|
| blueprint_id     | `blueprint`     | `id`                                   |
| deployment_id    | `deployment`    | `display_name`                         |
| capability_value | `deployment`    | value of one of the `capabilities`     |
| scaling_group    | `deployment`    | name of one of the `scaling_groups`    |
| secret_key       | `secret`        | `key` (also known as `id`)             |
| node_id          | `node`          | `id`                                   |
| node_type        | `node`          | `type`                                 |
| node_instance    | `node_instance` | `id`                                   |
| operation_name   | `node`          | keys of `operations` dictionary        |

Following criteria might be used to declare `name_pattern` (all accept strings as their parameters):

Criterion   | Description                                       | Example
----------- | ------------------------------------------------- | -------
starts_with | attribute must start with a given string          | `starts_with: dep`
ends_with   | attribute must end with a given string            | `ends_with: _one`
contains    | attribute must contain a given string             | `contains: deployment`
equals_to   | attribute must be equal to the parameter provided | `equals_to: deployment_one`

### `deployment_id` details

The `deployment_id` constraint for is required most of the time, but sometimes can be omitted, in
which case we are going to use some defaults:

#### Deployment inputs

For inputs of type `capability_value` and `node_instance`, the `deployment_id` cannot be omitted.
The other four types (`node_id`, `node_type`, `operation_name` and `scaling_group`) can have that
constraint not defined in a blueprint, the default would be then to look for the objects defined
within the blueprint.  For example:

{{< highlight  yaml >}}
inputs:
  some_node_id:
    description: Identifier of some node
    type: node_id
  some_operation_name:
    description: A name of an operation
    type: operation_name

node_templates:
  first_node:
    type: cloudify.nodes.Root
  second_node:
    type: cloudify.nodes.Root
{{< /highlight >}}

The valid values for `some_node_id` (note lack of `deployment_id` constraint) are going to be
`first_node` and `second_node`.  And `some_operation_name`  accepts any operation defined for
`cloudify.nodes.Root`.


#### Workflow parameters

For all data typed which rely on `deployment_id` constraint, if it is not provided, the default
value will be the identifier of a deployment the workflow is running on.  For example:

{{< highlight  yaml >}}
workflows:
  test_parameters:
    mapping: test_parameters.py
    parameters:
      capa:
        description: A capability value
        type: capability_value

capabilities:
  one:
    value: "one"
  two:
    value: "two"
{{< /highlight >}}

The `test_parameters` workflow is going to accept either `one` or `two` as `capa` parameter's value.

## Constraints by input type

Operator name      | Arguments it accepts             | Value types it can validate
------------------ | -------------------------------- | --------------------------
equal              | scalar                           | any
greater_than.      | scalar                           | comparable
greater_or_equal   | scalar                           | comparable
less_than          | scalar                           | comparable
less_or_equal      | scalar                           | comparable
in_range           | list of two scalars              | comparable
valid_values       | list of valid values             | any
length             | scalar                           | string, list, dict
min_length         | scalar                           | string, list, dict
max_length         | scalar                           | string, list, dict
pattern            | string (that represents a regex) | string

Although there is not restriction between the input type and constraints, It's recommended to use the following constraints per each input type

### String Constraints

Operator name      | Arguments it accepts             | Value types it can validate
------------------ | -------------------------------- | --------------------------
valid_values       | list of valid values             | any
length             | scalar                           | string, list, dict
min_length         | scalar                           | string, list, dict
max_length         | scalar                           | string, list, dict
pattern            | string (that represents a regex) | string

### Integer and Float Constraints

Operator name      | Arguments it accepts             | Value types it can validate
------------------ | -------------------------------- | --------------------------
equal              | scalar                           | any
greater_than.      | scalar                           | comparable
greater_or_equal   | scalar                           | comparable
less_than          | scalar                           | comparable
less_or_equal      | scalar                           | comparable
in_range           | list of two scalars              | comparable


## Example

In the following example, the `image_name` input must comply with the given regex, otherwise an error is displayed.

{{< highlight  yaml >}}
inputs:
  image_name:
    description: The image name of the server
    type: string
    default: "Ubuntu 12.04"
    constraints:
      - pattern: "Ubuntu \\d{2}\\.04"
{{< /highlight >}}
**Note** the use of the double backslashes with regex escape characters.
Alternatively you can use the YAML raw literal syntax (`|`), as follows:
```txt
    constraints:
      - pattern: |-
          Ubuntu \d{2}\.04
```

In the next example, the `additional_blueprint` input must an identifier of a blueprint, which
exists in the system and is visible to the tenant/user in the operation's context.  On top of that,
a blueprint must be owned either by `default_tanant` or `other_tenant` and meet requirements
of `shared-blueprints` blueprint filter.   If any of these criteria is not met, an error
is displayed.

{{< highlight  yaml >}}
inputs:
  additional_blueprint:
    description: An additional blueprint
    type: blueprint_id
    constraints:
      - filter_id: shared-blueprints
      - tenants:
          - default_tenant
          - other_tenant
{{< /highlight >}}

The following example shows the `master_deployment` input, which must be a valid identifier of a
deployment (visible to the tenant/user).  On top of that, a deployment's (display) name must contain
string `shared` and it should have these two labels set: `csys-obj-type=service` and `obj-type=k8s`.

{{< highlight  yaml >}}
inputs:
  master_deployment:
    description: A master deployment
    type: deployment_id
    constraints:
      - labels:
          - csys-obj-type: service
          - obj-type: k8s
      - name_pattern:
          contains: shared
{{< /highlight >}}

In the example below, `my_app_port` is an input which must match the value of `port` capability of
of `app01` deployment.  Keep in mind, that `deployment_id` is a *required constraint* for the
`capability_value` data type.

{{< highlight yaml >}}
inputs:
  my_app_port:
    description: A port my application listens on
    type: capability_value
    constraints:
      - name_pattern:
          equals_to: port
      - deployment_id: app01
{{< /highlight >}}

The next example contains a few other inputs of data-based types:

* `my_token` is an input which will match any key of a secret present in the system, which ends
  with "token",
* `app_scaling_group` will match the names of `app` deployment's scaling groups,
* `app_node_id_a_z` will match any identifier of the node present in the `app` deployment, which
  start with "a" and end with "z",
* `app_node_type` will match any type of the node present in the `app` deployment, which
  contains a string "Compute".

{{< highlight yaml >}}
inputs:
  my_token:
    type: secret_key
    constraints:
      - name_pattern:
          ends_with: token
  app_scaling_group:
    type: scaling_group
    constraints:
      - deployment_id: app
  app_node_id_a_z:
    type: node_id
    constraints:
      - name_pattern:
          starts_with: a
          ends_with: z
      - deployment_id: app
  app_node_type:
    type: node_type
    constraints:
      - name_pattern:
          contains: Compute
      - deployment_id: app
{{< /highlight >}}

## Common used inputs

### Port

Port numbers range from 0 to 65536

```
inputs:
  port:
    type: integer
    display_label: Port
    constraints:
      - greater_or_equal: 0
      - less_or_equal: 65536
```
### URL

URL starts with HTTP/HTTPS:

```
inputs:
  url:
    type: string
    display_label: URL
    constraints:
      - pattern: '^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$'
```

Not require HTTP protocol:

```
inputs:
  url:
    type: string
    display_label: URL
    constraints:
      - pattern: '^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$'
```

### CIDR

```
inputs:
  cidr:
    type: string
    display_label: CIDR
    constraints:
      - pattern: '^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$'
```

### IPv4

```
inputs:
  ipv4:
    type: string
    display_label: IPv4
    constraints:
      - pattern: '^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$'
```

### IPv6
```
inputs:
  ipv6:
    type: string
    display_label: IPv6
    constraints:
      - pattern: '^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$'
```

