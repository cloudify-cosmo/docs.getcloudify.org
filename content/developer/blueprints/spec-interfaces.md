---
layout: bt_wiki
title: Interfaces
category: Blueprints
draft: false
weight: 1000

---

Interfaces enable you to map logical tasks to executable operations.

# Declaration

## Node Types and Relationships Interface

{{< gsHighlight  yaml >}}
node_types:
  some_type:
    interfaces:
      interface1:
        op1:
          ...
        op2:
          ...
      interface2:
        ...
relationships:
  some_relationship:
    source_interfaces:
      interface1:
        ...
    target_interfaces:
      interface2:
        ...
{{< /gsHighlight >}}

Each interface declaration under the different `interfaces`/`source_interfaces`/`target_interfaces` sections is a dictionary of operations.

## Node Templates Interface Declaration

{{< gsHighlight  yaml >}}
node_templates:
  some_node:
    interfaces:
      ...
    relationships:
      - type: ...
        target: ...
        source_interfaces:
          ...
        target_interfaces:
          ...
{{< /gsHighlight >}}

# Operations

## Operation Declaration in Node Types and Relationships Interfaces

{{< gsHighlight  yaml >}}
node_types:
  some_type:
    interfaces:
      interface1:
        op1:
          implementation: ...
          inputs:
            ...
          executor: ...
          max_retries: ...
          retry_interval: ...
{{< /gsHighlight >}}


## Operation Schema

Keyname          | Required | Type        | Description
-----------      | -------- | ----        | -----------
implementation   | yes      | string      | The script or plugin task name to execute.
inputs           | no       | dict        | Schema of inputs to be passed to the implementation as kwargs.
executor         | no       | string      | Valid values: `central_deployment_agent`, `host_agent`. See the [Plugins Specification]({{< relref "blueprints/spec-plugins.md" >}}) for more info.
max_retries      | no       | number      | Maximum number of retries for a task. `-1` means infinite retries (Default: `task_retries` in the Manager blueprint Cloudify Manager type for remote workflows and `task_retries` workflow configuration for local workflows).
retry_interval   | no       | number      | Minimum wait time (in seconds) between task retries (Default: `task_retry_interval` in Manager blueprint Cloudify Manager Type for remote workflows and `task_retry_interval` workflow configuration for local workflows).

<br>
## Operation Simple Mapping

{{< gsHighlight  yaml >}}
node_types:

  some_type:
    interfaces:
      interface1:
        op1: plugin_name.path.to.module.task
{{< /gsHighlight >}}

When mapping an operation to an implementation, if it is not necessary to pass inputs or override the executor, the full mapping structure can be avoided and the implementation can be written directly.

<br>
### Operation Input Declaration

{{< gsHighlight  yaml >}}
node_types:
  some_type:
    interfaces:
      interface1:
        op1:
          implementation: ...
          inputs:
            input1:
              description: ...
              type: ...
              default: ...
          executor: ...
{{< /gsHighlight >}}

### Operation Input Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | string      | Description for the input.
type        | no       | string      | Input type. If a data type is not specified, the type can be anything (also types not listed in the valid types). Valid types: string, integer, boolean
default     | no       | \<any\>     | An optional default value for the input.

<br>

### Operation Inputs in Node Templates Interfaces Declaration

{{< gsHighlight  yaml >}}
node_types:
  some_type:
    interfaces:
      interface1:
        op1:
          implementation: plugin_name.path.to.module.task
          inputs:
            input1:
              description: some mandatory input
            input2:
              description: some optional input with default
              default: 1000
          executor: ...

node_templates:
  type: some_type
  some_node:
    interfaces:
      interface1:
        op1:
          inputs:
            input1: mandatory_input_value
            input3: some_additional_input
{{< /gsHighlight >}}

When an operation in a node template interface is inherited from a node type or a relationship interface:

* All inputs that were declared in the operation inputs schema must be provided.
* Additional inputs, which were not specified in the operation inputs schema, may also be passed.


# Examples

In the following examples, an interface is declared that enables you to:

* Configure a master deployment server using a plugin.
* Deploy code on the hosts using a plugin.
* Verify that the deployment succeeded using a shell script.
* Start an application after the deployment is complete.

For the sake of simplicity, [relationships]({{< relref "blueprints/spec-relationships.md" >}}) are not referred to in these examples.

## Configuring Interfaces in Node Types

Configuring the master server:

{{< gsHighlight  yaml >}}
plugins:
  deployer:
    executor: central_deployment_agent

node_types:
  nodejs_app:
    derived_from: cloudify.nodes.ApplicationModule
    properties:
      ...
    interfaces:
      my_deployment_interface:
        configure:
          implementation: deployer.config_in_master.configure

node_templates:
  nodejs:
    type: nodejs_app
{{< /gsHighlight >}}

In this example, the following declarations have been made:

* Declared a `deployer` plugin which, [by default](#overriding-the-executor), executes its operations on Cloudify Manager.
* Declared a [node type]({{< relref "blueprints/spec-node-types.md" >}}) with a `my_deployment_interface` interface that has a single `configure` operation that is mapped to the `deployer.config_in_master.configure` task.
* Declared a `nodejs` node template of type `nodejs_app`.


## Overriding the Executor

In the above example an `executor` for the `deployer` plugin has been declared.
Cloudify enables you to declare an `executor` for a single operation, overriding the previous declaration.

{{< gsHighlight  yaml >}}
plugins:
  deployer:
    executor: central_deployment_agent

node_types:
  nodejs_app:
    derived_from: cloudify.nodes.ApplicationModule
    properties:
      ...
    interfaces:
      my_deployment_interface:
        configure:
          implementation: deployer.config_in_master.configure
        deploy:
          implementation: deployer.deploy_framework.deploy
          executor: host_agent

node_templates:
  vm:
    type: cloudify.openstack.nodes.Server
  nodejs:
    type: nodejs_app
{{< /gsHighlight >}}

In this example, a `deploy` operation to our `my_deployment_interface` interface has been added. Note that its `executor` attribute is configured to `host_agent`, which means that even though the `deployer` plugin is configured to execute operations on the `central_deployment_agent`, the `deploy` operation is executed on hosts of the `nodejs_app` rather than Cloudify Manager.


## Declaring an Operation Implementation within the Node

You can specify a full operation definition within a node's interface, under the node template itself.

{{< gsHighlight  yaml >}}
plugins:
  deployer:
    executor: central_deployment_agent

node_types:
  nodejs_app:
    derived_from: cloudify.nodes.ApplicationModule
    properties:
      ...
    interfaces:
      my_deployment_interface:
        ...

node_templates:
  vm:
    type: cloudify.openstack.nodes.Server
  nodejs:
    type: nodejs_app
    interfaces:
      my_deployment_interface:
        ...
        start: scripts/start_app.sh
{{< /gsHighlight >}}

If, for example, the `my_deployment_interface` is used on more than the `nodejs` node, while on all other nodes, a `start` operation is not mapped to anything, you will want to have a `start` operation specifically for the `nodejs` node, which will run the application after it is deployed.

A `start` operation is declared and mapped to execute a script specifically on the `nodejs` node.

In this way, you can define your interfaces either in `node_types` or in `node_templates`, depending on whether you want to reuse the declared interfaces in different nodes or declare them in specific nodes.


## Operation Inputs

Operations can specify inputs to be passed to the implementation.

{{< gsHighlight  yaml >}}
plugins:
  deployer:
    executor: central_deployment_agent

node_types:
  nodejs_app:
    derived_from: cloudify.nodes.ApplicationModule
    properties:
      ...
    interfaces:
      my_deployment_interface:
        configure:
          ...
        deploy:
          implementation: deployer.deploy_framework.deploy
          executor: host_agent
          inputs:
            source:
              description: deployment source
              type: string
              default: git
        verify:
          implementation: scripts/deployment_verifier.py

node_templates:
  vm:
    type: cloudify.openstack.nodes.Server
  nodejs_app:
    type: cloudify.nodes.WebServer
    interfaces:
      my_deployment_interface:
        ...
        start:
          implementation: scripts/start_app.sh
          inputs:
            app: my_web_app
            validate: true
{{< /gsHighlight >}}

In this example, an input has been added to the `deploy` operation under the `my_deployment_interface` interface in the `nodejs_app` node type, and two inputs added to the `start` operation in the `nodejs` node's interface.

{{% gsNote title="Note" %}}
Note that interface inputs are _not_ the same type of objects as inputs that are defined in the `inputs` section of the blueprint. Interface inputs are passed directly to a plugin's operation (as **kwargs to the `deploy` operation in the `deployer` plugin) or, in the case of `start` operations, to the [Script Plugin]({{< relref "plugins/script.md" >}}).
{{% /gsNote %}}

# Relationship Interfaces

For information on relationship interfaces see [Relationships Specification]({{< relref "blueprints/spec-relationships.md#relationship-interfaces" >}}).
