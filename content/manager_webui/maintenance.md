---
layout: bt_wiki
title: Maintenance Mode
category: Manager
draft: false
abstract: 
weight: 200
---

If you are an `admin` user, you can access Maintenance mode by clicking the relevant option in the dropdown menu adjacent to your user name. 

In order for Maintenance mode to be activated, all running workflows must be stopped. 

* To enter Maintenance mode, click **Yes** in the *Are you sure you want to enter maintenance mode?* dialog.

A message is displayed to all users currently using the UI, as shown in the following diagram. In the event that a workflow must continue running, a user has the option of turning off maintenance mode directly from the message.<br/>
![starting maintenance message]({{< img "ui/maintenance/ui-starting-maintenance-message.png" >}})

During the maintenance mode activation process, Cloudify Manager waits for all running executions to finish. During this time, you can see all running executions and cancel them, if necessary.<br/>
![remaining executions]({{< img "ui/maintenance/ui-maintenance-remaining-executions.png" >}})

When Maintenance mode is active, it is the only page that is available in the user interface.<br/>
![maintenance message]({{< img "ui/maintenance/ui-maintenance-message.png" >}})

To exit Maintenance mode, toggle off **Maintenance Mode** in the dropdown menu adjacent to your user name.
