+++
title = "Best practices for agile blueprint development"
description = "Best practices for agile blueprint development"
weight = 10
alwaysopen = false
+++




## Best practices for agile blueprint development:

Blueprint development is an iterative process that involves lots of trial and error stages. The blueprint deployment process was designed for handling updates in a production system and therefore tends to be a bit too rigid to fit into iterative development stages.

In this document we will describe the best practices for enabling more agile blueprint development and architecture that is more suitable for handling continues development needs.

 We will break this down to the following parts:

 - **Continues updates** - updates a specific blueprint or part of a
   blueprint e.g. life cycle operation or workflow in an going basis.
- **Automating without writing custom code** - Using existing plugins to automate infrastructure and service configuration without having to write custom code.
- **Architecting for agile automation** development of complex automation systems by applying micro-services principles into automation e.g. breaking the automation units into a discrete set of automation services (a.k.a service-component) that can be put together through relationship to address the end to end automation needs.

### Continues updates:

 **Continues updates** The part of the blueprint that is changing most frequently during a development cycle is the lifecycle operation and workflow. Updating those resources  can be done by changing the resource directly on the {{< param cfy_manager_name >}} and re-executing the workflow that execute that resource or script. Each execution will in turn execute the new version of the script on the next run on the target environment that has been previously created by the blueprint without having to re-instantiate that environment every time we want to make a change.

**Deployment Update** - In cases where we change the blueprint itself i.e. adding or removing node or changing the node configuration were effectively making a change to the service topology.  The deployment update addresses changes to the blueprint itself (add/remove nodes) as well as to the underlying resources. It does so by re-deploying the entire blueprint and then pushing only the delta between the new version and the running version on the live deployment.
The deployment update is also the recommended method for updating internal blueprint resources in a production system as it provides a more structured way to update all the resources that are part of the update including scripts and workflow operation and allow for rollback and better version control of that update.

### Automating without having to write custom code

Cloudily comes with a set of  [Generic Plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) that pre-integrates with wide range of automation domains that includes infrastructure orchestrators such as AWS cloud-formation as well as configuration elements such as REST or Ansible playbooks  as well as micro services such as Kubernetes services.
The built-in plugins allows as to lay-out an entire automation flow without having to write custom code. The REST and Ansible plugins allows us to also handle the interaction with the service simply by plugging the right REST commands or Ansible playbooks in the relevant lifecycle operations.

**Develop custom plugin** There are cases where we need to handle more complex interaction with a given service that involves validation and more complex set of workflow and business logic.
In such cases we can use custom-plugins to map the specific business logic of a given service into a set of node-types that can be described declaratively in the blueprint as any of the other built-in node types and thus inherit all the benefits that comes with it such as the ability to define relationship, pass inputs , tie-in workflow etc.  

Custom plugin provides more control and flexibility on how we expose that service through interfaces and API that would make the modeling and interaction with that service more tight.

You can read on the best practices using built-in plugins and custom plugin in the [this section of the documentation]({{< relref "/developer/writing_plugins/creating-your-own-plugin.md" >}})


### Using micro-services approach for enabling reusable blueprint development

This section refers to some of the architecture best practices on how to develop an automation blueprint using micro-services approach.

-   [Service Components]({{< relref "/working_with/service_composition/_index.md" >}}) - Break the automation model into a discrete set of service-components. In this case every service component is built as a discrete unit of automation that expose a well defined interfaces and capabilities to the outer layers.

-   [Service Relationship Modeling]({{< relref "/developer/blueprints/spec-relationships.md" >}}) - Service relationship enable us to put together a set of those discrete services and also map how they interact and pass context information with one another.

-   Separate the infrastructure and environment setup part from the part that is specific to the service. In this way we can abstract that part tends to be environment specific and keep the rest of the automation abstracted from those environment differences.

You can read on the best practices for automated service which is layered through a set of micro-services approach in [this best practices section.]({{< relref "/bestpractices/vnfguide.md" >}})