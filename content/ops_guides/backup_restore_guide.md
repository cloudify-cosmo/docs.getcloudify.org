---
title: Cloudify Backup and Restore Guide
category: Operations Guides
draft: false
weight: 100
---

{{%children style="h3" description="true"%}}

## Overview

Snapshots provide a way for backing up the state of Cloudify HA cluster.  A cloudify snapshot should be done on a daily basis (suggest in an off peak time) and can be automated using the REST API as an alternative to an operator manually running the snapshot as shown here in this user guide.

Backing up the virtual machine that the cloudify managers run on should be done at regular intervals, this would be dictated by a backup policies and would likely involve daily, weekly, monthly and yearly backups as required.  The method for backing up the Cloudify Manager virtual machines falls outside the scope of this document.

## Snapshots

Snapshots of the Cloudify HA cluster should be taken at regular intervals (suggest daily), this can be automated through the REST based Service API or can be done manually by an operator using the UI or CFY CLI.  The screenshot below shows the menu presented to the operator when the settings button (i.e. cog icon on the right top of the menu) is clicked.

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

    Parameters specification available in the [Cloudify API documentation](http://docs.cloudify.co/api/latest/#create-snapshot).

1. Download snapshot:

    **CLI**

    ```
    cfy snapshots download [OPTIONS] SNAPSHOT_ID
    ```

    **REST**


    ```
    curl -X GET --header "Tenant: <manager-tenant>" -u <manager-username>:<manager-password> "http://<manager-ip>/api/v3.1/snapshots/<snapshot-id>/archive" > <snapshot-archive-filename>.zip
    ```


    Parameters specification available in the [Cloudify API documentation](http://docs.cloudify.co/api/latest/#download-snapshot).

### Applying snapshot

{{% note %}}
When restoring a manager in a cluster mode, either as part of a backup restore process or as part of an upgrade process, the encoding alphabet must first be restored.
This step must take place before the cluster is created and before the snapshot restore flow.

1. Copy the **encoding_alphabet** value from the original (source) manager at /opt/manager/rest-security.conf.
1. On the new manager (target), insert the copied string as the value of **encoding_alphabet** key under **flask_security** at **/etc/cloudify/config.yaml** file.
1. Connect the manager to the database and to the queue by editing **cluster** key under **postgresql_server** and **cluster_members** key under **rabbitmq** at **/etc/cloudify/config.yaml** file.
1. Install the first manager node of the new (target) manager cluster.
1. Continue the cluster installation flow by adding more managers, and follow the process of snapshot restore
{{% /note %}}

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

    Parameters specification available in the [Cloudify API documentation](http://docs.cloudify.co/api/latest/#upload-snapshot).

1. Switch the Cloudify manager to [maintenance mode](https://docs.cloudify.co/latest/working_with/manager/maintenance-mode/)

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
    -d '{"tenant_name": "<manager-tenant>", "recreate_deployments_envs": true, "force": false, "restore_certificates": false, "no_reboot": false}' \
    "http://<manager-ip>/api/v3.1/snapshots/<snapshot-id>/restore"
    ```

    Parameters specification available in the [Cloudify API documentation](http://docs.cloudify.co/api/latest/#restore-snapshot).

1. Snapshot-restore status

    **(Supported for Cloudify Manager 5.0.5 and above.)**

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

**If the restore is done as part of Upgrade to a newer Cloudify Manager version, consider performing also:**

1. Execute [install_new_agents workflow]({{< relref "working_with/workflows/built-in-workflows.md#the-install-new-agents-workflow" >}}) on the new Cloudify Manager so that all hosts agents are updated and connected to RabbitMQ on the new Cloudify Manager.

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

Parameters specification available in the [Cloudify API documentation](http://docs.cloudify.co/api/latest/#the-plugins-update-resource).


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
