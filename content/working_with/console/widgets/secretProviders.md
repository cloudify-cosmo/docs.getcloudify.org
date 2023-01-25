---
title: Secret Providers Management
category: Widgets
draft: false
---

Displays all the secret providers visible to the logged-in user in the current tenant (including global secrets). 

![secret-providers]( /images/ui/widgets/secret-providers.png )

The widget provides the following information:

* **Provider name** - The name of the secret provider.
* **Provider type** - The type of the secret provider.
* **Creation time**
* **Last update time**

The right column of the table allows permitted users to edit the secret provider’s values or delete it.

To better understand how secret providers work in {{< param product_name >}}, go to [Secret Store page]({{< relref "developer/blueprints/spec-secretstore.md" >}}) or [Using the Secret Store page]({{< relref "working_with/manager/using-secrets.md" >}}).

## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
