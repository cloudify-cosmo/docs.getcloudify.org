---

title: The Blueprints Page



weight: 110

terminology_link: reference-terminology.html
node_types_link: dsl-spec-node-types.html
relationships_link: dsl-spec-relationships.html
---
{{% gsSummary %}}{{% /gsSummary %}}

When clicking on the `Blueprints` tab you are presented with the list of blueprints.<br>
![Blueprints index]({{<img "ui/blueprintsPage/index.png">}})<br>
The table presents each blueprint's Name, Creation date, Update Date, Number of deployments and a dropdown menu with the available actions to perform on the blueprint.<br>
![Blueprints actions]({{<img "ui/blueprintsPage/actions.png">}})

### Upload a blueprint
If you haven't uploaded any blueprints, you can do so by clicking the 'Upload Blueprint' button.
![upload blueprint dialog]({{<img "ui/blueprintsPage/uploadBlueprint.png">}})<br>
The button will open a dialog containing a form requiring the blueprint archive(local blueprint archive or a remote link), name and the blueprint filename within the archive. If blueprint filename field is omitted it defaults to a `blueprint.yaml` file placed in the top level directory.<br>

### Deploy a blueprint
Click on the 'Create Deployment' button of the desired blueprint and a deploy dialog will open.<br>
The deploy form requires a deployment name and deployments properties.
![deploy dialog]({{<img "ui/blueprintsPage/deploy.png">}})<br>
Clicking on the 'Raw' button enables filling all of the properties' fields as a single json.<br>
![raw mode]({{<img "ui/blueprintsPage/raw-mode.png">}})

### Delete a blueprint
Click on the 'Delete' button of the desired blueprint and a delete dialog will open.
If you are certain you would like to delete the blueprint simply press the 'Confirm' button.<br>
![delete dialog]({{<img "ui/blueprintsPage/delete.png">}})

### Filter the table to easily find the desired blueprint.
Use the free text search, searching matching blueprint names.<br>
![Blueprints search]({{<img "ui/blueprintsPage/search.png">}})

Sorting is enabled by clicking the matching table header.<br>
![Blueprints sort]({{<img "ui/blueprintsPage/sort.png">}})

Clicking a blueprint's name will redirect you to a page presenting in depth information about the blueprint, firstly presenting the blueprint's topology.

# Topology

The topology is an application’s graph of nodes and their relationships, which describes the lifecycle events or other operations that each node and relationship exposes for use in workflows.<br>
Each of the blueprint's nodes is displayed as a square container, which can contain other nodes. Each node has a title describing its name, and an icon to indicate the [node's type]({{< relref "blueprints/spec-node-types.md" >}}).<br>
[Relationships]({{< relref "blueprints/spec-relationships.md" >}}) between nodes are marked with arrows, starts from the connected node and ends at the target node.<br>
The topology view shows only the application nodes and not the network nodes. If a node has a network dependency, it will be displayed as a bullet icon in the node's title.<br>
The number of node instances is marked in a bullet beside the node's type icon.<br>

![Blueprint topology]({{<img "ui/blueprintsPage/topology.png">}})

Clicking a node's title will open a side panel with details of the selected node.<br>

![Blueprint node details]({{<img "ui/blueprintsPage/sidePanel.png">}})

# Nodes
A list of nodes according to the blueprint topology.<br/>
![Blueprint's nodes]({{<img "ui/blueprintsPage/nodes.png">}})
For every node, its type, number of instances, and relationships are shown. By clicking the magnifier icon, a side panel will open with the selected node's details.<br/>
![Blueprint's nodes sidebar]({{<img "ui/blueprintsPage/nodesSidebar.png">}})

# Source
Displays highlight blueprint source code, Python plugins and other text files includes in your blueprint package.<br/>
![Blueprint source code]({{<img "ui/blueprintsPage/source.png">}})
