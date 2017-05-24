---
layout: bt_wiki
title: maintenance-mode
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 120
---

The `cfy maintenance-mode` command is used to restrict REST access to the manager.

This is required, for instance, when upgrading a manager via the `cfy upgrade` or `cfy rollback` commands.

Putting the manager in maintenance-mode prevents it from running any executions.

See [maintenance-mode]({{< relref "manager/maintenance-mode.md" >}}) for more information.

#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.


## Commands

### activate

#### Usage 
`cfy maintenance-mode activate [OPTIONS]`

Enter maintenance-mode on Cloudify Manager, rejecting further REST requests.

#### Optional flags

* `--wait` - 			Wait until there are no running executions and
                     	automatically activate maintenance-mode.
* `--timeout INTEGER` - Operation timeout in seconds. (The execution will
                     	keep going, but the CLI will stop waiting for it to
                     	terminate.) [default: {0}]

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy maintenance-mode activate
...

Entering maintenance mode...
Run 'cfy maintenance-mode status' to check the maintenance mode's status.

...
{{< /gsHighlight >}}


### deactivate

#### Usage 
`cfy maintenance-mode deactivate` 

Deactivate maintenance-mode on the Cloudify Manager, to accept REST requests.

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy maintenance-mode deactivate
...

Turning off maintenance mode...
Maintenance mode is off.

...
{{< /gsHighlight >}}


### status

#### Usage 
`cfy maintenance-mode status`

Retrieve the current maintenance-mode status.

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy maintenance-mode status
...

Maintenance Mode Status:
	Status:	activated
	Requested By:	admin
	Activated At:	2017-04-04T05:16:21.407Z
	Activation Requested At:	2017-04-04T05:16:21.407Z

INFO - Cloudify Manager is currently in maintenance mode. Most requests will be blocked.

...
{{< /gsHighlight >}}