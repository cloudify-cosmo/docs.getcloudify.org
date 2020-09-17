---
title: Customization
description:
weight: 100
alwaysopen: false
---

Customization of {{< param cfy_console_name >}} can be done on different levels:

1. **Widget level** - you can change look'n'feel and behavior of the specific widgets by changing the widget configuration
1. **Page level** - you can change pages content by modifying (adding, removing, resizing, reordering) widgets on the page
1. **Template level** - you can change set of pages by modifying (adding, removing, changing title and description) each page  
1. **Layout level** - you can change the style (colors, fonts, etc.) of the whole application 


## Customizing content

This section describes how to customize {{< param cfy_console_name >}} on 3 different levels: widget, page and template.
There are basically two different methods to do that. Depending on your user permissions and if you want the changes to be applied for the other users as well (not only you), you can take one of the approaches:

1. **User-level change** - changes will be applied only for your user
1. **System-level change** - changes will be applied on the whole application

### User-level change 

To modify widgets and pages on your own, without affecting other users, you can use [Edit Mode]({{< relref "working_with/console/customization/edit-mode.md" >}}).


### System-level change 

To make similar changes, but apply it to other users, you need to use [Templates Management]({{< relref "working_with/console/customization/templates-mgmt.md" >}}) feature.


## Customizing layout

You can change layout of the {{< param cfy_console_name >}} by changing [User Configuration]({{< relref "working_with/console/customization/user-configuration.md" >}}) file. 


## Adding custom widgets

In addition to the default widgets, you can create your own and add them to the widgets catalog. See [Writing Widgets]({{< relref "developer/writing_widgets/_index.md" >}}) for details.
