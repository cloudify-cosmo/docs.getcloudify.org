---
layout: bt_wiki
title: Workflow Execution Statuses
category: Workflows
draft: false
abstract: Possible Status of Workflow Executions
weight: 500


types_yaml_link: reference-types.html

default_workflows_source_link: https://github.com/cloudify-cosmo/cloudify-plugins-common/blob/4.3/cloudify/plugins/workflows.py
---



The workflow execution status is stored in the `status` field of the Execution object. These are the execution statuses which currently exist:

* **`pending`** - The execution is waiting for a worker to start it.
* **`started`** - The execution is currently running.
* **`cancelling`** - The execution is currently being cancelled.
* **`force_cancelling`** - The execution is currently being force-cancelled (see more information under [Cancelling workflows executions]({{< relref "working_with/workflows/cancelling-execution.md" >}})).
* **`cancelled`** - The execution has been cancelled.
* **`terminated`** - The execution has terminated successfully.
* **`failed`** - The execution has failed. An execution with this status should have an error message available under the execution object's `error` field.
