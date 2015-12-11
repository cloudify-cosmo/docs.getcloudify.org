---
layout: bt_wiki
title: Snapshot Contents
category: snapshots
publish: true
weight: 201
---

* **agents.json** - this file contains data necessary for the [install_new_agents]({{< relref "workflows/built-in-workflows.md#the-install-new-agents-workflow" >}}) workflow, mainly necessary to connect to the message broker of the Manager the snapshot has been created on.
* **es_data** - Dump of all ElasticSearch data except for provider context, snapshots and the create snapshot execution that created the snapshot.
* **metadata.json** - Helper file with flags telling the restore snapshot workflow how to proceed with its execution.
* **plugins/** - Folder containing all plugins uploaded to the Manager.
* **snapshot-credentials/** - `.pem` key files for all installed applications VMs.
* **blueprints/** - Extracted blueprints uploaded to the Manager.
* **uploaded-blueprints/** - Blueprints uploaded to the Manager as `.tar.gz` files.
