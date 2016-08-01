---
layout: bt_wiki
title: install
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 100
---

The `cfy install` command is used to install an application using a Cloudify manager without having to manually go through the process of uploading a blueprint, creating a deployment and executing a workflow.


Usage: `cfy install [OPTIONS] [BLUEPRINT_PATH]`

Install an application via the manager

`BLUEPRINT_PATH` can be either a local blueprint yaml file or blueprint
archive; a url to a blueprint archive or an
`organization/blueprint_repo[:tag/branch]` (to be retrieved from GitHub)

This will upload the blueprint, create a deployment and execute the
`install` workflow.

#### Optional flags

*  `-b, --blueprint-id TEXT` -  
                        The unique identifier for the blueprint [manager only]
*  `-n, --blueprint-filename TEXT` -
                        The name of the archive's main blueprint
                        file. This is only relevant if uploading an archive
*  `--validate` -       Validate the blueprint first
*  `-d, --deployment-id TEXT` - 
                        The unique identifier for the deployment [manager only]
*  `-i, --inputs TEXT` - 
                        Inputs for the deployment (Can be provided as
                        wildcard based paths (*.yaml, /my_inputs/,
                        etc..) to YAML files, a JSON string or as
                        key1=value1;key2=value2). This argument can
                        be used multiple times
*  `-w, --workflow-id TEXT` - 
                        The workflow to execute [default: install]
*  `-p, --parameters TEXT` - 
                        Parameters for the workflow (Can be provided
                        as wildcard based paths (*.yaml, /my_inputs/,
                        etc..) to YAML files, a JSON string or as
                        key1=value1;key2=value2). This argument can
                        be used multiple times
*  `--allow-custom-parameters` -
                        Allow passing custom parameters (which were
                        not defined in the workflow's schema in the
                        blueprint) to the execution
*  `--task-retries INTEGER` - 
                        How many times should a task be retried in
                        case of failure [default: 5] [local only]
*  `--task-retry-interval INTEGER` - 
                        How many times should a task be retried in
                        case of failure [default: 3] [local only]
*  `--task-thread-pool-size INTEGER` - 
                        The size of the thread pool to execute tasks
                        in [default: 1] [local only]
*  `--timeout INTEGER` - 
                        Operation timeout in seconds (The execution
                        itself will keep going, but the CLI will stop
                        waiting for it to terminate) [default: {0}] [manager only]
*  `--include-logs / --no-logs` - 
                        Include logs in returned events [default: True] [manager only]
*  `--json` -           Output events in a consumable JSON format [manager only]


&nbsp;
#### Example

```markdown
$ cfy install -p cloudify-hello-world-example-master/ec2-blueprint.yaml
...

Uploading blueprint cloudify-hello-world-example-master/ec2-blueprint.yaml...
Blueprint uploaded. The blueprint's id is cloudify-hello-world-example-master
Creating new deployment from blueprint cloudify-hello-world-example-master...
Deployment created. The deployment's id is cloudify-hello-world-example-master
Executing workflow install on deployment cloudify-hello-world-example-master [timeout=900 seconds]
Deployment environment creation is in progress...
2016-06-28T12:19:35 CFY <cloudify-hello-world-example-master> Starting 'create_deployment_environment' workflow execution
.
.
.
2016-06-28T12:21:18 CFY <cloudify-hello-world-example-master> [vm_8573e] Configuring Agent
2016-06-28T12:21:18 CFY <cloudify-hello-world-example-master> [vm_8573e.configure] Sending task 'cloudify_agent.installer.operations.configure'
2016-06-28T12:21:18 CFY <cloudify-hello-world-example-master> [vm_8573e.configure] Task started 'cloudify_agent.installer.operations.configure'
2016-06-28T12:21:18 CFY <cloudify-hello-world-example-master> [vm_8573e.configure] Task started 'cloudify_agent.installer.operations.configure'
2016-06-28T12:21:24 CFY <cloudify-hello-world-example-master> [vm_8573e.configure] Task succeeded 'cloudify_agent.installer.operations.configure
.
.
.
2016-06-28T12:21:49 CFY <cloudify-hello-world-example-master> [http_web_server_d776e.start] Task succeeded 'script_runner.tasks.run'
2016-06-28T12:21:49 CFY <cloudify-hello-world-example-master> 'install' workflow execution succeeded
Finished executing workflow install on deployment cloudify-hello-world-example-master
* Run 'cfy events list --include-logs --execution-id acc1a58d-108b-4a10-84c5-abbabfa5cd2f' to retrieve the execution's events/logs

...
```