+++
title = "Helm"
description = "Helm"
weight = 20
alwaysopen = false
+++

Cloudify Manager may be installed on a Kubernetes cluster using our official helm chart. You have two options for installation: AIO helm chart and Cloudify manager worker helm chart, to better understand each option read about it below.

It’s a helm chart for Cloudify Manager which is:

- Highly available, can be deployed with multiple replicas, and available only when used with NFS Volume. ( Tested with EFS of AWS | FIlestore of GCP | Azure File Storage)
- Use persistent volume to survive restarts/failures.
- Use external DB (PostgreSQL), which may be deployed via the public helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami/postgresql
- Use external Message Brokes (rabbitMQ), which may be deployed via public helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami

This is how the setup looks after it’s deployed to ‘cfy-example’ namespace (it’s possible to have multiple replicas (pods) of Cloudify Manager):

TBD: Image for topology

How to create and deploy such a setup? 
1. Deployment of DB (Postgres).
2. Deployment of Message Broker (rabbitMQ).
3. Deployment of Cloudify Manager.

You need to deploy DB and Message Broker before deploying Cloudify Manager.

To better understand how to install and configure Cloudify Manager setup please read Cloudify manager worker helm chart

Deployment Examples

Deployment to Azure

Deployment to GCP

Deployment to AWS
