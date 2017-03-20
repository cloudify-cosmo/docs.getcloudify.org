---
layout: bt_wiki
title: Plugins and Snapshots Page
category: Web Interface
draft: false
weight: 150
---

The appearance of this page depends on your permissions. Only an `admin` can view information about snapshots.

## Plugins

The Plugins table provides a list of all Plugins that have been uploaded to Cloudify Manager. For information about using default plugins or creating your own, [click here]({{< relref "plugins/overview.md" >}}).

### Uploading a Plugin

1. Click **Upload** above the Plugins table.
2. Either enter the URL of the plugin or select the plugin file from your file repository.
3. Click **Upload**.<br>
The plugin details appear in the Plugins table.

## Snapshots

The Snapshots table provides a list of all snapshots that have been uploaded to Cloudify Manager.<br>
The Snapshots table is only available if you have `admin` credentials.

### Creating a Snapshot

1. Click **Create** above the Snapshots table.
2. Specify a unique ID for the snapshot and click **Create**.   
   It is good practice to use a name that will help you to easily identify the snapshot later.

   The creation process begins. If there are active executions when you attempt to create the snapshot, the process waits until the executions are complete before creating the snapshot. You can see the status of executions in the Deployment executions widget.

The snapshot appears in the table, together with its creation date and time, and its current status.

When the snapshot has been created, it is saved as a ZIP file that contains the entire Cloudify Manager instance. 

### Restoring a Snapshot

If you restore a snapshot to a Cloudify Manager instance that already contains data, that data is overwritten. To prevent inadvertent overwriting of existing data, you must explicity state that you want to force data overwrite.

1. Click **Upload** in the Snapshots widget.
2. Either enter the URL of the snapshot or select the snapshot file from your file repository.
3. Enter the Snapshot ID.
4. Click **Upload**.<br>
5. If the snapshot is from a tenant-less environment, toggle on the relevant button.   
   * If your snapshot is from a Cloudify Manager that was created earlier than version 4.0, it is from a tenant-less environment.    

    {{% gsNote title="Migrating Cloudify Manager Instances Earlier than v.4.0" %}}

    To upgrade from Cloudify 3.x to Cloudify 4.x, you must migrate your Cloudify Manager. For more information, see the [Cloudify Manager 4.0 release notes](http://getcloudify.org/downloads/releasenotes/release-notes-4_0.html).
    
    {{% /gsNote %}}

   * If you want to overwrite all content in the existing Cloudify Manager, toggle on the relevant button.

6. The snapshot is restored and its details appear in the Snapshots table.

### Deleting a Snapshot

1.  In the Snapshots widget, click the List icon on the far right of the snapshot entry that you want to delete.
2. Click **Delete** to delete the snapshot from Cloudify Manager.