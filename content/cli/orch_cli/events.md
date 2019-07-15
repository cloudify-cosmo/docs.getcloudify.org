---
layout: bt_wiki
title: events
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/events/
---

The `cfy events` command is used to view events of a specific execution.

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


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
*  `-o, --pagination-offset INTEGER`       The number of resources to skip;
                                  --pagination-offset=1 skips the first resource [default: 0]

*  `-s, --pagination-size INTEGER`       The max number of results to retrieve per page [default: 1000]




&nbsp;
#### Example
{{< highlight  bash  >}}
$ cfy events list -e dcf2dc2f-dc4f-4036-85a6-e693196e6331
...

Listing events for execution id dcf2dc2f-dc4f-4036-85a6-e693196e6331 [include_logs=True]
2017-03-30 10:26:12.723  CFY <cloudify-nodecellar-example> Starting 'update' workflow execution
2017-03-30 10:26:13.201  CFY <cloudify-nodecellar-example> 'update' workflow execution succeeded

Total events: 2

...
{{< /highlight >}}

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

{{< highlight  bash  >}}
$ cfy events delete cloudify-nodecellar-example
...

Deleting events for deployment id cloudify-nodecellar-example [include_logs=True]

Deleted 344 events

...
{{< /highlight >}}
