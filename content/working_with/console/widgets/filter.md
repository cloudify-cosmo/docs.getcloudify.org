---
title: Resource Filter
category: Widgets
draft: false
---

This widget provides the ability to filter the data presented in other widgets on the page according to a specific resource.
By default, the widget allows filtering by blueprint, deployment and execution, and you can also add fields to filter by node, node instance and more, by configuring the widget’s settings.

![resource-filter]( /images/ui/widgets/resource_filter.png )

{{% note %}}
It is discouraged to place the Resource Filter widget alongside
[the Deployments View widget]({{< relref "working_with/console/widgets/deploymentsView.md" >}})
on the same page.
The Resource Filter widget does not influence the filtering performed in the Deployments View widget.
Moreover, the deployment selection in the Resource Filter widget will most likely be overridden
by the Deployments View widget.
{{% /note %}}

## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds.
* `Show blueprint filter` - Defines whether to expose filtering by Blueprint. Default: On
* `Show deployment filter` - Defines whether to expose filtering by Deployment. Default: On
* `Show execution filter` - Defines whether to expose filtering by Execution. Default: On
* `Show node filter` - Defines whether to expose filtering by Node. Default: Off
* `Show node instance filter` - Defines whether to expose filtering by Node Instances. Default: Off
* `Show execution status filter` - Defines whether to expose filtering by Execution Status. Default: Off
* `Show site name filter` - Defines whether to expose filtering by Site Name. Default: Off
* `Allow multiple selection` - Allows selecting more than one resource in the filter. Default: Off
