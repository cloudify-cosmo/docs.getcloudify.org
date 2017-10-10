---
layout: bt_wiki
title: Cloudify Web Interface
category: Web Interface
draft: false
abstract: Cloudify Web Interface
weight: 100
---

The Cloudify Web interface provides a streamlined experience for managing and analyzing your applications.

In addition to being able to upload blueprints, create deployments and execute workflows, the interface provides metrics visualization, log and events views, application and network topology visualization, and more. To view a video about the functionalities of the Cloudify Manager user interface [click here](https://www.youtube.com/watch?v=0orOaJYi5vs).

The Cloudify Web interface is provided to Premium customers and requires a Cloudify Manager to run. It provides most features available in the command-line interface and more. 

{{% gsNote title="Note" %}}
The view that you see depends on whether you log in as `admin` or `user`. Certain dashboard views, such as for snapshots, are only available to `admin` users.<br>
This document describes all the pages and functionality that are avaiable to `admin` users.
{{% /gsNote %}}

Cloudify Manager supports user management, so users must log in with user credentials. User credentials can be defined in Cloudify from an LDAP system, whether the LDAP system is integrated with Cloudify or derived from an external LDAP user management system.

### Dashboard Pages
The user interface displays a predefined set of dashboard pages, each of which contains a set of widgets. Widgets are organized on a page to optimize the display of relevant data. The dashboard pages that you see depend on whether you have an `admin` or `user` role.

### Widgets
Widgets are the building blocks of the user interface framework. A catalog with out-of-the-box widgets is included with the interface that enables data to be presented in many different ways. The catalog includes widgets covering blueprints, deployments and execution views, plugins and snapshots lists, and so on. Also included is a topology widget and widgets that retrieve data from third-party applications such as Github. Where relevant, action buttons are provided to enable you to perform specific actions from within a widget. You can expand the widgets catalog to view in full screen mode. For more information about these widgets, see the [Default Widgets Reference]({{< relref "manager_webui/default-widgets.md" >}}).

### Edit Mode
Edit mode enables you to create new dashboard pages, add or remove widgets and manage how widgets are displayed on a dashboard. 

{{% gsNote title="Accessibility" %}}
If you have a `user` role, your ability to create dashboard pages and manage widgets depends on the configuration permissions that have been set by the administrator.
{{% /gsNote %}}

To enter Edit mode, click the dropdown arrow next to your user name and select **Edit Mode**. For more information about actions you can perform in edit mode, [click here]({{< relref "manager_webui/configure-display.md" >}}).

### Custom Widgets
In addition to the default widgets, you can create your own and add them to the widgets catalog. 



