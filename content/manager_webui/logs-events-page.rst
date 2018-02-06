Logs and Events Page
%%%%%%%%%%%%%%%%%%%%


The ``Logs & Events`` page displays a list of 50 rows of events, which
is aggregated from all ``Blueprints`` and ``Deployments``. The list is
displayed in descending order according to the event timestamps. [logs &
events page]({{< img “ui/eventsPage/eventsPage.png” >}})

Filtering Data
--------------

| You can filter the logs and events in the table by:
| \* Blueprint \* Deployment \* Log level \* Event type \* Time range

You can use more than one filter to focus your view. The page updates
dynamically as you make your selections.

**To filter ``Blueprints``, ``Deployments``, ``Log levels``, and
``Event Type``**\  Select one or more items in the relevant dropdown
list.

**To filter by ``Time Range``**\  In the two ``Time Range`` fields,
enter a start/end date and time in ``YYYY-MM-DD HH:MM`` format, or use
the time-picker icons to select the time entries.

.. note::
    :class: summary

    If you are unsure if your timestamp is    valid, look for this icon, which indicates that the input is valid, and
    note that the displayed data has automatically changed to match the
    filter. [time range]({{< img “ui/eventsPage/timeRange.png” >}}) {{%

**To filter by free text**\  You can free type text in the **Message
Text** field. The displayed data automatically changes to match the
filter.

Clearing Filters
~~~~~~~~~~~~~~~~

Click ``Clear Filters`` to clear all the filters and reset the table to
the default display.

Sorting the Table
~~~~~~~~~~~~~~~~~

You can sort items in the table in ascending or descending order, or
random order (``none``) by clicking a column title.

Pagination
==========

Each page displays 50 logs & events items. Use the pagination bar to
scroll through the pages. |pagination|\ ({{< img
“ui/eventsPage/pagination.png” >}})

Viewing Additional Details about a Log/Event
============================================

By default, the table does not display all available log/event
information. To display all of the information, click on the row. An
event example: [event example]({{< img “ui/eventsPage/event.png” >}})

A log example: [log example]({{< img “ui/eventsPage/log.png” >}})

.. note::
    :class: summary

    Some fields are event-specific or    log-specific. For example, ``Logger`` and ``Log Level`` fields are
    specific to logs, whereas the ``Event Type`` field is specific to

Adjusting the Table View
========================

By default, all columns in the logs and events table are displayed. You
can select the columns to display and hide. Click the icon, and select
or clear the columns from the dropdown menu that you want to display or
hide. [choose columns]({{< img “ui/eventsPage/columnsOrganizer.png” >}})

Persistent Memory
=================

The changes that you make to a table’s view by filtering, sorting and
paging through it, are automatically saved as part of the page’s URL.
For each unique set of table adjustments, a unique URL is created to
match it. When you load the page, those preferences are automatically
loaded from the page’s URL, adjusting the table’s view to the
preferences you created. This functionality enables you to refresh or
bookmark the page, or send the page’s URL as a link to a colleague,
without having to reset your preferences when reloading the page.

.. note::
    :class: summary

    The ``table view`` is the set of filtering,    sorting and paging preferences applied to the table. The data for a
    specific view is dynamic and is not considered part of the view’s
    preferences. For example sorting by timestamp descending is the default
    view that loads when routing to logs & events page. However, at
    different points in time there could be different data for the same view

.. |pagination| image:: #pagination

