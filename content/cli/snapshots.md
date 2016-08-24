---

title: snapshots



weight: 190
---

The `cfy snapshots` command is used to manage data snapshots of a Cloudify manager.

You can use the command to create, upload, download, delete and list snapshots and also to restore a manager using a snapshot archive.

See [snapshots]({{ relRef("manager/snapshots.md") }}) for more information.


## Commands

### create

Usage: `cfy snapshots create [options] -s SNAPSHOT_ID`

Create a snapshot of the manager.

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - A user provided snapshot ID

#### Optional flags

* `--exclude-credentials` - Do not store credentials in the snapshot
* `--include-metrics` - Include metrics data in the snapshot


&nbsp;
#### Example

```markdown
$ cfy snapshots create -s first_snapshot
...

Creating snapshot first_snapshot...
Started workflow execution. The execution's id is 7ac570fd-835f-4cb0-bc23-42f8510710dd

...
```

### delete

Usage: `cfy snapshots delete [options] -s SNAPSHOT_ID` 

Delete a snapshot from the manager.

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot


&nbsp;
#### Example

```markdown
$ cfy snapshots delete -s first_snapshot
...

Deleting snapshot first_snapshot...
Snapshot deleted successfully

...
```

### download

Usage: `cfy snapshots download [options] -s SNAPSHOT_ID`

Download a snapshot from the manager.

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot

#### Optional flags

* `-o, --output=OUTPUT_PATH` - The output path for the downloaded file


&nbsp;
#### Example

```markdown
$ cfy snapshots download -s first_snapshot
,,,

Downloading snapshot first_snapshot...
Snapshot downloaded as first_snapshot.zip

...
```


### list

Usage: `cfy snapshots list` 

List all available snapshots on the manager.


&nbsp;
#### Example

```markdown
$ cfy snapshots list
...

Listing snapshots...

Snapshots:
+----------------+----------------------------+---------+-------+
|       id       |         created_at         |  status | error |
+----------------+----------------------------+---------+-------+
| first_snapshot | 2016-06-29 08:22:27.673799 | created |       |
+----------------+----------------------------+---------+-------+

...
```


### restore

Usage: `cfy snapshots restore [options] -s SNAPSHOT_ID` 

Restore a newly bootstrapped manager using a snapshot archive

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot

#### Optional flags

* `-f, --force` - Force restoring the snapshot on a Manager with existing blueprints or deployments
* `--without-deployments-envs` - Restore a snapshot (excluding existing deployments)


nbsp;
#### Example

```markdown
$ cfy snapshots restore -s first_snapshot
...

Restoring snapshot first_snapshot...
Started workflow execution. The execution's id is 96d826cb-8958-43b5-845d-34ce77291a21

...
```


### upload

Usage: `cfy snapshots upload -p SNAPSHOT_FILE -s SNAPSHOT_ID` 

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot
* `-p, --snapshot-path=SNAPSHOT_FILE` - The local path of the snapshot to upload


&nbsp;
#### Example

```markdown
$ cfy snapshots upload -p first_snapshot.zip -s first_snapshot
...

Uploading snapshot first_snapshot.zip...
Snapshot uploaded. The snapshot's id is first_snapshot

...
```