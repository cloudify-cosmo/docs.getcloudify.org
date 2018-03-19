---
layout: bt_wiki
title: Cloudify Kubernetes Provider
category: Kubernetes
draft: false
weight: 300
---

## Overview

The Cloudify Kubernetes Provider is a Kubernetes "cloud provider". This means that it performs all infrastructure-related configurations.

For example, when a new Kubernetes Node is created, Kubernetes asks Cloudify to provision the necessary compute, network, and storage resources. Cloudify will then turn to the cloud, or combination of clouds, of your choice, for example any combination of AWS, Azure, Openstack, GCP, VSphere, Baremetal, etc. Once Cloudify has provisioned the resources they are sent back to Kubernetes for its consumption.


### Functionality

The Cloudify Kubernetes Provider can manage:

* Provisioning Kubernetes nodes
* Kubernetes Cluster Auto-scaling
* Kubernetes Load-balancer exposing
* Provisioning and mounting volumes to Kubernetes Nodes

## Requirements


* A Centos 7 image in your cloud of choice.
* Cloudify 4.2 or above.


## Setup

You will install a new Kubernetes Cluster using a Cloudify blueprint-deployment.

### Pre-installation Steps

First, you must install the required plugins. In your Cloudify UI, navigate to "System Resources". In the "Plugins" panel, select upload. Upload the following wagon-plugin.yaml pairs:

* [Cloudify Kubernetes Plugin](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/releases).
* [Cloudify Utilities Plugin](https://github.com/cloudify-incubator/cloudify-utilities-plugin/releases).


If you do not already have the IaaS plugin of your choice uploaded, do so now:

* [Cloudify GCP Plugin](https://github.com/cloudify-cosmo/cloudify-gcp-plugin/releases).
* [Cloudify Azure Plugin](https://github.com/cloudify-incubator/cloudify-azure-plugin/releases).
* [Cloudify VSphere Plugin](https://github.com/cloudify-cosmo/cloudify-vsphere-plugin/releases).
* [Cloudify AWS Plugin](https://github.com/cloudify-cosmo/cloudify-aws-plugin/releases).
* [Cloudify AWSSDK Plugin](https://github.com/cloudify-incubator/cloudify-awssdk-plugin/releases).
* [Cloudify Openstack Plugin](https://github.com/cloudify-cosmo/cloudify-openstack-plugin/releases).


Next, in your Cloudify UI, navigate to "System Resources". In the "Secrets" panel, select "Create". Create the following secrets with "null" values.

* `kubernetes_master_ip`
* `kubernetes_master_port`
* `kubernetes_certificate_authority_data`
* `kubernetes-admin_client_key_data`
* `kubernetes-admin_client_certificate_data`

The Kubernetes secrets are just place holders, so to do this nice and quick, just copy and paste this one-liner into your CLI:

{{< gsHighlight  bash  >}}
for i in kubernetes_master_ip kubernetes_master_port kubernetes_certificate_authority_data kubernetes-admin_client_key_data kubernetes-admin_client_key_data kubernetes-admin_client_certificate_data; do cfy secrets create $i -s 'null'; done
{{< /gsHighlight >}}

Next add the real values for these secrets:

* `cfy_password`
* `cfy_user`
* `cfy_tenant`


### Installation

In your Cloudify Manager UI, navigate to "Local Blueprints". Select "Upload".

In the "Blueprint URL", field, paste the latest version of the [Kubernetes Blueprint - blueprint-package](https://github.com/cloudify-examples/simple-kubernetes-blueprint/releases). For example, upload the `cloudify-kubernetes-4.3-14.tar.gz` file.

In the "filename", field, select the relevant cloud blueprint file, such as "aws-blueprint.yaml". Click Upload.

_Note: This is a large file, so it may take some time to upload. If for some reason this process fails, upload via the CLI._

Next, go to Deployments and select the deployment that you just created. Select "Install".

To do this nice and quick from the CLI, copy the below command, changing the blueprint filename to match your IaaS, and execute:

{{< gsHighlight  bash  >}}
cfy install https://github.com/cloudify-examples/simple-kubernetes-blueprint/releases/download/cloudify-kubernetes-4.3-14/cloudify-kubernetes-4.3-14.tar.gz --blueprint-filename gcp-blueprint.yaml --blueprint-id kube
{{< /gsHighlight >}}
