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

By default, the page displays usage statistics of the {{< param cfy_manager_name >}}, including number of services, Kubernetes clusters and Terraform modules on this {{< param cfy_manager_name >}}.<br />
The data is presented using [number of deployments widget]({{< relref "working_with/console/widgets/deploymentNum.md" >}}).

### Actions

You can also:

* [set up a cloud account]({{< relref "working_with/console/widgets/buttonLink.md" >}})
* [create a service]({{< relref "working_with/console/widgets/serviceButton.md" >}})
* [create a Kubernetes cluster]({{< relref "working_with/console/widgets/serviceButton.md" >}})
* [run a Terraform module]({{< relref "working_with/console/widgets/serviceButton.md" >}})


### Overview

When there are no deployments installed on the {{< param cfy_manager_name >}},
then two buttons are presented to the user by 
[Blueprint Deployments widget]({{< relref "working_with/console/widgets/deployments.md" >}})
allowing to start working with {{< param cfy_manager_name >}}.

When there's at least one deployment installed on the {{< param cfy_manager_name >}}, 
then an overview of the deployments is provided by 
[Blueprint Deployments widget]({{< relref "working_with/console/widgets/deployments.md" >}}).

You can configure it to show deployments for a specific blueprint(s) using 
[Resource Filter widget]({{< relref "working_with/console/widgets/filter.md" >}}).
