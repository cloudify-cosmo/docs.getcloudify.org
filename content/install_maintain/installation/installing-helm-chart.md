---
layout: bt_wiki
title: Deploying a Cloudify Manager to Kubernetes
description: Deploy a Cloudify Manager to Kubernetes with a helm chart.
category: Installation
draft: false
weight: 100
---
Cloudify Manager may be installed to Kubernetes cluster using our official [helm chart](https://github.com/cloudify-cosmo/cloudify-helm).
You have two options for installation: AIO helm chart and Cloudify manager worker helm chart, to better understand each option read about it below.

# Cloudify manager AIO helm chart

## Description

It's a helm chart for cloudify manager which is:

* Not highly available, has one replica only.
* Has no persistent volume to survive restarts/failures.
* Has all components on board (as part of docker container): Message Broker and DB part of it.

**This is the best and most simple way to make yourself familiar with cloudify, running a Cloudify manager AIO is a matter of minutes**

## Installation

helm repo add cloudify-helm https://cloudify-cosmo.github.io/cloudify-helm

helm install cloudify-manager-aio cloudify-helm/cloudify-manager-aio

To understand all available options AIO cloudify manager chart has, please read [Cloudify AIO Helm chart](https://github.com/cloudify-cosmo/cloudify-helm/blob/master/cloudify-manager-aio/README.md)


# Cloudify manager worker helm chart

## Description
 
It's a helm chart for cloudify manager which is:

* Highly available, can be deployed with multiple replicas, available only when used with NFS Volume. ( Tested with EFS of AWS | FIlestore of GCP | Azure File Storage)
* Use persistent volume to survive restarts/failures.
* Use external DB (postgress), which may be deployed via public helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami/postgresql
* Use external Message Brokes (rabbitMQ), which may be deployed via public helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami

This is how the setup looks after it's deployed to 'cfy-example' namespace (it's possible to have multiple replicas (pods) of cloudify manager):

![cfy-manager](/images/helm/cfy-example.png)

## How to create and deploy such a setup?

1. Deployment of DB (Postgres).

2. Deployment of Message Broker (rabbitMQ).

3. Deployment of Cloudify manager worker.

You need to deploy DB and Message Broker before deploying Cloudify manager worker.


To better understand how to install and configure cloudify manager worker setup please read [Cloudify manager worker helm chart](https://github.com/cloudify-cosmo/cloudify-helm/blob/master/cloudify-manager-worker/README.md)

# Deployment Examples

[Deployment to Azure](https://github.com/cloudify-cosmo/cloudify-helm/blob/master/examples/azure/README.md)

[Deployment to GCP](https://github.com/cloudify-cosmo/cloudify-helm/blob/master/examples/gcp/README.md)

[Deployment to AWS](https://github.com/cloudify-cosmo/cloudify-helm/blob/master/examples/aws/README.md)