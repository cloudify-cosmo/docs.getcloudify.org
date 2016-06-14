---
layout: bt_wiki
title: Scaling
category: Blueprints
draft: false
weight: 1600

---

This page describes different concepts involved in scaling components of your application blueprint.

## Overview
When we refer to scaling, we are actually referring to the number of node instances each node template will have on deployment, and changes made
to that number during runtime after the deployment is created, using the `scale` workflow.

There are two ways of specifying this configuration in the application blueprint. We will show both and what will follow is an explanation of
the difference between these two methods, after which we will show how the number of instances for different nodes may be changed during runtime.

## Node Templates `scalable` Configuration
One way to specify the initial number of instances a node template will have, is to configure the node template `capabilities.scalable` properties.

For example, to configure some vm node template so that it will be deployed with 5 initial instances, the following configuration may be used:

{{< gsHighlight yaml >}}
node_templates:
  example_vm:
    type: cloudify.nodes.Compute
    capabilities:
      scalable:
        properties:
          default_instances: 5
{{< /gsHighlight >}}

See [Node Templates]({{< relref "blueprints/spec-node-templates.md" >}}#capabilities-scalable-configuration) for more details.

## Scaling Policy and Scaling Groups Configuration
The second way to specify the initial number of instances a node template will have is to use scaling policies and groups.

To configure a scaling group for a vm and an ip, the following configuration may be used:

{{< gsHighlight yaml >}}
node_templates:
  vm:
    type: cloudify.nodes.Compute
  ip:
    type: cloudify.nodes.VirtualIP

groups:
  vm_and_ip:
    members: [vm, ip]

policies:
  scale_policy1:
    type: cloudify.policies.scaling
    properties:
      default_instances: 5
    targets: [vm_and_ip]
{{< /gsHighlight >}}

When deployed, 5 `vm` node instances and 5 `ip` node instances will be created.

See [Policies]({{< relref "blueprints/spec-policies.md" >}}) for more details.

{{% gsNote title="Note" %}}
Scaling groups may be nested. (i.e. a scaling group may have a different scaling group as one if its members).
{{% /gsNote %}}

{{% gsNote title="Note" %}}
Using the [`get_attribute` intrinsic function]({{< relref "blueprints/spec-intrinsic-functions.md" >}}#get-attribute) in the blueprint
with explicit reference to a node by its name (i.e. not `SELF`, `SOURCE` or `TARGET`) between members of the same scaling group may be used in places where
otherwise, an ambiguity would arise. See [`get_attribute` intrinsic function]({{< relref "blueprints/spec-intrinsic-functions.md" >}}#get-attribute-between-members-of-shared-scaling-groups) for
more details.
{{% /gsNote %}}

## `connected_to/depends_on` Relationship Semantics
The previous example showed how to use scaling groups in order to scale a group of node templates together.

In this section, we will discuss how `connected_to/depends_on` relationships behave between node instances that belong to the same scaling
group instance.

Generally, when two node templates are related via a `connected_to/depends_on` relationship, relationship instances will exist between *all* node instances of the source node to *all* node instances of the target node. This is further elaborted [here]({{< relref "blueprints/spec-relationships.md" >}}#multi-instance-cloudify-relationships-connected-to-semantics) under the `all_to_all` example.

Similar logic applies between node templates that belong to the same scaling group. The exception here, is that the relationship instances between the node instances will not "escape" scaling group boundaries. This is best explained with an example.

Consider the following:

{{< gsHighlight yaml >}}
node_templates:
  application:
    type: web_app
    capabilities:
      scalable:
        properties:
          default_instances: 2
    relationships:
      - type: cloudify.relationships.connected_to
        target: database
  database:
    type: database
    capabilities:
      scalable:
        properties:
          default_instances: 2

groups:
  application_and_database:
    members: [application, database]

policies:
  scale_policy2:
    type: cloudify.policies.scaling
    properties:
      default_instances: 2
    targets: [application_and_database]
{{< /gsHighlight >}}

The previous blueprint snippet, when deployed, will have 2 instances of the `application_and_database` scaling group. Each scaling group will contain 2 node instances of the `application` node and 2 node instances of the `database` node.

The following diagram aims to explain how will the different node instances be connected. Specifically, it aims to show how `connected_to` relationships don't "escape" scaling group boundaries:
<br/>

![scaling_groups_diagram]({{< img "guide/scaling-groups.png" >}})

<br/>

The next diagram builds upon the blueprint shown previously in this page where we had 5 `vm_and_ip` scaling group instances with a `vm` and `ip` node instances in each scaling group instance.
If the `vm` node were to have a `connected_to` relationship to the `ip` node, this is how the relationships would behave:

<br/>

![scaling_groups_diagram2]({{< img "guide/scaling-groups2.png" >}})

<br/>

{{% gsNote title="Note" %}}
`all_to_one` semantics are not supported between node instances of the same scaling group.
{{% /gsNote %}}

## Scale Workflow
To change the number of node instances during runtime (i.e. after the deployment is installed), use the `scale` workflow.

See [Scale Workflow]({{< relref "workflows/built-in-workflows.md" >}}#the-scale-workflow) for more details.

