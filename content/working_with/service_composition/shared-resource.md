---
layout: bt_wiki
title: SharedResource Node Type
category: Service Composition
draft: false
abstract: Getting to know SharedResource node type
weight: 600
aliases: /service_composition/shared-resource/
---

# `SharedResource`
`SharedResource` is a basic type which creating relationships to a remote service deployment in the blueprint, thus allowing modeling external resource outside of the application deployment lifecycle (so every executed workflow, besides install and uninstall workflows will not be applied to it).

## Workflows
As a shared resource in a application deployment, it represents an external resource and dependency to the deployment and not internal
managed node. So a local workflow execution does not contain it in it's scope, due to that the resource is managed be a separate
deployment and scope.

## Supporting Relationships
For allowing custom connection with the shared resource there is a need to run a workflow on the target deployment.
For example for a custom connection, is a shared resource of service discovery and the requirement to register and unregister services, which
can be done in relevant workflows in the relationship lifecycle. For more information please look at
`cloudify.relationships.depends_on_shared_resource` and `cloudify.relationships.connected_to_shared_resource` in [relationships spec]({{< relref "developer/blueprints/spec-relationships.md" >}}).

## Support in topology widget

* For a node of type `SharedResource` a quick navigation button to its deployment page, which becomes available only after the node's deployment is created
via the deployment page (when the connection is established from the `SharedResource` to its deployment).

![Topology View Example]( /images/service_composition/component_sharedresource_topology_view.png )

## Node type:

### `cloudify.nodes.SharedResource`

**Properties:**

* `resource_config`:
   * `deployment`:
        * `id`: This is the deployment ID that the `SharedResource`'s node is connected to.
* `client`: Cloudify HTTP client configuration, if empty the current Cloudify manager client will be used.
   * `host`: The host name of Cloudify's manager machine.
   * `port`: The port of the REST API service on Cloudify's management machine.
   * `protocol`: The protocol of the REST API service on management machine, defaults to http.
   * `api_version`: The version of the Cloudify REST API service.
   * `headers`: Headers to be added to the HTTP requests.
   * `query_params`: Query parameters to be added to the HTTP request.
   * `cert`: Path on the Cloudify manager to a copy of the target Cloudify manager's certificate.
   * `trust_all`: If False, the server's certificate (self-signed or not) will be verified.
   * `username`: Cloudify user username.
   * `password`: Cloudify user password.
   * `token`: Cloudify user token.
   * `tenant`: Cloudify user accessible tenant name.
 
**Runtime properties:**

These are the used runtime properties for the *internal implementation*:

* `deployment`:
    * `id`: deployment name.
* `capabilities`: A dictionary that contains the capabilities of the Component's deployment, which were fetched the last time a workflow was run on that node.

# Examples

* Simple example:
{{< highlight  yaml >}}
shared_resource_node:
  type: cloudify.nodes.SharedResource
  properties:
    client:
        host: 127.0.0.1
        username: admin
        password: admin
        tenant: default_tenant
    resource_config:
      deployment:
        id: shared_deployment_id
{{< /highlight >}}
