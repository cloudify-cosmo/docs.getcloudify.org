---
layout: bt_wiki
title: Cloudify Composer Overview
category: Docs
draft: false
weight: 200

---

Cloudify Composer is an editor for creating Blueprint YAML files dynamically, using a drag and drop interface. 

Cloudify Composer enables you to model topology for complex applications, and to add relevant lifecycle operations implementation via external plugins and scripts. 

Among its drag-and-drop components are platform and network items such as `compute` node, `database`, `web server`, and so on. You can also add your own custom node type components, custom plugins and interfaces. 

The generated output from Cloudify Composer is a downloadable TGZ archive containing a blueprint.yaml *file* that provides a TOSCA-based description for the application topology and its lifecycle management. In addition to YAML artifacts, the blueprint archive includes a blueprint *package* that contains multiple resources such as configuration and installation scripts (or Puppet Manifests, or Chef Recipes, etc..), code, and basically any other resource you require for running your application.

## Logging In
The first time that you use Cloudify Composer, you must supply a username and a password. Use the following defaults:<br />
**Username:** `composer` <br />
**Password:** `composer`

When you have logged in to Cloudify Composer, the Topology page for the selected blueprint is displayed.

![Blueprints List]({{< img "composer/composer_interface.png" >}})

The left side of the Cloudify Composer Topology tab displays a Stencils catalog that contains resources that you can add to the blueprint. The main pane on the tab is a canvas on to which you drag and drop nodes and define the relationships between them. 


## Workflow
This workflow describes the main functions related to creating a Blueprint. Typically, when you are using Cloudify Composer, your workflow will be similar to the one described in this section. Additional functions, such as importing Stencils and Blueprints, and so on, are described after the primary functions related to creating a Blueprint.

### Blueprints List
You can display the menu of all available blueprints that you created or imported by clicking the dropdown arrow next to the name of the currently displayed blueprint.

![Blueprints List]({{< img "composer/blueprints-list.png" >}})

At the bottom of the list are buttons to enable you to create or import a blueprint. 

### Adding Node Types and Relationships to a Blueprint 
Node types and relationships are added to a Blueprint canvas on the Topology tab. The Topology tab comprises two parts: <br />
- The main canvas, on which the  topology components are added and connected to each other<br />
- The Stencils panel, which contains grouped node types that are used as the building blocks of the topology. 

### Working with Nodes
You add a node by dragging the required node type from the Stencils panel and dropping it on canvas. You then click it to edit its properties. The properties that are available are dependent on the node type.
More about the node type’s properties here: 

Depending on their type, you can add nodes inside other nodes. For example, a DB server can be contained inside a compute node, a subnet node inside a network node, and a port node inside a subnet node. When a node is nested inside another node, a contained-in relationship is automatically generated between them. 

You can define other relationships between nodes by clicking, holding and dragging the pointer from the right (exit) arrow of one node to the left (entrance) arrow of another. This action generates a connected-to relationship type. 

To connect networks to a platform node, click and drag a line from the VNIC square at the bottom of the node to the left (entrance) side of the network. The connection is reflected as a black square in the VNIC. Each square in the VNIC represents one connected network. 

![Blueprints List]({{< img "composer/connect-to-network.png" >}})

### Adding Custom Node Types
You can add custom node types by creating new ones, or by importing them. 

**Creating a Custom Node Type**<br />
You create custom node types on the **Definitions** tab.

1  On the **Definitions** tab, click **New Type**. <br />
2  Specify the settings for the new node type, including  where it  derives from, and any additional properties and interfaces.<br />
3  Save the new node type.

The new node type appears in the Custom Types list in the Stencils panel. You can use it in the same way as the built-in node types, by dragging and dropping it onto the canvas.

![Custom Node Types]({{< img "composer/custom-node-types.png" >}})

### Adding Plugins to the Blueprint Package
**Adding a Plugin**<br />
You add plugins on the **Definitions** tab. Cloudify supports many plugins, which you can [access here](http://getcloudify.org/downloads/plugin-packages.html). In addition, you can create your own plugins.

**Creating a Custom Plugin**<br />
1  Click **Add Plugin** and specify the following properties:<br />
    - The plugin file name<br />
    - The Executor<br />
    - The URL or a local archive of the specified plugin  <br /><br>
  ![Create custom plugin]({{< img "composer/add-new-plugin.png" >}})
2  Click **Save** to save the properties that you have specified.<br />

After a plugin is attached to a package, the operation it exposes appears in the interface’s operations implementations tree, as shown in the following screen capture.<br /> 

![Implementations Tree]({{< img "composer/implementation-tree.png" >}})

### Adding a Relationship Type
Custom Relationships, like types, derive from existing relationships and can add properties and interfaces. Interfaces are defined per the source and target nodes that define the relationship.

### Importing Stencils###
You can import an external file that contains definitions of multiple node types to Cloudify Composer. Such files are referred to as *stencils*. After you have imported a stencil, it appears in the Imports list and you can see all the node types that were added, in their relevant node type group. The node types can be added to the Blueprint package.

**Importing a Stencil**<br />
1  Click **Import new node type** at the bottom of the Stencils panel.<br />
2  Specify a local file or a URL that contains node types and click **Save**.

### Viewing Topology Source Code
Every addition or change that you make to the topology of your Blueprint package is 
reflected in code that you can see on the **Source** tab. This tab provides a representation of the generated TOSCA code behind the application modeling.

![Topology Source Code]({{< img "composer/source-tab.png" >}})<br />

### Node Settings 
Clicking a node on the Blueprint canvas opens its settings window. The settings are divided into four sections.<br />
   
 - **Properties:**
The properties that were defined in the node type or its parents. The values can be 
edited. <br />

 - **Interfaces:**
The interfaces and lifecycle events that are defined in the current node type or its 	parents. You can select the implementation to occur when a lifecycle operation is executed. You can add a script (which has already been added to the “resources” tree on the **Resources** tab), or select a plugin’s operation implementation. <br />

 - **Relationships:**
The relationships of the current node. You can edit the relationships by clicking on a 
		relationship connector, and changing its settings. <br />

 - **Networks and Network Components:**
The networks and networks’ components associated with the current node. For example,
		security groups and IP addresses. By adding one or more relevant components, you can 
		assign them to the node and also see them reflected in the VNIC square. 

### Intrinsic Functions

As in Cloudify Manager, the values of a node’s properties, inputs or outputs can be specified as intrinsic function return values. The intrinsic functions list is available at this URL [http://getcloudify.org/guide/3.1/dsl-spec-intrinsic-functions.html](http://getcloudify.org/guide/3.1/dsl-spec-intrinsic-functions.html).

Cloudify Composer auto-fills the functions and displays the available properties in the existing topology. Note that, for the `get_attribute` function you must be familiar with and use the run-time attributes' names, not the auto-filled properties names. For example, to obtain a virtual IP address using the `get_attribute` function, use the run-time attribute `VirtualIp_address`, not the `VirtualIP` property.

### Creating a Group
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
You can group a number of components using the “drag to select” button, which is the second from the right on the toolbar. Select the required nodes and click on the “create group” button, on the far right of the toolbar to create a resource group in the topology view. The resource group is also created in the source code, and you can view it on the **Sources** tab.  
 
###Inputs and Outputs
Cloudify Composer enables you to add inputs and outputs to the Blueprint on the **Inputs & Outputs** tab.

Inputs are parameters that are inserted into the Blueprint when a deployment is created. They are useful when you need to use information that is still unknown at the time that the Blueprint is created. Inputs can also modify deployments of the same Blueprint. You can reference inputs from other parts of the topology, using the `get_input` intrinsic function.



 


