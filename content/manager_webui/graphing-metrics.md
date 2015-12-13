---
layout: bt_wiki
title: Metrics Visualization
category: Web Interface
draft: false
abstract: Cloudify's Grafana Based Metrics Visualization
weight: 190

grafana: http://grafana.org
grafana_getting_started: http://grafana.org/docs/features/intro/
grafana_graphing: http://grafana.org/docs/features/graphing/
grafana_annotations: http://grafana.org/docs/features/annotations/
grafana_time_range_controls: http://grafana.org/docs/features/time_range/
grafana_search_features: http://grafana.org/docs/features/search/
grafana_templated_dashboards: http://grafana.org/docs/features/templated_dashboards/
grafana_playlist: http://grafana.org/docs/features/playlist/
grafana_export_and_import: http://grafana.org/docs/features/export_import/
cloudify_nodecellar_example: https://github.com/cloudify-cosmo/cloudify-nodecellar-example
terminology_link: reference-terminology.html
---
{{% gsSummary %}}{{% /gsSummary %}}


# Overview

Cloudify's Monitoring Implementation uses [Grafana]({{< field "grafana" >}}) for tracking system metrics.
The monitoring section can be found on each deployment's page in the user interface:

![The monitoring section button]({{< img "ui/ui-monitoring-tab.jpg" >}})

Once you open the monitoring section you can find a default dashboard with six graphs.
You can also customize your dashboard however you want and save it on a JSON file or in your browser's local storage.

![The monitoring]({{< img "ui/ui_monitoring.jpg" >}})

### Default Dashboard:

The default dashboard is a set of graphs that Cloudify will initialize if a dashboard doesn't already exist.
The presented common system metrics are a good start from which you can further customize your dashboard.
The default dashboard includes the following metrics:

* CPU Utilization - System
* CPU Utilization - User
* Physical Memory
* Disk IO
* Network IO - RX
* Network IO - TX


# Setting up your blueprint for metrics collection and shipping

The Default dashboard will display metrics only if the blueprint is configured to ship metrics corresponding with the default dashboard's configured view.

For an example of an already configured blueprint, go to [cloudify-nodecellar-example]({{< field "cloudify_nodecellar_example" >}}).


# Example - Customize your dashboard

To start customizing your graph, click on the panel's title and then 'Edit' to open a panel in edit mode:

![The monitoring panel edit mode]({{< img "ui/ui-monitoring-title-edit.jpg" >}})

Under the edit mode, you can edit or add new metrics under 'metrics' section:

![The monitoring panel edit mode of metrics]({{< img "ui/ui-monitoring-edit-metrics.jpg" >}})

To change the title / span / height of the panel click on 'General' in edit mode:

![The monitoring panel general edit mode]({{< img "ui/ui-monitoring-edit-general.jpg" >}})

To change the axes and grid of the panel click on 'Axes & Grid' in edit mode:

![The monitoring panel edit mode of axes and grid]({{< img "ui/ui-monitoring-edit-axes-grid.jpg" >}})

To change colors and styles of the panel click on 'Display Styles' in edit mode:

![The monitoring panel edit mode of styles]({{< img "ui/ui-monitoring-edit-styles.jpg" >}})

# Features Guide
The [Grafana]({{< field "grafana" >}}) guide will help you get started and acquainted with the monitoring user interface:

* [Getting started]({{< field "grafana_getting_started" >}})
* [Graphing]({{< field "grafana_graphing" >}})
* [Annotations]({{< field "grafana_annotations" >}})
* [Time range controls]({{< field "grafana_time_range_controls" >}})
* [Search features]({{< field "grafana_search_features" >}})
* [Templated Dashboards]({{< field "grafana_templated_dashboards" >}})
* [Playlist]({{< field "grafana_playlist" >}})
* [Export and Import]({{< field "grafana_export_and_import" >}})

### Tips and shortcuts (from the [Grafana]({{< field "grafana" >}}) documentation)
* Click the graph's title and in the dropdown menu quickly change the span or duplicate the panel.
* Ctrl+S Saves the current dashboard
* Ctrl+F Opens the dashboard finder / search
* Ctrl+H Hides all controls (good for tv displays)
* Hit Escape to exit the graph when in fullscreen or edit mode
* Click the colored icon in the legend to select a series color
* Click the series name in the legend to hide the series
* Ctrl/Shift/Meta + Click the legend name to hide other series
* Click the Save icon in the menu to save the dashboard with a new name
* Click the Save icon in the menu and then advanced to export the dashboard to json file, or set it as your default dashboard.
