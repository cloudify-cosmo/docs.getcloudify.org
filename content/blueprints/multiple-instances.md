---

title: Multiple Instances (Scaling)


weight: 1600

---

This page describes different concepts involved in scaling components of your application blueprint.

## Overview
When we refer to multiple instances and scaling, we are actually referring to the number of node instances each node template will have on deployment,
and changes made to that number during runtime after the deployment is created, using the `scale` workflow.

There are two ways of specifying this configuration in the application blueprint. The first is aimed at configuring this number on a per node
template basis, using the `scalable` capability configuration. The second method is mostly aimed at configuring the number of instances on a group basis
where the group contains several node templates.
We will show both and what will follow is an explanation of the difference between these two methods,
after which we will show how the number of instances for different nodes may be changed during runtime.

## Node Templates `scalable` Configuration
To specify the initial number of instances a node template will have, the node template `capabilities.scalable` properties should be configured.

For example, to configure some vm node template so that it will be deployed with 5 initial instances, the following configuration may be used:

```yaml
node_templates:
  example_vm:
    type: cloudify.nodes.Compute
    capabilities:
      scalable:
        properties:
          default_instances: 5
```

See [Node Templates]({{ relRef("blueprints/spec-node-templates.md") }}#capabilities-scalable-configuration) for more details.

## Scaling Policy and Scaling Groups Configuration
To specify the initial number of instances a *group* of node templates will have as a single unit, use scaling policies and groups.

For example, to configure a scaling group for a vm and an ip, the following configuration may be used:

```yaml
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
```

When deployed, 5 `vm` node instances and 5 `ip` node instances will be created.

See [Policies]({{ relRef("blueprints/spec-policies.md") }}) for more details.

### Combining Node Template `scalable` With Scaling Groups

A node template may have have its `scalable` capability configured and in addition, may also be included in some scaling group. Consider the following
example:

```yaml
node_templates:
  vm:
    type: cloudify.nodes.Compute
    capabilities:
      scalable:
        properties:
          default_instances: 3

groups:
  vm_group:
    members: [vm]

policies:
  scale_policy1:
    type: cloudify.policies.scaling
    properties:
      default_instances: 5
    targets: [vm_group]
```

When deployed, 15 (`3 * 5`) `vm` node instances will be created.

{% call c.note("Note") %}
Scaling groups may be nested. (i.e. a scaling group may have a different scaling group as one if its members).
{% endcall %}

{% call c.note("Note") %}
Using the [`get_attribute` intrinsic function]({{ relRef("blueprints/spec-intrinsic-functions.md") }}#get-attribute) in the blueprint
with explicit reference to a node by its name (i.e. not `SELF`, `SOURCE` or `TARGET`) between members of the same scaling group may be used in places where
otherwise, an ambiguity would arise. See [`get_attribute` intrinsic function]({{ relRef("blueprints/spec-intrinsic-functions.md") }}#get-attribute-between-members-of-shared-scaling-groups) for
more details.
{% endcall %}

## `connected_to/depends_on` Relationship Semantics
A previous example showed how to use scaling groups in order to scale a group of node templates together.

In this section, we will discuss how `connected_to/depends_on` relationships behave between node instances that belong to the same scaling
group instance.

Generally, when two node templates are related via a `connected_to/depends_on` relationship, relationship instances will exist between *all* node instances of the source node to *all* node instances of the target node. This is further elaborted [here]({{ relRef("blueprints/spec-relationships.md") }}#multi-instance-cloudify-relationships-connected-to-semantics) under the `all_to_all` example.

Similar logic applies between node templates that belong to the same scaling group. The exception here, is that the relationship instances between the node instances will not "escape" scaling group boundaries. This is best explained with an example.

Consider the following:

```yaml
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
```

The previous blueprint snippet, when deployed, will have 2 instances of the `application_and_database` scaling group. Each scaling group will contain 2 node instances of the `application` node and 2 node instances of the `database` node.

The following diagram aims to explain how will the different node instances be connected. Specifically, it aims to show how `connected_to` relationships don't "escape" scaling group boundaries:
<br/>

![scaling_groups_diagram]({{ c.img("guide/scaling-groups.png" ) }})

<br/>

The next diagram builds upon the blueprint shown previously in this page where we had 5 `vm_and_ip` scaling group instances with a `vm` and `ip` node instances in each scaling group instance.
If the `vm` node were to have a `connected_to` relationship to the `ip` node, this is how the relationships would behave:

<br/>

![scaling_groups_diagram2]({{ c.img("guide/scaling-groups2.png" ) }})

<br/>

## `contained_in` Relationship Semantics

### Implicit Scaling Group Membership

If node `A` is `contained_in` node `B` and node `B` is part of some scaling group `S`, then node `A` is also implicitly included in `S`.

For example, in the following example where a `db` node template is `contained_in` a `vm` node template, both group definitions are
equivalent:

```yaml
node_templates:
  vm:
    type: cloudify.nodes.Compute
  db:
    type: cloudify.nodes.DBMS
    relationships:
      - target: vm
        type: cloudify.relationships.contained_in

groups:
  vm_group:
    members: [vm, db]

  # is equivalent to
  vm_group:
    members: [vm]

policies:
  scale_policy1:
    type: cloudify.policies.scaling
    targets: [vm_grop]
```

### Scaling groups and `contained_in` Semantics.
The semantics for `contained_in` relationships are described in detail [here]({{ relRef("blueprints/spec-relationships.md") }}#the-cloudify-relationships-contained-in-relationship-type).

Building upon the semantics described in the previous link, we now describe how scaling group fit in.

Consider the following:

```yaml
node_templates:
  vm:
    type: cloudify.nodes.Compute
    capabilities:
      scalable:
        properties:
          default_instances: 2
  app:
    type: web_app
    relationships:
      - type: cloudify.relationships.contained_in
        target: vm
  db:
    type: database
    relationships:
      - type: cloudify.relationships.contained_in
        target: vm

groups:
  app_and_db:
    members: [app, db]

policies:
  scale_policy2:
    type: cloudify.policies.scaling
    properties:
      default_instances: 2
    targets: [app_and_db]
```

Deploying the previous blueprint produces this topology:

<br/>

![scaling_groups_diagram3]({{ c.img("guide/scaling-groups3.png" ) }})

<br/>

It can be seen from the diagram that two `vm` node instances were deployed, as expected from the blueprint definition.
Each `vm` node instance has two `db` and two `app` node instances contained in it. Or, put differently, each `vm` node instance "contains" 2 instances of the `app_and_db` scaling group
as defined in the blueprint.

This shows that scaling groups can be "contained in" node templates when their members are `contained_in` some other node templates.

## Scale Workflow
To change the number of node instances during runtime (i.e. after the deployment is installed), use the `scale` workflow.

See [Scale Workflow]({{ relRef("manager/workflows/built-in-workflows/#the-scale-workflow") }}) for more details.
