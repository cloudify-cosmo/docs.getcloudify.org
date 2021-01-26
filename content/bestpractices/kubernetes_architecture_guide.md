---
layout: bt_wiki
title: Kubernetes Architecture Explained
category: Manager Architecture
draft: false
abstract: Kubernetes Architecture Explained
weight: 500
aliases: /manager_architecture/create-deployment-flow/
---

# Kubernetes Architecture Explained

The {{< param product_name >}} Kubernetes support consists of three main components:

* [Kubernetes Service Plugin]({{< relref "/working_with/official_plugins/orchestration/kubernetes/" >}}) - The Kubernetes plugin exposes the Kubernetes API into the {{< param product_name >}} TOSCA based DSL. This allows users to deploy a Kubernetes service by referencing a service template or a Helm chart in the git repo. {{< param product_name >}}  [CI/CD integration]({{< relref "/working_with/integration/" >}}) also allows users to run Kubernetes services directly without having to create a {{< param product_name >}} wrapper blueprint. In this case, the Ci/CD plugin takes care of dynamically binding the {{< param product_name >}} blueprint behind the scene.
* [Kubernetes Cluster Blueprint](https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes) - The Kubernetes blueprint provides a pre-canned template for provisioning a Kubernetes cluster. In the case of a managed Kubernetes platform such as GKE or EKS, the blueprint is responsible to set up the user environment. You can view such options [here](https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes/).
* [Kubernetes Workflow]({{< relref "/working_with/official_plugins/orchestration/kubernetes/#workflows" >}}) - The workflow engine is responsible for handling the install and uninstall service workflows as well as day 2 operations such as updating of an existing service.

![kubernetes_architecture]( /images/kubernetes_architecture/kubernetes_architecture.png )

## Key features

- Out of the box support for all major Kubernetes platforms on private and public clouds (OpenShift, KubeSpray, GKE, EKS, and AKS).
- Support multiple authentication methods Token- and “Kube config”- based authentication.
- Resource state management - Block the deployment to a successful completion.
- Reload of a specific Kubernetes service - Continuous updates through reload of a particular service with a new set of input parameters.

### Native Kubernetes Template support

* Service Template by URL or Inline -Load a service template from an external file, git-repo, or define it inline within the blueprint itself.
* Parameters & secret management - Pass inputs to Kubernetes modules through {{< param product_name >}} secrets and render them on the fly through Jinja.
* Dynamic API binding for all Kubernetes resources
  * Built-in resource-type mapping: Deployment, Service, POD, etc.
  * Custom Resource mapping through generic resource node type.
  
### Helm 3 Template Support
[Helm 3 plugin]({{< relref "/working_with/official_plugins/orchestration/helm/" >}}) allows you to create a Helm client for each deployment; add repositories, create releases, and easily deploy an application on any existing Kubernetes cluster.

### Multi Kubernetes Cluster Support
The use cases for multi Kubernetes cluster can be driven by different needs 

* Separate clusters between applications and teams.
* Separating between development and production.
* Multi-Cloud - supporting Kubernetes clusters on multiple clouds.
* Avoiding lock-in - allowing portability between providers.
* Edge / IoT - managing deployment across many distributed Kubernetes clusters on edge devices.

{{< param product_name >}} was designed to manage highly distributed deployments and therefore fit well as the Multi-Cluster Kubernetes service broker.

The {{< param product_name >}} blueprint allows users to define multiple services across different clusters as part of the same deployment template. Users can also use the {{< param product_name >}} [Service Component]({{< relref "/working_with/service_composition/" >}}) DSL to bind a particular service to a Kubernetes cluster dynamically at runtime.

### Interoperability between Kubernetes providers and non-Kubernetes services.

{{< param product_name >}} provides a rich set of out of the box plugins that support VM, Serverless, legacy apps, or any other REST service as part of the same deployment. This allows users to create an automation blueprint that includes Kubernetes and non-Kubernetes services and use the native dependency, relationship, workflow features as with any other node types. This opens up the options to enable interoperability between Kubernetes and non-Kubernetes services in the following way:
* Interoperability between Kubernetes cluster providers - {{< param product_name >}} can manage deployment across multiple Kubernetes clusters using the same deployment.
* Interoperability between Orchestration Platforms - {{< param product_name >}} allows users to define the relationship and pass context information between Different Kubernetes clusters as well as non-Kubernetes orchestrations such as Ansible, Terraform, Cloud Formation, Azure ARM, TOSCA, templates.
* End to End Service Automation  - Enable automation of Kubernetes, SaaS-based services, Function, Legacy services under a common automation scheme.

### Managed as code with built-in integration with CI/CD
{{< param product_name >}} provides built-in integration with a list of [Ci/CD tools]({{< relref "/working_with/integration/" >}}) such as Jenkins, Git Actions, Circle CI, etc.

This integration includes a generic template that allows users to run any Kubernetes service without having to write a {{< param product_name >}} blueprint as a wrapper. The {{< param product_name >}} wrapper blueprint will be attached to the service behind the scene, and in this case, will simplify significantly the learning curve needed to run those services through {{< param product_name >}} and the Ci/CD tool of choice.

### Management UI
The {{< param product_name >}} management UI is focused on service management and less on monitoring the Kubernetes infrastructure. As such it provides a catalog service that provides a simple interface to deploy Helm or native Kubernetes services. Topology view which tracks the service dependency and state of a deployment. Workflow which monitors the execution steps on a particular service. 

#### UI Component

* Service Catalog

![ServiceCatalogue]( /images/kubernetes_architecture/service_catalogue.png )

* Topology view - View Kubernetes task execution and their associated infrastructure resources on a single view

![TopologyView]( /images/kubernetes_architecture/topology_view.png )

* Workflow and log monitoring - View the execution graph of ansible playbooks as part of the entire end to end execution.

![workflow]( /images/kubernetes_architecture/workflow.png ) 

## Getting Started with Cloudify Kubernetes

### Hello world example
The first example is a very simple hello world application. The application consists of a Kubernetes Deployment type resource and a Kubernetes Service type resource. The resources are packaged in [a single YAML file](https://github.com/cloudify-community/blueprint-examples/blob/master/kubernetes/plugin-examples/hello-world/resources.yaml). This is a traditional Kubernetes resource template with one unique difference, which is that it has been parameterized using a Jinja template. This file is delivered to the Cloudify manager with a [Cloudify blueprint](https://github.com/cloudify-community/blueprint-examples/blob/master/kubernetes/plugin-examples/hello-world/blueprint.yaml). In the blueprint, a single node template refers to this file. The “container” and “container_port” parameters may be changed to replace the application and port parameters in the Kubernetes resources.

### Multi-Cluster Example

In the following example, we used a combination of  Jenkins and Cloudify [Jenkins Plugin](https://docs.cloudify.co/latest/working_with/integration/jenkins-plugin/) as a Multi Kubernetes Cluster broker between OpenShift and GKE. In this example, OpenShift act as our development environment and GKE as the production environment. The pipeline pushes the same application across the two clusters. Cloudify is used to abstract the authentication and different setup needed for each cluster environment. We refer to this pattern as EaaS (Environment as a Service).

![multi_cluster_example]( /images/kubernetes_architecture/multi_cluster_example.png )

Click to watch a [demo](https://vimeo.com/483013205)

### Continuous Deployment Example
Cloudify provides tight integration with popular CI/CD tools such as GitHub Actions, CircleCI, and Jenkins. This integration provides pipeline developers with the ability to involve Cloudify in their pipelines using facilities native to the CI/CD platform.

For GitHub, Cloudify provides a set of GitHub Actions, one of which is the [“Create Kubernetes Environment” action](https://github.com/marketplace/actions/create-kubernetes-environment).

An example of how Cloudify’s Kubernetes GitHub action is used can be found in our [GitHub Actions example repository](https://github.com/cloudify-community/github-actions-example/).

![github_action]( /images/kubernetes_architecture/github_action.png )
