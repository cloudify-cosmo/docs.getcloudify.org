---
layout: bt_wiki
title: Imports
category: Blueprints
draft: false
weight: 200

types_yaml_link: http://www.getcloudify.org/spec/cloudify/3.3/types.yaml
---

`imports` enable the author of a blueprint to reuse blueprint files, or parts of them, and to use predefined types (e.g. from the [types.yaml]({{< field "types_yaml_link" >}}) file).

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
  - plugin:cloudify-openstack-plugin

node_templates:
  vm:
    type: cloudify.openstack.nodes.Server
  webserver:
    type: cloudify.nodes.WebServer
{{< /gsHighlight >}}

In the above example, two files are imported: the default types.yaml file provided by Cloudify that contains the `cloudify.nodes.WebServer` [node type]({{< relref "blueprints/spec-node-types.md" >}}), and the OpenStack plugin YAML, which contains the `cloudify.openstack.nodes.Server` node type.

A few important things to know about importing YAML files:

* The `tosca_definitions_version` as stated [here]({{< relref "blueprints/spec-versioning.md" >}}) must match across imported files.
* [Groups]({{< relref "blueprints/spec-groups.md" >}}) cannot be imported and can only be defined in the main blueprint file
* Imported files can be either relative to the blueprint's root directory or be a URL (as seen above).
* You can use imports within imported files and nest as many imports as you like.
* An error is returned if there are cyclic imports (i.e. a file is importing itself or you are attempting to import a file that is importing the file that imported it, etc..)


# Importing Plugins

In Cloudify 4.3, a new plugin import references was implemented.

That plugin import format is `plugin:PLUGIN_NAME?version=VERSION&distribution=DISTRIBUTION`.

The parameters are optional and are aimed to resolve cases when the managers have multiple similar plugins with the same name.
The optional parameters are:

 - version - the plugin version.
 - distribution - the distribution that the plugin was build for, for example: centos.
 
