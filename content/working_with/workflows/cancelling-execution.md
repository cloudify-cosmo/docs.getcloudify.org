---
layout: bt_wiki
title: Cancelling Workflow Executions
category: Workflows
draft: false
abstract: How to cancel an Execution of a running Workflow
weight: 300
aliases: /workflows/cancelling-execution/

types_yaml_link: reference-types.html

default_workflows_source_link: https://github.com/cloudify-cosmo/cloudify-common/blob/5.0.0/cloudify/plugins/workflows.py
---


It is possible to cancel an execution whose [status]({{< relref "working_with/workflows/statuses.md" >}}) is `pending`, `started` or `queued`.

There are three types of execution cancellations:

* Standard cancellation - This type means that a cancel request is posted for the execution. The execution's status will become `cancelling`. However, the actions to take upon such a request are up to the workflow that's being executed: It might try and stop, perform a full rollback, or even ignore the request completely and continue executing.

    Usually, this is the recommended way to cancel an execution, since while it doesn't make any guarantees, it allows for a workflow to cancel its execution gracefully - whether by performing a rollback, cleaning up resources, or any other actions that it may take before stopping.

* Force cancellation - This type also means a cancel request is posted for the execution (with the execution's status becoming `force_cancelling`), yet in this case it is not up to the workflow to act on this request - instead, the Cloudify workflow engine will simply terminate the process running the workflow immediately.

    This type of cancellation may be used over an execution which is already in `cancelling` status, and indeed, its main purpose is to be used for workflows which don't support Standard cancellation or when the Standard cancellation is stuck or is taking too long. It may also be used when it's needed to simply stop an execution immediately.

* Kill cancellation - This type means that the process executing the workflow is forcefully stopped, even if it is stuck or unresponsive. Also, processes running operations are stopped, as long as the agent running the operation is still connected to the Manager. The execution status changes to `kill_cancelling` and then `cancelled`.

    Only use kill cancellation when:

    * The execution engine is unresponsive and other cancellation methods have no effect
    * After the workflow itself has been cancelled using one of the other methods and there are some operations still running

    In these scenarios you can use kill cancellation on executions that are already in the `cancelled` state. It stops any operations of that execution that are left running and has no effect otherwise.
    The processes are stopped by sending the SIGTERM signal on Linux (or the TerminateProcess Win32 API on windows), and then SIGKILL about 5 seconds later (or the same TerminateProcess call on Windows).
{{% warning title="Warning" %}}
Using kill cancellation means that workflow and operation processes might not have any opportunity to clean up or release resources.
{{% /warning %}}


{{% warning title="Warning" %}}
When the execution's status changes to `cancelled`, it means the workflow execution has completed, meaning no new tasks will be started; However, tasks that have already been started might still be executing on agents. This is true for both Standard and Forced cancellations (but not for kill cancellations).
{{% /warning %}}

<br>
Cancelling an execution whose ID is `SOME_EXECUTION_ID` from the CLI can be done using the following command:

`cfy executions cancel SOME_EXECUTION_ID`

To use force or kill cancellation instead, simply add the `force` or `kill` flags. For a syntax reference, see the [CLI commands reference]({{< relref "cli/orch_cli/executions.md" >}}).

{{% note title="Note" %}}
When the CLI completes a cancel execution command, it does not mean the execution has finished cancelling, even if force cancellation was used. The execution will be in either a `cancelling`, `force_cancelling` or `kill_cancelling` status (depending on the cancellation type that was used) until the cancellation has finished, at which time its status will change to `cancelled`, and the execution will be over (with the Warning above still applying).
{{% /note %}}
