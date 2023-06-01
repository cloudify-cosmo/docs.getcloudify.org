---
title: Imports
category: Blueprints
draft: false
weight: 200
aliases: /blueprints/spec-imports/

types_yaml_link: http://www.getcloudify.org/spec/cloudify/5.0.0/types.yaml
---

`imports` enable the author of a blueprint to reuse blueprint files, or parts of them, and to use predefined types (e.g. from the [types.yaml]( http://www.getcloudify.org/spec/cloudify/6.4.0/types.yaml ) file).

{{% note title="Note" %}}
Beginning with [definitions version]({{< relref "developer/blueprints/spec-versioning.md" >}}) `cloudify_dsl_1_4`, you can also import `inputs`, `node_templates` and `outputs` multiple times.
{{% /note %}}

# Declaration

{{< highlight  yaml >}}
imports:
  - ...
  - ...
{{< /highlight >}}


# Example 1

{{< highlight  yaml >}}

imports:
  - {{< field "types_yaml_link" >}}
  - plugin:cloudify-openstack-plugin

node_templates:
  vm:
    type: cloudify.openstack.nodes.Server
  webserver:
    type: cloudify.nodes.WebServer
{{< /highlight >}}

# Example 2

{{< highlight  yaml >}}

imports:
  - cloudify/types/types.yaml
  - plugin:cloudify-openstack-plugin

node_templates:
  vm:
    type: cloudify.openstack.nodes.Server
  webserver:
    type: cloudify.nodes.WebServer
{{< /highlight >}}

In the above example, two files are imported: the default types.yaml file provided by {{< param product_name >}} that contains the `cloudify.nodes.WebServer` [node type]({{< relref "developer/blueprints/spec-node-types.md" >}}), and the OpenStack plugin YAML, which contains the `cloudify.openstack.nodes.Server` node type.

A few important things to know about importing YAML files:

* The `tosca_definitions_version` as stated [here]({{< relref "developer/blueprints/spec-versioning.md" >}}) of the imported files must not exceed the number declared in the root file (i.e. you can import `types.yaml` declared with `cloudify_dsl_1_3` into a blueprint with `cloudify_ds_1_4`, but not the other way round).
* [Groups]({{< relref "developer/blueprints/spec-groups.md" >}}) cannot be imported and can only be defined in the main blueprint file
* Imported files can be either relative to the blueprint's root directory or be a URL (as seen above).
* You can use imports within imported files and nest as many imports as you like.
* An error is returned if there are cyclic imports (i.e. a file is importing itself or you are attempting to import a file that is importing the file that imported it, etc..)


# Importing Plugins

The plugin import format is `plugin:PLUGIN_NAME?version=VERSION&distribution=DISTRIBUTION`.

The parameters are optional and are aimed to resolve cases when the managers have multiple similar plugins with the same name.
The optional parameters are:

 * `version` - the plugin version in a PEP440 compatible format, for example "`..?version= >=2.1, !=2.1.3...`". <br>
 *Note: if you specify a version without an operator prefix, e.g. "`..?version=..., 1.2, ...`", then that will be translated to "`..?version=..., ===1.2, ...`".*
 * `distribution` - the distribution that the plugin was build for, for example: centos.

## Updating plugins in a collection of deployments

The version range allows you to be more flexible with how you maintain your plugins versioning.
If you've introduced a new plugin version and would like to update all the plugins of the deployments of some blueprint,
you're in luck. You can perform a _plugins update_.

You can find more information on the CLI command [here](/cli/orch_cli/plugins/#update).

# Namespace
You can import any resource and add a namespace context to all included {{< param product_name >}} DSL elements, with
the exception of adding namespace to {{< param product_name >}} basic types.

Import command with a namespace format is `namespace--RESOURCE`.

When a context of a namespace is added to a resource, all possible DSL elements that can be referenced from
the using blueprint's DSL elements will get the namespace prefix (`namespace--RESOURCE`). For example: node_type, data_types,
inputs elements will get the namespace prefix, but specific node_type properties will not be namespaced because they can not
be referenced from outside the context of that node type.

## Namespace value validations
A single very basic rule is enforced on namespace possible values, they can not contain the namespace delimiter '--' as a part of them.
So the following namespace patterns are **not valid** options:

* --namespace--RESOURCE
* name--space--RESOURCE
* ----RESOURCE
* namespace----RESOURCE

## Example

In a blueprint a namespace can be added to every kind of resource, like the following:

{{< highlight  yaml >}}

imports:
 - types--{{< field "types_yaml_link" >}}
 - plugin--plugin:cloudify-openstack-plugin
 - blueprint--blueprint:catalog_blueprint
 - local--local_blueprint.yaml
 - file_url--file://blueprint.yaml
 - ftp--ftp://other_blueprint.yaml

{{< /highlight >}}


Using an imported blueprint's resources is as following:

* Blueprint with shared definitions with the id **test_blueprint**:

{{< highlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

inputs:
    some_input:
        description: Some input here.

node_types:
    test_type:
        properties:
          prop1:
            default: value

{{< /highlight >}}

* Application blueprint:

{{< highlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

imports:
    - some_namespace--test_blueprint

inputs:
    some_other_input:
        description: Some other input here.

node_types:
    other_type:
        derived_from: some_namespace--test_type:
        properties:
          prop1:
            default: { get_input: some_namespace--some_input }

{{< /highlight >}}

# Importing Catalog Blueprints

A catalog blueprint package (an uploaded blueprint to the {{< param cfy_manager_name >}}) can be referenced in other blueprints.

The blueprint import format is `NAMESPACE--blueprint:BLUEPRINT_ID`, while specifying a namespace is a requirement and
a namespace can only be given to a blueprint import once in a blueprint context.

This will allow you to share common blueprint definitions, just a node type or even entire architectures (like a common
micro-service blueprint) or any other blueprint definitions, across any blueprint and reduce blueprint definitions
duplication.

Note that in order to upload a blueprint using this kind of import command that imported blueprint must be already been
uploaded. You also wouldn't be able to delete an imported catalog blueprint when it's in use by other blueprints until
you delete it's users or force delete it.

## Example

{{< highlight  yaml >}}

imports:
 - namespace--blueprint:my_blueprint_id

 node_types:
    type_from_catalog_blueprint:
        derived_from: cloudify.nodes.Compute

{{< /highlight >}}
