---
layout: bt_wiki
title: Available Actions
category: Docs
draft: false
weight: 300

---
## Blueprints Action Bar
On the top right you can find additional actions to perform on the current blueprint.

### Save 
Pressing the "Save" button triggers two actions:

-  Saving the displayed blueprint.
-  Running a validation check on the blueprint.yaml.

### Download  
Downloads the last saved blueprint - packages and downloads an archive of the blueprint including all folders with resources & plugins as a tar file.

### Validate 
Validates the displayed blueprint source code to ensure logical concepts are kept.

### Blueprint Settings
The settings button opens up a menu of operations to be performed:

![Blueprint Composer Blueprint Settings]({{< img "ui/composer/blueprint-settings.png" >}})

#### Add a New Blueprint 
Creates a new empty blueprint canvas.

#### Rename a Blueprint
Allows changing the displayed blueprint name.

#### Import a Blueprint 
Opens an existing blueprint in the composer canvas, the blueprint can either be a local file or a url accessible by the composer.

#### Delete a Blueprint 
Removes the blueprint both from the display and the composer saved data and cannot be undone.

### Switching Between Composed Blueprints
To browse a user’s blueprints, click on the arrow next to the blueprint name on the top left and choose one of the available blueprints to work on. Blueprints displayed would be the ones the user created, imported, and saved.

### Logout (From Composer) 
Logout ends the current user session and routes the user back to login page allowing a new user to login.

![Blueprint Composer Browsing Blueprints]({{< img "ui/composer/browsing-blueprints.png" >}})
