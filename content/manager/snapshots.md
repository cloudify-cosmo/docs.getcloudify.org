---
layout: bt_wiki
title: Snapshots
category: Manager
draft: false
weight: 1300
---

## Overview

Snapshot is a `.zip` file that contains all relevant data describing the state of a Cloudify Manager the moment the snapshot is created on this Manager. There are basically four operations associated with snapshots: creating, downloading, uploading and restoring them. For detailed information about snapshots related CLI commands, please visit this [link]({{< relref "cli/reference.html" >}}).

Common use cases for snapshots are:

* Backing up the Manager to be able to restore its state later on, should it become inconsistent or broken for whatever reason.
* Migrating to a newer Cloudify Manager version, by creating a snapshot on the old manager and restoring it on the new one. In this case, if you have any **installed** deployments, you should also execute the [install_new_agents]({{< relref "workflows/built-in-workflows.md#the-install-new-agents-workflow" >}}) workflow on the new manager so that all hosts agents get updated and connected to the new manager's RabbitMQ.

{{% gsNote title="Security note" %}}
Snapshots are security-sensitive. Broker IP, SSL certificates and credentials are stored in snapshots, as well as keys to agent VMs if an aprropriate flag was used on creating the snapshot.
{{% /gsNote %}}

{{% gsNote title="Known issue" %}}
If you create a snapshot on a Cloudify Manager, delete all blueprints and restore the snapshot on the same Manager, events will be duplicated. In this case it is recommended to clear ElasticSearch index manually before restoring the snapshot, please see [instructions]({{< relref "manager/snapshots.md#clearing-manager-manually" >}}).
{{% /gsNote %}}

## Snapshot Contents

* **agents.json** - this file contains data necessary for the [install_new_agents]({{< relref "workflows/built-in-workflows.md#the-install-new-agents-workflow" >}}) workflow, mainly necessary to connect to the message broker of the Manager the snapshot has been created on.
* **es_data** - Dump of all ElasticSearch data except for provider context, snapshots and the create snapshot execution that created the snapshot.
* **metadata.json** - Helper file with flags telling the restore snapshot workflow how to proceed with its execution.
* **plugins/** - Folder containing all plugins uploaded to the Manager.
* **snapshot-credentials/** - `.pem` key files for all installed applications VMs.
* **blueprints/** - Extracted blueprints uploaded to the Manager.
* **uploaded-blueprints/** - Blueprints uploaded to the Manager as `.tar.gz` files.

## Advanced Topics
### Clearing Manager manually

If you want to clear the Manager before restoring a snapshot, remove as much as possible using CLI: deployments, blueprints and plugins.
In order to remove more data, you will need to operate on ElasticSearch data directly, executing the following code on the Manager for example:

{{< gsHighlight python >}}
import elasticsearch
import elasticsearch.helpers

es_client = elasticsearch.Elasticsearch(hosts=[{'host': 'localhost', 'port': 9200}])

def gen_entities_to_delete():
    for doc in elasticsearch.helpers.scan(es_client):
        if doc['_type'] not in ('provider_context', 'snapshot'):
            doc['_op_type'] = 'delete'
            yield doc

elasticsearch.helpers.bulk(es_client, gen_entities_to_delete())
{{< /gsHighlight >}}

### Creating a snapshot on a Cloudify Manager 3.2.X

To create a snapshot on a `3.2`/`3.2.1` Cloudify Manager, use the [cloudify-3.2.1-snapshots-tool](https://github.com/cloudify-cosmo/cloudify-3.2.1-snapshots-tool). Its purpose is to make creating snapshots on Cloudify Managers 3.2.X possible - this feature has been introduced in the 3.3 version and is not available on earlier versions out of the box. Please see the [README.md](https://github.com/cloudify-cosmo/cloudify-3.2.1-snapshots-tool/blob/master/README.md) file in the tool's repository for more details.
