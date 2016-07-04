---
layout: bt_wiki
title: install
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 100
---

The `cfy install` command is used to install an application using a Cloudify manager without having to manually go through the process of uploading a blueprint, creating a deployment and executing a workflow.


Usage: `cfy install [options]`

Install an application.

#### Optional flags

*  `--allow-custom-parameters` -
                        Allow passing custom parameters (which were not
                        defined in the workflow's schema in the blueprint) to
                        the execution
*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        A user provided deployment ID
*  `--timeout=TIMEOUT` -     Operation timeout in seconds (The execution itself
                        will keep going, but the CLI will stop waiting for it
                        to terminate) (default: 900)
*  `-w, --workflow=WORKFLOW` -
                        The name of the workflow to execute (default: install)
*  `-l, --archive-location=ARCHIVE_LOCATION` -
                        The path or URL to the application's blueprint archive
*  `--json` -                Output events in a consumable JSON format
*  `--parameters=PARAMETERS` -
                        Parameters for the workflow execution (Can be provided
                        as wildcard based paths (*.yaml, etc..) to YAML files,
                        a JSON string or as "key1=value1;key2=value2"). This
                        argument can be used multiple times.
*  `--include-logs` -        Include logs in returned events
*  `-b, --blueprint-id=BLUEPRINT_ID` -
                        A user provided blueprint ID
*  `-p, --blueprint-path=BLUEPRINT_FILE` -
                        The path to the application's blueprint file.
                        (default: blueprint.yaml)
*  `-g, --auto-generate-ids` -
                        Auto generate blueprint and deployment IDs
*  `--validate` -            Validate the blueprint before uploading it to the
                        Manager
*  `-i, --inputs=INPUTS` -
                        Inputs for the deployment (Can be provided as wildcard
                        based paths (*.yaml, etc..) to YAML files, a JSON
                        string or as "key1=value1;key2=value2"). This argument
                        can be used multiple times. (default: inputs.yaml)
*  `-n, --blueprint-filename=BLUEPRINT_FILENAME` -
                        The name of the archive's main blueprint file.
                        (default: blueprint.yaml)

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
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
{{< /gsHighlight >}}