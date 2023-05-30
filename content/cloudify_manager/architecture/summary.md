+++
title = "Summary"
description = "Platform Manager"
weight = 10
alwaysopen = false
+++

## Overview
Before deploying the {{< param product_name >}} platform, please use this section to get familiar with the different deployment options for the {{< param product_name >}} Platform and select the mode that suits you best.

{{< param product_name >}} offers the following modes of installation:

* All-in-one single box deployment - Available for Community & Premium
* Compact cluster (3 nodes) - Premium only
* Fully distributed cluster (9+ nodes) - Premium only

## {{< param product_name >}} All-in-One 

All-in-One (AIO) deployment is based on a single {{< param product_name >}} box (single VM/ container) running all the {{< param product_name >}} components, mainly the manager, the database, and the messaging queue.
An AIO deployment is recommended for non-mission critical use when high-availability is not required and the scale is not extreme.
{{< param product_name >}} AIO is typically used for development and testing systems but is also common in production for smaller-scale areas.

To learn more about installing an AIO {{< param product_name >}} platform, as an rpm or leveraging OpenStack, Docker container images, please continue to:

### Community 
- [Docker]({{< relref "cloudify_manager/community/install_and_configure/docker.md" >}})
- [Helm Chart (Kubernetes)]({{< relref "cloudify_manager/community/install_and_configure/helm.md" >}})
- [CentOS/RHEL]({{< relref "cloudify_manager/community/install_and_configure/centos_rhel.md" >}})
- [QCOW2 Image (OpenStack)]({{< relref "cloudify_manager/community/install_and_configure/image.md" >}})
### Premium
- [Docker]({{< relref "cloudify_manager/premium/aio/install_and_configure/docker.md" >}})
- [Helm Chart (Kubernetes)]({{< relref "cloudify_manager/premium/aio/install_and_configure/helm.md" >}})
- [CentOS/ RHEL]({{< relref "cloudify_manager/premium/aio/install_and_configure/centos_rhel.md" >}})
- [AWS AMi]({{< relref "cloudify_manager/premium/aio/install_and_configure/aws.md" >}})
- [QCOW2 Image (OpenStack)]({{< relref "cloudify_manager/premium/aio/install_and_configure/image.md" >}})
 

## {{< param product_name >}} Compact Cluster (3 Nodes)

The {{< param product_name >}} Compact Cluster deployment is based on 3 servers, each running all of the {{< param product_name >}} services. Where the services are deployed in an active-active approach with a high-availability setup.
A Compact Cluster provides an enterprise-grade {{< param product_name >}} deployment suitable to almost any organization with a performance and scale equivalent to a fully distributed cluster containing 3 managers and with the option of further scaling using higher form factor hardware. The Compact Cluster is designed for mission-critical use and is availabel for Premium only.

To learn more about installing the Compact Cluster please continue to:

* [Compact Cluster Installation Guide]({{< relref "cloudify_manager/premium/compact/" >}})

{{% note %}}
Note: The above-mentioned section will guide you on how to deploy a Compact Cluster manually. {{< param product_name >}} provides an automated flow that simplifies the deployment over 3 existing VMs. To use the Cluster Manager package and automate the cluster deployment flow read: [Cluster Manager Package]({{< relref "cloudify_manager/premium/compact/install_and_configure/cluster_manager.md" >}}).
{{% /note %}}

## {{< param product_name >}} Fully Distributed Cluster

The {{< param product_name >}} platform can be deployed as a fully distributed cluster, running each of the {{< param product_name >}} services (mainly the manager, the database, and the messaging queue) on a dedicated VM/ node. This mode of installation provides the complete flexibility to deploy the database, and the messaging queue in a highly available mode (3 VMs per service), or leverage external services for them in the form of an external service or a public managed service such as Amazon RDS. It further allows scaling by leveraging 3 or more manager servers in an active-active mode.

Running the {{< param product_name >}} platform as a fully distributed cluster provides the most flexibility, scaling options, and fits any enterprise for mission-critical use.

To learn more about installing the {{< param product_name >}} fully distributed cluster please continue to:

* [Fully Distributed Cluster Installation Guide]({{< relref "cloudify_manager/premium/fully_distributed/install_and_configure/manual.md" >}})
* [Distributed cluster with external database and messaging queue]({{< relref "cloudify_manager/premium/fully_distributed/install_and_configure/external_db_and_mq.md" >}})
* [Helm chart]({{< relref "cloudify_manager/premium/helm/" >}})

{{% note %}}  
Note: The above-mentioned section will guide you on how to deploy a distributed cluster manually. {{< param product_name >}} provides an automated flow that simplifies the deployment over 9 existing VMs. To use the Cluster Manager package and automate the cluster deployment flow read: [Cluster Manager Package] ({{< relref "cloudify_manager/premium/fully_distributed/install_and_configure/cluster_manager.md" >}}).
{{% /note %}}

## {{< param product_name >}} on Kubernetes

The {{< param product_name >}} platform can be deployed on K8s using the Helm chart. {{< param product_name >}} creates a stateful pod that will require persistence volume. It can be provisioned as an All-in-One, that contains all three layers ({{< param cfy_manager_name >}}, Database, and Message Queue) or deployed as a cluster where the Manager is deployed on a separate pod and PostgreSQL DB or RabbitMQ Message Queue are either deployed on Kubernetes or used as external resources. 

- [Community - AIO]({{< relref "cloudify_manager/premium/helm/" >}})
- [Premium - AIO]({{< relref "cloudify_manager/premium/helm/" >}})
- [Premium - Distributed]({{< relref "cloudify_manager/premium/helm/" >}})

