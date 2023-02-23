---
title: snapshots
description: The `cfy snapshots` command is used to manage data snapshots of the Manager. You must have `admin` credentials to create and restore snapshots.
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/snapshots/
---

The `cfy snapshots` command is used to manage data snapshots of the {{< param cfy_manager_name >}}. You must have `admin` credentials to create and restore snapshots.

You can use the command to create, upload, download, delete and list snapshots and also to restore a Manager using a snapshot archive.

For more about working with snapshots, go to: [snapshots]({{< relref "working_with/manager/snapshots.md" >}}).


#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### create

#### Usage
`cfy snapshots create [OPTIONS] [SNAPSHOT_ID]`

Create a snapshot of the {{< param cfy_manager_name >}}.

The snapshot will contain the relevant data to restore the {{< param cfy_manager_name >}} to its
previous state or upgrade it to a newer version.

`SNAPSHOT_ID` is the ID to attach to the snapshot.

#### Optional flags

* `--exclude-credentials` - Exclude {{< param product_name >}} agent key files (specified in the blueprint agent_config) from the snapshot
* `--exclude-logs` - Exclude logs from the snapshot
* `--exclude-events` - Exclude events from the snapshot
* `--queue` - If set, snapshot-creation-workflows that can't currently
            run will be queued and run automatically when possible




&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy snapshots create
...

Creating snapshot snapshot_XLHCNV...
Started workflow execution. The execution's id is 2219928b-69fd-49f1-8982-c42da5f82a63

...
{{< /highlight >}}

### delete

#### Usage
`cfy snapshots delete [OPTIONS] SNAPSHOT_ID`

Delete a snapshot from the {{< param cfy_manager_name >}}.

`SNAPSHOT_ID` is the ID of the snapshot to delete.

#### Optional flags

* ` -t, --tenant-name TEXT` -  The name of the tenant of the snapshot. If unspecified, the current tenant is used.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy snapshots delete snapshot_XLHCNV
...

Deleting snapshot snapshot_XLHCNV...
Snapshot deleted successfully

...
{{< /highlight >}}

### download

#### Usage
`cfy snapshots download [OPTIONS] SNAPSHOT_ID`

Download a snapshot from the {{< param cfy_manager_name >}}.

`SNAPSHOT_ID` is the ID of the snapshot to download.

#### Optional flags

* `-o, --output-path TEXT` - The local path to download to
* `-t, --tenant-name TEXT` -  The name of the tenant of the snapshot. If unspecified, the current tenant is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy snapshots download snapshot_XLHCNV
...

Downloading snapshot snapshot_XLHCNV...
 snapshot_XLHCNV |#####################################################| 100.0%
Snapshot downloaded as snapshot_XLHCNV.zip

...
{{< /highlight >}}


### list

#### Usage
`cfy snapshots list [OPTIONS]`

List all saved snapshots.

#### Optional flags

* `--sort-by TEXT` - Key for sorting the list.
* `--descending` - Sort list in descending order. [default: False]
* `-t, --tenant-name TEXT` - The name of the tenant from which to list node-instance. If unspecified, the current tenant is
                             used. This argument cannot be used simultaneously with the `all-tenants` argument.
* `-a, --all-tenants` - Include resources from all tenants associated with
                        the user. This argument cannot be used simultaneously with the `tenant-name` argument.
*  `--search TEXT` - Search snapshots by id. The returned list will include only snapshots that contain the given search pattern.
*  `-o, --pagination-offset INTEGER` - The number of resources to skip; --pagination-offset=1 skips the first resource [default: 0]
*  `-s, --pagination-size INTEGER` - The max number of results to retrieve per page [default: 1000]


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy snapshots list
...

Listing snapshots...

Snapshots:
+-----------------+--------------------------+---------+-------+------------+----------------+------------+
|        id       |        created_at        |  status | error | visibility |  tenant_name   | created_by |
+-----------------+--------------------------+---------+-------+------------+----------------+------------+
| snapshot_XLHCNV | 2017-04-04 09:33:39.315  | created |       |  tenant    | default_tenant |   admin    |
+-----------------+--------------------------+---------+-------+------------+----------------+------------+

Showing 1 of 1 snapshots

{{< /highlight >}}



### restore

#### Usage
`cfy snapshots restore [OPTIONS] SNAPSHOT_ID`

Restore the {{< param cfy_manager_name >}} to its previous state, or upgrade it to a newer version.

`SNAPSHOT_ID` is the ID of the snapshot to use for restoration<br>

More detailed description of a snapshot-restore procedure for scheduled executions is available at
[Backup and Restore Guide]({{< relref "cloudify_manager/premium/fully_distributed/backup_and_restore.md#special-case-restoring-scheduled-executions" >}}).


#### Optional flags

* `--without-deployments-envs` - Restore without recreating the currently existing deployments
* `-f, --force` - Force restoring the snapshot on a Manager with existing blueprints or deployments
* `--restore-certificates` - Restore the certificates from the snapshot, using
                             them to replace the current Manager certificates.
                             If the certificates' metadata (I.E: the Manager
                             IP address) from the snapshot does not match the
                             Manager metadata, the certificates cannot work on this Manager and
                             will not be restored. In the event that the certificates have been
                             restored, the Manager will be automatically rebooted at the end of
                             the execution. To avoid automatic reboot, use the flag `--no-reboot`
                             (not recommended).
* `--ignore-plugin-failure` - if set, plugin installation errors
                              during snapshot restore will only be
                              logged as warnings, and will not fail
                              the snapshot restore workflow
* `--no-reboot` - Do not perform an automatic reboot to the Manager
                  VM after restoring certificates a from snapshot
                  (not recommended). Only relevant if the
                  `--restore-certificates` flag was supplied


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy snapshots restore snapshot_CAMWZ5
...

Restoring snapshot snapshot_XLHCNV...
Started workflow execution. The execution's id is 53921762-2b72-430b-b6fe-d6f1faced8e1

...
{{< /highlight >}}


### upload

#### Usage
`cfy snapshots upload [OPTIONS] SNAPSHOT_PATH`

Upload a snapshot to the {{< param cfy_manager_name >}}.

`SNAPSHOT_PATH` is the path of the snapshot to upload.

#### Optional flags

* `-s, --snapshot-id TEXT` -
						The unique identifier for the snapshot
* `-t, --tenant-name TEXT` - The name of the tenant of the snapshot. If unspecified, the current tenant is used.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy snapshots upload snapshot_XLHCNV.zip
...

Uploading snapshot snapshot_XLHCNV.zip...
 snapshot_XLHCNV.zip |#################################################| 100.0%
Snapshot uploaded. The snapshot's id is snapshot_76E7LB

...
{{< /highlight >}}

### status

#### Usage
`cfy snapshots status`

return the status of the `restore_snapshot` workflow (whether or not it's in progress).


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy snapshots status
...

Retrieving snapshot restore status...
No `restore_snapshot` workflow currently running.

...
{{< /highlight >}}
