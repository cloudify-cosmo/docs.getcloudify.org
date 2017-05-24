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

{{% gsTip title="Tip" %}}
You can sort items in the table in ascending or descending order by clicking a column title.
{{% /gsTip %}}
 

### Uploading a Blueprint
1. Click the **Upload** button in the Blueprints List widget to upload a blueprint.   
   If you have the Blueprint Catalog displayed, click **Upload** in the required blueprint 
2. In the Upload Blueprint dialog, select the local blueprint archive or specify the URL of the remote archive in which the blueprint is located. 
3. Enter the `Blueprint name` and `Blueprint filename`.   
   `Blueprint name` is the name with which you want to identify this blueprint on the Cloudify Manager instance.<br>
   `Blueprint filename` is the name of the yaml file in the archive that you want to upload. If a blueprint filename field is omitted, the default `blueprint.yaml` filename is used.   
4. (Optional) Select an icon for the blueprint that will appear in the catalog or table view next to the blueprint name.   
   If you upload a blueprint from a github repository, a PNG file in that repository is automatically added as the blueprint's logo. If there is no logo PNG file in your repository, the default Cloudify icon is used.
5. Click **Save**.

![different icons]({{<img "ui/blueprintsPage/icon-options.png">}})

### Deploying a Blueprint
1. Click the deploy icon adjacent to the name of the blueprint that you want to deploy.   
   If you have used the drill-down option on a specfic blueprint, click **Deploy Blueprint**.
   ![deploy dialog]({{<img "ui/blueprintsPage/deploy.png">}})<br>
2. Specify a name for the deployment.
3. Specify the deployment inputs.   
   The names of the default input values appear in the inputs fields. You can leave these defaults or specify a new input.   
4. Click **Deploy** to deploy the blueprint.

### Deleting a Blueprint

*  Click the delete icon adjacent to a blueprint entry to delete it.

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

The number of node instances is marked in a bullet beside the node's type icon.<br>

You can click the name of a node to display additional details about it.<br>

### Deployments

The **Deployment** widget displays information about when this specific blueprint was created, and so on.  In addition the current status of the nodes are displayed.

![Deployment widget]({{<img "ui/blueprintsPage/deploy-widget.png">}})

* **Green:** The number of nodes that are running
* **Yellow:** The number of nodes that are in progress
* **Orange:** The number of nodes that are in warning state
* **Red:** The number of nodes that are deleted or stopped

If you click the name of a deployment, it drills down to the Nodes widget, which provides additonal data about the deployment (see below for details about this widget) and displays buttons that enable you to update or delete the deployment, and to execute a workflow.

#### Nodes
The **Nodes** widget displays a list of the nodes related to the blueprint topology.

![Blueprint's nodes]({{<img "ui/blueprintsPage/nodes.png">}})

The type, containing node, connection, number of instances, and groups of which the node is a part are displayed.

If you click the name of a node, it's instance is displayed.

### Blueprint Inputs and Outputs
The **Blueprint Inputs** and **Blueprints Outputs** widgets display the values for these elements. If you hover over the outputs value, the code for the output appears. 

![Blueprint source code]({{<img "ui/blueprintsPage/source.png">}})

### Blueprint Sources
The **Blueprint sources** widget displays all the sources in the Blueprint package.

![Sources widget]({{<img "ui/blueprintsPage/sources-widget.png">}})