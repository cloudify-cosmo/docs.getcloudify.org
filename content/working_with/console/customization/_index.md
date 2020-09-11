---
title: Customization
description:
weight: 100
alwaysopen: false
---


### Edit Mode
Edit mode enables you to create new dashboard pages, add or remove widgets and manage how widgets are displayed on a dashboard.

{{% note title="Accessibility" %}}
If you have a `user` role, your ability to create dashboard pages and manage widgets depends on the configuration permissions that have been set by the administrator.
{{% /note %}}

To enter Edit mode, click the dropdown arrow next to your user name and select **Edit Mode**. For more information about actions you can perform in edit mode, [click here]({{< relref "working_with/console/customization/configure-display.md" >}}).

### Custom Widgets
In addition to the default widgets, you can [create your own]({{< relref "developer/writing_widgets/_index.md" >}}) and add them to the widgets catalog.

### UI templates
The UI templates are the sets of pages presented to the users upon logging into the {{< param cfy_console_name >}}. In `Premium` version, admins can define custom templates and assign them with specific tenants and specific user-roles. For example, they can define a special template for managers of a specific tenant. As the `Community` version does not support multiple users or multiple tenants, it also does not support the ability to define custom templates. In this version, when a user first logs in into {{< param cfy_console_name >}}, he is presented with the `Community` version default layout. Pages currently available by default in `Community` version are as follows:

- Dashboard
- Cloudify Catalog
- Local Blueprints
- Deployments
- System Resources
