---
title: Using the Console
description:
weight: 60
alwaysopen: false
aliases: /manager_webui/overview/
---

The {{< param cfy_console_name >}} provides a streamlined experience for managing and analyzing your applications. It requires a {{< param cfy_manager_name >}} to run.

In addition to being able to upload blueprints, create deployments and execute workflows, the interface provides log and events views, application and network topology visualization, and more. It provides most features available in the command-line interface and more.


## Getting Started

{{< param cfy_manager_name >}} supports user management, so users must log in with user credentials. User credentials can be defined in {{< param product_name >}} from an LDAP system, whether the LDAP system is integrated with {{< param product_name >}} or derived from an external LDAP user management system.

![Login page]( /images/ui/pages/login-page.png )

See [Getting Started]({{< relref "working_with/console/getting-started/_index.md" >}}) section to get basic information on how to start working with {{< param cfy_console_name >}}.


## Pages

The user interface displays a predefined set of dashboard pages, each of which contains a set of widgets. The widgets are organized on each page to optimize the display of that page's relevant data. The dashboard pages that you see depend on the user role you have.

Example of a built-in {{< param product_name >}} page:

![Dashboard page]( /images/ui/pages/dashboard-page.png )

For more information about built-in pages and their content, see [Pages]({{< relref "working_with/console/pages/_index.md" >}}).


## Widgets

Widgets are the building blocks of the user interface framework. 
A catalog with out-of-the-box widgets is included 
with the interface that enables data to be presented in many different ways. 
The catalog includes widgets covering blueprints, deployments and execution views, 
plugins and snapshots lists, and so on. 
Also included is a topology widget and widgets that retrieve data from third-party applications such as GitHub. 
Where relevant, action buttons are provided to enable you to perform specific actions from within a widget. 
You can expand a widget to view in full screen mode.

Example of a built-in {{< param product_name >}} widget:

![User Management widget]( /images/ui/widgets/users-mgmt.png )

For more information about all built-in widgets, see [Widgets]({{< relref "working_with/console/widgets/_index.md" >}}).


## Customization

The layout of the application can be changed in white-label section in the [User Configuration]({{< relref "working_with/console/customization/user-configuration.md" >}}). Set of pages and widgets can be organized differently using [Template Management]({{< relref "working_with/console/customization/templates-mgmt.md" >}}) feature. Finally you can [develop your own widgets]({{< relref "developer/writing_widgets/_index.md" >}}) and add them to the pages.

Example of a customized layout:

![Custom layout]( /images/ui/customization/custom-layout.png )

For more information on how to customize the layout, see [Customization]({{< relref "working_with/console/customization/_index.md" >}}).
