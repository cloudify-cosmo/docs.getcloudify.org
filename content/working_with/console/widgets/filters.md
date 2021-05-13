
---
layout: bt_wiki
title: Filters
category: Widgets
draft: false
---

Displays the list of defined filters.
The table has 5 columns:

* **Filter name** - filter ID
* **Creator** - filter creator
* **Created** - filter creation date and time
* **System** - system filter indicator - checked when given filter is a system filter, unchecked otherwise
* Actions column

![filters]( /images/ui/widgets/filters.png )

The actions column contains the following action icons:

* **Clone filter** opens the **filter clone** modal allowing to create a modified copy of the selected filter (see [defining filter rules]({{< relref "#defining-filter-rules" >}}) for details on rule definition)
* **Edit filter** available only to `user` filters, opens the **filter rules edit** modal (see [defining filter rules]({{< relref "#defining-filter-rules" >}}) for details on rule definition)
* **Delete filter** available only to non-`system` filters, removes the selected filter (see note below)

Filters used as a default filter in the Deployments View widget cannot be deleted.
When trying to delete such a filter a modal shows up describing where (on which page and in which widget) and by whom (by which user) the filter is used.

![filters delete]( /images/ui/widgets/filters-delete.png ) 


Clicking the `Add` button above the table opens the filter add modal allowing to create a new filter by specifying filter ID and filter rules.

## Defining filter rules

Add, edit and clone operation modals share a common component for defining filter rules.

![filters rules]( /images/ui/widgets/filters-rules.png ) 

The component presents a list of rows, each representing a single filter rule. Each row contains three inputs:

* Rule type selection dropdown - selecting the context of the rule which can be based on labels or supported deployment attributes such as blueprint ID, site name, or creator.
* Rule operator dropdown. The set of available operators to choose from depends on the selected rule type. See Table 1. and Table 2. below for details.
* Value input (for attribute rules) or key/value input(s) (for label rules). 

| Operator label in the UI       | Operator name in the API/CLI        |
|:------------------------------:|:-----------------------------------:|
| is one of                      | `any_of`                            |
| is not one of                  | `not_any_of`                        |
| is not one of (or no such key) | `is_not`                            |
| key is not                     | `is_null`                           |
| key is                         | `is_not_null`                       |
**Table 1**. Labels operators

| Operator label in the UI  | Operator name in the API/CLI        |
|:-------------------------:|:-----------------------------------:|
|   is one of               | `any_of`                            |
|   is not one of           | `not_any_of`                        |
|   contains                | `contains`                          |
|   does not contain        | `not_contains`                      |
|   starts with             | `starts_with`                       |
|   ends with               | `ends_with`                         |
**Table 2**. Attributes (Blueprint, Site name, Creator) operators mapping

At any given time it is possible to append a new rule to the list of already defined rules (by clicking `Add new rule` button) or to remove any rule by clicking the trash icon in the corresponding rule row (unless there is only single rule defined).

You can learn more about filters and filter rules [here]({{< relref "cli/orch_cli/filter-rules.md" >}}).

## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds
