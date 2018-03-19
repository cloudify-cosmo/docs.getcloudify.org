---
layout: bt_wiki
title: Kubernetes Overview
category: Kubernetes
draft: false
weight: 200

---

Cloudify is a powerful partner for Kubernetes when it comes to applications that require integration with non-containerized workloads.

Some workloads can be delivered in a container, but there if often additional non-container configurations that need to be orchestrated. For example, part of an application may include a Windows service, or involve changes to some other custom hardware component. Several organizations have legacy applications that will not be migrated to containers any time soon. These "hybrid cloud" scenarios are where Cloudify comes in to the picture to bridge the gap between the power of containers and hardware, or custom component, orchestration.

![diagram of services orchestration]({{< img "plugins/services-orch.png" >}})


## Integration Points

There are two integration points between Cloudify and Kubernetes: infrastructure orchestration and service orchestration.


#### Cloudify Kubernetes Provider

The "Cloudify Kubernetes Provider" is the first integration point, and relates to the underlying infrastructure, for example:

1. Deployment of a Kubernetes Cluster (via a blueprint).
1. Lifecycle management of the underlying infrastructure, such as healing and scaling of Kubernetes nodes, storage management, and service exposure.

For more information, see [Cloudify Kubernetes Profider]({{< relref "kubernetes/provider.md" >}})


#### Cloudify Kubernetes Plugin

The "Cloudify Kubernetes Plugin" is the second integration point, and relates to Kubernetes API object orchestration, for example:

1. Connecting Kubernetes objects to non-Kubernetes objects, such as a remote Windows service and a Kubernetes Pod.
1. Creating and deleting Kubernetes API objects, such as Pods, Deployments, etc.
1. Updating Kubernetes API objects such as migrating Pods from one Kubernetes Node to another.

For more information, see [Cloudify Kubernetes Plugin]({{< relref "plugins/kubernetes.md" >}})
