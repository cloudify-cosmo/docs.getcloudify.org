Node Templates
%%%%%%%%%%%%%%

``node_templates`` represent the actual instances of [node types]({{<
relref “blueprints/spec-node-types.md” >}}) that eventually represent
the running application/service, as described in the blueprint.

``node_templates`` are more commonly referred to as ``nodes``. Nodes can
comprise more than one instance. For example, you might define a node
that contains two VMs. Each VM is a ``node_instance``.

.. note::
    :class: summary

    Beginning with [definitions version]({{<    relref “blueprints/spec-versioning.md” >}}) ``cloudify_dsl_1_3``, you

Declaration
===========

The ``node_templates`` section in the DSL is a dictionary in which each
key is a node template.

.. code:: yaml

        node_templates:
        
          node_template_1:
            type: ...
            properties:
              ...
            capabilities:
              scalable:
                properties:
                  ...
              ...
            interfaces:
              ...
            relationships:
              ...
        
          node_template_2:
            ...
        

Schema
======

+----------------------+---------------+-------+----------------------+
| Keyname              | Required      | Type  | Description          |
+======================+===============+=======+======================+
| type                 | yes           | strin | The [node-type]({{<  |
|                      |               | g     | relref               |
|                      |               |       | “blueprints/spec-nod |
|                      |               |       | e-types.md”          |
|                      |               |       | >}}) of this node    |
|                      |               |       | template.            |
+----------------------+---------------+-------+----------------------+
| properties           | no            | dict  | The properties of    |
|                      |               |       | the node template,   |
|                      |               |       | matching its node    |
|                      |               |       | type properties      |
|                      |               |       | schema.              |
+----------------------+---------------+-------+----------------------+
| instances            | no            | dict  | Instances            |
|                      |               |       | configuration.       |
|                      |               |       | (Deprecated.         |
|                      |               |       | Replaced with        |
|                      |               |       | ``capabilities.scala |
|                      |               |       | ble``)               |
+----------------------+---------------+-------+----------------------+
| interfaces           | no            | inter | Used for a mapping   |
|                      |               | faces | plugins to           |
|                      |               |       | [interfaces]({{<     |
|                      |               |       | relref               |
|                      |               |       | “blueprints/spec-int |
|                      |               |       | erfaces.md”          |
|                      |               |       | >}}) operation, or   |
|                      |               |       | for specifying       |
|                      |               |       | inputs for           |
|                      |               |       | already-mapped node  |
|                      |               |       | type operations.     |
+----------------------+---------------+-------+----------------------+
| relationships        | no            | relat | Used for specifying  |
|                      |               | ionsh | the                  |
|                      |               | ips   | [relationships]({{<  |
|                      |               |       | relref               |
|                      |               |       | “blueprints/spec-rel |
|                      |               |       | ationships.md”       |
|                      |               |       | >}}) that this node  |
|                      |               |       | template has with    |
|                      |               |       | other node           |
|                      |               |       | templates.           |
+----------------------+---------------+-------+----------------------+
| capabilities         | no            | dict  | Used for specifying  |
|                      |               |       | the node template    |
|                      |               |       | capabilities         |
|                      |               |       | (Supported since:    |
|                      |               |       | [cloudify_dsl_1_3]({ |
|                      |               |       | {<                   |
|                      |               |       | relref               |
|                      |               |       | “blueprints/spec-ver |
|                      |               |       | sioning.md”          |
|                      |               |       | >}}).) Only the      |
|                      |               |       | scalable capability  |
|                      |               |       | is supported.        |
+----------------------+---------------+-------+----------------------+

Example
=======

.. code:: yaml

        node_types:
          # The following node type is used in the node templates section
          nodes.Nginx:
            derived_from: cloudify.nodes.WebServer
            properties:
              port:
                description: The default listening port for the Nginx server.
                type: integer
            interfaces:
              cloudify.interfaces.lifecycle:
                create:
                  implementation: scripts/install-nginx.sh
                  inputs:
                    process:
                      default:
                        env:
                          port: 80
                start: scripts/start-nginx.sh
        
        node_templates:
          vm:
            type: cloudify.nodes.Compute
            instances:
              deploy: 2
            properties:
              ip: 192.168.0.11
        
          nginx:
            # This node template is specified as being of the node type that was defined in the node types section
            type: nodes.Nginx
            # properties must match the nodes.Nginx type properties schema
            properties:
              port: 80
            interfaces:
              cloudify.interfaces.lifecycle:
                create:
                  # inputs must match the inputs schema defined in nodes.Nginx for the create operation
                  inputs:
                    process:
                      env:
                        port: { get_property: [SELF, port] }
            relationships:
              - type: cloudify.relationships.contained_in
                target: vm

capabilities.scalable Configuration
===================================

The ``capabilities.scalable.properties`` key is used for configuring the
deployment characteristics of the node template.

capabilities.scalable.properties Schema
---------------------------------------

+--------------------+--------------+------+----+--------------------+
| Keyname            | Required     | Type | De | Description        |
|                    |              |      | fa |                    |
|                    |              |      | ul |                    |
|                    |              |      | t  |                    |
+====================+==============+======+====+====================+
| default_instances  | no           | inte | 1  | The number of      |
|                    |              | ger  |    | node-instances     |
|                    |              |      |    | this node template |
|                    |              |      |    | has.               |
+--------------------+--------------+------+----+--------------------+
| min_instances      | no           | inte | 0  | The minimum number |
|                    |              | ger  |    | of permitted node  |
|                    |              |      |    | instances. (Not    |
|                    |              |      |    | enforced by        |
|                    |              |      |    | ``scale``          |
|                    |              |      |    | workflow)          |
+--------------------+--------------+------+----+--------------------+
| max_instances      | no           | inte | UN | The maximum number |
|                    |              | ger  | BO | of permitted node  |
|                    |              |      | UN | instances. (Not    |
|                    |              |      | DE | enforced by        |
|                    |              |      | D  | ``scale``          |
|                    |              |      |    | workflow)          |
+--------------------+--------------+------+----+--------------------+

.. note::
    :class: summary

    ``UNBOUNDED`` may be used literally as the    value for ``max_instances``. Internally, it is stored as ``-1``, which

.. _example-1:

Example:
--------

.. code:: yaml

        node_templates:
          vm:
            type: cloudify.openstack.nodes.Compute
            capabilities:
              scalable:
                properties:
                  default_instances: 5

In the above example, the ``vm`` node has 5 instances when deployed.

Additional information about number of instances combined with
relationships can be found in the [relationships]({{< relref
“blueprints/spec-relationships.md” >}}) specification.
