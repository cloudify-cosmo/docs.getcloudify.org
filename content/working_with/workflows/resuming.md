---
layout: bt_wiki
title: Resuming workflow execution
category: Workflows
draft: false
abstract: What does it mean to resume a workflow
weight: 550

---
## Overview

Resuming workflows allows to continue execution after a failure, continuing from a cancelled execution, or after a Manager failure (eg. power loss).

When a workflow is resumed, the workflow function is executed again. Workflows which are resumable will then restore the state of the previous execution and continue from there. If the workflow was not explicitly declared as resumable, it will fail immediately instead.

### Workflows using tasks graphs

Most workflows (including all built-in ones) are implemented in terms of a tasks graph. When the workflow is being executed, the state of the tasks graph, and each operation in it, is persisted to storage. When the workflow is resumed, the tasks graph is reconstructed, and the execution continues.

### Resumable operations

If the workflow execution was interrupted while executing an operation (which is true in most cases), the operation which was running needs to be resumed as well. If the operation was an agent operation, the Manager will continue waiting for the result, and the workflow will continue.
If the operation was a Manager-side (management worker) operation, it will be restarted, provided the operation function is declared as resumable. Otherwise, the workflow will fail with an error describing the operation which could not have been retried.

### Resuming workflows after a Manager outage

If the Manager fails (due to power loss, a HA failover, or any other scenario leading to an ungraceful management worker shutdown) and is restarted, the management worker will automatically attempt to resume all workflows which have been running prior to the failure. If a workflow could not have been resumed, it will become failed instead.

### Resuming failed and cancelled workflows

It is also possible to resume a workflow which has failed, or has been cancelled. This is useful if a workflow has failed for a known reason which has been fixed afterwards, and it is desired to continue from where the execution left off.
Manually resuming a failed or cancelled execution from the CLI or the Web UI will reset the failed operations to the "pending" state and set their retry count back to 0, and those operations will be executed again. Those operations do not need to be declared resumable.
