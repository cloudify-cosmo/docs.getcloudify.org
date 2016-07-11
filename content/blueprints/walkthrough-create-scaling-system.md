---
layout: bt_wiki
title: Walkthrough - Create a scaling Blueprint
category: Blueprints
draft: false
weight: 1300

---

We will now build, from scratch, a simple system which is capable of scaling on AWS. 
Our system will consist of a number of instances under a single load balancer.

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

The pattern we will be using is multiple instances connected to a single load balancer.
For this we will be using the Amazon Elastic Load Balancer, or ELB in short.
So lets add it to our blueprint.

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

imports:
    - http://www.getcloudify.org/spec/cloudify/3.5m1/types.yaml
    - https://raw.githubusercontent.com/cloudify-cosmo/cloudify-aws-plugin/master/plugin.yaml

node_templates:
  LoadBalancer:
    type: cloudify.aws.nodes.ElasticLoadBalancer
    properties:
      elb_name: { get_input: elb_name }
      zones: { get_input: zones }
      aws_config: { get_input: aws_config }
      listeners: { get_input: listeners }
      health_checks: { get_input: health_checks }
      scheme: { get_input: scheme }
      subnets: { get_input: subnets }
      complex_listeners: { get_input: complex_listeners }

{{< /gsHighlight >}}

All the properties listed are mandatory in order to create a load balancer on AWS.

Lets explains what some of those inputs mean:

elb_name: The name of our load balancer. Lets name that after our application.

zones: which availability zones are we active on ?

listeners: what ports are we listening to ?

aws_config: AWS configuration

All those inputs need to be declared beforehand so lets add those:

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

imports:
    - http://www.getcloudify.org/spec/cloudify/3.5m1/types.yaml
    - https://raw.githubusercontent.com/cloudify-cosmo/cloudify-aws-plugin/master/plugin.yaml

inputs:
  elb_name:
    type: string

  health_checks:
    default: {}

  zones:
    type: string

  listeners:
    type: string

  scheme:
    type: string
    default: ''

  subnets:
     default: []

  complex_listeners:
     default: []

  aws_config:
    default: {}

node_templates:
  LoadBalancer:
    type: cloudify.aws.nodes.ElasticLoadBalancer
    properties:
      elb_name: { get_input: elb_name }
      zones: { get_input: zones }
      aws_config: { get_input: aws_config }
      listeners: { get_input: listeners }
      health_checks: { get_input: health_checks }
      scheme: { get_input: scheme }
      subnets: { get_input: subnets }
      complex_listeners: { get_input: complex_listeners }

{{< /gsHighlight >}}

Now lets add an instance in our load balancer:

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

imports:
    - http://www.getcloudify.org/spec/cloudify/3.5m1/types.yaml
    - https://raw.githubusercontent.com/cloudify-cosmo/cloudify-aws-plugin/master/plugin.yaml

inputs:
  elb_name:
    type: string

  health_checks:
    default: {}

  zones:
    type: string

  listeners:
    type: string

  scheme:
    type: string
    default: ''

  subnets:
     default: []

  complex_listeners:
     default: []

  aws_config:
    default: {}

node_templates:
  LoadBalancer:
    type: cloudify.aws.nodes.ElasticLoadBalancer
    properties:
      elb_name: { get_input: elb_name }
      zones: { get_input: zones }
      aws_config: { get_input: aws_config }
      listeners: { get_input: listeners }
      health_checks: { get_input: health_checks }
      scheme: { get_input: scheme }
      subnets: { get_input: subnets }
      complex_listeners: { get_input: complex_listeners }

  Instance:
    type: cloudify.aws.nodes.Instance
    properties:
      install_agent: false
      resource_id: { get_input: resource_id_vm }
      use_external_resource: { get_input: external_vm }
      image_id: { get_input: image }
      instance_type: { get_input: size }
      aws_config: { get_input: aws_config }
      parameters:
        placement: { get_property: [pair_c_connected_volume, zone] }
    relationships:
      - type: cloudify.aws.relationships.instance_connected_to_load_balancer
        target: LoadBalancer

{{< /gsHighlight >}}

Like before, we need to add inputs:

{{< gsHighlight  yaml >}}
tosca_definitions_version: cloudify_dsl_1_3

imports:
    - http://www.getcloudify.org/spec/cloudify/3.5m1/types.yaml
    - https://raw.githubusercontent.com/cloudify-cosmo/cloudify-aws-plugin/master/plugin.yaml

inputs:
  elb_name:
    type: string

  health_checks:
    default: {}

  zones:
    type: string

  listeners:
    type: string

  scheme:
    type: string
    default: ''

  subnets:
     default: []

  complex_listeners:
     default: []

  aws_config:
    default: {}

node_templates:
  LoadBalancer:
    type: cloudify.aws.nodes.ElasticLoadBalancer
    properties:
      elb_name: { get_input: elb_name }
      zones: { get_input: zones }
      aws_config: { get_input: aws_config }
      listeners: { get_input: listeners }
      health_checks: { get_input: health_checks }
      scheme: { get_input: scheme }
      subnets: { get_input: subnets }
      complex_listeners: { get_input: complex_listeners }

  Instance:
    type: cloudify.aws.nodes.Instance
    properties:
      install_agent: false
      resource_id: { get_input: resource_id_vm }
      use_external_resource: { get_input: external_vm }
      image_id: { get_input: image }
      instance_type: { get_input: size }
      aws_config: { get_input: aws_config }
      parameters:
        placement: { get_property: [pair_c_connected_volume, zone] }
    relationships:
      - type: cloudify.aws.relationships.instance_connected_to_load_balancer
        target: LoadBalancer

{{< /gsHighlight >}}
