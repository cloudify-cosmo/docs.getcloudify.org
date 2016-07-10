---
layout: bt_wiki
title: Walkthrough - Create a scaling Blueprint
category: Blueprints
draft: false
weight: 1300

---

We will now build, from scratch, a simple scaling system on AWS. Our system will consist of a number of instances under a single load balancer.

We start out by importing the tosca definitions file and corresponding cloudify types definitions file.

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

imports:
    - http://www.getcloudify.org/spec/cloudify/3.5m1/types.yaml
{{< /gsHighlight >}}

Since we will be building on top of AWS, lets add the AWS plugin to our blueprint:

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

imports:
    - http://www.getcloudify.org/spec/cloudify/3.5m1/types.yaml
    - https://raw.githubusercontent.com/cloudify-cosmo/cloudify-aws-plugin/master/plugin.yaml


{{< /gsHighlight >}}

