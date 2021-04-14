---
layout: bt_wiki
title: Filters
category: Widgets
draft: false
---

Displays the list of defined filters.
The table has 4 columns:

* **Filter name** - filter ID
* **Creator** - filter creator
* **Created** - filter creation date and time
* Actions column

![filters]( /images/ui/widgets/filters.png )

Actions column contains following action icons:
* **Edit filter** opening filter rules edit modal (see [defining filter rules]({{< relref "#defining-filter-rules" >}}) for details on rule specifying)
* **Clone filter** opening filter clone modal allowing for creating a possibly modified version of selected filter (see [defining filter rules]({{< relref "#defining-filter-rules" >}}) for details on rule specifying)
* **Delete filter** allowing for removal of selected filter (see note below)

{{% note %}}
Deleting filter which is used as a default filter in Deployments View widget is not possible.
When trying to delete such a filter a modal shows up describing where (on which page and in which widget) and by whom (by which user) the filter is used.
![filters delete]( /images/ui/widgets/filters-delete.png ) 
{{% /note %}}

Clicking the `Add` button above the table opens the filter add modal allowing for creation of a new filter by specifying filter ID and filter rules.

## Defining filter rules

Add, edit and clone operation modals share a common component for defining filter rules.

![filters rules]( /images/ui/widgets/filters-rules.png ) 

The component presents a list of rows, each representing a single filter rule. Each row contains three inputs:
* Rule type selection dropdown allowing for selecting if the given rule applies to labels or one of supported attributes (like blueprint, site name or creator)
* Rule operator dropdown. The set of available operators to choose from depends on the selected rule type.
* Value input (for attribute rules) or key/value input(s) (for label rules). 

At any given time it is possible to append a new rule to the list of already defined rules (by clicking `Add new rule` button) or to remove any rule by clicking the trash icon in the corresponding rule row (unless there is only single rule defined).

You can learn more about filters and filter rules [here]({{< relref "cli/orch_cli/filter-rules.md" >}}).

## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds
