---
layout: bt_wiki
title: Helm
description: Deploy a Manager to Kubernetes with a helm chart.
category: Installation
draft: false
weight: 40
---

## Overview

The {{< param cfy_manager_name >}} may be installed to a Kubernetes cluster using our official [helm chart](https://github.com/cloudify-cosmo/cloudify-helm).
You have two options for installation: AIO helm chart and {{< param product_name >}} manager worker helm chart, to better understand each option read about it below.

## Prerequisites
{{% note title="Prerequisites" %}}
* Existing Kubernetes cluster
* Installed [Helm package manager](https://helm.sh/)
{{% /note %}}

# {{< param cfy_manager_name >}} AIO Helm Chart  ( Community Version )

## Description

A Helm chart for {{< param cfy_manager_name >}} is:

* Not highly available, has one replica only.
* Has no persistent volume to survive restarts or failures.
* Has all components on board (as part of docker container): Message Broker and DB part of it.

**This is the best and simplest way to make yourself familiar with {{< param product_name >}}, running a {{< param cfy_manager_name >}} AIO in a matter of minutes.**

## Installation
```bash
helm repo add cloudify-helm https://cloudify-cosmo.github.io/cloudify-helm

helm install cloudify-manager-aio cloudify-helm/cloudify-manager-aio
```
To understand all available options AIO, the {{< param cfy_manager_name >}} chart has, please read [{{< param product_name >}} AIO Helm chart]({{< relref "cloudify_manager/premium/helm/installing-helm-aio.md" >}}).


## {{< param cfy_manager_name >}} Worker Helm Chart  ( Premium Version )

### Description
 
A Helm chart for {{< param cfy_manager_name >}} is:

* Highly available, can be deployed with multiple replicas, available only when used with NFS Volume. ( Tested with EFS of AWS, FIlestore of GCP, Azure File Storage)
* Use persistent volume to survive restarts or failures.
* Use external DB (postgress), which may be deployed via public Helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami/postgresql
* Use external Message Brokes (rabbitMQ), which may be deployed via public Helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami

This is how the setup looks after it's deployed to 'cfy-example' namespace (it's possible to have multiple replicas (pods) of {{< param cfy_manager_name >}}):

![cfy-manager](/images/helm/cfy-example.png)

### How to create and deploy such a setup?

1. Deployment of DB (Postgres).

2. Deployment of Message Broker (RabbitMQ).

3. Deployment of {{< param cfy_manager_name >}} worker.

You need to deploy DB and Message Broker before deploying {{< param cfy_manager_name >}} worker.


To better understand how to install and configure {{< param cfy_manager_name >}} worker setup please read [{{< param cfy_manager_name >}} worker helm chart]({{< relref "cloudify_manager/premium/helm/installing-helm-worker.md" >}})

## Deployment Examples

* [Deployment to Azure]({{< relref "cloudify_manager/premium/helm//installing-helm-aks.md" >}})
* [Deployment to GCP]({{< relref "cloudify_manager/premium/helm/installing-helm-gke.md" >}})
* [Deployment to AWS]({{< relref "cloudify_manager/premium/helm/installing-helm-eks.md" >}})