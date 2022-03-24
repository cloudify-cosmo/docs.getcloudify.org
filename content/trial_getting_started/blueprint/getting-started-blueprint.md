+++
title = "Getting started with Cloudify Blueprint"
description = "A guide on how to write your first Cloudify blueprint"
weight = 27
alwaysopen = false
+++

Cloudify Blueprint is a YAML file with definitions of resources and connections between them, the syntax is based on the TOSCA  specification (Topology Orchestration Specification for Cloud Applications).  It is best suited to  enable multi-domain service orchestration based on Ansible, Terraform, AWS Cloud Formation, Azure ARM, Kubernets Helm etc..

<center><img src="/images/trial_getting_started/blueprint-examples/orchestrator-of-orchestrator.png" width="500" height="180"  ></center>


In this guide you will learn the basic steps on how to write service automation using the Cloudify blueprint.  The guide is broken down into the following steps.

* Step 1 - Blueprint syntax introduction, define structure, inputs and outputs.
* Step 2 - Manage a resource, use the topology section to define a web server resource node.
* Step 3 - Integrate between resources in a blueprint, use relationships to make the resources work together.
* Step 4 - Use Blueprint together, by using service composition create a service from several independent blueprints

>NOTE: To simplify this exercise the examples in this guide run on the local >cloudify manager instance and therefore wouldn’t require any cloud >credentials.

If your interested to learn how to use the Cloudify blueprint to run  Ansible, Terraform, Kubernetes based services across a  Multi Cloud  infrastructure refer to the relevant section in the cloudify [Getting Started guide](https://docs.cloudify.co/latest/trial_getting_started/)

## Basic blueprint structure

The input and output blueprint example walks illustrate the most basic blueprint structure.


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


### Blueprint description


#### The description section:

{{< highlight  yaml >}}
description: >
  Input and outputs - describing the most basic blueprint structure
{{< /highlight >}}

The description section as its name suggests is used to provide a free text field to describe the purpose and usage of this specific blueprint.

#### The import section

{{< highlight  yaml >}}
imports:
  - https://cloudify.co/spec/cloudify/6.3.0/types.yaml
{{< /highlight  >}}

The [import section](https://docs.cloudify.co/latest/developer/blueprints/spec-imports/) imports the relevant resource providers libraries (a.k.a plugins) that will be used in this blueprint.

Cloudify comes with a list of built in resource providers libraries known as plugins which includes cloud infrastructure resources such as AWS, Azure and GCP as well as infrastructure resources such as Ansible, Terraform , AWS Cloud Formation and Azure ARM as well as Kubernetes resources. You can find the full list [here](https://docs.cloudify.co/latest/working_with/official_plugins/):

Note that you can also create custom resource libraries and add them to the blueprint. You can find more information on how to add custom plugins [here](https://docs.cloudify.co/latest/developer/writing_plugins/).

#### The input section

{{< highlight  yaml >}}
inputs:
   hello:
    description: Say Hello to
    default: World
{{< /highlight >}}

The [input section](https://docs.cloudify.co/latest/developer/blueprints/spec-inputs/) as its name suggests defines the arguments that a user can pass and are needed to run the blueprint. An input can have a default value which will be used in case that the user didn’t provide input on this input field.An input can also be constrained to ensure that the value provided is valid.

#### The capabilities section

The [capabilities](https://docs.cloudify.co/latest/developer/blueprints/spec-capabilities/) section exposes the relevant resources to the outside world. Usually that will be API endpoint, website URL that are needed to get access to this service by other users or services.

In this specific example we print the input value using the get_input [intrinsic functions](https://docs.cloudify.co/latest/developer/blueprints/spec-intrinsic-functions/)


{{< highlight  yaml >}}
capabilities:
   hello:
    value:  { get_input: hello }

{{< /highlight >}}

## Adding Node types


The [hello world example](https://docs.cloudify.co/5.1/trial_getting_started/examples/first_service/local_hello_world_example/) runs a simple web server application.

It illustrates how you could write a simple service lifecycle operation and execute it through cloudify.  (Note that in this example the web server comes empty , in the next example we will demonstrate how you can add a web application as well to that server)

<img src="/images/trial_getting_started/blueprint-examples/note-type-toplogy.png"  width="200" height="200" >

Hello world topology

### The node template section


The [node template section](https://docs.cloudify.co/latest/developer/blueprints/spec-node-templates/) is the main part of the blueprint. It defines the resources in our  environment and the lifecycle operation of each resource (node) and the relationship between the nodes.

{{< highlight  yaml >}}

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


### Node definition:


The TOSCA based node definition is based on an object oriented approach. As with other object oriented languages it includes interfaces, properties , and it also supports inheritance.


{{< highlight  yaml >}}
http_web_server:
    type: cloudify.nodes.WebServer
{{< /highlight  >}}


In this specific case we chose node name - _httpe_web_server_ which is of [type ](https://docs.cloudify.co/latest/developer/blueprints/spec-node-types/)_cloudify.nodes.WebServer_ - the type definition is derived from the import section. In this case we chose one of the [built in types](https://docs.cloudify.co/latest/developer/blueprints/built-in-types/) cloudify.nodes.WebServe_r which is defined in the [types.yaml](https://cloudify.co/spec/cloudify/6.2.0/types.yaml). (A simplified way to browse through the definition of each available node types in each plugin would be to use the IDE code completion feature which is supported through Cloudify [IDE Integration](https://docs.cloudify.co/latest/developer/ide_autocomplete/))

Most of the node types are derived from cloudify.nodes.Root which as you can see below defines a few interfaces , lifecycle, validation and monitoring. You can also see that operations can be specified for many different parts of a node's lifecycle. These operations offer you flexibility when modeling your environment. For example, a web server might be installed during the "create" operation, and the server software may be stopped via the "stop" operation.


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


In our specific example we chose to implement only the lifecycle interface and only the create and delete operation.
The create and delete operation points to install.py and uninstall.py respectively which are in this case local python script located at the same folder where the blueprint.yaml is located (the path to those scripts is relative to the location of the blueprint location).

## Relationship Example

In the previous Hello world example we saw how we can model a single node type and execute its lifecycle operation through a simple blueprint definition.
In this example we will add a NodeJS calculator application as another node type which will be contained in the http web server from the previous example.
We will fetch this application from a git repo by calling _app_scripts/create.sh_ as part of the _create_: lifecycle event.



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

For this purpose we will add a [relationship section](https://docs.cloudify.co/latest/developer/blueprints/spec-relationships/) to our node definition as described below:

{{< highlight  yaml >}}
  relationships:
      - type: cloudify.relationships.contained_in
        target: http_web_server
{{< /highlight  >}}

The _cloudify.relationships.contained_in_ will tell Cloudify to run the lifecycle operation of this node type on the same host that was created by the http_web_server node above

This also means that this web_app node will run only after the http_web_server has been deployed successfully


<img src="/images/trial_getting_started/blueprint-examples/relationship-topology.png"  width="300" height="200" >


Web Service with relationship to application

Note: The relationship is an object of its own and represents a lifecycle operation that is triggered when the relationship is established. For example: a  relationship can be expressed between a server and a load balancer. When this relationship is established, a REST call might be executed to add a server to the load balancer

There are few built in relationships such as depends_on connected_to and contained_in. Each plugin can define a custom relationship implementation as well.

## Nested Blueprints

The nested blueprint example illustrates how you can create a multi-tier or distributed service where each service will have an independent blueprint and lifecycle operation similar to the way micro-services works. We will illustrate how we can create a dependency and relationship between those services , pass inputs/output parameters etc.

To do that we are using a feature that is referred to as  [Service Composition](https://docs.cloudify.co/latest/working_with/service_composition/). The Service Composition node type allows us to wrap an external service and expose it as a local node type. This allows us to leverage the relationship and dependency management and the rest of the  blueprint feature just as you would with a regular blueprint.

The following diagram shows the parent blueprint topology.
The Certificate and WebService are ServiceComponent node type each points to a child blueprint respectively..
The difference between a regular node type and a service component node type is the lego-icon on the top right. The lego icon indicates that this specific node points to another blueprint. At the bottom left we can see arrow and cross that allows usl zoom in and out  and see the underlying blueprint behind each component.

<img src="/images/trial_getting_started/blueprint-examples/nested-blueprint-topology.png"  width="500" height="200" >

Nested blueprint topology view

### Blueprint description

A service [component](https://docs.cloudify.co/latest/working_with/service_composition/component/) is a special node type that can point to an external blueprint and expose it as local node type to the parent blueprint.

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

The resource configuration provides information that will allow Cloudify to create a deployment resource on demand.
There are basically two mode in which this could be done:

1. Creating a deployment from an already uploaded blueprint as described below.

  {{< highlight  yaml >}}
      resource_config:
        blueprint:
          external_resource: True
          id: ex3-relationship-blueprint
        deployment:
          id: ex3-relationship-blueprint
{{< /highlight >}}

2. Upload and install a blueprint on demand

If the blueprint wasn’t preloaded to the manager we can load it on demand.
To do that we need to include _blueprint_archive_ which points to the package that contains this service and _main_file_name_ which points to the blueprint file in that package as described below:

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

For a more advanced use case of service composition see the [multi cloud NodeJS example](https://docs.cloudify.co/latest/trial_getting_started/examples/multi_cloud/multi-cloud_nodejs_example/) which illustrates how you can use this capability to run the same NodeJS application across different cloud and infrastructure orchestration tools. In this case we use the service component to decouple the application service from the infrastructure and thus allow the user to choose the infrastructure that best suits his needs. The[ EaaS example ](https://docs.cloudify.co/latest/trial_getting_started/examples/eaas/)illustrates how you can use service composition to optimize the development and production environment stack.

## Running the examples

To run the example you can use the following command:

1. Example 1 - basic blueprint
    ```
> cfy install -b ex1 -n ex1-input-output-blueprint.yaml getting-started-blueprint-examples.tar
```

2. Example 2 - adding node type

    ```
> cfy install -b ex2 -n ex2-node-type-blueprint.yaml getting-started-blueprint-examples.tar
```
3. Example 3 - adding relationship
    ```
> cfy install -b ex3 -n ex3-relationship-blueprint.yaml getting-started-blueprint-examples.tar
```
4. Example 4 - nested blueprint
    ```
> cfy install -b ex4 -n ex4-nested-blueprint.yaml getting-started-blueprint-examples.tar
```

You can also use the web console interface in the following way:

<center><img src="/images/trial_getting_started/blueprint-examples/run-via-web-console.png"   ></center>

Installing the example from the web ui

## Summary and next steps

In this set of examples we learned some of the core concepts behind the Cloudify blueprint.

It is important to note that the most common use case to use Cloudify blueprint today is as an orchestrator of orchestrators.  In this case Cloudify orchestrates resources based on Terraform, Kubernetes , Ansible etc across a  Multi Cloud  environment.  To learn more on how this is done refer to the relevant section in the cloudify [Getting Started guide](https://docs.cloudify.co/latest/trial_getting_started/)

## References:

* [Cloudify blueprint DSL fundamentals](https://docs.cloudify.co/latest/developer/blueprints/)
* [IDE Integration](https://docs.cloudify.co/latest/developer/ide_autocomplete/)
* [Service Composition](https://docs.cloudify.co/latest/working_with/service_composition/)
* [Getting Started guide](https://docs.cloudify.co/latest/trial_getting_started/)
* [Best Practices For Agile Blueprint Development](https://docs.cloudify.co/latest/bestpractices/agiledevelopmentbp/)
* [Official Plugins](https://docs.cloudify.co/latest/working_with/official_plugins/)
* [Creating custom plugin](https://docs.cloudify.co/latest/developer/writing_plugins/).
* [multi cloud NodeJS example](https://docs.cloudify.co/latest/trial_getting_started/examples/multi_cloud/multi-cloud_nodejs_example/)
* [EaaS example](https://docs.cloudify.co/latest/trial_getting_started/examples/eaas/)
