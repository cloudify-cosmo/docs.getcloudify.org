---
layout: bt_wiki
title: ARIA Plugin
category: Official Plugins
draft: false
weight: 100
aliases:
  - /plugins/aria/
  - /developer/official_plugins/aria/
---


The ARIA plugin enables to use TOCSA-based service templates for deploying services and applications.


# Plugin Requirements

* Python version 2.7.x


# Compatibility

This version of Cloudify is only compatible with ARIA Plugin version 1.0. 

The ARIA plugin uses ARIA version 0.1.1.


# Terminology

* **Service-Template** - A TOSCA equivalent to Cloudify's blueprint concept. 
For additional info please refer to the TOSCA [spec](http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/os/TOSCA-Simple-Profile-YAML-v1.0-os.html#_Toc471725224).  
* **Service** - A TOSCA equivaltent to Cloudify's deployment concept. An 
instance of the Service-template, where all [requirements and capabilities](http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/os/TOSCA-Simple-Profile-YAML-v1.0-os.html#_Toc471725207) 
were satisfied and transformed into relationships. 
* **CSAR** - Cloud Service Archive. An archive file which holds the 
service template (and any of its artifacts) and the meta data. For additional
 info please refer to the TOSCA [spec](http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/os/TOSCA-Simple-Profile-YAML-v1.0-os.html#_Toc471725246).


# Types

This section describes the [node type]({{< relref "developer/blueprints/spec-node-types.md" >}}) definitions. There is one node type, representing an ARIA service.

## cloudify.aria.nodes.Service

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `csar_path` the path of the CSAR containing all the relevant resources for the ARIA service template (e.g the main service template and additional resources), relative to the main blueprint's directory.
  * `inputs` an optional mapping of inputs that will be injected into the ARIA service during it's creation.
  * `plugins` an optional list of strings, representing the filenames of the *ARIA* plugins that will be utilized. These plugins are expected to be inside the top-level `plugins` directory inside the CSAR archive.

**Example**

Describing this node in YAML is pretty straight forward: 

{{< highlight  yaml  >}}
  my_aria_service_node:
    type: cloudify.aria.nodes.Service
    properties:
      csar_path: resources/my_archive.csar
      inputs: 
        input1: my_value
      plugins: ['plugin1.wgn', 'plugin2.wgn']
{{< /highlight >}}

**Attributes**

This node type does not have built-in runtime properties. However, every output defined in the ARIA service template will be reflected as a runtime property of the `cloudify.aria.nodes.Service node`. The reflection is done when the ARIA `install` workflow is run.
For Example, if the ARIA service template has this section:

{{< highlight  yaml  >}}
  outputs:
    output1:
      type: string
      value: 'my_output'
{{< /highlight >}}

Then the `cloudify.aria.nodes.Service` node containing the CSAR with the above service template will have a runtime property with the name `output1` and the value `'my_output'`
 
**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Stores the service template, installs the listed ARIA plugins, and creates the service.
  * `cloudify.interfaces.lifecycle.start` Runs the `install` workflow on the created ARIA service.
  * `cloudify.interfaces.lifecycle.stop` Runs the `uninstall` workflow on the created ARIA service.
  * `cloudify.interfaces.lifecycle.delete` Deletes the service and the service template.


# Examples

In this section we will run the ARIA hello-world example (which is written in 
TOSCA) via Cloudify, using the Cloudify ARIA Plugin.

In a nutshell, the ARIA hello world example creates a web server on the machine
ARIA is installed on, and listens on port 9090 to display a 'hello world'
message. A broader walkthrough through the ARIA hello world example can be
found in the [ARIA README](https://github.com/apache/incubator-ariatosca#getting-started).

In order to utilize the plugin's TOSCA handling capabilities, we should first
upload a blueprint containing a node that represents an ARIA service.
The Cloudify ARIA Plugin [repository](https://github.com/cloudify-cosmo/cloudify-aria-plugin)
includes such a blueprint, under the `examples/hello-world` directory:

{{< highlight  yaml  >}}
...

node_templates:
  aria_node:
    type: cloudify.aria.nodes.Service
    properties:
      csar_path: resources/hello-world.csar

...
{{< /highlight >}}

This is a basic ARIA service node, as it does not have the `inputs` and the
`plugins` properties. However, this blueprint will utilize the plugin's
'outputs: runtime properties' reflection feature, meaning that a `port` runtime
property will be assigned to the `aria_node` node with the value of the `port`
output from the ARIA service.

In addition to a blueprint containing an ARIA service node, the `hello-world`
directory also contains a subdirectory with a CSAR file. This CSAR file is an
archived form of the ARIA hello world service template. Now that we have all the needed
resources, we can upload the blueprint: 

`cfy blueprints upload <path-to-cloned-repo>/examples/hello-world/hello-world.yaml hello-aria`

Then, to create a deployment:

`cfy deployments create -b hello-aria hello-aria`

Finally, to install an ARIA service:

`cfy executions start -d hello-aria install`

Now, to check that the ARIA service was properly installed, try to access port
9090 on the Cloudify Manager machine. You are expected to see an hello world
message in the likes of:

![ARIA hello world message]( /images/plugins/aria-hello.png )

In addition, you can access the ARIA service node's runtime properties, to see
the outputs of the installed ARIA service:

`cfy node-instances get <ARIA service node id>`

Finally, to uninstall the ARIA service, just:

`cfy executions start -d hello-aria uninstall` 
