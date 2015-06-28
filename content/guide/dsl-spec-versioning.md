---


layout: bt_wiki
title: Versioning
category: Blueprints DSL
publish: true
abstract: "Cloudify DSL Versioning"
pageord: 300

---


{{% gsSummary %}}

`tosca_definitions_version` is a top level property of the blueprint which is used to specify the DSL version used.
For Cloudify 3.2, the versions that are currently defined are `cloudify_dsl_1_0` and `cloudify_dsl_1_1`.



The version declaration must be included in the [main blueprint file](reference-terminology.html#main-blueprint-file). It may also be included in YAML files that are imported in it (transitively), in which case, the version specified in the imported YAMLs must match the version specified in the main blueprint file.

In future Cloudify versions, as the DSL specification evolves, this mechanism will enable providing backward compatibility for blueprints written in older versions.

<br>

Example:
{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_1

node_templates:
    ...
{{< /gsHighlight >}}
