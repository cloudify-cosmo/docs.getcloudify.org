With Cloudify, you can update a deployment that was previously [created from a blueprint](http://docs.getcloudify.org/3.4.0/manager/create-deployment/). But what does 'updating' a deployment mean? Well, say you have a sizable intricate deployment of webservers and databases. After some time and research, you realize that you need to add a new kind of database, that should be connected to some of the existing webservers. 'Updating' a deployment means that instead of creating a new deployment from a blueprint that includes these new servers, you can simply add and connect these new databases to your existing deployment, while retaining the state of your current webservers-databases setting.

### Describing a Deployment Update
The contents of the deployment update should be described in a [yaml blueprint file](http://docs.getcloudify.org/3.4.0/blueprints/overview/), just as any application in Cloudify. Following the aforementioned example, The updated application blueprint will probably include a new database type, a few new node templates of the new database type, and a few new relationships representing how these new nodes are connected to the existing architecture.

### Using the CLI to Update a Deployment
One quick way to update your deployment with Cloudify is using the CLI. Another way, perhaps more 'visual' is using the Cloudify UI. Updating a deployment via the CLI is quite reminiscent of uploading a blueprint or creating a deployment. You'll need a blueprint file describing your deployment update. That blueprint can be uploaded directly by supplying a local file path, or it can be upload as an archive.
##### via a blueprint file
```shell
cfy deployments update -d ID_OF_DEPLOYMENT_TO_UPDATE -p PATH_TO_BLUEPRINT
```
When updating a deployment using a blueprint file, the directory containing the blueprint file is packaged and uploaded as a whole.
##### via an archived blueprint
```shell
cfy deployments update -d ID_OF_DEPLOYMENT_TO_UPDATE -l ARCHIVE_PATH [-n BLUEPRINT_FILENAME]
```
When updating a deployment using an archive, the name of the blueprint representing the deployment update is assumed to be `blueprint.yaml`. If the blueprint file has a different name, it must be specified using the `-n / --blueprint-filename` optional argument.

{{% gsInfo title="Some Deployment Update Concepts" %}}
* The **deployment update blueprint** is the blueprint that contains the changes representing the deployment update, what was previously referenced as the 'updated application blueprint'.
* **step** is a logical concept that represents a single change in a deployment update blueprint. There are three different step types: **add**, **remove**, and **modify**. These three concepts will be used extensively throughout this guide. The scope of a 'step' is determined by the most top-level change. For example, if a node was added, and this node also contains relationship, then this is a 'add node' step, and not a 'add relationship' step. Currently, After you apply a deployment update, its composing step are only accessible using the Cloudify REST API.
{{% /gsInfo %}}

### Deployment Update Flow
Updating a deployment consists of several stages:
1. The deployment update blueprint is uploaded to the manager.
2. The steps composing the deployment update are extracted.
3. All the 'added' changes are updated in the data model.
4. The `update` workflow is executed. As a part of the *default* update workflow execution:
    * The `unlink` operation will be executed in regard the each removed relationship.
    * The `uninstall` workflow will be executed on each of the removed nodes.
    * The `install` workflow will be executed on each of the added nodes.
    * The `establish` operation will be executed in regard the each added relationship.
5. All the 'removed' changes are updated in the data model
{{% gsNote title="Workflow/operation Execution during a deployment update" %}}
Phase 4 of the deployment update flow includes the only cases in which a workflow or an operation is executed during a deployment update
{{% /gsNote %}}

#### Skipping the install/uninstall workflow executions
You can choose to skip either execution of the `install` and/or `uninstall` workflow during the deployment update process.
```shell
cfy deployments update -d ID_OF_DEPLOYMENT_TO_UPDATE -p PATH_TO_BLUEPRINT --skip-install
```
If you choose to skip the `install` workflow, added nodes won't be installed, and added relationships won't be established
```shell
cfy deployments update -d ID_OF_DEPLOYMENT_TO_UPDATE -p PATH_TO_BLUEPRINT --skip-uninstall
```
If you choose to skip the `uninstall` workflow, removed nodes won't be uninstalled, and removed relationship won't be unlinked

#### Deployment Update Failure


#### Providing inputs
Whether you choose to update via a blueprint file or whether via an archive, you can choose to provide inputs while updating a deployment. These inputs can be provided in the same manner as when [creating a deployment](http://docs.getcloudify.org/3.4.0/manager/create-deployment/#create-a-deployment), with the following important distinctions:
##### overriding inputs
Providing an input of the same name of an existing deployment input will override its value. Other new inputs will be added to the data model as usual.

{{% gsNote title="Overriding inputs of existing nodes" %}}
Suppose you have the following node in your deployment, and that the `port` input has a value of `8080`:
```
webserver:
    [...]
    properties:
        port: {get_input: port}
```
Now, suppose that while updating this deployment you overrode the `port` input with `9090`, and assume that the `webserver` node didn't change as part of the update. Which means, relying on the deployment update flow, that no install and/or uninstall workflows were run on this node. As a result, its `port` property is still `8080`. In contrast, any new nodes (including new `webserver` nodes) that were added as a part of that deployment update and use the `port` input, will be assigned with the new `port` input value - `9090`.
{{% /gsNote %}}
{{% gsNote title="Overriding default input values" %}}
Similar to overriding existing inputs, changing the default values of inputs won't affect nodes that were already installed,
{{% /gsNote %}}

### Referencing Existing Resources and Uploading New Ones:
Any previously uploaded resource (scripts, data files, etc.) can be referenced inside the blueprint representing the deployment update. However, and this applies both to updating via an archive and via a blueprint file, uploading a resource as part of the update with the same name as an existing one will overwrite that resource through that deployment.
{{% gsNote title="previously imported blueprints in the `inputs` section" %}}
Unlike resources, entries from the [`imports`](http://docs.getcloudify.org/3.4.0/blueprints/spec-imports/) section that were part of that deployment's blueprint or of a previous deployment update must be imported in the deployment update blueprint as well. e.g if the blueprint of the original deployment contained within its imports the entry `http://www.getcloudify.org/spec/cloudify/3.4/types.yaml`, the same entry must be also under the `imports` section of the blueprint representing any of its deployment updates.
{{% /gsNote %}}

### Unsupported Changes in a Deployment Update
If a deployment update blueprint contains changes that are not currently supported as a part of an update, the update will not take place, and a message indicating the unsupported changes will be displayed to the user. Following is a list of unsupported changes, along some possible examples of these changes.
#### Node Type
Changing a node's type is unsupported:
```yaml
# original deployment blueprint
node_templates:
    node1:
        [...]
        type: my_type
```
```yaml
# deployment update blueprint
node_templates:
    node1:
        [...]
        type: my_updated_type  # unsupported update - can't modify a node's type!
```
#### Contained_in relationship target
A Relationship of type `cloudify.relationships.contained_in` or any type that derives from it, cannot change its `target` value.
```yaml
# original deployment blueprint
node_templates:
    node1:
        [...]
        relationships:
          - type: cloudify.relationships.contained_in
            target: node2
```
```yaml
# deployment update blueprint
node_templates:
    node1:
        [...]
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
#### operations implemented with plugins
You cannot update a operation implemented with a plugin in the following cases:
* The updated operation is implemented with a plugin that didn't exist in the original deployment
```yaml
# original deployment blueprint
nodes:
    node1:
        interfaces:
            interface1:
                operation1:
                    [...]
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
                    [...]
                    implementation: plugin2.path.to.module.task  # unsupported update - this plugin didn't exist in the original deployment
plugins:
    plugin2:
        [...]

```
* The updated operation is implemented with a plugin `p` whose `install` field is `true`, but the current operation's implementaion `p` plugin is different
```yaml
# original deployment blueprint
nodes:
    node1:
        interfaces:
            interface1:
                operation1:
                    [...]
                    implementation: plugin1.path.to.module.task
plugins:
    plugin1:
        [...]
        install: false
```
```yaml
# deployment update blueprint
nodes:
    node1:
        interfaces:
            interface1:
                operation1:
                    [...]
                    implementation: plugin1.path.to.module.task

plugins:
    plugin1:
        [...]
        install: true  # unsupported update - in the original deployment `plugin1` was different (its `install` was false)
```
#### workflows plugin mappings
You cannot update a workflow plugin mapping in the following case:
* The plugin of the updated workflow, (whether the workflow currently exists or it is been added with the update) is not one of the current deployment plugins, and the `install` field of the updated workflow's plugin is `true`
```yaml
# original deployment blueprint
workflows:
    workflow1: plugin1.module1.method1

plugins:
    plugin1:
        [...]
        install: true
```
```yaml
# deployment update blueprint
workflows:
    workflow1: plugin2.module2.method2  # unsupported update - the modified workflow's plugin does not exist in the original deployment, and its `install` field is `true`
    workflow2: plugin2.module2.method2  # unsupported update - the added workflow's plugin does not exist in the original deployment, and its `install` field is `true`

plugins:
    plugin1:
        [...]
        install: true
    plugin2:
        [...]
        install: true
```
#### Groups, Policy Types and Policy Triggers
Any Change in the top level fields `groups`, `policy_types` and `policy_triggers` is not currently supported as a part of a deployment update blueprint

### What Can be Updated as a Part of a Deployment Update
The following can be updated as part of a deployment update, subject to the limitations that were [mentioned above](http://docs.getcloudify.org/3.4.0/manager/update-deployment/#unsupported-changes-in-a-deployment-update).
#### Nodes
Nodes can be added or removed, including all their relationships, operations, an so on. Adding or removing a node will trigger the install/uninstall workflow in regard to that node.
{{% gsNote title="'Renaming' Nodes" %}}
Assume that the original deployment blueprint contains a node named `node1`. Then, in the deployment update blueprint, you decide to 'rename' that node, to `node2`. Now the deployment update blueprint's `node2` is identical to `node1` in the original blueprint, except its name. But in practice, there isn't really a 'renaming' process. In the aforementioned scenario, `node1` will be uninstalled, and `node2` will be installed. that is `node1` won't retain its state and just change its name.

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

#### relationships
except for being added or removed as part of adding or removing a node, relationships can be also be added or removed specifically. Adding a relationship will trigger execution of its `establish` operations (assuming a default `install` workflow). Similarly, removing an operation will trigger execution of the `unlink` operations. In addition, it is also possible to change a node's relationship order. The operations of the added and removed relationships will be executed according the order of the relationships
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
{{% /gsNote %}}

#### operations:
Operations, both node operations and relationship operations, can be added, removed or modified. Note that updating only operations (i.e. without also updating their containing node or relationship) will not trigger a workflow execution, but will only affect the data model.
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











