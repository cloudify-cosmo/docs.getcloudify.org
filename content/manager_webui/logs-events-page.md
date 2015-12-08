---
layout: bt_wiki
title: The Logs & Events Page
category: Web Interface
draft: false
abstract: Logs & Events Page User Guide
weight: 140

terminology_link: reference-terminology.html
---
{{% gsSummary %}}{{% /gsSummary %}}

When clicking on the `Logs & Events` tab, you are presented with 50 events rows aggregated from all `Blueprints` and `Deployments` ordered latest first.<br/>
![logs & events page]({{< img "ui/eventsPage/eventsPage.png" >}})<br><br>
You can control which logs & events are displayed by:

# Filtering
### Blueprints
To filter logs & events by specific blueprints choose one or more blueprints, matching logs & events will be automatically updated.<br/>
![blueprints filter]({{< img "ui/eventsPage/blueprintsFilter.png" >}})<br>

### Deployments
To filter logs & events by specific deployments choose one or more deployments, matching logs & events will be automatically updated.<br/>
![deployments filter]({{< img "ui/eventsPage/deploymentsFilter.png" >}})<br>

### Log Levels
To filter logs & events by specific log levels choose one or more log levels, matching logs & events will be automatically updated.<br/>
![log levels filter]({{< img "ui/eventsPage/loglevelsFilter.png" >}})<br>

### Event Types
To filter logs & events by specific event types choose one or more event types, matching logs & events will be automatically updated.<br/>
![event types filter]({{< img "ui/eventsPage/eventTypesFilter.png" >}})<br>

### Time Range
To filter logs & events from and to a specific timestamp use the time range filters.
The filters consist of 2 timepickers, each allow manually typing the timestamp expected to be in `YYYY-MM-DD HH:MM` format or choosing a date and time from the timepicker.<br>
The first timepicker filter logs & events `from` the chosen timestamp, the second filter log & events `to` the chosen timestamp.
You can choose to filter using either of the timepickers or both.
![time range filters]({{< img "ui/eventsPage/timeRangeFilter.png" >}})<br>


{{% gsNote title="Note" %}}
If it is unclear is your time is valid, look for this <i class="fa fa-calendar"></i> icon. When it shows - the input is valid and the data is automatically changed to match the filter.<br>
![time range]({{< img "ui/eventsPage/timeRange.png" >}})<br>
{{% /gsNote %}}

### Message Text
To filter logs & events by specific message text free type the message, matching logs & events will be automatically updated.<br/>
![message text filter]({{< img "ui/eventsPage/messageTextFilter.png" >}})<br>

### Clear Filters
To clear all of the filters you can easily do so by clicking the 'Clear Filters' button.

# Sorting
To sort logs & events click on the desired table header to switch order between ascending, descending and none.
![sorting]({{< img "ui/eventsPage/sorting.png" >}})<br>

# Pagination
50 logs & events are presented per page. You can use the pagination bar to scroll through the pages.
![pagination]({{< img "ui/eventsPage/pagination.png" >}})<br>

# The Log/Event
By default the table is not presenting all of the log/event information. In order to reveal all of the log/event information simply click on the row itself.<br>
An event example:
![event example]({{< img "ui/eventsPage/event.png" >}})<br>

A log example:
![log example]({{< img "ui/eventsPage/log.png" >}})<br>

{{% gsNote title="Note" %}}
Not all logs/events has the same fields and there are some fields which are specific to a type.<br>
For example `Logger` and `Log Level` fields are specific to logs and `Event Type` field is specific to events.
{{% /gsNote %}}

# Adjust The Table
By default the logs & events table is presenting all of the columns, you can choose which columns you would like the table to present.
Click on the <i class="fa fa-cog"></i> icon, a dropdown menu containing all of the table headers names is presented.<br>
![choose columns]({{< img "ui/eventsPage/columnsOrganizer.png" >}})<br>

Clicking on a header toggles if it should be presented, additionally you can drag and drop headers to determine the order of the columns.<br>
Here is an example of a customised table:
![customized table]({{< img "ui/eventsPage/customizedTable.png" >}})<br>

# Persistency
Filtering, sorting are paging persistent. This means that while you filter, sort and changing pages all of those preference automatically change the url of the page.<br>
This for example allow you to refresh the page and not loose all the preference, bookmark it, or send the link to a colleague.




