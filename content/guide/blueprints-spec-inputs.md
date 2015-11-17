---
layout: bt_wiki
title: Inputs
category: Blueprints
publish: true
pageord: 300

---

## Inputs Declaration

The inputs section is a hash where each item in the hash represents an input.

{{< gsHighlight  yaml >}}
inputs:
  input1:
    ...
  input2:
    ...
{{< /gsHighlight >}}


### Input Definition

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | description | An optional description for the input.
type        | no       | string      | Represents the required data type of the input. Not specifying a data type means the type can be anything. Valid types: string, integer, boolean
default     | no       | \<any\>     | An optional default value for the input.


<br>


Example:

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_0

imports:
  - http://www.getcloudify.org/spec/cloudify/3.2/types.yaml
  - http://www.getcloudify.org/spec/openstack-plugin/1.2/plugin.yaml

inputs:
  image_name:
    description: The server's image name
    type: string
    default: "Ubuntu 12.04"

node_templates:
  vm:
    type: cloudify.openstack.nodes.Server
    properties:
      server:
        image_name: { get_input: image_name }
{{< /gsHighlight >}}

