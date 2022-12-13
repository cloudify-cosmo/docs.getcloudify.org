+++
title = "Network"
description = "This section reviews the network interface requirements."
weight = 40
alwaysopen = false
+++

## Network Interface

The {{< param cfy_manager_name >}} requires at least 2 network interfaces with configured IP addresses:

* Private - This interface is dedicated to communication with other {{< param product_name >}} components, including agents and cluster members.
* Public - This interface is dedicated to connections to the {{< param cfy_manager_name >}} via the {{< param cfy_cli_name >}} and {{< param cfy_console_name >}}.

**Connectivity Requirements**

These are the minimal requirements for production systems.
* Internal communication - between {{< param product_name >}} management cluster entities - at least 1 Gbps connection with a latency of 1 msec or less.
* {{< param cfy_agent_name >}} to manager communication - at least 100 mbps connection with a latency of 50 ms or less.

**Network Ports**

The {{< param cfy_manager_name >}} listens on the following ports:

| PORT  | DESCRIPTION                                                                |
|-------|----------------------------------------------------------------------------|
| 80    | REST API and UI. This port must be accessible when SSL is not enabled.     |
| 443   | REST API and UI. This port must be accessible when SSL is enabled.         |
| 22    | For remote access to the manager from the Cloudify CLI. (Optional)         |
| 5671  | RabbitMQ. This port must be accessible from agent VMs.                     |
| 8009  | Monitoring service port.                                                   |
| 53333 | Internal REST communications. This port must be accessible from agent VMs. |

Additionally, when {{< param product_name >}} is deployed in a cluster topology, the following ports should be allowed:

**Database nodes access to each other:**

| PORT  | DESCRIPTION                                   |
|-------|-----------------------------------------------|
| 2379  | Etcd client-server for Patroni cluster state. |
| 2380  | Etcd server-server for Patroni cluster state. |
| 5432  | PostgreSQL replication.                       |
| 8008  | Patroni API for retrieving cluster state.     |

**Manager access to database servers:**

| PORT  | DESCRIPTION                             |
|-------|-----------------------------------------|
| 5432  | Database access.                        |
| 8008  | Patroni, for determining DB node state. |
| 8009  | Monitoring service port.                |

**Messaging queue (RabbitMQ) nodes access to each other:**

| PORT  | DESCRIPTION                         |
|-------|-------------------------------------|
| 4369  | EPMD for discovery operations.      |
| 25671 | Server-server rabbit communication. |

**Manager access to messaging queue servers:**

| PORT  | DESCRIPTION                                          |
|-------|------------------------------------------------------|
| 4369  | EPMD for discovery operations.                       |
| 5671  | Brokers access.                                      |
| 15671 | Accessing the management plugin for user management. |
| 8009  | Monitoring service port.                             |

**Manager to manager access:**

| PORT  | DESCRIPTION                     |
|-------|---------------------------------|
| 22000 | Syncthing for file replication. |
| 8009  | Monitoring service port.        |

_All ports are TCP unless noted otherwise._

**Reverse DNS Lookup**

Reverse DNS lookup must be available for the RabbitMQ nodes.