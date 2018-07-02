---
layout: bt_wiki
title: Statistics Page
category: Cloudify Console
draft: false
weight: 155
---

Statistics page displays tools allowing to monitor your deployments by visualizing collected system measurements.

Page contains Resource and Time Filter widgets and four Metric Graphs widgets with predefined metrics. 

![Statistics Page]( /images/ui/statisticsPage/statistics-page.png )


## Resource Filter

Resource Filter widget allows you to select specific node instance for monitoring. You can filter by blueprints, deployments 
and nodes to limit the list of node instances.  

More about Resource Filter widget you can find [here]({{< relref "working_with/console/default-widgets-ref.md#resource-filter" >}}).


## Time Filter

Time Filter widget allows you to define time range for all the graphs displayed on the page.

For more about what you can achieve with Time Filter widget see [here]({{< relref "working_with/console/default-widgets-ref.md#time-filter" >}}).


## Metric Graphs

There are 4 Deployment Metric Graph widgets on the page. They display value changes in time of the following metrics:

* Memory Free
* CPU Total User
* CPU Total System
* Load Average

By changing widget's configuration you can visualize another metrics.

To learn how to do it see [here]({{< relref "working_with/console/default-widgets-ref.md#deployment-metric-graph" >}}).

