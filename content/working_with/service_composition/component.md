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

Component is a basic type which allows embedding a blueprint as a component of another blueprint, thus allowing re-use of micro-services and simplify the creation and readability of blueprints.

The Components mentioned in a blueprint will be deployed as part of the blueprint install workflow as a separate deployment linked to the main blueprint in which they were mentioned. Relationships and dependencies can be defined for components similar to other nodes.

## Modeling

This basic type is the basis for modeling "cloud-native" architectures with {{< param product_name >}}, which opens a range of basic "building blocks":

* `cloudify.nodes.Component` - A generic building block type (a root type) which enables a basic infrastructure for building "cloud-native" architectures.
* `cloudify.nodes.ServiceComponent` - This node type is for modeling application's different internal services with the inter-connections between them.

## Workflows

In a deployment of multi-service application which utilizes Component in it’s architecture,
there might be a need to extend the lifecycle management of the application deployment by cascading down the workflows executions.
This will start the execution from the root deployment to every Component in the architecture (also if it is a multi-Component and multi-layer architecture),
and will traverse the deployments “tree” from the root deployment (application’s deployment) according to inherit execution and architecture dependencies from the blueprint.

All custom workflows, including the builtin ones, are **not** cascading by default.
Notice that cascading custom workflows requires it’s definition in every Component in the application, which also allows custom behaviour in every Component
so different layers/parts of the application can act uniformly or independently.

Example for defining cascading custom workflow:

{{< highlight  yaml >}}
workflows:
  custom_workflow:
    mapping: <workflow implementation>
    is_cascading: true (default: false)
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

## Lifecycle - install and uninstall

In install workflow the following lifecycle flow will be executed for a node of type Component (or derives from it):

* Blueprint: If a blueprint source was provided (blueprint_archive and main_file_name settings with external_resource flag was not set), it will be uploaded.
If existing blueprint is chosen, the access to it will be verified. Also the node runtime properties blueprint related will be propagated.
* Secrets: All secrets will be uploaded to the {{< param cfy_manager_name >}} (using the default or given client settings), *notice* that on any collision with existing secrets this step will fail.
Also the node runtime properties secrets related will be propagated.
* Plugins: All supplied plugins will be uploaded if they are not already uploaded (this will be verified pre-upload).
Also the node runtime properties plugins related will be propagated.
* The deployment (or deployments if scaling was specified) will be created with the given resources and provided inputs.
* The created deployment (or deployments) will be installed with separated executions.

In uninstall workflow the following lifecycle flow will be executed for a node of type Component (or derives from it):

* Stopping all relevant deployments to the Component and deleting them.
* Deleting all plugins that the Component uploaded, if they are not used by other deployments.
* Deleting all secrets.
* Deleting all node runtime properties of the node Component.

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
* `client`: {{< param product_name >}} HTTP client configuration, if empty the current {{< param cfy_manager_name >}} client will be used.
    * `host`: The host name of {{< param cfy_manager_name >}} machine.
    * `port`: The port of the REST API service on the {{< param cfy_manager_name >}} machine.
    * `protocol`: The protocol of the REST API service on management machine, defaults to http.
    * `api_version`: The version of the {{< param product_name >}} REST API service.
    * `headers`: Headers to be added to the HTTP requests.
    * `query_params`: Query parameters to be added to the HTTP request.
    * `cert`: Path on the {{< param cfy_manager_name >}} to a copy of the target {{< param cfy_manager_name >}}'s certificate.
    * `trust_all`: If False, the server's certificate (self-signed or not) will be verified.
    * `username`: {{< param cfy_manager_name >}} user username.
    * `password`: {{< param cfy_manager_name >}} user password.
    * `token`: {{< param cfy_manager_name >}} user token.
    * `tenant`: {{< param cfy_manager_name >}} user accessible tenant name.
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

## Internal implementation details:
### Workflow inputs

* `start`:
    * `workflow_id`: workflow name for run, by default `install`.
* `stop`:
    * `workflow_id`: workflow name for run, by default `uninstall`.

### Runtime properties
These are the used runtime properties for the *internal implementation* on each node of type Component (or of a type that is derived from it):

* `blueprint`:
    * `id`: blueprint name.
    * `application_file_name`: blueprint file name.
    * `blueprint_archive`: blueprint source.
* `deployment`:
    * `id`: deployment name.
    * `current_suffix_index`: only relevant when scaling a Component, index of current Component instance (which will be only incremented).
* `received_events`: list of deployment related executions with event count, option available only with log redirect option enabled.
* `plugins`: a list of the uploaded plugins for the Component's deployment.
* `capabilities`: A dictionary that contains the capabilities of the Component's deployment, which were fetched the last time a workflow was run on that node.

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
