---
title: Logs Page
category: Console
draft: false
weight: 185
aliases: ["/working_with/console/logs-page/"]
---

The Logs page allows you to analyse events/logs produced by your deployments.

Page contains [Resource Filter]({{< relref "working_with/console/widgets/filter.md" >}}) and [Events/Logs Filter]({{< relref "working_with/console/widgets/eventsFilter.md" >}}) widgets for filtering events/logs listed in [Events/Logs widget]({{< relref "working_with/console/widgets/events.md" >}}).

![Logs Page]( /images/ui/pages/logs-page.png )


### Filtering

[Resource Filter widget]({{< relref "working_with/console/widgets/filter.md" >}}) allows you to select specific execution for logs/events analysis. You can filter by blueprints and deployments to limit the list of executions.  You can also filter by nodes and node instances to limit the list of events/logs.
[Events/Logs Filter widget]({{< relref "working_with/console/widgets/eventsFilter.md" >}}) allows you to reduce list of events/logs by specifying log levels, event types, keywords in messages and time range.


### Events/Logs

[Events/Logs widget]({{< relref "working_with/console/widgets/events.md" >}}) lists events/logs produced by deployments created in the {{< param cfy_manager_name >}}.
