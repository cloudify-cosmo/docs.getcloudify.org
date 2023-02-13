+++
title = "Backup and Restore"
description = "Backup and Restore"
weight = 30
alwaysopen = false
+++

## Overview

Snapshots provide a way for backing up the state of the {{< param cfy_manager_name >}}.  A snapshot should be taken on a daily basis (suggest in an off-peak time) and can be automated using the REST API as an alternative to an operator manually running the snapshot as shown here in this user guide.

Backing up the virtual machine that the {{< param cfy_manager_name >}} runs on should be done at regular intervals, this would be dictated by a backup policy and would likely involve daily, weekly, monthly, and yearly backups as required.  The method for backing up the {{< param cfy_manager_name >}} virtual machines falls outside the scope of this document.

## Snapshots

Snapshots of the HA {{< param cfy_manager_name >}} cluster should be taken at regular intervals (suggest daily), this can be automated through the REST-based Service API or can be done manually by an operator using the UI or CFY CLI.  The screenshot below shows the menu presented to the operator when the settings button (i.e. cog icon on the right top of the menu) is clicked.

### Creating Snapshot

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

### Applying Snapshot



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

    Verify that the system has entered maintenance mode before moving on to the next step.


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
    -d '{"tenant_name": "<manager-tenant>", "force": false, "restore_certificates": false, "no_reboot": false}' \
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

**If the Restore is done as part of the upgrade to a newer {{< param cfy_manager_name >}} version, consider performing also:**

1. Execute [install_new_agents workflow]({{< relref "working_with/workflows/built-in-workflows.md#the-install-new-agents-workflow" >}}) on the new {{< param cfy_manager_name >}} so that all hosts agents are updated and connected to RabbitMQ on the new {{< param cfy_manager_name >}}.

1. Update plugins

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


#### Special Case - Restoring Scheduled Executions {#special-case-restoring-scheduled-executions}

During a snapshot restore procedure pending scheduled execution tasks are added to the message queue, overdue executions on the other hand are marked as failed.
For example assume the following flow:

* at 01:00 user adds a scheduled workflow set to take place at 4:00
* at 02:00 user adds another scheduled workflow set to take place at 8:00
* at 03:00 the snapshot is taken
* at 06:00 the snapshot is restored

During snapshot-restore procedure the first workflow (scheduled for 4:00) is marked as `failed` as it is overdue at this moment.
Failure to reschedule overdue workflow is also logged (at `INFO` log level):

`Execution 7dbc1ae2-5a00-497e-9ebb-13942856834a scheduled for 2020-03-13T04:00:00.000Z is overdue. Marking as FAILED.`

The other workflow (scheduled for 8:00) is restored correctly (status `scheduled`) and added to the message queue.
At 8:00 the other workflow is executed.
