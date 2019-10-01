---
layout: bt_wiki
title: Local Blueprints Page
category: Cloudify Console
draft: false
abstract: Blueprint Page Reference
weight: 130
aliases: ["/manager_webui/blueprints-page/", "/working_with/console/blueprints-page/"]
---

Local Blueprints page displays Blueprints widget and Cloudify Composer link button.

![Local Blueprints Page]( /images/ui/blueprintsPage/local-blueprints-page.png )

By default, Blueprints widget is displayed in table format and provides a list of all the blueprints in this Cloudify Manager instance. 

Check [Blueprints widget page]({{< relref "working_with/console/widgets/blueprints.md" >}}) for more details.


### Uploading a Blueprint

1. Click the **Upload** button in the Blueprints List widget to upload a blueprint.
2. In the Upload Blueprint dialog, provide the URL of the remote archive in which the blueprint is located or select a local blueprint archive. 
3. Enter the `Blueprint name` and `Blueprint YAML file`.   
   `Blueprint name` is the name with which you want to identify this blueprint on the Cloudify Manager instance.<br>
   `Blueprint YAML file` is the name of the YAML file in the archive that you want to upload as the main blueprint - as there can be multiple files in the archive. If a blueprint filename field is omitted, the default `blueprint.yaml` filename is used, but if a file under that name does not exist in the archive, an error message will appear.    
4. (Optional) Provide a .png file URL or select a local one, to appear as an icon in the catalog or table view next to the blueprint name.   
5. Choose the blueprint's visibility by clicking on the icon in the top right corner:<br>
![Resource visibility]( /images/ui/icons/tenant-wide-resource-icon.png ).<br>
The default visibility is "Tenant", and according to the logged-in user's permissions you can also choose other levels of [resource visibilities]({{< relref "working_with/manager/resource-visibility.md" >}}).<br>
6. Click **Upload**.

You can also upload blueprints from the Blueprints Catalog page, by clicking on the **Upload** button next to the wanted blueprint.  


### Deploying a Blueprint

1. Click the deploy icon ![Deploy icon]( /images/ui/icons/deploy-icon.png ).   
2. In the Deploy Blueprint dialog, specify a name for your deployment.
3. Specify the required deployment inputs.   
   The names of the default input values appear in the inputs fields. You can leave these defaults or override them with new values. 
   Input's description (on hovering help icon ![Help icon]( /images/ui/icons/help-icon.png )) might help you understand how to fill-in the proper value. 
   Another alternative for providing the inputs is by specifying a .yaml file containing the relevant values. 
4. Click **Deploy** to deploy the blueprint.<br>

![Create a deployment]( /images/ui/blueprintsPage/deployment_creation.png )


### Deleting a Blueprint

Click the delete icon ![Delete icon]( /images/ui/icons/delete-icon.png ) or the **Delete blueprint** button in the blueprint's drill-down page.


## Additional Information about Blueprints

When you click the name of a blueprint in the Blueprints List table, a blueprint-specific page opens 
(it's also called blueprint's drill-down page).
 
The page displays Create deployment and Delete blueprint buttons and the following widgets with details about the selected blueprint:

* Blueprint Topology
* Blueprint Deployments
* Blueprint Inputs 
* Blueprint Outputs/Capabilities
* Blueprint Sources


### Topology

The **Topology** widget displays the application’s graph of nodes and their relationships. 

![Blueprint topology]( /images/ui/blueprintsPage/topology.png )

Each of the application's nodes is displayed as a square container that can contain other nodes. 
Each node has a name, and an icon to indicate its [node type]({{< relref "developer/blueprints/spec-node-types.md" >}}).

[Relationships]({{< relref "developer/blueprints/spec-relationships.md" >}}) between nodes are indicated with arrows that start at the connected node and end at the target node.

The number of node instances is marked in a bullet beside the node's type icon.


### Deployments

The Deployments widget displays a list of the deployment in the current tenant. The dispayed information is: Deployment name, 
the blueprint which the deployment is derived from, the deployments creation and last update dates, 
the name of the user who created the deployment, and the number of nodes per state 
(see [Deployments page]({{< relref "working_with/console/deployments-page.md" >}}) to learn more about nodes states).

Clicking on a deployement's name will bring us to this deployment's drill-down page, 
which provides additional data (see [deployments page]({{< relref "working_with/console/deployments-page.md" >}})
for more information) and displays buttons that enable you to update or delete the deployment, and to execute a workflow.


### Blueprint Inputs and Blueprint Outputs/Capabilities

The **Blueprint Inputs** and **Blueprints Outputs/Capabilities** widgets display the values for these elements. 
If you hover over the outputs value, the code for the output appears. 

![Blueprint Inputs and Blueprint Outputs/Capabilities]( /images/ui/blueprintsPage/blueprint-inputs-outputs.png )


### Blueprint Sources

The **Blueprint sources** widget displays all the sources in the Blueprint package.

![Blueprint Sources]( /images/ui/blueprintsPage/sources-widget.png )
