---
layout: bt_wiki
title: Prerequisites and Sizing Guidelines for Installing a Cloudify Manager
category: Installation
draft: false
weight: 50
---
Before you [install the Cloudify Manager]({{< relref "install_maintain/installation/installing-manager.md" >}}), please review the following prerequisites and make sure that your environment is ready to support the Cloudify Manager.

## Manager Resources

The Cloudify Manager requires at least:

 -       | Minimum | Recommended |
---------|---------|-------------|
 vCPUs   | 2       | 8           |
 RAM     | 4GB     | 16GB        |
 Storage | 5GB     | 64GB        |

The minimum requirements are enough for a manager running just a few compute instances, typically for developer use, POC, or a small edge site. Managers running large deployments require at least the recommended resources.

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

A single Cloudify manager/manager cluster can maintain up to 250K deployed nodes.
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

Cloudify Manager is supported for installation on a 64-bit host with RHEL/CentOS 7.4.

### Cloudify Images for Amazon, OpenStack, and Docker
You can also create a Cloudify Manager with the Amazon AWS, OpenStack, or Docker [images]({{< relref "install_maintain/installation/manager-image.md" >}}) available at [Cloudify downloads]( https://cloudify.co/download/ ).

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

Additionally, when the Manager is part of a Cloudify Manager cluster, the following ports must be accessible from all the other nodes in the cluster:

 Port   | Description
 -------|--------------
 8300   | Internal port for the distributed key/value store.
 8301   | Internal port for TCP and UDP heartbeats. Must be accessible for both TCP and UDP.
 8500   | Port used for outage recovery in the event that half of the nodes in the cluster failed.
 15432  | Database replication port.
 22000  | Filesystem replication port.

All ports are TCP unless noted otherwise.

## Prerequisite Packages

These are specific packages that are commonly included in RHEL/CentOS. You must have these packages installed before you install the Cloudify Manager:

* `sudo` - Required to run commands with root privileges (note that this is still a requirement even when running with root user)
* `openssl-1.0.2k` - Required to generate internal/external certificates
* `openssh-server` - Required for creating SSH keys during the sanity check
* `logrotate` - Required for rotating Cloudify log files
* `systemd-sysv` - Required by PostgreSQL DB
* `initscripts` - Required by RabbitMQ
* `which` - Required to install Logstash plugins
* `python-setuptools` - Required by Python
* `python-backports` - Required by Python
* `python-backports-ssl_match_hostname` - Required by Python

## Interoperability

The Cloudify manager is a complete application. As such, it contains several installed dependencies such as PostgreSQL, NGINX, RabbitMQ, and others. 
It is required that you install Cloudify manager on a standalone VM or container and do not co-locate any other applications on that machine or container (beyond possible monitoring or logging software). 
You must install the Cloudify manager as described in the installation instructions in this guide.
