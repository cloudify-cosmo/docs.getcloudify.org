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

By default, the page displays usage statistics of the {{< param cfy_manager_name >}}, including number of: services, Kubernetes clusters and Terraform modules on this {{< param cfy_manager_name >}}.   
The data is presented using [number of deployments widget]({{< relref "working_with/console/widgets/deploymentNum.md" >}}).

### Actions

You can also:

* [set up a cloud account]({{< relref "working_with/console/widgets/buttonLink.md" >}})
* [create a service]({{< relref "working_with/console/widgets/serviceButton.md" >}})
* [create a Kubernetes cluster]({{< relref "working_with/console/widgets/serviceButton.md" >}})
* [run a Terraform module]({{< relref "working_with/console/widgets/serviceButton.md" >}})


### Overview

An overview of the current and recent processes on the {{< param cfy_manager_name >}} is provided by [list of all the executions]({{< relref "working_with/console/widgets/executions.md" >}}) on the {{< param cfy_manager_name >}}.
You can configure it to show executions for a specific blueprint or deployment or with a specific execution status using [Resource Filter widget]({{< relref "working_with/console/widgets/filter.md" >}}).
