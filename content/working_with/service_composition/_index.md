---
title: Service Composition
description: 
weight: 80
alwaysopen: false
aliases: /service_composition/overview/
---

# Introduction
Applications, network services and most software solutions are typically composed of multiple components. These may be cloud-native micro-services or simply smaller scale services leveraged by the overarching service to create a composite solution. Typically there are two types of such services:

* A shared resource, is a service used by multiple other services, for example a database which is leveraged by multiple applications. The shared resource is usually an existing entity and deployment of the application service will not provision the shared resource, it will only interact with it. The [SharedResource]({{< relref "working_with/service_composition/shared-resource.md" >}}) node type allows defining such a service, and the blueprint may contain dependencies to the shared resource and manage complex relationships.

* A [Component]({{< relref "working_with/service_composition/component.md" >}}) node type represents a service which is part of the overarching service and used exclusively by that service. An example would be a virtual machine running dedicated OS, a load balancer, or any other micro-service. The “Component” node type enables the user to connect a deployment to another deployment, in effect enabling “chaining” of applications or services.
