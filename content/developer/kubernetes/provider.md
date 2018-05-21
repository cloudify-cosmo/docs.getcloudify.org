---
layout: bt_wiki
title: Cloudify Kubernetes Provider
category: Kubernetes
draft: false
weight: 200
aliases: /kubernetes/provider/
---

# Overview

The Cloudify Kubernetes Provider is a Kubernetes "cloud provider". It performs all infrastructure-related configurations.

For example, when a new Kubernetes Node is created, Kubernetes asks Cloudify to provision the necessary compute, network, and storage resources. Cloudify turns to your cloud provider or your combination of clouds (AWS, Azure, Openstack, GCP, VSphere, Baremetal, etc). Once Cloudify provisions the resources, they are sent back to Kubernetes for its consumption.

## Functionality

The Cloudify Kubernetes Provider can manage:

* Provisioning Kubernetes nodes
* Kubernetes Cluster auto-scaling
* Kubernetes Load-balancer exposing
* Provisioning and mounting volumes to Kubernetes Nodes

# Requirements

* CentOS 7 image in your cloud of choice
* Cloudify 4.2 or above

# Setup

This process installs a new Kubernetes Cluster using a Cloudify blueprint-deployment.

## Pre-installation Steps

Before you install the Kubernetes Provider:

1. Install the required plugins. To do this from the Cloudify Console:

    1. Go to "System Resources".
    1. In the "Plugins" panel, select *Upload*.
    1. Browse to these wagon-plugin.yaml pairs:

        * [Cloudify Kubernetes Plugin](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/releases).
        * [Cloudify Utilities Plugin](https://github.com/cloudify-incubator/cloudify-utilities-plugin/releases).

1. Make sure that you have the IaaS plugin for your IaaS provider:

    * [Cloudify GCP Plugin](https://github.com/cloudify-cosmo/cloudify-gcp-plugin/releases).
    * [Cloudify Azure Plugin](https://github.com/cloudify-incubator/cloudify-azure-plugin/releases).
    * [Cloudify VSphere Plugin](https://github.com/cloudify-cosmo/cloudify-vsphere-plugin/releases).
    * [Cloudify AWS Plugin](https://github.com/cloudify-cosmo/cloudify-aws-plugin/releases).
    * [Cloudify AWSSDK Plugin](https://github.com/cloudify-incubator/cloudify-awssdk-plugin/releases).
    * [Cloudify Openstack Plugin](https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases).

1. Add the blueprint inputs as secrets. To do this from the Cloudify Console:

    1. Navigate to "System Resources".
    1. In the "Secrets" panel, select *Create*.

1. Add these secrets with their real values:

    * `cfy_password`
    * `cfy_user`
    * `cfy_tenant`

## Installation

To install the Kubernetes Provider from the Cloudify Console:

1. Go to "Local Blueprints" and click "Upload".
1. In the "Blueprint URL" field, enter the URL for the latest version of the [Kubernetes Blueprint - blueprint-package](https://github.com/cloudify-examples/simple-kubernetes-blueprint/releases). 
    For example, upload the `cloudify-kubernetes-4.3.1-16.tar.gz` file.
1. In the "filename" field, select the relevant cloud blueprint file, such as "azure.yaml".
1. Click *Upload*.

    _Note: This is a large file, so it may take some time to upload. If for some reason this process fails, upload via the CLI._

1. Go to Deployments, find the deployment that you just created, and click *Install*.

To do this nice and quick from the CLI, copy the below command, change the blueprint filename to match your IaaS, and run it:

```shell
cfy install \
    https://github.com/cloudify-examples/simple-kubernetes-blueprint/releases/download/cloudify-kubernetes-4.3.1-16/cloudify-kubernetes-4.3.1-16.tar.gz \
    --blueprint-filename azure.yaml \
    --blueprint-id kube
```
