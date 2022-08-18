---
title: DSL Definitions
category: Blueprints
draft: false
weight: 1300
aliases: /blueprints/spec-dsl-definitions/
---

You can use the `dsl_definitions` section to define arbitrary data structures that can then be reused in different parts of the blueprint using [YAML anchors and aliases](https://gist.github.com/ddlsmurf/1590434).

# Supported Definitions

To use `dsl_definitions`, the [definitions version]({{< relref "developer/blueprints/spec-versioning.md" >}}) must be `cloudify_dsl_1_2` or higher.

# Usage

The YAML 1.2 specification enables the definition of aliases which allow for authoring a block of YAML once and indicating it as an "anchor", which is then referenced elsewhere in the same document as an "alias". Effectively, YAML parsers treat this as a "macro" and copy the anchor block's code to wherever it is referenced. Use of this feature is especially helpful when authoring blueprints in which similar definitions and property settings might be repeated multiple times.

For example, an application that has a Web server and database (i.e., a two-tier application) can be described using two compute nodes, one to host the web server and the other to host the database. The author might want both compute nodes to be instantiated with similar properties such as image, flavor, and so on. To accomplish this, the author would describe the reusable properties using a named anchor in the `dsl_definitions` section of the blueprint and reference the anchor name as an alias in any compute node templates in which the properties need to be reused.


# Examples

## Example 1

The structure of the `dsl_definitions` can be a `dict`.

{{< highlight  yaml >}}
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

{{< /highlight >}}

## Example 2

The structure of the `dsl_definitions` can also be a `list`.

{{< highlight  yaml >}}
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

{{< /highlight >}}

## Example 3

You can use aliases to reference nested anchors.

{{< highlight  yaml >}}
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

{{< /highlight >}}


## Example 4

You can use aliases to merge properties using the `<<` key.

{{< highlight  yaml >}}
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

{{< /highlight >}}

In this example, note that `<<` can be used several times in the same `dict`. If there are overlapping keys, the last occurrence takes precedence.
