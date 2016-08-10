---
layout: bt_wiki
title: Outputs
category: Blueprints
draft: false
weight: 600

---

`outputs` provide a way of exposing global aspects of a deployment. When deployed, a blueprint can expose specific outputs of that deployment - for instance, an endpoint of a server or any other runtime or static information of a specific resource.

{% call c.note("Note") %}
Beginning with [definitions version]({{ relRef("blueprints/spec-versioning.md") }}) `cloudify_dsl_1_3`, you can also import `outputs` multiple times.
{% endcall %}

# Declaration

```yaml
outputs:
  output1:
    ...
  output2:
    ...
```

# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | description | An optional description for the output.
value       | yes      | \<any\>     | The output value. Can be anything from a simple value (e.g. port) to a complex value (e.g. hash with values). Output values can contain hardcoded values, [inputs]({{ relRef("blueprints/spec-intrinsic-functions.md#get-input") }}), [properties]({{ relRef("blueprints/spec-intrinsic-functions.md#get-property") }}) and [attributes]({{ relRef("blueprints/spec-intrinsic-functions.md#get-attribute") }}).

<br>

# Example

```yaml
tosca_definitions_version: cloudify_dsl_1_2

imports:
  - http://www.getcloudify.org/spec/cloudify/3.3/types.yaml

node_templates:
  webserver_vm:
    type: cloudify.nodes.Compute
  webserver:
    type: cloudify.nodes.WebServer
    properties:
        port: 8080

output:
    webapp_endpoint:
        description: ip and port of the web application
        value:
            ip: { get_attribute: [webserver_vm, ip] }
            port: { get_property: [webserver, port] }
```

# Reading Outputs
You can view the outputs either by using the [CLI]({{ relRef("cli/reference.html") }})
```bash
cfy deployments outputs -d DEPLOYMENT_ID
```
or by making a REST call
```bash
curl -XGET http://MANAGER_IP/deployments/<DEPLOYMENT_ID>/outputs
```
