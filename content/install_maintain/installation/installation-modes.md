---
title: Understanding the Cloudify platform deployment modes
description: Understanding the Cloudify platform deployment modes.
category: Installation
draft: false
weight: 5
---

Before you deploy your {{< param product_name >}} platform, please use this page to get familiar with the different deployment options for the {{< param product_name >}} Platform and select the mode that suits you best.

{{< param product_name >}} offers the following modes of installation:

* All-in-one single box deployment
* Compact cluster (3 nodes)
* Fully distributed cluster (9+ nodes)


## {{< param product_name >}} All-in-One##

All-in-One (AIO) deployment is based on a single {{< param product_name >}} box (single VM/Container) running all the {{< param product_name >}} components, mainly the manager, the database and the messaging queue.
An AIO deployment is recommended for non-mission critical use when High-availability is not required and the scale is not extreme.
{{< param product_name >}} AIO is typically used for development and testing systems, but also common in production for smaller-scale areas.

To learn more about installing an All-in-One {{< param product_name >}} platform, as an rpm or leveraging OpenStack/Docker container images, please continue to:

* [Installing and Configuring a {{< param cfy_manager_name >}}]({{< relref "install_maintain/installation/installing-manager" >}})
* [Deploying a {{< param cfy_manager_name >}} Image]({{< relref "install_maintain/installation/manager-image" >}})


## {{< param product_name >}} Compact cluster (3 nodes)##

The {{< param product_name >}} Compact cluster deployment is based on 3 servers, each running all of the {{< param product_name >}} services, where the services are deployed in an active-active approach with a high-availability setup.
A Compact cluster provides an enterprise grade {{< param product_name >}} deployment suitable to almost any organization, with a performance and scale equivalent to a fully distributed cluster containing 3 managers and with the option of further scaling using higher form factor hardware. The compact cluster is designed for mission critical use.

To learn more about installing the Compact Cluster please continue to:

* [Compact cluster installation guide]({{< relref "install_maintain/installation/three-nodes-cluster" >}})

{{% note %}}  
Note! The above mentioned page will guide you how to manually deploy a Compact cluster. {{< param product_name >}} provides an automated flow that simplifies the deployment over three existing VMs. To use the Cluster Manager package and automate the cluster deployment flow read: [Cluster Manager package] ({{< relref "install_maintain/installation/cfy-cluster-manager.md" >}})
{{% /note %}}


## {{< param product_name >}} Fully distributed cluster ##

The {{< param product_name >}} platform can be deployed as a fully distributed cluster, running each of the {{< param product_name >}} services (mainly the manager, the database, and the messaging queue) on a dedicated VM/node. This mode of installation provides the complete flexibility to deploy the database and the messaging queue in a highly available mode (3 VMs per each service), or leverage external services for them in the form of an external service or a public managed service such as Amazon RDS. It further allows scaling leveraging 3 or more manager servers in an active-active mode.

Running the {{< param product_name >}} platform as a fully distributed cluster provides the most flexibility and scaling options and fits any enterprise for mission critical use.

To learn more about installing the {{< param product_name >}} fully distributed Cluster please continue to:

* [Fully distributed cluster installation guide]({{< relref "install_maintain/installation/installing-cluster" >}})
* [Distributed Cluster with External Database and Messaging queue]({{< relref "install_maintain/installation/installing-external-db-and-queue-cluster" >}})

{{% note %}}  
Note! The above mentioned page will guide you how to manually deploy a {{< param product_name >}} cluster. {{< param product_name >}} provides an automated flow that simplifies the deployment over three existing VMs. To use the Cluster Manager package and automate the cluster deployment flow read: [Cluster Manager package] ({{< relref "install_maintain/installation/cfy-cluster-manager.md" >}})
{{% /note %}}
