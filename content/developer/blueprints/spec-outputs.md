---
layout: bt_wiki
title: Outputs
category: Blueprints
draft: false
weight: 600

---

`outputs` enable you to expose global aspects of a deployment. When deployed, a blueprint can expose specific outputs of that deployment - for example, an endpoint of a server or any other runtime or static information of a specific resource.

{{% gsNote title="Note" %}}
Beginning with [definitions version]({{< relref "blueprints/spec-versioning.md" >}}) `cloudify_dsl_1_3`, you can import `outputs` multiple times.
{{% /gsNote %}}

# Declaration

{{< gsHighlight  yaml >}}
outputs:
  output1:
    ...
  output2:
    ...
{{< /gsHighlight >}}

# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | description | An optional description for the output.
value       | yes      | \<any\>     | The output value. May be anything from a simple value (e.g. port) to a complex value (e.g. hash with values). Output values can contain hard-coded values, [inputs]({{< relref "blueprints/spec-intrinsic-functions.md#get-input" >}}), [properties]({{< relref "blueprints/spec-intrinsic-functions.md#get-property" >}}) and [attributes]({{< relref "blueprints/spec-intrinsic-functions.md#get-attribute" >}}).

<br>

# Example

{{< highlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

imports:
  - http://www.getcloudify.org/spec/cloudify/4.3/types.yaml

node_templates:
  webserver_vm:
    type: cloudify.nodes.Compute
  webserver:
    type: cloudify.nodes.WebServer
    properties:
        port: 8080

outputs:
    webapp_endpoint:
        description: ip and port of the web application
        value:
            ip: { get_attribute: [webserver_vm, ip] }
            port: { get_property: [webserver, port] }
{{< /gsHighlight >}}

# Reading Outputs
You can view the outputs either by using the [CLI]({{< relref "cli/deployments.md" >}})
{{< gsHighlight  bash  >}}
cfy deployments outputs DEPLOYMENT_ID
{{< /gsHighlight >}}
or by making a REST call
{{< gsHighlight  bash  >}}
curl -X GET --header "Tenant: <manager-tenant>" -u <manager-username>:<manager-password> "http://<manager-ip>/api/v3.1/deployments?id=<deployment-id>&_include=outputs"
{{< /gsHighlight >}}
