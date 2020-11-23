---
title: Managing Deployment Workflows
description:
weight: 80
alwaysopen: false
aliases: /workflows/overview/
---

Workflows are automation process algorithms. They describe the flow of the automation by determining which tasks will be executed and when. A task may be an operation (implemented by a plugin), or other actions including running arbitrary code. Workflows are written in Python, using a dedicated framework and APIs.

Workflows are deployment-specific. Each deployment has its own set of workflows, which are declared in the Blueprint. Executions of a workflow are in the context of that deployment.

Controlling workflows (i.e. executing, cancelling, etc.) is achieved using REST calls to the management server. In this guide, the examples use {{< param cfy_cli_name >}} commands, which in turn call the REST API calls.

# Executing Workflows

Workflows can be executed directly. You can execute workflows from the CLI as follows:<br>
`cfy executions start my_workflow -d my_deployment`

This executes the `my_workflow` workflow on the `my_deployment` deployment.

Workflows run on deployment-dedicated workers on the management server, on top of the {{< param product_name >}} workflow engine.

When a workflow is executed, an execution object is created for the deployment, containing both static and dynamic information about the workflow's execution run. The `status` field in the Execution object is an important dynamic field that conveys the current state of the execution.

An execution is considered to be a *running execution* until it reaches one of the three final statuses: `terminated`, `failed` or `cancelled`. For more information, see the [Workflow Execution Statuses]({{< relref "working_with/workflows/statuses.md" >}}) section on this page.

{{% note title="Note" %}}
It is recommended that you have only one *running execution* per deployment at any time. By default, an attempt to execute a workflow while another execution is running for the same deployment triggers an error. To override this behavior and enable multiple executions to run in parallel, use the `force` flag for each execute command. To view the syntax reference, see the [CLI Commands Reference]({{< relref "cli/_index.md" >}}).
{{% /note %}}

# Queing Executions
In general, executions run in parallel. There are a few exceptions:

* When a system-wide execution is running (e.g. `snapshots create`), no other execution will be allowed to start.
* Two executions under the same deployment cannot run parallely.
* System-wide executions (e.g. `snapshots create`) cannot start while an execution (e.g. `install` workflow) is running.


If you start an execution and receive one of the following errors: "You cannot start an execution if there is a running system-wide execution" / "The following executions are currently running for this deployment..." / "You cannot start a system-wide execution if there are other executions running.", you can add the execution to the executions queue:

* `cfy executions start -d deployment1 install --queue`
* `cfy snapshots create --queue`

Queued executions will begin automatically when possible.

{{% note title="Note" %}}
* If an execution can start immediately it will, even when the `queue` flag is passed.
* If the queue contains a system-wide execution waiting to start (e.g. snapshot create), {{< param product_name >}} will not accept any
 other execution request unless the `queue` flag is passed. This behavior ensures there is no starvation of blocking system operations. If the `queue` flag isn't provided, an error will be returned.
{{% /note %}}

# Queing Executions

# Writing a Custom Workflow

If you are an advanced user, you might want to create custom workflows. For more information, see [Creating Custom Workflows]({{< relref "working_with/workflows/creating-your-own-workflow.md" >}}).
