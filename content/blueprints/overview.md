---
layout: bt_wiki
title: Overview
category: Docs
draft: false
weight: 1

---

Blueprints are YAML documents written in Cloudify's DSL (Domain Specific Language), which is based on [TOSCA](https://www.oasis-open.org/committees/tosca/). Your blueprints will describe the logical representation, or topology, of an application or infrastructure. 

Blueprints are packaged into a *blueprint archive*, which contains a main blueprint YAML file, and any other resources that you want to include, such as scripts, imports, etc. For more information, [click this link]({{< relref "manager/packaging-blueprints.md" >}}).


## Blueprint Elements
Blueprints comprise several high-level sections:


### Tosca Definitions Version

`tosca_definitions_version` is a top-level property of the blueprint that is used to specify the DSL version used.
For Cloudify 4.2, the versions that are currently defined are `cloudify_dsl_1_0`, `cloudify_dsl_1_1`, `cloudify_dsl_1_2`, and `cloudify_dsl_1_3`.

Always use the latest DSL version unless you know of a good reason not to.

For more information about the `tosca_definitions_version`, see the [specification]({{< relref "blueprints/spec-versioning.md" >}}).


### DSL Definitions

`dsl_definitions` are used to define arbitrary data structures that can then be reused in different parts of the blueprint using [YAML anchors and aliases](https://gist.github.com/ddlsmurf/1590434).

For more information about `dsl_definitions`, see the [specification]({{< relref "blueprints/spec-dsl-definitions.md" >}}).


### Imports

Import other YAML files to be parsed with the current blueprint file.

For more information about `imports`, see the [specification]({{< relref "blueprints/spec-imports.md" >}}).


### Plugins

The `plugins` specification configures the plugin execution method, package information, and distribution information.

Together with node-types, data-types, relationships, and workflows, these are often found in "plugin.yaml"s instead of proper blueprints.


### Node Types

Node types define the implementation and base properties for [node-templates]({{< relref "blueprints/spec-node-templates.md" >}}). 

For more information about `node_types` see the [specification]({{< relref "blueprints/spec-node-types.md" >}}).

Together with data-types, relationships, workflows, and plugins, these are often found in "plugin.yaml"s instead of proper blueprints.


### Data Types

`data_types` enable grouping and re-use of a common set of properties, together with their types and default values.

For more information about `data_types`, see the [specification]({{< relref "blueprints/spec-data-types.md" >}}).

Together with node-types, relationships, workflows, and plugins, these are often found in "plugin.yaml"s instead of proper blueprints.


### Relationships

Relationships provide implementation maapings for relationship operations.

For more information about `relationships` see the [specification]({{< relref "blueprints/spec-relationships.md" >}}).

Together with node-types, data-types, workflows, and plugins, these are often found in "plugin.yaml"s instead of proper blueprints.


### Workflows

Workflows define a set of tasks that can be executed on a node or a group of nodes, and the execution order of those tasks, serially or in parallel. A task may be an operation implemented by a plugin, but it could also be other actions, including arbitrary code.

For more information about `workflows`, see the [specification]({{< relref "blueprints/spec-workflows.md" >}}).

Together with node-types, data-types, relationships, and plugins, these are often found in "plugin.yaml"s instead of proper blueprints.


### Inputs

Inject blueprint parameters when you create your deployment.

These parameters can be referenced using the [get_input]({{< relref "blueprints/spec-intrinsic-functions.md#get-input" >}}) intrinsic function.

For more information about `inputs`, see the [specification]({{< relref "blueprints/spec-inputs.md" >}}).


### Node Templates

Node templates are used in a blueprint to indicate when you want to deploy one or more instances of a node-type.

For more information about `node_templates`, see the [specification]({{< relref "blueprints/spec-node-templates.md" >}}).


### Outputs

Outputs are special values that you want to make readable to certain authenticated Cloudify users via the UI, CLI, or API. For example these may be consumed by another deployment via the [Deployment Proxy]({{< relref "plugins/utilities.md" >}})

For more information about `outputs` see the [specification]({{< relref "blueprints/spec-outputs.md" >}}).


### Intrinsic Functions

You can assign values in a blueprint at runtime via intrinsic functons.

For more information about `instrinsic_functions`, see the [specification]({{< relref "blueprints/spec-intrinsic-functions.md" >}}).


### Interfaces

Interfaces map logical tasks to executable operations.

For more information about `interfaces`, see the [specification]({{< relref "blueprints/spec-interfaces.md" >}}).


### Groups

`groups` enable configuration of shared behavior for different `node_templates`.

For more information about `groups`, see the [specification]({{< relref "blueprints/spec-groups.md" >}}).


### Policy Types

`policies` enable a stream of events that correspond to a group of nodes and their instances to be analyzed.

For more information about `policy_types`, see the [specification]({{< relref "blueprints/spec-policy-types.md" >}}).


### Policy Triggers

`policy_triggers` enable actions to be declared that can be invoked by policies.

For more information about `policy_triggers`, see the [specification]({{< relref "blueprints/spec-policy-triggers.md" >}}).


### Import Resolver

An `import_resolver` is used to resolve imports during blueprint parsing.

For more information about `import_resolver`, see the [specification]({{< relref "blueprints/import-resolver.md" >}}).


### Upload Resources

`upload_resources` enables resources to be uploaded to Cloudify Manager that could be used by blueprints.

For more information about `upload_resources`, see the [specification]({{< relref "blueprints/spec-upload-resources.md" >}}).
