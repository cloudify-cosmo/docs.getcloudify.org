---
layout: bt_wiki
title: Prerequisites and Sizing Guidelines for Installing a Cloudify Manager
description: Before you install Cloudify Manager, please review the following Cloudify manager prerequisites.
category: Installation
draft: false
weight: 1
---
Before you [install the Cloudify Manager]({{< relref "install_maintain/installation/installing-manager.md" >}}), please review the following prerequisites and make sure that your environment is ready to support the Cloudify Manager.



## All-in-One ##

All-in-One (AIO) deployment is based on a single Cloudify box (single VM/Container) running all the Cloudify components, mainly the manager, the database and the messaging queue.
An AIO deployment is recommended for non-mission critical use when High-availability is not required and the scale is not extreme.
Cloudify AIO is typically used for development and testing systems, but also common in production for smaller-scale areas.

Recommended Resources

 -       | Minimum | Recommended |
---------|---------|-------------|
 vCPUs   | 2       | 8           |
 RAM     | 4GB     | 16GB        |
 Storage | 5GB     | 64GB        |

* The minimum requirements are enough for a manager running just a few compute instances, typically for developer use, POC, or a small edge site. 
* The recommended spec was certified with 500K deployments and an average rate of over 1000 workflows per hour. 
* Adding more resources has proven to be successful for higher loads.

## Cloudify cluster ##

A Cloudify cluster consists of 3 main services: Cloudify Manager, Database, and Messaging queue. Cloudify cluster topology assures high availability and should be leveraged for mission-critical deployments. 
Learn more about the [Cloudify cluster]({{< relref "install_maintain/installation/installing-cluster" >}})

### Cloudify Manager server ###

For a highly available setup at lease two managers are required, 3 are recommended.

Recommended resources per manager server

 -       | Recommended |
---------|-------------|
 vCPUs   | 4           |
 RAM     | 8GB         |
 Storage | 32GB        |
 
* The recommended spec is for average use of 1000-2000 workflows per hour and was certified with 1M deployments.
* Scaling to higher volume can be achieved via
  * Additional Cloudify Managers - an almost linear scaling was verified leveraging 3-6 managers.
  * Higher hardware spec - a linear scaling was verified with stronger hardware
* The equivalent AWS instance is c5.xlarge 
* Customized sizing and tunning may further improve the supported scale. Over 2M deployed nodes and over 5000 workflows per hour were tested in some scenarios.

### Database (PostgreSQL) server ###

For a highly available setup, 3 database servers are required.

Recommended resources per database server

 -       | Recommended |
---------|-------------|
 vCPUs   | 2           |
 RAM     | 16GB        |
 Storage | 64GB        |
 
* The recommended spec is for average use of 1000-2000 workflows per hour and was certified with 1M deployments.
* Scaling to higher volume can be achieved via
  * Higher hardware spec - a linear scaling was verified with stronger hardware
* The equivalent AWS instance is r5.large 

### Messaging queue (RabbitMQ) server ###

For a highly available setup, 3 messaging queue servers are required.

Recommended resources per messaging queue server

 -       | Recommended |
---------|-------------|
 vCPUs   | 2           |
 RAM     | 4GB         |
 Storage | 32GB        | 
 
* The recommended spec is for average use of 1000-2000 workflows per hour and was certified with 1M deployments.
* Scaling to higher volume can be achieved via
  * Higher hardware spec - a linear scaling was verified with stronger hardware
* The equivalent AWS instance is c5.large 

 
 

## Sizing Guidelines
Defining the exact sizing of a Cloudify manager is tricky because there are many variants in the equation. That said, here are some guidelines and insights to how such sizing can be determined.

**Tenants**

Up to 1000 tenants may be defined in a Cloudify manager/cluster. 

**Users**

There is virtually no limit to the number of users defined in the system. 
The max number of concurrent users interacting with the manager is 200 (based on the recommended spec above.

**Blueprints**

There is no limit on the number of blueprints other than their size.
Blueprints are stored in on the manager hard drive and in the database and are relatively small entities. A very large blueprint may consume 1M of disk space and similar size in the DB. most will require much less than that.
Cloudify recommends allocating 50GB of storage to the manager which should suffice for most customers.

**Plugins**

There is no limit on the number of plugins other than their size. Plugins are stored in the manager hard drive. 
A typical plugin consumes approximately 5M. Very large plugins consume 20M of storage.

**Deployments**

A single Cloudify manager/manager cluster can maintain up to 500K deployed nodes.
Deployments are very light and consume very little space in the DB/hard drive. A typical deployment size would be up to 10K of disk size and consume very few entries in the DB.

**Workflows**

A Cloudify manager/cluster can operate up to 100 concurrent workflows. This threshold is enforced by the system.
Note: This threshold may be modified in the configuration, however, Cloudify recommends keeping the default.

**Secrets**

There is virtually no limit to the number of secrets.

**Agents**

Up to 2000 agents may be deployed per single Cloudify manager/manager cluster.

**UI/CLI/API requests per second**

The REST API performance varies depending on multiple factors, but as a guideline, you should expect the Cloudify manager to support up to 10 requests per second with the above-recommended spec.

**Events**

The system can run and track up to 100 events per second with the above-recommended spec.

**Logs, events and metrics**

You must have enough storage to store the logs, events and metrics sent from the hosts. You can configure [log rotation]({{< relref "working_with/manager/service-logs.md#log-rotation" >}}) to reduce the amount of storage space required.


## Architecture and OS

Cloudify Manager is supported for installation on a 64-bit host with RHEL/CentOS 7.6.

### Cloudify Images for OpenStack and Docker
You can also create a Cloudify Manager with the OpenStack or Docker [images]({{< relref "install_maintain/installation/manager-image.md" >}}) available at [Cloudify downloads]( https://cloudify.co/download/ ).

## Network 

**Network Interfaces**

The Cloudify Manager requires at least 2 network interfaces with configured IP addresses:

* Private - This interface is dedicated for communication with other Cloudify components, including agents and cluster members.
* Public - This interface is dedicated for connections to the Cloudify Manager via the Cloudify CLI and Cloudify management console.

**Connectivity requirements**
These are the minimal requirements for production systems. 
* Internal communication - between Cloudify management cluster entities - at least 1Gbps connection with a latency of 1msec or less.
* Cloudify agent to manager communication - at least 100Mbps connection with a latency of 50ms or less.

**Network Ports**
The Cloudify Manager listens on the following ports:

 Port   | Description
--------|--------------
 80     | REST API and UI. This port must be accessible when SSL is not enabled.
 443    | REST API and UI. This port must be accessible when SSL is enabled.
 22     | For remote access to the manager from the Cloudify CLI. (Optional)
 5671   | RabbitMQ. This port must be accessible from agent VMs.
 53333  | Internal REST communications. This port must be accessible from agent VMs.

Additionally, when Cloudify is deployed in a cluster topology, the following ports should be allowed:

**Database nodes access to each other:**

Port   | Description
 -------|--------------
 2379   | Etcd client-server for patroni cluster state.
 2380   | Etcd server-server for patroni cluster state.
 5432   | PostgreSQL replication.
 8008   | Patroni api for retrieving cluster state.
 
**Manager access to database servers:**

 Port   | Description
 -------|--------------
 5432   | Database access.
 8008   | Patroni, for determining DB node state.

**Messaging queue (RabbitMQ) nodes access to each other:**

 Port   | Description
 -------|--------------
 4369   | epmd for discovery operations.
 25671  | Server-server rabbit communication.

**Manager access to messaging queue servers:**

 Port   | Description
 -------|--------------
 4369   | epmd for discovery operations.
 5671   | Brokers access.
 15671  | Accessing the management plugin for user management.

**Manager to manager access:**

 Port   | Description
 -------|--------------
 22000  | Syncthing for file replication.


_All ports are TCP unless noted otherwise._


**Reverse DNS lookup**

Reverse DNS lookup must be available for the RabbitMQ nodes.

## Prerequisite Packages

### Software requirements

These are specific packages that are commonly included in RHEL/CentOS. You must have these packages installed before you install the Cloudify Manager:

| Package | Description | Cloudify Manager | PostgreSQL Database | RabbitMQ Server |
|---|---|---------|-------------|------|
| sudo | Required to run commands with root privileges (note that this is still a requirement even when running with root user) | V | V |
| systemd-sysv | Create Cloudify Services | V | V | V |
| yum | Install Cloudify's required packages | V | V | V |
| openssl-1.0.2k | Generate internal/external certificates | V |  |  |
| openssh-server | Creating SSH keys during the sanity check | V |  |  |
| logrotate | Rotating Cloudify log files | V | V | V |
| initscripts | Required by RabbitMQ |  |  | V |
| sed | Required by the CLI | V |  |  |
| tar | Untar packages | V |  |  |
| python-setuptools | Required by Python | V | V | V |
| python-backports | Required by Python | V | V | V |
| python-backports-ssl_match_hostname | Required by Python | V | V | V |





## Interoperability

The Cloudify manager is a complete application. As such, it contains several installed dependencies such as PostgreSQL, NGINX, RabbitMQ, and others. 
It is required that you install Cloudify manager on a standalone VM or container and do not co-locate any other applications on that machine or container (beyond possible monitoring or logging software). 
You must install the Cloudify manager as described in the installation instructions in this guide.
