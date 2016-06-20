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

Usage: `cfy snapshots create [options] -s SNAPSHOT_ID`

Create a snapshot of the manager.

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - A user provided snapshot ID

#### Optional flags

* `--exclude-credentials` - Do not store credentials in the snapshot
* `--include-metrics` - Include metrics data in the snapshot


### delete

Usage: `cfy snapshots delete [options] -s SNAPSHOT_ID` 

Delete a snapshot from the manager.

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot


### download

Usage: `cfy snapshots download [options] -s SNAPSHOT_ID`

Download a snapshot from the manager.

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot

#### Optional flags

* `-o, --output=OUTPUT_PATH` - The output path for the downloaded file


### list

Usage: `cfy snapshots list` 

List all available snapshots on the manager.


### restore

Usage: `cfy snapshots restore [options] -s SNAPSHOT_ID` 

Restore a newly bootstrapped manager using a snapshot archive

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot

#### Optional flags

* `-f, --force` - Force restoring the snapshot on a Manager with existing blueprints or deployments
* `--without-deployments-envs` - Restore a snapshot (excluding existing deployments)


### upload

Usage: `cfy snapshots upload -p SNAPSHOT_FILE -s SNAPSHOT_ID` 

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot
* `-p, --snapshot-path=SNAPSHOT_FILE` - The local path of the snapshot to upload

