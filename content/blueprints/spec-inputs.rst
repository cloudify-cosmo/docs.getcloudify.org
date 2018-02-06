Inputs
%%%%%%

``inputs`` are parameters that are injected into a blueprint when a
deployment is created. These parameters can be referenced by using the
[get_input]({{< relref
“blueprints/spec-intrinsic-functions.md#get_input” >}}) intrinsic
function.

Inputs are useful when there is a need to inject parameters in the
blueprint that were unknown when the blueprint was created, and they can
be used for distinction between different deployments of the same
blueprint.

.. note::
    :class: summary

    Beginning with [definitions version]({{<    relref “blueprints/spec-versioning.md” >}}) ``cloudify_dsl_1_3``, you
    can also import ``inputs`` multiple times.
    
    Also note that you can pass multiple ``-i`` flags in the CLI, to pass
    multiple input structures or to pass wildcard-based paths to input files
    (e.g. ``... -i *.yaml``) and directories containing input files (e.g.

Declaration
===========

.. code:: yaml

        inputs:
        
          input1:
            ...
          input2:
            ...

Schema
======

+----------------------+---------------+-------+----------------------+
| Keyname              | Required      | Type  | Description          |
+======================+===============+=======+======================+
| description          | no            | strin | An optional          |
|                      |               | g     | description for the  |
|                      |               |       | input.               |
+----------------------+---------------+-------+----------------------+
| type                 | no            | strin | The required data    |
|                      |               | g     | type of the input.   |
|                      |               |       | Not specifying a     |
|                      |               |       | data type means the  |
|                      |               |       | type can be          |
|                      |               |       | anything, including  |
|                      |               |       | a list, an array or  |
|                      |               |       | a dictionary. Valid  |
|                      |               |       | types: ``string``,   |
|                      |               |       | ``integer``,         |
|                      |               |       | ``boolean``.         |
+----------------------+---------------+-------+----------------------+
| default              | no            | <any> | An optional default  |
|                      |               |       | value for the input. |
+----------------------+---------------+-------+----------------------+

Example
=======

.. code:: yaml

        
        inputs:
        
          image_name:
            description: The image name of the server
            type: string
            default: "Ubuntu 12.04"
        
        node_templates:
        
          vm:
            type: cloudify.openstack.nodes.Server
            properties:
              server:
                image_name: { get_input: image_name }
        

``get_input`` is a special function which enables you to use inputs
throughout the blueprint. For more information see
[intrinsic_functions]({{< relref
“blueprints/spec-intrinsic-functions.md#get-input” >}}).
