+++
title = "Writing a Blueprint"
description = "A guide on how to write your first blueprint."
weight = 27
alwaysopen = false
+++

A {{< param product_name >}} blueprint is a YAML file with definitions of resources and connections between them. The syntax is based on the TOSCA (Topology Orchestration Specification for Cloud Applications) specification. It is well-suited to enable multi-domain service orchestration based on Ansible, Terraform, AWS CloudFormation, Azure ARM, Kubernetes manifests, Helm, and various of other tools.

<center><img src="/images/trial_getting_started/blueprint-examples/orchestrator-of-orchestrator.png" width="500" height="180"  ></center>

In this guide, you will learn the basic steps for building service automation using the {{< param product_name >}} blueprint. The guide is broken down into the following high-level sections:

* Blueprint syntax and structure
* Nodes and resources
* Relationships
* Service composition

To simplify this exercise, the examples in this guide run on the local {{< param product_name >}} manager instance and do not require any cloud credentials or external dependencies. The process for running the examples is shown at the end of this document in the "Running the examples" section.

If you are interested in learning how to build a {{< param product_name >}} blueprint to run  Ansible, Terraform, or Kubernetes-based services across a  multi-cloud  infrastructure, refer to the relevant section in the [Getting Started Guide](https://docs.cloudify.co/latest/trial_getting_started/)

## Blueprint Syntax and Structure

The following simple blueprint example can be used to illustrate the most basic blueprint structure:

{{< highlight  yaml >}}

tosca_definitions_version: cloudify_dsl_1_3

description: >
  Input and outputs - describing the most basic blueprint structure

imports:
  - https://cloudify.co/spec/cloudify/6.3.0/types.yaml

inputs:
  hello:
    description: Say Hello to
    default: World

node_templates:
  MyResource:
    type:  cloudify.nodes.ApplicationModule
capabilities:
  hello:
    value:  { get_input: hello }

{{< /highlight >}}

The remaining parts of this section will walk you through each piece of the blueprint.

### Description

{{< highlight  yaml >}}
description: >
  Input and outputs - describing the most basic blueprint structure
{{< /highlight >}}

The description section is used to provide a free text field to describe the purpose and usage of this specific blueprint. The description will appear in the blueprint catalog within the {{< param product_name >}} Manager UI.

### Imports

{{< highlight  yaml >}}
imports:
  - https://cloudify.co/spec/cloudify/6.3.0/types.yaml
{{< /highlight  >}}

The [import section](https://docs.cloudify.co/latest/developer/blueprints/spec-imports/) imports the relevant resource provider libraries, such as plugins, that will be used in this blueprint.

{{< param product_name >}} includes many resource provider libraries, which are called plugins in {{< param product_name >}} terminology. These plugins include support for cloud infrastructure resources, such as AWS, Azure, and GCP. They also include support for Ansible, Terraform, AWS CloudFormation, Azure ARM, Kubernetes, and more. You can find the full list of plugins [here](https://docs.cloudify.co/latest/working_with/official_plugins/):

You can also develop your own plugins and add them to a blueprint. You can find more information about custom plugin development [here](https://docs.cloudify.co/latest/developer/writing_plugins/).

### Inputs

{{< highlight  yaml >}}
inputs:
   hello:
    description: Say Hello to
    default: World
{{< /highlight >}}

The [input section](https://docs.cloudify.co/latest/developer/blueprints/spec-inputs/) defines the arguments that a user can pass and are needed to run the blueprint. An input can have a default value which will be used if no value is provided. An input can also be [constrained](https://docs.cloudify.co/latest/developer/blueprints/spec-inputs/#constraints) to ensure that the provided value is valid and will be shown as a drop-down list in the UI.

### Capabilities

{{< highlight  yaml >}}
capabilities:
   hello:
    value:  { get_input: hello }

{{< /highlight >}}

The [capabilities](https://docs.cloudify.co/latest/developer/blueprints/spec-capabilities/) section exposes the relevant resources to the outside world. A capability will often be an API endpoint, website URL, or other information that is needed to access the environment. Capabilities can be consumed by end users, such as the user who deployed the blueprint. They can also be consumed by other blueprint deployments.

In this specific example we print the input value using the get_input [intrinsic function](https://docs.cloudify.co/latest/developer/blueprints/spec-intrinsic-functions/).

## Nodes and Resources

The previous example, introduced you to a simple blueprint and its high-level sections. Next, you will take a look at a slightly more complicated example so that you can understand how nodes and resources are modeled in {{< param product_name >}}.

The [Hello World example](https://docs.cloudify.co/latest/trial_getting_started/examples/local/local_hello_world_example/) runs a simple web server application locally on the {{< param product_name >}} Manager. It illustrates how you can write a simple service lifecycle operation and execute it using {{< param product_name >}}. The topology view in the UI is very simple, as this blueprint consists of a single node:

<img src="/images/trial_getting_started/blueprint-examples/note-type-toplogy.png"  width="200" height="200" >

The blueprint file can be found [here.](https://github.com/cloudify-community/blueprint-examples/blob/master/introduction-to-blueprints/ex2-node-type-blueprint.yaml)

### Node Templates

{{< highlight  yaml >}}
node_templates:

  # A node type referencing an http_web_server resource.
  # Implementing the cloudify.interfaces.lifecycle interface as part of the node definition
  # allows us to plug the specific business logic at each point of the lifecycle event.
  # In this example the actual instantiation of the http server is handled by the webserver/start.sh app_script which is called at the [start] lifecycle event
  http_web_server:
    type: cloudify.nodes.WebServer
    properties:
      port: { get_input: webserver_port }
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: webserver/start.sh
          executor: central_deployment_agent
        stop:
          implementation: webserver/stop.sh
          executor: central_deployment_agent
{{< /highlight >}}

The [node template section](https://docs.cloudify.co/latest/developer/blueprints/spec-node-templates/) is the main part of the blueprint. It defines the resources in the environment and the lifecycle operation of each resource (node). This blueprint defines a single node, which will be explained in the next section.

## Node Definition

The TOSCA-based node definition is based on an object oriented approach to model resources. As with other object oriented languages it includes interfaces, properties, and supports inheritance.

{{< highlight  yaml >}}
http_web_server:
    type: cloudify.nodes.WebServer
{{< /highlight  >}}

This example defines a node named `http_web_server` of [type](https://docs.cloudify.co/latest/developer/blueprints/spec-node-types/) `cloudify.nodes.WebServer`. The type definition is derived from the import section. In this case, we chose one of the [built in types](https://docs.cloudify.co/latest/developer/blueprints/built-in-types/). The `cloudify.nodes.WebServer` type is defined in the [types.yaml](https://cloudify.co/spec/cloudify/6.3.0/types.yaml) file.

> Note: A simplified way to browse through the definition of each available node type in each plugin would be to use the IDE code completion feature which is supported through the {{< param product_name >}} [IDE Integration](https://docs.cloudify.co/latest/developer/ide_autocomplete/).

Most node types are derived from `cloudify.nodes.Root`, which defines a few interfaces for lifecycle, validation, and monitoring (see below). You can also see that operations can be specified for many different parts of a node's lifecycle. These operations offer you flexibility when modeling your environment. For example, a web server might be installed during the "create" operation, and the server software may be stopped via the "stop" operation.


{{< highlight  yaml >}}
cloudify.nodes.Root:
    interfaces:
      cloudify.interfaces.lifecycle:
        precreate: {}
        create: {}
        configure: {}
        start: {}
        poststart: {}
        prestop: {}
        stop: {}
        delete: {}
        postdelete: {}
        pull: {}
      cloudify.interfaces.validation:
        create: {}
        delete: {}
        # Deprecated - should not be implemented.
        creation: {}
        deletion: {}
      cloudify.interfaces.monitoring:
        start: {}
        stop: {}
{{< /highlight >}}

In the specific example for the `http_web_server`, we choose to implement only the lifecycle interface with the start and stop operations. The start and stop operations point to the [webserver/start.sh](https://github.com/cloudify-community/blueprint-examples/blob/master/introduction-to-blueprints/webserver/start.sh) and [webserver/stop.sh](https://github.com/cloudify-community/blueprint-examples/blob/master/introduction-to-blueprints/webserver/stop.sh) scripts, respectively. These are Python scripts located in the [webserver/](https://github.com/cloudify-community/blueprint-examples/tree/master/introduction-to-blueprints/webserver) directory in the repository. The script path is relative to the blueprint location within the blueprint archive.

## Relationships

In the previous Hello World example, we saw how we can model a single node type can execute its lifecycle operation through a blueprint definition. In this example, we will add a NodeJS calculator application as another node type which will be contained in the http web server from the previous example.

We will fetch this application from a Git repository by calling [app_scripts/create.sh](https://github.com/cloudify-community/blueprint-examples/blob/master/introduction-to-blueprints/app_scripts/create.sh) as part of the _create_ lifecycle event:

{{< highlight  yaml >}}
   web_app:
    type:  cloudify.nodes.ApplicationModule
    relationships:
      - type: cloudify.relationships.contained_in
        target: http_web_server
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: app_scripts/create.sh
          executor: central_deployment_agent
          inputs:
            app_path: {get_attribute: [http_web_server, path] }
            app_git: { get_input: app_git }
        delete:
          implementation: app_scripts/delete.sh
          executor: central_deployment_agent
          inputs:
            app_path: {get_attribute: [http_web_server, path] }
{{< /highlight >}}

For this purpose we will add a [relationship section](https://docs.cloudify.co/latest/developer/blueprints/spec-relationships/) to the node definition:

{{< highlight  yaml >}}
  relationships:
      - type: cloudify.relationships.contained_in
        target: http_web_server
{{< /highlight  >}}

The _cloudify.relationships.contained_in_ will tell Cloudify to run the lifecycle operation of this node type on the same host that was created by the http_web_server node above.

This also means that this web_app node will run only after the http_web_server has been deployed successfully. The topology view reflects the addition of the new node within the http_web_server:

<img src="/images/trial_getting_started/blueprint-examples/relationship-topology.png"  width="300" height="200" >

The full blueprint file can be found [here.](https://github.com/cloudify-community/blueprint-examples/blob/master/introduction-to-blueprints/ex3-relationship-blueprint.yaml)

The relationship is an object on its own and represents a lifecycle operation that is triggered when the relationship is established. For example, a relationship can be expressed between a server and a load balancer. When this relationship is established, a REST call might be executed to add a server to the load balancer.

There are a few [built in relationships](https://docs.cloudify.co/latest/developer/blueprints/spec-relationships/#schema) such as depends_on connected_to and contained_in. Each plugin can also define a custom relationship implementation.

## Service Composition

The previous examples focused on a single blueprint. The Service Composition example illustrates how you can create a multi-tier or distributed service where each service will have an independent blueprint and lifecycle operation. This concept is similar to application microservices, with a clean separation between discreet components. We will illustrate how we can create dependencies and relationships between services, pass inputs and outputs between services, and combine multiple blueprints into a single environment.

The ability to combine multiple blueprints into a single environment is referred to as [Service Composition](https://docs.cloudify.co/latest/working_with/service_composition/). The Service Composition node type allows us to wrap an external service and expose it as a local node type. This allows us to leverage blueprint features, such as relationship and dependency management, between multiple blueprints just as you would with a regular blueprint.

The diagram below shows the parent blueprint topology. The Certificate and WebService are Service Component node types. Each points to a child blueprint.

Notice that the service component node types have a "Lego" building block in the top-right corner of their icon. This indicates that this specific node points to another blueprint. The arrow and cross icons at the bottom left of the node allow you to zoom in and out, or view the underlying child blueprint behind each component.

<img src="/images/trial_getting_started/blueprint-examples/nested-blueprint-topology.png"  width="500" height="200" >

### Blueprint Description

A [Service Component](https://docs.cloudify.co/latest/working_with/service_composition/component/) is a special node type that can point to an external blueprint and expose it as a local node type to the parent blueprint.

{{< highlight  yaml >}}
WebServiceComponent:
    type: cloudify.nodes.ServiceComponent
    properties:
      resource_config:
        blueprint:
          external_resource: False
          id: ex3-relationship-blueprint
          blueprint_archive: { get_input:  blueprint_archive }
          main_file_name: ex3-relationship-blueprint.yaml
        deployment:
          id: ex3-relationship-blueprint
{{< /highlight  >}}

The resource configuration provides information that will allow {{< param product_name >}} to create a deployment resource on demand. There are two approaches for this process:

1. Creating a deployment from an already uploaded blueprint:

  {{< highlight  yaml >}}
      resource_config:
        blueprint:
          external_resource: True
          id: ex3-relationship-blueprint
        deployment:
          id: ex3-relationship-blueprint
{{< /highlight >}}

2. Uploading and installing a blueprint on demand. If the blueprint isn't already loaded in the manager, it can be uploaded on demand using the `blueprint_archive` and `main_file_name` parameter. These parameters point to the ZIP archive containing the blueprint and the main blueprint file name, respectively.

{{< highlight  yaml >}}
      resource_config:
        blueprint:
          external_resource: False
          id: ex3-relationship-blueprint
          blueprint_archive: { get_input:  blueprint_archive }
          main_file_name: ex3-relationship-blueprint.yaml
        deployment:
          id: ex3-relationship-blueprint
{{< /highlight  >}}

The full blueprint file can be found [here.](https://github.com/cloudify-community/blueprint-examples/blob/master/introduction-to-blueprints/ex4-nested-blueprint.yaml)

For a more advanced use case of Service Composition see the [Multicloud NodeJS example](https://docs.cloudify.co/latest/trial_getting_started/examples/multi_cloud/multi-cloud_nodejs_example/) which illustrates how you can use this capability to run the same NodeJS application across different cloud and infrastructure orchestration tools. In this case we use the service component to decouple the application service from the infrastructure and allow the user to choose the infrastructure that best suits their needs. The [EaaS example](https://docs.cloudify.co/latest/trial_getting_started/examples/eaas/) illustrates how you can use service composition to optimize development and production environment stacks.

## Running the Examples

The examples from this article can be easily run on your local {{< param product_name >}} Manager.

First, download the blueprint archive from the [community Github repository.](https://github.com/cloudify-community/blueprint-examples/releases/download/6.3.0-0/introduction-to-blueprints.zip) The [source code] (https://github.com/cloudify-community/blueprint-examples/tree/master/introduction-to-blueprints) is also available.


To run the first example demonstrating basic blueprint structure, use the following command:

```shell
$ cfy install -b Example-1 -n ex1-input-output-blueprint.yaml introduction-to-blueprints.zip 
```

Once the installation has succeeded, inspect the deployment from the UI or CLI. Uninstall the example before moving on to the next example:

```shell
$ cfy uninstall Example-1
```

To run the second example demonstrating the addition of node templates, repeat the same process with the second blueprint file:

```shell
# Upload the blueprint and create a deployment in a single command
$ cfy install -b Example-2 -n ex2-node-type-blueprint.yaml introduction-to-blueprints.zip

# Inspect the deployment via the UI or CLI. For example, to obtain deployment capabilities:
$ cfy deployment capabilities Example-2

# Tear down the example when you are finished
$ cfy uninstall Example-2
```

To run the third example demonstrating relationships, repeat the same process with the third blueprint file:

```shell
# Upload the blueprint and create a deployment in a single command
$ cfy install -b Example-3 -n ex3-relationship-blueprint.yaml introduction-to-blueprints.zip

# Inspect the deployment via the UI or CLI. For example, to obtain deployment capabilities:
$ cfy deployment capabilities Example-3

# Tear down the example when you are finished
$ cfy uninstall Example-3
```

Finally, to run the fourth example demonstrating service composition, repeat the same process with the fourth blueprint file:

```shell
# Upload the blueprint and create a deployment in a single command
$ cfy install -b Example-4 -n ex4-nested-blueprint.yaml introduction-to-blueprints.zip

# Inspect the deployment via the UI or CLI. For example, to obtain deployment capabilities:
$ cfy deployment capabilities Example-4

# Tear down the example when you are finished
$ cfy uninstall Example-4
```


You can also use the web console interface to upload and run the examples:

<center><img src="/images/trial_getting_started/blueprint-examples/run-via-web-console.png"   ></center>

## Summary and Next Steps

This set of examples introduced some of the core concepts behind the {{< param product_name >}} blueprint. The most common use case for the {{< param product_name >}} blueprint is as an orchestrator of orchestrators. A blueprint can contain many different resources based on Terraform, Kubernetes, Ansible, and other tools across a multi-cloud environment. To learn more about how this is done, refer to the relevant section in the {{< param product_name >}} [Getting Started Guide](https://docs.cloudify.co/latest/trial_getting_started/).

## References

The following resources are helpful for building your knowledge of {{< param product_name >}} blueprints:

* [Cloudify blueprint DSL fundamentals](https://docs.cloudify.co/latest/developer/blueprints/)
* [IDE Integration](https://docs.cloudify.co/latest/developer/ide_autocomplete/)
* [Service Composition](https://docs.cloudify.co/latest/working_with/service_composition/)
* [Getting Started guide](https://docs.cloudify.co/latest/trial_getting_started/)
* [Best Practices For Agile Blueprint Development](https://docs.cloudify.co/latest/bestpractices/agiledevelopmentbp/)
* [Official Plugins](https://docs.cloudify.co/latest/working_with/official_plugins/)
* [Creating custom plugin](https://docs.cloudify.co/latest/developer/writing_plugins/).
* [Multi-cloud NodeJS example](https://docs.cloudify.co/latest/trial_getting_started/examples/multi_cloud/multi-cloud_nodejs_example/)
* [EaaS example](https://docs.cloudify.co/latest/trial_getting_started/examples/eaas/)
