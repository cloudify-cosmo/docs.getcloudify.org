---
layout: bt_wiki
title: Sites Map
category: Cloudify Console
draft: false
---
Displays the world map with defined sites marked. Only sites with defined location are displayed on the map.

![sitesMap]( /images/ui/widgets/sitesMap.png )

{{% note %}}
The widget is available only when Premium or Spire license is activated on the Cloudify Manager.
{{% /note %}}

The color of the site marker on the map indicates the site's health. It is derived from the status of the deployments attached to the site.

After clicking the site marker on the map, the user is presented with a popup with the status breakdown of the deployments assigned with the site.

![sitesMap]( /images/ui/widgets/sitesMap_siteDetails.png )

Site details contain information about deployments' statuses, indicated as follows:

* **Green** - the number of deployments with all nodes successfully started.
* **Yellow** - the number of deployments in which active workflow execution is performed.
* **Blue** - the number of deployments with non-started nodes.
* **Red** - the number of deployments with failed workflow execution.


## Settings

* `Refresh time interval` - Time interval in which widget’s data will be refreshed, in seconds. Default: 10 seconds.
* `Show all the site labels` - If set, then all sites will be displayed with site details popup opened.
