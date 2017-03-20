---
layout: bt_wiki
title: Deployments Page
category: Web Interface
draft: false
abstract: Deployment Page Reference
weight: 130

terminology_link: reference-terminology.html
node_types_link: dsl-spec-node-types.html
relationships_link: dsl-spec-relationships.html
---
{{% gsSummary %}}{{% /gsSummary %}}

The default `Deployments` page displays the Deployments widget which provides a list of all deployments, and enables you to create, execute, update and delete deployments.

Each deployment in the list includes details about the attached blueprint, when the deployment was created and updated and the nodes on which it is deployed. In addition, the status of the deployments on the nodes is indicated as follows:<br>
![Execute workflow]({{< img "ui/deploymentActions/node_statuses.png" >}})

* **Green:** Indicates that the deployments are running on the nodes.
* **Yellow:** Indicates that the deployments are in progress.
* **Orange:** Indicates that the deployments are in an undefined (warning) state.
* **Red:** Indicates that the deployments are stopped or deleted.

## Creating a Deployment

1. In the Deployments widget, click **Create new deployment**.
2. Enter a name for the deployment.
3. Select a blueprint from the dropdown list.
4. Specify the deployment inputs for the blueprint or use the defaults.
5. Click **Deploy**.   
The deployment is added to the list.



## Deployment Details and Actions
When you click on a deployment in the list, a deployment-specific page opens that, by default, displays the following widgets. 

* Topology
* Nodes
* Deployment Inputs
* Deployment Outputs
* Deployment Events
* Deployment Logs

You can also execute workflows, and update and delete deployments from this page.<br/>


### Execute a Workflow

Each of the actions are described in detail [here]({{< relref "workflows/built-in-workflows.md" >}}).

 1. Click **Execute workflow**.
 2. Click the action you want to perform:   

    * Scale
    * Heal
    * Update
    * Execute Operation
    * Install
    * Install New Agents
    * Uninstall<br>
    Each of the actions are described below.

### Updating a Deployment

1. Click **Update deployment**.
2. Select the blueprint file for the updated deployment (from the local blueprint archive) or specify the URL of the remote archive in which the blueprint is located.
3. Select the inputs file for the blueprint.
4. Provide a name for the updated blueprint.
5. Select either the **Run default workflow** or **Run custom workflow** option.   
   
   * In the case of the default workflow, select or clear the **Run install workflow on added nodes** and **Run install workflow on removed nodes** checkboxes.
   * In the case of the custom workflow, specify the workflow ID.

 6. Click **Update**.

 For more information about updating a deployment, [click here]({{< relref "manager/update-deployment.md" >}}).

 For more information about creating custom workflows, [click here]({{< relref "workflows/creating-your-own-workflow.md" >}}).

### Deleting a Deployment

1. Click **Delete deployment**.
2. When prompted to verify that you want to remove the deployment, click **Yes**.


