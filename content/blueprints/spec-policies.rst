Policies
%%%%%%%%

``policies`` enable you to configure reusable behavior by referencing
the [groups]({{< relref “blueprints/spec-groups.md” >}}) for which a
policy applies.

.. note::
    :class: summary

    Do not confuse the top-level ``policies``    section described here with policies that are defined in the top-level
%}}

.. note::
    :class: summary

    The only supported policy type is the
Declaration
===========

.. code:: yaml

        policies:
          my_scaling_policy:
            type: cloudify.policies.scaling
            properties:
              ...
            targets: ...

Schema
======

+----------------------+---------------+-------+----------------------+
| Keyname              | Required      | Type  | Description          |
+======================+===============+=======+======================+
| type                 | yes           | strin | The policy type.     |
|                      |               | g     |                      |
+----------------------+---------------+-------+----------------------+
| properties           | no            | dict  | The specific policy  |
|                      |               |       | properties. The      |
|                      |               |       | properties schema is |
|                      |               |       | defined by the       |
|                      |               |       | policy type.         |
+----------------------+---------------+-------+----------------------+
| targets              | yes           | list  | A list of group      |
|                      |               |       | names. The policy is |
|                      |               |       | applied on the       |
|                      |               |       | groups specified in  |
|                      |               |       | this list.           |
+----------------------+---------------+-------+----------------------+

``cloudify.policies.scaling`` Policy Schema
-------------------------------------------

+--------------------+--------------+------+----+--------------------+
| Keyname            | Required     | Type | De | Description        |
|                    |              |      | fa |                    |
|                    |              |      | ul |                    |
|                    |              |      | t  |                    |
+====================+==============+======+====+====================+
| default_instances  | no           | inte | 1  | The number of      |
|                    |              | ger  |    | instances the      |
|                    |              |      |    | groups referenced  |
|                    |              |      |    | by this policy     |
|                    |              |      |    | will have.         |
+--------------------+--------------+------+----+--------------------+
| min_instances      | no           | inte | 0  | The minimum number |
|                    |              | ger  |    | of permitted group |
|                    |              |      |    | instances. (Not    |
|                    |              |      |    | enforced by the    |
|                    |              |      |    | ``scale``          |
|                    |              |      |    | workflow.)         |
+--------------------+--------------+------+----+--------------------+
| max_instances      | no           | inte | UN | The maximum number |
|                    |              | ger  | BO | of permitted group |
|                    |              |      | UN | instances. (Not    |
|                    |              |      | DE | enforced by the    |
|                    |              |      | D  | ``scale``          |
|                    |              |      |    | workflow.)         |
+--------------------+--------------+------+----+--------------------+

.. note::
    :class: summary

    ``UNBOUNDED`` may be used literally as the    value for ``max_instances``. Internally, it is stored as ``-1``, which

Example
=======

.. code:: yaml

        node_templates:
          vm: ...
          ip: ...
        
        groups:
          vm_and_ip:
            members: [vm, ip]
        
        policies:
          scaling_policy1:
            type: cloudify.policies.scaling
            properties:
              default_instances: 2
            targets: [vm_and_ip]
