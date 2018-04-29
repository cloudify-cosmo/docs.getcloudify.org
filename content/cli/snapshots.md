---
layout: bt_wiki
title: snapshots
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 190
---

The `cfy snapshots` command is used to manage data snapshots of Cloudify manager. You must have `admin` credentials to create and restore snapshots.

You can use the command to create, upload, download, delete and list snapshots and also to restore a Manager using a snapshot archive.

For more about working with snapshots, go to: [snapshots]({{< relref "working_with/manager/snapshots.md" >}}).

#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.


## Commands

### create

#### Usage 
`cfy snapshots create [OPTIONS] [SNAPSHOT_ID]`

Create a snapshot on Cloudify Manager.

The snapshot will contain the relevant data to restore a Cloudify Manager to its
previous state.

`SNAPSHOT_ID` is the ID to attach to the snapshot.

#### Optional flags

* `--include-metrics` - Include metrics data in the snapshot
* `--exclude-credentials` - Exclude credentials from the snapshot
* `--exclude-logs` - Exclude logs from the snapshot
* `--exclude-events` - Exclude events from the snapshot
*  `-t, --tenant-name TEXT` - The name of the tenant of the snapshot. If unspecified, the current tenant is used.


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

Delete a snapshot from Cloudify Manager.

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

Download a snapshot from Cloudify Manager.

`SNAPSHOT_ID` is the ID of the snapshot to download.

#### Optional flags

* `-o, --output-path TEXT` - The local path to download to
* `-t, --tenant-name TEXT` -  The name of the tenant of the snapshot. If unspecified, the current tenant is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy snapshots download snapshot_XLHCNV
,,,

Downloading snapshot snapshot_XLHCNV...
 snapshot_XLHCNV |#####################################################| 100.0%
Snapshot downloaded as snapshot_XLHCNV.zip

...
{{< /highlight >}}


### list

#### Usage 
`cfy snapshots list [OPTIONS]`

List all snapshots on Cloudify Manager.

#### Optional flags

* `--sort-by TEXT` - Key for sorting the list.
* `--descending` - Sort list in descending order. [default: False]
* `-t, --tenant-name TEXT` -  The name of the tenant from which to list node-instance. If unspecified, the current tenant is
                            used. This argument cannot be used simultaneously with the `all-tenants` argument.
* `-a, --all-tenants` -    Include resources from all tenants associated with
                            the user. This argument cannot be used simultaneously with the `tenant-name` argument.  


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy snapshots list
...

Listing snapshots...

Snapshots:
+-----------------+--------------------------+---------+-------+------------+----------------+------------+
|        id       |        created_at        |  status | error | permission |  tenant_name   | created_by |
+-----------------+--------------------------+---------+-------+------------+----------------+------------+
| snapshot_XLHCNV | 2017-04-04 09:33:39.315  | created |       |  creator   | default_tenant |   admin    |
+-----------------+--------------------------+---------+-------+------------+----------------+------------+
{{< /highlight >}}




### restore

#### Usage 
`cfy snapshots restore [OPTIONS] SNAPSHOT_ID`

Restore Cloudify Manager to its previous state, or migrate a version 3.x snapshot to a tenant on Cloudify Manager 4.x (i.e migration).

`SNAPSHOT_ID` is the ID of the snapshot to use for restoration.archive<br>


#### Optional flags

* `--without-deployments-envs` - 
						Restore without recreating the currently existing
                        deployments
* `-f, --force` - 		Force restoring the snapshot on a Manager with 
						existing blueprints or deployments
* ` -t, --tenant-name TEXT` - The name of the tenant into which the snapshot
                             is to be restored. **Important:** This option is
                             **required** when restoring snapshots from Cloudify Manager instances
                             of versions prior to 4.0.0. If passed when
                             restoring newer snapshots, an error is returned.
                             
* ` --restore-certificates` -  Restore the certificates from the snapshot, using 
                              them to replace the current Manager certificates.
                              If the certificates' metadata (I.E: the Manager
                              IP address) from the snapshot does not match the
                              Manager metadata, the certificates cannot work on this Manager and
                              will not be restored. In the event that the certificates have been 
                              restored, the Manager will be automatically rebooted at the end of
                              the execution. To avoid automatic reboot, use the flag `--no-reboot`
                              (not recommended).


* ` --no-reboot` - Do not perform an automatic reboot to the Manager
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

Upload a snapshot to Cloudify Manager.

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
