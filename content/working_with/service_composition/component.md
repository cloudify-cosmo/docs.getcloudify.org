---
layout: bt_wiki
title: Component Node Type
category: Service Composition
draft: false
abstract: Getting to know Component node type
weight: 600
aliases: /service_composition/component/
---

# Component

A basic type which allows uploading provided blueprint to Cloudify manager or using previously uploaded blueprint, and creating a separate deployment
while in install workflow. Which allows a fully independent part of an application, if a micro-service or anything else, in it's regular
lifecycle and gain a large degree of parallelism in workflow execution with a clear application architecture.

## Modeling

This basic type is the basis for modeling "cloud-native" architectures with Cloudify, which opens a range of basic "building blocks":

* `cloudify.nodes.Component` - A generic building block type (a root type) which enables a basic infrastructure for building "cloud-native" architectures.
* `cloudify.nodes.ServiceComponent` - This node type is for modeling application's different internal services with the inter-connections between them.

## Workflows

In a deployment of multi-service application which utilizes Component in it's architecture, there is a need to extend the lifecycle management of the application
deployment by cascading down the workflows executions. Which start execution from the root deployment to every Component in the architecture (also if it is a multi-Component and
multi-layer architecture), and will traverse the deployments "tree" from the root deployment (application's deployment) according to inherit execution and architecture dependencies
from the blueprint.  

Cascading behaviour is applied on all Cloudify builtin workflows (for example: heal, scale, and etc) by default, also all custom workflows are cascading by default.
Also the current execution options of a workflow will be applied for cascading workflow, like canceling/resuming/queuing/scheduling a workflow.
Notice that cascading custom workflows *requires* it's definition in every Component in the application, which also allows custom behaviour in every Component
so different layers/parts of the application can act uniformly or separate at all.

Example for defining *not* cascading custom workflow:

{{< highlight  yaml >}}
workflows:
  custom_workflow:
    mapping: <workflow implementation>
    is_cascading: false (default: true)
{{< /highlight >}}

### Limitations
Currently the following limitation exists, the output of the cascading workflow on the Components does not propagate to the result of the workflow execution in the
root deployment. So if the cascading workflow fails in a Component "down" the deployments "tree" the execution in the root deployment will still show statues of success.
This limitation does not apply for install and uninstall workflows, so if there is a failure for some Component the workflow status will show the correct status.

## Scaling
The Component node type is can be scaled like a regular node.

When scaling a Component it's deployment name could be specified with the following:
* Not providing deployment id which will name the created deployments with the node instance id.

{{< highlight  yaml >}}
  component:
    type: cloudify.nodes.ServiceComponent
    properties:
      resource_config:
        blueprint:
          external_resource: true
          id: uploaded_blueprint
{{< /highlight >}}

* By providing a deployment id with enabling the 'running number suffix' flag, which will add a running number at the end of given deployment id.
Notice that this flag is defaulted to false.

This example will create two deployment with the following 'component-1' and 'component-2':

{{< highlight  yaml >}}
node_templates:
  component_node:
    type: cloudify.nodes.ServiceComponent
    properties:
      resource_config:
        blueprint:
          external_resource: true
          id: component_blueprint
        deployment:
          id: component
          auto_inc_suffix: true
    capabilities:
        scalable:
            properties:
                default_instances: 2
{{< /highlight >}}

## Support in topology widget

* For a node of type Component a quick navigation button to it's deployment page, which becomes available only after it's deployment is created
via the deployment page of the node.

![Topology View Example]( /images/service_composition/component_sharedresource_topology_view.png )

## Node type:

### cloudify.nodes.Component

**Derived From:** `cloudify.nodes.Root`

**Properties:**

* `resource_config`:
    * `blueprint`:
        * `external_resource`: Optional, reuse already existed blueprint, by default `False`
        * `id`: This is the blueprint ID that the Component's node is connected to.
        * `blueprint_archive`: blueprint source (ignored, if `external_resource` == `True`)
        * `main_file_name`: The application blueprint filename. If the blueprint consists many imported files this is the main blueprint.
    * `deployment`:
        * `id`: This is the deployment ID that the Component's node is connected to.
        * `inputs`: Optional, The inputs to the deployment.
        * `logs`: This is a flag for logs and events redirect from the deployment, by default true.
        * `auto_inc_suffix`: Optional, will add a suffix to the given deployment ID in the form of an auto incremented index.
    * `executions_start_args`: Optional, params for executions.
* `client`: Cloudify HTTP client configuration, if empty the current Cloudify manager client will be used.
    * `host`: Host of Cloudify's manager machine.
    * `port`: Port of REST API service on Cloudify's management machine.
    * `protocol`: Protocol of REST API service on management machine, defaults to http.
    * `api_version`: Version of Cloudify REST API service.
    * `headers`: Headers to be added to HTTP requests.
    * `query_params`: Query parameters to be added to the HTTP request.
    * `cert`: Path on the Cloudify manager to a copy of the other Cloudify manager's certificate.
    * `trust_all`: If False, the server's certificate (self-signed or not) will be verified.
    * `username`: Cloudify user username.
    * `password`: Cloudify user password.
    * `token`: Cloudify user token.
    * `tenant`: Cloudify user accessible tenant name.
* `plugins`: Optional, dictionary of plugins to upload,
             which each plugin is in format of:
                plugin-name:
                  wagon_path: Url for plugin wagon file,
                  plugin_yaml_path: Url for plugin yaml file
* `secrets`: Optional, dictionary of secrets to set before deploying Components,
             which each secret is in format of:
                secret-name: value

### cloudify.nodes.ServiceComponent

**Derived From:** `cloudify.nodes.Component`

## Internal implantation details:
### Workflow inputs

* `start`:
    * `workflow_id`: workflow name for run, by default `install`.
* `stop`:
    * `workflow_id`: workflow name for run, by default `uninstall`.

### Runtime properties
These are the used runtime properties for the *internal implementation*:

* `blueprint`:
    * `id`: blueprint name.
    * `application_file_name`: blueprint file name.
    * `blueprint_archive`: blueprint source.
* `deployment`:
    * `id`: deployment name.
    * `outputs`: outputs from deployment
    * `current_suffix_index`: only relevant when scaling Component, index of current Component instance (which will be only incremented).
* `received_events`: list of deployment related executions with event count, option available only with log redirect option enabled.
* `plugins`: a list of the uploaded plugins for the Component's deployment.

# Examples

* Simple example:

{{< highlight  yaml >}}
  component:
    type: cloudify.nodes.ServiceComponent
    properties:
      client:
        host: 127.0.0.1
        username: admin
        password: admin
        tenant: default_tenant
      resource_config:
        blueprint:
          external_resource: true
          id: uploaded_blueprint
        deployment:
          id: component_deployment
          auto_inc_suffix: true
{{< /highlight >}}
