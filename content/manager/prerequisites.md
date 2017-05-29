---
layout: bt_wiki
title: Prerequisites
category: Manager Intro
draft: true
weight: 250

manual_install_link: installation-manual.html
terminology_link: reference-terminology.html
cli_install_link: installation-cli.html
simple_install_link: installation-simple-provider.html
agent_packager_link: agents-packager.html
manager_blueprints_openstack_link: manager-blueprints-openstack.html
---

A Cloudify Manager has a set of prerequisites, related to both infrastructure and operating system.


# Manager Environment

## Host Machine

### Minimal Requirements

Cloudify Manager must run on a 64-bit machine and requires at the very least 2 vCPUs, 4GB RAM and 5GB of free disk space. These are the minimal requirements for a Cloudify Manager to run, and are only sufficient for demos and development. You need to provision larger machines to actually utilize the Manager's capabilites.


#### Bootstrap Validations

During the bootstrap process, validations occur to verify minimum requirements. [Click here]({{< relref "manager/bootstrapping.md" >}}#bootstrap-validations) for more information on bootstrap validations.

### Recommended Requirements

The recommended requirements vary, based on the following:

* Number of deployments you intend to run.
* Volume of logs and events you need to send concurrently from your hosts.
* Volume of metrics you need to send concurrently from your hosts.

As a general recommendation for the average system, one Cloudify Manager requires at least 8GB of RAM and 4 vCPUs. Disk space requirements vary according to the volume of logs, events and metrics sent. You can configure log index rotation before bootstrapping.


### Network

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


# OS Distributions

## Management Server

Cloudify can be bootstrapped on either CentOS 7.x or RHEL 7.x.

# What's Next

Next, you must [bootstrap]({{< relref "manager/bootstrapping.md" >}}) a Cloudify Manager on the IaaS provider of your choice.
