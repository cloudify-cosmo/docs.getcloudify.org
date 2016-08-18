---
layout: bt_wiki
title: snapshots
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 190
---

The `cfy snapshots` command is used to manage data snapshots of a Cloudify manager.

You can use the command to create, upload, download, delete and list snapshots and also to restore a manager using a snapshot archive.

See [snapshots]({{< relref "manager/snapshots.md" >}}) for more information.


## Commands

### create

Usage: `cfy snapshots create [OPTIONS] [SNAPSHOT_ID]`

Create a snapshot on the manager

The snapshot will contain the relevant data to restore a manager to its
previous state.

`SNAPSHOT_ID` is the id to attach to the snapshot.

#### Optional flags

* `--include-metrics` - Include metrics data in the snapshot
* `--exclude-credentials` - 
						Exclude credentials in the snapshot


&nbsp;
#### Example

```markdown
$ cfy snapshots create first_snapshot
...

Creating snapshot first_snapshot...
Started workflow execution. The execution's id is 41517a63-8c89-49d3-b9bc-bd357b22a4ee

...
```

### delete

Usage: `cfy snapshots delete [OPTIONS] SNAPSHOT_ID`

Delete a snapshot from the manager

`SNAPSHOT_ID` is the id of the snapshot to download.


&nbsp;
#### Example

```markdown
$ cfy snapshots delete first_snapshot
...

Deleting snapshot first_snapshot...
Snapshot deleted successfully

...
```

### download

Usage: `cfy snapshots download [OPTIONS] SNAPSHOT_ID`

Download a snapshot from the manager

`SNAPSHOT_ID` is the id of the snapshot to download.

#### Optional flags

* `-o, --output-path TEXT` - The local path to download to


&nbsp;
#### Example

```markdown
$ cfy snapshots download first_snapshot -o my_manager
,,,

Downloading snapshot first_snapshot...
 my_manager |##########################################################| 100.0%
Snapshot downloaded as my_manager

...
```


### list

Usage: `cfy snapshots list [OPTIONS]`

List all snapshots on the manager


&nbsp;
#### Example

```markdown
$ cfy snapshots list
...

Listing snapshots...

Snapshots:
+----------------+--------------------------+---------+-------+
|       id       |        created_at        |  status | error |
+----------------+--------------------------+---------+-------+
| first_snapshot | 2016-08-11 09:37:28.773  | created |       |
+----------------+--------------------------+---------+-------+

...
```


### restore

Usage: `cfy snapshots restore [OPTIONS] SNAPSHOT_ID`

Restore a manager to its previous state

`SNAPSHOT_ID` is the id of the snapshot to use for restoration.archive


#### Optional flags

* `--without-deployments-envs` - 
						Restore without recreating the currently existing
                        deployments
* `-f, --force` - 		Force restoring the snapshot on a Manager with 
						existing blueprints or deployments


nbsp;
#### Example

```markdown
$ cfy snapshots restore snapshot_CAMWZ5
...

Restoring snapshot snapshot_CAMWZ5...
Started workflow execution. The execution's id is 1e2e2017-21f9-4be8-81b8-3ee091b924a0

...
```


### upload

Usage: `cfy snapshots upload [OPTIONS] SNAPSHOT_PATH`

Upload a snapshot to the manager

`SNAPSHOT_PATH` is the path to the snapshot to upload.

#### Optional flags

* `-s, --snapshot-id TEXT` - 
						The unique identifier for the snapshot


&nbsp;
#### Example

```markdown
$ cfy snapshots upload my_manager
...

Uploading snapshot my_manager...
 my_manager |##########################################################| 100.0%
Snapshot uploaded. The snapshot's id is snapshot_CAMWZ5

...
```