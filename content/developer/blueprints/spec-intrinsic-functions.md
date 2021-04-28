---
layout: bt_wiki
title: Intrinsic Functions
category: Blueprints
draft: false
weight: 800
aliases: /blueprints/spec-intrinsic-functions/
---

Intrinsic functions are functions that can be used within blueprints. Depending on the function, evaluation occurs on deployment creation or in runtime.
During deployment creation, the "runtime only evaluation" flag can be set, which makes all functions be evaluated on-demand in runtime.

For example, the `get_input` intrinsic function is used to retrieve an input defined within the blueprint.
Intrinsic functions make blueprints dynamic, enabling the retrieval and setting of data structures in different parts of the blueprint.

# `get_secret`

`get_secret` is used for referencing `secrets` described in the [secrets]({{< relref "cli/orch_cli/secrets.md" >}}) API. `get_secret` can be used in node properties, [outputs]({{< relref "developer/blueprints/spec-outputs.md" >}}), node/relationship operation inputs, and runtime-properties of node instances. The function is evaluated at runtime.


Example:

{{< highlight  yaml >}}


node_templates:
  host:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_secret: ip }
      cloudify_agent:
        key: { get_secret: agent_key }
        user: { get_secret: user }
    interfaces:
      test_interface:
        test_operation:
          implementation: central_deployment_agent
          inputs:
            operation_input: { get_secret: operation_input }

outputs:

  webserver_url:
    description: Web server url
    value: { concat: ['http://', { get_secret: ip }, ':', { get_secret: webserver_port }] }

{{< /highlight >}}

In this example, `get_secret` is used for completing several of the host node's properties, as well as an operation input. In addition, it is used twice in the concatenated `webserver_url` output.

# `get_input`

`get_input` is used for referencing `inputs` described in the [inputs]({{< relref "developer/blueprints/spec-inputs.md" >}}) section of the [blueprint]({{< relref "developer/blueprints/_index.md" >}}). get_input can be used in node properties, [outputs]({{< relref "developer/blueprints/spec-outputs.md" >}}), and node/relationship operation inputs. The function is evaluated on deployment creation by default (unless the "runtime only evaluation" flag is set).

Example:

{{< highlight  yaml >}}

inputs:

  webserver_port:
    description: The HTTP web server port
    default: 8080
    
  vm_info:
    description: The HTTP web server port
    default:
      key_name: 'my-openstack-key-name'

node_templates:
  ...

  vm:
    type: cloudify.openstack.nodes.Server
    properties:
      server:
        image_name: { get_input: image_name }
        key_name: { get_input: [ vm_info, key_name ] }

  ...

  http_web_server:
    type: cloudify.nodes.WebServer
    properties:
      port: { get_input: webserver_port }
    relationships:
      - type: cloudify.relationships.contained_in
        target: vm

outputs:

  webserver_port:
    description: Web server port
    value: { get_input: webserver_port }

  vm_key_name:
    description: Web server port
    value: { get_input: [ vm_info, key_name ] }

{{< /highlight >}}

In the example, `get_input` is used for supplying the `http_web_server` node's port property and the `vm` node's `key_name` property. If on deployment creation the `webserver_port` input is not specified, `get_input` returns the default value of the `webserver_port` input.
Similarly, if the `vm_info` input is not specified, `get_input` returns the default value of the `vm_info` input.

# `get_capability`

`get_capability` is used for referencing `capabilities` defined in _other_ 
deployments, as described in the [capabilities]({{< relref "developer/blueprints/spec-capabilities.md" >}}) 
section of the [blueprint]({{< relref "developer/blueprints/_index.md" >}}). 
`get_capability` can be used in node properties, [outputs]({{< relref "developer/blueprints/spec-outputs.md" >}}), and node/relationship operation inputs. 
The function is evaluated at runtime. This means that the results of the 
evaluation may differ according to their original values in the defining deployment. 

Example:

First, we need to create a deployment that defines capabilities:
{{< highlight  yaml >}}

inputs:
  some_input: some_value

node_types:
  test_type:
    derived_from: cloudify.nodes.Root
    properties:
      key:
        default: default_value
  
  dummy_type:
    derived_from: cloudify.nodes.Root
    properties:
      input_property: { get_input: some_input }

node_templates:
  node1:
    type: test_type
  node2:
    type: test_type
    properties:
      key: override_value
  dummy_node:
    type: dummy_type

capabilities:
  node_1_key:
    value: { get_attribute: [ node1, key ]}
  node_2_key:
    value: { get_attribute: [ node2, key ]}
  complex_capability:
    value:
      level_1:
        level_2:
          level_3: [ value_1, value_2 ]
          key_1: value_3
        key_2: value_4
  input_capability:
    value: { get_attribute: [ dummy_node, input_property ]

{{< /highlight >}}

We should note several things here:

* `capabilities` can have complex values, with multiple layers (see `complex_capability`).
* Other intrinsic functions can be used to define capabilities. Note that only
functions that are evaluated at runtime are allowed, so only `get_attribute`,
 `get_secret` and `concat` will work, while `get_property` and `get_input` will not.
 (unless the "runtime only evalution" flag is set).
 `get_property` can easily be replaced by `get_attribute`, so this isn't really
 a limitation, however, if its is desirable to pass inputs as capabilities, a
 dummy node instance can be created, and then `get_attribute` can be deployed 
 to retrieve it (see `input_capability`)
 
Let's assume now that a deployment with the ID `shared` was created from 
the above blueprint. Let's now create a second deployment to utilize the
`get_capability` intrinsic function:

{{< highlight  yaml >}}

node_types:
  test_type:
    derived_from: cloudify.nodes.Root
    properties:
      key:
        default: { get_capability: [ shared, node_1_key ] }

node_templates:
  node1:
    type: test_type
  node2:
    type: test_type
    properties:
      key: { get_capability: [ shared, node_2_key ] }

outputs:
  complex_output:
    value: { get_capability: [ shared, complex_capability ] }

  nested_complex_output:
    value: { get_capability: [ shared, complex_capability, level_1, level_2, level_3, 0 ] }
    
{{< /highlight >}}

Here we can see how `get_capability` is used - the input to the function
is a list with at least 2 values: the ID of the deployment, the name of the
capability and optionally nested attributed/list indices, as defined in the shared blueprint.
Note that both the deployment ID and the capability name can be provided
using other intrinsic functions (e.g. `get_input` or `get_secret`). So, in case
the deployment ID is not known in advance, we could do something like this:

{{< highlight  yaml >}}

outputs:
  some_output:
    value: { get_capability: [ { get_secret: shared_deployment_id }, complex_capability ] }

{{< /highlight >}}

# `get_environment_capability`

`get_environment_capability` is an alias for using `{ get_capabilities: [ {get_label: csys-obj-parent,0}, CAPABILITY_NAME]}`
where we can get the environment capabilities of the environment that blueprint is referencing.
`get_environment_capability` can be used in node properties, [outputs]({{< relref "developer/blueprints/spec-outputs.md" >}}), and node/relationship operation inputs. 
The function is evaluated at runtime. This means that the results of the 
evaluation may differ according to their original values in the defining deployment.   

Example:

First, we need to create a deployment that defines capabilities:
{{< highlight  yaml >}}

inputs:
  some_input: some_value

node_types:
  test_type:
    derived_from: cloudify.nodes.Root
    properties:
      key:
        default: default_value
  
  dummy_type:
    derived_from: cloudify.nodes.Root
    properties:
      input_property: { get_input: some_input }

node_templates:
  node1:
    type: test_type
  node2:
    type: test_type
    properties:
      key: override_value
  dummy_node:
    type: dummy_type

capabilities:
  node_1_key:
    value: { get_attribute: [ node1, key ]}
  node_2_key:
    value: { get_attribute: [ node2, key ]}
  complex_capability:
    value:
      level_1:
        level_2:
          level_3: [ value_1, value_2 ]
          key_1: value_3
        key_2: value_4
  input_capability:
    value: { get_attribute: [ dummy_node, input_property ]

{{< /highlight >}}

Let's assume now that a deployment with the ID `shared` was created from 
the above blueprint. Let's now create a second deployment to utilize the
`get_environment_capability` intrinsic function and we need to make sure
that deployment has `csys-obj-parent` label that matches name of
the first deployment (environment) `shared`.

{{< highlight  yaml >}}

labels:
  csys-obj-parent:
    values:
      - shared

node_types:
  test_type:
    derived_from: cloudify.nodes.Root
    properties:
      key:
        default: { get_capability: [ shared, node_1_key ] }

node_templates:
  node1:
    type: test_type
  node2:
    type: test_type
    properties:
      key: { get_capability: [ shared, node_2_key ] }

outputs:
  complex_output:
    value: { get_environment_capability: complex_capability }

  nested_complex_output:
    value: { get_environment_capability: [ complex_capability, level_1, level_2, level_3, 0 ] }
    
{{< /highlight >}}


# `get_property`

`get_property` is used for referencing node properties within a blueprint. get_property can be used in node properties, outputs, and node/relationship operation inputs. The function is evaluated on deployment creation by default (unless the "runtime only evaluation" flag is set).

## Usage and Examples

### get_property in node properties and interface operation inputs

{{< highlight  yaml  >}}
node_templates:
  security_group:
    type: cloudify.openstack.nodes.SecurityGroup
    properties:
      rules:
        - remote_ip_prefix: 0.0.0.0/0
          port: { get_property: [web_server, port] }

  web_server:
    type: cloudify.nodes.WebServer
    properties:
      port: 80
    interfaces:
      cloudify.interfaces.lifecycle
        create:
          ...
        configure:
          implementation: some_plugin.tasks.configure
          inputs:
            port: { get_property: [SELF, port] }
{{< /highlight >}}

In the example, get_property is used for specifying a security group's rule port as the web_server node's port. In addition, get_property is used for passing the web_server's port property as an input to the configure operation. The keyword `SELF` is used for specifying that the referenced property belongs to the current node. In this case, using `web_server` instead of `SELF` provides the same outcome.

<br>
### *get_property* in relationship interface operation inputs:

{{< highlight  yaml  >}}
node_templates:
  db_server:
    type: cloudify.nodes.DBMS
    properties:
      endpoint: 10.0.0.1:3376

  web_server:
    type: cloudify.nodes.WebServer
    properties:
      port: 8080
    relationships:
      - target: db_server
        type: cloudify.relationships.connected_to
        source_interfaces:
          cloudify.interfaces.relationship_lifecycle:
            preconfigure:
              implementation: some_plugin.tasks.my_preconfigure
              inputs:
                db_endpoint: { get_property: [TARGET, endpoint] }
                webserver_port: { get_property: [SOURCE, port] }
{{< /highlight >}}

In this example, get_property is used to reference the source and target nodes' properties. The `SOURCE` and `TARGET` keywords can only be used in a relationship interface.

<br>
### *get_property* in *outputs*:

{{< highlight  yaml  >}}
node_templates:
  web_server
    type: cloudify.nodes.WebServer
    properties:
      port: 80

outputs:
  web_server_id:
    description: Web server port
    value: { get_property: [web_server, port] }
{{< /highlight >}}

### get_property Nested Properties and Complex Structures

It is possible to reference nested properties within dictionaries/hashes and lists in any nesting level. To access a property within a list, the index of the item must be specified. To access values in a dictionary/hash, a key must be specified.

{{< highlight  yaml  >}}
node_templates:
  vm:
    type: cloudify.nodes.Compute
    properties:
      ip_addresses:
        - 192.168.0.7
        - 15.67.45.29

  web_server:
    type: cloudify.nodes.WebServer
    properties:
      endpoint:
        type: http
        port: 80
    relationships:
      - target: vm
        type: cloudify.relationships.contained_in
        source_interfaces:
          cloudify.interfaces.relationship_lifecycle:
            preconfigure:
              implementation: some_plugin.tasks.my_preconfigure
              inputs:
                public_ip: { get_property: [TARGET, ip_addresses, 1] }
                endpoint_type: { get_property: [SOURCE, endpoint, type] }
{{< /highlight >}}

# get_attribute

`get_attribute` is used to reference runtime-properties of different node-instances from within a blueprint.

## Usage and Examples
### get_attribute in outputs

For this example, assume a `webserver_id` runtime property has been set on the `web_server` instance.

{{< highlight  yaml  >}}
node_templates:
  web_server
    type: cloudify.nodes.WebServer

outputs:
  web_server_id:
    description: Web server ID
    value: { get_attribute: [web_server, webserver_id] }
{{< /highlight >}}

In the example, the `web_server_id` deployment output is configured to reference the `web_server` runtime property `webserver_id`. Each time the deployment outputs are evaluated, the reference is replaced with its current value.

<br>
### *get_attribute* in Node Interface Operation Inputs

For this example, assume a `connection_url` runtime property has been set on the `db_server` instance and a `requested_version` runtime property has been set on the `web_server` instance.

{{< highlight  yaml  >}}
node_templates:
  db_server:
    type: cloudify.nodes.DBMS
  web_server:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle
        create:
          ...
        configure:
          implementation: some_plugin.tasks.configure
          inputs:
            db_connection_url: { get_attribute: [db_server, connection_url] }
            webserver_version: { get_attribute: [SELF, requested_version] }
{{< /highlight >}}

In the example, each time the `configure` operation of `web_server` instances is invoked, the inputs `db_connection_url` and `webserver_version` are evaluated. The `db_connection_url` input evaluates to the `db_server` runtime property `connection_url`, and the `webserver_version` evaluates to the `web_server` runtime property `requested_version`. `SELF` is used to reference run-time properties of the current node instance in `webserver_version`.

<br>
### *get_attribute* in Relationship Interface Operation Inputs

For this example, assume a `connection_url` runtime property has been set on the `db_server` instance and a `requested_version` runtime property has been set on the `web_server` instance.

{{< highlight  yaml  >}}
node_templates:
  db_server:
    type: cloudify.nodes.DBMS
  web_server:
    type: cloudify.nodes.WebServer
    relationships:
      - target: db_server
        type: cloudify.relationships.connected_to
        source_interfaces:
          cloudify.interfaces.relationship_lifecycle:
            preconfigure:
              implementation: some_plugin.tasks.my_preconfigure
              inputs:
                db_connection_url: { get_attribute: [TARGET, connection_url] }
                webserver_version: { get_attribute: [SOURCE, requested_version] }
{{< /highlight >}}

In the example, each time the `preconfigure` relationship operation is invoked, the inputs `db_connection_url` and `webserver_version` are evaluated. The `db_connection_url` input evaluates to the `db_server` runtime property `connection_url`. The `webserver_version` evaluates to the `web_server` runtime property `requested_version`. `SOURCE` and `TARGET` are used to reference the relationship source and target node instances respectively.

### get_attribute Nested Properties and Complex Structures

Attribute access may be nested and is not restricted to top-level properties. In this example, assume a `webserver_spec` runtime property has been set on the `web_server` instance with this value:
{{< highlight  json  >}}
{
  "requested_version": "11.2",
  "alternative_versions": ["11.3", "12.0"],
  "endpoints": {
    "endpoint_1": {
      "description": "An endpoint of the web server",
      "url": "/endpoint1"
    },
    "endpoint_2": {
      "description": "Another endpoint of the web server",
      "url": "/endpoint2"
    }
  }
}
{{< /highlight >}}

With this value in place, nested properties can be accessed as follows:

{{< highlight  yaml  >}}
outputs:
  alt_version1:
    # evaluates to "12.0"
    value: { get_attribute: [web_server, webserver_spec, alternative_version, 1] }
  enpoint_2_url:
    # evaluates to "/endpoint2"
    value: { get_attribute: [web_server, webserver_spec, endpoints, endpoint_2, url] }
  partial_spec:
    value:
      version: { get_attribute: [web_server, webserver_spec, requested_version] }
      alt_versions:
        version1: { get_attribute: [web_server, webserver_spec, alternative_versions, 0] }
        version2: { get_attribute: [web_server, webserver_spec, alternative_versions, 1] }
{{< /highlight >}}

Notice that nested properties can be either a key name in the case of a map, or an index in case of a list. Also note in `partial_spec` that `get_attribute` can be used in complex data structures and not only in a flat key/value manner.

### get_attribute to get Node Instance ID

Use `get_attribute` to retrieve the ID of a node instance:

{{< highlight  yaml  >}}
{ get_attribute: [node, node_instance_id] }
{{< /highlight >}}

`node` can be SELF, SOURCE, TARGET or node name according to the context in the blueprint.

### get_attribute Between Members of Shared Scaling Groups
In general, `get_attribute` cannot be used with an explicit reference (i.e. specifying a node name directly) when more than one node instance matching the specified node exists.

If however, the *referenced node* shares a [scaling group]({{< relref "developer/blueprints/multiple-instances.md" >}}#scaling-policy-and-scaling-groups-configuration) with the *referencing node*, the ambiguity may be resolved.

Resolving the ambiguity for `get_attribute` usages in the blueprint `outputs` is not supported.

Following is a more detailed explanation, followed by an example.

The term *referencing node* depends on where in the blueprint, `get_attribute` is used. If it is used in a node operation's inputs (e.g. `cloudify.interfaces.lifecycle.start`), *referencing node* is the node template under which the operation is defined. If `get_attribute` is used in a relationship operation's inputs (e.g. `cloudify.interfaces.relationship_lifecycle.establish`), *referencing node* is actually *referencing nodes*, which are the source and target nodes in the relationship operation. Both can be used as a *referencing node*, and the first to resolve the ambiguity is used.

Consider the case in which `A` is the *referencing node* and `B` the *referenced node*. If `A` and `B` belong to a scaling group, and that scaling group's instances contain only one instance of `B`, `get_attribute` resolves to using that `B`'s instance when evaluating the `get_attribute`.

For example:

{{< highlight  yaml  >}}
node_templates:
  db_server:
    type: cloudify.nodes.DBMS
  web_server:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle
        configure:
          implementation: some_plugin.tasks.configure
          inputs:
            # Here, the referencing node is the web_server and the referenced
            # node is the db_server
            db_connection_url: { get_attribute: [db_server, connection_url] }
    relationships:
      - target: db_server
        type: cloudify.relationships.connected_to
        source_interfaces:
          cloudify.interfaces.relationship_lifecycle:
            preconfigure:
              implementation: some_plugin.tasks.my_preconfigure
              inputs:
                # Here, the referencing nodes are web_server and db_server and the
                # referenced node is db_server (a node can reference itself)
                db_connection_url: { get_attribute: [db_server, connection_url] }

groups:
  db_and_webserver:
    members: [db_server, web_server]

policies:
  scaling_policy1:
    type: cloudify.policies.scaling
    properties:
      default_instances: 2
    targets: [db_and_webserver]
{{< /highlight >}}

The blueprint example defines an application with one scaling group `db_and_webserver` that initially has two instances. Each group instance contains one `db_server` node instance and one `web_server` node instance. Both usages of `get_attribute` will correctly resolve to the node instance that is together with the referencing node instance in the same scaling group instance.

{{% tip title="Tip" %}}
If a node template is contained in another node template (for example, a Webserver contained in a VM), and the containing node template is a member in a scaling group, the contained node instance is implicilty a member of the same scaling group.

Using this, you can define a scaling group containing one node (for example, a compute node).

All nodes transitively contained in that compute node can reference each other using an explicit `get_attribute` (reference by node name), even if the compute node has several instances (if the compute node is scaled using its scaling group and not directly). This is possible because they all implicitly belong to the same scaling group instance (that of the compute node instance containing them).

{{% /tip %}}

### Notes, Restrictions and Limitations

* If an attribute is not found in the inspected node instance runtime properties, the scan resorts to the matching node properties. If the attribute is also not found in the node properties, `null` is returned.
* `SELF` may only be used in interface operation inputs.
* `SOURCE` and `TARGET` may only be used in relationship interface operation inputs.

{{% warning title="Limitation" %}}
When using `get_attribute` with an explicit reference, that is, a node's name `{ get_attribute: [ web_server, webserver_spec ] }` and not an implicit reference such as `{ get_attribute: [ SELF, webserver_spec ] }` the following limitation exists.

If, at the time of evaluation, more than one node instance with that name exists and the ambiguity cannot be resolved as described in the previous section, an error is returned.

This limitation has significant implications when using `get_attribute` in node/relationship operation inputs, because it means the operation cannot be executed.
{{% /warning %}}


# `get_label`

`get_label` is used for referencing labels assigned to the deployment generated from the blueprint. 
Labels can be provided while creating the deployment, or in the `labels` section of the blueprint.
`get_label` can be used in node properties, [outputs]({{< relref "developer/blueprints/spec-outputs.md" >}}), 
node/relationship operation inputs, and runtime-properties of node instances. 
The function is evaluated at runtime.
 
The `get_label` function can be used in one of the two ways:
* `{ get_label: <label_key> }`: This function returns a list of all values associated with the specified key, sorted by their creation time and alphabetical order.
* `{ get_label: [<label_key>, <values_list_index>] }`: This function first gathers all values associated with the specified key, 
  sorts them by their creation time and alphabetical order, and then returns the value in the specified index. 
  
Note: The creation time of all labels created during the deployment creation, whether provided in the `labels` section of the blueprint or 
as part of the deployment parameters, is the same. The order of the values in the `labels` section does not matter. 

In the example below, we assume the user created a deployment with the name `shared`, that has the capability `node_1_key1`. 

Example:

{{< highlight  yaml >}}

labels:
  csys-obj-parent:
    values:
      - shared
  environment:
    values:
      - aws


node_types:
  test_type:
    derived_from: cloudify.nodes.Root
    properties:
      key:
        default: default_key
      

node_templates:
  node1:
    type: test_type
    properties:
      key: { get_capability:  [ { get_label: [csys-obj-parent, 0] }, node_1_key ] }

outputs:
  environment_output:
    value: { get_label: [environment, 0] }

{{< /highlight >}}


# concat

`concat` is used for concatenating strings in different sections of a blueprint. `concat` can be used in node properties, [outputs]({{< relref "developer/blueprints/spec-outputs.md" >}}), and node/relationship operation inputs. The function is evaluated once on deployment creation, which replaces [`get_input`](#getinput) and [`get_property`](#getproperty) usages. It is also evaluated on every operation execution and outputs evaluation, to replace usages of [`get_attribute`](#getattribute).

## Example

{{< highlight  yaml >}}

node_templates:
  ...

  http_web_server:
    type: cloudify.nodes.WebServer
    properties:
      port: 8080
      # This will evaluate to 'http://localhost:8080' during deployment creation
      local_endpoint: { concat: ['http://localhost:', { get_property: [SELF, port] }] }
    interfaces:
      cloudify.interfaces.lifecycle:
        configure: scripts/configure.sh
        start:
          implementation: scripts/start.sh
          inputs:
            process:
              env:
                port: { get_input: webserver_port }
                # This will evaluate to 'http://192.168.12.12:8080' before the 'start'
                # operation execution, assuming `the_vm` private ip address is 192.168.12.12
                internal_endpoint: { concat: ['http://', { get_attribute: [the_vm, ip] },
                                              ':', { get_property: [SELF, port] }] }
        stop: scripts/stop.sh

outputs:
  external_endpoint:
    description: Web server external endpoint
    # This will evaluate to 'http://15.16.17.18:8080' every time outputs are evaluated
    # assuming `the_floating_ip` address is 15.16.17.18
    value: { concat: ['http://', { get_attribute: [the_foating_ip, floating_ip_address] },
                      ':', { get_property: [http_web_server, port] }] }
{{< /highlight >}}

# merge

`merge` is used to merge dictionaries. It is similar to `contact` with respect to when it can be used, and when
it is evaluated.

It accepts a list of dictionaries (each one may be static, or dynamically interpreted using
other intrinsic functions), and returns a dictionary that contains a merge of these dictionaries.

If a particular key exists in more than one of the provided dictionaries, the last one prevails.

## Example

{{< highlight  yaml >}}
node_templates:
  ...
  repository:
    type: example.types.Repository
    properties:
      resource_config:
        key1: value1
        key2: value2
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: scripts/start.py
          inputs: { merge: [ { get_property: [ SELF, resource_config], { key3: value3 } } ] }
{{< /highlight >}}

In runtime, the `scripts/start.py` script will receive the following inputs:

```yaml
key1: value1
key2: value2
key3: value3
```

# Intrinsic Functions as arguments of other Intrinsic Functions

Intrinsic Functions can be passed as arguments of other Intrinsic Functions. For example, you may write this in your blueprint:
{{< highlight  yaml >}}

node_templates:
  ...

  http_web_server:
    type: cloudify.nodes.Compute
    properties:
      # The parser will first evaluate the result of the inner `get_input` and 
      # then using it's result, will evaluate the outter get_input.
      # If the input available_ports = [8000, 8080] and web_server_port_no = 0, 
      # then http_web_server.port = 8000.
      port: { get_input: [ available_ports, { get_input: web_server_port_no } ] }
  
  ...
{{< /highlight >}}

{{% warning title="Limitation" %}}
The arguments of a static function (e.g. [`get_input`](#getinput), [`get_property`](#getproperty)) may not contain any runtime function (e.g. [`get_attribute`](#getattribute), [`get_secret`](#getsecret)).
You may also note that function `concat` for example is neither static or runtime, therefore it may be passed as an argument to a static function as long as 
it doesn't contain runtime functions.
For example this is OK: <span style="color:green"> **&#x2713;** </span>
{{< highlight  yaml >}}

node_templates:
  ...

outputs:
  some_output:
    value: 
        { get_input: 
            { concat: [ { get_property: [ server1, protocol_prefix ] },
                        { get_property: [ server1, preset_ip_addr ] } ] }}
  ...
{{< /highlight >}}

This is not OK (a runtime function [`get_attribute`](#getattribute) within a static function [`get_input`](#getinput)): <span style="color:green"> **&#x2718;** </span>
{{< highlight  yaml >}}

node_templates:
  ...

outputs:
  some_output:
    value: 
        { get_input: 
            { concat: [ { get_property: [ server1, protocol_prefix ] },
                        { get_attribute: [ server1, ip_addr ] } ] }}
  ...
{{< /highlight >}}
{{% /warning %}}