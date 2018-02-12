---
layout: bt_wiki
title: Walkthrough - Create a scaling Blueprint
category: Blueprints
draft: true
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

  resource_id_vm:
    type: string
  
  external_vm:
    type: boolean

  image:
    type: string
    default: ''

  size:
    type: string
    default: ''
    
  zone:
    type: string


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
    relationships:
      - type: cloudify.aws.relationships.instance_connected_to_load_balancer
        target: LoadBalancer

{{< /gsHighlight >}}

Lets create an inputs file:

{{< gsHighlight  yaml >}}

size: "m3.medium"
elb_name: "loadbalancer_demo"
zone: eu-west-1a
image: 'ami-25158352'
external_vm: False
zones: eu-west-1a
listeners: "[[80, 8080, 'http'], [443, 8443, 'tcp']]"

{{< /gsHighlight >}}

Lets upload our blueprint and create a deployment for it:

`cfy install -g -p blueprint.yaml -i inputs.yaml`

Now we have a setup of a single load balancer and a single instance.
We can scale it up or down likeso:

`cfy executions start -d my_deployment -w scale`

You should now have 2 instances and one ELB.

But what if our system has more nodes?
For this we have a convenient object called "Groups".
We will move our instance into a Group:

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

  resource_id_vm:
    type: string
  
  external_vm:
    type: boolean

  image:
    type: string
    default: ''

  size:
    type: string
    default: ''
    
  zone:
    type: string


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
    relationships:
      - type: cloudify.aws.relationships.instance_connected_to_load_balancer
        target: LoadBalancer

groups:
  application:
    members: [Instance]

policies:
  scale_policy2:
    type: cloudify.policies.scaling
    properties:
      default_instances: 1
    targets: [Instance]

{{< /gsHighlight >}}

Now lets add another type of node. For simplicity sake, lets make a copy of Instance and add it to ther group:

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

  resource_id_vm:
    type: string
  
  external_vm:
    type: boolean

  image:
    type: string
    default: ''

  size:
    type: string
    default: ''
    
  zone:
    type: string


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
    relationships:
      - type: cloudify.aws.relationships.instance_connected_to_load_balancer
        target: LoadBalancer

  Instance2:
    type: cloudify.aws.nodes.Instance
    properties:
      install_agent: false
      resource_id: { get_input: resource_id_vm }
      use_external_resource: { get_input: external_vm }
      image_id: { get_input: image }
      instance_type: { get_input: size }
      aws_config: { get_input: aws_config }
    relationships:
      - type: cloudify.aws.relationships.instance_connected_to_load_balancer
        target: LoadBalancer

groups:
  application:
    members: [Instance,Instance2]

policies:
  scale_policy2:
    type: cloudify.policies.scaling
    properties:
      default_instances: 1
    targets: [Instance,Instance2]

{{< /gsHighlight >}}

This means the 2 instances with scale together.
