---
layout: bt_wiki
title: Labels
category: Widgets
draft: false
---

Displays the list of labels defined for the deployment which is currently in the context (see [notes]({{< relref "working_with/console/widgets/_index.md" >}}) for more information on resource context).
The table has 3 columns:

- **Key** - label key. All labels starting with `csys-` are reserved for internal usage and should not be used unless there is a need to override the default functionality. The system will prevent overdoing labels that can sacrifice consistency. List of reserved lables: csys-location-lat, csys-env-type, csys-environment, csys-obj-name, csys-location-name, csys-location-long, csys-wrcp-services, csys-obj-parent, csys-wrcp-group-id, csys-obj-type.
- **Value** - label value
- Actions column, containing value edit and label delete action icons, available only to users with `deployment_create` permission

![labels](/images/ui/widgets/labels.png)

By clicking buttons above the table you can execute the following operations:

- `Add` - opens the labels add modal, available only to users with `deployment_create` permission
- `Export` - export the table content into a JSON file

You can learn more about labels [here]({{< relref "cli/orch_cli/deployments.md#labels" >}}).

## Settings

- `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds
