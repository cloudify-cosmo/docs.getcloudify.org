---
layout: bt_wiki
title: The Logs & Events Page
category: Web Interface
draft: false
abstract: Logs & Events Page Reference
weight: 140

---
{{% gsSummary %}}{{% /gsSummary %}}

# Overview
When clicking on the `Logs & Events` tab, you will be able to view the last 50 events aggregated from all `Blueprints` and `Deployments`:<br/>
![Logs&EventsPage]({{< img "ui/ui-logsNevents-overview.png" >}})


You can control which events are displayed by filtering by:

# Blueprints

![Blueprints]({{< img "ui/ui-logsNevents-blueprint-selection.png" >}})

# Deployments

This list is affected by the selection of blueprints. <br/>
If the blueprints selection consists only of undeployed blueprints, this dropdown will not be visible.<br/>
Likewise, it will not include a deployment if the blueprint it is based on wasn't selected.<br/>
Not selecting any deployments is equivalent to selecting all deployments in the list.<br/>
![Deployments]({{< img "ui/ui-logsNevents-deployment-selection.png" >}})

# Timeframe

A list of timeframes. This selection will affect how far back in history the events will be shown.<br/>
You can choose a timeframe as short as 5 minutes or as long as 5 days, with increments in between in the minute, hour and day range.<br/>
![Timeframe]({{< img "ui/ui-logsNevents-timeframe-selection.png" >}})

# Applying the filter

This page is not filtered live. You should click on the `Show` button to apply the filter.<br/>
![Show]({{< img "ui/ui-logsNevents-show.png" >}})

