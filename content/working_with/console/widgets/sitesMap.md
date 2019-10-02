---
layout: bt_wiki
title: Sites Map
category: Cloudify Console
draft: false
---
Displays the world map with defined sites marked. Only sites with defined location are displayed on the map.

![sitesMap]( /images/ui/widgets/sitesMap.png )

Color of the site marker on the map indicates site health. It is derived from status of deployments attached to the site.
 
After clicking on site marker on the map, user can see popup with site details.

![sitesMap]( /images/ui/widgets/sitesMap_siteDetails.png )

Site details contain information about deployments' statuses, indicated as follows:

* **Green** - number of deployments with all nodes successfully started,
* **Yellow** - number of deployments in which active workflow execution is performed,
* **Blue** - number of deployments with non-started nodes,
* **Red** - number of deployments with failed workflow execution. 

{{% tip title="Tip" %}}
If you have problems displaying map, maybe you need to change map provider. Check [this page]({{< relref "working_with/console/advanced-configuration.md" >}}) for more information.
{{% /tip %}}  

#### Widget Settings 

* `Refresh time interval` - Time interval in which widget’s data will be refreshed, in seconds. Default: 10 seconds.
* `Show all the site labels` - If set, then all sites will be displayed with site details popup opened. 
