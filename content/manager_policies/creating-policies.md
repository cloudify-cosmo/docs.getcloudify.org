---
layout: bt_wiki
title: Creating Policies
category: Policies
draft: false
abstract: "A guide to authoring Cloudify policy types"
weight: 1000
---

{{% gsSummary %}}{{% /gsSummary %}}


{{% gsNote title="Note" %}}
This section is aimed at advanced users. At the very least make sure you understand the [policies mechanism](policies-general.html) in general.
{{% /gsNote %}}


# Policy Types Blueprint Definition
Policy types are specified in the blueprint along with a reference to their implementation and properties that configure instances of them.

An example (followed by an explanation):
{{< gsHighlight  yaml  >}}
policy_types:
  my_policy_type:
    source: my_policy/my_policy_type.clj
    properties:
      prop1:
        description: >
          prop1 is probably the most important property
          of my_policy_type
      prop2:
        description: >
          prop2 is a little less important, so we have a default
          for it
        default: 15.0
{{< /gsHighlight >}}

Policy types are defined under the `policy_types` section of the blueprint.

* The `source` attribute of a policy type can be either a relative path to a policy implementation within the blueprint directory or a URL to a policy hosted somewhere.
* The `properties` attribute of a policy type defines the policy's properties schema. These properties are configured when instantiating policies within the `groups` section. In the following section we will describe how these properties can be used by a policy implementation.

    The following properties are built-in and common for all policies:

    * `policy_operates_on_group`:
        Should the policy maintain its state for the whole group of nodes instances
        or each node instance individually (default: `false`).
    * `is_node_started_before_workflow`:
        Before triggering a workflow, check if the node instance's state is started. This is a **very important check** - it prevents the `heal` workflow from getting executed after the built-in `uninstall` workflow takes place (default: `true`).
    * `interval_between_workflows`:
        Trigger workflow only if the last workflow had been triggered earlier than `interval-between-workflows` seconds ago.
        If the specified value is less than 0, workflows can run concurrently. (default: `300`)

# Policy Type Implementation
The implementation of policy types is written in [Clojure](http://clojure.org/) and more specifically using [Riemann's](http://riemann.io/) API with a thin layer provided by Cloudify.

An example: `my_policy/my_policy_type.clj`
{{< gsHighlight >}}
(where (metric {{prop2}})
  (with :state "{{prop1}}")
    process-policy-triggers)
{{< /gsHighlight >}}

First notice how `prop2` and `prop1` are being referenced in double curly braces. The implementation is actually a [`Jinja2`](http://jinja.pocoo.org/docs/dev/) template that is used to generate the actual implementation when the policy engine is started.

For each event whose metric value is equal to the value of `prop2`, the event's `state` field is set to the value of `prop1` and this event is delegated to the `process-policy-triggers` stream. In terms of Riemann, though, this is a very simple stream definition.

The `process-policy-triggers` stream executes all triggers specified for the instantiated policy in a deployment dedicated thread pool. Executing the triggers in a different thread pool is important, as the policies themselves should be non-blocking. If policies performed blocking operations, the entire deployment event stream would be blocked by each policy that performs them.

There is also a related function provided - `check-restraints-and-process`, which checks the list of restraints before it processes triggers. Right now there are two built-in restraints that can be turned off in the blueprint if needed (using policy properties `is_node_started_before_workflow` and `interval_between_workflows`). If they both return true, this function proceeds with `process-policy-triggers`.
