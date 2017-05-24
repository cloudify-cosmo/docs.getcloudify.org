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

Usage: `cfy events list -e EXECUTION_ID`

Lists all events for an execution.

#### Required flags

*  `-e, --execution-id=EXECUTION_ID` - The ID of the execution to list events for

#### Optional flags

*  `-l, --include-logs` -    Include logs in returned events
*  `--json` -               Output events in a consumable JSON format
*  `--tail` -               Tail the events of the specified execution until it
                        ends

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
cfy events list -e 26a9f8a8-f09f-468f-a46a-f64de4a31070
...

Listing events for execution id 26a9f8a8-f09f-468f-a46a-f64de4a31070 [include_logs=False]
2016-06-27T11:40:08 CFY <nodecellar> Starting 'update' workflow execution
2016-06-27T11:40:09 CFY <nodecellar> 'update' workflow execution succeeded

Total events: 2

...
{{< /gsHighlight >}}