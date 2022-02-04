---
layout: bt_wiki
title: Maintenance Mode
category: Manager
draft: false
weight: 900
aliases: /manager/maintenance-mode/
---

When in maintenance mode, {{< param cfy_manager_name >}} activity is suspended. It rejects all requests, and does not perform any action other than to display the status of the Manager and it's version, and to execute sub-commands of the maintenance mode.

{{< param cfy_manager_name >}} has three maintenance states, activated, activating, and deactivated. To view the current maintenance state of the Manager, run `cfy maintenance-mode status`. The state is also displayed when you run `cfy status` (so long as the state is not `deactivated`).

* **Activated**   
   {{< param cfy_manager_name >}} is in maintenance mode. It ignores all requests except for `cfy status`, `cfy --version` and sub-commands of `cfy maintenance-mode`.
* **Activating**   
   An intermediate state in which the {{< param cfy_manager_name >}} is not fully in maintenance mode. Only requests that trigger executions are blocked. This state enables active executions to complete and prevents new executions from being started.
* **Deactivated**   
   {{< param cfy_manager_name >}} operates normally. No requests are blocked.

## Usage and Flow
By default, the maintenance mode state is `deactivated`.

To activate maintenance mode, run `cfy maintenance-mode activate`. {{< param cfy_manager_name >}} either enters the `activated` or `activating` state.

To view the current status of the maintenance mode, run `cfy maintenance-mode status`.

Following the activation request, if there are no active executions (running, pending, cancelling etc.), maintenance mode is activated.<br>
The output of `cfy maintenance-mode status` for the `activated` state is as follows.

{{< highlight  bash  >}}
Maintenance Mode Status:
	Status:	activated
	Activated At: <time of activation>
	Activation Requested At: <time of activation request>
{{< /highlight >}}

If there are active executions, the Manager enters the `activating` state.

{{< highlight  bash  >}}
Maintenance Mode Status:
	Status:	activating
	Activation Requested At: <time of activation request>

{{< param cfy_manager_name >}} currently has <number of active executions> running or pending executions. Waiting for them to finish before activating.
{{< /highlight >}}

After all executions have completed, the Manager enters the 'activated' state.

{{% tip title="Execution Details" %}}
If you run the maintenance mode status command in verbose mode, you can view detailed information about the current active executions.
{{% /tip %}}

Run `cfy maintenance-mode deactivate` to deactivate maintenance mode.
