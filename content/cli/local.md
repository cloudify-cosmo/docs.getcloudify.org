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
                        The path to the application'sblueprint file. (default:
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


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy local install -p simple-python-webserver-blueprint-master/blueprint.yaml
...

Initiated simple-python-webserver-blueprint-master/blueprint.yaml
If you make changes to the blueprint, run `cfy local init -p simple-python-webserver-blueprint-master/blueprint.yaml` again to apply them
2016-06-28 13:10:08 CFY <local> Starting 'install' workflow execution
2016-06-28 13:10:08 CFY <local> [host_31713] Creating node
.
.
.
2016-06-28 13:10:10 CFY <local> [http_web_server_17a88.create] Task succeeded 'script_runner.tasks.run'
2016-06-28 13:10:10 CFY <local> [http_web_server_17a88] Configuring node
2016-06-28 13:10:11 CFY <local> [http_web_server_17a88] Starting node
2016-06-28 13:10:11 CFY <local> 'install' workflow execution succeeded

...
{{< /gsHighlight >}}


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


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy local uninstall
...

2016-06-28 13:12:00 CFY <local> Starting 'uninstall' workflow execution
2016-06-28 13:12:00 CFY <local> [http_web_server_17a88] Stopping node
.
.
.
2016-06-28 13:12:02 CFY <local> [host_31713] Deleting node
2016-06-28 13:12:02 CFY <local> 'uninstall' workflow execution succeeded

...
{{< /gsHighlight >}}


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


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy local init -p simple-python-webserver-blueprint-master/blueprint.yaml 
...

Initiated simple-python-webserver-blueprint-master/blueprint.yaml
If you make changes to the blueprint, run `cfy local init -p simple-python-webserver-blueprint-master/blueprint.yaml` again to apply them

...
{{< /gsHighlight >}}


### execute

Usage: `cfy local execute [options] -w WORKFLOW` 

Executes a workflow on the locally initialized blueprint.

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


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy local execute -w install
...

2016-06-28 13:15:43 CFY <local> Starting 'install' workflow execution
2016-06-28 13:15:43 CFY <local> [host_2b306] Creating node
2016-06-28 13:15:43 CFY <local> [host_2b306] Configuring node
.
.
.
2016-06-28 13:15:45 CFY <local> [http_web_server_a622b.create] Task succeeded 'script_runner.tasks.run'
2016-06-28 13:15:45 CFY <local> [http_web_server_a622b] Configuring node
2016-06-28 13:15:46 CFY <local> [http_web_server_a622b] Starting node
2016-06-28 13:15:46 CFY <local> 'install' workflow execution succeeded

...
{{< /gsHighlight >}}


### instances

Usage: `cfy local instances --node-id=BLUEPRINT_ID`

Show the node-instances of the installed blueprint.

#### Required flags

*  `--node-id=NODE_ID` -  Display node-instances only for this node


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy local instances
...

[
  {
    "host_id": "host_2b306", 
    "id": "http_web_server_a622b", 
    "name": "http_web_server", 
    "node_id": "http_web_server", 
    "relationships": [
      {
        "target_id": "host_2b306", 
        "target_name": "host", 
        "type": "cloudify.relationships.contained_in"
      }
    ], 
    "runtime_properties": {
      "pid": 2470
    }, 
    "state": "started", 
    "version": 8
  }, 
  {
    "host_id": "host_2b306", 
    "id": "host_2b306", 
    "name": "host", 
    "node_id": "host", 
    "relationships": [], 
    "runtime_properties": {}, 
    "state": "started", 
    "version": 7
  }
]

...
{{< /gsHighlight >}}


### outputs

Usage: `cfy local outputs` 

Shows the outputs of the installed bluerprint


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy local outputs
...

{
  "http_endpoint": "http://localhost:8000"
}

...
{{< /gsHighlight >}}


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



&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy local create-requirements -p cloudify-hello-world-example-master/blueprint.yaml
...

https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.4.zip
https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.4.zip
https://github.com/cloudify-cosmo/cloudify-diamond-plugin/archive/1.3.3.zip
https://github.com/cloudify-cosmo/cloudify-diamond-plugin/archive/1.3.3.zip

...
{{< /gsHighlight >}}


## Examples

Installing an application:

{{< gsHighlight  markdown  >}}
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