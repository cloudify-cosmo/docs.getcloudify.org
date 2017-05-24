---
layout: bt_wiki
title: Intrinsic Functions
category: Blueprints
draft: false
weight: 800

---

`intrinsic_functions` are functions that can be used within blueprints. Depending on the function, evaluation occurs on deployment creation or in runtime. For example, the `get_input` intrinsic function is used to retrieve an input defined within the blueprint.

intrinsic_functions make blueprints dymanic, allowing to retrieve and set data structures in different parts of the blueprint.

# *get_input*

`get_input` is used for referencing `inputs` described in the [inputs]({{< relref "blueprints/spec-inputs.md" >}}) section of the [blueprint]({{< relref "blueprints/overview.md" >}}). get_input can be used in node properties, [outputs]({{< relref "blueprints/spec-outputs.md" >}}), and node/relationship operation inputs. The function is evaluated on deployment creation.


Example:

{{< gsHighlight  yaml >}}

inputs:

  webserver_port:
    description: The HTTP web server port
    default: 8080

node_templates:
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

{{< /gsHighlight >}}


In the previous example, get_input was used for filling in the http_web_server node's port property. If on deployment creation the webserver_port input is not specified, get_input will return the default value of the webserver_port input.



# *get_property*

`get_property` is used for referencing node properties within the blueprint. get_property can be used in node properties, outputs, and node/relationship operation inputs. The function is evaluated on deployment creation.

## Usage and Examples
### *get_property* in node properties and interface operation inputs:

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}

In the previous example, get_property was used for specifying security group's rule port as the web_server node's port. In addition, get_property was used for passing the web_server's port property as an input to the configure operation. The keyword `SELF` is used for specifying that the referenced property belongs to the current node. In this case, using `web_server` instead of `SELF` will provide the same outcome.

<br>
### *get_property* in relationship interface operation inputs:

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}

In this example, get_property was used for referencing source and target nodes' properties. The `SOURCE` and `TARGET` keywords can only be used in a relationship interface.

<br>
### *get_property* in *outputs*:

{{< gsHighlight  yaml  >}}
node_templates:
  web_server
    type: cloudify.nodes.WebServer
    properties:
      port: 80

outputs:
  web_server_id:
    description: Web server port
    value: { get_property: [web_server, port] }
{{< /gsHighlight >}}


### *get_property* nested properties and complex structures

It is possible to reference nested properties within dictionaries/hashes and lists in any nesting level. For accessing a property within a list, the index of the item should be specified and for accessing values in a dictionary/hash a key should be specified.

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}


# *get_attribute*

`get_attribute` is used to reference runtime-properties of different node-instances from within the blueprint.

## Usage and Examples
### *get_attribute* in *outputs*:

For this example, assume a `webserver_id` runtime property has been set on the `web_server` instance.

{{< gsHighlight  yaml  >}}
node_templates:
  web_server
    type: cloudify.nodes.WebServer

outputs:
  web_server_id:
    description: Web server ID
    value: { get_attribute: [web_server, webserver_id] }
{{< /gsHighlight >}}

In the previous example, the `web_server_id` deployment output is configured to reference the `web_server` runtime property `webserver_id`. Each time the deployment outputs are evaluated, this reference is replaced with its current value.

<br>
### *get_attribute* in node interface operation inputs:

For this example, assume a `connection_url` runtime property has been set on the `db_server` instance and a `requested_version` runtime property has been set on the `web_server` instance.

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}

In the previous example, each time the `configure` operation of `web_server` instances is invoked, the inputs `db_connection_url` and `webserver_version` are evaluated. The `db_connection_url` input will evaluate to the `db_server` runtime property `connection_url` and the `webserver_version` will evaluate to the `web_server` runtime property `requested_version`. Notice how `SELF` is used to reference runtime properties of the current node instance in `webserver_version`.

<br>
### *get_attribute* in relationship interface operation inputs:

For this example, assume a `connection_url` runtime property has been set on the `db_server` instance and a `requested_version` runtime property has been set on the `web_server` instance.

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}

In the previous example, each time the `preconfigure` relationship operation is invoked, the inputs `db_connection_url` and `webserver_version` are evaluated. The `db_connection_url` input will evaluate to the `db_server` runtime property `connection_url` and the `webserver_version` will evaluate to the `web_server` runtime property `requested_version`. Notice how `SOURCE` and `TARGET` are used to reference the relationship source and target node instances respectively.

### *get_attribute* nested properties and complex structures

Attribute access can be nested and is not restricted to top level properties. For this example, assume a `webserver_spec` runtime property has been set on the `web_server` instance with this value:
{{< gsHighlight  json  >}}
{
  "requested_version": "11.2",
  "alternative_versions": ["11.3", "12.0"],
  "endpoints": {
    "endpoint_1": {
      "description": "Some endpoint of the web server",
      "url": "/endpoint1"
    },
    "endpoint_2": {
      "description": "Some other endpoint of the web server",
      "url": "/endpoint2"
    }
  }
}
{{< /gsHighlight >}}

With this value in place, nested properties can be accessed as follows:

{{< gsHighlight  yaml  >}}
outputs:
  alt_version1:
    # will evaluate to "12.0"
    value: { get_attribute: [web_server, webserver_spec, alternative_version, 1] }
  enpoint_2_url:
    # will evaluate to "/endpoint2"
    value: { get_attribute: [web_server, webserver_spec, endpoints, endpoint_2, url] }
  partial_spec:
    value:
      version: { get_attribute: [web_server, webserver_spec, requested_version] }
      alt_versions:
        version1: { get_attribute: [web_server, webserver_spec, alternative_versions, 0] }
        version2: { get_attribute: [web_server, webserver_spec, alternative_versions, 1] }
{{< /gsHighlight >}}

Notice how nested properties can be either a key name in case of a map or an index in case of a list. Also note from `partial_spec` that `get_attribute` can be used in complex data structures and not only in a flat key/value manner.

### *get_attribute* between members of shared scaling groups
In the general case, `get_attribute` cannot be used with explicit reference (i.e. specifying a node name directly) when more than one node instance matching the specified node exists.

If however, the *referenced node* shares a [scaling group]({{< relref "blueprints/scaling.md" >}}#scaling-policy-and-scaling-groups-configuration) with the *referencing node*, the ambiguity may be resolved.

The actual details are a little more intricate, and what follows is an explanation followed by an example.

First, the term *referencing node* depends on where in the blueprint, `get_attribute` is used. If it is used in a node operation's inputs (e.g. `cloudify.interfaces.lifecycle.start`), *referencing node* is the node template under which the operation is defined.

If on the other hand, `get_attribute` is used in a relationship operation's inputs (e.g. `cloudify.interfaces.relationship_lifecycle.establish`), *referencing node* is actually *referencing nodes*, which are the source and target nodes involved in the relationship operation. As we'll see, both can be used as a *referencing node*, and the first of them to resolve the ambiguity will be used.

Resolving the ambiguity for `get_attribute` usages in the blueprint `outputs` is not supported.

Moving on.

So, let `A` be the *referencing node* and `B` be the *referenced node*. If `A` and `B` belong to some scaling group and that scaling group's instances contain only one instance of `B`, `get_attribute` will resolve to using that `B`'s instance when evaluating the `get_attribute`.

And now, an example:

{{< gsHighlight  yaml  >}}
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
            # here, the referencing node is the web_server and the referenced
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
                # here the referencing nodes are web_server and db_server and the
                # referenced node is db_server (i.e. a node can reference itself)
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
{{< /gsHighlight >}}

The above blueprint defines an application with one scaling group `db_and_webserver` that has 2 instances (initially). Each group instance contains
one `db_server` node instance and one `web_server` node instance. Both usages of `get_attribute` will correctly resolve to the node instance that is
together with the referencing node instance in the same scaling group instance.

{{% gsTip title="Tip" %}}
If a node template is contained in another node template (e.g. a webserver contained in a vm), and the containing node template is a member in a scaling group,
the contained node instance is implicilty a member of the same scaling group.

Using this, we can define a scaling group containing one node (e.g. a compute node).

All nodes contained (transitively) in that compute node can reference each other using explicit `get_attribute` (reference by node name) even if the compute node has several instances (if the compute node is scaled using its scaling group and not directly).

This is because they all implicitly belong to the same scaling group instance (that of the compute node instance containing them).

{{% /gsTip %}}

### Notes, restrictions and limitations

* If an attribute is not found in the inspected node instance runtime properties, the scan will fall back to the matching node properties. If the attribute is not found in the node properties as well, `null` is returned.
* `SELF` can only be used in interface operation inputs.
* `SOURCE` and `TARGET` can only be used in relationship interface operation inputs.
* Node properties are immutable, and are set before runtime. Since `get_attribute` retrieves runtime properties which are set during runtime, it cannot be used to set node properties.

{{% gsWarning title="Note" %}}
When using `get_attribute` with an explicit reference, that is, a node's name `{ get_attribute: [ web_server, webserver_spec ] }` and not an implicit reference such as `{ get_attribute: [ SELF, webserver_spec ] }` the following limitation exists.

If, at the time of evaluation, more than one node instance with that name exists and the ambigiuoity cannot be resolved as described in the previous section, an error is raised.

This has significant implications when using `get_attribute` in node/relationship operation inputs, as it means the operation can not be executed.
{{% /gsWarning %}}

# *concat*

`concat` is used for concatenating strings in different sections of the blueprint. `concat` can be used in node properties, [outputs]({{< relref "blueprints/spec-outputs.md" >}}), and node/relationship operation inputs. The function is evaluated once on deployment creation which will replace [`get_input`](#getinput) and [`get_property`](#getproperty) usages; and it is evaluated on every operation execution and outputs evaluation, to replace usages of [`get_attribute`](#getattribute) (if there are any).


## Example

{{< gsHighlight  yaml >}}

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
{{< /gsHighlight >}}
