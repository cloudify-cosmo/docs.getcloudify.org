---
layout: bt_wiki
title: DSL Definitions
category: Blueprints DSL
publish: true
abstract: "DSL Definitions"
pageord: 300

---
{{% gsSummary %}}
The `dsl_definitions` section can be used to define arbitrary data structures that can then be reused in different parts of the blueprint using YAML anchors and aliases.
{{% /gsSummary %}}

The YAML 1.2 specification allows for defining of aliases which allow for authoring a block of YAML once and indicating it is an "anchor" and then referencing it elsewhere in the same document as an "alias". Effectively, YAML parsers treat this as a "macro" and copy the anchor block's code to wherever it is referenced. Use of this feature is especially helpful when authoring blueprints where similar definitions and property settings may be repeated multiple times.

For example, an application that has a web server and database (i.e., a two-tier application) may be described using two Compute nodes (one to host the web server and another to host the database). The author may want both Compute nodes to be instantiated with similar properties such as image, flavor, etc.

To accomplish this, the author would describe the reusable properties using a named anchor in the `dsl_definitions` section of the blueprint and reference the anchor name as an alias in any Compute node templates where these properties may need to be reused.

# Supported Since
To use `dsl_definitions`, the [definitions version](dsl-spec-versioning.html) must be `cloudify_dsl_1_2` or greater.

# Examples

## Example 1

The structure of the `dsl_definitions` may be a `dict`.

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

dsl_definitions:
  compute_properties: &compute_properties
    image: Ubuntu 14.04
    flavor: small

node_templates:

  web_server_host:
    type: my.nodes.Compute
    properties: *compute_properties

  db_server_host:
    type: my.nodes.Compute
    properties: *compute_properties

{{< /gsHighlight >}}

## Example 2

The structure of the `dsl_definitions` may also be a `list`.

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

dsl_definitions:
  - &compute_properties1
    image: Ubuntu 14.04
    flavor: small
  - &compute_properties2
    image: CentOS 7.0
    flavor: small

node_templates:

  web_server_host:
    type: my.nodes.Compute
    properties: *compute_properties1

  db_server_host:
    type: my.nodes.Compute
    properties: *compute_properties2

{{< /gsHighlight >}}

## Example 3

You may also use aliases to reference nested anchors.

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

dsl_definitions:
  compute_props:
    - &ubuntu_properties
      image: Ubuntu 14.04
      flavor: small
    - &Centos_properties
      image: CentOS 7.0
      flavor: small
  app_properties: &app_properties
    port: 8080
    name: my_app


node_templates:

  web_server_host:
    type: my.nodes.Compute
    properties: *ubuntu_properties

  db_server_host:
    type: my.nodes.Compute
    properties: *Centos_properties

  app:
    type: my.nodes.Application
    properties: *app_properties

{{< /gsHighlight >}}


## Example 4

You may also use aliases to merge properties using the `<<` key.

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_2

dsl_definitions:
  - &partial_compute_properties
    image: Ubuntu 14.04
    flavor: small

node_templates:

  web_server_host:
    type: my.nodes.Compute
    properties:
      <<: *partial_compute_properties
      name: web

  db_server_host:
    type: my.nodes.Compute
    properties:
      <<: *partial_compute_properties
      name: db

{{< /gsHighlight >}}

In the previous example, note that `<<` may be used several times in the same `dict`. If there are overlapping keys, the last occurrence will take precedence.
