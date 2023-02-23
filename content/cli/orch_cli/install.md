---
title: install
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/install/
---

The `cfy install` command is used to install an application using a {{< param cfy_manager_name >}} without having to manually go through the process of uploading a blueprint, creating a deployment and executing a workflow.


#### Usage 
`cfy install [OPTIONS] [BLUEPRINT_PATH]`

Install an application via the manager

`BLUEPRINT_PATH` can be either a local blueprint yaml file or blueprint
archive; a url to a blueprint archive or an
`organization/blueprint_repo[:tag/branch]` (to be retrieved from GitHub)

This will upload the blueprint, create a deployment and execute the
`install` workflow.

#### Optional flags
This command supports the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

*  `-b, --blueprint-id TEXT` -  
                        The unique identifier for the blueprint [manager only]
*  `-n, --blueprint-filename TEXT` -
                        The name of the archive's main blueprint
                        file. This is only relevant if uploading an archive
*  `--validate` -       Validate the blueprint first
*  `-d, --deployment-id TEXT` - 
                        The unique identifier for the deployment [manager only]
*  `-g, --deployment-group-id TEXT` -
                        Deployment group id (a name).
*  `--count INTEGER` -
                        Create this many deployments in the group.
*  `-i, --inputs TEXT` - 
                        Inputs for the deployment (Can be provided as
                        wildcard based paths (*.yaml, /my_inputs/,
                        etc..) to YAML files, a JSON string or as
                        'key1=value1;key2=value2'). This argument can
                        be used multiple times
*  `-w, --workflow-id TEXT` - 
                        The workflow to execute [default: install]
*  `-p, --parameters TEXT` - 
                        Parameters for the workflow (Can be provided
                        as wildcard based paths (*.yaml, /my_inputs/,
                        etc..) to YAML files, a JSON string or as
                        'key1=value1;key2=value2'). This argument can
                        be used multiple times
*  `--allow-custom-parameters` -
                        Allow passing custom parameters (which were
                        not defined in the workflow's schema in the
                        blueprint) to the execution
*  `--timeout INTEGER` - 
                        Operation timeout in seconds (The execution
                        itself will keep going, but the CLI will stop
                        waiting for it to terminate) [default: {0}] [manager only]
*  `--include-logs / --no-logs` - 
                        Include logs in returned events [default: True] [manager only]
*  `--blueprint-labels TEXT` - 
                        A labels list of the form <key>:<value>,<key>:<value>

*  `--deployment-labels TEXT` -  
                        A labels list of the form <key>:<value>,<key>:<value>


&nbsp;
#### Example

{{< highlight  bash  >}}
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
{{< /highlight >}}
