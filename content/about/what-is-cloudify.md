---
layout: bt_wiki
title: What Is Cloudify?
category: Introduction
draft: false
weight: 100
aliases: /intro/what-is-cloudify/
---

Cloudify is an open-source multi-cloud and edge orchestration platform.

Cloudify allows organizations an effortless transition to public cloud and Cloud-Native architecture by enabling them to automate their existing infrastructure alongside cloud native and distributed edge resources. Cloudify also allows users to manage different orchestration and automation domains as part of **one** common CI/CD pipeline.

# Key Features

### Everything as a Code

[Service Composition]({{< relref "working_with/service_composition/_index.md" >}}) Domain-Specific Language (DSL) - enabling modeling of a composite service,  containing components from multiple Cloudify services and other orchestration domains. It specifically handles the modeling of the relationship between services, handles cascading workflows, shared resources, distributed life-cycle management and more.


### Orchestrator of orchestrators

Built-in integration with **infrastructure orchestration** domains such as [AWS Cloud formation]({{< relref "working_with/official_plugins/infrastructure/aws" >}}), [Azure ARM]({{< relref "working_with/official_plugins/infrastructure/azure" >}}), [Ansible]({{< relref "working_with/official_plugins/orchestration/ansible" >}}), [Terraform]({{< relref "working_with/official_plugins/orchestration/terraform" >}}).

### Kubernetes Management

Orchestration of cloud native [Kubernetes services]({{< relref "working_with/official_plugins/orchestration/kubernetes" >}}) across multiple Kubernetes clusters such as OpenShift, GKE, EKS, and AKS and KubeSpray. Cloudify also provides a built-in blueprint to automate cluster setup and configuration.

### Native CI/CD Support

Built-in Integration with Jenkins and other CI/CD platforms provides a single ‘stop-shop’ for integrating all orchestration domains to the CI/CD pipeline.

### Consistent workflow management across all the infrastructure domains

Cloudify uses intent-based modeling (also known as Infrastructure as Code) where users define the desired state of the system rather than the way to get there. Cloudify autogenerates the install, uninstall, heal, and scale workflow from that definition (implicit workflow). Cloudify also allows users to define their own custom workflow to interact with the system as part of the day-2 operation. Cloudify supports multiple execution methods starting from SSH using Fabric and script as well as using a configuration management platform such as Ansible.

### Operability

Cloudify is designed with ease of operation in mind. Enhancing the level of information the user can get while reducing the level of Cloudify expertise required to do so.
The new Cloudify UI provides a simple way to navigate through the topology view (Intent) via the actual workflow steps that have been executed on a particular deployment instance. Troubleshooting is made easy via a dependency graph and filtering relevant logs that are associated with a specific step in that workflow.

### Customizable Portal and Catalogue Service

Cloudify provides a highly customized [catalog and portal]({{< relref "working_with/console" >}}) framework that is suitable for providing a self-service experience and is tenant aware. It can be easily white-labelled, adding preferred custom widgets and pages and customizing views that each user has based on role.


### Enhanced Security and RBAC support

Cloudify provides end security of its internal and external resources.
This includes support for secret store, encryption of all internal communication channels, as well as multi-tenancy and RBAC support to control who gets access to each of the Cloudify managed resources.

### Blueprint modeling and design using the Cloudify Composer.

The [Cloudify Composer]({{< relref "developer/composer" >}}) (blueprint designer) provides a simple way to write blueprints. It supports both textual and graphical editing and allows users to switch between these two modes during the same editing session.


### Pluggability

Pluggability is one of the core, unique features of Cloudify. It provides reusable components abstraction for the system.  <br>
  You can model anything that you want in a descriptive language, for example IaaS, clouds, configuration management tools, SDN components, NFV components, and so on.  <br>
  Cloudify includes a number of officially supported out-of-the-box plugins, but you can also build your own.<br>

### Cloudify Spire

Cloudify Spire was designed to handle large scale deployment such as multi-site and Edge use cases. Cloudify Spire is built as a ‘manager of the manager’ architecture where each manager acts as an autonomous unit of scale that controls a subset of the overall resources.  Cloudify Spire provides single-point access to manage all managers as well as maintain their daily operations such as upgrading , healing and scaling.
