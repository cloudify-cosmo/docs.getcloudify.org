---
layout: bt_wiki
title: Updating a Deployment
category: Manager Intro
draft: false
weight: 650
---

With Cloudify, you can update a deployment that was previously [created from a blueprint](http://docs.getcloudify.org/3.4.0/manager/create-deployment/). But what does 'updating' a deployment mean? Well, say you have a sizable intricate deployment of webservers and databases. After some time and research, you realize that you need to add a new kind of database, that should be connected to some of the existing webservers. 'Updating' a deployment means that instead of *creating a new deployment* from a blueprint that includes these new servers, you can simply add and connect these new databases to your *existing deployment*, while retaining the state of your current webservers-databases setting.

### Describing a Deployment Update
The contents of the deployment update should be described in a [yaml blueprint file](http://docs.getcloudify.org/3.4.0/blueprints/overview/), just as any application in Cloudify. Following the aforementioned example, The updated application blueprint will probably include a new database type, a few new node templates of the new database type, and a few new relationships representing how these new nodes should be connected to the existing architecture.

### Using the CLI to Update a Deployment
One quick way to update your deployment with Cloudify is using the CLI. Another way, perhaps more 'visual' is using the Cloudify UI. Updating a deployment via the CLI is quite reminiscent of uploading a blueprint or creating a deployment. You'll need a blueprint file describing your deployment update. That blueprint can be uploaded directly by supplying a local file path, or it can be upload as an archive.
#### via a blueprint file
```shell
cfy deployments update -d ID_OF_DEPLOYMENT_TO_UPDATE -p PATH_TO_BLUEPRINT
```
When updating a deployment using a blueprint file, the directory containing the blueprint file is packaged and uploaded as a whole.
#### via an archived blueprint
```shell
cfy deployments update -d ID_OF_DEPLOYMENT_TO_UPDATE -l ARCHIVE_PATH [-n BLUEPRINT_FILENAME]
```
When updating a deployment using an archive, the name of the blueprint representing the deployment update is assumed to be `blueprint.yaml`. If the blueprint file has a different name, it must be specified using the `-n / --blueprint-filename` argument.

{{% gsInfo title="Some deployment update concepts" %}}
- The **deployment update blueprint** is the blueprint that contains the changes representing the deployment update, what was previously referenced as the 'updated application blueprint'.
- A **step** is a logical concept that represents a single change in a deployment update blueprint. There are three different types of steps: **add**, **remove**, and **modify**. These three concepts will be used extensively throughout this guide. The scope of a 'step' is determined by its most top-level change. For example, if a node was added, and this node also contains a new relationship, then this is a 'add node' step, and not a 'add relationship' step. Similarly, if a node's property was modified, it is not a 'modify node' step, but a 'modify property' step. A list of all the possible steps is located [here](http://docs.getcloudify.org/3.4.0/manager/update-deployment/#what-can-be-updated-as-a-part-of-a-deployment-update)
{{% /gsInfo %}}
{{% gsNote title="Accessing the steps of a deployment update" %}}
Currently, After you apply a deployment update, its composing steps are only accessible using the Cloudify REST API.
{{% /gsNote %}}

### Deployment Update Flow
Updating a deployment consists of several stages:
1. The deployment update blueprint is uploaded to the manager.
2. The steps composing the deployment update are extracted.
3. All the 'added' changes are updated in the data model.
4. The `update` workflow is executed. As a part of the *default* update workflow execution:
    - The `unlink` operation will be executed in regard the each removed relationship.
    - The `uninstall` workflow will be executed on each of the removed nodes.
    - The `install` workflow will be executed on each of the added nodes.
    - The `establish` operation will be executed in regard the each added relationship.
5. All the 'removed' changes are updated in the data model
{{% gsNote title="Workflow/operation execution during a deployment update" %}}
Phase 4 of the deployment update flow includes the only cases in which a workflow or an operation is executed during a deployment update. i.e. adding an operation, removing a workflow, modifying the `install-agent` property or any other step that is not add/remove node or relationship will not trigger an execution.
{{% /gsNote %}}
{{% gsNote title="make sure the built in update workflow is contained in your blueprint" %}}
Like any other workflow, the built-in `update` workflow must be a part of the deployment update blueprint in order to update a deployment using it. The recommended way of achieving this is to import a 3.4 or above version of `types.yaml` in your blueprint.
{{% /gsNote %}}

#### Skipping the install/uninstall workflow executions
You can choose to skip the execution of the `install` and/or `uninstall` workflows during the deployment update process.
```shell
cfy deployments update -d ID_OF_DEPLOYMENT_TO_UPDATE -p PATH_TO_BLUEPRINT --skip-install
```
If you choose to skip the `install` workflow, added nodes won't be installed, and added relationships won't be established
```shell
cfy deployments update -d ID_OF_DEPLOYMENT_TO_UPDATE -p PATH_TO_BLUEPRINT --skip-uninstall
```
If you choose to skip the `uninstall` workflow, removed nodes won't be uninstalled, and removed relationship won't be unlinked.

#### Recovering from a failed update
If the deployment update workflow fails during its execution, you try to preform another deployment update to recover from it, this time using the `-f` flag. A common solution is to try to do a 'rollback', using a deployment update blueprint that represents the previous deployment.
```shell
cfy deployments update -d ID_OF_DEPLOYMENT_TO_UPDATE -p PATH_TO_BLUEPRINT_REPRESENTING_THE_PRE_FAILURE_DEPLOYMENT
```

#### Providing inputs
Whether you choose to update via a blueprint file or whether via an archive, you can choose to provide inputs while updating a deployment. These inputs can be provided in the same manner as when [creating a deployment](http://docs.getcloudify.org/3.4.0/manager/create-deployment/#create-a-deployment), with the following important distinctions:
#### Overriding inputs
Providing an input of the same name of an existing deployment input will override its value. Other new inputs will be added to the data model as usual.

{{% gsNote title="Overriding inputs of existing nodes" %}}
Suppose you have the following node in your deployment, and that the `port` input has a value of `8080`:
```
webserver:
    [...]
    properties:
        port: {get_input: port}
```
Now, suppose that while updating this deployment you overrode the `port` input with `9090`, and assume that the `webserver` node didn't change as part of the update. Which means, relying on the deployment update flow, that no install and/or uninstall workflows were run on this node. As a result, its `port` property of that node is still `8080`. In contrast, any new nodes (including new `webserver` nodes) that were added as a part of that deployment update and use the `port` input, will be assigned with the new `port` input value - `9090`.
{{% /gsNote %}}
{{% gsNote title="Overriding default input values" %}}
Similar to overriding existing inputs, changing the default values of inputs won't affect nodes that were already installed.
{{% /gsNote %}}

### Referencing Existing Resources and Uploading New Ones:
Any previously uploaded resource (scripts, data files, etc.) can be referenced inside the deployment update blueprint. However, and this applies both to updating via an archive and via a blueprint file, uploading a resource as part of the update with the same name as an existing one will overwrite that resource throughout that deployment.
{{% gsNote title="Previously imported blueprints in the `inputs` section" %}}
Unlike resources, entries from the [`imports`](http://docs.getcloudify.org/3.4.0/blueprints/spec-imports/) section that were part of that deployment's blueprint or of a previous deployment update must be a part of the deployment update blueprint as well. e.g if the blueprint of the original deployment contained within its imports the entry `http://www.getcloudify.org/spec/cloudify/3.4/types.yaml`, the deployment update blueprint must contain the content of that file as well (most likely by importing the same `types.yaml` file, or a newer version).
{{% /gsNote %}}

### Unsupported Changes in a Deployment Update
If a deployment update blueprint contains changes that are not currently supported as a part of an update, the update will not take place, and a message indicating the unsupported changes will be displayed to the user. Following is a list of unsupported changes, along some possible examples.
#### Node type
Changing a node's type is unsupported:
```yaml
# original deployment blueprint
node_templates:
    node1:
        type: my_type
```
```yaml
# deployment update blueprint
node_templates:
    node1:
        type: my_updated_type  # unsupported update - can't modify a node's type!
```
#### Contained_in relationship target
A Relationship of type `cloudify.relationships.contained_in` or any type that derives from it, cannot change its `target` value.
```yaml
# original deployment blueprint
node_templates:
    node1:
        relationships:
          - type: cloudify.relationships.contained_in
            target: node2
```
```yaml
# deployment update blueprint
node_templates:
    node1:
        relationships:
          - type: cloudify.relationships.contained_in
            target: node3  # unsupported update - can't modify a contained_in relationship's target
```
#### Relationship properties
Changing a relationship's property, e.g. `connection_type`, is unsupported.
```yaml
# original deployment blueprint
node_templates:
    node1:
        relationships:
          - [...]
            properties:
                connection_type: all_to_all
```
```yaml
# deployment update blueprint
node_templates:
    node1:
        relationships:
          - [...]
            properties:
                connection_type: all_to_one  # unsupported update - can't modify a relationship's property
```
#### Operations implemented with plugins
You cannot update a operation implemented with a plugin in the following cases:
- The updated operation is implemented with a plugin that didn't exist in the original deployment
```yaml
# original deployment blueprint
nodes:
    node1:
        interfaces:
            interface1:
                operation1:
                    implementation: plugin1.path.to.module.task
plugins:
    plugin1:
        [...]
```
```yaml
# deployment update blueprint
nodes:
    node1:
        interfaces:
            interface1:
                operation1:
                    implementation: plugin2.path.to.module.task  # unsupported update - this plugin didn't exist in the original deployment
plugins:
    plugin2:
        [...]

```
- The updated operation is implemented with a plugin `p` whose `install` field is `true`, but the current operation's implementation `p` plugin is `false`
```yaml
# original deployment blueprint
nodes:
    node1:
        interfaces:
            interface1:
                operation1:
                    implementation: plugin1.path.to.module.task
plugins:
    plugin1:
        install: false
```
```yaml
# deployment update blueprint
nodes:
    node1:
        interfaces:
            interface1:
                operation1:
                    implementation: plugin1.path.to.module.task

plugins:
    plugin1:
        install: true  # unsupported update - in the original deployment `plugin1` was different (its `install` was false)
```
#### Workflows plugin mappings
You cannot update a workflow plugin mapping in the following case:
- The plugin of the updated workflow, (whether ifthe workflow currently exists or if it is been added with the update) is not one of the current deployment plugins, and the `install` field of the updated workflow's plugin is `true`.
```yaml
# original deployment blueprint
workflows:
    workflow1: plugin1.module1.method1

plugins:
    plugin1:
        install: true
```
```yaml
# deployment update blueprint
workflows:
    workflow1: plugin2.module2.method2  # unsupported update - the modified workflow's plugin does not exist in the original deployment, and its `install` field is `true`
    workflow2: plugin2.module2.method2  # unsupported update - the added workflow's plugin does not exist in the original deployment, and its `install` field is `true`

plugins:
    plugin1:
        install: true
    plugin2:
        install: true
```
#### Groups, policy types and policy triggers
Any Change in the top level fields `groups`, `policy_types` and `policy_triggers` is not currently supported as a part of a deployment update blueprint.

### What Can be Updated as a Part of a Deployment Update
The following can be updated as part of a deployment update, subject to the limitations that were [mentioned above](http://docs.getcloudify.org/3.4.0/manager/update-deployment/#unsupported-changes-in-a-deployment-update).
#### Nodes
Nodes can be added or removed, including all their relationships, operations, an so on. Remember that adding or removing a node will trigger the install/uninstall workflow in regard to that node.
{{% gsNote title="'Renaming' nodes"/%}}
Assume that the original deployment blueprint contains a node named `node1`. Then, in the deployment update blueprint, you decide to 'rename' that node, to `node2`. Now the deployment update blueprint's `node2` is identical to `node1` in the original blueprint, except its name. But in practice, there isn't really a 'renaming' process. In the aforementioned scenario, `node1` will be uninstalled, and `node2` will be installed. that is `node1` won't retain its state.

```yaml
# original deployment blueprint
node_templates:
    node1:
        [...]
```
```yaml
# deployment update blueprint
node_templates:
    node2:  # node1 will be uninstalled. node2 will be installed
        [...]
```
{{% /gsNote %}}

#### Relationships
Except for being added or removed as part of adding or removing a node, relationships can be also be added or removed specifically. Adding a relationship will trigger execution of its `establish` operations (assuming a default `install` workflow). Similarly, removing an operation will trigger execution of the `unlink` operations. In addition, it is also possible to change a node's relationship order. The operations of the added and removed relationships will be executed according the order of the relationships in the deployment update blueprint.
```yaml
# original deployment blueprint
node_templates:
    node1:
        relationships:
          - type: cloudify.relationships.connected_to
            target: node2
```
```yaml
# deployment update blueprint
node_templates:
    node1:
        relationships:
          - type: cloudify.relationships.connected_to
            target: node3  # the previous relationship to node2 will be removed (unlinked), and a new relationship to node3 will be added (established)
```

#### Operations:
Operations, both node operations and relationship operations, can be added, removed or modified.
```yaml
# original deployment blueprint
node_templates:
    node1:
        interfaces:
            interface1:
                operation1:
                    implementation:
                        plugin1.path.to.module.taskA
                operation2:
                    implementation:
                        plugin2.path.to.module.taskA
        relationships:
          - [...]
            source_interfaces:
                interface1:
                    operation1:
                        implementation:
                            plugin1.path.to.module.taskB
plugins:
    plugin1:
        [...]
    plugin2:
        [...]
```
```yaml
# deployment update blueprint
node_templates:
    node1:
        interfaces:
            interface1:
                operation1:
                    implementation:  # modified operation1 (changed implementation)
                        plugin1.path.to.module.taskB
                # removed operation2
                operation3:  # added operation 3
                    implementation:
                        plugin2.path.to.module.taskB
        relationships:
          - [...]
            source_interfaces:
                interface1:
                    operation1:
                        implementation:  # modified operation1 (changed implementation to a different plugin)
                            plugin2.path.to.module.taskC
plugins:
    plugin1:
        [...]
    plugin2:
        [...]
```

#### Properties
Properties can be added, removed or modified. Note that overriding a default property value counts as a property modification.
```yaml
# original deployment blueprint
node_templates:
    node1:
        type: Cloudify.nodes.Compute
    node2:
        type: my_custom_node_type
        properties:
            prop1: value1
```
```yaml
# deployment update blueprint
node_templates:
    node1:
        type: Cloudify.nodes.Compute
        properties:
            ip: 192.0.2.1  # modified the property by overriding it default
    node2:
        type: my_custom_node_type
        properties:
            # removed property prop1
            prop2: value2  # added property prop2
```
#### Outputs
Outputs can be added, removed or modified.
```yaml
# original deployment blueprint
outputs:
    output1:
        value: {get_input: inputA}
    output2:
        [...]
```
```yaml
# deployment update blueprint
outputs:
    output1:
        value: {get_input: inputB}  # modified the value of output1
    # removed output2
    output3:  # added output3
        [...]
```
#### Workflows
Workflows can be added, removed or modified.
```yaml
# original deployment blueprint
workflows:
    workflow1: plugin_name.module_name.task1
    workflow2:
        [...]
```
```yaml
# deployment update blueprint
outputs:
    workflow1:
        value: plugin_name.module_name.task2  # modified the value of workflow1
    # removed workflow2
    workflow3:  # added workflow3
        [...]
```

#### Description:
The description can be added, removed or modified
```yaml
# original deployment blueprint
# no description field
```
```yaml
# deployment update blueprint
description: new_description  # added description
```
```yaml
# original deployment blueprint
description: description_content
```
```yaml
# deployment update blueprint
# removed the description
```
```yaml
# original deployment blueprint
description: old_description
```
```yaml
# deployment update blueprint
description: new_description
```

### Using a Custom Update Workflow
If the default `update` workflow doesn't satisfy your every need, Cloudify enables you to create a custom `update` workflow to be used as part of the deployment update process.
#### Requirements from the custom update workflow
In order for the custom workflow to be compatible with the deployment update process, it must accept at least the following arguments:
 * `ctx` - the regular ctx passed to any execution.
 * `update_id` - the id of the deployment update.
 * `added_instance_ids` - the list of all the added node instances ids.
 * `added_target_instances_ids` - the list of all the node instances ids which the added nodes have relationships with.
 * removed_instance_ids - the list of all the removed node instances id.
 * remove_target_instance_ids - the list of all the node instances id which the removed nodes had relationships with.
 * modified_entity_ids - the dict containing the modified entities. The key is the entity type ('node', 'relationship', etc.) and the value is the list of all of the entity ids of this entity type.
 * extended_instance_ids - the list of all the node instances which had a relationship added to their relationships.
 * extend_target_instance_ids - the list of all the node instances which are the target of the added relationships.
 * reduced_instance_ids - the list of all the node instances, which had a relationship removed from their relationships.
 * reduce_target_instance_ids - the list of all the node instances which are the target of the removed relationships.


In addition, the workflow must be a part of the deployment update blueprint. A Scheme of such a blueprint is as follows:
```yaml
workflows:
  custom_workflow:
    mapping: custom_workflow.py
    parameters:
      update_id:
        default: ''
      added_instance_ids:
        default: []
      added_target_instances_ids:
        default: []
      removed_instance_ids:
        default: []
      remove_target_instance_ids:
        default: []
      modified_entity_ids:
        default: {}
      extended_instance_ids:
        default: []
      extend_target_instance_ids:
        default: []
      reduced_instance_ids:
        default: []
      reduce_target_instance_ids:
        default: []
```
Furthermore, in order to finalize the deployment update (phase 5 of the [deployment udpate flow](http://docs.getcloudify.org/3.4.0/manager/update-deployment/#deployment-update-flow)), your custom `update` workflow must make a REST call, in the following manner:

```python
from cloudify.workflows import parameters
from cloudify.manager import get_rest_client

# custom update workflow code

rest_client = get_rest_client()
rest_client.deployment_updates.finalize_commit(parameters.update_id)
```

#### Updating a deployment with a custom update workflow
In order to update a deployment using your custom `update` workflow, use the `--workflow` argument, followed by the custom workflow name:

```shell
cfy deployments update -d DEPLOYMENT_ID -p PATH_TO_BLUEPRINT --workflow my_custom_workflow_name
```

{{% gsNote title="Builtin update workflow" %}}
The default `update` workflow is mapped in the types.yaml file. Using types.yaml without
the `update` workflow will cause a failure in updating a deployment.
{{% /gsNote %}}



