---
layout: bt_wiki
title: Blueprint Labels
category: Blueprints
draft: false
weight: 600
aliases: /blueprints/spec-blueprint_labels/
---

`blueprint_labels` are used to tag the blueprint object (unlike `labels` which tag the deployment). 
`blueprint_labels` are used for automatically attaching labels to the blueprint. The labels' keys are saved in lowercase.  

# Declaration

{{< highlight  yaml >}}
blueprint_labels:
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

tosca_definitions_version: cloudify_dsl_1_3

imports:
  - http://www.getcloudify.org/spec/cloudify/5.3.0/types.yaml

inputs:
  environment: 
    default: aws

blueprint_labels:
  env: 
    values: 
      - { get_input: environment }
  arch:
    values:
      - k8s
      - docker

{{< /highlight >}}

# Reading Labels
Please refer to the [blueprints labels page]({{< relref "cli/orch_cli/blueprints.md#labels" >}}).
