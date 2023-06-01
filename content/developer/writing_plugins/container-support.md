---
title: A Guide To Container Support For Kubernetes And Docker
category: Writing Plugins
draft: false
weight: 1450
aliases: /plugins/container-support/
---

## Overview


{{< param product_name >}} supports integrations with Docker and Docker-based container managers, such as Kubernetes. When orchestrating container orchestrators, {{< param product_name >}} focuses on the infrastructure layer, managing lifecycle events between the container and the non-container worlds.


### Service Orchestration

Independently from the orchestration of infrastructure, {{< param product_name >}} provides the ability to orchestrate heterogenous services across platforms. By leveraging the strength of TOSCA modeling, {{< param product_name >}} can manage the instantiation and configuration of service chains, regardless of the target platform.

![diagram of services orchestration]( /images/plugins/services-orch.png )

For more information, see the documentation on our [Kubernetes Plugin]({{< relref "working_with/official_plugins/Orchestration/kubernetes.md" >}}).
