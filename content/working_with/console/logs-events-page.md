---
layout: bt_wiki
title: Logs and Events Page
category: Cloudify Console
draft: true
weight: 140

terminology_link: reference-terminology.html
---


The `Logs & Events` page displays a list of 50 rows of events, which is aggregated from all `Blueprints` and `Deployments`. The list is displayed in descending order according to the event timestamps.<br/>
![logs & events page]( /images/ui/eventsPage/eventsPage.png )


## Filtering Data
You can filter the logs and events in the table by:  
* Blueprint
* Deployment
* Log level
* Event type
* Time range

You can use more than one filter to focus your view. The page updates dynamically as you make your selections.

**To filter `Blueprints`, `Deployments`, `Log levels`, and `Event Type`**<br>
Select one or more items in the relevant dropdown list.

**To filter by `Time Range`**<br>
In the two `Time Range` fields, enter a start/end date and time in `YYYY-MM-DD HH:MM` format, or use the time-picker icons to select the time entries.<br>

{{% note title="Note" %}}
If you are unsure if your timestamp is valid, look for this <i class="fa fa-calendar"></i> icon, which indicates that the input is valid, and note that the displayed data has automatically changed to match the filter.<br>
![time range]( /images/ui/eventsPage/timeRange.png )<br>
{{% /note %}}  

**To filter by free text**<br>
You can free type text in the **Message Text** field. The displayed data automatically changes to match the filter.<br/>

### Clearing Filters
Click `Clear Filters` to clear all the filters and reset the table to the default display.

### Sorting the Table
You can sort items in the table in ascending or descending order, or random order (`none`) by clicking a column title.

# Pagination
Each page displays 50 logs & events items. Use the pagination bar to scroll through the pages.
![pagination]( /images/ui/eventsPage/pagination.png )<br>

# Viewing Additional Details about a Log/Event
By default, the table does not display all available log/event information. To display all of the information, click on the row.<br>
An event example:
![event example]( /images/ui/eventsPage/event.png )<br>

A log example:
![log example]( /images/ui/eventsPage/log.png )<br>

{{% note title="Note" %}}
Some fields are event-specific or log-specific. For example, `Logger` and `Log Level` fields are specific to logs, whereas the `Event Type` field is specific to events.
{{% /note %}}

# Adjusting the Table View
By default, all columns in the logs and events table are displayed. You can select the columns to display and hide.<br>
Click the <i class="fa fa-cog"></i> icon, and select or clear the columns from the dropdown menu that you want to display or hide.<br>
![choose columns]( /images/ui/eventsPage/columnsOrganizer.png )<br>


# Persistent Memory
The changes that you make to a table's view by filtering, sorting and paging through it, are automatically saved as part of the page's URL.<br>
For each unique set of table adjustments, a unique URL is created to match it. When you load the page, those preferences are automatically loaded from the page's URL, adjusting the table's view to the preferences you created. This functionality enables you to refresh or bookmark the page, or send the page's URL as a link to a colleague, without having to reset your preferences when reloading the page.

{{% note title="Note" %}}
The `table view` is the set of filtering, sorting and paging preferences applied to the table. The data for a specific view is dynamic and is not considered part of the view's preferences.<br>
For example sorting by timestamp descending is the default view that loads when routing to logs & events page. However, at different points in time there could be different data for the same view - as new data is registered.
{{% /note %}}