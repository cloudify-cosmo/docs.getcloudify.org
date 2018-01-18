---
layout: bt_wiki
title: Prerequisites for Installing a Cloudify Manager
category: Installation
draft: false
weight: 300
---
Before you [install a Cloudify Manager]({{< relref "installation/installing-manager.md" >}}), you must review these prerequisites and make sure that your environment is ready to support the Cloudify Manager.

## Architecture and OS

Cloudify Manager must run on a 64-bit host with RHEL/CentOS 7.x or higher.

## Manager Resources

Cloudify Manager requires at the least:

 -       | Minimum | Recommended |
---------|---------|-------------|
 vCPUs   | 2       | 8           |
 RAM     | 4GB     | 16GB        |
 Storage | 5GB     | 64GB        |

The minimum requirements are enough for small deployments that only manage a few compute instances. Managers that manage more deployments or large deployments need at least the recommended resources.

Recommended resource requirements are tested and verified to be dependent on these criteria:

* Blueprints: The only limit to the number of blueprints is the storage required to store the number and size of the local blueprints.
* Deployments: Each deployment requires minimal storage.
* Nodes: Cloudify can orchestrate 12,000 non-monitored nodes (tested with 2000 deployments, each spanning 6 node instances). Monitored nodes add CPU load to the manager and require storage for the logs, events and metrics.
* Tenants: You can run up to 1000 tenants on a manager.
* Workflows & Concurrency: You can run up to 100 concurrent workflows.
* Logs, events and metrics: You must have enough storage to store the logs, events and metrics sent from the hosts. You can configure [log rotation]({{< relref "manager/service-logs.md#log-rotation" >}}) to reduce the amount of storage space required.

## Network Ports

Cloudify Manager listens on the following ports:

 Port   | Description
--------|--------------
 80     | REST API and UI. This port must be accessible when SSL is not enabled.
 443    | REST API and UI. This port must be accessible when SSL is enabled.
 22     | During bootstrap, components are installed and configured via SSH. It is also used during recovery of cloudify Manager.
 5671   | RabbitMQ. This port must be accessible from agent VMs.
 53229  | File server. This port must be accessible from agent VMs.
 53333  | Internal REST communications. This port must be accessible from agent VMs.

 
Additionally, when the Manager is part of a Cloudify Manager cluster, the following ports must be accessible from all the other nodes in the cluster:

 Port   | Description
 -------|--------------
 8300   | Internal port for the distributed key/value store.
 8301   | Internal port for TCP and UDP heartbeats. Must be accessible for both TCP and UDP.
 8500   | Port used for outage recovery in the event that half of the nodes in the cluster failed.
 15432  | Database replication port.
 22000  | Filesystem replication port.

All ports are TCP unless noted otherwise.
