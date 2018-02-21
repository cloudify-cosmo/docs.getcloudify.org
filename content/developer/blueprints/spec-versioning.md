---
layout: bt_wiki
title: Versioning
category: Blueprints
draft: false
weight: 100

---

`tosca_definitions_version` is a top level property of the blueprint which is used to specify the DSL version used.
For Cloudify, the versions that are currently defined are `cloudify_dsl_1_0`, `cloudify_dsl_1_1`, `cloudify_dsl_1_2` and `cloudify_dsl_1_3`.

The version declaration must be included in the main blueprint file. It may also be included in YAML files that are imported in it (transitively), in which case, the version specified in the imported YAMLs must match the version specified in the main blueprint file.

In future Cloudify versions, as the DSL specification evolves, this mechanism will enable providing backward compatibility for blueprints written in older versions.
<br>

# Example
{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

node_templates:
    ...
{{< /gsHighlight >}}
