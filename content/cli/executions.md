---
layout: bt_wiki
title: executions
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 70
---

The `cfy executions` command is used to manage workflow executions on a Cloudify manager.

You can use the command to start, cancel and and list executions and to retrieve information on a single execution.


## Commands

### start

Usage: `cfy executions start [OPTIONS] WORKFLOW_ID`

Execute a workflow on a given deployment 

`WORKFLOW_ID` is the id of the workflow to execute (e.g. `uninstall`)

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
* `-l, --include-logs` -   Include logs in returned events
* `--json` -               Output events in a consumable JSON format


&nbsp;
#### Example

```markdown
$ cfy executions start -d hello_world -w install
...

Executing workflow install on deployment hello_world [timeout=900 seconds]
2016-06-28T11:28:30 CFY <hello_world> Starting 'install' workflow execution
2016-06-28T11:28:30 CFY <hello_world> [elastic_ip_02973] Creating node
.
.
.
2016-06-28T11:30:01 CFY <hello_world> [vm_5ab69] Configuring Agent
2016-06-28T11:30:01 CFY <hello_world> [vm_5ab69.configure] Sending task 'cloudify_agent.installer.operations.configure'
2016-06-28T11:30:02 CFY <hello_world> [vm_5ab69.configure] Task started 'cloudify_agent.installer.operations.configure'
2016-06-28T11:30:12 CFY <hello_world> [vm_5ab69.configure] Task succeeded 'cloudify_agent.installer.operations.configure'
2016-06-28T11:30:12 CFY <hello_world> [vm_5ab69] Starting Agent
.
.
.
2016-06-28T11:30:35 CFY <hello_world> [http_web_server_d1dc7.start] Task started 'script_runner.tasks.run'
2016-06-28T11:30:37 CFY <hello_world> [http_web_server_d1dc7.start] Task succeeded 'script_runner.tasks.run'
2016-06-28T11:30:37 CFY <hello_world> 'install' workflow execution succeeded
Finished executing workflow install on deployment hello_world
* Run 'cfy events list --include-logs --execution-id 37b2d6d6-286c-465a-b68d-3304ba972f3d' to retrieve the execution's events/logs

...
```


### cancel

Usage: `cfy executions cancel [OPTIONS] EXECUTION_ID`

Cancel a workflow's execution

`EXECUTION_ID` - The ID of the execution to cancel

#### Optional flags

* `-f, --force` - Terminate the execution abruptly, rather than request an orderly termination

&nbsp;
#### Example

```markdown
$ cfy executions cancel --execution-id c7fab104-13a9-46f5-b934-ef5280aa88c6
...

Cancelling execution c7fab104-13a9-46f5-b934-ef5280aa88c6
A cancel request for execution c7fab104-13a9-46f5-b934-ef5280aa88c6 has been sent. To track the execution's status, use:
cfy executions get -e c7fab104-13a9-46f5-b934-ef5280aa88c6

...
```

### list

Usage: `cfy executions list [options]`

List executions

If `DEPLOYMENT_ID` is provided, list executions for that deployment.
Otherwise, list executions for all deployments.

#### Optional flags

* `-d, --deployment-id TEXT` - 
                        The deployment ID to list executions for
* `--include-system-workflows` -   
                        Include executions of system workflows
* `--sort-by TEXT` -    Key for sorting the list
* `--descending` -      Sort list in descending order [default: False]

&nbsp;
#### Example

```markdown
$ cfy executions list
...

Listing all executions...

Executions:
+--------------------------------------+-------------------------------+----------------+------------+----------------------------+
|                  id                  |          workflow_id          | deployment_id  |   status   |         created_at         |
+--------------------------------------+-------------------------------+----------------+------------+----------------------------+
| c54a4dd8-8827-4e72-a3c1-286a88882259 |            install            | simple_website |   failed   | 2016-06-28 09:57:14.762093 |
| ce49dbfa-53ed-4378-bb5b-fbaa015f2a14 | create_deployment_environment |  hello_world   | terminated | 2016-06-28 11:28:02.045416 |
| 37b2d6d6-286c-465a-b68d-3304ba972f3d |            install            |  hello_world   | terminated | 2016-06-28 11:28:29.605230 |
| 3c035aea-547d-4a7a-8b59-0716d8242b3a | create_deployment_environment | simple_website | terminated | 2016-06-28 09:20:40.972539 |
+--------------------------------------+-------------------------------+----------------+------------+----------------------------+

...
```

### get

Usage: `cfy executions get [OPTIONS] EXECUTION_ID`

Retrieve information for a specific execution

`EXECUTION_ID` is the execution to get information on.

&nbsp;
#### Example

```markdown
$ cfy executions get -e 37b2d6d6-286c-465a-b68d-3304ba972f3d
...

Retrieving execution 37b2d6d6-286c-465a-b68d-3304ba972f3d

Executions:
+--------------------------------------+-------------+------------+---------------+----------------------------+-------+
|                  id                  | workflow_id |   status   | deployment_id |         created_at         | error |
+--------------------------------------+-------------+------------+---------------+----------------------------+-------+
| 37b2d6d6-286c-465a-b68d-3304ba972f3d |   install   | terminated |  hello_world  | 2016-06-28 11:28:29.605230 |       |
+--------------------------------------+-------------+------------+---------------+----------------------------+-------+

Execution Parameters:

...
```