---
layout: bt_wiki
title: Prerequisites
category: Manager Intro
draft: false
weight: 150

manual_install_link: installation-manual.html
terminology_link: reference-terminology.html
cli_install_link: installation-cli.html
simple_install_link: installation-simple-provider.html
agent_packager_link: agents-packager.html
manager_blueprints_openstack_link: manager-blueprints-openstack.html
---

A Cloudify Manager has a set of prerequisites, from both infrastructure and OS perspectives.


# Manager Environment

## Host Machine

### Minimal Requirements

A Cloudify Manager must run on a 64-bit machine and requires at the very least 2GB of RAM, 1 CPU and 5GB of free space.

{{% gsNote title="Note" %}}
These are the minimal requirements for a Cloudify Manager to run. You will have to provision larger machines to actually utilize the Manager's capabilites.
We recommend using these specs only for demos and development.
{{% /gsNote %}}


### Recommended Requirements

The recommended requirements can vary based on the following:

* Number of deployments you're going to run.
* Amount of concurrent logs and events you're going to send from your hosts.
* Amount of concurrent metrics you're going to send from your hosts.

As a general recommendation for the average system, a Manager would require at least 8GB of RAM and 4 CPU Cores. Disk space requirements varies according to the amount of logs, events and metrics sent. You can configure log index rotation via the Manager blueprint you're using to bootstrap.


### Network

The Manager listens on the following ports:

* port 80 - REST API and UI. This port should be accessible when SSL is not enabled.
* port 443 - REST API and UI. This port should be accessible when SSL is enabled.
* port 8101 - REST API. This port is used for internal access and as such should only be accessible from [Agent]({{page.terminology_link}}#agent) VMs.
* port 22 - During bootstrap, components are installed and configured via SSH. It is used during recovery of the Manager as well.
* port 5672 - RabbitMQ. This port should be accessible from agent VMs.
* port 53229 - File server. This port should be accessible from agent VMs.


# OS Distributions

## Management Server

Cloudify can be bootstrapped on either Centos or RHEL 7.

# What's Next

Next, you should [bootstrap](manager-bootstrapping.html) a Cloudify Manager on the IaaS provider of your choice.
