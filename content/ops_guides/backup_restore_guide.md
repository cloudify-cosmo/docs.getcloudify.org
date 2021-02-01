---
title: Cloudify Backup and Restore Guide
category: Operations Guides
draft: false
weight: 100
---
## Overview

Snapshots provide a way for backing up the state of the {{< param cfy_manager_name >}}.  A snapshot should be taken on a daily basis (suggest in an off peak time) and can be automated using the REST API as an alternative to an operator manually running the snapshot as shown here in this user guide.

Backing up the virtual machine that the {{< param cfy_manager_name >}}s run on should be done at regular intervals, this would be dictated by a backup policies and would likely involve daily, weekly, monthly and yearly backups as required.  The method for backing up the {{< param cfy_manager_name >}} virtual machines falls outside the scope of this document.

## Snapshots

Snapshots of the HA {{< param cfy_manager_name >}} cluster should be taken at regular intervals (suggest daily), this can be automated through the REST based Service API or can be done manually by an operator using the UI or CFY CLI.  The screenshot below shows the menu presented to the operator when the settings button (i.e. cog icon on the right top of the menu) is clicked.

### Creating snapshot

1. Create snapshot:

    **CLI**

    ```
    cfy snapshots create SNAPSHOT_ID
    ```

    **REST**

    ```
    curl -X PUT --header "Tenant: <manager-tenant>" -u <manager-username>:<manager-password> "http://<manager-ip>/api/v3.1/snapshots/<snapshot-id>"
    ```

    Parameters specification available in the [{{< param product_name >}} API documentation](http://docs.cloudify.co/api/latest/#create-snapshot).

1. Download snapshot:

    **CLI**

    ```
    cfy snapshots download [OPTIONS] SNAPSHOT_ID
    ```

    **REST**


    ```
    curl -X GET --header "Tenant: <manager-tenant>" -u <manager-username>:<manager-password> "http://<manager-ip>/api/v3.1/snapshots/<snapshot-id>/archive" > <snapshot-archive-filename>.zip
    ```


    Parameters specification available in the [{{< param product_name >}} API documentation](http://docs.cloudify.co/api/latest/#download-snapshot).

### Applying snapshot



1. Upload snapshot

    **CLI**

    ```
    cfy snapshots upload [OPTIONS] SNAPSHOT_PATH
    ```

    **REST**
    ```
    curl -X PUT \
    --header "Tenant: <manager-tenant>" \
    -u <manager-username>:<manager-password> \
    "http://<manager-ip>/api/v3.1/snapshots/archive?snapshot_archive_url=http://url/to/archive.zip"
    ```

    Parameters specification available in the [{{< param product_name >}} API documentation](http://docs.cloudify.co/api/latest/#upload-snapshot).

1. Switch the {{< param cfy_manager_name >}} to [maintenance mode]({{< relref "/working_with/manager/maintenance-mode.md" >}})

    **CLI**

    ```
    cfy maintenance-mode activate
    ```

    Verify that the system has entered maintenance mode before moving on to the next step, using:
    
    **CLI**

    ```
    cfy maintenance-mode status
    ```  


1. Restore snapshot

    **CLI**

    ```
    cfy snapshots restore [OPTIONS] —tenant-name <TEXT> SNAPSHOT_ID
    ```

    **REST**

    ```
    curl -s -X POST \
    --header "Content-Type: application/json" \
    --header "Tenant: <manager-tenant>" \
    -u <manager-username>:<manager-password> \
    -d '{"tenant_name": "<manager-tenant>", "recreate_deployments_envs": true, "force": false, "restore_certificates": false, "no_reboot": false}' \
    "http://<manager-ip>/api/v3.1/snapshots/<snapshot-id>/restore"
    ```

    Parameters specification available in the [{{< param product_name >}} API documentation](http://docs.cloudify.co/api/latest/#restore-snapshot).

1. Snapshot-restore status

    Check the status of the `restore_snapshot` workflow by using the `cfy snapshots status` command.

    **CLI**

    ```
    cfy snapshots status
    ```

    **REST**


    ```
    curl -X GET "http://<manager-ip>/api/v3.1/snapshot-status"
    ```


    There are two possible responses:
    1. {'status': 'Snapshot restore in progress...\nThis may take a while, depending on the snapshot size.'}
    1. {'status': 'No `restore_snapshot` workflow currently running.'}  

    If the snapshot restore is done, you can deactivate the maintenance mode using `cfy maintenance-mode deactivate`, 
    and verify that everything was restored successfully.

1. Execute [install_new_agents workflow]({{< relref "working_with/workflows/built-in-workflows.md#the-install-new-agents-workflow" >}}) on the new {{< param cfy_manager_name >}} so that all hosts agents are updated and connected to RabbitMQ on the new {{< param cfy_manager_name >}}.
   This can also be done using the [`cfy agents install` command]({{< relref "cli/orch_cli/agents.md#install" >}}).

**If the restore is done as part of Upgrade to a newer {{< param cfy_manager_name >}} version, consider performing also:**

* Update plugins

This is done in order to update the deployments to use new plugins(when upgrading to py2py3 plugins wagons).

First, upload new plugins, then execute:

   **CLI**

```
   cfy plugins update [OPTIONS] BLUEPRINT_ID
```

   **REST**

    ```
    curl -X PUT \
    -H "Content-Type: application/json" \
    -H "Tenant: <manager-tenant>" \
    -u <manager-username>:<manager-password> \
    -d '{"force": "<force>"}' \
    "<manager-ip>/api/v3.1/plugins-updates/<blueprint-id>/update/initiate"
    ```

Parameters specification available in the [{{< param product_name >}} API documentation](http://docs.cloudify.co/api/latest/#the-plugins-update-resource).


#### Special case -- restoring scheduled executions

During a snapshot-restore procedure pending scheduled execution tasks are added to the message queue, overdue executions on the other hand are marked as failed.
For example assume following flow:

* at 01:00 user adds a scheduled workflow set to take place at 4:00
* at 02:00 user adds another scheduled workflow set to take place at 8:00
* at 03:00 the snapshot is taken
* at 06:00 the snapshot is restored

During snapshot-restore procedure the first workflow (scheduled for 4:00) is marked as `failed` as it is overdue at this moment.
Failure to reschedule overdue workflow is also logged (at `INFO` log level):

`Execution 7dbc1ae2-5a00-497e-9ebb-13942856834a scheduled for 2020-03-13T04:00:00.000Z is overdue. Marking as FAILED.`

The other workflow (scheduled for 8:00) is restored correctly (status `scheduled`) and added to the message queue.
At 8:00 the other workflow is executed.

**In case all the relevant steps above finished successfully, you can safely remove the old manager.**


## Failure Recovery

### Whole cluster down or working wrong

1.  Save /etc/cloudify/ssl/* files.
1.  Teardown managers.
1.  Install fresh managers with existing certificates in /etc/cloudify/config.yaml.
1.  Create and join cluster.
1.  Apply latest working version snapshot on active manager.

### One manager cluster node down

1.  Remove manager from the cluster.
1.  Destroy manager.
1.  Bootstrap fresh manager.
1.  Join existing cluster.

Effect: Healthy manager cluster

### Active manager node down

1.  Other healthy manager from the cluster automatically becomes active manager.
1.  Investigate error:
1. Either:
    * Fix problem
    * Destroy manager.
        1. Install manager.
        1. Join cluster.

Effect: Healthy manager cluster

## Split brain

Description: Situation happens when for a while there is no connectivity between managers. Then each of them thinks that other managers are unhealthy and become master. After connectivity is back master becomes only one in cluster. It's chosen based on the newest version of PostgreSQL database. All data from other managers will be synced with the active one and others will become standbys. All data/installed deployments/plugins will get lost.
