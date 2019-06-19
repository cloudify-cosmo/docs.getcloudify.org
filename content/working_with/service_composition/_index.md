---
title: Service Composition
description: 
weight: 80
alwaysopen: false
aliases: /service_composition/overview/
---

# Introduction
As a part of the modern movement of creating "cloud-native" architecture, the standard architecture is "micro-services" architecture
meaning that an application is comprised of multiple services (could be a lot of services). In Cloudify recommended architecture each
service and the entire application is a separate deployment, which there are two kind of: one is a service which
is a part of a group of services, and the other is a service that provides resource/resources for other services like: database, network router,
filesystem and etc.

For representing the shared resource use case the [SharedResource]({{< relref "working_with/service_composition/shared-resource.md" >}}) node type should be used, which will allow creation of blueprint architecture
with dependencies to the shared resource and manage complex relationships.   

For the other use case [Component]({{< relref "working_with/service_composition/component.md" >}}) node type will support handling of application deployment and lifecycle of services the "Component" node type enables the user
to connect a deployment to another deployment, in effect enabling "chaining" of applications or services.
