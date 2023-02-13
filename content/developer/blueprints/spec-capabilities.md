---
title: Capabilities
category: Blueprints
draft: false
weight: 600
aliases: /blueprints/spec-capabilities/
---

`capabilities` enable you to expose some aspects of a deployment. 
When deployed, a blueprint can expose specific capabilities of that deployment 
- for example, an endpoint of a server or any other runtime or static 
information of a specific resource.

# Declaration

{{< highlight  yaml >}}
capabilities:
  capability1:
    ...
  capability2:
    ...
{{< /highlight >}}

# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | description | An optional description for the capability.
value       | yes      | \<any\>     | The capability value. May be anything from a simple value (e.g. port) to a complex value (e.g. hash with values). Capability values can contain hard-coded values, [inputs]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-input" >}}), [properties]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-property" >}}), [attributes]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-attribute" >}}) and even other [capabilities]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-capability" >}}).

<br>

# Example

{{< highlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_4

imports:
  - cloudify/types/types.yaml

node_templates:
  webserver_vm:
    type: cloudify.nodes.Compute
  webserver:
    type: cloudify.nodes.WebServer
    properties:
        port: 8080

capabilities:
    webapp_endpoint:
        description: ip and port of the web application
        value:
            ip: { get_attribute: [webserver_vm, ip] }
            port: { get_property: [webserver, port] }
{{< /highlight >}}

# Reading Capabilities
You can view the capabilities either by using the [CLI]({{< relref "cli/orch_cli/deployments.md" >}})
{{< highlight  bash  >}}
cfy deployments capabilities DEPLOYMENT_ID
{{< /highlight >}}
or using it in a blueprint with [get_capability]({{< relref "spec-intrinsic-functions.md" >}}) intrinsic function
or by making a REST call
{{< highlight  bash  >}}
curl -X GET --header "Tenant: <manager-tenant>" -u <manager-username>:<manager-password> "http://<manager-ip>/api/v3.1/deployments/<deployment-id>/capabilities"
{{< /highlight >}}
