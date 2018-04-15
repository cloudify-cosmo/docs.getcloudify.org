---
layout: bt_wiki
title: Default Widgets Reference
category: Cloudify Console
draft: false
weight: 160
---

This section provides a description of all the widgets that are included by default in Cloudify Manager (out-of-the-box). You can select these widgets from the widgets catalog. 

To view the widgets catalog, from the dropdown menu next to your user name, select **Edit Mode**, then click the **Add Widget** button to display the list of widgets. If you do not see Edit mode in the dropdown menu, you do not have permissions to edit configuration. 


For information about adding widgets, placing them on a page, and so on, see [Configuring the Cloudify Console Display]({{< relref "working_with/console/configure-display.md" >}}).

**Notes:**<br>

* You might have to configure some of the widgets. In the event that configuration is mandatory, the mandatory requirements are included in the widget descriptions. Many widgets also have non-mandatory configuration that enables you to customize them to your requirements.   

   To open a widget's configuration dialog after you have added it to a page, click the gear icon in the top right of the widget.

* Some widgets are only available for `admin` users. 


The widgets are listed according to their category.

* [Blueprint Widgets]({{< relref "working_with/console/default-widgets-ref.md#blueprint-widgets" >}})
* [Deployment Widgets]({{< relref "working_with/console/default-widgets-ref.md#deployment-widgets" >}})
* [Events and Logs Widgets]({{< relref "working_with/console/default-widgets-ref.md#events-and-logs-widgets" >}})
* [Execution Widgets]({{< relref "working_with/console/default-widgets-ref.md#execution-widgets" >}})
* [Filter Widgets]({{< relref "working_with/console/default-widgets-ref.md#filter-widgets" >}})
* [Cluster Widgets]({{< relref "working_with/console/default-widgets-ref.md#cluster-widgets" >}})
* [Node Widgets]({{< relref "working_with/console/default-widgets-ref.md#node-widgets" >}})
* [Miscellaneous Widgets]({{< relref "working_with/console/default-widgets-ref.md#miscellaneous-widgets" >}})
* [Button Widgets]({{< relref "working_with/console/default-widgets-ref.md#button-widgets" >}})

## Blueprint Widgets

### Blueprint Sources
Displays all the sources in a blueprint package in tree view, adjacent to the code. When you click an item in the tree, its code is displayed in the code panel.

![blueprint-sources]( /images/ui/widgets/blueprint-sources.png )

### Blueprint deployments
Displays the list of a deployments in the current tenant, according to the logged-in user's permissions. The data can be displayed as a table or list. In the case of a list view, the status of each deployment is also displayed. For information about deployment status, [click here]({{< relref "working_with/console/deployments-page.md" >}})

![blueprint-deployments]( /images/ui/widgets/blueprint-deployments.png )

### Blueprint info
Displays information about a specific blueprint.

#### Configuration
The blueprint ID must be passed to the widget. This can be done either in the page's context, by placing the widget in a blueprint drill-down page, or by specifying the blueprint ID in the widget's configuration.

![blueprint-info]( /images/ui/widgets/blueprint-info.png )

### Blueprints

Displays all the local blueprints on the Cloudify Manager in the context of the current tenant as a table or tile view, according to the logged-in user's permissions. In the catalog view, each blueprint entry includes the icon PNG file with which it was uploaded or the Cloudify default icon if no PNG file was attached.

#### Configuration
In the widget configuration dialog, you can toggle on the **Enable click to drill down** option so that, when the blueprint is clicked, the drill down page is displayed for that blueprint.

![blueprints-list]( /images/ui/widgets/blueprints-list.png )

### Blueprints Catalog

Displays blueprints (as a table or tile view) that exist in a repository under a Github account. 

#### Configuration
You must specify the name of the user account in the widget's settings. The widget includes an `upload` option for each of the blueprints, which lets you easily upload to the manager. 

You can create a filter query in the configuration to specify the blueprints that appear. 

You can also enter a Github credentials to let you fetch data. These parameters are pulled from [secrets]({{< relref "working_with/console/default-widgets-ref.md#secrets-store-management" >}})) as the `github-username` and `github-password` keys. You must enter those secrets to access private repositories.

![blueprints-catalog]( /images/ui/widgets/blueprints-catalog.png )



## Deployment Widgets

### Deployment Inputs

Displays the blueprint input values. You can hover over the values, to display them in a separate window, which is useful if the values include multi-line code.

![deployment-inputs]( /images/ui/widgets/deployment-inputs.png )

### Deployment Outputs

Displays the blueprint output values. You can hover over the values, to display them in a separate window, which is useful if the values include multi-line code.

![deployment-outputs]( /images/ui/widgets/deployment-outputs.png )

### Deployment Metric Graph
Displays a chart or charts (up to 5) presenting metric data for the current deployment. After you have added the widget to a page, you can select the metrics to be displayed, and define their properties in the widget's configuration dialog. 

#### Configuration

You must supply at least one metric or database query in the widget configuration. You also must enter the Deployment ID and Node instance ID, either in the page context or in the widget configuration. 

The following list provides information regarding parameters that can be specified for this widget. 

* `Refresh Time Interval` - How frequently the data in the widget is refreshed (in secs).
* `Node filter` - Show only data for the specified nodes. Deployment ID and Node Instance ID must be set in the configuration or as part of the page context. You can set Deployment ID and Node instance ID in page context with the [Resource Filter](#resource-filter)
    ![Node filter configuration]( /images/ui/widgets/deployment-metric-graph-configuration-node-filter.png )
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

## Events and Logs Widgets

### Events and Logs

Displays the logs and events of all the executions in the current tenant, according to the user's permissions. You can configure the fields that are displayed and can use colors to indicate success and failure messages.

#### Configuration

The fields that can be displayed are:

* Icon
* Timestamp
* Type
* Blueprint
* Deployment
* Workflow
* Operation
* Node Name
* Node ID
* Message

![events-logs]( /images/ui/widgets/events-logs-2.png )

### Event and Logs Filter
Displays a filter pane for events and logs.

![events-logs-filter]( /images/ui/widgets/events-logs-filter.png )

## Execution Widgets

### Executions

Displays data for about the executions in the current tenant, according to the user's permissions. Data includes the blueprint and deployment of the execution, the time that it was created, and its current status.

![executions]( /images/ui/widgets/executions.png )

## Filter Widgets

### Resource Filter

Displays a filter to enable searching by blueprint, deployment, node, node instance or execution.

![resource-filter]( /images/ui/ui_resource_filter.png )

#### Configuration

Blueprints and deployments filters are always enabled. Node, node instance and execution filters are optional 
and can be enabled/disabled in widget's configuration.

![resource-filter-configuration]( /images/ui/ui_resource_filter_configuration.png )

### Event and Logs Filter
See [Event and Logs Filter]({{< relref "working_with/console/default-widgets-ref.md#event-and-logs-filter" >}})

### Time Filter
Displays a time filter for deployment metric graphs. It allows to define:

* _Time range_ - Enables you to choose start (`From`) and end (`To`) dates
     * by defining custom range
         * using text input - Influx-compatible date/time is allowed. It is possible to define both absolute and relative date/time. For details, see the [Influx documentation - Date time strings](https://docs.influxdata.com/influxdb/v0.8/api/query_language/#date-time-strings). Examples: `now() - 15m`  or `2017-09-21 10:10`
         * using calendar picker - You can choose date and time from the calendar/time pickers
     * by choosing predefined range - There are few predefined time ranges available. You can apply them with one click using the buttons on the left side of the filter

* _Time resolution_ - Enables you to group the metrics according to time, to reduce the volume of displayed data. For example, although data might be collected every 10 msecs, you might specify that you only see points on the graph for every minute. Allowed time resolution units: `microseconds`, `milliseconds`, `seconds`, `minutes`, `hours`, `days` and `weeks`. Value ranges from 1 to 1000. 

The filter provides also the following features:

* _Time resolution optimization_ - Automatic time resolution is set when you specify predefined range. It optimizes number of points to fetch from database to maximum 200 per chart. You can also optimize time resolution for custom ranges by clicking `Optimize` button. 

* _Time range and resolution reset_ - When you click `Reset` button, both time range and time resolution are reset to default values.

* _Data validation_ - When you click `Apply` button time range is validated. If invalid data is provided, then appropriate input field is marked with red color and time filter window will not be closed.  

![Time Filter]( /images/ui/widgets/time-filter.png )

## Cluster Widgets

### High Availability

Displays the Manager's status. In the event that there is one or more cluster on the Manager, shows the cluster-connected nodes. There is no click-through actions available from this widget.

![list-nodes-in-cluster-2]( /images/ui/widgets/list-nodes-in-cluster-2.png )


## Node Widgets

### Nodes List
Displays a list of the existing nodes related to the blueprint topology. The type, containing node, connection, number of instances, and groups of which the node is part are displayed. 

The nodes are listed by name. When you select a node, either by clicking its name in the table or by clicking it in the Topology pane, additional data about the node's instances are displayed.

![nodes-list]( /images/ui/widgets/nodes-list-2.png )

### Nodes Statistics
Displays the number of node instances, according to their states.
![node-statistics]( /images/ui/widgets/node-statistics.png )

## Miscellaneous Widgets

### Number of Deployments/Plugins/Servers
Displays indicators that provide the total number of deployments, plugins and servers on the Manager.

![deployments-plugins-servers]( /images/ui/widgets/no-of-deployments.png )

### Plugins List
Displays a list of plugins and enables their management.

![plugins-list]( /images/ui/widgets/plugins-list.png )

### Text
Displays text provided in the configuration of the widget.

![text-widget]({{< img "ui/widgets/text-widget.png" >}})

#### Configuration
Specify text for header, content part as well as text style: font, size and color.

### Secrets Store Management
Displays a list of secrets and enables their management. In the widget, you can hover your cursor over the eye icon to display the value of the secret.

{{% warning title="Caution" %}}
Any user who has access to the Secrets Store Management widget can view the value of the secrets.
{{% /warning %}}

![secrets-store]( /images/ui/widgets/secret-store.png )

### Snapshots List

Displays a list of snapshots of the Manager. This widget is only available to `admin` users.

![snapshots-list]( /images/ui/widgets/snapshots-list.png )

The parameters shown in the screenshot below can be specified during snapshot creation. 

![snapshots-list]( /images/ui/widgets/snapshots-list.png )

When you [restore snapshots]({{< relref "cli/snapshots.md" >}}), use the process for either your existing VM or a new VM.

### Tenant Management
Displays a list of tenants on the Manager and enables tenant management. This widget is only available to `admin` users.

![tenants-list]( /images/ui/widgets/tenants-list.png )

### User Group Management
Displays the list of user groups and enables their management. This widget is only available to `admin` users.

![manage-usergroups]( /images/ui/widgets/manage-usergroups.png )

### User Management
Displays the list of users and enables their management. This widget is only available to `admin` users.

![manage-users]( /images/ui/widgets/manage-users.png )

### Show Topology
Displays the topology of a blueprint or deployment.

![show-topology]( /images/ui/widgets/show-topology.png )

## Button Widgets

### Blueprint action buttons
Displays buttons for displaying the creating a deployment or deleting a blueprint dialog.

![blueprint-actions]( /images/ui/widgets/blueprint-action-buttons.png )

### Button Link

Opens the specified URL in a separate tab. You can define the name that appears on the button.

#### Configuration

Specify the URL to open when the button is clicked and buttons label.

![button-link]( /images/ui/widgets/button-link.png )


### Deployment Action Buttons

Displays buttons for displaying the execute a workflow, update a deployment, and delete a deployment dialogs.

![deployment-actions]( /images/ui/widgets/deployment-action-buttons.png ) 

### New Deployment Button
Displays a button for displaying the creating a deployment dialog.

![create-new-deployment]( /images/ui/widgets/create-new-deployment-button.png )

