---
layout: bt_wiki
title: Blueprint Creation
category: Docs
draft: false
weight: 400

---

# Stencil Management
The composer is delivered with a list of stencils, describing all available types of Cloudify TOSCA
nodes. In order to add new type representation the new stencil option can be used.

Users can choose the add stencil button in order to fetch a types.yaml location by pointing to
URL. The types will be added as a separate panel with a caption of the types namespace. Each
type appears with the derived icon (from the parent type). 

When a user logs in to the system he will see the list of built in stencils (types), as well as the
stencils the user added in previous sessions.

Stencils currently cannot be deleted – this functionality will be available in future releases.

# Adding Nodes to The Blueprint
Nodes are defined based on built in types, as well as added inline types. Note that nodes are currently defined per cloud provider (i.e. OpenStack, CloudStack, etc), or as the basic Cloudify type nodes.
When dragging nodes into the canvas areas, the composer will only allow performing legal actions. This prohibits users from performing actions that are not consisting with topology concepts, for example hosting a volume inside a compute node, or defining a network within the volume.

# Deleting Nodes from The Blueprint
Nodes can be deleted from the canvas area at any time by selecting the node and pressing the delete button on the details panel that open up. This operation cannot be reversed and requires a confirmation in the popup window that opens.
Note that when deleting a node connected to others, the relationship connecting the deleted node will be deleted as well.

# Editing Nodes in The Blueprint
Every node added to the canvas starts with the basic node implementation but in order to fully define the node it needs to be edited. To edit the node simply click on it, and on the right side of the screen a window will open up with all configuration options for the node.

## Name
By default, the node name would be its type followed by the next available index. To change the node name press on it and replace with the text of choice. Name should be unique within the blueprint.
## Number of Instances
Unless otherwise stated, the number of instances for the node is 1. The value can be changed from the edit panel.

## Properties
The properties presented depend on the node type. For nodes defined by the user they are dependent on the properties defined as part of the new type definition (as detailed in [Inline Types])

## Interfaces
Interfaces depend on the node type as well, and enable selecting the implementation for every stage of the node lifecycle. From here the user can reference external plugin implementation for the interface, as well as define the list of inputs.

## Relationships
Relationships will only be displayed for nodes connected to other nodes, and can then be edited accordingly as described in [Editing Relationships in The Blueprint].

# Adding Relationships to The Blueprint
To define a relationships between nodes, simply connect the nodes. Note you have to draw the connecting line from one of the edges to one of the edges, where the connecter icon is available. The relationship can then be edited by clicking on it and configuring the relevant relationship parameters.

# Editing Relationships in The Blueprint
Choose the relationship to edit and click on it, to get the next edit panel displaying the properties, source interfaces, and target interfaces for the connector.  Changing the connection name and type is done from the upper part of the panel.

## Properties
Here the connection type can be changed, from the available values for this connection. Most connections are one-to-one or all-to-all.

## Interfaces
Both source and target interfaces can be defined an edited, including inputs for each.

## Relationship
In this panel you can change the source and target node this relationship defines.

# Networking
Networking nodes should be defined in the lower part of the canvas, and can then be connected
to the application topology via relationships.

Users can add L2 and L3 networks (L2 is a vSwitch and L3 is a subnet with CIDR in this switch. In
some clouds L2 is pre-provisioned and L3 is user provisioned)

When defining both L2 and L3 - L2 will become a small rectangle with switch icon and L3 will
become a network icon within it and a unique color assigned to it.

L3 have multiple connection points to connect it to many servers.

User can connect a subnet directly with a host - as a result a new vnic rectangle in the color of
the subnet will appear and the connector will be colored as well. User may drag a port onto the
vNIC and as a result she can connect the Subnet with the VM using the port. this will have a
physical indicator of a rectangle (vs. a circle) on the Subnet side and [optionally a port icon on
the connector which looks like a network plug see below]:

User can further drag a security group to the vNIC or the subnet side of the connection to define
a security group but most often it will be done by editing the security group section on the vNIC
table in the details panel (The connecting line will have a security group (lock) icon)

Finally user can drag and drop a floating IP icon on the connection which will result in a a NAT
icon on the line and the floating IP node name in the vNIC details table

L3 can also be connected to another L3 using a Router.

Routers are circle with router icon that can be drag and dropped on the canvas.

Routers relationships to L3 subnets will be marked as color connectors according to the subnet
color


  [Inline Types]: /composer/overview/#inline-types
  [Editing Relationships in The Blueprint]: #editing-relationships-in-the-blueprint