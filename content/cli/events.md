---
layout: bt_wiki
title: events
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 60
---

The `cfy events` command is used to view events of a specific execution.

#### Optional Flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)

* `-h, --help` - Show this message and exit.

## Commands

### list

#### Usage 
`cfy events list [OPTIONS]`

Display events for an execution

*  `-e, --execution-id TEXT`     The unique identifier for the execution. Mandatory.
                              

#### Optional flags


*  `--include-logs / --no-logs` - 
						Include logs in returned events. [default: True]
*  `--json` -           Output events in a consumable JSON format.
*  `--tail` -           Tail the events of the specified execution until
                      	it ends.
*  ` -t, --tenant-name TEXT`      The name of the tenant on which the execution occurred. If unspecified, the current tenant is used.



&nbsp;
#### Example

```markdown
$ cfy events list -e dcf2dc2f-dc4f-4036-85a6-e693196e6331
...

Listing events for execution id dcf2dc2f-dc4f-4036-85a6-e693196e6331 [include_logs=True]
2017-03-30 10:26:12.723  CFY <cloudify-nodecellar-example> Starting 'update' workflow execution
2017-03-30 10:26:13.201  CFY <cloudify-nodecellar-example> 'update' workflow execution succeeded

Total events: 2

...
```

### delete

#### Usage 
`cfy events delete [OPTIONS] EXECUTION_ID`

Delete events attached to a deployment.

`EXECUTION_ID` is the ID of the execution events to delete.

#### Optional flags

*  `--include-logs / --no-logs` - 
						Include logs in returned events [default: True]
*  ` -t, --tenant-name TEXT`      The name of the tenant on which the execution occurred. If unspecified, the current tenant is used.


&nbsp;
#### Example

```markdown
$ cfy events delete cloudify-nodecellar-example
...

Deleting events for deployment id cloudify-nodecellar-example [include_logs=True]

Deleted 344 events

...
```