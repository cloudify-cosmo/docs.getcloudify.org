---
layout: bt_wiki
title: Composer Overview
category: Docs
draft: false
weight: 200

---


## Introduction##

Cloudify Composer is a graphical editor for creating blueprint YAML files dynamically, using a modern drag and drop interface.<br />
Cloudify Composer enables topology modeling for complex applications while providing the ability to add relevant lifecycle operations implementation via external plugins and scripts.  Cloudify Composer is a standalone application that is installed separately from Cloudify Manager.<br />

Among its draggable components are platform and network items including 'compute' node, 'database', and 'web server' items, and so on. You can also add your own custom node type components, as well as custom plugins and new interfaces. <br />

The generated result is a downloadable `tgz` file containing:  <br />

- The `blueprint.yaml` file, which provides a TOSCA-based description for the application topology and its lifecycle management. <br />
- Optionally, *Custom types* and *plugins* and other resources that the `blueprint.yaml` depends on.

You use the blueprints that you create in one or more tenants in Cloudify Manager.


## Product Overview##
The key elements of Cloudify Composer are described in this section.

 - **Login** - Upon first use of the Cloudify Composer, you are required to supply a username (password is not required).<br />
After login, you can start creating new blueprints.
Blueprints can be saved and re-loaded again in future session for further editing; yet they are not visible by other users <br />

 - **Topology page** - The topology section allows you to add node types to the blueprint. Simply choose a node type on
the left and drag it to the canvas on the right. <br />
Nodes can either be built in types, or new types added by clicking the New Stencil
button. <br/>
Each of the nodes has an editable name and may contain properties, interfaces and relationships. <br/>
The composer interface allows selecting one node at a time, to see the node properties simply click the node and a panel will appear on the
right side of the screen.

   - **Deleting a node type** is done by clicking on a node will open its properties panel on the right, and click on the delete button will delete the selected node. <br />


 - **Inputs & Outputs** - This page contains an option to add inputs and outputs to a blueprint.yaml.
The 'Name' field is mandatory and must be unique, description and value are optional.  <br />
To add another field, click the '+' button on the right.
To delete an entered field, press the trash can icon.


 -  **Definitions Tab**
In the definitions section you can define new inline types, plugins, and relationships to be used in your blueprints.

     - **Inline Types**
Inline types derive from existing types, and can define additional properties and interfaces to those available with the parent type. 
For each node you can define interface operations and their implementation. We provide a list of available plugins for you.

     - **Plugins**
Plugins can be added in the relevant tab using either a URL (which points to a plugin.yaml or plugin.zip file) or using the plugin implementation file itself (uploading a local plugin.yaml or plugin.zip file).

     - **Relationships**
Relationships, like types, derive from existing relationships and can add properties and interfaces. Interfaces are defined per source and target.

 - **Resources tab** -  allows you to manage resources accompanying the blueprint.
You can create folders and place files within them by uploading from their local computer.


 - **Source tab** contains a read only presentation of the generated blueprint file.
The blueprint is generated with some out of the box list of types/plugins that are added to its 'import' section.

{{% gsThumbnail src="images/ui/composer/stencils-topology.png" title="Topology view. Shows all nodes and their relationships" %}}
{{% gsThumbnail src="images/ui/composer/sidepane.png" title="The side panel shows details per node" %}}
{{% gsThumbnail src="images/ui/composer/inputs-outputs.png" title="In this page you can manage inputs and outputs" %}}
{{% gsThumbnail src="images/ui/composer/definitions.png" title="the Ddefinition page enables you to modify inline types and relationships" %}}
{{% gsThumbnail src="images/ui/composer/source-page.png" title="In the source page you can view the YAML output" %}}


## Actions

 - **Blueprints Action Bar**
On the top right you can find additional actions to perform on the current blueprint.

    - **Save** triggers two actions:
        -  Saving the displayed blueprint.
        -  Running a validation check on the blueprint.yaml.
    - **Download** - Downloads the last saved Blueprint - packages and downloads an archive of the blueprint including all folders with resources & plugins as a TAR file.
    - **Validate** - Validates the displayed Blueprint source code to ensure logical concepts are maintained.
    - **Blueprint Settings** - The settings button opens a menu of additional operations to be performed:
    - **Add a New Blueprint** - Creates a new Blueprint canvas.
    - **Rename a Blueprint** - Enables the displayed blueprint name to be changed.
    - **Import a Blueprint** - Opens an existing Blueprint in the Cloudify Composer canvas.The Blueprint can either be a local file or a URL accessible using the Cloudify Composer.
    - **Delete a Blueprint** - Removes the blueprint both from the display and the composer saved data and cannot be undone.
    - **Switching Between Composed Blueprints** - To browse your Blueprints, click the arrow next to the Blueprint name on the top left and choose one of the available Blueprints to open. The available Blueprints are those that the user created, imported, and saved.
    - **Logout** - Logout ends the current user session and routes the user back to the login page, enabling a new login.

{{% gsThumbnail src="images/ui/composer/blueprint-settings.png" title="Open the menu to see more actions" %}}
{{% gsThumbnail src="images/ui/composer/browsing-blueprints.png" title="This is how you browse between blueprints" %}}
