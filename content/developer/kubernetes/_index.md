---
title: Kubernetes Integration
description: Kubernetes Integration
weight: 40
alwaysopen: false
---

## Summary

Kubernetes is a container orchestrator whereas Cloudify is a general orchestrator. Kubernetes uses control loops to maintain resource states. Conversely, Cloudify uses event driven workflows to achieve desired states. Cloudify integrates with Kubernetes to orchestrate multi-tier application architectures that include containerized and non-containerized workloads.

## Integration Points

There are two integration points between Cloudify and Kubernetes: infrastructure orchestration and service orchestration.

Infrastructure orchestration is accomplished via the _Cloudify Kubernetes Provider_. Service Orchestration is accomplished via the _Cloudify Kubernetes Plugin_. These two features are not mutually dependent. You can use one without using the other. However, together they enable you to use the best of both Kubernetes and Cloudify.

### Infrastructure Orchestration: Cloudify Kubernetes Provider

The _Cloudify Kubernetes Provider_ is the first integration point, and it is related to managing underlying infrastructure.

For example:

1. Lifecycle management of the underlying infrastructure, such as healing and scaling of Kubernetes nodes, storage management, and service exposure.
1. Deployment of a Kubernetes Cluster (via a blueprint).

To install Kubernetes and the Cloudify Kubernetes Provider, go to [Cloudify Kubernetes Provider]({{< relref "/developer/kubernetes/provider.md" >}}).


### Service Orchestration: Cloudify Kubernetes Plugin

The "Cloudify Kubernetes Plugin" is the second integration point, and it relates to Kubernetes API object orchestration.

For example:

1. Connecting Kubernetes objects to non-Kubernetes objects, such as a remote Windows service and a Kubernetes Pod.
1. Creating and deleting Kubernetes API objects, such as Pods, Deployments, etc.
1. Updating Kubernetes API objects such as migrating Pods from one Kubernetes Node to another.

To learn more, read the documentation on the [Cloudify Kubernetes Plugin]({{< relref "working_with/official_plugins/Configuration/kubernetes.md" >}}).

Or, to deploy a demo application, go to [Kubernetes Wordpress Example]({{< relref "developer/kubernetes/wordpress.md" >}}).

If you need to access your Kubernetes Dashboard from a public API, follow [these instructions]({{< relref "developer/kubernetes/dashboard.md" >}}).

## Why not put everything in a container?

Some workloads can be delivered in a container, but there are often additional non-container configurations that need to be orchestrated. For example, part of an application may include a Windows service, or involve post-start or day two changes to some other custom hardware component.

Also, several organizations have legacy applications that will not be migrated to containers any time soon. These "hybrid cloud" scenarios are where Cloudify comes in to the picture to bridge the gap between the power of containers and hardware, or custom component, orchestration.

![diagram of services orchestration]( /images/plugins/services-orch.png )
