---
layout: bt_wiki
title: Maintenance Mode
category: Manager
draft: false
abstract: Cloudify's Web Interface
weight: 200
---

The Maintenance Mode page is found in the settings section, where you may see and toggle the manager's maintenance mode.<br/>
![maintenance mode page]({{< img "ui/maintenance/ui-maintenance-mode-page.png" >}})


Pressing the button to change the maintenance mode status opens a confirmation dialog.<br/>
![confirmation dialog]({{< img "ui/maintenance/ui-maintenance-confirmation-dialog.png" >}})


On confirmation, the manager is trying to enter the requested mode and a message is shown to any user currently using the UI.<br/>
![starting maintenance message]({{< img "ui/maintenance/ui-starting-maintenance-message.png" >}})


Once Maintenance Mode is turned on, only the maintenance mode page is available.<br/>
![maintenance message]({{< img "ui/maintenance/ui-maintenance-message.png" >}})


When entering Maintenance Mode, the manager is waiting for all running executions to finish first.
During this time, you may view all running executions and even cancel them, if necessary.<br/>
![remaining executions]({{< img "ui/maintenance/ui-maintenance-remaining-executions.png" >}})