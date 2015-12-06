---
layout: bt_wiki
title: Inputs
category: Blueprints
publish: true
weight: 300

---

# Declaration

{{< gsHighlight  yaml >}}
inputs:

  input1:
    ...
  input2:
    ...
{{< /gsHighlight >}}


# Definition

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | string      | An optional description for the input.
type        | no       | string      | Represents the required data type of the input. Not specifying a data type means the type can be anything. Valid types: string, integer, boolean
default     | no       | \<any\>     | An optional default value for the input.


<br>


Example:

{{< gsHighlight  yaml >}}

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

{{< /gsHighlight >}}

`get_input` is a special function which allows the user to use inputs throughout the blueprint. For more information see [intrinsic_functions](blueprints-spec-intrinsic-functions.html#get-input).