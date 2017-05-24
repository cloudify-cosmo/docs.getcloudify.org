---
layout: bt_wiki
title: maintenance-mode
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 130
---

The `cfy maintenance-mode` command is used to restrict REST access to the manager.

This is required, for instance, when upgrading a manager via the `cfy upgrade` or `cfy rollback` commands.

Putting the manager in maintenance-mode prevents it from running any executions.

See [maintenance-mode]({{< relref "manager/maintenance-mode.md" >}}) for more information.


## Commands

### activate

Usage: `cfy maintenance-mode activate [options]`

Enter maintenance-mode on the manager rejecting further REST requests.

#### Optional flags

* `--wait=false` - Wait until there are no running executions and automatically activate maintenance-mode
* `--timeout=SECONDS` - Operation timeout in seconds (The execution itself will keep going, but the CLI will stop waiting for it to terminate.)

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy maintenance-mode activate
...

Entering maintenance mode...
Run 'cfy maintenance-mode status' to check the maintenance mode's status.

...
{{< /gsHighlight >}}


### deactivate

Usage: `cfy maintenance-mode deactivate` 

Deactivate maintenance-mode on the manager to accept REST requests.

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy maintenance-mode deactivate
...

Turning off maintenance mode...
Maintenance mode is off.

...
{{< /gsHighlight >}}


### status

Usage: `cfy maintenance-mode status`

Retrieve the current maintenance-mode status.

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy maintenance-mode deactivate
...

Maintenance Mode Status:
	Status:	activated
	Activated At:	2016-06-29 05:48:23.898008
	Activation Requested At:	2016-06-29 05:48:11.833297

INFO - Cloudify Manager is currently in maintenance mode. Most requests will be blocked.

...
{{< /gsHighlight >}}