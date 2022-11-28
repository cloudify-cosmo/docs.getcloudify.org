+++
title = "Cloudify as a Kubernetes Service"
description = "Deploy Cloudify to Kubernetes cluster with our Helm chart"
weight = 8
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

The {{< param cfy_manager_name >}} may be installed on Kubernetes cluster using the official [Helm chart](https://github.com/cloudify-cosmo/cloudify-helm). There are two options for installation: the All In One (AIO) chart and the Cloudify Manager Worker chart. Each option is described in more detail below.

## Prerequisites
To use the official Helm charts, you will need:

* An existing Kubernetes cluster to deploy the charts into
* The [Helm package manager](https://helm.sh/) installed and configured to talk with your cluster

## {{< param company_name >}} AIO Helm chart (Community Version)

The {{< param cfy_manager_name >}} AIO Helm chart is the preferred way to become familiar with {{< param company_name >}}. It is a very simple installation that can be deployed in minutes.

The chart has several limitations that you should be aware of, as this option is only suitable for a basic trial of the {{< param company_name >}} product:

* No high availability: only a single replica is deployed.
* No persistent volume is configured for data to persist across pod restarts or failures.
* All components are contained within a single container image, including the message broker and database.

### Installation

To the AIO manager via Helm, add the repository to Helm and install the chart as show below:

```bash
helm repo add cloudify-helm https://cloudify-cosmo.github.io/cloudify-helm

helm install cloudify-manager-aio cloudify-helm/cloudify-manager-aio
```

To understand all available options for the AIO {{< param cfy_manager_name >}} chart, please see the [Cloudify AIO Helm chart documentation.]({{< relref "install_maintain/installation/helm-chart/installing-helm-aio" >}})


## {{< param company_name >}} Manager Worker Helm chart (Premium Version)

The {{< param company_name >}} Manager Worker Helm chart deploys a highly available installation of the Premium version of the {{< param cfy_manager_name >}}. This includes several features that are appropriate for a production installation:

* High availability with multiple replicas. Please note that an NFS volume is required for HA. This has been tested with AWS EFS, GCP Filestore, and Azure File Storage.
* The use of persistent volumes to survive pod restarts or failures.
* External PostgreSQL database support. This can also be deployed into Kubernetes by using the [Bitnami PostgreSQL Helm chart](https://github.com/bitnami/charts/tree/master/bitnami/postgresql)
* External RabbitMQ Message Broker support. This can also be deployed into Kubernetes using the [Bitnami RabbitMQ Helm chart](https://github.com/bitnami/charts/tree/master/bitnami)

This is how the setup looks after it's deployed to 'cfy-example' namespace (it's possible to have multiple replicas (pods) of cloudify manager):

The diagram below shows an example architecture deployed to the `cfy-example` namespace. Note that it is possible to have multiple pod replicas of the {{< param cfy_manager_name >}}.

![cfy-manager](/images/helm/cfy-example.png)

### Installation

Installation of the {{< param company_name >}} Manager Worker Helm chart involves several steps. Please consult the [{{< param company_name >}} Manager Worker Helm chart documentation]({{< relref "install_maintain/installation/helm-chart/installing-helm-worker" >}}) for the complete process. At a high level, this involves the following steps:

1. Deployment of DB (Postgres).
2. Deployment of Message Broker (rabbitMQ).
3. {{< param company_name >}} Manager Worker deployment

Note that the database and message broker must be deployed prior to deploying the Manager Worker.

### Hosted Kubernetes Deployment Examples

The documentation below covers installation of the {{< param company_name >}} Manager Worker Helm chart across different hosted Kubernetes services:

* [Deployment to Azure]({{< relref "cloudify_manager/premium/helm/installing-helm-aks" >}})
* [Deployment to GCP]({{< relref "cloudify_manager/premium/helm/installing-helm-gke" >}})
* [Deployment to AWS]({{< relref "cloudify_manager/premium/helm/installing-helm-eks" >}})
