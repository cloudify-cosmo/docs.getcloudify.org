---
layout: bt_wiki
title: Versioning
category: Blueprints
draft: false
weight: 100

---

`tosca_definitions_version` is a top level property of the blueprint which is used to specify the DSL version used.
For Cloudify, the versions that are currently defined are `cloudify_dsl_1_0`, `cloudify_dsl_1_1`, `cloudify_dsl_1_2` and `cloudify_dsl_1_3`.

<br>

# Example
{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

node_templates:
    ...
{{< /gsHighlight >}}

The version declaration must be included in the main blueprint file.
