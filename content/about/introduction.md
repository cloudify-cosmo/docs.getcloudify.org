---
title: Introduction
category: Introduction
draft: false
weight: 100
aliases: /intro/introduction/
---

{{< param product_name >}} is an open-source multi-cloud and edge orchestration platform.

{{< param product_name >}} allows organizations an effortless transition to public cloud and Cloud-Native architecture by enabling them to automate their existing infrastructure alongside cloud native and distributed edge resources. {{< param product_name >}} also allows users to manage different orchestration and automation domains as part of **one** common CI/CD pipeline.

# Key Features

### <span style="color:#0077fc">Everything as a Code</span>

[Service Composition]({{< relref "working_with/service_composition/_index.md" >}}) Domain-Specific Language (DSL) - enabling modeling of a composite service,  containing components from multiple {{< param product_name >}} services and other orchestration domains. It specifically handles the modeling of the relationship between services, handles cascading workflows, shared resources, distributed life-cycle management, and more.


### <span style="color:#0077fc">Orchestrator of orchestrators</span>

Built-in integration with **infrastructure orchestration** domains such as [AWS Cloud formation]({{< relref "working_with/official_plugins/Infrastructure/aws.md" >}}), [Azure ARM]({{< relref "working_with/official_plugins/Infrastructure/azure.md" >}}), [Ansible]({{< relref "working_with/official_plugins/Configuration/ansible.md" >}}), and [Terraform]({{< relref "working_with/official_plugins/Orchestration/terraform.md" >}}).

### <span style="color:#0077fc">Kubernetes Management</span>

Orchestration of cloud-native [Kubernetes services]({{< relref "working_with/official_plugins/Orchestration/kubernetes.md" >}}) across multiple Kubernetes clusters such as OpenShift, GKE, EKS, AKS, and KubeSpray. {{< param product_name >}} also provides a built-in blueprint to automate cluster setup and configuration.

### <span style="color:#0077fc">Native CI/CD Support</span>

Built-in Integration with [Jenkins]({{< relref "working_with/integration/jenkins-plugin.md" >}}) and other CI/CD platforms provides a single ‘stop-shop’ for integrating all orchestration domains into the CI/CD pipeline.

### <span style="color:#0077fc">Consistent workflow management across all the infrastructure domains</span>

{{< param product_name >}} uses intent-based modeling (also known as Infrastructure as Code) where users define the desired state of the system rather than the way to get there. {{< param product_name >}} autogenerates the install, uninstall, heal, and scale workflow from that definition a.k.a [implicit workflow]({{< relref "working_with/workflows/built-in-workflows.md" >}}). {{< param product_name >}} also allows users to define their own custom workflow to interact with the system as part of the day-2 operation. {{< param product_name >}} supports multiple execution methods starting from SSH using Fabric and script as well as using a configuration management platform such as Ansible.

### <span style="color:#0077fc">Operability</span>

{{< param product_name >}} is designed with ease of operation in mind. Enhancing the level of information the user can get while reducing the level of {{< param product_name >}} expertise required to do so.
The new [{{< param cfy_console_name >}}]({{< relref "working_with/console/" >}})  provides a simple way to navigate through the topology view (Intent) via the actual workflow steps that have been executed on a particular deployment instance. Troubleshooting is made easy via a dependency graph and filtering relevant logs that are associated with a specific step in that workflow.

All this functionality is available also through [Command Line Interface]({{< relref "cli" >}}) and [REST API]({{< relref "developer/apis/" >}}).

### <span style="color:#0077fc">Customizable Portal and Catalogue Service</span>

{{< param product_name >}} provides a highly customized [catalog and portal]({{< relref "developer/writing_widgets/" >}}) framework that is suitable for providing a self-service experience and is tenant aware. It can be easily white-labeled, adding preferred custom widgets and pages and customizing views that each user has based on role.


### <span style="color:#0077fc">Enhanced Security and RBAC support</span>

{{< param product_name >}} provides end [security] ({{< relref "cloudify_manager/architecture/security">}}) of its internal and external resources.
This includes support for secret store, encryption of all internal communication channels, as well as multi-tenancy and RBAC support to control who gets access to each of the {{< param product_name >}} managed resources.

### <span style="color:#0077fc">Blueprint modeling and design using the {{< param cfy_composer_name >}}</span>

The [{{< param cfy_composer_name >}}]({{< relref "developer/composer" >}}) (blueprint designer) provides a simple way to write blueprints. It supports both textual and graphical editing and allows users to switch between these two modes during the same editing session.


### <span style="color:#0077fc">Pluggability</span>

Pluggability is one of the core, unique features of {{< param product_name >}}. It provides reusable components abstraction for the system.  <br>
  You can model anything that you want in descriptive language, for example, IaaS, clouds, configuration management tools, SDN components, NFV components, and so on.  <br>
  {{< param product_name >}} includes a number of [officially supported out-of-the-box plugins]({{< relref "/working_with/official_plugins/" >}}), but you can also build your own.<br>

### <span style="color:#0077fc">Spire</span>

{{< param cfy_spire_name >}} was designed to handle large-scale deployment such as multi-site and Edge use cases. {{< param cfy_spire_name >}} is built as a ‘manager of the manager’ architecture where each manager acts as an autonomous unit of scale that controls a subset of the overall resources.  {{< param cfy_spire_name >}} provides single-point access to manage all managers as well as maintain their daily operations such as upgrading, healing, and scaling.
