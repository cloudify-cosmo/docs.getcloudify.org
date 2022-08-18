---
title: Widgets
category: Widgets
draft: false
weight: 80
aliases: ["/manager_webui/default-widgets-ref/", "/working_with/console/default-widgets-ref"]

terminology_link: reference-terminology.html
execute_workflow_link: getting-started-execute-workflow.html
---

This section provides a description of all the widgets that are included by default in the {{< param cfy_manager_name >}} (out-of-the-box).

{{% note %}}
* Some of these widgets are presented in the initial page templates, and other can be added from the widgets catalog.
* Some widgets require additional configuration. In the event that configuration is mandatory, the mandatory requirements are included in the widget descriptions.
* Many widgets have non-mandatory configuration that enables you to customize them to your requirements.
* Some widgets are only available for `admin` users.
* Some widgets are only available for specific license editions.
* You can sort data in table-style widgets by clicking on a column header.
* Many widgets work only in a context of specific resource, most commonly in a context of specific blueprint or deployment.
  This resource context can be set in one of the following ways:
  * By placing the widget in the resource (blueprint or deployment) drill-down page, meaning the resource has been selected before entering the page, and its id is included in the page’s context.
  * By adding to the page a widget allowing to select resources, such as the [resources filter]({{< relref "working_with/console/widgets/filter.md" >}}).  

{{% /note %}}

For more details about adding widgets, placing them on a page and changing configuration, see [Edit Mode]({{< relref "working_with/console/customization/edit-mode.md" >}}) page.

The following widgets descriptions are listed in an alphabetical order, as they do in the widgets catalog:

{{%children style="h3" description="true"%}}
