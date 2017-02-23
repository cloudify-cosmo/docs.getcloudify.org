---
layout: bt_wiki
title: Maintenance Mode
category: Manager
draft: false
abstract: 
weight: 200
---

The Maintenance Mode page is accessed from on the Settings page. You can toggle between **Snapshots** and **Maintenance**. If Maintenace mode is deactivated, click **Turn on Maintenance Mode** to activate it, and click **Confirm** at the prompt.<br/>
![maintenance mode page]({{< img "ui/maintenance/ui-maintenance-mode-page.png" >}})

As Cloudify Manager begins to enter maintenance mode, a message is displayed to all users currently using the UI, as shown in the following diagram. Note the option to turn off maintenance mode, if required, from this message.<br/>
![starting maintenance message]({{< img "ui/maintenance/ui-starting-maintenance-message.png" >}})

During the maintenance mode activation process, Cloudify Manager waits for all running executions to finish before completing the activation. During this time, you can see all running executions and cancel them, if necessary.<br/>
![remaining executions]({{< img "ui/maintenance/ui-maintenance-remaining-executions.png" >}})

When maintenance mode is active, it is the only page that is available in the user interface.<br/>
![maintenance message]({{< img "ui/maintenance/ui-maintenance-message.png" >}})

To exit maintenance mode, click **Turn off Maintenance Mode**.
