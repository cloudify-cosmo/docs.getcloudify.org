---
layout: bt_wiki
title: Labels
category: Widgets
draft: false
---

Displays list of labels defined for deployment currently in the context (see [notes]({{< relref "working_with/console/widgets/_.index.md" >}}) for more information on resource context).
The table has 3 columns:

* **Key** - label key
* **Value** - label value
* Actions column, containing value edit and label delete action icons, available only to users with `deployment_create` permission

![labels]( /images/ui/widgets/labels.png )

By clicking buttons above the table you can execute the following operations:

* `Add` - opens labels add modal, available only to users with `deployment_create` permission
* `Export` - exports table content into JSON file

You can find more about labels [here]({{< relref "cli/orch_cli/deployments.md#labels" >}}).

## Settings

None