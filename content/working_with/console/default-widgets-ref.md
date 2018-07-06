---
layout: bt_wiki
title: Default Widgets Reference
category: Cloudify Console
draft: false
weight: 165
aliases: /manager_webui/default-widgets-ref/

terminology_link: reference-terminology.html
execute_workflow_link: getting-started-execute-workflow.html
---
This section provides a description of all the widgets that are included by default in Cloudify Manager (out-of-the-box). Some of these widgets are presented in the initial page templates, and other can be added from the widgets catalog, accessible when in **Edit Mode**.
If you do not see **Edit Mode** in the dropdown menu, you do not have permissions to edit configuration. 

For information about adding widgets, placing them on a page, and so on, see [Configuring the Cloudify Console Display]({{< relref "working_with/console/configure-display.md" >}}).

**Notes:**<br>

* You might have to configure some of the widgets. In the event that configuration is mandatory, the mandatory requirements are included in the widget descriptions. Many widgets also have non-mandatory configuration that enables you to customize them to your requirements.   

   To open a widget's configuration dialog after you have added it to a page, click the gear icon in the top right of the widget.

* Some widgets are only available for `admin` users. 

The following widgets descriptions are listed in an alphabetical order, as they do in the widgets catalog. 

### Blueprint Sources
Displays all the source files in a blueprint package in tree view, adjacent to the code. When you click an item in the tree, its code is displayed in the code panel. You can also open the file in full mode by clicking on the gray box presenting its name in the top right corner of the widget. 

![blueprint-sources]( /images/ui/widgets/blueprint-sources.png )

#### Widget Settings
* `Content pane initial width in %` - sets the default size of the source part of the window in percent of screen width. Default: 65%. 

### Blueprint Action Buttons
Buttons that allow performing actions on a selected blueprint - creating a deployment from it, or deleting the blueprint. 
The action buttons need to receive the id of the desired blueprint. This can be accomplished in two ways: 

* By placing the buttons in a blueprint’s drill-down page, meaning the blueprint has been selected before entering the page, and its id is included in the page’s context. 
* By adding to the page a widget allowing to select blueprints, such as the resources filter or the blueprints list.  

![blueprint-actions]( /images/ui/widgets/blueprint-action-buttons.png )

#### Widget Settings
None

### Blueprint deployments
Displays the list of the deployments in the current tenant, according to the user’s permissions. The data can be displayed as a table or list. In the case of a list view, the status of each deployment is also displayed. For information about deployment status, [click here]({{< relref "working_with/console/deployments-page.md" >}})

![blueprint-deployments]( /images/ui/widgets/blueprint-deployments.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Enable click to drill down` - This option enables redirecting to the deployment’s drill down page upon clicking on a specific deployments. Default: True
* `Blueprint ID to filter by` - TAllows filtering the deployments in this list to those derived from a specific blueprint, by providing its ID (the blueprint ID is its name). Default: empty
* `Display style` - Can be either list or table. The deployments status column is only available in list mode.  Default: List

### Blueprint info
Displays the following information about a specific blueprint: 

* **Picture**
* **Name**
* **Visibility level**
* **Creation time**
* **Last update time**
* **Creator user-name**
* **Main blueprint file name** (as the blueprint archive can contain multiple files)

![blueprint-info]( /images/ui/widgets/blueprint-info.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Blueprint ID` - The blueprint ID must be passed to the widget. This can be done either by placing the widget in a blueprint’s drill-down page (in which case the blueprint ID is automatically passed in the page’s context), or by specifying the blueprint ID in this configuration field. The blueprint ID is its name.

### Blueprint upload button
This Button allows uploading a blueprint to the manager. Clicking on it opens a dialog for providing the following details:

* **Blueprint visibility** - represented by a colourful icon, and can be set by clicking on it. See [resource’s visibility]({{< relref "working_with/manager/resource-visibility.md">}}). Default: tenant
* **Blueprint archive path** (local or URL) 
* **Name** to identify the blueprint on the manager (“Blueprint name”).
* **Main .yaml file in the blueprint archive** (“Blueprint filename”). Default: blueprint.yaml
* **Blueprint icon image file** to be presented in the blueprints list widget, when in Catalog mode (optional). 


#### Widget Settings
None

### Blueprints

Displays all the blueprints on the tenant, according to the user’s permissions and the blueprints visibility levels. The following information is displayed: 

* **Icon image file**
* **Name**
* **Visibility level**
* **Creation time**
* **Last update time**
* **Creator user-name**
* **Main blueprint file name** (as the blueprint archive can contain multiple files)
* **Number of deployments derived from the blueprint**

![blueprints-list]( /images/ui/widgets/blueprints-list.png)

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Enable click to drill down` - This option enables redirecting to the blueprint’s drill-down page upon clicking on a specific blueprint. Default: True
* `Display style` - Can be either Catalog or table. The deployments status column is only available in list mode.  Default: table 

### Blueprints Catalog

Displays blueprints from a repository under a configurable Github account.
By default, the widget presents the blueprints under cloudify-examples repository, which fit the specific manager’s version. It is configured to read the blueprints URLs from a json file. You can also point the widget to read from a different user account from its settings. The widget includes an upload option for each of the blueprints, which lets you easily upload it to the current tenant on the manager. After uploading a blueprint from the catalog, you will be able to see it under the “local blueprints” widget. 
You can filter the presented blueprints by creating a filter query in the widget’s settings.  
You can and should enter Github credentials for fetching data, as the defaults used by the widgets can reach the restricted query limit of GitHub (~50) . These parameters are pulled from secrets) as the github-username and github-password keys. These parameters are a must if you want to configure the widget to access private repositories.

![blueprints-catalog]( /images/ui/widgets/blueprints-catalog.png )

#### Widget Settings
* `Blueprint Examples URL` - Specifies the json file from which the Cloudify examples URLs are being read
* `GitHub User` - GitHub user or organization account name which is the owner of the repository to fetch. Default: cloudify-examples
* `GitHub Filter` - Optional filter for GitHub repositories. See GitHub’s web page ‘Searching repositories’ for more details. 
* `Display style` - defines whether the widget’s view is Catalog or Table. Default: Catalog

### Button link
Opens the specified URL in a separate tab. You can define the label that appears on the button

![button-link]( /images/ui/widgets/button-link.png )

#### Widget Settings 
* `Button label` - The text to appear on the button
* `URL address` - The URL to be opened upon clicking on the button. 


### Composer link
Opens the Cloudify Composer, which allows creating blueprints with a graphical drag-and-drop tool. The Composer comes as part of the Cloudify Premium edition, and is only available for users with certain roles. 

For more information regarding the Composer, see [Cloudify Composer]({{< relref "developer/composer/_index.md" >}}).

![Composer-link]( /images/ui/widgets/composer-link.png )

#### Widget Settings
None

### Create deployment button
Allows creating a deployment of a chosen blueprint. After choosing a name for the deployment, the desired blueprint and the visibility of the deployment (private/tenant), a screen will open, allowing to specify values for the inputs required by the chosen blueprint. 

![create_deployment_button]( /images/ui/widgets/create_deployment_button.png )


#### Widget Settings
None


### Deployment Inputs

Presents the names and values of the inputs of a specific deployment. The deployment can be selected in one of the following ways: 

* By placing the deployment inputs widget in the deployments drill-down page, meaning the deployment has been selected before entering the page, and its id is included in the page’s context. 
* By adding to the page a widget allowing to select deployments, such as the resources filter or the blueprint deployments.  

If only a blueprint was selected, the widget will present the default values for the inputs, defined in the blueprint itself. 

![deployment-inputs]( /images/ui/widgets/deployment-inputs.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds

### Deployment Outputs

Presents the names and values of the outputs of a specific deployment. The deployment can be selected in one of the following ways: 

* By placing the deployment outputs widget in the deployments drill-down page, meaning the deployment has been selected before entering the page, and its id is included in the page’s context. 
* By adding to the page a widget allowing to select deployments, such as the resources filter or the blueprint deployments.   

If only a blueprint was selected, the widget will present the default values for the outputs, defined in the blueprint itself. 

![deployment-outputs]( /images/ui/widgets/deployment-outputs.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds

### Deployment action buttons
Buttons which allow running workflows of a specific deployment, updating it or deleting it. The deployment can be selected in one of the following ways: 

* By placing the deployment action buttons in the deployments drill-down page, meaning the deployment has been selected before entering the page, and its id is included in the page’s context. 
* By adding to the page a widget allowing to select deployments, such as the resources filter or the blueprint deployments
 
![deployment-action-buttons.png]( /images/ui/widgets/deployment-action-buttons.png )

#### Widget Settings
None

### Deployment Metric Graph
Displays a chart or charts (up to 5) presenting metric of data collected by using a monitoring plugin in a specific deployment. If when installing Cloudify Manager, influxDB was also installed on the manager, the widgets will read the data from it. Otherwise, an external endpoint for influxDB can be set in the UI’s configurations. You can select the metrics to be displayed in the widget, and define their properties in the widget’s configuration dialog, as long as this data is indeed being collected for the deployments. 

In Cloudify examples, the monitoring is implemented using the Diamond plugin, and the data is being collected to InfluxDB which is installed on the Manager.

You must supply at least one metric or database query in the widget configuration, and choose the specific node instance you want to present the data of. 

You must also provide the Blueprint, Deployment, Node and Node instance IDs, either in the page context or in the widget configuration.

#### Widget Settings
* `Refresh Time Interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default : 5 seconds
* `Node filter` - Use this filter to choose the node instances you want to present the data of. Make sure this are node for which data is indeed collected. You can set Deployment ID and Node instance ID in page context with the [Resource Filter](#resource-filter)
    ![Node filter configuration]( /images/ui/widgets/resource_filter.png)
* `Charts Table` - Table containing definition of up to 5 charts. 
    ![Charts Table configuration]( /images/ui/widgets/deployment-metric-graph-configuration-charts-table.png )
    
    You can define the following parameters:
    * `Metric` - The specific Diamond metric you want the widget to display. This parameter is mandatory. For more information about these metrics, see the [Diamond documentation](http://diamond.readthedocs.io/en/latest/). The available options are dynamically fetched from InfluxDB filtered by `Node filter` parameter.    
    * `Label` - The label to be displayed for the specific chart (the label will be displayed at the bottom of the chart). Parameter is optional. When not specified, then metric name will be taken as chart label.
     
* `Time range and resolution` - Enables you to specify the timeframe of the metrics to be displayed. For details of the configuration see [Time filter widget](#time-filter).
    
* `Custom Influx Query` - By default, the query is based on deployment ID, metric name, time filter and resolution. It is possible to define your own query, which will then be used to fetch data. 

    ![Charts Table configuration]( /images/ui/widgets/deployment-metric-graph-configuration-custom-influx-query.png )
    
    Query (`select <SELECT column> from <FROM column> where <WHERE column>`) consists of the following parameters:
    * `SELECT` - Defines part of query added just after SELECT keyword. Example: `mean(value)`
    * `FROM` - Defines table from which to fetch data, you can use `${deploymentId}`, `${nodeId}` and `${nodeInstanceId}` tokens to inject dynamic values of appropriate identifiers. Example: `/${deploymentId}..*${nodeInstanceId}.((memory_MemFree))$/`
    * `WHERE` - Defines constraints for the query. You can use `${timeFilter}` token to inject dynamic data/time ranges. Example: `time > now()-1h and time <now() group by time(1m) order asc` or just `${timeFilter}`.
* `Charts Type` - Select one of the following types: line, bar and are chart display.

#### Examples

* multi-metric with line charts

![multi-metric example with line charts]( /images/ui/widgets/deployment-metric-graph.png )

* multi-metric with bar charts

![multi-metric example with bar charts]( /images/ui/widgets/deployment-metric-graph-1.png )

* single-metric with area chart

![single-metric example with area chart]( /images/ui/widgets/deployment-metric-graph-2.png )

### Events and Logs
Displays the logs and events of all the executions in the current tenant, according to the user’s permissions. You can configure the fields that are displayed and can choose to indicate in colors success and failure messages.

![events-logs]( /images/ui/widgets/events-logs-2.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 2 seconds
* `List of fields to show in the table` You can choose which fields to present. By default, these are the fields presented: 

   * Icon
   * Timestamp
   * Blueprint
   * Deployment
   * Workflow
   * Operation
   * Node Name
   * Node Id
   * Message
   
You can also choose to add the field “Type”, which will present the log level in case of a log, and event type in case of an event. 
* `Color message based on type` - when marked as “on”, successful events will be coloured in blue, and failures in red. Default: On
* `Maximum message length before truncation`- Allow to define the length of the messages presented in the table. Default: 200. Please note that even if the message is being truncated in the table itself, you can see the full message upon overing. 

### Event and Logs Filter
Displays a filter pane for events and logs. The following filtering options are available:

* **Type:** Logs/Events
* **Blueprint** (multiple selection available)
* **Deployment** (multiple selection available)
* **Event Type** In case of “Type” was selected as event (Workflow started, Task sent, Task started, Task ended successfully,Workflow ended successfully, Workflow staged, Workflow node event, Task failed, Workflow failed, Task rescheduled)
* **Log Levels** In case “Type” was selected as log (Debug, Info, Warning. Error, Critical)
* **Message text**
* **Time Filter**

![events-logs-filter]( /images/ui/widgets/events-logs-filter.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds

### Executions

Displays data about the executions in the current tenant, according to the user’s permissions. By default, the presented details include the blueprint and deployment of the execution, the time that it was created, its status and more. 

![executions]( /images/ui/widgets/executions.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 5 seconds
* `List of fields to show in the table` You can choose which fields to present. By default, these are the fields presented:
  * Blueprint
  * Deployment
  * Workflow
  * Created 
  * Creator
  * System
  * Params
  * Status
      
You can also choose to add the following columns from the list:
* `ID` , which will present the execution id. By default this value is not presented as a column in the table, but as a pop up shown by hovering over ID label. 
* `Ended` , which will present the execution id. By default this value is not presented as a column in the table, but as a pop up shown  by clicking on a specific execution. 
![executions](/images/ui/widgets/executions_copy_id.png)
* `Show system executions`- allow to include or exclude executions of system workflows in the list. Default: On
      
### High Availability

Displays the Manager’s High-Availability status. If a cluster architecture is configured on the manager, this widget will show the cluster-connected nodes. There is no click-through actions available from this widget, as all Cluster management actions should be performed from the Cloudify CLI / REST API. 

![list-nodes-in-cluster-2]( /images/ui/widgets/list-nodes-in-cluster-2.png )      
    
#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds

### Nodes List
Displays a list of the existing nodes in the current tenant, according to the user’s permissions. The node’s blueprint and deployment, type, connected nodes, number of instances, and nodes groups of which the node is part are displayed.

The nodes are listed by name. When you select a node, either by clicking its name in the table or by clicking it in the Topology pane, additional data about the node’s instances is displayed: The instances names, statuses, relationships and runtime properties. 

![nodes-list]( /images/ui/widgets/nodes-list-2.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `List of fields to show in the table` - You can choose which fields to present. By default, all of these fields are presented:
   * Icon
   * Name
   * Type
   * Blueprint
   * Deployment
   * Contained in
   * Connected to 
   * Host
   * Creator - name of the user who created the deployment 
   * \# instances - number of existing instances of this node
   * Groups - nodes groups which the node is part of

### Nodes Statistics
Displays the number of node instances, according to their status. 

![node-statistics]( /images/ui/widgets/node-statistics.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds

### Number of blueprints
Displays the total number of blueprints in the tenant, according to the user’s permissions and the blueprints’ visibility levels. 
The widget is clickable, and upon clicking will redirect by default to the “Local Blueprint” page. You can set the widget’s configuration to lead to a different page. 

![number_of_blueprints]( /images/ui/widgets/num_of_blueprints.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds.
* `Page to open on click` - The name of the page to be redirected to upon clicking on the widget. Default: 'Local Blueprints'

### Number of deployments
Displays the total number of deployments in the tenant, according to the user’s permissions and the blueprints’ visibility levels. 
The widget is clickable, and upon clicking will redirect by default to the “Deployments” page. You can set the widget’s configuration to lead to a different page. 

![number_of_deployments]( /images/ui/widgets/num_of_deployments.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds.
* `Page to open on click` -  The name of the page to be redirected to upon clicking on the widget. Default: 'Deployments'

### Number of plugins
Displays the total number of plugins in the tenant, according to the user’s permissions and the blueprints’ visibility levels. 
The widget is clickable, and upon clicking will redirect by default to the "System Resources" page. You can set the widget’s configuration to lead to a different page. 

![number_of_plugins]( /images/ui/widgets/num_of_plugins.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
* `Page to open on click` - The name of the page to be redirected to upon clicking on the widget. Default: 'System Resources'
 
### Number of running executions
Displays the total number of executions which are currently running, i.e, in one of the following statuses: 'pending', 'started', 'cancelling', 'force_cancelling', according to the user’s permissions.

![number_of_running_executions]( /images/ui/widgets/num_of_running_executions.png )

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds.

### Number of nodes
Displays the total number of nodes created on the tenant, according to the user’s permissions.

![number_of_nodes]( /images/ui/widgets/num_of_nodes.png )

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.

### Plugin upload button
Opens the plugin upload screen, from which permitted users can specify the plugin’s wagon and yaml file (URL or local files) and visibility level of the plugins they wish to upload to the current tenant. 

![plugin upload button]( /images/ui/widgets/plugin_upload_button.png )

#### Widget Settings
None

### Plugins Catalog
A widget listing all the latest releases of the officially supported Cloudify plugins, and allows uploading them to the current tenant. 

![plugins_catalog]( /images/ui/widgets/plugins-catalog.png )

#### Widget Settings
* `Plugins Catalog JSON Source`  - The json file from which the widget reads the plugins list. 

### Plugins List
Displays a list of all the plugins uploaded to the current tenant, according to the user’s permissions, and enables their management. From this widget you can upload, delete, and download the plugins. 

The widget displays the following information:

* **Plugin Package name**
* **Plugin Package version**
* **Supported platform**
* **Distribution the plugin is supported on**
* **Distribute release**
* **Uploaded at**
* **Creator** 
   
Upon hovering over ID label a pop up with the plugin’s ID will open, allowing you to copy it to the clipboard. 

![plugins-list]( /images/ui/widgets/plugins-list.png )

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.

### Resource Filter

This widget provides the ability to filter the data presented in other widgets on the page according to a specific resource. 
By default, the widget allows filtering by blueprint, deployment and execution, and you can also add fields to filter by node or node instance, by configuring the widget’s settings. 

![resource-filter]( /images/ui/widgets/resource_filter.png )


#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds.
* `Show execution filter` - Defines whether to expose filtering by execution. Default: On
* `Show node filter` - Defines whether to expose filtering by Node. Default: Off
* `Show node instance filter` - Defines whether to expose filtering by Node Instances. Default: Off

### Secrets Store Management
Displays all the secrets visible to the logged-in user in the current tenant (including global secrets). The widget provides the following information:

* **Secret key**
* **Secret visibility level** represented by the icon next to the key. Permitted users (the secret’s creator, sys admins or tenant managers of the current tenant) can set the secret’s visibility by clicking on this icon. 
* **Secret Value** If the secret’s value is not hidden from the logged-in user, clicking on the “eye” icon will present its value, like in the following example, in which the logged-in user is a sys admin:


![hidden-value-admin]( /images/ui/widgets/hidden_secret_admin.png )

If the secret’s value is hidden and the logged-in user isn’t the secret’s creator or has admin/manager permissions in the tenant, then the same clicking will result in a red “restricted” sign, as seen here:

![hidden-value-user]( /images/ui/widgets/hidden_secret_unauth_user.png )


* **Hidden Value** Indicates if the secret’s value is hidden of not. If the logged-in user is the secret’s creator, or has admin/manager permissions in the tenant, checking/unchecking  this field will be enabled, and will make the secret hidden/non-hidden. 
* **Creation time**
* **Last update time**
* **Creator**
* **Tenant** The name of the tenant the secret belongs to (if the secret is global, it might belong to a tenant different than the current one). 
 
The right column of the table allows permitted users (secret creator, sys admin or tenant managers) to edit the secret’s value or delete it.
Even if the secret’s value is hidden from users, they might still be able to use the secret by providing its key in the blueprint. To better understand how secrets work in Cloudify, go to [Using the secret store]({{< relref "developer/blueprints/spec-secretstore.md" >}})

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.

### Snapshots List

Displays a list of snapshots of the Manager - both snapshots that were created on this manager, and snapshots uploaded to it. This widget is only available to users with the role ‘admin’

{{% note %}}
Snapshots are always created with “private” visibility, which cannot be set to a different visibility level.
{{% /note %}}

The widget exposes the following information on each snapshot:

* **Id** (the name given to the snapshot upon creation)
* **Visibility Icon** (always “private” for snapshots)
* **Creation time**
* **Status** (One of: created/creating/failed/uploading/uploaded)
* **Creator**

In the right column of every snapshot, the widget exposes the following functionalities:

* **Restore snapshot**
* **Download snapshot** 
* **Delete snapshot**
 
The widget also exposes the following operations by the buttons on the top right corner:

* **Create** - Create a new snapshot on the current tenant 
* **Upload** - Upload a snapshot to the current tenant

![snapshots-list]( /images/ui/widgets/snapshots-list.png )

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.

### Tenant Management
Displays a list of tenants on the Manager and enables tenant management. This widget is only available to admin users.
The widget displays the following information regarding each of the tenants:

* **Name**
* **Number of user-groups assigned to the tenant**
* **Number of users directly assigned to the tenant** (not as part of groups)
 
The hamburger menu on the right of every tenant allows performing the following operations:

* Adding/removing users to/from the tenant
* Adding/removing user-groups to/from the tenant 
* Deleting the tenant - possible only if the tenant has no users. User-groups or resources associated with it. 

Also, using the “Add” button on the right top corner of the widget, you will be able to create new tenants. 


![tenants-list]( /images/ui/widgets/tenants-list.png )

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.

### Text
Displays text provided in the configuration of the widget in markdown syntax. 

![text-widget]( /images/ui/widgets/text_widget_content.png )

#### Widget Settings 
* `Header` - the header to be presented as the textbox’s title
* `Content` - the text to be presented in the textbox itself, in Markdown syntax. 
* `Header text color` - Can be picked out of the suggested colors
* `Header text size (px)` - Size of the header
* `Header text font` - Font of the header
* `Content text color` - Can be picked out of the suggested colors
* `Content text size (px)` - Size of the header
* `Content text font` - Font of the header

![text-widget-configuration]( /images/ui/widgets/text_widget_configuration.png )

### Time Filter
Displays a time filter for deployment metric graphs. It allows to define:

* **Time range** - Enables you to choose start (`From`) and end (`To`) dates
     * by defining custom range
         * using text input - Influx-compatible date/time is allowed. It is possible to define both absolute and relative date/time. For details, see the [Influx documentation - Date time strings](https://docs.influxdata.com/influxdb/v0.8/api/query_language/#date-time-strings). Examples: `now() - 15m`  or `2017-09-21 10:10`
         * using calendar picker - You can choose date and time from the calendar/time pickers
     * by choosing predefined range - There are few predefined time ranges available. You can apply them with one click using the buttons on the left side of the filter

* **Time resolution** - Enables you to group the metrics according to time, to reduce the volume of displayed data. For example, although data might be collected every 10 msecs, you might specify that you only see points on the graph for every minute. Allowed time resolution units: `microseconds`, `milliseconds`, `seconds`, `minutes`, `hours`, `days` and `weeks`. Value ranges from 1 to 1000. 

The filter provides also the following features:

* **Time resolution optimization** - Automatic time resolution is set when you specify predefined range. It optimizes number of points to fetch from database to maximum 200 per chart. You can also optimize time resolution for custom ranges by clicking `Optimize` button. 

* **Time range and resolution reset** - When you click `Reset` button, both time range and time resolution are reset to default values.

* **Data validation** - When you click `Apply` button time range is validated. If invalid data is provided, then appropriate input field is marked with red color and time filter window will not be closed.  

![Time Filter]( /images/ui/widgets/time-filter.png )

#### Widget Settings 
None

### Topology
Displays the topology of a selected blueprint or deployment.
The blueprint or deployment ID must be selected in one of the following ways: 

* By placing the widget in the blueprints/deployments drill-down page, meaning the blueprint/deployment has been selected before entering the page, and its id is included in the page’s context. 
* By adding to the page a widget allowing to select blueprints or deployments, such as the resources filter, the blueprints list or the blueprint deployments.  

![show-topology]( /images/ui/widgets/show-topology.png )

When executing a `Workflow` for a `Deployment` (e.g. the `install` workflow), the topology nodes show badges that reflect the workflow execution state.<br/>
See more details on executing workflows [here]({{< relref "working_with/manager/execute-workflow.md" >}}).<br/>

#### Badges

* Install state - The workflow execution is in progress for this node
* Done state - The workflow execution was completed successfully for this node
* Alerts state - The workflow execution was partially completed for this node
* Failed state - The workflow execution failed for this node

![Deployment Topology Node Badges]( /images/ui/ui-deployment-topology-badges.png )

#### Workflow states represented by badges

* A deployment before any workflow was executed

    ![Deployment Topology]( /images/ui/ui-deployment-topology-1.png )

* A deployment with a workflow execution in progress

    ![Deployment Topology Execution In Progress]( /images/ui/ui-deployment-topology-2.png )

* A deployment with a workflow execution in progress, partially completed

    ![Deployment Topology Execution Partially Completed]( /images/ui/ui-deployment-topology-3.png )

* A deployment with a workflow execution completed successfully

    ![Deployment Topology Execution Completed Successfully]( /images/ui/ui-deployment-topology-4.png )

* A deployment with a workflow execution partially completed successfully with some alerts

    ![Deployment Topology Execution Completed Partially Alerts]( /images/ui/ui-deployment-topology-5.png )

* A deployment with a workflow execution that partially failed

    ![Deployment Topology Execution Completed Partially Errors]( /images/ui/ui-deployment-topology-6.png )

* A deployment with a workflow execution that failed

    ![Deployment Topology Execution Completed Errors]( /images/ui/ui-deployment-topology-7.png )

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds.

The following settings allow changing the presentation of the widget in different aspects, and are by default marked as “on”: 

* `Enable group click` 
* `Enable zoom` 
* `Enable drag` 
* `Show toolbar` 

### User Group Management
Displays the list of user groups and enables their management. This widget is only available to admin users.
 
The widget displays the following information regarding each of the user groups:

* **Name**
* **LDAP group** When working with an ldap-based external authentication system, this fields identifies the LDAP user group which is connected to the current Cloudify user-group. 
* **Admin** If checked, all users who are members of this groups will have the role of sys-admins on the manager. 
* **# Users** number of users who are members of the group
* **# Tenants** number of tenants the user-group is assigned with.
 
The hamburger menu on the right of every tenant allows performing the following operations:

* **Adding/removing users to/from the group** available only if managing the users in Cloudify itself
* **Adding/removing user groups to/from the tenant**
* **Deleting the user groups** - possible only if there are no users who are members in the groups, and the group is not assigned with any tenants. 
Also, using the “Add” button on the right top corner of the widget, you will be able to create new user groups. 

![manage-usergroups]( /images/ui/widgets/manage-usergroups.png )

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.

### User Management
Displays the list of users and enables their management. This widget is only available to admin users.
 
The widget displays the following information regarding each of the user groups:

* **Username**
* **Last login timestamp**
* **Admin** - whether or not the user is sys admin on the Cloudify manager (you can check and uncheck this filed to make changes)
* **Active** - whether or not the user is active (you can check and uncheck this field to make changes) 
* **# Groups** - number of groups the user is a member of
* **# Tenants** - number of tenants the user is assigned with
 
The hamburger menu on the right of every tenant allows performing the following operations:

* **Setting the user’s password**
* **Adding/removing the user to/from user groups**
* **Assigning/Unassigning the user with/from the tenant** 
* **Deleting the user** - possible only if the user does not belong to any groups, assigned to any tenants and is the creator of any resources on the manager. 
 
Also, using the “Add” button on the right top corner of the widget, you will be able to create new users.
Please notice that if you choose to  authenticate the users in front of an external user management system, you will not be able to create or delete the users in cloudify, nor to assigned them to Cloudify user groups,  to prevent conflicts between the two systems which might cause security problems. 

![manage-users]( /images/ui/widgets/manage-users.png )

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.

{{< readFile file="content/working_with/console/widgets/only-my-resources.md" markdown="true" >}}