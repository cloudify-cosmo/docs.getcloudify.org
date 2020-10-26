---
layout: bt_wiki
title: Understanding the Cloudify platform deployment modes
description: Understanding the Cloudify platform deployment modes.
category: Installation
draft: false
weight: 5
---

Before you deploy your Cloudify platform, please use this page to get familiar with the different deployment options for the Cloudify Platform and select the mode that suits you best.

Cloudify offers the following modes of installation:

* All-in-one single box deployment
* Cloudify Compact cluster (3 nodes)
* Cloudify fully distributed cluster (9+ nodes)


## Cloudify All-in-One##

All-in-One (AIO) deployment is based on a single Cloudify box (single VM/Container) running all the Cloudify components, mainly the manager, the database and the messaging queue.
An AIO deployment is recommended for non-mission critical use when High-availability is not required and the scale is not extreme.
Cloudify AIO is typically used for development and testing systems, but also common in production for smaller-scale areas.

To learn more about installing an All-in-One Cloudify platform, as an rpm or leveraging OpenStack/Docker container images, please continue to:

* [Installing and Configuring a Cloudify Manager]({{< relref "install_maintain/installation/installing-manager" >}})
* [Deploying a Cloudify Manager Image]({{< relref "install_maintain/installation/manager-image" >}})


## Cloudify Compact cluster (3 nodes)##

The Cloudify compact cluster deployment is based on 3 servers, each running all of the Cloudify services, where the services are deployed in an active-active approach with a high-availability setup.
A Compact cluster provides an enterprise grade Cloudify deployment suitable to almost any organization, with a performance and scale equivalent to a fully distributed cluster containing 3 managers and with the option of further scaling using higher form factor hardware. The compact cluster is designed for mission critical use.

To learn more about installing the Cloudify Compact Cluster please continue to:

* [Cloudify Compact cluster installation guide]({{< relref "install_maintain/installation/three-nodes-cluster" >}})

{{% note %}}  
Note! The above mentioned page will guide you how to manually deploy a Compact cluster. Cloudify provides an automated flow that simplifies the deployment over three existing VMs. To use the Cloudify Cluster Manager and automate the cluster deployment flow read: [Cloudify Cluster Manager package] ({{< relref "install_maintain/installation/cfy-cluster-manager.md" >}})
{{% /note %}}


## Cloudify fully distributed cluster ##

The Cloudify platform can be deployed as a fully distributed cluster, running each of the Cloudify services (mainly the manager, the database, and the messaging queue) on a dedicated VM/node. This mode of installation provides the complete flexibility to deploy the database and the messaging queue in a highly available mode (3 VMs per each service), or leverage external services for them in the form of an external service or a public managed service such as Amazon RDS. It further allows scaling leveraging 3 or more manager servers in an active-active mode.

Running the Cloudify platform as a fully distributed cluster provides the most flexibility and scaling options and fits any enterprise for mission critical use.

To learn more about installing the Cloudify fully distributed Cluster please continue to:

* [Cloudify fully distributed cluster installation guide]({{< relref "install_maintain/installation/installing-cluster" >}})
* [Distributed Cluster with External Database and Messaging queue]({{< relref "install_maintain/installation/installing-external-db-and-queue-cluster" >}})

{{% note %}}  
Note! The above mentioned page will guide you how to manually deploy a Cloudify cluster. Cloudify provides an automated flow that simplifies the deployment over three existing VMs. To use the Cloudify Cluster Manager and automate the cluster deployment flow read: [Cloudify Cluster Manager package] ({{< relref "install_maintain/installation/cfy-cluster-manager.md" >}})
{{% /note %}}
