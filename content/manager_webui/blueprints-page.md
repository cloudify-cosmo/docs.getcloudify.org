---
layout: bt_wiki
title: Blueprints Page
category: Web Interface
draft: false
abstract: Blueprint Page Reference
weight: 130
---

The `Blueprints` page is fully configurable in terms of the widgets that are displayed. By default, the Blueprint widget is displayed in table format and provides a list of all the blueprints in this Cloudify Manager instance.<br>

The table includes the name of each blueprint, its creation date, update date, and the number of deployment instances. <br>
![Blueprints index]({{<img "ui/blueprintsPage/index.png">}})

* You can filter the table by entering text in the **Blueprint Name** search box.
* You can sort items in the table in ascending or descending order by clicking a column title.

### Uploading a Blueprint
1. Click the **Upload** button in the Blueprints List widget to upload a blueprint.   
   If you have the Blueprint Catalog displayed, click **Upload** in the required blueprint 
2. In the Upload Blueprint dialog, select the blueprint file (from the local blueprint archive) or specify the URL of the remote archive in which the blueprint is located. 
3. Enter the `Blueprint ID` and `Blueprint filename`.   
   If a blueprint filename field is omitted, the default `blueprint.yaml` filename is used, which is placed in the top level directory.   
4. (Optional) Select an icon for the blueprint that will appear in the catalog or table view next to the blueprint name.
5. Click **Save**.

### Deploying a Blueprint
1. Click the deploy icon adjacent to the name of the blueprint that you want to deploy.   
   ![deploy dialog]({{<img "ui/blueprintsPage/deploy.png">}})<br>
2. Specify a name for the deployment.
3. Specify the deployment properties.   
   The names of the default properties appear in the properties fields. You can leave these defaults or specify a new property.   
4. Click **Deploy** to deploy the blueprint.

### Deleting a Blueprint

*  Click the delete icon adjacent to a bluepoint entry to delete it.

## Additional Information about Blueprints

When you click the name of a blueprint in the Blueprints List table, a blueprint-specific page opens. The page displays four widgets with details about the selected blueprint:

* Topology
* Deployments
* Inputs and Outputs
* Source

### Topology

The **Topology** widget displays an application’s graph of nodes and their relationships, which describes the lifecycle events or other operations that each node and relationship exposes for use in workflows.

![Blueprint topology]({{<img "ui/blueprintsPage/topology.png">}})

Each of the application's nodes is displayed as a square container that can contain other nodes. Each node has a name, and an icon to indicate its [node type]({{< relref "blueprints/spec-node-types.md" >}}).

[Relationships]({{< relref "blueprints/spec-relationships.md" >}}) between nodes are indicated with arrows that start at the connected node and end at the target node.

The topology pane shows only the application nodes and not the network nodes. If a node has a network dependency, it is displayed as a bullet icon in the node's title.<br>
The number of node instances is marked in a bullet beside the node's type icon.<br>

You can click the name of a node to display additional details about it.<br>

### Deployments

The **Deployment** widget displays information about where this specific blueprint is deployed, when it was created, and so on.  In addition the deployment Inputs, Outputs, Events and Logs widgets are displayed. 

If you click the name of a deployment, it displays the Nodes widget (see below for details about this widget), and displays buttons that enable you to update or delete the deployment, and to execute a workflow.

#### Nodes
The **Nodes** widget displays a list of the nodes related to the blueprint topology.

![Blueprint's nodes]({{<img "ui/blueprintsPage/nodes.png">}})

The type, container, connection, number of instances, and groups of which the node is a part are displayed.

If you click the name of a node, it's instance is displayed.

### Blueprint Inputs and Outputs
The **Blueprint Inputs** and **Blueprints Outputs** widgets display the values for these elements. If you hover over the outputs value, the code for the output appears. 

![Blueprint source code]({{<img "ui/blueprintsPage/source.png">}})

### Blueprint Sources
The **Blueprint sources** widget displays all the sources in the Blueprint package.
