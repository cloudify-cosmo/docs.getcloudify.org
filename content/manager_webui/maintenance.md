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

During the maintenance mode activation process, Cloudify Manager waits for all running executions to finish. During this time, you can see all running executions and cancel them manually, if necessary.<br/>
![remaining executions]({{< img "ui/maintenance/ui-maintenance-remaining-executions.png" >}})

When Maintenance mode is active, all pages in the user interface display the message *Server is in maintenance mode, some actions will not be available*.<br/>

To exit Maintenance mode, click **Maintenance Mode** in the dropdown menu adjacent to your user name and click **Yes** when you are prompted to confirm that you want to exit Maintenance mode.
