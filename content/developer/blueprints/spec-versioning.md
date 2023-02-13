---
title: Versioning
category: Blueprints
draft: false
weight: 100
aliases: /blueprints/spec-versioning/
---

`tosca_definitions_version` is a top level property of the blueprint which is used to specify the DSL version used.

The currently defined versions are 

* `cloudify_dsl_1_3`
* `cloudify_dsl_1_4`

<br>

| Cloudify Manager Version | DSL 1.3 | DSL 1.4 |
|--------------------------|---------|---------|
| 5.1 and higher           | V       | V       |
| 6.4 and higher           |         | V       |

# Example
{{< highlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_4

node_templates:
    ...
{{< /highlight >}}

The version declaration must be included in the main blueprint file.
