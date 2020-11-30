---
layout: bt_wiki
title: Suspend Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the **utilities plugin**.
{{% /note %}}

Additional support for `suspend`, `resume`, `backup`, `restore`, `remove_backup`
workflows.

## The plugin supports

* `suspend`: Workflow call `cloudify.interfaces.freeze.suspend` for each node
  that has such operation. For backward compatibility also run deprecated.
  `cloudify.interfaces.lifecycle.suspend`.
* `resume`: Workflow call `cloudify.interfaces.freeze.resume` for each node
  that has such operation. For backward compatibility also run deprecated.
  `cloudify.interfaces.lifecycle.resume`.
* `backup`: Workflow call such calls for each node that has such operation.
  * `cloudify.interfaces.freeze.fs_prepare` for all **services** nodes,
  * `cloudify.interfaces.freeze.fs_prepare` for all **compute** nodes,
  * `cloudify.interfaces.snapshot.create` for all nodes in deployment,
  * `cloudify.interfaces.freeze.fs_finalize` for all **compute** nodes,
  * `cloudify.interfaces.freeze.fs_finalize` for all **services** nodes.
* `restore`:  Workflow call such calls for each node that have such operation.
  * `cloudify.interfaces.freeze.fs_prepare` for all **services** nodes,
  * `cloudify.interfaces.freeze.fs_prepare` for all **compute** nodes,
  * `cloudify.interfaces.snapshot.apply` for all nodes in deployment,
  * `cloudify.interfaces.freeze.fs_finalize` for all **compute** nodes,
  * `cloudify.interfaces.freeze.fs_finalize` for all **services** nodes.
* `remove_backup`:  Workflow call `cloudify.interfaces.snapshot.delete` for each
  node that has such operation.
* `statistics`:  Workflow call `cloudify.interfaces.statistics.perfomance` for each
  node that has such operation.

### Suspend/Resume support by plugins:

Plugin           | VM Suspend/Resume | File System freeze/unfreeze
---------------- | ----------------- | ---------------------------
Openstack 2.9.0+ | Y                 | N (N/A)
vSphere 2.7.0+   | Y                 | N (N/A)
vSphere 3.0.0+   | Y                 | N (N/A)
LibVirt 0.4+     | Y                 | N (N/A)


### Backup/Snapshot support by plugins:

Plugin           | VM Snapshot | VM Backup  | VM Snapshot Restore | VM Backup Restore | VM Snapshot Remove | VM Backup Remove
---------------- | ----------- | -----------| ------------------- | ----------------- |------------------- | ----------------------
Openstack 2.9.0+ | Y           | Y          | Y                   | Y                 | Y                  | Y
Openstack 3.0.0+ | Y           | Y          | Y                   | Y                 | Y                  | Y
vSphere 2.7.0+   | Y           | N (No API) | Y                   | N (No API)        | Y                  | N (No API)
LibVirt 0.6.0+   | Y           | Y          | Y                   | Y (Bypassed)      | Y                  | Y

Plugin           | Network Snapshot | Network Backup | Network Snapshot Restore | Network Backup Restore | Network Snapshot Remove | Network Backup Remove
---------------- | ---------------- | -------------- | ------------------------ | ---------------------- |------------------------ | ---------------------
LibVirt 0.4.1+   | Y                | Y              | Y (By Compare)           | Y (By Compare)         | Y                       | Y

Plugin           | Volume Snapshot | Volume Backup | Volume Snapshot Restore | Volume Backup Restore | Volume Snapshot Remove | Volume Backup Remove
---------------- | --------------- | ------------- | ----------------------- | --------------------- |----------------------- | --------------------
Openstack 2.9.0+ | Y               | Y             | N (No API)              | Y                     | Y                      | Y
Openstack 3.0.0+ | Y               | Y             | N (No API)              | Y                     | Y                      | Y
vSphere 2.7.0+   | N (N/A)         | N (N/A)       | N (N/A)                 | N (N/A)               | N (N/A)                | N (N/A)
LibVirt 0.4.1+   | Y (By VM)       | Y (Bypassed)  | Y (By VM)               | N (No API)            | Y (By VM)              | Y (Bypassed)
GCP 1.5.0+       | N (N/A)         | Y             | N (N/A)                 | N (N/A)               | N (N/A)                | Y

### Notes:

Abbreviations:

* `N/A` - Not supported by plugin.
* `Y` - Supported by plugin.
* `Y (Bypassed)` - Can be bypassed by separate API or property.
* `Y (By VM)` - Created automatically by run action on connected VM.
* `Y (By Compare)` - Code show difference between states without reconfigure object.
* `N (No API)` - Unsupported by infrastructure API.

All workflows have support for:

* `include_instances` parameter for limit list of instances where we call operations.
* `skip_actions` node property check for disabling specific actions on the node.

Backup types:

* `Snapshot` has such meaning - some objects that directly connected to parent object
   (VM/Compute/Volume) and in object saved difference between different state of object
   in time.
* `Backup` has such meaning - some object contain full copy of original object and can
   be used after remove original object.

For partial backup can be used `include_instances` for limit list of instances or
split installation to several deployments and run on deployments one by one.

OpenStack:

* Plugin will remove all binded snapshot before delete volume automatically.
* Volume backups, VM backups, VM snapshots are removed only for delete backup
   workflow, in other cases user should remove images manually.
* Plugins 2.7.+ and 3.0.+ can have different functionality coverage.

VSphere:

* Plugin will remove all binded snapshot before delete vm.
* User should remove snapshots before attach/detach devices from/to vm.

LibVirt:

* Plugin will remove all binded snapshot before delete vm.
* Plugin create xml backups in current directory by default.

## Backup/Shapshot workflows:

We provide for use 3 workflows: create/restore/remove_backup.

### Backup

`Backup` workflow has such parameters:

* `snapshot_name`: Backup name/tag. By default will be used "backup-<timestamp>"
* `snapshot_incremental`: Create incremental snapshots or full backup. By default
    created snapshots.
* `snapshot_type`: The backup type, like 'daily' or 'weekly'. By default: irregular
* `snapshot_rotation`: How many backups to keep around. By default: 1

Meaning of each params depends on plugin implementation and can have different sense
for each plugin.

For example, openstack use parameters in such way:

* `Snapshot name`: Used as suffix for created `objects`. As object can be different
   things like images, volume snapshots or backups. Name of resulted object is
   something like ```<object type>-<original object id>-<backup name>```. We need such
   because result of VM snapshot, VM backup and Volume backup
   is image. So we need some information in name for understand what id parent object
   for backup.
* `Snapshot_incremental`: plugin use to separate type of resulted objects.
   If `Snapshot_incremental=True` - code will try to create snapshot of object,
   for different plugins it can be contain different information. In case Openstack it
   will be Image with full copy of VM or subobject contained in volume that can be
   exported as image.
   If `Snapshot_incremental=False` - code will try to create copy of VM as image or
   copy of Volume as image.
* `snapshot_rotation`: used only with VM snapshot as rotation field in metadata.
* `snapshot_type`: used with VM snapshots as part of image metadata and as
   description in snapshot metadata.

OpenStack plugin does not make any decisions based on `snapshot_type` / `snapshot_rotation`
values and is passing this values without any changes. Cloudify plugins is not
responsible for remove all old backups or snapshots by rotation field.

### Restore

`Restore` workflow has such parameters:

* `snapshot_name`: Backup name/tag. By default will be used "backup-<timestamp>"
* `snapshot_incremental`: Restore from incremental snapshots or full backup.
   By default restored from snapshots.

Both parameters have same meaning as in backup workflow.

For openstack:

* VM's: Code search images with same name as we used for create backup/snapshot
   image and rebuild VM with use such name as base.
* Volumes: if customer have tried to restore from snapshot - we show warning and
   ignore the action. In case the customer has used backup - we ask OpenStack to
   restore volume from backup. Such logic is limitation of openstack, so we can
   only restore volumes from backups for now.

### Remove backup

`Remove backup` workflow has such parameters:

* `snapshot_name`: Backup name/tag. By default will be used "backup-<timestamp>"
* `snapshot_incremental`: Delete incremental snapshots or full backup.
    By default removed snapshots.

Both parameters have same meaning as in backup workflow.

For openstack:

* VM's - search image created by backup workflow and delete if found such.
* Volume - search image created as backup for volume or remove snapshot with
  such name in volume.

### Internal implementation/logic in utilities plugin.

In backup/restore workflow:

* call action `cloudify.interfaces.freeze.fs_prepare` for all non compute nodes.
   This action is supposed to stop service before run real backup.
* call action `cloudify.interfaces.freeze.fs_prepare` for compute nodes.
   This action is supposed for run sync/freeze fs before run real backup.
* call action `cloudify.interfaces.snapshot.create` for all nodes in deployment.
   This action is supposed for low level create backup of volume or vm in
   infrastructure. if user implemented callback for action - can be used
   for made backup of service db.
* call action `cloudify.interfaces.freeze.fs_finalize` for compute nodes.
   This action is supposed for run unfreeze fs before run real backup.
* call action `cloudify.interfaces.freeze.fs_finalize` for all non compute nodes.
   This action supposed for start all serviced stopped at the start of workflow.

Plugin needs to run `fs_prepere` for `restore` workflow - because plugin needs
to have consistent state before run any `restore`/`apply` backups - so if
service has some suspend before backup we need to stop candidate for restore
before any real action.

All actions receive all params as we have as inputs for workflow without any changes.
So user defined actions can make some decisions based on such params.

In `remove backup workflow` plugin calls remove backup action on all instances in
deployment without any additional `actions` for freeze or stop services.
So remove backup is safe action without functionality degradation of deployment.

# Usage example:


`1`. Upload the [blueprint](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_suspend/example.yaml) :

`cfy blueprints upload example.yaml `

`2`. Create deployment: 

`cfy deployments create -b cloudify-suspend`

`3`. Call 'suspend' workflow:

Suspend:

```shell
$ cfy execution start suspend -d cloudify-suspend 
Executing workflow `suspend` on deployment `cloudify-suspend` [timeout=900 seconds]
2020-05-27 14:06:39.552  CFY <cloudify-suspend> Starting 'suspend' workflow execution
2020-05-27 14:06:39.556  CFY <cloudify-suspend> [server_0chf3l] Starting to cloudify.interfaces.lifecycle.suspend
2020-05-27 14:06:39.821  CFY <cloudify-suspend> [server_0chf3l.suspend] Sending task 'script_runner.tasks.run'
2020-05-27 14:06:41.641  LOG <cloudify-suspend> [server_0chf3l.suspend] INFO: Downloaded scripts/suspend.py to /tmp/3VLF5/suspend.py
2020-05-27 14:06:41.701  LOG <cloudify-suspend> [server_0chf3l.suspend] INFO: suspend server_id=Server!
2020-05-27 14:06:42.420  CFY <cloudify-suspend> [server_0chf3l.suspend] Task succeeded 'script_runner.tasks.run'
2020-05-27 14:06:42.523  CFY <cloudify-suspend> [server_0chf3l] Done cloudify.interfaces.lifecycle.suspend
2020-05-27 14:06:42.692  CFY <cloudify-suspend> 'suspend' workflow execution succeeded

```

`4`. call `resume` workflow:

```shell
$ cfy execution start resume -d cloudify-suspend 
Executing workflow `resume` on deployment `cloudify-suspend` [timeout=900 seconds]
2020-05-27 14:06:08.910  CFY <cloudify-suspend> Starting 'resume' workflow execution
2020-05-27 14:06:08.915  CFY <cloudify-suspend> [server_0chf3l] Starting to cloudify.interfaces.lifecycle.resume
2020-05-27 14:06:09.179  CFY <cloudify-suspend> [server_0chf3l.resume] Sending task 'script_runner.tasks.run'
2020-05-27 14:06:10.970  LOG <cloudify-suspend> [server_0chf3l.resume] INFO: Downloaded scripts/resume.py to /tmp/TXFUE/resume.py
2020-05-27 14:06:11.044  LOG <cloudify-suspend> [server_0chf3l.resume] INFO: resume server_id=Server!
2020-05-27 14:06:11.773  CFY <cloudify-suspend> [server_0chf3l.resume] Task succeeded 'script_runner.tasks.run'
2020-05-27 14:06:11.787  CFY <cloudify-suspend> [server_0chf3l] Done cloudify.interfaces.lifecycle.resume
2020-05-27 14:06:11.957  CFY <cloudify-suspend> 'resume' workflow execution succeeded

```

## More executions logs:

Create backup:

```shell
$ cfy executions start backup -b examples -p snapshot_name=backup_example --task-retry-interval 30 --task-retries 30
2018-05-16 12:10:22.408  CFY <examples> Starting 'backup' workflow execution
2018-05-16 12:10:22.413  CFY <examples> [example_node_s4bgna] Starting to cloudify.interfaces.freeze.fs_prepare
2018-05-16 12:10:22.413  CFY <examples> [qemu_vm_jvv6jt] Starting to cloudify.interfaces.snapshot.create
2018-05-16 12:10:22.413  CFY <examples> [example_node_s4bgna] Starting to cloudify.interfaces.freeze.fs_finalize
2018-05-16 12:10:22.512  CFY <examples> [example_node_s4bgna.fs_finalize] Sending task 'cloudify_terminal.tasks.run'
2018-05-16 12:10:22.512  CFY <examples> [qemu_vm_jvv6jt.create] Sending task 'cloudify_libvirt.domain_tasks.snapshot_create'
...
2018-05-16 12:10:47.604  CFY <examples> [example_node_s4bgna] Done cloudify.interfaces.freeze.fs_finalize
2018-05-16 12:10:47.604  CFY <examples> [qemu_vm_jvv6jt] Done cloudify.interfaces.snapshot.create
2018-05-16 12:10:47.681  CFY <examples> [example_node_s4bgna] Done cloudify.interfaces.freeze.fs_prepare
2018-05-16 12:10:47.767  LOG <examples> INFO: Backuped to u'backup_example'
2018-05-16 12:10:47.768  CFY <examples> 'backup' workflow execution succeeded
```

Restore backup:

```shell
$ cfy executions start restore -b examples -p snapshot_name=backup_example --task-retry-interval 30 --task-retries 30
2018-05-16 12:12:43.913  CFY <examples> Starting 'restore' workflow execution
2018-05-16 12:12:43.917  CFY <examples> [example_node_s4bgna] Starting to cloudify.interfaces.freeze.fs_finalize
2018-05-16 12:12:43.917  CFY <examples> [qemu_vm_jvv6jt] Starting to cloudify.interfaces.snapshot.apply
2018-05-16 12:12:43.917  CFY <examples> [example_node_s4bgna] Starting to cloudify.interfaces.freeze.fs_prepare
...
2018-05-16 12:13:13.114  CFY <examples> [example_node_s4bgna] Done cloudify.interfaces.freeze.fs_prepare
2018-05-16 12:13:13.229  CFY <examples> [example_node_s4bgna] Done cloudify.interfaces.freeze.fs_finalize
2018-05-16 12:13:13.314  LOG <examples> INFO: Restored from u'backup_example'
2018-05-16 12:13:13.314  CFY <examples> 'restore' workflow execution succeeded
```

Delete backup:

```shell
$ cfy executions start remove_backup -b examples -p snapshot_name=backup_example --task-retry-interval 30 --task-retries 30
2018-05-16 12:14:42.171  CFY <examples> Starting 'remove_backup' workflow execution
2018-05-16 12:14:42.174  CFY <examples> [qemu_vm_jvv6jt] Starting to cloudify.interfaces.snapshot.delete
2018-05-16 12:14:42.275  CFY <examples> [qemu_vm_jvv6jt.delete] Sending task 'cloudify_libvirt.domain_tasks.snapshot_delete'
2018-05-16 12:14:42.322  CFY <examples> [qemu_vm_jvv6jt.delete] Task started 'cloudify_libvirt.domain_tasks.snapshot_delete'
2018-05-16 12:14:42.364  LOG <examples> [qemu_vm_jvv6jt.delete] INFO: remove_backup
2018-05-16 12:14:42.429  LOG <examples> [qemu_vm_jvv6jt.delete] INFO: Backup deleted: vm-backup_example
2018-05-16 12:14:42.430  CFY <examples> [qemu_vm_jvv6jt.delete] Task succeeded 'cloudify_libvirt.domain_tasks.snapshot_delete'
2018-05-16 12:14:42.499  CFY <examples> [qemu_vm_jvv6jt] Done cloudify.interfaces.snapshot.delete
2018-05-16 12:14:42.578  LOG <examples> INFO: Removed u'backup_example'
2018-05-16 12:14:42.578  CFY <examples> 'remove_backup' workflow execution succeeded
```
