---

title: Composer Overview


weight: 200

---


## Introduction

The composer is a graphical editor for creating blueprint YAML files dynamically using a modern drag and drop interface. <br />
The composer enables topology modeling for complex applications while providing means to add relevant lifecycle operations implementation via external plugins and scripts.  <br />

Among its draggable components you'll find platform & network items (such as 'compute' node, 'database', 'web server' etc..) and you'll be able to add your own custom node types components as well as custom plugins and new interfaces. <br />

The generated result will be a downloadable tgz file containing:  <br />

- **blueprint.yaml** file which provides a TOSCA based description for the application topology and its lifecycle management. <br />
- **Custom types and plugins** (if added by the user) and other resources the blueprint.yaml depends on.


## Product Overview


 - **Login** - Upon first use of the composer, you are required to supply a username (password is not required).<br />
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


 -  **Definitions tab**
In the definitions section you can define new inline types, plugins, and relationships to be used in your blueprints.

     - **Inline Types**
Inline types derive from existing types, and can define additional properties and interfaces to those available with the parent type. 
For each node you can define interface operations and their implementation. We provide a list of available plugins for you.

     - **Plugins**
Plugins can be added in the relevant tab using either a url (which points to a plugin.yaml or plugin.zip file) or using the plugin implementation file itself (uploading a local plugin.yaml or plugin.zip file).

     - **Relationships**
Relationships, like types, derive from existing relationships and can add properties and interfaces. Interfaces would be defined per source and target.

 - **Resources tab** -  allows you to manage resources accompanying the blueprint.
You can create folders and place files within them by uploading from their local computer.


 - **Source tab** contains a read only presentation of the generated blueprint file.
The blueprint is generated with some out of the box list of types/plugins that are added to its 'import' section.

{{ c.thumbnail("images/ui/composer/stencils-topology.png", "Topology view. shows all nodes and their relationships") }}
{{ c.thumbnail("images/ui/composer/sidepane.png", "The sidepan shows details per node") }}
{{ c.thumbnail("images/ui/composer/inputs-outputs.png", "In this page you can manage inputs and outputs") }}
{{ c.thumbnail("images/ui/composer/definitions.png", "Definition page allows you to modify inline types and relationships") }}
{{ c.thumbnail("images/ui/composer/source-page.png", "In the source page you can see the yaml output") }}


## Actions

 - **Blueprints Action Bar**
On the top right you can find additional actions to perform on the current blueprint.

    - **Save** triggers two actions:
        -  Saving the displayed blueprint.
        -  Running a validation check on the blueprint.yaml.
    - **Download** - Downloads the last saved blueprint - packages and downloads an archive of the blueprint including all folders with resources & plugins as a tar file.
    - **Validate** - Validates the displayed blueprint source code to ensure logical concepts are kept.
    - **Blueprint Settings** - The settings button opens up a menu of additional operations to be performed:
    - **Add a New Blueprint** - Creates a new empty blueprint canvas.
    - **Rename a Blueprint** - Allows changing the displayed blueprint name.
    - **Import a Blueprint** - Opens an existing blueprint in the composer canvas, the blueprint can either be a local file or a url accessible by the composer.
    - **Delete a Blueprint** - Removes the blueprint both from the display and the composer saved data and cannot be undone.
    - **Switching Between Composed Blueprints** - To browse your blueprints, click on the arrow next to the blueprint name on the top left and choose one of the available blueprints to work on. Blueprints displayed would be the ones the user created, imported, and saved.
    - **Logout** - Logout ends the current user session and routes the user back to login page allowing a new user to login.

{{ c.thumbnail("images/ui/composer/blueprint-settings.png", "Open the menu to see more actions") }}
{{ c.thumbnail("images/ui/composer/browsing-blueprints.png", "This is how you browse between blueprints") }}
