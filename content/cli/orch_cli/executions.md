---
layout: bt_wiki
title: executions
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/executions/
---

The `cfy executions` command is used to manage workflow executions on Cloudify Manager.

You can use the command to start, cancel and and list executions and to retrieve information about a single execution.

You can also schedule executions to start in a specific date and time in the future (using the `--schedule` flag).

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### start

#### Usage
`cfy executions start [OPTIONS] WORKFLOW_ID`

Execute a workflow on a given deployment

`WORKFLOW_ID` is the ID of the workflow to execute (e.g. `uninstall`)

#### Optional flags

* `-d, --deployment-id TEXT` -
                        The deployment ID to execute the workflow on
* `-p, --parameters TEXT` -
                        Parameters for the workflow execution (Can be provided
                        as wildcard based paths (*.yaml, etc..) to YAML files,
                        a JSON string or as "key1=value1;key2=value2"). This
                        argument can be used multiple times.
* `--allow-custom-parameters` -
                        Allow passing custom parameters (which were not
                        defined in the workflow's schema in the blueprint) to
                        the execution
* `-f, --force` -          Execute the workflow even if there is an ongoing
                        execution for the given deployment
* `--timeout INTEGER` -     Operation timeout in seconds (The execution itself
                        will keep going, but the CLI will stop waiting for it
                        to terminate) (default: 900)
* `-l, --include-logs / --no-logs` -   Include logs in returned events
* `--json` -               Output events in a consumable JSON format
* ` -t, --tenant-name TEXT` -     The name of the tenant on which the execution will be executed. If unspecified, the current tenant is used.
* `--dry-run` - Execute the workflow as a [dry-run]({{< relref "working_with/workflows/dry-run.md" >}}) so that the execution is shown step-by-step but the workflow is not implemented and no changes are made.
* `--queue` - If set, executions that can`t currently run will
              be queued and run automatically when possible.
              You cannot use this argument with arguments: [force, dry_run]
* `--schedule TEXT` - The time (including timezone) this workflow will
                      be executed at; expected format:
                      YYYYMMDDHHMM+HHMM or YYYYMMDDHHMM-HHMM. i.e:
                      201801032230-0500 (Jan-03-18 10:30pm EST). You
                      cannot use this argument with arguments: [queue]

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy executions start install -d cloudify-nodecellar-example
...

Executing workflow install on deployment cloudify-nodecellar-example [timeout=900 seconds]
2017-03-29 11:34:11.704  CFY <cloudify-nodecellar-example> Starting 'install' workflow execution
2017-03-29 11:34:12.204  CFY <cloudify-nodecellar-example> [hos...
.
.
.
2017-03-29 11:36:47.537  CFY <cloudify-nodecellar-example> 'install' workflow execution succeeded
Finished executing workflow install on deployment cloudify-nodecellar-example
* Run 'cfy events list -e f38ad989-d09e-4b68-b041-ac63aeacb9ae' to retrieve the execution's events/logs

...
{{< /highlight >}}


### cancel

#### Usage
`cfy executions cancel [OPTIONS] EXECUTION_ID`

Cancel a workflow's execution

`EXECUTION_ID` - The ID of the execution to be canceled.

#### Optional flags

* `-f, --force` - Terminate the execution abruptly, rather than request an orderly termination.
* `--kill` - Terminate the execution abruptly and stop currently running tasks. This stops all processes running operations and workflows for the given execution.
* `-t, --tenant-name TEXT`      The name of the tenant on which the execution is to be canceled. If unspecified, the current tenant is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy executions cancel eba71d2b-2456-4423-acb0-f8fc7324e793
...

Cancelling execution eba71d2b-2456-4423-acb0-f8fc7324e793
A cancel request for execution eba71d2b-2456-4423-acb0-f8fc7324e793 has been sent. To track the execution's status, use:
cfy executions get eba71d2b-2456-4423-acb0-f8fc7324e793

...
{{< /highlight >}}

### list

#### Usage
`cfy executions list [options]`

List executions.

If `DEPLOYMENT_ID` is provided, lists executions for that deployment.
Otherwise, lists executions for all deployments.

#### Optional flags

* `-d, --deployment-id TEXT` -
                        The ID of the deployment for which executions are to be listed.
* `--include-system-workflows` -
                        Include executions of system workflows.
* `--sort-by TEXT` -    Key for sorting the list.
* `--descending` -      Sort list in descending order. [default: False]
* `-t, --tenant-name TEXT`      The name of the tenant on which the executions occurred. If unspecified, the current tenant is used.
* `-o, --pagination-offset INTEGER` -    The number of resources to skip; --pagination-offset=1 skips the first resource
                                        [default: 0]
* `-s, --pagination-size INTEGER` -      The max number of results to retrieve per page [default: 1000]

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy executions list
...

Listing all executions...

Executions:
+--------------------------------------+-------------------------------+------------+---------------+--------------------------+-------+------------+----------------+------------+
|                  id                  |          workflow_id          |   status   | deployment_id |        created_at        | error | permission |  tenant_name   | created_by |
+--------------------------------------+-------------------------------+------------+---------------+--------------------------+-------+------------+----------------+------------+
| fa330011-1f33-4e6c-82cb-a4537e13c950 |            install            | terminated |   nodecellar  | 2017-03-28 07:47:04.733  |       |  creator   | default_tenant |   admin    |
| 261ac6f8-c75d-4e28-9c62-646925cd326c |           uninstall           | terminated |   nodecellar  | 2017-03-28 07:55:02.582  |       |  creator   | default_tenant |   admin    |
+--------------------------------------+-------------------------------+------------+---------------+--------------------------+-------+------------+----------------+------------+

...
{{< /highlight >}}

### summary

#### Usage
`cfy executions summary <field> [optional sub-field] [OPTIONS]`

Summarizes executions, giving a count of elements with each distinct value for the selected field.
If a sub-field is selected then a count will be given for each distinct field and sub-field combination, as well as totals for each field.

For valid field/sub-field names, invoke `cfy executions summary`

&nbsp;
#### Example

{{< highlight  bash  >}}

$ cfy executions summary deployment_id
Retrieving summary of executions on field deployment_id

Execution summary by deployment_id
+---------------+------------+
| deployment_id | executions |
+---------------+------------+
|      sga1     |     2      |
|      sga3     |     2      |
|      sga2     |     2      |
|       s3      |     2      |
|       s2      |     2      |
|       s1      |     2      |
|       s5      |     2      |
|       s4      |     2      |
|      sg1      |     2      |
+---------------+------------+

...

$ cfy executions summary workflow_id status
Retrieving summary of executions on field workflow_id

Execution summary by workflow_id
+-------------------------------+------------+------------+
|          workflow_id          |   status   | executions |
+-------------------------------+------------+------------+
|        create_snapshot        | terminated |     1      |
|        create_snapshot        |   TOTAL    |     1      |
| create_deployment_environment | terminated |     9      |
| create_deployment_environment |   TOTAL    |     9      |
|            install            | terminated |     9      |
|            install            |   TOTAL    |     9      |
|        restore_snapshot       |  started   |     1      |
|        restore_snapshot       |   TOTAL    |     1      |
+-------------------------------+------------+------------+

...

{{< /highlight >}}

### get

#### Usage
`cfy executions get [OPTIONS] EXECUTION_ID`

Retrieve information for a specific execution.

`EXECUTION_ID` is the execution about which to retrieve information.

#### Optional flags

* `-t, --tenant-name TEXT`      The name of the tenant on which the execution occurred. If unspecified, the current tenant is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy executions get f38ad989-d09e-4b68-b041-ac63aeacb9ae
...

Retrieving execution f38ad989-d09e-4b68-b041-ac63aeacb9ae

Execution:
+--------------------------------------+-------------+------------+-----------------------------+--------------------------+--------------------------+-------+------------+----------------+------------+
|                  id                  | workflow_id |   status   |        deployment_id        |        created_at        |        ended_at          | error | permission |  tenant_name   | created_by |
+--------------------------------------+-------------+------------+-----------------------------+--------------------------+--------------------------+-------+------------+----------------+------------+
| f38ad989-d09e-4b68-b041-ac63aeacb9ae |   install   | terminated | cloudify-nodecellar-example | 2017-03-29 11:34:11.014  | 2017-03-29 11:34:11.410  |       |  creator   | default_tenant |   admin    |
+--------------------------------------+-------------+------------+-----------------------------+--------------------------+--------------------------+-------+------------+----------------+------------+

Execution Parameters:
...
{{< /highlight >}}


### resume
`cfy executions resume [OPTIONS] EXECUTION_ID`

Resume the execution of a workflow in a failed or cancelled state.

`EXECUTION_ID` is the ID of the execution to resume. The workflow will run
again, restoring the tasks graph from the storage, and retrying failed
tasks when necessary. If reset-operations is passed, tasks that were
started but didn't fail will be retried as well.

#### Optional flags
* `--reset-operations` - Reset operations in started state, so that they are
                         run again unconditionally
* `-t, --tenant-name TEXT` - The name of the tenant of the execution. If not
                             specified, the current tenant will be used

#### Example

{{< highlight  bash >}}
$ cfy executions resume 19280e9a-7163-4066-b4f4-a09aaed6dd0e
...
Resuming execution 19280e9a-7163-4066-b4f4-a09aaed6dd0e
A resume request for execution 19280e9a-7163-4066-b4f4-a09aaed6dd0e has been sent. To track the execution's status, use:
cfy executions get 19280e9a-7163-4066-b4f4-a09aaed6dd0e
{{< /highlight >}}
