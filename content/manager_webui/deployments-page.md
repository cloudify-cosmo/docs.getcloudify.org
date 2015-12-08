---
layout: bt_wiki
title: The Deployments Page
category: Web Interface
draft: false
abstract: Deployment Page Reference
weight: 130

terminology_link: reference-terminology.html
node_types_link: dsl-spec-node-types.html
relationships_link: dsl-spec-relationships.html
---
{{% gsSummary %}}{{% /gsSummary %}}

# Deployments Index

A table showing all existing deployments. It shows ID, blueprint, creation and update dates of each deployment and also provides actions dropdown (see below).
![deployments index]({{< img "ui/ui-deployments-index.jpg" >}})

When clicking on a deployment ID in the Deployments Index table, you'll be redirected to single deployment view. 

# Deployment View
Here you can view deployment's details and perform actions on it.

## Actions dropdown
Use this component to perform actions on the deployment.  
![deployment actions]({{< img "ui/ui-deployment-actions.jpg">}})

### Execute Workflow
Pick this option to execute a worklow on the deployment. A dialog will appear with available workflows listed. To execute, pick one and click 'Confirm'.
![Execution dialog]({{< img "ui/ui-deployment-execution-dialog.jpg">}})

### Delete
Pick this option to delete the deployment. A confirmation dialog will appear. To delete the deployment click 'Yes'.
![Delete dialog]({{< img "ui/ui-deployment-delete-dialog.jpg">}})

## Tabs
Following tabs contain various deployment's information:

### Topology
The [Topology]({{< relref "reference-terminology.md" >}}#topology) is an application’s graph of nodes and their relationships, which describes the lifecycle events or other operations that each node and relationship exposes for use in workflows.<br>
Each of the blueprint's nodes is displayed as a square container, which can contain other nodes. Each node has a title describing its name, and an icon to indicate the [node's type]({{< relref "blueprints/spec-node-types.md" >}}.<br>
[Relationships]({{< relref "blueprints/spec-relationships.md" >}}) between nodes are marked with arrows, starts from the connected node and ends at the target node.<br>
The topology view shows only the application nodes and not the network nodes. If a node has a network dependency, it will be displayed as a bullet icon in the node's title.<br>
[Host nodes]({{< relref "reference-terminology.md" >}}#host-node) are shown with number bullet beside the node type icon, which indicates the number of [instances]({{< relref "reference-terminology.md" >}}#node-instance) and number of initiated instances. Contained nodes are shown with status bullet beside the node type icon, which indicates the node status by bullet icon & color.
The contained nodes bullet indicates the status of all instances of the specific node. For example, if at least one instance raised an error, the bullet will be colored in red.
The bullet color indicates the node current status:<br>

![Loading status]({{< img "ui/ui-node-status-process.png" >}}) - Node is in loading process<br>
![Error status]({{< img "ui/ui-node-status-error.png" >}}) - An error occurred while running the node<br>
![Warning status]({{< img "ui/ui-node-status-warning.png" >}}) - Warning raised while running the node<br>
![Success status]({{< img "ui/ui-node-status-success.png" >}}) - Node was initiated successfully<br>

![Deployment topology]({{< img "ui/ui-deployment-topology.jpg" >}})

Clicking a node will open a side panel with details of the selected node. The floating panel allows the user to select which instance details to show.<br>

![Deployment node details]({{< img "ui/ui-deployment-node-panel.jpg" >}})

### Nodes
A list of nodes according to the blueprint's topology.<br/>
For every node, its type, number of instances, and relationships are shown. By clicking the magnifier icon, a side panel will be opened with the selected node's details.
![Deployment nodes]({{< img "ui/ui-deployment-nodes.jpg" >}})

### Executions
Running instances of a workflow. See the definition [here]({{< relref "reference-terminology.md" >}}#execution).<br/>
![Deployment execution]({{< img "ui/ui-deployment-execution.jpg" >}})

### Inputs & Outputs
A list of blueprint's [inputs]({{< relref "blueprints/spec-inputs.md" >}}) and [outputs]({{< relref "blueprints/spec-outputs.md" >}}).

### Source
Provides an interface to explore the source files of a blueprint. Choose a file from the tree on the right to view it's contents.
![Deployment source]({{< img "ui/ui-deployment-source.jpg" >}})

### Monitoring
See the definition [here]({{< relref "manager_webui/graphing-metrics.md" >}}).

