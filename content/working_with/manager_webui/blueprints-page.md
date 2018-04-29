---
layout: bt_wiki
title: Local Blueprints Page
category: Web Interface
draft: false
abstract: Blueprint Page Reference
weight: 130
---


By default, the Blueprint widget is displayed in catalog format and provides a list of all the blueprints in this Cloudify Manager instance. You can change the display format from catalog to a classic table view in the widget's configuration options.<br>

The catalog presents the name and icon of each blueprint, its visibility level, creation date, update date, creator, name of main blueprint .yaml file and the number of deployments created from it. <br>
![Blueprints index]( /images/ui/blueprintsPage/blueprints-catalog.png )


### Uploading a Blueprint
1. Click the **Upload** button in the Blueprints List widget to upload a blueprint.
2. In the Upload Blueprint dialog, provide the URL of the remote archive in which the blueprint is located or select a local blueprint archive. 
3. Enter the `Blueprint name` and `Blueprint filename`.   
   `Blueprint name` is the name with which you want to identify this blueprint on the Cloudify Manager instance.<br>
   `Blueprint filename` is the name of the yaml file in the archive that you want to upload as the main blueprint - as there can be multiple files in the archive. If a blueprint filename field is omitted, the default `blueprint.yaml` filename is used, but if a file under that name does not exist in the archive, an error message will appear.    
4. (Optional) Provide a .png file URL or select a local one, to appear as an icon in the catalog or table view next to the blueprint name.   
5. Choose the blueprint's visibility by clicking on the icon in the top right corner:<br>
![Resource visibility]( /images/ui/TenantWide_resource_icon.png ).<br>
The default visibility is "Tenant", and according to the logged-in user's permissions you can also choose other levels of [resource visibilities]({{< relref "working_with/manager/resource-visibility.md" >}}).<br>
6. Click **Save**.

You can also upload blueprints from the Blueprints Catalog page, by clicking on the "Upload" button next to the wanted blueprint.  

### Deploying a Blueprint
1. Click the deploy icon adjacent to the name of the blueprint that you want to deploy.   
   If you have used the drill-down option on a specfic blueprint, click **Create Deployment**.
   ![deploy dialog]( /images/ui/blueprintsPage/deploy.png )<br>
2. In the deployment creation screen, specify a name for your deployment.
3. Specify the required deployment inputs.   
   The names of the default input values appear in the inputs fields. You can leave these defaults or override them with new values. Mouse-hover tooltip that shows the input's description might help you understand how to fill-in the proper value. Another alternative for providing the inputs is by specifying a .yaml file containing the relevant values. 
4. Click **Deploy** to deploy the blueprint.<br>
![Create a deployment]( /images/ui/blueprintsPage/deployment_creation.png )


### Deleting a Blueprint

*  Click the delete icon adjacent to a blueprint entry to delete it, or the "Delete blueprint" button in the blueprint's drill-down page.

## Additional Information about Blueprints

When you click the name of a blueprint in the Blueprints List table, a blueprint-specific page opens. The page displays four widgets with details about the selected blueprint:

* Topology
* Deployments
* Inputs and Outputs
* Source

### Topology

The **Topology** widget displays the application’s graph of nodes and their relationships. 

![Blueprint topology]( /images/ui/blueprintsPage/topology.png )

Each of the application's nodes is displayed as a square container that can contain other nodes. Each node has a name, and an icon to indicate its [node type]({{< relref "developer/blueprints/spec-node-types.md" >}}).

[Relationships]({{< relref "developer/blueprints/spec-relationships.md" >}}) between nodes are indicated with arrows that start at the connected node and end at the target node.

The number of node instances is marked in a bullet beside the node's type icon.<br>

### Deployments

The **Deployment** widget displays a list of the deployment in the current tenant. The dispayed information is: Deployment name, the blueprint which the deployment is derived from, the deployments creation and last update dates, the name of the user who created the deployment, and the number of nodes in each of the following statuses:

![Deployment widget]( /images/ui/blueprintsPage/Deployment-status.png )

* **Green:** The number of nodes that are running
* **Yellow:** The number of nodes that are in progress
* **Orange:** The number of nodes that are in warning state
* **Red:** The number of nodes that are deleted or stopped

Clicking on a deployement's name will bring us to this deployment's drill-down page, which provides additonal data (see  [deployments page]({{< relref "working_with/manager_webui/deployments-page.md" >}}) for more information) and displays buttons that enable you to update or delete the deployment, and to execute a workflow.

### Blueprint Inputs and Outputs
The **Blueprint Inputs** and **Blueprints Outputs** widgets display the values for these elements. If you hover over the outputs value, the code for the output appears. 

![Blueprint source code]( /images/ui/blueprintsPage/blueprint-inputs-outputs.png )

### Blueprint Sources
The **Blueprint sources** widget displays all the sources in the Blueprint package.

![Sources widget]( /images/ui/blueprintsPage/sources-widget.png )
