---
layout: bt_wiki
title: Creating Blueprints
category: Cloudify Composer
draft: false
weight: 400
aliases: /composer/blueprint-creation/
---
A blueprint is a model of the application’s topology and its operations implementation.

{{< param cfy_composer_name >}} allows to display/edit the blueprint in two complementary ways:
 
* **Topology view** - visual representation of the blueprint
* **Source view** - blueprint's source code


## Topology view

It provides visual representation showing used nodes and relations between them. You can access this view by clicking **Topology** option under the blueprint in Project view pane.

![Topology view]( /images/composer/topology-view.png )

You add and move node types on the canvas using drag and drop actions. The buttons on the top right of the canvas assist you in creating and viewing the topology:

![Topology toolbar]( /images/composer/topology-toolbar.png )

* Zoom in
* Zoom out
* Fit topology to screen
* Switch to **drag canvas** mode
* Switch to **drag to select** mode
* Create a group from selected nodes
* Switch to [Source view](#source-view)


### Nodes types

All node types - both Cloudify built-in and provided by the imported plugins - are presented in the left pane called Stencils pane. Each type is displayed with an icon that is derived from its parent type.
 
You can also import your own node types by adding plugins. See [Managing Plugins]({{< relref "developer/blueprints/spec-inputs.md" >}}) on how to add plugins to a blueprint.


### Adding Nodes to a Blueprint

Select the node type that you require to add to the blueprint and drag it from the Stencil catalog to the canvas.

{{< param cfy_composer_name >}} only allows you to perform valid actions.


### Editing a Node

Click the node to display the node property panel. It includes the following components:

- **Node Name** - The name must be unique.
- **Clone** (button) - This operation clones the node.
- **Delete** (button) - This operation cannot be reversed. When you delete a node that is connected to other nodes, the relationship connecting the deleted node is also deleted.
- **Node Type** - Type of the node.
- **Number of Instances** - Unless otherwise stated, the number of set node instances is 1.
- **Properties** - The properties that you see are dependent on the node type. Their values can be edited.
- **Interfaces** - The interface properties are dependent on the node type. They enable you to specify the implementation for every stage of the node lifecycle. You can reference external plugin implementation for the interface, and also define the list of inputs.
- **Relationships** - Relationships are only displayed for nodes that are connected to other nodes.
- **Network** - The networks and networks’ components associated with the current node. For example, security groups and IP addresses. By adding one or more relevant components, you can assign them to the node and also see them reflected in the VNIC square.

To close the panel, press **Esc** or click the close window icon on the top-right corner.

![Working with Nodes]( /images/composer/working-with-nodes.png )


### Setting interfaces

To select the operations that you require, click the ![Select Operation]( /images/composer/select-implementation-icon.png ) icon next to the implementation fields in the node's Interfaces section on the right of the screen. The following dialog box is displayed:

![Implementation tree]( /images/composer/implementation-tree.png )


### Defining relationships

To define a relationship between nodes, where the connector icon is displayed, draw a connecting line from the edge of one node type to the edge of another. Note that the connector icons show either relationships in or relationships out of a node type.

You can pull the relationship line so that it is displayed in the topology according to your preferences.

Click a relationship connector to display its properties for editing and configuring the relationship parameters.


### Creating networks

To connect networks, subnets and ports to a platform node, click and drag a line from the VNIC square at the bottom of the node to the left (entry) side of the network. The connection is reflected as a colored square in the VNIC. Each square in the VNIC represents one connected network. 

![Connect to Network]( /images/composer/connect-to-network.png )


#### Virtual IP

To define IP components, drag the relevant icon to the topology canvas then select the node to which you want to add the IP.
  1. In the properties panel, click **Network**.
  2. Under the Virtual IPs section, click **Add virtual IP**.
  3. Select the required virtual IP from the dropdown list.<br>
The IP component is added to the node's VNIC area.

To remove a virtual IP associated with a node, select the node from which you want to remove the virtual IP.
  1. In the properties panel, click **Network**.
  2. Under the Virtual IPs section, locate the virtual IP to remove.
  3. Click the X button next to its name to delete the IP.<br/>
 You can also delete a virtual IP from the canvas by selecting it and clicking **Delete** in the properties panel. It is removed from all nodes on which it was configured.<br>


#### Security Groups
 
To define a security group drag the relevant stencil to the topology canvas then click the node to add to the security group.
  1. In the properties panel, click **Network**.
  2. Under the security groups section, click **Add security group**.
  3. Select the security group to add from the dropdown list.<br>

To remove a security group associated with a node, click the node from which you want to remove the security group.
  1. In the properties panel, click **Network**.
  2. Under the Security Groups section, locate the security group to remove.
  3. Click on the X button next to its name to remove the group.<br/><br/>

You can also delete a security group from the canvas by selecting it and clicking Delete in the properties panel. It is removed from all nodes on which it was configured.


### Creating a Group

You can group a number of components using the ![drag to select]( /images/composer/drag-to-select.png ) button. Select the required nodes and click on the ![create node group]( /images/composer/create-node-group.png ) button to create a resource group in the Topology view. 

The resource group is also created in the source code. You can click the group to display its properties and add or remove members.

![create group]( /images/composer/create-group.png )


### Intrinsic Functions

As in {{< param mgr_premium_title >}}, the values of node properties, inputs or outputs can be specified as intrinsic function return values. The intrinsic functions list is available at [Intrinsic functions specification page]({{< relref "developer/blueprints/spec-intrinsic-functions.md" >}}).

{{< param cfy_composer_name >}} auto-fills the functions and displays the available properties in the existing topology. Note that, for the `get_attribute` function you must be familiar with and use the run-time attributes' names, not the auto-filled properties names. For example, to obtain a virtual IP address using the `get_attribute` function, use the run-time attribute `VirtualIp_address`, not the `VirtualIP` property.


## Source view

Source view provides a representation of the generated TOSCA code behind the application modeling.
You can open this file in two different ways:

* By manually selecting your main blueprint YAML file under Resources node. The file is highlighted in bold.
* By pressing the **Switch to Source view** button in the top right corner of the editor.

![Topology Source Code]( /images/composer/source-view.png )

It works two ways:

1. Allows to see the currently generated blueprint based on all of the user inputs:
    * TOSCA definitions version
    * imports
    * blueprint description
    * inputs and outputs
    * custom node/relationship types created by user
    * nodes added to topology, including their properties, interfaces, network configuration and relationships between nodes

2. Provides a possibility to edit or paste the blueprint source code directly. {{< param cfy_composer_name >}} will parse it and reflect in the Topology view accordingly.


### Saving resources

To save a modified source press the **Save Source** button in the top right corner of the editor. {{< param cfy_composer_name >}} will then run a 2-step validation:

1. Syntax of your source code  
2. Cloudify DSL rules validation


### Switching views

To switch to topology view press the **Switch to Topology view** button  in the top right corner of the editor. Please note this button is available only for main blueprint file and is absent for other files.

{{% warning title="Warning" %}}
If you write some illegal code, it will either not be reflected in the topology and anywhere in the {{< param cfy_composer_name >}} or will throw an error.
{{% /warning %}}

{{% note title="Remember" %}}
When referring to any resources in your source code make sure you've added them in the main blueprint's YAML file code.
{{% /note %}}
