---
title: Labels
category: Blueprints
draft: false
weight: 600
aliases: /blueprints/spec-labels/
---

`labels` are used to tag the deployment object generated from the blueprint 
(unlike `blueprint_labels` which tag the blueprint object itself). The labels' keys are saved in lowercase.


# Declaration

{{< highlight  yaml >}}
labels:
  key1:
    ...
  key2:
    ...
{{< /highlight >}}

# Schema

Keyname     | Required | Type | Description
----------- | -------- | ---- | -----------
values      | yes      | list | A list of values for the specified key. Each value can be either a string or an [intrinsic-function]({{< relref "developer/blueprints/spec-intrinsic-functions.md" >}}), but not `get_attribute`.  

<br>

# Example

{{< highlight  yaml >}}

tosca_definitions_version: cloudify_dsl_1_4

imports:
  - cloudify/types/types.yaml

inputs:
  environment: 
    default: aws

labels:
  env: 
    values: 
      - { get_input: environment }
  arch:
    values:
      - k8s
      - docker

{{< /highlight >}}

# Reading Labels
Please refer to the [deployments labels page]({{< relref "cli/orch_cli/deployments.md#labels" >}}).
