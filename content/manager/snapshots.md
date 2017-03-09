---
layout: bt_wiki
title: Snapshots
category: Manager
draft: false
weight: 1300
---

Snapshot is a `.zip` file that contains all relevant data describing the state of a Cloudify Manager the moment the snapshot is created on this Manager. There are four basic operations associated with snapshots: creating, downloading, uploading and restoring. For detailed information about snapshot-related CLI commands, [click here]({{< relref "cli/snapshots.md" >}}).

Common use cases for snapshots are:

* Backing up the Manager to be able to restore its state later on, should it become inconsistent or broken for whatever reason.
* Migrating to a newer Cloudify Manager version, by creating a snapshot on the old manager and restoring it on the new one.  
  In this case, if you have any **installed** deployments, you also need to execute the [install_new_agents]({{< relref "workflows/built-in-workflows.md#the-install-new-agents-workflow" >}}) workflow on the new Cloudify Manager so that all hosts agents are updated and connected to RabbitMQ on the new Cloudify Manager.

{{% gsNote title="Security Note" %}}
Snapshots are security-sensitive. Broker IP, SSL certificates and credentials are stored in snapshots, in addition to keys to agent VMs if an appropriate flag was used on creating the snapshot.
{{% /gsNote %}}

A snapshot can only be successfully restored to a clean Cloudify Manager, meaning newly-created and without blueprints or deployments.<br>
If you attempt to restore a snapshot to a Cloudify Manager that is not clean, the operation is not prevented, but will be unsuccessful.

## Snapshot Contents

* **agents.json** - this file contains data necessary for the [install_new_agents]({{< relref "workflows/built-in-workflows.md#the-install-new-agents-workflow" >}}) workflow, mainly necessary to connect to the message broker of the Manager the snapshot has been created on.
* **pg_data** - Dump of all PostgreSQL data, except for provider context, snapshots and the `create snapshot` execution that created the snapshot.
* **metadata.json** - Helper file with flags telling the restore snapshot workflow how to proceed with its execution.
* **plugins** - Folder containing all plugins uploaded to the Manager.
* **snapshot-credentials** - `.pem` key files for all installed applications VMs.
* **blueprints** - Extracted blueprints uploaded to the Manager.
* **uploaded-blueprints** - Blueprints uploaded to the Manager as `.tar.gz` files.

## Using the Web UI
Snapshot management is performed via the settings section in the Web UI. You must have `admin` credentials to create and restore snapshots.

