---
layout: bt_wiki
title: Creating Blueprints
category: Docs
draft: false
weight: 400
aliases: /composer/blueprint-creation/
---
A blueprint is a model of the application’s topology and its operations implementation.

## Managing the Blueprint Canvas

You add and move node types on the canvas using drag and drop actions. The buttons on the top right of the canvas assist you in creating and viewing the topology.

![zoom in button]( /images/composer/zoom-in.png )    Enables you to **zoom in**.<br><br>
![zoom out button]( /images/composer/zoom-out.png )    Enables you to **zoom out**.<br><br>
![center map button]( /images/composer/center-map.png )    Enables you to **center the topology**.<br><br>
![drag canvas mode]( /images/composer/drag-canvas.png )    Enables you to **switch to drag canvas** mode.<br><br>
![drag to select mode]( /images/composer/drag-to-select.png )    Enables you to **switch to drag to select** mode.<br><br>
![create node group]( /images/composer/create-node-group.png )    Enables you to **group** the nodes that you selected.

## Using and Managing Stencils

Cloudify Composer includes built-in node types, but you can also import your own.

1. To add new node types, click **Import a new node type** below the stencils in the Stencils catalog.
2. Enter the URL to a YAML file, or click **Choose File** to navigate to your YAML archive.
3. Click **Save**.<br>
The imported node type is saved in the list of imports on the **Import** tab, and appears in your Stencils catalog.
Each type is displayed with an icon that is derived from its parent type.<br/>

## Adding Nodes to a Blueprint

* Select the node type that you require to add to the blueprint and drag it from the Stencil catalog to the canvas. <br/>
Cloudify Composer only allows you to perform valid actions.


## Editing a Node

1. Double-click the node to display its properties. You also see properties for node-affected relationships.
2. Clicking in the relevant properties field to make your changes.
3. Press **Enter** to apply your changes.   
   To exit without applying your changes, press **Esc**.
  
### Node Properties
The node property panel includes the following components:

- **Node Name** - The name must be unique. 
- **Delete** (button) - This operation cannot be reversed. When you delete a node that is connected to other nodes, the relationship connecting the deleted node is also deleted.
- **Number of Instances** - Unless otherwise stated, the number of set node instances is 1.
- **Properties** - The properties that you see are dependent on the node type.
- **Interfaces** - The interface properties are dependent on the node type. They enable you to specify the implementation for every stage of the node lifecycle. You can reference external plugin implementation for the interface, and also define the list of inputs.
- **Relationships** - Relationships are only displayed for nodes that are connected to other nodes. 

## Node Relationships

To define a relationships between nodes, where the connector icon is displayed, draw a connecting line from the edge of one node type to the edge of another. Note that the connector icons show either relationships in or relationships out of a node type.<br/>
You can pull the relationship line so that it is displayed in the topology according to your preferences.

Double-click a relationship to display its properties for editing and configuring the relationship parameters.

## Network Types

 - **Adding Virtual IP<br>**
To define IP components, drag the relevant icon to the topology canvas then select the node to which you want to add the IP. 
  1. In the properties panel, click **Network**.
  2. Under the Virtual IPs section, click **Add virtual IP**.
  3. Select the required virtual IP from the dropdown list.<br>
The IP component is added to the node's VNIC area.

 - **Removing Virtual IP**<br/>
   To remove a virtual IP associated with a node, select the node from which you want to remove the virtual IP.
  1. In the properties panel, click **Network**.
  2. Under the Virtual IPs section, locate the virtual IP to remove.
  3. Click the X button next to its name to delete the IP.<br/>
 You can also delete a virtual IP from the canvas by selecting it and clicking **Delete** in the properties panel. It is removed from all nodes on which it was configured.<br>

 - **Adding Security Groups** <br/>
To define a security group drag the relevant stencil to the topology canvas then click the node to add to the security group. 
  1. In the properties panel, click **Network**.
  2. Under the security groups section, click **Add security group**.
  3. Select the security group to add from the dropdown list.<br>

 - **Removing Security Groups** <br/>
To remove a security group associated with a node, click the node from which you want to remove the security group.
  1. In the properties panel, click **Network**.
  2. Under the Security Groups section, locate the security group to remove.
  3. Click on the X button next to its name to remove the group.<br/><br/>
You can also delete a security group from the canvas by selecting it and clicking Delete in the properties panel. It is removed from all nodes on which it was configured.

## Source View

Source view provides a representation of the generated TOSCA code behind the application modeling.
To open source view expand Resources node and select your blueprint's main blueprint file.

![Topology Source Code]( /images/composer/source-tab.png )


It works two ways:

  1. Allows to see the currently generated blueprint based on all of the user inputs:
    - TOSCA definitions version
    - imports
    - blueprint description
    - inputs and outputs
    - custom node/relationship types created by user
    - nodes added to topology, including their properties, interfaces, network configuration and relationships between nodes

  2. Provides a possibility to edit or paste the blueprint source code directly. Composer will parse it and reflect in the UI accordingly. To save a modified source press the ![Save Source]( /images/composer/save-source.png ) button in the top right corner of the editor. Composer will then run validation and if the syntax of your source code is correct you should see:
    
    ![Source Saved]( /images/composer/source-saved.png )

{{% warning title="Warning" %}}
If you write some illegal code, it will either not be reflected in the topology and anywhere in the Composer or will throw an error.
{{% /warning %}}

{{% note title="Remember" %}}
When referring to any resources in your source code make sure you've added them in the main blueprint's YAML file code.
{{% /note %}}
