---
layout: bt_wiki
title: The Deployments Page
category: Web Interface
draft: false
abstract: Deployment Page User Guide
weight: 130

terminology_link: reference-terminology.html
node_types_link: dsl-spec-node-types.html
relationships_link: dsl-spec-relationships.html
---
{{% gsSummary %}}{{% /gsSummary %}}

# Deployments Index

A table showing all of the existing deployments. It shows ID, blueprint, creation and update dates of each deployment and also provides an actions dropdown (see below).
![deployments index]({{< img "ui/ui-deployments-index.jpg" >}})

When clicking on a deployment ID in the Deployments Index table, you'll be redirected to a single deployment's view. 

# Deployment View
Here you can view the deployment's details and perform actions on the deployment.

## Actions dropdown
Use this component to perform actions on the deployment.  
![deployment actions]({{< img "ui/ui-deployment-actions.jpg">}})

### Execute Workflow
Use this option to execute a worklow on the deployment. A dialog will appear with available workflows listed. To execute, choose a deployment and click 'Confirm'.
![Execution dialog]({{< img "ui/ui-deployment-execution-dialog.jpg">}})

### Delete
Use this option to delete the deployment and a confirmation dialog will appear. To delete the deployment click 'Yes'.
![Delete dialog]({{< img "ui/ui-deployment-delete-dialog.jpg">}})

## Tabs
The following tabs contain various details about the different deployments:

### Topology
The [Topology]({{< field "terminology_link" >}}#topology) is an application’s graph of nodes and their relationships, which describes the lifecycle events or other operations that each node and relationship exposes for use in workflows.<br>
Each of the blueprint's nodes is displayed as a square container, which can contain other nodes. Each node has a title describing its name, and an icon to indicate the [node's type]({{< field "node_types_link" >}}.<br>
[Relationships]({{< field "relationships_link" >}}) between nodes are marked with arrows, starts from the connected node and ends at the target node.<br>
The topology view shows only the application nodes and not the network nodes. If a node has a network dependency, it will be displayed as a bullet icon in the node's title.<br>
[Host nodes]({{< field "terminology_link" >}}#host-node) are shown with number bullet beside the node type icon, which indicates the number of [instances]({{< field "terminology_link" >}}#node-instance) and number of initiated instances. Contained nodes are shown with status bullet beside the node type icon, which indicates the node status by bullet icon & color.
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
Running instances of a workflow. See the definition [here]({{< field "terminology_link" >}}#execution).<br/>
![Deployment execution]({{< img "ui/ui-deployment-execution.jpg" >}})

### Inputs & Outputs
A list of a single blueprint's [inputs]({{< relref "blueprints/spec-inputs.md" >}}) and [outputs]({{< relref "blueprints/spec-outputs.md" >}}).

### Source
Provides an interface to explore the source files of a blueprint. Choose a file from the tree on the right to view its contents.
![Deployment source]({{< img "ui/ui-deployment-source.jpg" >}})

### Monitoring
See the definition [here]({{< relref "manager_webui/graphing-metrics.md" >}}).

