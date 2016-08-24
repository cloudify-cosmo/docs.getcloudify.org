---

title: Overview


weight: 1

---

An application in Cloudify is described in a `blueprint` and its DSL (Domain Specific Language) is based on a standard called [TOSCA](https://www.oasis-open.org/committees/tosca/).

Blueprint files are written in YAML and describe the logical representation of an application, which we call a `topology`. In a Blueprint you will describe the application's components, how they relate to one another, how they are installed and configured and how they're monitored and maintained.

Other than the YAML itself, a Blueprint can comprise multiple resources such as configuration and installation scripts (or Puppet Manifests, or Chef Recipes, etc..), code, and basically any other resource you require for running your application.

All files in the directory that contains the blueprint's main file, are also considered part of the blueprint, and paths described in the Blueprint are relative to that directory.

Blueprints comprise several high level sections:

# tosca_definitions_version

`tosca_definitions_version` is a top level property of the blueprint which is used to specify the DSL version used.
For Cloudify 3.3, the versions that are currently defined are `cloudify_dsl_1_0`, `cloudify_dsl_1_1` and `cloudify_dsl_1_2`.

If you're just starting to use Cloudify now, you should use the latest version.

More on `tosca_definitions_version` in the [spec]({{ relRef("blueprints/spec-versioning.md") }}).


# imports

`imports` allow the author of a blueprint to reuse blueprint files or parts of them and use predefined types (e.g. from the [types.yaml]({{ types_yaml_link }}) file).

More on `imports` in the [spec]({{ relRef("blueprints/spec-imports.md") }}).


# inputs

`inputs` are parameters injected into the blueprint upon deployment creation. These parameters can be referenced by using the [get_input]({{ relRef("blueprints/spec-intrinsic-functions.md#get-input") }}) intrinsic function.

Inputs are useful when there's a need to inject parameters to the blueprint which were unknown when the blueprint was created and can be used for distinction between different deployments of the same blueprint.

More on `inputs` in the [spec]({{ relRef("blueprints/spec-inputs.md") }}).


# node_templates

`node_templates` represent the actual instances of [node types]({{ relRef("blueprints/spec-node-types.md") }}) which would eventually represent a running application/service as described in the blueprint.

`node_types` are more commonly referred to as `nodes`. nodes can comprise more than one instance. For example, you could define a node which contains two vms. Each vm will then be called a `node_instance`.


More on `node_templates` in the [spec]({{ relRef("blueprints/spec-node-templates.md") }}).


# node_types

`node_types` are used for defining common properties and behaviors for [node-templates]({{ relRef("blueprints/spec-node-templates.md") }}). `node-templates` can then be created based on these types, inheriting their definitions.

More on `node_types` in the [spec]({{ relRef("blueprints/spec-node-types.md") }}).


# outputs

`outputs` provide a way of exposing global aspects of a deployment. When deployed, a blueprint can expose specific outputs of that deployment - for instance, an endpoint of a server or any other runtime or static information of a specific resource.

More on `outputs` in the [spec]({{ relRef("blueprints/spec-outputs.md") }}).


# relationships

`relationships` let you define how nodes relate to one another. For example, a `web_server` node can be `contained_in` a `vm` node or an `application` node can be `connected_to` a `database` node.

More on `relationships` in the [spec]({{ relRef("blueprints/spec-relationships.md") }}).


# intrinsic_functions

`intrinsic_functions` are functions that can be used within blueprints. Depending on the function, evaluation occurs on deployment creation or in runtime. For example, the `get_input` intrinsic function is used to retrieve an input defined within the blueprint.

intrinsic_functions make blueprints dymanic, allowing to retrieve and set data structures in different parts of the blueprint.

More on `instrinsic_functions` in the [spec]({{ relRef("blueprints/spec-intrinsic-functions.md") }}).


# plugins

By declaring `plugins` we can install python modules and use the installed or preinstalled modules to perform different operations. We can also decide where a specific plugin's operations will be executed.

More on `plugins` in the [spec]({{ relRef("blueprints/spec-plugins.md") }}).


# interfaces

Interfaces provide a way to map logical tasks to executable operations.

More on `interfaces` in the [spec]({{ relRef("blueprints/spec-interfaces.md") }}).


# workflows

`workflows` define a set of tasks that can be executed on a node or a group of nodes, and the execution order of these tasks, serially or in parallel. A task may be an operation (implemented by a plugin), but it may also be other actions, including arbitrary code.

More on `workflows` in the [spec]({{ relRef("blueprints/spec-workflows.md") }}).


# groups

`groups` provide a way of configuring shared behavior for different sets of`node_templates`.

More on `groups` in the [spec]({{ relRef("blueprints/spec-groups.md") }}).


# dsl_definitions

The `dsl_definitions` section can be used to define arbitrary data structures that can then be reused in different parts of the blueprint using [YAML anchors and aliases](https://gist.github.com/ddlsmurf/1590434).

More on `dsl_definitions` in the [spec]({{ relRef("blueprints/spec-dsl-definitions.md") }}).


# policy_types

`policies` provide a way of analyzing a stream of events that correspond to a group of nodes (and their instances).

More on `policy_types` in the [spec]({{ relRef("blueprints/spec-policy-types.md") }}).


# policy_triggers

`policy_triggers` provide a way of declaring actions the can be invoked by policies.

More on `policy_triggers` in the [spec]({{ relRef("blueprints/spec-policy-triggers.md") }}).


# data_types

`data_types` are useful for grouping together and re-using a common set of properties, along with their types and default values.

More on `data_types` in the [spec]({{ relRef("blueprints/spec-data-types.md") }}).


# import_resolver

An import resolver can be used to resolve imports during blueprint parsing.

More on `import_resolver` in the [spec]({{ relRef("blueprints/import-resolver.md") }}).


# upload_resources

`upload_resources` can be used to upload resources to the manager, which could be used by blueprints.

More on `upload_resources` in the [spec]({{ relRef("blueprints/spec-upload-resources.md") }}).
