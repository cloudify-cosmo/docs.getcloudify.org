---
title: Cloudify Console Guide
category: Operations Guides
draft: false
weight: 100
---
# Cloudify Console for Service Orchestration

The Cloudify Console provides a graphical user interface for orchestration that lets the operator:

* Upload blueprints into the Cloudify Managers
* Deploy and install/uninstall new services
* Monitor the status and performance of services
* View service logs and events

All of the things that can be done in the Cloudify Console can also be done using the cli and the REST based interface. More information can be found in [ http://docs.getcloudify.org/](http://docs.getcloudify.org/4.0.0)

## Logging into the Console

To login to the Cloudify Console you will need to use a browser on your laptop or PC and enter in the URL of the Cloudify manager IP address or hostname (i.e. [https://192.168.0.1/#/login](https://192.168.0.1/#/login) ). This will then prompt for a username and password in order to login to the system. \

<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI0.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI0.png "image_tooltip")

 \
Once the username and password have been successfully entered the home screen of the Cloudify Console as per the below image will be presented to the user. \

<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI1.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI1.png "image_tooltip")

## Blueprints

    1.  Uploading blueprint
*   **Upload from blueprints catalog**

To upload a blueprint from blueprints catalog an operator should open "Blueprints catalog", select required blueprint and press "Upload" button

<p id="gdcalert3" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI2.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert4">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI2.png "image_tooltip")

Fill in blueprint name and select filename of the blueprint on next form:

<p id="gdcalert4" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI3.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert5">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI3.png "image_tooltip")

After that click on "Upload" button. After that, the blueprint will be copied from "Blueprints catalog" to local blueprints.

<p id="gdcalert5" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI4.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert6">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI4.png "image_tooltip")

*   **Upload from operator's machine**

In this case, a blueprint archive is located on operator's machine. 

<p id="gdcalert6" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI5.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert7">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI5.png "image_tooltip")

Next steps allow uploading the blueprint from local machine:

    *   Open "Local blueprints" tab
    *   Press "Upload" button on right top corner

<p id="gdcalert7" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI6.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert8">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI6.png "image_tooltip")

    *   Click on the field "Select blueprint package file"

<p id="gdcalert8" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI7.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert9">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI7.png "image_tooltip")

    *   Select an archive with a blueprint on file system

<p id="gdcalert9" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI8.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert10">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI8.png "image_tooltip")

    *   Fill in the upload form and click on "Upload" button

<p id="gdcalert10" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI9.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert11">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI9.png "image_tooltip")

<p id="gdcalert11" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI10.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert12">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI10.png "image_tooltip")

*   **From the Internet resource**

In this case, a blueprint archive is located in the Internet. 

    *   Open "Local blueprints" tab
    *   Press "Upload" button on right top corner

<p id="gdcalert12" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI11.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert13">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI11.png "image_tooltip")

    *   Fill in fields "Select blueprint package file", "Blueprint name" and "Blueprint filename". Click on "Upload" button

<p id="gdcalert13" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI12.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert14">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI12.png "image_tooltip")

<p id="gdcalert14" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI13.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert15">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI13.png "image_tooltip")

<p id="gdcalert15" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI14.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert16">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI14.png "image_tooltip")

    1.  Deleting blueprint

Before deleting a blueprint all deployments based on the blueprint should be uninstalled and deleted.

To delete the blueprint just click on Delete button on the blueprint

<p id="gdcalert16" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI15.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert17">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI15.png "image_tooltip")

## Customer Deployments

    1.  Creating a Deployment

To create a new deployment click on the "Deploy" button in the bottom right corner of blueprint in "Local Blueprints" (see previous section on uploading a blueprint). \

<p id="gdcalert17" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI16.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert18">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI16.png "image_tooltip")

<p id="gdcalert18" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI17.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert19">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI17.png "image_tooltip")

A form with fields of inputs should pop up that need to be filled in before the deployment can be created. The first field is the name of the deployment and this needs to be a unique name given to this one deployment, it is usually something that relates the customer to a blueprint name (i.e. radius-city-west). The following fields will vary in number and name and are automatically generated based on the inputs of the blueprint (see section on blueprints to understand blueprint inputs).

Once the deployment has been created it should appear as one of the deployments in the deployments section (as shown below).

<p id="gdcalert19" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI18.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert20">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI18.png "image_tooltip")

To get detailed information about the deployment click on it. By default, the page contains seven widgets, but you can edit it and add or remove widgets. The widgets are as follows:

*   **Topology**: shows the graphical topology of the deployment

<p id="gdcalert20" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI19.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert21">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI19.png "image_tooltip")

*   **Nodes**: shows the nodes in the deployment

<p id="gdcalert21" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI20.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert22">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI20.png "image_tooltip")

*   **Executions**: shows what workflows have been executed against the deployment

<p id="gdcalert22" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI21.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert23">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI21.png "image_tooltip")

*   **Deployment** I**nputs & Deployment Outputs**: shows the inputs that given to the blueprint in order to create this deployment and any outputs that may have been created as a part of the install workflow

<p id="gdcalert23" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI22.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert24">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI22.png "image_tooltip")

*   **Source**: shows the source of the blueprint

<p id="gdcalert24" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI23.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert25">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI23.png "image_tooltip")

*   **Deployment Events & Logs**: shows events and logs of executions

<p id="gdcalert25" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI24.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert26">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI24.png "image_tooltip")

*   **Monitoring**: shows the performance monitoring metrics if they have been configured for the deployment. See next section on setting up the dashboard for monitoring to work properly with your selected deployment.

    

<p id="gdcalert26" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI25.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert27">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI25.png "image_tooltip")

    1.  Installing a Deployment

To actual install a deployment into the network, we need to run an "install" workflow against the deployment. It can be done by clicking to the "Execute workflow" button on the right hand side of the deployment menu and then click to the "Install". \

<p id="gdcalert27" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI26.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert28">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI26.png "image_tooltip")

<p id="gdcalert28" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI27.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert29">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI27.png "image_tooltip")

 \
The progress of the Install execution is showing in "Deployment Executions", "Deployments Events" and "Deployments Logs" widgets of the deployment page. See next screenshot: \

<p id="gdcalert29" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI28.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert30">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI28.png "image_tooltip")

    1.  Configuring the dashboard

As per the above mention of the monitoring widget for a deployment, you may need to load a customized deployment widget in order to display the performance metrics properly for your deployment. By default the standard widget displays operating system metrics (CPU, Disk, Memory, Network IO) however while this might make sense for a VNF it will not display the performance metrics of the SDN services for example. \
In order to show the correct data you will need to load the custom widget. \

Select edit mode:

<p id="gdcalert30" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI29.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert31">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI29.png "image_tooltip")

Add widgets:

<p id="gdcalert31" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI30.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert32">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI30.png "image_tooltip")

Add one timer widget (It is support widget for metrics widgets):

<p id="gdcalert32" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI31.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert33">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI31.png "image_tooltip")

 \
For every collector add Deployment metric graph:

<p id="gdcalert33" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI32.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert34">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI32.png "image_tooltip")

Select a metric from pre-defined:

<p id="gdcalert34" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI33.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert35">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI33.png "image_tooltip")

 \
Once loaded the correct performance statistics should be display similar to the screen capture below. \
 \
 \

<p id="gdcalert35" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI34.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert36">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI34.png "image_tooltip")

<p id="gdcalert36" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI35.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert37">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI35.png "image_tooltip")

    1.  Uninstalling a Deployment

Similar to installing a deployment, uninstalling a deployment is just running the "uninstall" workflow against the deployment. Deployments should be uninstalled before deleting.

    1.  Other workflows

Other workflows like Scale Up/Down or Heal are shown in the "execute workflow" menu but may not necessarily have anything implemented in the nodes to act on that workflow. By default, all blueprints should implement the install and uninstall workflows, but other workflows will depend on the nodes and their associated plugins supplied for the blueprint.

    1.  Deleting a Deployment

In order to delete a deployment the deployment should first be "uninstalled". Once uninstall the deployment can be deleted by clicking the "Delete deployment" button. \

<p id="gdcalert37" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI36.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert38">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI36.png "image_tooltip")

    1.  Logs & Events

The "Logs & Events" widget gives the operator the ability to search for errors and debug services and it is located on each deployments page \

<p id="gdcalert38" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI37.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert39">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI37.png "image_tooltip")

 \
Further details on a line item can be seen by click on the message (especially error messages where further debugging information is revealed by clicking on the top level message).

Events and Logs Filter widget

Displays a filter pane for events and logs.

<p id="gdcalert39" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI38.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert40">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI38.png "image_tooltip")

## System resources

    1.  Plugins

By default, [plugins ](http://docs.getcloudify.org/4.3.0/plugins/overview/)are tenant-specific, meaning that a blueprint on one tenant cannot access a plugin on a different tenant. You can also set a plugin as global when you upload it to the manager. The Plugins table lists the plugins are available to the current tenant. \

<p id="gdcalert40" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI39.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert41">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI39.png "image_tooltip")

*   Uploading a Plugin
1.  Click **Upload** above the Plugins table.
1.  Either enter the URL of the wagon or select the wagon file from your file repository.
1.  Either enter the URL of the plugin yaml file or select the plugin yaml file from your file repository.
1.  Click **Upload**. \
The plugin details appear in the Plugins table.
    1.  Snapshots

The Snapshots table provides a list of all snapshots that have been uploaded or created. The Snapshots table is only available if you have `admin `credentials.

The snapshots creation process captures data in the entire Cloudify Manager, not just that of a specific tenant. However, the snapshot is created in the context of the current tenant, and therefore must be restored from it. Snapshots are created as a private resource by default and it cannot change.

<p id="gdcalert41" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI40.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert42">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI40.png "image_tooltip")

*   Creating a Snapshot
1.  Click **Create** above the Snapshots table.
1.  Specify a unique ID for the snapshot and click **Create**. \
It is good practice to use a name that will help you to easily identify the snapshot later.

    The creation process begins. If there are active executions when you attempt to create the snapshot, the process waits until the executions are complete before creating the snapshot. You can see the status of executions in the Deployment executions widget.

    The snapshot is saved as a ZIP file and appears in the Snapshots table, together with details of its creator, creation date and time, and current status.

*   Restoring a Snapshot

    If you are restoring a snapshot from a Cloudify Manager instance prior to version 4.0, refer to the [Restoring Snapshots of Legacy Cloudify Manager Instances](http://docs.getcloudify.org/4.3.0/manager_webui/plugins-snapshots-page/#restoring-snapshots-of-legacy-cloudify-manager-instances) section below.

    If you restore a snapshot to a Cloudify Manager instance that already contains data, that data is overwritten. To prevent inadvertent overwriting of existing data, you must explicity state that you want to force data overwrite.

1.  Click **Upload** in the Snapshots widget.
1.  Either enter the URL of the snapshot or select the snapshot file from your file repository.
1.  Enter the Snapshot ID.
1.  Click **Upload**.
1.  To restore a snapshot from a tenant-less (legacy) environment, toggle the relevant button.
    *   If your snapshot is from a Cloudify Manager instance that was created earlier than version 4.0, see [Restoring Snapshots of Legacy Cloudify Manager Instances](http://docs.getcloudify.org/4.3.0/manager_webui/plugins-snapshots-page/#restoring-snapshots-of-legacy-cloudify-manager-instances).
    *   To overwrite all content in the existing Cloudify Manager, toggle the relevant button.
1.  The snapshot is restored and its details appear in the Snapshots table.
*   Deleting a Snapshot
1.  In the Snapshots widget, click 

<p id="gdcalert42" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI41.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert43">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI41.png "image_tooltip")
 for the snapshot entry that you want to delete.
1.  Click **Yes** to delete the snapshot from Cloudify Manager.
    1.  Secret Store Management

Secret storage provides a tenant-wide variable store for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform.

<p id="gdcalert43" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI42.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert44">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI42.png "image_tooltip")

## Tenant Management

There are three widgets in this section: "User management", "Tenants Managements", "User Groups Management".

    1.  User management

Allows creating users and editing their profiles, set password, set roles, and edit user's group and tenants

*   Adding Users to a Tenant
1.  In the User Management widget, click the List icon on the far right of the user entry in the table that you want to add to a tenant.
1.  Click **Add to tenant**.
1.  Select one or more tenants from the dropdown list and click **save**…
1.  The user is added to the specified tenants. \
Unless the user has a deactivated status, they can perform actions on the tenant according to their role and the configuration privileges specified by the admin.
*   Removing a User from a Group or Tenant

        You can remove a user from a group or a tenant, without deleting them from the system. A user can be removed in two ways.

*   In the User Management widget, click the List icon of the user that you want to remove and select **Edit user's groups** and click **Save**.
*   In the Tenant's Management widget, click the List icon of the tenant from which you want to remove a user and select **Edit users**. Select the user to remove and click **Save**.

        The user is removed. If a user is a member of one or more user groups that are still assigned to a tenant, that user remains active on the tenant.

<p id="gdcalert44" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI43.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert45">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI43.png "image_tooltip")

    1.  Tenants Managements

Allows creating, editing and deleting tenants, add users and user groups to tenant \

<p id="gdcalert45" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI44.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert46">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI44.png "image_tooltip")

    1.  User Groups Management

Allows creating, editing and deleting user groups, add users and tenants to group \

*   User Management via an LDAP System

        To integrate with an external user management system, you must first ensure that Cloudify Manager is configured accordingly. This can be achieved during the bootstrapping process, or you can run the following command on a Cloudify Manager instance on which no actions have been performed (a clean machine.)

*   Adding User Group to a Tenant
1.  In the User Groups Management widget, click the List icon on the far right of the user group entry in the table that you want to add to a tenant.
1.  Click **Add group to tenant**.
1.  Select one or more tenants from the dropdown list and click **save**..
1.  The user group is added to the specified tenants. \
All users within the group, unless they have a deactivated status, can perform actions on the tenant according to their role and the configuration privileges specified by the `admin`.

<p id="gdcalert46" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-UI45.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert47">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/Cloudify-UI45.png "image_tooltip")