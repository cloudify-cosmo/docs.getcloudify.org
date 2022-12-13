---
title: Workflow Error Handling
category: Workflows
draft: false
abstract: Handling Errors of executed Workflows
weight: 400
aliases: /workflows/error-handling/
---



# Task Retries

When an error is raised from the workflow itself, the workflow execution will fail - it will end with `failed` status, and should have an error message under its `error` field. There is no built-in retry mechanism for the entire workflow.

However, there's a retry mechanism for task execution within a workflow.
Two types of errors can occur during task execution: *Recoverable* and *NonRecoverable*. **By default, all errors originating from tasks are *Recoverable***. The maximum number of retries for workflow operations is 60, with retries occuring at 15 second intervals for a maximum of 15 minutes.

If a *NonRecoverable* error occurs, the workflow execution will fail, similarly to the way described for when an error is raised from the workflow itself.

If a *Recoverable* error occurs, the task execution might be attempted again from its start. This depends on the configuration of the `task_retries` and `max_retries` parameters, which determines how many retry attempts will be given by default to any failed task execution.

The `task_retries` and `max_retries` parameters can be set in one of the following manners:

* If the operation [`max_retries` parameter]({{< relref "developer/blueprints/spec-interfaces.md#definition" >}}) has been set for a certain operation, it will be used.

* When [installing the manager]({{< relref "cloudify_manager/premium/aio/install_and_configure/centos_rhel.md" >}}), the `task_retries` parameter is a configuration parameter in the `mgmtworker.workflows` section of the config.yaml file.

* `task_retries`, `task_retry_interval` and `subgraph_retries` can also all be set using the CLI (`cfy config`).

If the parameter is not set, it will default to the value of `-1`, which means maximum retries (i.e. 60).

In addition to the `task_retries` parameter, there's also the `task_retry_interval` parameter, which determines the minimum amount of wait time (in seconds) after a task execution fails before it is retried. It can be set in the very same way `task_retries` and `max_retries` are set. If it isn't set, it will default to the value of `15`.

# Lifecycle Retries (Experimental)

In addition to [task retries](#task-retries), there is a mechanism that allows retrying a group of operations. This mechanism is used by the [built-in]({{< relref "working_with/workflows/built-in-workflows.md" >}}) `install`, `scale` and `heal` workflows. By default it is turned off. To enable it, set the `subgraph_retries` parameter in the `mgmtworker.workflows` section of the config.yaml file to a positive value (or `-1` for *infinite subgraph retries*). The parameter is named `subgraph_retries` because the mechanism is implemented using the subgraphs feature of the workflow framework.

The following example demonstrates how this feature is used by the aforementioned built-in workflows.

Consider the case where some `cloudify.nodes.Compute` node template is used in a blueprint to create a VM. The sequence of operations used to create, configure and start the VM will most likely be mapped using the node type's `cloudify.interfaces.lifecycle` interface, `create`, `configure` and `start` operations, respectively; mapping the operations to some IaaS plugin implementation.

The `create` operation may be implemented in such way, that it makes an API call to the relevant IaaS to create the VM. The `start` operation may be implemented in such way, that it waits for the the VM to be in some started state and have a private IP assigned to it. In such implementation, it is possible that the API call to create the VM was successful but the VM itself started in some malformed manner (e.g. no IP was assigned to it).

The task retries mechanism alone, may not be sufficient to fix this problem, as simply retrying the `start` operation will not change the VM's corrupted state. A possible solution in this case, is to run the `stop` and `delete` operations of the `cloudify.interfaces.lifecycle` interface and then re-run the `create`, `configure` and `start` again in hope that the new VM will be created in a valid state.

This is exactly what the lifecycle retry mechanism does. Once the number of attempts to execute a lifecycle operation (`start` in the example above) exceeds `1 + task_retries`, the lifecycle retry mechanism kicks in. If `subgraph_retries` is set to a positive number (or `-1` for infinity), a lifecycle retry is performed, which in essence means: run ["uninstall"]({{< relref "working_with/workflows/built-in-workflows.md#the-uninstall-workflow" >}}) on the relevant node instance and then run ["install"]({{< relref "working_with/workflows/built-in-workflows.md#the-install-workflows" >}}) on it.

Similarly to the `task_retries` parameters, the `subgraph_retries` parameter affects the number of lifecycle retries attempted before failing the entire workflow.

{{% note title="Note" %}}
The lifecycle retry API is marked as experimental. This is mostly because there is no differentiation between *NonRecoverable* errors that are raise due to some bad configuration, i.e. there is no point of retrying the node lifecycle, to *NonRecoverable* errors that are raise due to some corrupted state that may be fixed by the lifecycle retry mechanism. In both cases, a lifecycle retry will be attempted.

Due to that, its semantics may change in the future, once an API to make that differentiation is introduced.
{{% /note %}}
