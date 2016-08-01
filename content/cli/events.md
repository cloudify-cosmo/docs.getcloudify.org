---
layout: bt_wiki
title: events
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 60
---

The `cfy events` command is used to view events of specific executions.


## Commands

### list

Usage: `cfy events list [OPTIONS] EXECUTION_ID`

Display events for an execution

`EXECUTION_ID` is the execution to list events for.

#### Optional flags

*  `--include-logs / --no-logs` - 
						Include logs in returned events [default: True]
*  `--json` -           Output events in a consumable JSON format

*  `--tail` -           Tail the events of the specified execution until
                      	it ends

&nbsp;
#### Example

```markdown
$ cfy events list -e 26a9f8a8-f09f-468f-a46a-f64de4a31070
...

Listing events for execution id 26a9f8a8-f09f-468f-a46a-f64de4a31070 [include_logs=False]
2016-06-27T11:40:08 CFY <nodecellar> Starting 'update' workflow execution
2016-06-27T11:40:09 CFY <nodecellar> 'update' workflow execution succeeded

Total events: 2

...
```

### delete

Usage: `cfy events delete [OPTIONS] DEPLOYMENT_ID`

Delete events attached to a deployment

#### Optional flags

*  `--include-logs / --no-logs` - 
						Include logs in returned events [default: True]

&nbsp;
#### Example

```markdown
$ cfy events delete simple-python-webserver-blueprint
...

Deleting events for deployment id simple-python-webserver-blueprint [include_logs=True]

Deleted 17 events

...
```