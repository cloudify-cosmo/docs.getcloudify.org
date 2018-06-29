---
layout: bt_wiki
title: Admin Operations Page
category: Manager
draft: false
abstract:
weight: 145
aliases: ["/manager_webui/maintenance/", "/working_with/console/maintenance/"] 
---


## Maintenance Mode

If you are an `admin` user, you can access Maintenance mode by clicking the relevant option in the dropdown menu adjacent to your user name. 

In order for Maintenance mode to be activated, all running workflows must be stopped. 

* To enter Maintenance mode, click **Yes** in the *Are you sure you want to enter maintenance mode?* dialog.

During the maintenance mode activation process, Cloudify Manager waits for all running executions to finish. During this time, you can see all running executions and cancel them manually, if necessary.<br/>
![remaining executions]( /images/ui/maintenance/ui-maintenance-remaining-executions.png )

When Maintenance mode is active, all pages in the user interface display the message *Server is in maintenance mode, some actions will not be available*.<br/>

To exit Maintenance mode, click **Maintenance Mode** in the dropdown menu adjacent to your user name and click **Yes** when you are prompted to confirm that you want to exit Maintenance mode.


## Cluster Management


## Snapshots

The Snapshots table provides a list of all snapshots that have been uploaded or created. The Snapshots table is only available if you have `admin` credentials.

The snapshots creation process captures data in the entire Cloudify Manager, not just that of a specific tenant. However, the snapshot is created in the context of the current tenant, and therefore must be restored from it.
Snapshots are created as a private resource by default and it cannot change.


### Creating a Snapshot

1. Click **Create** above the Snapshots table.
2. Specify a unique ID for the snapshot and click **Create**.   
   It is good practice to use a name that will help you to easily identify the snapshot later.

   The creation process begins. If there are active executions when you attempt to create the snapshot, the process waits until the executions are complete before creating the snapshot. You can see the status of executions in the Deployment executions widget.

The snapshot is saved as a ZIP file and appears in the Snapshots table, together with details of its creator, creation date and time, and current status.


### Restoring a Snapshot

If you are restoring a snapshot from a Cloudify Manager instance prior to version 4.0, refer to the [Restoring Snapshots of Legacy Cloudify Manager Instances]({{< relref "working_with/console/system-resources-page.md" >}}#restoring-snapshots-of-legacy-cloudify-manager-instances) section below.

If you restore a snapshot to a Cloudify Manager instance that already contains data, that data is overwritten. To prevent inadvertent overwriting of existing data, you must explicity state that you want to force data overwrite.

1. Click **Upload** in the Snapshots widget.
2. Either enter the URL of the snapshot or select the snapshot file from your file repository.
3. Enter the Snapshot ID.
4. Click **Upload**.<br>
5. To restore a snapshot from a tenant-less (legacy) environment, toggle the relevant button.   

   * If your snapshot is from a Cloudify Manager instance that was created earlier than version 4.0, see [Restoring Snapshots of Legacy Cloudify Manager Instances]({{< relref "working_with/console/system-resources-page.md" >}}#restoring-snapshots-of-legacy-cloudify-manager-instances).
   * To overwrite all content in the existing Cloudify Manager, toggle the relevant button.

6. The snapshot is restored and its details appear in the Snapshots table.

#### Restoring Snapshots of Legacy Cloudify Manager Instances

This subsection refers to the process for restoring snapshots of Cloudify Manager instances that were created prior to Cloudify Mananger 4.0.

If you are restoring a snapshot from an older, tenant-less (legacy) version of Cloudify to Cloudify Manager, it will be restored in a specific tenant that you must provide. The process enables you to migrate one or more legacy Cloudify Manager instances to a version 4.X instance, and to keep their resources separate.

To enable a snapshot to be successfully installed on a Manager, you must specify the name of a tenant. 
Depending on your requirements, the tenant may be prepared according to one of the following options. It is recommended that you select the first option, to ensure optimal performance of your plugins. 

* If the snapshot's resources use plugins as wagons, the tenant must be empty, as the restore process will install the wagons. 
  if the snapshot does not include the wagons, to work in this way from now on, install the wagons on the tenant before performing the restore. 
* if the snapshot's resources use plugin installation from source, to keep working in this manner, restore directly to a clean tenant. 


### Deleting a Snapshot

1.  In the Snapshots widget, click ![icon_trash_grey]( /images/ui/ui_icon_trash_grey.png ) for the snapshot entry that you want to delete.
2. Click **Yes** to delete the snapshot from Cloudify Manager.
