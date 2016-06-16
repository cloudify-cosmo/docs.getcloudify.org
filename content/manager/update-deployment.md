---
layout: bt_wiki
title: Updating a Deployment
category: Manager Intro
draft: false
weight: 650
---

Cloudify enables updating an existing deployment. In order to update an existing deployment,
a blueprint which describes the modification is needed. The Cloudify Manager will
extract any difference between the original deployment blueprint and the modified deployment 
blueprint, execute any required operations and update the data model.

## Updating a Deployment via the CLI
Updating a deployment requires the deployment id of the deployment to update, 
and the update source. Cloudify's CLI support updating an existing deployment from two sources.

### Updating from an archive
Cloudify allows you to update a deployment from a pre-packaged archive such as *.tar, *.tar.gz, *.tar.bz, *.zip.

Follows an example of deployment update from an archive:
{{< gsHighlight  bash >}}
cfy deployments update --deployment-id <DEPLOYMENT_ID> --archive-location <ARCHIVE_LOCATION>
{{< /gsHighlight >}}

In case the main application file isn't *blueprint.yaml*, you can supply a different file name. Follows an example of such a usecase:

{{< gsHighlight  bash >}}
cfy deployments update --deployment-id <DEPLOYMENT_ID> --archive-location <ARCHIVE_LOCATION> --blueprint-filename <BLUEPRINT_FILENAME>
{{< /gsHighlight >}}

### Updating from a blueprint file
Allows you to specify a path to a Blueprint file, and the Cloudify will take care of compressing the folder and its contents for you.

Follows an example of deployment update from a blueprint:
{{< gsHighlight  bash >}}
cfy deployments update --deployment-id <DEPLOYMENT_ID> --blueprint-path <BLUEPRINT_FILE>
{{< /gsHighlight >}}


### Providing inputs
Cloudify supports providing inputs to the deployment update. Supplied inputs will override any existing
inputs with the same name, and append any previously non-existent inputs. 

Follows an example for deployment update using a blueprint file and additional inputs
{{< gsHighlight  bash >}}
cfy deployments update ---deployment-ideployment-id <DEPLOYMENT_ID> --blueprint-path <BLUEPRINT_FILE> --inputs <INPUTS>
{{< /gsHighlight >}}

{{% gsNote title="Default inputs" %}}
Since the deployment is already up and running, updating the default inputs in the 
modified blueprint will not affect the deployment.
{{% /gsNote %}}

## Supported entities
Cloudify currently enables updating the following entities:

 * **Description** - It is possible to add, modify and delete a deployment description.
 * **Nodes** - It is possible to add and delete deployment nodes. Note that addition and removal 
 of a node will trigger execution of install/uninstall operations on that node.
 * **Operations** - It is possible to add, modify and delete deployment operations (both node and 
 relationship based operations). However, changing an operation will **not** 
 trigger any execution. Updating a workflow will affect only the data model. 
 * **Outputs** - It is possible to add, modify and delete deployment outputs. However, 
 adding/modifying or removing a output will **not** trigger any execution, it 
 will affect only the data model. 
 * **Properties** - It is possible to add, modify and delete deployment properties. However,
 adding/modifying or removing a property will **not** trigger any execution, it
 will affect only the data model. 
 * **Relationships** - It is possible to add, delete the deployment relationships, and modify the order of the relationships. 
 Note that addition and removal of a relationship will trigger execution of establish/unlink operations on that relationship.
 The order of the relationships if finalized once the update process is completed. Furthermore, the deleted relationships
 would be executed in order, and the added relationships will be executed in order.
 * **Workflows** - It is possible to add, modify and delete deployment workflows. However, 
 adding/modifying or removing a workflow will **not** trigger any execution, it
 will affect only the data model. 

{{% gsInfo title="Plugins modification" %}}
The deployment update mechanism does not install any new plugins on nodes. i.e.
if a new operation uses a previously non-existent plugin, this plugin would not be installed
on the host machine, and the execution of that operation will fail.
{{% /gsInfo %}}

{{% gsNote title="The install-agent property" %}}
Note that install-agent is a property like any other. Changing it won't trigger any
execution, and the node will retain it's previous agent state.
{{% /gsNote %}}





## Deployment update flow
The deployment update is composed out of several phases:

 1. The modification blueprint is uploaded to the manager.
 2. The changes are extracted from the modification blueprint.
 3. Any newly added entities are added to the data model.
 4. Update execution is executed:
    * For nodes this means:
        * For any added nodes, install workflow is executed on those node only.
        * For any removed nodes, uninstall workflow is executed on those nodes only.
    * For relationships this means:
        * An establish operation is executed for any added relationship.
        * An unlink operation is executed for any removed relationship.
 5. Any removed entities are removed from the data model.
 
Cloudify enables you to skip the install and uninstall execution of nodes and relationship
via the `--skip-install` and `--skip-uninstall` flags. 
Follows an example of skipping the install related operations:
{{< gsHighlight  bash >}}
cfy deployments update --deployment-id <DEPLOYMENT_ID> --archive-location <ARCHIVE_LOCATION> --skip-install
{{< /gsHighlight >}}

### Deployment update failure
The deployment update process might fail at any step in the flow. If the deployment update state is execution workflow, 
but the execution has failed, it is possible to try and update the deployment once again (while using the original blueprint
will in fact revert the update). Passing -f to a deployment update will cancel any running updates for that deployment
if indeed the execution failed, and execute the new deployment update.

## Custom update workflow
Cloudify enables executing a custom workflow instead of the built-in `update` workflow.
In order for a workflow to be able to replace the built-in `update` workflow, it should 
receive as argument the following args:

 * ctx - the regular ctx passed to any execution.
 * update_id - the id of the deployment update.
 * added_instance_ids - ids on any added node instances.
 * added_target_instances_ids - ids of any node instances which the added nodes have relationships with. 
 * removed_instance_ids - ids of any removed node instances.
 * remove_target_instance_ids - ids of any node instances which the removed nodes had relationships with.
 * modified_entity_ids - a dict containing the modified entities. The key is the entity type and the value 
 is a list of entity ids.
 * extended_instance_ids - ids on any node instances, which had a relationship added to their relationships.
 * extend_target_instance_ids - ids of any node instances which are the target of the added relationships.
 * reduced_instance_ids - ids on any node instances, which had a relationship removed from their relationships.
 * reduce_target_instance_ids - ids of any node instances which are the target of the removed relationships.
 
In order to use a custom workflow, the workflow should be mapped in the blueprint. For example:
{{< gsHighlight  yaml >}}
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
        default: []
      extended_instance_ids:
        default: []
      extend_target_instance_ids:
        default: []
      reduced_instance_ids:
        default: []
      reduce_target_instance_ids:
        default: []
{{< /gsHighlight >}}

In order to trigger the deployment to finalize (i.e. execute the final phase), your custom workflow must send
a rest call to the rest service, utilizing the `finalize_commit` under the `deployment_updates`. For example:

{{< gsHighlight  python  >}}

from cloudify.workflows import parameters
from cloudify.manager import get_rest_client

...statements to execute...


rest_client = get_rest_client()
rest_client.deployment_updates.finalize_commit(parameters.update_id)

{{< /gsHighlight >}}

In order to execute the custom_workflow instead the default `update` workflow, use the `--workflow` arg. For example:

{{< gsHighlight  bash >}}
cfy deployments update --deployment-id <DEPLOYMENT_ID> --archive-location <ARCHIVE_LOCATION> --workflow custom_workflow
{{< /gsHighlight >}}

{{% gsNote title="Builtin update workflow" %}}
The default `update` workflow is mapped in the types.yaml file. Using types.yaml without
the `update` workflow will cause a failure in updating a deployment.
{{% /gsNote %}}
`
