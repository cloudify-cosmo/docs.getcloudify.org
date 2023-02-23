---
title: maintenance-mode
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/maintenance-mode/
---

The `cfy maintenance-mode` command is used to restrict REST access to the manager.

This is required, for instance, when you upgrade a manager.

Putting the manager in maintenance-mode prevents it from running any executions.

See [maintenance-mode]({{< relref "working_with/manager/maintenance-mode.md" >}}) for more information.


#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### activate

#### Usage 
`cfy maintenance-mode activate [OPTIONS]`

Enter maintenance-mode on {{< param cfy_manager_name >}}, rejecting further REST requests.

#### Optional flags

* `--wait` - 			Wait until there are no running executions and
                     	automatically activate maintenance-mode.
* `--timeout INTEGER` - Operation timeout in seconds. (The execution will
                     	keep going, but the CLI will stop waiting for it to
                     	terminate.) [default: {0}]

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy maintenance-mode activate
...

Entering maintenance mode...
Run 'cfy maintenance-mode status' to check the maintenance mode's status.

...
{{< /highlight >}}


### deactivate

#### Usage 
`cfy maintenance-mode deactivate` 

Deactivate maintenance-mode on the {{< param cfy_manager_name >}}, to accept REST requests.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy maintenance-mode deactivate
...

Turning off maintenance mode...
Maintenance mode is off.

...
{{< /highlight >}}


### status

#### Usage 
`cfy maintenance-mode status`

Retrieve the current maintenance-mode status.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy maintenance-mode status
...

Maintenance Mode Status:
	Status:	activated
	Requested By:	admin
	Activated At:	2017-04-04T05:16:21.407Z
	Activation Requested At:	2017-04-04T05:16:21.407Z

INFO - {{< param cfy_manager_name >}} is currently in maintenance mode. Most requests will be blocked.

...
{{< /highlight >}}
