---
layout: bt_wiki
title: Logs Page
category: Cloudify Console
draft: false
weight: 156
---

Logs page allows you to analyse events/logs produced by your deployments.

Page contains Resource and Time Filter widgets for filtering events/logs listed in Events/Logs widget. 

![Logs Page]( /images/ui/logsPage/logs-page.png )


## Resource Filter

Resource Filter widget allows you to select specific execution for logs/events analysis. You can filter by blueprints, deployments to limit the list of executions.  You can also filter by nodes and node instances to limit the list of events/logs.

More about Resource Filter widget you can find [here]({{< relref "working_with/console/widgets/filter.md" >}}).


## Events/Logs Filter

Events/Logs Filter widget allows you to reduce list of events/logs by specifing log levels, event types, keywords in messages and time range.

For more about Events/Logs Filter see [here]({{< relref "working_with/console/widgets/eventsFilter.md" >}}).


## Events/Logs

Events/Logs widget lists events/logs produced by deployments created in Cloudify Manager.

To learn more about this widget see [here]({{< relref "working_with/console/widgets/events.md" >}}).

