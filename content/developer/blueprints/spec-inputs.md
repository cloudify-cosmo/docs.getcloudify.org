---
layout: bt_wiki
title: Inputs
category: Blueprints
draft: false
weight: 300
aliases: /blueprints/spec-inputs/
---

{{%children style="h3" description="true"%}}

`inputs` are parameters that are injected into a blueprint when a deployment is created. These parameters can be referenced by using the [get_input]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get_input" >}}) intrinsic function.

Inputs are useful when there is a need to inject parameters in the blueprint that were unknown when the blueprint was created, and they can be used for distinction between different deployments of the same blueprint.

{{% note title="Note" %}}
Beginning with [definitions version]({{< relref "developer/blueprints/spec-versioning.md" >}}) `cloudify_dsl_1_3`, you can also import `inputs` multiple times.

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

Keyname     | Required | Type           | Description
----------- | -------- | ----           | -----------
description | no       | string         | An optional description for the input.
type        | no       | string         | The required data type of the input. Not specifying a data type means the type can be anything, including a list, an array or a dictionary. Valid types: `string`, `integer`, `float`, `boolean`, `list`, `dict`, `regex` or a [custom data type]({{< relref "developer/blueprints/spec-data-types.md" >}}).
default     | no       | \<any\>        | An optional default value for the input.
constraints | no       | list of dicts  | The constraints the input value must comply with. Read more details about the format and usage of the constraints in the Constraints section below.
required    | no       | boolean        | a boolean value to indicate whether the input is required `must be passed` or not.

_Note: if you specify a custom `data_type` in the `type` field, a property validation will occur. See the example below._
# Example

{{< highlight  yaml >}}

inputs:

  image_name:
    description: The image name of the server
    type: string
    default: "Ubuntu 12.04"

  extra_vm_details:
    description: Extra server details
    default:
        key_name: 'my-openstack-key-name'
        all_my_flavors: [ 1, 2, 3, 4 ]

node_templates:

  vm:
    type: cloudify.openstack.nodes.Server
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
Operator name | Arguments it accepts | Value types it can validate
------------- | -------------------- | --------------------------
equal | scalar | any
greater_than | scalar | comparable
greater_or_equal | scalar | comparable
less_than | scalar | comparable
less_or_equal | scalar | comparable
in_range | list of two scalars | comparable
valid_values | list of valid values | any
length | scalar | string, list, dict
min_length | scalar | string, list, dict
max_length | scalar | string, list, dict
pattern | string (that represents a regex) | string

## Example
In the following example, the `image_name` input must comply with the given regex, otherwise an error is displayed.
{{< highlight  yaml >}}
inputs:

  image_name:
    description: The image name of the server
    type: string
    default: "Ubuntu 12.04"
    constraints:
        - pattern: "Ubuntu \d{2}\.04"
{{< /highlight >}}
