---
layout: bt_wiki
title: uninstall
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 230
---

The `cfy uninstall` command is used to uninstall an application using a Cloudify manager without having to manually go through the process of executing working, deleting a deployment and deleting a blueprint.


Usage: `cfy uninstall [OPTIONS] DEPLOYMENT_ID`

Uninstall an application via the manager

This will execute the `uninstall` workflow, delete the deployment and
delete the blueprint (if there is only one deployment for that blueprint).

`DEPLOYMENT_ID` is the id of the deployment to uninstall.

#### Optional flags

*  `-w, --workflow-id TEXT` - 
                        The workflow to execute [default: uninstall]
*  `-p, --parameters TEXT` - 
                        Parameters for the workflow (Can be provided as
                        wildcard based paths (*.yaml, /my_inputs/,
                        etc..) to YAML files, a JSON string or as
                        key1=value1;key2=value2). This argument can be
                        used multiple times
*  `--allow-custom-parameters` - 
                        Allow passing custom parameters (which were not
                        defined in the workflow's schema in the
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
                        Include logs in returned events [default: True]
*  `--json` -           Output events in a consumable JSON format

&nbsp;
#### Example

```markdown
$ cfy uninstall -d hello_world
...

Executing workflow uninstall on deployment hello_world [timeout=900 seconds]
2016-06-28T12:13:29 CFY <hello_world> Starting 'uninstall' workflow execution
2016-06-28T12:13:30 CFY <hello_world> [http_web_server_d1dc7.stop] Sending task 'script_runner.tasks.run'
.
.
.
2016-06-28T12:14:14 CFY <hello_world> [vm_5ab69.stop] Task rescheduled 'ec2.instance.stop' -> Waiting server to stop. Retrying... [retry 1]
2016-06-28T12:14:44 CFY <hello_world> [vm_5ab69.stop] Task started 'ec2.instance.stop' [retry 2]
2016-06-28T12:14:44 CFY <hello_world> [vm_5ab69.stop] Task started 'ec2.instance.stop' [retry 2]
2016-06-28T12:14:44 CFY <hello_world> [vm_5ab69.stop] Task succeeded 'ec2.instance.stop' [retry 2]
2016-06-28T12:14:45 CFY <hello_world> [vm_5ab69->elastic_ip_02973|unlink] Sending task 'ec2.elasticip.disassociate'
.
.
.
2016-06-28T12:15:19 CFY <hello_world> [elastic_ip_02973] Deleting node
2016-06-28T12:15:19 CFY <hello_world> [elastic_ip_02973.delete] Task started 'ec2.elasticip.release'
2016-06-28T12:15:20 CFY <hello_world> 'uninstall' workflow execution succeeded
Finished executing workflow uninstall on deployment hello_world
* Run 'cfy events list --include-logs --execution-id 8b32b117-98ee-45b2-86ba-a5c28118853c' to retrieve the execution's events/logs
Deleting deployment hello_world...
Deployment deleted
Deleting blueprint hello...
Blueprint deleted

...
```