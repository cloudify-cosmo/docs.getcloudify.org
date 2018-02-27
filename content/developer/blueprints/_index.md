+++
title = "Blueprint Files and Packages"
description = ""
weight = 1
alwaysopen = false
+++

An application in Cloudify is described in a `blueprint` and its DSL (Domain Specific Language) is based on the [TOSCA](https://www.oasis-open.org/committees/tosca/) standard.

#### Blueprint Files
*Blueprint files* are written in YAML and describe the logical representation of an application, which is called a `topology`. In a blueprint, you describe the application's components, how they relate to one another, how they are installed and configured and how they are monitored and maintained.

#### Blueprint Packages
In addition to YAML artifacts, *blueprint packages* include multiple resources such as configuration and installation scripts (or Puppet Manifests, or Chef Recipes, etc..), code, and basically any other resource you require for running your application.

All files in the directory that contains the blueprint's main file, are also considered part of the blueprint package, and paths described in the blueprint are relative to that directory. For more information, [click this link]({{< relref "operations/manager/packaging-blueprints.md" >}}).

{{% note title="Secret Storage" %}}
Secret storage provides a tenant-wide variable store for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform. To use secret storage, you must specify the path to it's repository when you create the blueprint. For more information, see the [get_secret]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-secret" >}}) intrinsic function.
{{% /note %}}


## Blueprint Elements
Blueprints comprise several high-level sections:

### Tosca Definitions Version

`tosca_definitions_version` is a top-level property of the blueprint that is used to specify the DSL version used.
For Cloudify 4.2, the versions that are currently defined are `cloudify_dsl_1_0`, `cloudify_dsl_1_1`, `cloudify_dsl_1_2` and `, `cloudify_dsl_1_3`.

If you are just starting to use Cloudify, you should use the latest version.

For more information about the `tosca_definitions_version`, see the [specification]({{< relref "developer/blueprints/spec-versioning.md" >}}).


### Imports

`imports` enable the author of a blueprint to reuse blueprint files, or parts of them, and to use predefined types (e.g. from the [types.yaml]({{< field "types_yaml_link" >}}) file).

For more information about `imports`, see the [specification]({{< relref "developer/blueprints/spec-imports.md" >}}).


### Inputs

`inputs` are parameters that are injected into the blueprint when a deployment is created. These parameters can be referenced using the [get_input]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-input" >}}) intrinsic function.

Inputs are useful when you must inject parameters to the blueprint that were unknown at the time that the blueprint was created. They can also be used to distinguish between different deployments of the same blueprint.

For more information about `inputs`, see the [specification]({{< relref "developer/blueprints/spec-inputs.md" >}}).


### Node Templates

`node_templates` represent the actual instances of [node types]({{< relref "developer/blueprints/spec-node-types.md" >}}) that eventually represent a running application or service, as described in the blueprint.

`node_types` are more commonly referred to as `nodes`. Nodes can comprise more than one instance. For example, you can define a node that contains two VMs. Each VM is called a `node_instance`.


For more information about `node_templates`, see the [specification]({{< relref "developer/blueprints/spec-node-templates.md" >}}).


### Node Types

`node_types` are used to define common properties and behaviors for [node-templates]({{< relref "developer/blueprints/spec-node-templates.md" >}}). You can then create `node-templates`, based on these types, that inherit their definitions.

For more information about `node_types` see the [specification]({{< relref "developer/blueprints/spec-node-types.md" >}}).


### Outputs

`outputs` provide expose the global aspects of a deployment. When deployed, a blueprint can expose specific outputs of that deployment. For example, the endpoint of a server or some other runtime or static information for a specific resource.

For more information about `outputs` see the [specification]({{< relref "developer/blueprints/spec-outputs.md" >}}).


### Relationships

`relationships` define how nodes relate to one another. For example, a `web_server` node can be `contained_in` a `vm` node, or an `application` node can be `connected_to` a `database` node.

For more information about `relationships` see the [specification]({{< relref "developer/blueprints/spec-relationships.md" >}}).


### Intrinsic Functions

`intrinsic_functions` are functions that can be used within blueprints. Depending on the function, evaluation occurs at deployment creation or in runtime. For example, the `get_input` intrinsic function retrieves an input that is defined within the blueprint.

Intrinsic functions make blueprints dynamic, enabling to retrieve and set data structures in different parts of the blueprint.

For more information about `instrinsic_functions`, see the [specification]({{< relref "developer/blueprints/spec-intrinsic-functions.md" >}}).


### Plugins

By declaring `plugins`, python modules can be installed. The installed or preinstalled modules can be used to perform different operations. You can also specify where a specific plugin's operations will be executed.

For more information about `plugins`, see the [specification]({{< relref "developer/blueprints/spec-plugins.md" >}}).


### Interfaces

Interfaces map logical tasks to executable operations.

For more information about `interfaces`, see the [specification]({{< relref "developer/blueprints/spec-interfaces.md" >}}).


### Workflows

`workflows` define a set of tasks that can be executed on a node or a group of nodes, and the execution order of those tasks, serially or in parallel. A task may be an operation implemented by a plugin, but it could also be other actions, including arbitrary code.

For more information about `workflows`, see the [specification]({{< relref "developer/blueprints/spec-workflows.md" >}}).


### Groups

`groups` enable configuration of shared behavior for different sets of`node_templates`.

For more information about `groups`, see the [specification]({{< relref "developer/blueprints/spec-groups.md" >}}).


### DSL Definitions

`dsl_definitions` are used to define arbitrary data structures that can then be reused in different parts of the blueprint using [YAML anchors and aliases](https://gist.github.com/ddlsmurf/1590434).

For more information about `dsl_definitions`, see the [specification]({{< relref "developer/blueprints/spec-dsl-definitions.md" >}}).


### Policy Types

`policies` enable a stream of events that correspond to a group of nodes and their instances to be analyzed.

For more information about `policy_types`, see the [specification]({{< relref "developer/blueprints/spec-policy-types.md" >}}).


### Policy Triggers

`policy_triggers` enable actions to be declared that can be invoked by policies.

For more information about `policy_triggers`, see the [specification]({{< relref "developer/blueprints/spec-policy-triggers.md" >}}).


### Data Types

`data_types` enable grouping and re-use of a common set of properties, together with their types and default values.

For more information about `data_types`, see the [specification]({{< relref "developer/blueprints/spec-data-types.md" >}}).


### Import Resolver

An `import_resolver` is used to resolve imports during blueprint parsing.

For more information about `import_resolver`, see the [specification]({{< relref "developer/blueprints/import-resolver.md" >}}).


### Upload Resources

`upload_resources` enables resources to be uploaded to Cloudify Manager that could be used by blueprints.

For more information about `upload_resources`, see the [specification]({{< relref "developer/blueprints/spec-upload-resources.md" >}}).
