---

title: Maintenance Mode


weight: 900

---

## Overview

While in maintenance mode, the Cloudify Manager remains unchanged; it rejects all requests, and doesn't perform any action (exceptions are detailed [here](#activated)).

## States of Maintenance

The Cloudify Manager has 3 maintenance states: activated, activating, and deactivated.
In order to see the current maintenance state of the Manager, run `cfy maintenance-mode status`. The state will also be shown when running `cfy status` (providing that it is not deactivated).

### Activated
The Cloudify Manager is in maintenance mode. It ignores all requests except for `cfy status`, `cfy --version` and sub-commands of `cfy maintenance-mode`.
### Activating
This is an intermediate state in which the Cloudify Manager is not fully in maintenance mode; only requests that trigger executions will be blocked.
This state allows active executions to complete and prevents new executions from being started.
### Deactivated
The Cloudify Manager operates normally. No requests are blocked.

## Usage and Flow
By default, the maintenance mode state is 'deactivated'.
In order to activate maintenance mode, run `cfy maintenance-mode activate`. The Cloudify Manager will either enter 'activated' state or 'activating' state.

In order to see the current status of the maintenance mode, run `cfy maintenance-mode status`.

After the activation request, if there are no active executions (running, pending, cancelling etc.), maintenance mode is activated.
This would be the output of `cfy maintenance-mode status`:
```bash
Maintenance Mode Status:
	Status:	activated
	Activated At: <time of activation>
	Activation Requested At: <time of activation request>
```
However, if there are active executions, the Manager will enter the 'activating' state:
```bash
Maintenance Mode Status:
	Status:	activating
	Activation Requested At: <time of activation request>

Cloudify Manager currently has <number of active executions> running or pending executions. Waiting for them to finish before activating.
```
Once all executions have completed, the Manager will enter the 'activated' state.

{% call c.tip("Executions details") %}
Running the maintenance mode status command in verbose mode would provide detailed information about the current active executions.
{% endcall %}

Run `cfy maintenance-mode deactivate` to deactivate maintenance mode.

### Using the Web UI
Managing the maintenance mode is enabled from the settings section in the Web UI.