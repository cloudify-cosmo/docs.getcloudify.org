---
layout: bt_wiki
title: Creating Blueprints
category: Docs
draft: false
weight: 400

---
Blueprints are created by creating a topology of your environment.

{{% gsNote title="Recommendation" %}}
It is recommended that you watch the following video, which provides an overview of Cloudify Composer 2.3 and describes how to create blueprints. <br>
[![Cloudify Composer Overview Video](https://img.youtube.com/vi/Ywatch?v=c6RWafVzA44&t=53s/0.jpg)](https://www.youtube.com/watch?v=c6RWafVzA44&t=53s)
{{% /gsNote %}}

## Managing the Blueprint Canvas

You add and move node types on the canvas using drag and drop actions. The buttons on the top right of the canvas assist you in creating and viewing the topology.

![zoom in button]({{< img "composer/zoom-in.png" >}})    Enables you to **zoom in**.<br><br>
![zoom out button]({{< img "composer/zoom-out.png" >}})    Enables you to **zoom out**.<br><br>
![center map button]({{< img "composer/center-map.png" >}})    Enables you to **center the topology**.<br><br>
![drag canvas mode]({{< img "composer/drag-canvas.png" >}})    Enables you to **switch to drag canvas** mode.<br><br>
![drag to select mode]({{< img "composer/drag-to-select.png" >}})    Enables you to **switch to drag to select** mode.<br><br>
![create node group]({{< img "composer/create-node-group.png" >}})    Enables you to select a number of node types, to **group them** as a single entity.

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

Dpuble-click a relationship to display its properties for editing and configuring the relationship parameters.

## Network Types

 - **Adding Virtual IP (floating/elastic IP)<br>**
To define a floating IP or elastic IP drag the relevant stencil to the topology canvas, as part of the networking area.
Then, click on the node you'd like to add the IP to and a details panel will be open on the right.
  1. Click on 'Network'
  2. Under the Virtual Ips section click on 'Add virtual ip'
  3. Choose the virtual IP from the drop down list

 - **Removing Virtual IP (floating/elastic IP)**<br/>
   To remove a virtual IP associated with a node, click on the node you'd like to remove the IP from and a details panel will be open on the right.
  1. Click on 'Network'
  2. Under the Virtual Ips section find the virtual IP
  3. Click on the red X button<br/><br/>
 You can also delete the virtual IP from the canvas by clicking on it and choosing the Delete option in the panel that opens to the right. It will then be removed from all nodes it was configured in.

 - **Adding Security Groups** <br/>
To define a security group drag the relevant stencil to the topology, as part of the networking area. Then click the node to add to the security group. The properties panel opens.
  1. Click on 'Network'
  2. Under the security groups section click on 'Add security group'
  3. Choose the security group from the drop down list

 - **Removing Security Groups** <br/>
To remove a security group associated with a node, click on the node you'd like to remove the security group from and a details panel will be open on the right.
  1. Click on 'Network'
  2. Under the Security Groups section find the security group
  3. Click on the red X button<br/><br/>
You can also delete the security group from the canvas by clicking on it and choosing the Delete option in the panel that opens to the right. It will then be removed from all nodes it was configured in.





