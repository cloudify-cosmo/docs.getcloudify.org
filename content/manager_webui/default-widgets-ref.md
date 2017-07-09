---
layout: bt_wiki
title: Default Widgets Reference
category: Web Interface
draft: false
weight: 160
---

This section provides a description of all the widgets that are included by default in Cloudify Manager (out-of-the-box). You can select these widgets from the widgets catalog. 

To view the widgets catalog, from the dropdown menu next to your user name, select **Edit Mode**, then click the **Add Widget** button to display the list of widgets. If you do not see Edit mode in the dropdown menu, you do not have permissions to edit configuration. 


For information about adding widgets, placing them on a page, and so on, see [Configuring the Web Interface Display]({{< relref "manager_webui/configure-display.md" >}}).

**Notes:**<br>

* You might have to configure some of the widgets. In the event that configuration is mandatory, the mandatory requirements are included in the widget descriptions. Many widgets also have non-mandatory configuration that enables you to customize them to your requirements.   

   To open a widget's configuration dialog after you have added it to a page, click the gear icon in the top right of the widget.

* Some widgets are only available for `admin` users. 


The widgets are listed according to their category.

* [Blueprint Widgets]({{< relref "manager_webui/default-widgets-ref.md#blueprint-widgets" >}})
* [Deployment Widgets]({{< relref "manager_webui/default-widgets-ref.md#deployment-widgets" >}})
* [Events and Logs Widgets]({{< relref "manager_webui/default-widgets-ref.md#events-and-logs-widgets" >}})
* [Execution Widgets]({{< relref "manager_webui/default-widgets-ref.md#execution-widgets" >}})
* [Filter Widgets]({{< relref "manager_webui/default-widgets-ref.md#filter-widgets" >}})
* [Cluster Widgets]({{< relref "manager_webui/default-widgets-ref.md#cluster-widgets" >}})
* [Node Widgets]({{< relref "manager_webui/default-widgets-ref.md#node-widgets" >}})
* [Miscellaneous Widgets]({{< relref "manager_webui/default-widgets-ref.md#miscellaneous-widgets" >}})
* [Button Widgets]({{< relref "manager_webui/default-widgets-ref.md#button-widgets" >}})

## Blueprint Widgets

### Blueprint Sources
Displays all the sources in a blueprint package in tree view, adjacent to the code. When you click an item in the tree, its code is displayed in the code panel.

![blueprint-sources]({{< img "ui/widgets/blueprint-sources.png" >}})

### Blueprint deployments
Displays the list of a deployments in the current tenant, according to the logged-in user's permissions. The data can be displayed as a table or list. In the case of a list view, the status of each deployment is also displayed. For information about deployment status, [click here]({{< relref "manager_webui/deployments-page.md" >}})

![blueprint-deployments]({{< img "ui/widgets/blueprint-deployments.png" >}})

### Blueprint info
Displays information about a specific blueprint.

#### Configuration
The blueprint ID must be passed to the widget. This can be done either in the page's context, by placing the widget in a blueprint drill-down page, or by specifying the blueprint ID in the widget's configuration.

![blueprint-info]({{< img "ui/widgets/blueprint-info.png" >}})

### Blueprints

Displays all the local blueprints on the Cloudify Manager in the context of the current tenant as a table or tile view, according to the logged-in user's permissions. In the catalog view, each blueprint entry includes the icon PNG file with which it was uploaded or the Cloudify default icon if no PNG file was attached.

#### Configuration
In the widget configuration dialog, you can toggle on the **Click to drill down** option so that, when the blueprint is clicked, the drill down page is displayed for that blueprint.

![blueprints-list]({{< img "ui/widgets/blueprints-list.png" >}})

### Blueprints Catalog

Displays the details of a blueprint that exists in a repository under a Github user that has been specified in the widget's settings, as a table or tile view. The widget provides an `upload` option for each of the blueprints, enabling them to be easily uploaded locally to the Manager.

You can create a filter query in the configuration to specify the blueprints that appear. 

![blueprints-catalog]({{< img "ui/widgets/blueprints-catalog.png" >}})



## Deployment Widgets

### Deployment Inputs

Displays the blueprint input values. You can hover over the values, to display them in a separate window, which is useful if the values include multi-line code.

![deployment-inputs]({{< img "ui/widgets/deployment-inputs.png" >}})

### Deployment Outputs

Displays the blueprint output values. You can hover over the values, to display them in a separate window, which is useful if the values include multi-line code.

![deployment-outputs]({{< img "ui/widgets/deployment-outputs.png" >}})

### Deployment Metric Graph
Displays a graph presenting metric data for the current deployment.

#### Configuration

You must supply the deployment's ID, either in the page context, or by specifying it in the widget configuration.

![deployment-metric-graph]({{< img "ui/widgets/deployment-metric-graph.png" >}})

## Events and Logs Widgets

### Events and Logs

Displays the logs and events of all the executions in the current tenant, according to the user's permissions. You can configure the fields that are displayed and can use colors to indicate success and failure messages.

![events-logs-2]({{< img "ui/widgets/events-logs-2.png" >}})

### Event and Logs Filter
Displays a filter pane for events and logs.

## Execution Widgets

### Executions

Displays data for about the executions in the current tenant, according to the user's permissions. Data includes the blueprint and deployment of the execution, the time that it was created, and its current status.

![executions]({{< img "ui/widgets/executions.png" >}})

## Filter Widgets

### Filter by Blueprint, Deployment or Execution

Displays a filter to enable searching by blueprint, deployment, or execution.

![filter-by-action]({{< img "ui/widgets/filter-by-action.png" >}})

### Event and Logs Filter
See [Event and Logs Filter]({{< relref "manager_webui/default-widgets-ref.md#event-and-logs-filter" >}})

### Time Filter
Adds a time filter for deployment metric graphs.

![time-filter]({{< img "ui/widgets/time-filter.png" >}})

## Cluster Widgets

### High Availability

Displays the Manager's status. In the event that there is one or more cluster on the Manager, shows the cluster-connected nodes. There is no click-through actions available from this widget.

![list-nodes-in-cluster-2]({{< img "ui/widgets/list-nodes-in-cluster-2.png" >}})


## Node Widgets

### Nodes List
Displays a list of the existing nodes related to the blueprint topology. The type, containing node, connection, number of instances, and groups of which the node is part are displayed. 

The nodes are listed by name. When you select a node, either by clicking its name in the table or by clicking it in the Topology pane, additional data about the node's instances are displayed.

![nodes-list]({{< img "ui/widgets/nodes-list-2.png" >}})

### Nodes Statistics
Displays the number of node instances, according to their states.
![node-statistics]({{< img "ui/widgets/node-statistics.png" >}})

## Miscellaneous Widgets

### Number of Deployments/Plugins/Servers
Displays indicators that provide the total number of deployments, plugins and servers on the Manager.

![deployments-plugins-servers]({{< img "ui/widgets/no-of-deployments.png" >}})

### Plugins List
Displays a list of plugins and enables their management.

![plugins-list]({{< img "ui/widgets/plugins-list.png" >}})


### Secrets Store Management
Displays a list of secrets and enables their management. In the widget, you can hover your cursor over the eye icon to display the value of the secret.

{{% gsWarning title="Caution" %}}
Any user who has access to the Secrets Store Management widget can view the value of the secrets.
{{% /gsWarning %}}

![blueprint-actions]({{< img "ui/widgets/blueprint-action-buttons.png" >}})

### Snapshots List

Displays a list of snapshots of the Manager. This widget is only available to `admin` users.

When restoring snapshots, a specific process must be followed, relating to whether you want to use your existing VM or create a new one. For more information, [click here]({{< relref "installation/upgrade_4-0-0.md" >}}).

![snapshots-list]({{< img "ui/widgets/snapshots-list.png" >}})


### Tenant Management
Displays a list of tenants on the Manager and enables tenant management. This widget is only available to `admin` users.

![tenants-list]({{< img "ui/widgets/tenants-list.png" >}})

### Show Topology
Displays the topology of a blueprint or deployment.

![show-topology]({{< img "ui/widgets/show-topology.png" >}})

### User Group Management
Displays the list of user groups and enables their management. This widget is only available to `admin` users.

![manage-usergroups]({{< img "ui/widgets/manage-usergroups.png" >}})


### User Management
Displays the list of users and enables their management. This widget is only available to `admin` users.

![manage-users]({{< img "ui/widgets/manage-users.png" >}})

## Button Widgets

### Blueprint action buttons
Displays buttons for displaying the creating a deployment or deleting a blueprint dialog.

![blueprint-actions]({{< img "ui/widgets/blueprint-action-buttons.png" >}})

### Button Link

Opens the specified URL in a separate tab. You can define the name that appears on the button.

#### Configuration

Specify the URL to open when the button is clicked.

![button-link]({{< img "ui/widgets/button-link.png" >}})


### Deployment Action Buttons

Displays buttons for displaying the execute a workflow, update a deployment, and delete a deployment dialogs.

![deployment-actions]({{< img "ui/widgets/deployment-action-buttons.png" >}}) 

### New Deployment Button
Displays a button for displaying the creating a deployment dialog.

![create-new-deployment]({{< img "ui/widgets/create-new-deployment-button.png" >}})

