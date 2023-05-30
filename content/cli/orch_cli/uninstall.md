---
title: uninstall
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/uninstall/
---

The `cfy uninstall` command is used to uninstall an application using {{< param cfy_manager_name >}}, without having to manually go through the process of executing a workflow, deleting a deployment and deleting a blueprint.


#### Usage
`cfy uninstall [OPTIONS] DEPLOYMENT_ID`

Uninstall an application via {{< param cfy_manager_name >}}.

This command executes the `uninstall` workflow, deletes the deployment and
the blueprint (if there is only one deployment for that blueprint).

`DEPLOYMENT_ID` is the ID of the deployment to uninstall.

#### Optional flags

This command supports the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

*  `-w, --workflow-id TEXT` - 
                        The workflow to execute [default: uninstall]
*  `-p, --parameters TEXT` - 
                        Parameters for the workflow (Can be provided as
                        wildcard-based paths (*.yaml, /my_inputs/,
                        etc..) to YAML files, a JSON string or as
                        'key1=value1;key2=value2'). This argument can be
                        used multiple times.
*  `--allow-custom-parameters` - 
                        Allow passing custom parameters (that were not
                        defined in the workflow's schema in the
                        blueprint) to the execution.
*  `--timeout INTEGER` - 
                        Operation timeout in seconds. (The execution
                        continues, but the CLI stops
                        waiting for it to terminate) [default: {0}] [manager only]
*  `--include-logs / --no-logs` -
                        Include logs in returned events. [default: True]
* `-t, --tenant-name TEXT` -  The name of the tenant of the deployment. If unspecified, the current tenant is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy uninstall cloudify-hello-world-example
...

Executing workflow uninstall on deployment cloudify-hello-world-example [timeout=900 seconds]
2017-04-04 09:55:44.071  CFY <cloudify-hello-world-example> Starting 'uninstall' workflow execution
2017-04-04 09:55:44.927  CFY <cloudify-he...
.
.
.
2017-04-04 09:56:01.680  CFY <cloudify-hello-world-example> 'uninstall' workflow execution succeeded
Finished executing workflow uninstall on deployment cloudify-hello-world-example
* Run 'cfy events list -e 97a0c9af-9927-4189-8b36-5b3fba05347b' to retrieve the execution's events/logs
Deleting deployment cloudify-hello-world-example...
Deployment deleted
Deleting blueprint cloudify-hello-world-example...
Blueprint deleted

...
{{< /highlight >}}