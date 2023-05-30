---
title: events
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/events/
---

The `cfy events` command is used to view events of a specific execution.

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### list

#### Usage
`cfy events list [OPTIONS] EXECUTION_ID`

Display events for an execution.

`EXECUTION_ID` is the unique identifier for the execution.


#### Optional flags


*  `--include-logs / --no-logs` -
						Include logs in returned events. [default: True]
*  `--json` -           Output events in a consumable JSON format.
*  `--tail` -           Tail the events of the specified execution until
                      	it ends.
*  ` -t, --tenant-name TEXT`      The name of the tenant on which the execution occurred. If unspecified, the current tenant is used.
*  `--from DATETIME` -  Output only events that occurred at this timestamp or later.  Valid DATETIME format is one of the following:
                        `%Y-%m-%d`, `%Y-%m-%dT%H:%M:%S`, `%Y-%m-%d %H:%M:%S`, `%Y-%m-%d %H:%M:%S.%f` or Unix time format (number
                        of seconds since Epoch with microseconds as decimal fraction).
*  `--to DATETIME` -    Output only events that occurred at this timestamp or before.  Valid timestamp format as for `--from` parameter.
*  `--before TEXT` -    Output only events that occurred in or before the time defined as such.  The correct format for describing
                        this period is `NUMBER second(s)/minute(s)/hour(s)/day(s)/week(s)/month(s)/year(s) [ago]`, e.g. _3 months_,
                        _1 week ago_, _25 minutes ago_.  This parameter is mutually exclusive with `--to`.
*  `-o, --pagination-offset INTEGER`       The number of resources to skip;
                                  --pagination-offset=1 skips the first resource [default: 0]

*  `-s, --pagination-size INTEGER`       The max number of results to retrieve per page [default: 1000]
*  `-w, --with-worker-names / --without-worker-names` - Show the worker name for each event
* `--node TEXT` - List events for this node
* `--operation TEXT` - List events for this interface operation (eg. cloudify.interfaces.lifecycle.create)


&nbsp;
#### Example
{{< highlight  bash  >}}
$ cfy events list dcf2dc2f-dc4f-4036-85a6-e693196e6331
...

Listing events for execution id dcf2dc2f-dc4f-4036-85a6-e693196e6331 [include_logs=True]
2017-03-30 10:26:12.723  CFY <cloudify-nodecellar-example> Starting 'update' workflow execution
2017-03-30 10:26:13.201  CFY <cloudify-nodecellar-example> 'update' workflow execution succeeded

Total events: 2

...
{{< /highlight >}}

### delete

#### Usage
`cfy events delete [OPTIONS] DEPLOYMENT_ID`

Delete events attached to a deployment.

`DEPLOYMENT_ID` is the ID of the deployment events to delete.

#### Optional flags

*  `--include-logs / --no-logs` -
						Include logs in returned events [default: True]
*  ` -t, --tenant-name TEXT`      The name of the tenant on which the execution occurred. If unspecified, the current tenant is used.
*  `--from DATETIME` -  Output only events that occurred at this timestamp or later.  Valid DATETIME format is one of the following:
                        `%Y-%m-%d`, `%Y-%m-%dT%H:%M:%S`, `%Y-%m-%d %H:%M:%S`, `%Y-%m-%d %H:%M:%S.%f` or Unix time format (number
                        of seconds since Epoch).
*  `--to DATETIME` -    Delete only events that occurred at this timestamp or before.  Valid timestamp format as for `--from` parameter.
                        This parameter is mutually exclusive with `--before`.
*  `--before TEXT` -    Delete only events that took place in or before the time defined as such.  The correct format for describing
                        this period is `NUMBER second(s)/minute(s)/hour(s)/day(s)/week(s)/month(s)/year(s) [ago]`, e.g. _3 months_,
                        _1 week ago_, _25 minutes ago_.  This parameter is mutually exclusive with `--to`.
*  `--store-before` -   Store events/logs before deleting them.  The exact behaviour is then determined by the `--output-path` parameter:
                        if it is not set, then all the storage is done on the manager's side and output files are
                        `/opt/manager/logs/<TABLE_NAME>_<DEPLOYMENT_ID>_<TIMESTAMP>.log`.
*  `--output-path FILE` - Define a location on a machine running `cfy` command for a file where events listed before deletion will be stored.

&nbsp;
#### Examples

{{< highlight  bash  >}}
$ cfy events delete cloudify-nodecellar-example
...

Deleting events for deployment id cloudify-nodecellar-example [include_logs=True]

Deleted 344 events

...

$ cfy events delete --from "2020-05-13 15:49:40" --to "2020-05-13 15:49:46" --store-before cloudify-nodecellar-example
...

Deleting events for deployment id test [include_logs=True, from_datetime=2020-05-13 15:49:40, to_datetime=2020-05-13 15:49:46]

Deleted 8 events

...

$ cfy events delete --before "10 seconds" --store-before --output-path ~/deleted-test-logs.txt test
...

Deleting events for deployment id test [include_logs=True, to_datetime=2020-05-13 15:53:43.892]

Deleted 6 events

...

{{< /highlight >}}
