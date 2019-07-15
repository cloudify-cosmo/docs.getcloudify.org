---
layout: bt_wiki
title: Snapshots
category: Manager
draft: false
weight: 1300
aliases: /manager/snapshots/
---

A snapshot is a `.zip` file that contains all relevant data describing the state of a Cloudify Manager the moment the snapshot is created on this Manager. There are four basic operations associated with snapshots: creating, downloading, uploading and restoring. For detailed information about snapshot-related CLI commands, [click here]({{< relref "cli/maint_cli/snapshots.md" >}}).

Common use cases for snapshots are:

* Backing up the Manager to be able to restore its state later on, should it become inconsistent or broken for whatever reason. Note that if you attempt to restore after losing an old manager you will need to have the same IP assigned to the new manager or the restore process will likely require support.
* Migrating to a newer Cloudify Manager version, by creating a snapshot on the old manager and restoring it on the new one.

  In this case, if you have any **installed** deployments, you also need to execute the [install_new_agents]({{< relref "working_with/workflows/built-in-workflows.md#the-install-new-agents-workflow" >}}) workflow on the new Cloudify Manager so that all hosts agents are updated and connected to RabbitMQ on the new Cloudify Manager.

{{% note title="Security Note" %}}
Snapshots are security-sensitive. SSL certificates, hash salts, credentials, and other sensitive information regarding your environment are likely to be stored in snapshots.
{{% /note %}}

A snapshot can only be successfully restored to a clean Cloudify Manager, meaning newly-created and without blueprints or deployments.<br>
If you attempt to restore a snapshot to a Cloudify Manager that is not clean, the operation may be prevented, and will be unsuccessful.

{{% note title="Caution" %}}
During any snapshot restore process where it is possible to do so, the old manager should be kept online throughout the process..
{{% /note %}}

## Using the Cloudify Console
Snapshot management is performed via the [Admin Operations]({{< relref "working_with/console/admin-operations-page.md" >}}) page in the Cloudify Console. You must have `admin` credentials to create and restore snapshots.

