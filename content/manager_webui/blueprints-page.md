---
layout: bt_wiki
title: Blueprints Page
category: Web Interface
draft: false
weight: 110

The `Blueprints` page displays a list of all the blueprints in this Cloudify Manager instance.<br>
The table includes the name of each blueprint, its creation date, update date, and the number of deployment instances. <br>
![Blueprints index]({{<img "ui/blueprintsPage/index.png">}})

* You can filter the table by entering text in the **Blueprint Name** search box.
* You can sort items in the table in ascending or descending order by clicking a column title.

Click an option in the dropdown menu adjacent to a bluepoint entry to deploy or delete a blueprint.

### Uploading a Blueprint
1. Click the 'Upload Blueprint' button to upload a blueprint.   
   ![upload blueprint dialog]({{<img "ui/blueprintsPage/uploadBlueprint.png">}})   
2. In the Upload Blueprint dialog, select the blueprint file (from the local blueprint archive) or specify the URL of the remote archive in which the blueprint is located. 
3. Enter the `Blueprint ID` and `Blueprint filename`.   
   If blueprint filename field is omitted, the default `blueprint.yaml` filename is used, which is placed in the top level directory.
4. Click **Save**.

### Deploying a Blueprint
1. On the dropdown menu for the blueprint that you want to deploy, click **Create Deployment**.   
   ![deploy dialog]({{<img "ui/blueprintsPage/deploy.png">}})<br>
2. Specify a name for the deployment.
3. Specify the deployment properties.   
   You can specify individual `Parameters`, or click `Raw` to specify all the properties' values as a single JSON file.   
   ![raw mode]({{<img "ui/blueprintsPage/raw-mode.png">}})

### Deleting a Blueprint
1. On the dropdown menu for the blueprint that you want to delete, click **Delete**.
2. At the prompt, click *Confirm*.

#In-depth Information about a Blueprint
When you click the name of a blueprint in the table, a blueprint-specific dialog opens. The dialog includes three tabs with details about the selected blueprint:<br>
* Topology
* Nodes
* Source


##Topology
The **Topology** tab displays an application’s graph of nodes and their relationships, which describes the lifecycle events or other operations that each node and relationship exposes for use in workflows.<br>
Each of the blueprint's nodes is displayed as a square container that can contain other nodes. Each node has a name, and an icon to indicate the [node type]({{< relref "blueprints/spec-node-types.md" >}}).<br>
[Relationships]({{< relref "blueprints/spec-relationships.md" >}}) between nodes are indicated with arrows that starts at the connected node and end at the target node.<br>
The topology tab shows only the application nodes and not the network nodes. If a node has a network dependency, it is displayed as a bullet icon in the node's title.<br>
The number of node instances is marked in a bullet beside the node's type icon.<br>

![Blueprint topology]({{<img "ui/blueprintsPage/topology.png">}})

You can click the name of a node to display additional details about it.<br>

![Blueprint node details]({{<img "ui/blueprintsPage/sidePanel.png">}})

## Nodes
The **Nodes** tab displays a list of the nodes related to the blueprint topology.<br>
![Blueprint's nodes]({{<img "ui/blueprintsPage/nodes.png">}})
The type, number of instances, and relationships for each node are displayed.<br> 
You can click the magnifier icon to display additional details for the node.<br/>
![Blueprint's nodes sidebar]({{<img "ui/blueprintsPage/nodesSidebar.png">}})

## Source
The **Source** tab displays highlighted blueprint source code, Python plugins and other text files included in your blueprint package.<br/>
![Blueprint source code]({{<img "ui/blueprintsPage/source.png">}})
