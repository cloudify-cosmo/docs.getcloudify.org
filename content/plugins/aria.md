---
layout: bt_wiki
title: ARIA Plugin
category: Plugins
draft: false
weight: 100
---
{{% gsSummary %}} {{% /gsSummary %}}

The ARIA plugin enables to use TOCSA-based service templates for deploying services and applications.



# Plugin Requirements

* Python version 2.7.x


# Compatibility


This version of Cloudify is only compatible with ARIA Plugin version 1.0. 

The ARIA plugin uses ARIA version 0.1.1.



      

# Terminology


# Types

This section describes the [node type]({{< relref "blueprints/spec-node-types.md" >}}) definitions. There is one node type, representing an ARIA service.

## cloudify.aria.nodes.Service

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `csar_path` the path of the CSAR containing all the relevant resources for the ARIA service template (e.g the main service template and additional resources), relative to the main blueprint's directory.
  * `inputs` an optional mapping of inputs that will be injected into the ARIA service during it's creation.
  * `plugins` an optional list of strings, representing the filenames of the *ARIA* plugins that will be utilized. These plugins are expected to be inside the top-level `plugins` directory inside the CSAR archive.

**Example**
Describing this node in YAML is pretty straight forward: 

{{< gsHighlight  yaml  >}}

  my_aria_service_node:
    type: cloudify.aria.nodes.Service
    properties:
      csar_path: resources/my_archive.csar
      inputs: 
        input1: my_value
      plugins: ['plugin1.wgn', 'plugin2.wgn']

{{< /gsHighlight >}}

**Attributes**

This node type does not have built-in runtime properties. However, every output defined in the ARIA service template will be reflected as a runtime property of the `cloudify.aria.nodes.Service node`. The reflection is done when the ARIA `install` workflow is run.
For Example, if the ARIA service template has this section:

{{< gsHighlight  yaml  >}}

  outputs:
    output1:
      type: string
      value: 'my_output'

{{< /gsHighlight >}}

Then the `cloudify.aria.nodes.Service` node containing the CSAR with the above service template will have a runtime property with the name `output1` and the value `'my_output'`
 
**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Stores the service template, installs the listed ARIA plugins, and creates the service.
  * `cloudify.interfaces.lifecycle.start` Runs the `install` workflow on the created ARIA service.
  * `cloudify.interfaces.lifecycle.stop` Runs the `uninstall` workflow on the created ARIA service.
  * `cloudify.interfaces.lifecycle.delete` Deletes the service and the service template.


# Examples
