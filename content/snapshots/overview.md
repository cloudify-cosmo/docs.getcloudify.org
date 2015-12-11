---
layout: bt_wiki
title: Overview
category: snapshots
publish: true
weight: 200
---

Snapshot is a `.zip` file that contains all relevant data describing the state of a Cloudify Manager the moment the snapshot is created on this Manager. There are basically four operations associated with snapshots: creating, downloading, uploading and restoring them. For detailed information about snapshots related CLI commands, please visit this [link]({{< relref "cli/reference.html" >}}).

Common use cases for snapshots are:

* Backing up the Manager to be able to restore its state later on, should it become inconsistent or broken for whatever reason.
* Migrating to a newer Cloudify Manager version, by creating a snapshot on the old manager and restoring it on the new one. In this case, if you have any **installed** deployments, you should also execute the [install_new_agents]({{< relref "workflows/built-in-workflows.md#the-install-new-agents-workflow" >}}) workflow on the new manager so that all hosts agents get updated and connected to the new manager's RabbitMQ.

{{% gsNote title="Security note" %}}
Snapshots are security-sensitive. Broker IP, SSL certificates and credentials are stored in snapshots, as well as keys to agent VMs if an aprropriate flag was used on creating the snapshot.
{{% /gsNote %}}

{{% gsNote title="Known issue" %}}
If you create a snapshot on a Cloudify Manager, delete all blueprints and restore the snapshot on the same Manager, events will be duplicated. In this case it is recommended to clear ElasticSearch index manually before restoring the snapshot, please see [instructions]({{< relref "snapshots/advanced.md#clearing-manager-manually" >}}).
{{% /gsNote %}}
