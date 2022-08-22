+++
title = "Cloudify as Kubernetes Service"
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

## {{< param cfy_manager_name >}} AIO Helm chart (Community Version)

The {{< param cfy_manager_name >}} AIO Helm chart is the preferred way to become familiar with {{< param company_name >}}. It is a very simple installation that can be deployed in minutes.

The chart has several limitations that you should be aware of, as this option is only suitable for basic trial of the {{< param company_name >}} product:

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


## Cloudify manager worker helm chart  ( Premium Version )

### Description
 
It's a helm chart for cloudify manager which is:

* Highly available, can be deployed with multiple replicas, available only when used with NFS Volume. ( Tested with EFS of AWS | FIlestore of GCP | Azure File Storage)
* Use persistent volume to survive restarts/failures.
* Use external DB (postgress), which may be deployed via public helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami/postgresql
* Use external Message Brokes (rabbitMQ), which may be deployed via public helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami

This is how the setup looks after it's deployed to 'cfy-example' namespace (it's possible to have multiple replicas (pods) of cloudify manager):

![cfy-manager](/images/helm/cfy-example.png)

### How to create and deploy such a setup?

1. Deployment of DB (Postgres).

2. Deployment of Message Broker (rabbitMQ).

3. Deployment of Cloudify manager worker.

You need to deploy DB and Message Broker before deploying Cloudify manager worker.


**To better understand how to install and configure cloudify manager worker setup please read [Cloudify manager worker helm chart]({{< relref "install_maintain/installation/helm-chart/installing-helm-worker" >}})**

## Deployment Examples

[Deployment to Azure]({{< relref "install_maintain/installation/helm-chart/installing-helm-aks" >}})

[Deployment to GCP]({{< relref "install_maintain/installation/helm-chart/installing-helm-gke" >}})

[Deployment to AWS]({{< relref "install_maintain/installation/helm-chart/installing-helm-eks" >}})
