+++
title = "High Availability Operations"
description = "Operations"
weight = 40
alwaysopen = false
+++

## Introduction

A {{< param product_name >}} cluster has up to three component clusters: Database, Message Queue, and Manager.

During operation of a {{< param product_name >}} cluster, it may become necessary to perform operations on these components such as removing faulty/ missing nodes, adding new nodes, or other maintenance operations.

All day 2 operations should only be conducted while the cluster is in maintenance mode.

When working on a three node cluster, don't forget to specify the config file to use with cfy_manager.

For example: if you intend to work on the first node set up using the cluster management tool, on the broker you might use:

```bash
cfy_manager brokers list -c /etc/cloudify/rabbitmq-1.config.yaml
```

## {{< param product_name >}} Manager Operations

### List

This does not modify the running cluster, so can be safely run without maintenance mode.

To see current cluster members, run the following command:

```bash
cfy cluster managers list
```

### Remove

To remove a manager from the cluster, first ensure that the manager itself is uninstalled or the VM/ container it is on was deleted.
If you are in any doubt about the state of the old manager node, it is recommended to ensure that its VM/ container was deleted.

Then, from any machine with a CLI configured to access the cluster, run the following command:

```bash  
cfy cluster remove <manager name as it appears in the hostname field of the managers list command>
``` 

After the removal is complete, you can verify that the cluster is healthy by checking the managers list, and the cluster status:
```bash
cfy cluster managers list
cfy cluster status
```
All expected managers should be listed, and the status should be healthy. Note that the cluster status can take up to ~30 seconds to stabilize.

### Add

To add a new manager node, install the node with the same network, DB and broker settings in the config.yaml as the existing managers.

After the install is complete, you can verify that the cluster is healthy by checking the managers list, and the cluster status:
```bash
cfy cluster managers list
cfy cluster status
```
All expected managers should be listed and the status should be healthy. Note that the cluster status can take up to ~30 seconds to stabilize.


## Message Queue Operations

### List

This does not modify the running cluster, so can be safely run without maintenance mode.

To see current cluster brokers from a CLI connected to the cluster, run:
```bash
cfy cluster brokers list
```

Alternatively, to get a listing including active alarms, from a broker run:
```bash
cfy_manager brokers list
```

### Remove

To remove a broker from a cluster, first ensure that the broker itself is uninstalled or the VM/ container it is on was deleted.
If you are in any doubt about the state of the old broker node, it is recommended to ensure that its VM/ container was deleted.

Next, both of the following steps must be performed:

From one of the broker nodes, remove the node with the following command:
```bash
cfy_manager brokers remove -r <broker name as it appears in the broker_name field of the cfy_manager brokers list>
```

From a CLI connected to the cluster, run:
```bash
cfy cluster brokers remove <broker name as it appears in the name field of the cfy cluster brokers list>
```

After removing the broker, you can verify that the cluster is healthy by checking the brokers list, and the cluster status:
```bash
cfy cluster brokers list
cfy cluster status
```
All expected brokers should be listed, and the status should be healthy. Note that cluster status can take up to ~30 seconds to stabilize.

### Add

To add a new broker node, install the node with the same cluster nodes list, networks, and erlang cookie as the existing brokers in the new broker's config.yaml.

You can confirm the broker has been added to the rabbit cluster properly by listing brokers on any of the broker nodes:
```bash
cfy_manager brokers list
```

After install is complete, you will need to add the broker to the manager cluster's known brokers by running:
```bash
cfy cluster brokers add <hostname of new broker> <IP or resolvable DNS name of new broker>
```

After adding the broker, you can verify that the cluster is healthy by checking the brokers list, and the cluster status:
```bash
cfy cluster brokers list
cfy cluster status
```
All expected brokers should be listed, and the status should be healthy. Note that cluster status can take up to ~30 seconds to stabilise.


## Database Operations

### List

This does not modify the running cluster, so can be safely run without maintenance mode.

DB nodes can be listed from DB or manager nodes using the command:
```bash
cfy_manager dbs list
```

### Remove

To remove a DB from a cluster, first ensure that the DB itself is uninstalled or the VM/ container it is on was deleted.
If you are in any doubt about the state of the old DB node, it is recommended to ensure that its VM/ container was deleted.

Next, the DB must be removed from the DB cluster using the following command on any current DB node:
```bash
cfy_manager dbs remove -a <DB address as it appears in the node_ip field of the cfy_manager dbs list>
```

Then, on every manager the following command must be run:
```bash
cfy_manager dbs remove -a <DB address as it appears in the node_ip field of the cfy_manager dbs list>
```

Following this, the manager state should be updated by running the following command once with any CLI connected to the cluster:
```bash
cfy db-nodes update
```

After removing the DB node, you can verify that the DB cluster settings are correct by checking the DB nodes list on one DB node and all manager nodes with:
```bash
cfy_manager dbs list
```
All expected DB nodes should be listed on the DB node and all managers.
Then, you can confirm the cluster is healthy with:
```bash
cfy cluster status
```
The status should be healthy. Note that cluster status can take up to ~30 seconds to stabilize.

### Add

To add a new DB node, install the node with the same DB cluster settings, including cluster nodes, with the new node in the node list in its config.yaml.

After install is complete, you will need to add the DB to each manager in the cluster. On every manager, run:
```bash
cfy_manager dbs add -a <IP or resolvable DNS name of new broker>
```

Following this, the manager state should be updated by running the following command once with any CLI connected to the cluster:
```bash
cfy db-nodes update
```

After adding the DB node, you can verify that the DB cluster settings are correct by checking the DB nodes list on one DB node and all manager nodes with:
```bash
cfy_manager dbs list
```
All expected DB nodes should be listed on the DB node and all managers.
Then, you can confirm the cluster is healthy with:
```bash
cfy cluster status
```
The status should be healthy. Note that cluster status can take up to ~30 seconds to stabilize.

### Set Master

If you wish to change the current DB master node, e.g. because the current master node is going to be undergoing maintenance operations, run the following command on a DB node:
```bash
cfy_manager dbs set-master -a <intended new master's DB address as it appears in the node_ip field of the cfy_manager dbs list>
```

### Re-Initialise

If one of the DB replicas is failing to replicate, with an ever-growing lag it can be fixed by running the following command on a DB node:
```bash
cfy_manager dbs reinit -a <DB node to re-initialise's address as it appears in the node_ip field of the cfy_manager dbs list>
```