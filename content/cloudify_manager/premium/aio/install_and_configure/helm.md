+++
title = "Helm"
description = "Helm"
weight = 20
alwaysopen = false
+++

## Overview
The Cloudify Manager may be installed to the Kubernetes cluster using our official [Helm chart](https://github.com/cloudify-cosmo/cloudify-helm).

## Prerequisites 

{{% note %}}
* Existing Kubernetes cluster
* An installed [Helm package manager](https://helm.sh/)
{{% /note %}}

## Description

Helm chart for Cloudify manager is:

* Not highly available, has one replica only
* Has no persistent volume to survive restarts/ failures
* Has all components on board (as part of Docker container): Message Broker and DB part of it

## Install

```bash
helm repo add cloudify-helm https://cloudify-cosmo.github.io/cloudify-helm

helm install cloudify-manager-aio cloudify-helm/cloudify-manager-aio
```

## Configure

To understand all available options the AIO Cloudify Manager Helm chart has, please read the [Cloudify AIO Helm chart]({{< relref "cloudify_manager/premium/helm/installing-helm-aio.md" >}}).
