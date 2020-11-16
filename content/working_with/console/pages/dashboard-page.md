---
layout: bt_wiki
title: Dashboard Page
category: Console
draft: false
abstract: Dashboard Page Reference
weight: 120
aliases: ["/manager_webui/application-overview/", "/working_with/console/application-overview/", "/working_with/console/dashboard-page/"]
---

The Dashboard page is the landing page when you log into the {{< param cfy_console_name >}}.

![Dashboard page]( /images/ui/pages/dashboard-page.png )

### Statistics

By default, the page displays usage statistics of the {{< param cfy_manager_name >}}, including the number of:

* [blueprints]({{< relref "working_with/console/widgets/blueprintNum.md" >}})
* [deployments]({{< relref "working_with/console/widgets/deploymentNum.md" >}})
* [plugins]({{< relref "working_with/console/widgets/pluginsNum.md" >}})
* [node instances]({{< relref "working_with/console/widgets/nodesComputeNum.md" >}})
* [running executions]({{< relref "working_with/console/widgets/executionNum.md" >}})

on this {{< param cfy_manager_name >}}r.


### Actions

You can also:

* [upload a blueprint]({{< relref "working_with/console/widgets/blueprintUploadButton.md" >}})
* [create a deployment]({{< relref "working_with/console/widgets/deploymentButton.md" >}})
* [upload a plugin]({{< relref "working_with/console/widgets/pluginUploadButton.md" >}})
* go to Getting Started Walkthrough tour with [single button]({{< relref "working_with/console/widgets/buttonLink.md" >}}) click


### Overview

An overview of the current and recent processes on the {{< param cfy_manager_name >}} is provided by [list of all the executions]({{< relref "working_with/console/widgets/executions.md" >}}) on the {{< param cfy_manager_name >}}.
You can configure it to show executions for a specific blueprint or deployment or with a specific execution status using [Resource Filter widget]({{< relref "working_with/console/widgets/filter.md" >}}).

[Sites map]({{< relref "working_with/console/widgets/sitesMap.md" >}}) provides an overview of sites distribution across the world map.
