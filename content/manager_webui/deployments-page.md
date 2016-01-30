---
layout: bt_wiki
title: The Deployments Page
category: Web Interface
draft: false
abstract: Deployment Page Reference
weight: 130

node_types_link: dsl-spec-node-types.html
relationships_link: dsl-spec-relationships.html
---
{{% gsSummary %}}{{% /gsSummary %}}

When clicking on the `Deployments` tab and choosing a deployment you will be able to choose one of the following:

# Topology
The Topology is an application’s graph of nodes and their relationships, which describes the lifecycle events or other operations that each node and relationship exposes for use in workflows.<br>
Each of the blueprint's nodes is displayed as a square container, which can contain other nodes. Each node has a title describing its name, and an icon to indicate the [node's type]({{< field "node_types_link" >}}).<br>
[Relationships]({{< field "relationships_link" >}}) between nodes are marked with arrows, starts from the connected node and ends at the target node.<br>
The topology view shows only the application nodes and not the network nodes. If a node has a network dependency, it will be displayed as a bullet icon in the node's title.<br>
Host nodes are shown with number bullet beside the node type icon, which indicates the number of instances and number of initiated instances. Contained nodes are shown with status bullet beside the node type icon, which indicates the node status by bullet icon & color.
The contained nodes bullet indicates the status of all instances of the specific node. For example, if at least one instance raised an error, the bullet will be colored in red.
The bullet color indicates the node current status:<br>

![Loading status]({{< img "ui/ui-node-status-process.png" >}}) - Node is in loading process<br>
![Error status]({{< img "ui/ui-node-status-error.png" >}}) - An error occurred while running the node<br>
![Warning status]({{< img "ui/ui-node-status-warning.png" >}}) - Warning raised while running the node<br>
![Success status]({{< img "ui/ui-node-status-success.png" >}}) - Node was initiated successfully<br>

![Deployment topology]({{< img "ui/ui-deployment-ready.jpg" >}})

Clicking a node's title will open a side panel with runtime properties of the selected node. The floating panel allows the user to select which instance details to show.<br>

![Deployment node details]({{< img "ui/ui-deployment-floating-panel.png" >}})

# Network
A map of networks topologies according to the blueprint's topology contains internal and external networks, hosts, routers.<br/>
The network's name is displayed as a grey title, each network contains sub-networks displayed as colored lines underneath.
Network devices, such as hosts & routers, are displayed as icons, each icon indicates the device's type.
Connections between sub-networks and devices are marked with a colored line, by the color of the connected sub-network.<br>
Clicking a device will open a side panel with details of the selected device.<br>

![Deployment networks]({{< img "ui/ui-deployment-networks.jpg" >}})

# Nodes
A list of nodes according to the blueprint's topology.<br/>
For every node, its type, number of instances, and relationships are shown. By clicking the magnifier icon, a side panel will be opened with the selected node's details.
![Deployment nodes]({{< img "ui/ui-deployment-nodes.jpg" >}})

# Executions
Running instances of a workflow.<br/>
![Deployment execution]({{< img "ui/ui-deployment-execution.jpg" >}})

# Monitoring
See the definition [here](webui-graphing-metrics.html).
