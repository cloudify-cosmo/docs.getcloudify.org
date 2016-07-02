---
layout: bt_wiki
title: local
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 110
---

The `cfy local` command is used to manage a deployment of a single blueprint locally. 

You can use it to install applications without using a manager.

Note that executing a workflow locally doesn't necessarily mean that things will be installed on the local machine running `cfy`. It just means that the workflow will run locally. If the blueprint dictates that the aws-plugin is used to deploy resources in aws and then use the fabric-plugin to run scripts, that's what will happen.


## Commands

### install

Usage: `cfy local install [options]`

Install a blueprint.

#### Optional flags

* `--allow-custom-parameters` -
                        Allow passing custom parameters (which were not
                        defined in the workflow's schema in the blueprint) to
                        the execution
*  `-w, --workflow=WORKFLOW` - 
                        The workflow to execute (default: install)
*  `--parameters=PARAMETERS` -
                        Parameters for the workflow execution (Can be provided
                        as wildcard based paths (*.yaml, etc..) to YAML files,
                        a JSON string or as "key1=value1;key2=value2"). This
                        argument can be used multiple times.
*  `--install-plugins` -     Install the necessary plugins for the given blueprint
*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure
*  `-p, --blueprint-path=BLUEPRINT_PATH` - 
                        The path to the application's blueprint file. (default:
                        blueprint.yaml)
*  `-i, --inputs=INPUTS` - 
                        Inputs for the deployment (Can be provided as wildcard
                        based paths (*.yaml, etc..) to YAML files, a JSON
                        string or as "key1=value1;key2=value2"). This argument
                        can be used multiple times. (default: inputs.yaml)
*  `--task-thread-pool-size=TASK_THREAD_POOL_SIZE` -
                        The size of the thread pool to execute tasks in
                        (default: 1)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` - 
                        How many seconds to wait before each task is retried
                        (default: 1)


### uninstall

Usage: `cfy local uninstall [options]`

Uninstall a blueprint.

#### Optional flags

*  `--allow-custom-parameters` -
                        Allow passing custom parameters (which were not
                        defined in the workflow's schema in the blueprint) to
                        the execution
*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure
*  `-w, --workflow=WORKFLOW` - 
                        The workflow to execute (default: uninstall)
*  `--parameters=PARAMETERS` -
                        Parameters for the workflow execution (Can be provided
                        as wildcard based paths (*.yaml, etc..) to YAML files,
                        a JSON string or as "key1=value1;key2=value2"). This
                        argument can be used multiple times.
*  `--task-thread-pool-size=TASK_THREAD_POOL_SIZE` -
                        The size of the thread pool to execute tasks in
                        (default: 1)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` - 
                        How many seconds to wait before each task is retried
                        (default: 1)


### init

Usage: `cfy local init [options] -p BLUEPRINT_PATH`

Initialize a working directory for the desired blueprint.

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the application's blueprint file.

#### Optional flags

* `--install-plugins` -    Install the necessary plugins for the given blueprint
*  `-i, --inputs=INPUTS` -
                        Inputs for the local workflow creation (Can be
                        provided as wildcard based paths (*.yaml, etc..) to
                        YAML files, a JSON string or as
                        "key1=value1;key2=value2"). This argument can be used
                        multiple times


### execute

Usage: `cfy local execute [options] -w WORKFLOW` 

Execute a workflow on the locally initialized blueprint.

#### Required flags

*  `-w, --workflow=WORKFLOW` - 
                        The workflow to execute

#### Optional flags

*  `--allow-custom-parameters` -
                        Allow passing custom parameters (which were not
                        defined in the workflow's schema in the blueprint) to
                        the execution
*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure
*  `--parameters=PARAMETERS` -
                        Parameters for the workflow execution (Can be provided
                        as wildcard based paths (*.yaml, etc..) to YAML files,
                        a JSON string or as "key1=value1;key2=value2"). This
                        argument can be used multiple times.
*  `--task-thread-pool-size=TASK_THREAD_POOL_SIZE` -
                        The size of the thread pool to execute tasks in
                        (default: 1)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` - 
                        How many seconds to wait before each task is retried
                        (default: 1)


### instances

Usage: `cfy local instances [--node-id=NODE_ID]`

Show the node-instances of the installed blueprint.

#### Optional flags

*  `--node-id=NODE_ID` -  Display node-instances only for this node


### outputs

Usage: `cfy local outputs` 

Show the outputs of the installed bluerprint


### install-plugins

Usage: `cfy local install-plugins -p BLUEPRINT_PATH`

Install plugins for a supplied blueprint.

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the desired blueprint


### create-requirements

Usage: `cfy local create-requirements -p BLUEPRINT_PATH`

Create a pip requirements.txt file for a specific blueprint.

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the desired blueprint

#### Optional flags

*  `-o, --output=REQUIREMENTS_OUTPUT` -
                        The local path for the requirements file


## Examples

Installing an application:

{{< gsHighlight  bash  >}}
$ cfy local install -p blueprint.yaml 
...

Initiated blueprint.yaml
If you make changes to the blueprint, run `cfy local init -p blueprint.yaml` again to apply them
2016-06-23 14:08:22 CFY <local> Starting 'install' workflow execution
2016-06-23 14:08:22 CFY <local> [host_35db1] Creating node
2016-06-23 14:08:23 CFY <local> [host_35db1] Configuring node
2016-06-23 14:08:23 CFY <local> [host_35db1] Starting node
2016-06-23 14:08:24 CFY <local> [http_web_server_e450e] Creating node
2016-06-23 14:08:24 CFY <local> [http_web_server_e450e.create] Sending task 'script_runner.tasks.run'
2016-06-23 14:08:24 CFY <local> [http_web_server_e450e.create] Task started 'script_runner.tasks.run'
2016-06-23 14:08:24 LOG <local> [http_web_server_e450e.create] INFO: Running WebServer locally on port: 8000
2016-06-23 14:08:24 LOG <local> [http_web_server_e450e.create] INFO: Setting `pid` runtime property: 7292
2016-06-23 14:08:24 CFY <local> [http_web_server_e450e.create] Task succeeded 'script_runner.tasks.run'
2016-06-23 14:08:24 CFY <local> [http_web_server_e450e] Configuring node
2016-06-23 14:08:25 CFY <local> [http_web_server_e450e] Starting node
2016-06-23 14:08:25 CFY <local> 'install' workflow execution succeeded

...
{{< /gsHighlight >}}
