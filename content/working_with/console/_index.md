---
title: Using the Cloudify Console
description:
weight: 60
alwaysopen: false
aliases: /manager_webui/overview/
---

The {{< param cfy_console_name >}} provides a streamlined experience for managing and analyzing your applications. It requires a Cloudify Manager to run. 

In addition to being able to upload blueprints, create deployments and execute workflows, the interface provides log and events views, application and network topology visualization, and more. It provides most features available in the command-line interface and more.

{{% note title="Note" %}}
The view that you see depends on whether you log in as `admin` or `user`. Certain dashboard views, such as for snapshots, are only available to `admin` users. This section describes all the pages and functionality that are available to `admin` users.
{{% /note %}}

Cloudify Manager supports user management, so users must log in with user credentials. User credentials can be defined in Cloudify from an LDAP system, whether the LDAP system is integrated with Cloudify or derived from an external LDAP user management system.


### Pages

The user interface displays a predefined set of dashboard pages, each of which contains a set of widgets. Widgets are organized on a page to optimize the display of relevant data. The dashboard pages that you see depend on whether you have an `admin` or `user` role.

![Dashboard page]( /images/ui/ui-dashboard-page.png )

For more information about built-in pages and their content, see [Pages]({{< relref "working_with/console/pages/_index.md" >}}).


### Widgets

Widgets are the building blocks of the user interface framework. A catalog with out-of-the-box widgets is included with the interface that enables data to be presented in many different ways. The catalog includes widgets covering blueprints, deployments and execution views, plugins and snapshots lists, and so on. Also included is a topology widget and widgets that retrieve data from third-party applications such as GitHub. Where relevant, action buttons are provided to enable you to perform specific actions from within a widget. You can expand the widgets catalog to view in full screen mode. 

For more information about all built-in widgets, see [Widgets]({{< relref "working_with/console/widgets/_index.md" >}}).


### Customization

Layout of the application can be changed in white-label section in the [user configuration]({{< relref "working_with/console/customization/advanced-configuration.md" >}}). Set of pages and widgets can be organized differently using [Template Management]({{< relref "working_with/console/customization/templates-mgmt.md" >}}) feature. After all you can [develop your own widgets]({{< relref "developer/writing_widgets/_index.md" >}}) and add it to the pages.

For more information on how to customize the layout, see [Customization]({{< relref "working_with/console/customization/_index.md" >}}).

