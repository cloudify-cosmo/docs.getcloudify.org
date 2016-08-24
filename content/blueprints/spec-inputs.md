---

title: Inputs


weight: 300

---

`inputs` are parameters injected into the blueprint upon deployment creation. These parameters can be referenced by using the [get_input]({{ relRef("blueprints/spec-intrinsic-functions.md#get_input") }}) intrinsic function.

Inputs are useful when there's a need to inject parameters to the blueprint which were unknown when the blueprint was created and can be used for distinction between different deployments of the same blueprint.

{% call c.note("Note") %}
Beginning with [definitions version]({{ relRef("blueprints/spec-versioning.md") }}) `cloudify_dsl_1_3`, you can also import `inputs` multiple times.

Also note that you can pass mutliple `-i`  flags in our cli to pass multiple input structures or pass wildcard based paths to input files (e.g. `... -i *.yaml`) and directories containing input files (e.g. `... -i my_inputs_file_dir/`)
{% endcall %}

# Declaration

```yaml
inputs:

  input1:
    ...
  input2:
    ...
```


# Schema

Keyname     | Required | Type        | Description
----------- | -------- | ----        | -----------
description | no       | string      | An optional description for the input.
type        | no       | string      | Represents the required data type of the input. Not specifying a data type means the type can be anything. Valid types: string, integer, boolean
default     | no       | \<any\>     | An optional default value for the input.


<br>


# Example

```yaml

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

```

`get_input` is a special function which allows the user to use inputs throughout the blueprint. For more information see [intrinsic_functions]({{ relRef("blueprints/spec-intrinsic-functions.md#get-input") }}).