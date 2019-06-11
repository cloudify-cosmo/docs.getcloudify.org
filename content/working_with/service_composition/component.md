---
layout: bt_wiki
title: Component Node Type
category: Service Composition
draft: false
abstract: Getting to know Component node type
weight: 600
aliases: /service_composition/component/
---

# Introduction

Nowadays the standard architecture for new applications is "micro-services", meaning that an application is comprised of multiple services
(even a lot of them) which could be a part of the "cloud-native" directive. In Cloudify recommended architecture each service and the entire application
is a separate deployment, so in order to support handling of application deployment and lifecycle of services the "Component" node type enables the user
to connect a deployment to another deployment, in effect enabling "chaining" of applications or services.

# Component

Upload provided blueprint to manager and create deployment based on such blueprint with run install workflow.
In runtime properties will be provided outputs from deployment.

## Workflows

In a deployment of multi-service application which utilizes Component in it's architecture, there is a need to extend the lifecycle management of the application
deployment by cascading down the workflow execution from the root deployment to every Component in the architecture (also if there is a multi-Component or
multi-layer architecture). Which means execution of a cascading workflow will traverse the deployments "tree" from the root deployment (application's deployment)
according to inherit execution dependencies.  

Cascading behaviour is applied on all Cloudify builtin workflows (for example: heal, scale, and etc) by default, also all custom workflows are cascading by default.
Notice that cascading custom workflows *requires* it's definition in every Component in the application, which also allows custom behaviour in every Component
so different layers/parts of the application can act uniformly or separate at all.

Example for defining not cascading custom workflow:

{{< highlight  yaml >}}
workflows:
  custom_workflow:
    mapping: <workflow implementation>
    is_cascading: false (default: true)

### Limitations

## Scaling

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
    type: cloudify.nodes.Component
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
