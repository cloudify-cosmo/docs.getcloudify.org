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

* You might have to configure some of the widgets. In the event that configuration is required, the requirements are included in the widget descriptions.
* Some widgets are only available for `admin` users. 


The widgets are listed according to their category.

* [Blueprint Widgets]({{< relref "manager_webui/default-widgets.md#blueprint-widgets" >}})
* [Deployment Widgets]({{< relref "manager_webui/default-widgets.md#deployment-widgets" >}})
* [Events and Logs Widgets]({{< relref "manager_webui/default-widgets.md#events-and-logs-widgets" >}})
* [Execution Widgets]({{< relref "manager_webui/default-widgets.md#execution-widgets" >}})
* [Filter Widgets]({{< relref "manager_webui/default-widgets.md#filter-widgets" >}})
* [Cluster Widgets]({{< relref "manager_webui/default-widgets.md#cluster-widgets" >}})
* [Node Widgets]({{< relref "manager_webui/default-widgets.md#node-widgets" >}})
* [Miscellaneous Widgets]({{< relref "manager_webui/default-widgets.md#miscellaneous-widgets" >}})

## Blueprint Widgets

### Blueprint Sources
Displays all the sources in a blueprint package in tree view, adjacent to the code. When you click an item in the tree, its code is displayed in the code panel.

![blueprint-sources]({{< img "ui/widgets/blueprint-sources.png" >}})

### Blueprint action buttonss
Displays buttons for displaying the creating a deployment or deleting a blueprint dialog.

![blueprint-actions]({{< img "ui/widgets/blueprint-action-buttons.png" >}})

### Blueprint deployments
Displays the list of a deployments in the current tenant, according to the logged-in user's permissions. The data can be displayed as a table or list. In the case of a list view, the status of each deployment is also displayed. For information about deployment status, [click here]({{< relref "manager_webui/deployments-page.md" >}})

![blueprint-deployments]({{< img "ui/widgets/blueprint-deployments.png" >}})

### Blueprint info
Displays information about a specific blueprint.

#### Configuration
The blueprint ID must be passed to the widget. This can be done either in the page's context, by placing the widget in a blueprint drill-down page, or by specifying the blueprint ID in the widget's configuration.

![blueprint-info]({{< img "ui/widgets/blueprint-info.png" >}})

### Blueprints

Displays all the local blueprints on the Cloudify Manager in the context of the current tenant as a table, according to the logged-in user's permissions.

#### Configuration
In the widget configuration dialog, you can toggle on the **Click to drill down** option so that when the blueprint is clicked the drill down page is displayed for that blueprint.

![blueprints]({{< img "ui/widgets/blueprints-list.png" >}})

### Blueprints Catalog

Displays all the local blueprints on the Cloudify Manager in the context of the current tenant as a catalog, according to the logged-in user's permissions. Each blueprint entry includes an icon PNG file with which it was uploaded or the Cloudify default icon if no PNG file was attached.

#### Configuration
In the widget configuration dialog, you can toggle on the **Click to drill down** option so that when the blueprint is clicked the drill down page is displayed for that blueprint.

![blueprints]({{< img "ui/widgets/blueprints-catalog.png" >}})



