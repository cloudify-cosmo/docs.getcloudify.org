---
layout: bt_wiki
title: Composer Components Overview
category: Docs
draft: false
weight: 200

---

## Introduction & Product Overview 

The Blueprint Composer is a graphical editor for creating blueprint YAML files dynamically using
a modern drag and drop interface. <br />
The composer enables topology modeling for complex applications while providing means to add relevant lifecycle operations implementation via external plugins and scripts.  <br />

Among its draggable components you'll find platform & network items (such as 'compute' node, 'database', 'web server' etc..) and you'll be able to add your own custom node types components as well as custom plugins and new interfaces. <br />

The generated result will be a downloadable tgz file containing:  <br />
- blueprint.yaml file which provides a TOSCA based description for the application topology and its lifecycle management. <br />
- Custom types and plugins (if added by the user) and other resources the blueprint.yaml depends on.

### Login
Upon first use of the Blueprint Composer, the user is required to supply a username (password is not required).<br />
After login, the user enters the composer UI and can start creating new blueprints. 
Blueprints can be saved and re-loaded again in future session for further editing; yet they are not visible by other users <br />
   

### Topology tab
The topology section allows you to add node types to the blueprint. Simply choose a node type on
the left and drag it to the canvas on the right. <br />
Deleting a node type: clicking on a node will open its properties panel on the right, and click on the delete button will delete the selected node. <br />

Nodes can either be built in types, or new types added by the user by clicking the New Stencil
button as described in [Stencils Management] [StencilManagement].

![Blueprint Composer topology]({{< img "ui/composer/stencils-topology.png" >}})

Each of the nodes has an editable name and may
contain [properties], [interfaces] and [relationships]. The Composer interface allows selecting one
node at a time, to see the node properties simply click the node and a panel will appear on the
right side of the screen.

![Blueprint Composer topology]({{< img "ui/composer/sidepane.png" >}})

### Inputs & Outputs tab
The inputs & outputs page contains an option to add inputs and outputs to a blueprint.yaml. 
The ‘Name’ field is mandatory and must be unique, description and value are optional.  <br />

To add another field, click the ‘+’ button on the right. 
To delete an entered field, press the trash can icon.

![Blueprint Composer inputs]({{< img "ui/composer/inputs-outputs.png" >}})

### Definitions tab
In the definitions section you can define new inline types, plugins, and relationships to be used in your blueprints.

#### Inline Types
Inline types derive from existing types, and can define additional properties and interfaces to those available with the parent type. For each interface operations can be defined and their implementation can be selected from the available plugins.

#### Plugins
Plugins can be added in the relevant tab using either a url or the implementation file.

#### Relationships
Relationships, like types, derive from existing relationships and can add properties and interfaces. Interfaces would be defined per source and target.

![Blueprint Composer definitions]({{< img "ui/composer/definitions.png" >}})

### Resources tab
In order to add artifacts to the blueprint (for example when using the script plugin) the Resources page can be used. 
Users can create folders and place artifacts within them by uploading from the local computer.


### YAML Source tab
The source page contains a read only presentation of the generated blueprint file.
The blueprint is generated with some out of the box list of types/plugins appears in its 'import' section.

![Blueprint Composer source]({{< img "ui/composer/source-page.png" >}})





  [StencilManagement]: /composer/blueprint-creation
  [properties]: /composer/blueprint-creation/#properties
  [interfaces]: /composer/blueprint-creation/#interfaces
  [relationships]: /composer/blueprint-creation/#relationships
