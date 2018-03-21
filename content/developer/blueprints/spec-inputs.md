---
layout: bt_wiki
title: Inputs
category: Blueprints
draft: false
weight: 300

---

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

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | string      | An optional description for the input.
type        | no       | string      | The required data type of the input. Not specifying a data type means the type can be anything, including a list, an array or a dictionary. Valid types: `string`, `integer`, `boolean`.
default     | no       | \<any\>     | An optional default value for the input.

# Example

{{< highlight  yaml >}}

inputs:

  image_name:
    description: The image name of the server
    type: string
    default: "Ubuntu 12.04"

node_templates:

  vm:
    type: cloudify.openstack.nodes.Server
    properties:
      server:
        image_name: { get_input: image_name }

{{< /highlight >}}

`get_input` is a special function which enables you to use inputs throughout the blueprint. For more information see [intrinsic_functions]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-input" >}}).