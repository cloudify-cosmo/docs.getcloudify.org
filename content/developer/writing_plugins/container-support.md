---
layout: bt_wiki
title: A Guide To Cloudify Container Support For Kubernetes And Docker
category: Writing Plugins
draft: false
weight: 1450
aliases: /plugins/container-support/
---

## Overview


Cloudify supports integrations with Docker and Docker-based container managers, such as Kubernetes. When orchestrating container orchestrators, Cloudify focuses on the infrastructure layer, managing lifecycle events between the container and the non-container worlds.


### Infrastructure Orchestration


Cloudify can be used to deploy, heal, scale, and tear down container clusters.

Cloudify can orchestrate bare metal, virtual platforms, such as Libvirt and Vsphere, and cloud platforms, such as AWS, Openstack, Azure, GCP, etc. This can include networking and storage infrastructure, both virtual and physical.

For more information, see the documentation on our [Kubernetes Provider]({{< relref "developer/kubernetes/provider.md" >}}).


### Service Orchestration

Independently from the orchestration of infrastructure, Cloudify provides the ability to orchestrate heterogenous services across platforms. By leveraging the strength of TOSCA modeling, Cloudify can manage the instantiation and configuration of service chains, regardless of the target platform. 

![diagram of services orchestration]( /images/plugins/services-orch.png )

For more information, see the documentation on our [Kubernetes Plugin]({{< relref "working_with/official_plugins/Configuration/kubernetes.md" >}}) and [Examples]({{< relref "developer/kubernetes/wordpress.md" >}}).
