---
layout: bt_wiki
title: Imports
category: Blueprints
draft: false
weight: 200

types_yaml_link: http://www.getcloudify.org/spec/cloudify/3.4.1/types.yaml
---

`imports` allow the author of a blueprint to reuse blueprint files or parts of them and use predefined types (e.g. from the [types.yaml]({{< field "types_yaml_link" >}}) file).

{{% gsNote title="Note" %}}
Beginning with [definitions version]({{< relref "blueprints/spec-versioning.md" >}}) `cloudify_dsl_1_3`, you can also import `inputs`, `node_templates` and `outputs` multiple times.
{{% /gsNote %}}

# Declaration

{{< gsHighlight  yaml >}}
imports:
  - ...
  - ...
{{< /gsHighlight >}}


# Example

{{< gsHighlight  yaml >}}

imports:
  - {{< field "types_yaml_link" >}}
  - my_yaml_files/openstack_types.yaml

node_templates:
  vm:
    type: cloudify.openstack.nodes.Server
  webserver:
    type: cloudify.nodes.WebServer
{{< /gsHighlight >}}

In the above example, we import the default types.yaml file provided by Cloudify which contains the `cloudify.nodes.WebServer` [node type]({{< relref "blueprints/spec-node-types.md" >}}) and a custom YAML we created for our custom OpenStack plugin containing the `cloudify.openstack.nodes.Server` node type.

A few important things to know about importing YAML files:

* Imported files can be either relative to the blueprint's root directory or be a URL (as seen above).
* You can use imports within imported files and nest as many imports as you like.
* An error will be raised if there are cyclic imports (i.e. a file is importing itself or importing a file which is importing the file that imported it, etc..)
* [Groups]({{< relref "blueprints/spec-groups.md" >}}) cannot be imported and can only be defined in the main blueprint file
* The `tosca_definitions_version` as stated [here]({{< relref "blueprints/spec-versioning.md" >}}) must match between imported files.
