---
layout: bt_wiki
title: Blueprint Creation
category: Docs
draft: false
weight: 400

---
# Blueprint Editing Concepts  

### Using and Managing Stencils 
The composer is delivered with a list of stencils (node types), describing all available types of Cloudify TOSCA
nodes.
 
In order to add new type representation, press the 'New stencil' button - this will open the 'Add New Stencil' form which allows to add a new
stencil by uploading a file locally, or by supplying a url which points to the wanted file (note that the stencils file should be in a yaml format and represent the wanted node-types).
The new types will be added in a separate panel with a caption of the types namespace. 
Each type will appear with an icon derived from the parent type.

When a user logs in to the system he will see the list of built in stencils (types), as well as the
stencils the user added in previous sessions.

### Adding Nodes to The Blueprint
Nodes are defined based on built in types, as well as added inline types. 
Note that nodes are currently defined per cloud provider (i.e. OpenStack, CloudStack, etc), or as the basic Cloudify type nodes (providerless platform and network components).
When dragging nodes into the canvas areas, the composer will only allow performing legal actions. 
This prevents users from performing actions that are not consisting with topology concepts, for example hosting a volume inside a compute node, or defining a network within the volume.


### Editing Nodes in The Blueprint

Every node added to the canvas starts with the basic "node implementation" but in order to be fully defined , some editing is required. 
To edit the node simply click on it, and on the right side of the screen a window will open up with all configuration options for the node.


#### Renaming a Node 
By default, the node name would be its type followed by the next available index. 
To change a node's name, press it and replace the existing name with a new one. Note that the name must be unique in the scope of this blueprint.

#### Deleting a Node 
Nodes can be deleted from the canvas area at any time by selecting the node and pressing the delete button on the details panel that open up. 
This operation cannot be reversed and requires a confirmation in the popup window that opens.
Note that when deleting a node connected to other nodes, the relationship connecting the deleted node will be deleted as well.

#### Setting Number of Instances
Unless otherwise stated, the number of set node instances is 1. 
This value can be changed from the edit panel.

#### Editing Node Properties
The properties presented depend on the node type. 
Properties of user-defined nodes are set as part of the node type definition. (as detailed in [Inline Types])

#### Editing Node Interfaces
Interfaces depend on the node type as well, and enable selecting the implementation for every stage of the node lifecycle. 
From here the user can reference external plugin implementation for the interface, as well as define the list of inputs.

#### Node Relationships

Relationships will only be displayed for nodes connected to other nodes, and can then be edited accordingly as described in [Editing Relationships in The Blueprint].

##### Adding Relationships to The Blueprint:
To define a relationships between nodes, simply connect the nodes. Note you have to draw the connecting line from one of the edges to one of the edges, where the connecter icon is available. The relationship can then be edited by clicking on it and configuring the relevant relationship parameters.

##### Editing Relationships in The Blueprint:
Choose the relationship to edit and click on it, to get the next edit panel displaying the properties, source interfaces, and target interfaces for the connector.  Changing the connection name and type is done from the upper part of the panel.


### Using Network Types

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

#### Adding Virtual IP (floating/elastic IP)

To define a floating IP or elastic IP drag the relevant stencil to the topology canvas, as part of the networking area. Then, click on the node you'd like to add the IP to and a details panel will be open on the right.

1. Click on 'Network'

2. Under the Virtual Ips section click on 'Add virtual ip'

3. Choose the virtual IP from the drop down list

#### Removing Virtual IP (floating/elastic IP)

To remove a virtual IP associated with a node, click on the node you'd like to remove the IP from and a details panel will be open on the right.

1. Click on 'Network'

2. Under the Virtual Ips section find the virtual IP

3. Click on the red X button

You can also delete the virtual IP from the canvas by clicking on it and choosing the Delete option in the panel that opens to the right. It will then be removed from all nodes it was configured in.

#### Adding Security Groups

To define a security group drag the relevant stencil to the topology canvas, as part of the networking area. Then, click on the node you'd like to add the security group to and a details panel will be open on the right.

1. Click on 'Network'

2. Under the security groups section click on 'Add security group'

3. Choose the security group from the drop down list

#### Removing Security Groups

To remove a security group associated with a node, click on the node you'd like to remove the security group from and a details panel will be open on the right.

1. Click on 'Network'

2. Under the Security Groups section find the security group

3. Click on the red X button

You can also delete the security group from the canvas by clicking on it and choosing the Delete option in the panel that opens to the right. It will then be removed from all nodes it was configured in.


  [Inline Types]: /composer/overview/#inline-types
  [Editing Relationships in The Blueprint]: #editing-relationships-in-the-blueprint
