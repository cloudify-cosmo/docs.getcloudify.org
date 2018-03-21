---
layout: bt_wiki
title: Metrics Visualization
category: Web Interface
draft: true
abstract: Cloudify Grafana-Based Metrics Visualization
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
---



Cloudify implements monitoring using [Grafana]({{< field "grafana" >}}) for tracking system metrics.
The monitoring section is located on each deployment's page in the user interface:

![The monitoring section button]( /images/ui/ui-monitoring-tab.jpg" >}})

By default, when you open the monitoring section of a deployment page, you see a dashboard with six graphs.
You can customize the dashboard according to your preferences, and save it as a JSON file or in your browser's local storage.

![The monitoring]( /images/ui/ui_monitoring.jpg" >}})

### Default Dashboard

The default dashboard is a set of graphs that Cloudify initializes if another dashboard does not exist.
The default metrics provide a good base from which you can customize your dashboard.<br>
The default dashboard includes the following metrics:

* CPU Utilization - System
* CPU Utilization - User
* Physical Memory
* Disk IO
* Network IO - RX
* Network IO - TX

## Configuring your Blueprint for Metrics Collection and Shipping

The default dashboard only displays metrics when the blueprint is configured to ship metrics that correspond with the default dashboard's configured view. To see an example of an already configured blueprint, go to [cloudify-nodecellar-example]({{< field "cloudify_nodecellar_example" >}}).


## Example - Customizing your Dashboard

To begin customizing your graph, click on the panel's title, then click **Edit** to open edit mode.

![The monitoring panel edit mode]( /images/ui/ui-monitoring-title-edit.jpg" >}})<br>

* On the **General** tab, you can specify the title, span and height of the panel.  
  ![The monitoring panel general edit mode]( /images/ui/ui-monitoring-edit-general.jpg" >}})

* On the **Metrics** tab, you can edit or add new metrics.  
  ![The monitoring panel edit mode of metrics]( /images/ui/ui-monitoring-edit-metrics.jpg" >}})

* On the **Axes & Grid** tab, you can specify the axes and grid of the panel and specify legend styles.  
  ![The monitoring panel edit mode of axes and grid]( /images/ui/ui-monitoring-edit-axes-grid.jpg" >}})

* On the **Display Styles** tab, you can change the colors and styles of the panel.  
  ![The monitoring panel edit mode of styles]( /images/ui/ui-monitoring-edit-styles.jpg" >}})

# Features Guide
The [Grafana]({{< field "grafana" >}}) guide can help you get started and acquainted with the monitoring interface. Following are links to the key sections of the guide.

* [Getting started]({{< field "grafana_getting_started" >}})
* [Graphing]({{< field "grafana_graphing" >}})
* [Annotations]({{< field "grafana_annotations" >}})
* [Time range controls]({{< field "grafana_time_range_controls" >}})
* [Search features]({{< field "grafana_search_features" >}})
* [Templated Dashboards]({{< field "grafana_templated_dashboards" >}})
* [Playlist]({{< field "grafana_playlist" >}})
* [Export and Import]({{< field "grafana_export_and_import" >}})

## Tips and Shortcuts from the [Grafana]({{< field "grafana" >}}) Documentation
Use the following tips and shortcuts to simplify configuring or editing the metrics display.<br>
* Click the graph's title and in the dropdown menu quickly change the span or duplicate the panel.
* Press **Ctrl+S** to save the current dashboard.
* Press **Ctrl+F** to open the dashboard finder/search.
* Press **Ctrl+H** to hide all controls. (Useful for TV displays.)
* Press **Escape** to exit the graph when in fullscreen or edit mode.
* Click the colored icon in the legend to select a series' color.
* Click the series name in the legend to hide the series.
* Press **Ctrl/Shift/Meta** and simultaneously click the legend name to hide other series.
* Click **Save** to save the dashboard with a new name.
* Click **Save** and then **Advanced** to export the dashboard to a JSON file, or set it as your default dashboard.
