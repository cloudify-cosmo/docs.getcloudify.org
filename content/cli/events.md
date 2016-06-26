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
