---
title: CLI Reference
weight: 10
---

# agents

The `cfy agents` command is used to install Cloudify agents on existing deployments.

After restoring a manager on a new host using a snapshot, this will install new agents on the hosts for the new manager while also leaving the previous agents installed and running.

{% call c.note("Warning") %}
USE WITH CARE!

This should only be used in very specific cirumstances and should not be used in case:

* The same manager is upgraded using the `cfy upgrade` command.
* To install agents for deployments using an existing manager.
{% endcall %}


See [agents]({{ relRef("agents/overview.md") }}) for more information.


## Commands

### install

Usage: `cfy agents install [options]`

Install agents for all or for selected deployments.

#### Optional flags

*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        The ID of the deployment to install agents for. If
                        omitted, this will install agents for all deployments
*  `-l, --include-logs` -    Include logs in returned events

# blueprints

The `cfy blueprints` command is used to manage blueprints on a Cloudify manager.

You can use the command to upload, delete, download, validate and list blueprints and to retrieve information for a specific blueprint.


## Commands

### upload

Usage: `cfy blueprints upload [options] -b BLUEPRINT_ID`

Upload a blueprint to a manager.

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the application's blueprint file.
                        (default: blueprint.yaml)
*  `-b, --blueprint-id=BLUEPRINT_ID` - A user provided blueprint ID

#### Optional flags

*  `--validate` -           Validate the blueprint before uploading it to the
                        manager

&nbsp;
#### Example

```markdown
$ cfy blueprints upload -p simple-python-webserver-blueprint/blueprint.yaml -b simple
...

Uploading blueprint simple-python-webserver-blueprint/blueprint.yaml...
Blueprint uploaded. The blueprint's id is simple

...

$ cfy blueprints upload --validate -p simple-python-webserver-blueprint/blueprint.yaml -b simple
...

Validating blueprint: simple-python-webserver-blueprint/blueprint.yaml
Blueprint validated successfully
Uploading blueprint simple-python-webserver-blueprint/blueprint.yaml...
Blueprint uploaded. The blueprint's id is simple

...
```


### publish-archive

Usage: `cfy blueprints publish-archive [options] -b BLUEPRINT_ID`

Upload a blueprint archive to a manager. The difference between this and `upload` is that `upload` is done directly from a directory containing a blueprint, not a blueprint archive (e.g. `zip`, `tar.gz`).

#### Required flags

*  `-l, --archive-location=ARCHIVE_LOCATION` -
                        The path or URL to the application's blueprint archive
*  `-b, --blueprint-id=BLUEPRINT_ID` -
                        A user provided blueprint ID


#### Optional flags

*  `-n, --blueprint-filename=BLUEPRINT_FILENAME` -
                        The name of the archive's main blueprint file

&nbsp;
#### Example

```markdown
$ cfy blueprints publish-archive -l simple.tar.gz -b simple
...

Publishing blueprint archive from path simple.tar.gz...
Blueprint archive published. The blueprint's id is simple

...
```

### delete

Usage: `cfy blueprints delete -b BLUEPRINT_ID`

Delete a blueprint. It's important to note that deleting a blueprint does not mean deleting the deployments created from that blueprint and resources of those deployments.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` - A user provided blueprint ID

&nbsp;
#### Example

```markdown
$ cfy blueprints delete -b simple
...

Deleting blueprint simple...
Blueprint deleted

...
```


### download

Usage: `cfy blueprints download [options] -b BLUEPRINT_ID`

Download a blueprint from the manager.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` -
                        A user provided blueprint ID

#### Optional flags

*  `-o, --output=OUTPUT` -
                        The local path of the downloaded blueprint

&nbsp;
#### Example

```markdown
$ cfy blueprints download -b simple
...

Downloading blueprint simple...
Blueprint downloaded as simple.tar.gz

...
```


### validate

Usage: `cfy blueprints validate -p BLUEPRINT_PATH`

Validate a blueprint. This checks that the blueprint's syntax is valid and that all imports are accessible.

{% call c.note("Note") %}
Import validation is done only on the client side. That means that if, for some reason, the imports are accessible by the client but not on the manager, this validation will still pass.
{% endcall %}

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH`
                        The path to the application's blueprint file.
                        (default: blueprint.yaml)

&nbsp;
#### Example

```markdown
$ cfy blueprints validate -p simple-python-webserver-blueprint/blueprint.yaml
...

Validating blueprint: simple-python-webserver-blueprint/blueprint.yaml
Blueprint validated successfully

...
```

### list

Usage: `cfy blueprints list`

List all existing blueprints.

&nbsp;
#### Example

```markdown
$ cfy blueprints list
...

Listing all blueprints...

Available blueprints:
+------------+----------------------+------------------------+----------------------------+----------------------------+
|     id     |     description      |     main_file_name     |         created_at         |         updated_at         |
+------------+----------------------+------------------------+----------------------------+----------------------------+
| nodecellar | This blueprint ins.. | aws-ec2-blueprint.yaml | 2016-06-27 10:30:37.698852 | 2016-06-27 10:30:37.698852 |
|   simple   | This blueprint dep.. |     blueprint.yaml     | 2016-06-27 10:41:07.374311 | 2016-06-27 10:41:07.374311 |
+------------+----------------------+------------------------+----------------------------+----------------------------+

...
```

### get

Usage: `cfy blueprints get -b BLUEPRINT_ID`

Retrieve information for a single blueprint.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` -
                        A user provided blueprint ID

&nbsp;
#### Example

```markdown
$ cfy blueprints get -b simple
...

Retrieving blueprint simple...

Blueprint:
+--------+----------------+----------------------------+----------------------------+--------------+
|   id   | main_file_name |         created_at         |         updated_at         | #deployments |
+--------+----------------+----------------------------+----------------------------+--------------+
| simple | blueprint.yaml | 2016-06-27 10:41:07.374311 | 2016-06-27 10:41:07.374311 |      1       |
+--------+----------------+----------------------------+----------------------------+--------------+

Description:
This blueprint deploys a simple web site


Existing deployments:
["simple_website"]

...
```

### inputs

Usage: `cfy blueprints inputs -b BLUEPRINT_ID`

Lists all inputs for a blueprint. Note that not every blueprint has inputs.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` -
                        A user provided blueprint ID

&nbsp;
#### Example

```markdown
$ cfy blueprints inputs -b simple
...

Retrieving inputs for blueprint simple...

Inputs:
+----------------+------+-----------+---------------------------+
|      name      | type |  default  |        description        |
+----------------+------+-----------+---------------------------+
| webserver_port |  -   |    8000   | The HTTP web server port. |
|                |      |           |                           |
|    host_ip     |  -   | localhost |             -             |
+----------------+------+-----------+---------------------------+

...
```
# bootstrap

The `cfy bootstrap` command is used to bootstrap Cloudify manager.

{% call c.note("Note") %}
After bootstrapping a manager, the user and ssh-key provided to use it will be used to perform ssh related commands (e.g. `cfy logs`, `cfy ssh`) are saved on the machine which performed the bootstrap process. Running `cfy use` to control another manager will remove those settings and will NOT set the user and ssh-key to the manager you ran `cfy use` on.
{% endcall %}

See [bootstrapping]({{ relRef("manager/bootstrapping.md") }}) for more information.


Usage: `cfy bootstrap [options] -p BLUEPRINT_PATH`

Bootstrap Cloudify manager.

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the desired manager blueprint

#### Optional flags

*  `--task-thread-pool-size TASK_THREAD_POOL_SIZE` -
                        The size of the thread pool to execute tasks in
                        (default: 1)
*  `--install-plugins` -    Install the necessary plugins for the given blueprint
*  `--keep-up-on-failure` - Do not teardown the Manager even if the bootstrap
                        fails
*  `--validate-only` -     Validate without actually performing the bootstrap -
                        process
*  `--skip-validations` -   Bootstrap the manager without validating resources -
*  `-i, --inputs=INPUTS` -
                        Inputs for a Manager blueprint (Can be provided as
                        wildcard based paths (*.yaml, etc..) to YAML files, a
                        JSON string or as "key1=value1;key2=value2"). This
                        argument can be used multiple times.
*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure (default: 5)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` -
                        How many seconds to wait before each task is retried
                        (default: 30)

&nbsp;
#### Example

```markdown
$ cfy bootstrap --install-plugins -p aws-ec2-manager-blueprint.yaml -i aws-ec2-manager-blueprint-inputs.yaml
...

Executing bootstrap validation...
Collecting https://github.c
.
.
.
Bootstrap validation completed successfully
Executing manager bootstrap...
.
.
.
Processing inputs source: aws-ec2-manager-blueprint-inputs.yaml
2016-06-27 08:53:00 CFY <manager> Starting 'install' workflow execution
.
.
.
2016-06-27 09:04:21 CFY <manager> 'execute_operation' workflow execution succeeded
Bootstrap complete

...
```

# deployments

The `cfy deployments` command is used to manage running deployments on a Cloudify manager.

You can use the command to create, delete, update and list deployments and to show the outputs for a specific deployment.


## Commands

### create

Usage: `cfy deployments create [options] -d DEPLOYMENT_ID -b BLUEPRINT_ID`

Start an workflow execution for a specific deployment

#### Required flags

*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        A unique ID for the deployment
*  `-b, --blueprint-id=BLUEPRINT_ID` -
                        The blueprint's ID for which to create the deployment

#### Optional flags

*  `-i, --inputs=INPUTS` -
                        Inputs for the deployment (Can be provided as wildcard
                        based paths (*.yaml, etc..) to YAML files, a JSON
                        string or as "key1=value1;key2=value2"). This argument
                        can be used multiple times.


&nbsp;
#### Example

```markdown
$ cfy deployments create -d simple_website -b simple
...

Creating new deployment from blueprint simple...
Deployment created. The deployment's id is simple_website

...
```

### update

Usage: `cfy deployments update [options] -d DEPLOYMENT_ID`

Retrieve information on a single execution.

#### Required flags

*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        The id of the deployment to update

#### Optional flags

*  `-n, --blueprint-filename=BLUEPRINT_FILENAME` -
                        The name of the archive's main blueprint file.
                        (default: blueprint.yaml)
*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the application's blueprint file.
                        (default: blueprint.yaml)
*  `-l, --archive-location=ARCHIVE_LOCATION` -
                        The path or URL to the application's blueprint archive
*  `--json` -               Output events in a consumable JSON format
*  `--skip-install` -       Skip install lifecycle operations
*  `--include-logs` -       Include logs in returned events
*  `-w, --workflow=WORKFLOW` -
                        A workflow to execute instead of update
*  `-f, --force` -          Force running update in case a previous update on this
                        deployment has failed to finished successfully
*  `-i, --inputs=INPUTS` -
                        Inputs file/string for the deployment creation (Can be
                        provided as wildcard based paths (*.yaml, etc..) to
                        YAML files, a JSON string or as
                        "key1=value1;key2=value2"). This argument can be used
                        multiple times. (default: inputs.yaml)
*  `--skip-uninstall` -      Skip uninstall lifecycle operations

&nbsp;
#### Example

```markdown
$ cfy deployments update -d nodecellar -p nodecellar-blueprint/aws-ec2-blueprint.yaml
...

Updating deployment nodecellar using blueprint nodecellar-blueprint/aws-ec2-blueprint.yaml
2016-06-27T11:40:08 CFY <nodecellar> Starting 'update' workflow execution
2016-06-27T11:40:09 CFY <nodecellar> 'update' workflow execution succeeded
Finished executing workflow 'update' on deployment 'nodecellar'
Successfully updated deployment nodecellar. Deployment update id: nodecellar-6521e3ef-829f-4874-9ecf-ef388cc09212. Execution id: 26a9f8a8-f09f-468f-a46a-f64de4a31070

...
```

### delete

Usage: `cfy deployments delete [options] -d DEPLOYMENT_ID`

Delete an existing deployment. It's important to note that deleting a deployment does not mean deleting the resources of an application - for which you need to run the `uninstall` workflow (unless a custom uninstall workflow is provided).

#### Required flags

*  `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment to delete

#### Optional flags

*  `-f, --ignore-live-nodes` - Delete the deployment even if there are existing live resources for that deployment

&nbsp;
#### Example

```markdown
$ cfy deployments delete -d simple_website
...

Deleting deployment simple_website...
Deployment deleted

...
```

### list

Usage: `cfy deployments list -b BLUEPRINT_ID`

List all existing deployment for a blueprint.

#### Required flags

*  `-b, --blueprint-id BLUEPRINT_ID` - The ID of the blueprint you would like to list deployments for


&nbsp;
#### Example

```markdown
$ cfy deployments list -b simple
...

Listing deployments for blueprint simple...

Deployments:
+-------------------+--------------+----------------------------+----------------------------+
|         id        | blueprint_id |         created_at         |         updated_at         |
+-------------------+--------------+----------------------------+----------------------------+
|   simple_website  |    simple    | 2016-06-27 10:42:58.682240 | 2016-06-27 10:42:58.682240 |
|  simple_website_2 |    simple    | 2016-06-27 11:50:34.130098 | 2016-06-27 11:50:34.130098 |
+-------------------+--------------+----------------------------+----------------------------+

...
```

### outputs

Usage: `cfy deployments outputs [options] -d DEPLOYMENT_ID`

Lists all outputs for a deployment. Note that not every deployment has outputs and it depends on whether or not outputs were defined in the blueprint from which the deployment was created

#### Required flags

* `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment you would like to list outputs for

&nbsp;
#### Example

```markdown
$ cfy deployments outputs -d simple_website
...

Retrieving outputs for deployment simple_website...
 - "http_endpoint":
     Description: Web server external endpoint
     Value: http://localhost:8000

...
```
# dev

The `cfy dev` command is used to run [fabric](http://www.fabfile.org/) tasks on a Cloudify manager via SSH.

This supplies an easy way to run personalized, complex ssh scripts on the manager without having to manually connect to it.

{% call c.note("Note") %}
The tasks don't have to be decorated with the ``@task`` decorator as they're directly called from the cli's code just like any other python function. Also, as fabric is one of the cli's dependencies, you don't have to install it separately unless you're using the cli as a binary in which case you'll have to install fabric yourself.
{% endcall %}

For instance, you could write a task that deploys and upgrades a monitoring agent you use to monitor your systems. During that manager's lifecycle, you could rerun the same task to update that agent.


Usage: `cfy dev [options] -p TASKS_FILE -t TASK`

Run fabric tasks on the manager.

#### Required flags

*  `-t, --task=TASK` -  The name of fabric task to run
*  `-p, --tasks-file=TASKS_FILE` -
                        The path to the tasks file

#### Optional flags

*  `-a ..., --args ...` -    Arguments for the fabric task


## Examples

```markdown
$ cfy dev --tasks-file my_tasks.py -v -t my_task -a --arg1=something --arg2=otherthing ...
$ cfy dev -v -t my_task -a arg1_value arg2_value ...
...
```

``--tasks-file my_tasks.py`` can be omitted if a ``tasks.py`` file exists in your current working directory.

So for instance, if you want to echo ``something`` in your currently running manager, all you have to do is supply a ``tasks.py`` file with the following:

```python
from fabric.api import run

def echo(text):
  run('echo {0}'.format(text))
```

```markdown
$ cfy dev -t echo -a something
```

Cloudify provides a tasks [repo](https://github.com/cloudify-cosmo/cloudify-cli-fabric-tasks) from which users can obtain tasks and to which developers should contribute for the benefit of all.---

# events

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

&nbsp;
#### Example

```markdown
cfy events list -e 26a9f8a8-f09f-468f-a46a-f64de4a31070
...

Listing events for execution id 26a9f8a8-f09f-468f-a46a-f64de4a31070 [include_logs=False]
2016-06-27T11:40:08 CFY <nodecellar> Starting 'update' workflow execution
2016-06-27T11:40:09 CFY <nodecellar> 'update' workflow execution succeeded

Total events: 2

...
```

# executions

The `cfy executions` command is used to manage workflow executions on a Cloudify manager.

You can use the command to start, cancel and and list executions and to retrieve information on a single execution.


## Commands

### start

Usage: `cfy executions start [options] -d DEPLOYMENT_ID -w WORKFLOW`

Start an workflow execution for a specific deployment

#### Required flags

* `-d, --deployment-id=DEPLOYMENT_ID`
                        The deployment ID to execute the workflow on
* `-w, --workflow=WORKFLOW`
                        The workflow to execute

#### Optional flags

* `--allow-custom-parameters` -
                        Allow passing custom parameters (which were not
                        defined in the workflow's schema in the blueprint) to
                        the execution

* `-p, --parameters=PARAMETERS` -
                        Parameters for the workflow execution (Can be provided
                        as wildcard based paths (*.yaml, etc..) to YAML files,
                        a JSON string or as "key1=value1;key2=value2"). This
                        argument can be used multiple times.
* `-f, --force` -          Execute the workflow even if there is an ongoing
                        execution for the given deployment
* `--timeout=TIMEOUT` -     Operation timeout in seconds (The execution itself
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

Usage: `cfy executions cancel [options] -e EXECUTION_ID`

Cancel a running execution.

#### Required flags

* `-e, --execution-id=EXECUTION_ID` - The ID of the execution to cancel

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

Lists all executions for a deployment.

#### Optional flags

* `-d, --deployment-id=DEPLOYMENT_ID` - The deployment ID to list executions for
* `--system-workflows` - Include executions of system workflows


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

Usage: `cfy executions get [options] -e EXECUTION_ID`

Retrieve information on a single execution.

#### Required flags

* `-e, --execution-id=EXECUTION_ID` - The ID of the execution to get

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

# groups

The `cfy groups` command is used to view information on the different groups of a deployment.

You can use the command to list all groups.


## Commands


### list

Usage: `cfy groups list -d DEPLOYMENT_ID`

Lists all groups for a deployment.

#### Required flags

* `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment to list groups for


&nbsp;
#### Example

```markdown
$ cfy groups list -d hello_world
...

Listing groups for deployment hello_world...
No groups defined for deployment hello_world

...
```

# install

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

# local

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


&nbsp;
#### Example

```markdown
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
```


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

```markdown
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
```


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

```markdown
$ cfy local init -p simple-python-webserver-blueprint-master/blueprint.yaml
...

Initiated simple-python-webserver-blueprint-master/blueprint.yaml
If you make changes to the blueprint, run `cfy local init -p simple-python-webserver-blueprint-master/blueprint.yaml` again to apply them

...
```


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


&nbsp;
#### Example

```markdown
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
```


### instances

Usage: `cfy local instances [--node-id=NODE_ID]`

Show the node-instances of the installed blueprint.

#### Optional flags

*  `--node-id=NODE_ID` -  Display node-instances only for this node


&nbsp;
#### Example

```bash
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
```


### outputs

Usage: `cfy local outputs`

Show the outputs of the installed bluerprint


&nbsp;
#### Example

```markdown
$ cfy local outputs
...

{
  "http_endpoint": "http://localhost:8000"
}

...
```


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

```markdown
$ cfy local create-requirements -p cloudify-hello-world-example-master/blueprint.yaml
...

https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.4.zip
https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.4.zip
https://github.com/cloudify-cosmo/cloudify-diamond-plugin/archive/1.3.3.zip
https://github.com/cloudify-cosmo/cloudify-diamond-plugin/archive/1.3.3.zip

...
```


## Examples

Installing an application:

```markdown
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
```

# logs

The `cfy logs` command is used to manage log files on a Cloudify manager.

You can use the command to download, backup and purge a manager's service logs.

To use the command you must have the credentials (user and key) set in the local context and must `cfy use -t MANAGEMENT_IP` prior to running the command.


## Commands

### backup

Usage: `cfy logs backup`

Create a backup of all log files on the manager stored under `/var/log/cloudify` and the output of `journalctl` and stores them under `/var/log/cloudify-manager-logs_MANAGER_DATE_MANAGER_IP.tar.gz`

&nbsp;
#### Example

```markdown
$ cfy logs backup
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20160628T125946_52.31.106.71.tar.gz
Backing up manager logs to /var/log/cloudify-manager-logs_20160628T125946_52.31.106.71.tar.gz

...
```

### download

Usage: `cfy logs download [options]`

Create an archive containing the manager's logs and download them. The output file will contain the same content as with `cfy logs backup`.

#### Optional flags

* `-o, --output=OUTPUT_PATH` - The output path for the downloaded file.

&nbsp;
#### Example

```markdown
$ cfy logs download
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20160623T070559_10.10.1.10.tar.gz
Downloading archive to: /home/nir0s/work/local-bootstrap-env
Removing archive from manager...

...
```



### purge

Usage: `cfy logs purge [options] -f`

Purge all log files on the manager.

#### Required flags

* `-f, --force` - This flag is mandatory to perform the purge.

#### Optional flags

* `--backup-first` - Executes a `cfy logs backup` first.

{% call c.note("Warning") %}
USE WITH CARE! Log files in Cloudify manager are rotated. `cfy purge` is a safety measure in case disk space on the manager runs out for some reason and thus it should only be used in extreme situations.
{% endcall %}


&nbsp;
#### Example

```markdown
$ cfy logs purge -f --backup-first
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20160628T130258_52.31.106.71.tar.gz
Backing up manager logs to /var/log/cloudify-manager-logs_20160628T130258_52.31.106.71.tar.gz
Purging manager logs...

...
```

# maintenance-mode

The `cfy maintenance-mode` command is used to restrict REST access to the manager.

This is required, for instance, when upgrading a manager via the `cfy upgrade` or `cfy rollback` commands.

Putting the manager in maintenance-mode prevents it from running any executions.

See [maintenance-mode]({{ relRef("manager/maintenance-mode.md") }}) for more information.


## Commands

### activate

Usage: `cfy maintenance-mode activate [options]`

Enter maintenance-mode on the manager rejecting further REST requests.

#### Optional flags

* `--wait=false` - Wait until there are no running executions and automatically activate maintenance-mode
* `--timeout=SECONDS` - Operation timeout in seconds (The execution itself will keep going, but the CLI will stop waiting for it to terminate.)

&nbsp;
#### Example

```markdown
$ cfy maintenance-mode activate
...

Entering maintenance mode...
Run 'cfy maintenance-mode status' to check the maintenance mode's status.

...
```


### deactivate

Usage: `cfy maintenance-mode deactivate`

Deactivate maintenance-mode on the manager to accept REST requests.

&nbsp;
#### Example

```markdown
$ cfy maintenance-mode deactivate
...

Turning off maintenance mode...
Maintenance mode is off.

...
```


### status

Usage: `cfy maintenance-mode status`

Retrieve the current maintenance-mode status.

&nbsp;
#### Example

```markdown
$ cfy maintenance-mode deactivate
...

Maintenance Mode Status:
	Status:	activated
	Activated At:	2016-06-29 05:48:23.898008
	Activation Requested At:	2016-06-29 05:48:11.833297

INFO - Cloudify Manager is currently in maintenance mode. Most requests will be blocked.

...
```

# node-instances

The `cfy node-instances` command is used to view information on the different node-instances of a deployment.

You can use the command to list the node-instances of a specific deployment or of all deployments and to retrieve information on a single node-instance.


## Commands

### list

Usage: `cfy node-instances list`

List node-instances.

#### Optional flags

*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        The ID of the deployment to list node-instances for.
                        If omitted, this will list node-instances for all
                        deployments


&nbsp;
#### Example

```markdown
$ cfy node-instances list
...

Listing all instances...

Instances:
+-----------------------+-------------------------------------+------------+-----------------+----------+
|           id          |            deployment_id            |  host_id   |     node_id     |  state   |
+-----------------------+-------------------------------------+------------+-----------------+----------+
|        vm_eb405       | cloudify-hello-world-example-master |  vm_eb405  |        vm       | started  |
| http_web_server_ce97d |            simple_website           | host_130e9 | http_web_server | creating |
|  security_group_e07d0 | cloudify-hello-world-example-master |    None    |  security_group | started  |
|    elastic_ip_f6edf   | cloudify-hello-world-example-master |    None    |    elastic_ip   | started  |
|       host_130e9      |            simple_website           | host_130e9 |       host      | started  |
| http_web_server_30b1d | cloudify-hello-world-example-master |  vm_eb405  | http_web_server | started  |
+-----------------------+-------------------------------------+------------+-----------------+----------+

...
```

### get

Usage: `cfy node-instances get --node-instance-id NODE_INSTANCE_ID`

Retrieve information for a single node-instance.

#### Required flags

*  `--node-instance-id=NODE_INSTANCE_ID` -
                        The ID of the node-instance to get

&nbsp;
#### Example

```markdown
$ cfy node-instances get --node-instance-id elastic_ip_f6edf
...

Retrieving node instance elastic_ip_f6edf

Instance:
+------------------+-------------------------------------+---------+------------+---------+
|        id        |            deployment_id            | host_id |  node_id   |  state  |
+------------------+-------------------------------------+---------+------------+---------+
| elastic_ip_f6edf | cloudify-hello-world-example-master |   None  | elastic_ip | started |
+------------------+-------------------------------------+---------+------------+---------+

Instance runtime properties:
	instance_id: i-9a314816
	vpc_id: vpc-fbddd89e
	aws_resource_id: 52.18.204.246
	allocation_id: eipalloc-2955194c

...
```
# nodes

The `cfy nodes` command is used to view information on the different nodes of a deployment.

You can use the command to list all nodes and get information on a single node.


## Commands


### list

Usage: `cfy nodes list`

Lists all nodes

#### Optional flags

* `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment to list nodes for. If omitted, this will list nodes for all deployments

&nbsp;
#### Example

```markdown
$ cfy nodes list
...

Listing all nodes...

Nodes:
+-----------------+-------------------------------------+-------------------------------------+---------+----------------------------------+---------------------+-----------------------------+
|        id       |            deployment_id            |             blueprint_id            | host_id |               type               | number_of_instances | planned_number_of_instances |
+-----------------+-------------------------------------+-------------------------------------+---------+----------------------------------+---------------------+-----------------------------+
|       host      |            simple_website           |                simple               |   host  |      cloudify.nodes.Compute      |          1          |              1              |
| http_web_server | cloudify-hello-world-example-master | cloudify-hello-world-example-master |    vm   |     cloudify.nodes.WebServer     |          1          |              1              |
|    elastic_ip   | cloudify-hello-world-example-master | cloudify-hello-world-example-master |   None  |   cloudify.aws.nodes.ElasticIP   |          1          |              1              |
| http_web_server |            simple_website           |                simple               |   host  |     cloudify.nodes.WebServer     |          1          |              1              |
|  security_group | cloudify-hello-world-example-master | cloudify-hello-world-example-master |   None  | cloudify.aws.nodes.SecurityGroup |          1          |              1              |
|        vm       | cloudify-hello-world-example-master | cloudify-hello-world-example-master |    vm   |   cloudify.aws.nodes.Instance    |          1          |              1              |
+-----------------+-------------------------------------+-------------------------------------+---------+----------------------------------+---------------------+-----------------------------+

...

$ cfy nodes list -d simple_website
...

Listing nodes for deployment simple_website...

Nodes:
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+
|        id       | deployment_id  | blueprint_id | host_id |           type           | number_of_instances | planned_number_of_instances |
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+
|       host      | simple_website |    simple    |   host  |  cloudify.nodes.Compute  |          1          |              1              |
| http_web_server | simple_website |    simple    |   host  | cloudify.nodes.WebServer |          1          |              1              |
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+

...
```


### get

Usage: `cfy nodes get [options] -d DEPLOYMENT_ID --node-id NODE_ID`

Retrieve information on a single execution.

#### Required flags

*  `--node-id=NODE_ID` -    The node's ID
*  `-d, --deployment-id=DEPLOYMENT_ID` - The deployment ID to which the node is related

&nbsp;
#### Example

```markdown
$ cfy nodes get -d simple_website --node-id http_web_server
...

Retrieving node http_web_server for deployment simple_website

Node:
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+
|        id       | deployment_id  | blueprint_id | host_id |           type           | number_of_instances | planned_number_of_instances |
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+
| http_web_server | simple_website |    simple    |   host  | cloudify.nodes.WebServer |          1          |              1              |
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+

Node properties:
	port: 8000

Node instance IDs:
	http_web_server_ce97d

...
```
# plugins

The `cfy plugins` command is used to manage plugins stored on a Cloudify manager.

You can use the command to upload, download, delete and list plugins and also to get information on a specific plugin.

A Cloudify plugin is an archive created by [wagon]({{ relRef("http://github.com/cloudify-cosmo/wagon") }}).

See [plugins]({{ relRef("plugins/overview.md") }}) for more information.


## Commands

### upload

Usage: `cfy plugins upload -p PLUGIN_FILE`

Upload a plugin to the manager.

#### Required flags

* `-p, --plugin-path=PLUGIN_FILE` - The path to the Cloudify plugin (`.wgn` file) you would like to upload.

{% call c.note("Note") %}
Wagon (via the `--format` flag) allows to create archives in both `tar.gz` and `zip` formats. Cloudify only supports wagon in the `tar.gz` format.
{% endcall %}


&nbsp;
#### Example

```markdown
$ cfy plugins upload -p cloudify_script_plugin-1.2-py27-none-any-none-none.wgn
...

Validating plugin cloudify_script_plugin-1.2-py27-none-any-none-none.wgn...
Plugin validated successfully
Uploading plugin cloudify_script_plugin-1.2-py27-none-any-none-none.wgn
Plugin uploaded. The plugin's id is 965d1984-3ef1-485d-9e04-4c3f8cea11df

...
```


### download

Usage: `cfy plugins download [options] -p PLUGIN_ID`

Download a plugin archive from the manager.

#### Required flags

*  `-p, --plugin-id=PLUGIN_ID` - The ID of the plugin you would like to download.

#### Optional flags

* `-o, --output=OUTPUT_PATH` - The output path for the downloaded file.


&nbsp;
#### Example

```markdown
$ cfy plugins download -p 965d1984-3ef1-485d-9e04-4c3f8cea11df
...

Downloading plugin 965d1984-3ef1-485d-9e04-4c3f8cea11df...
Plugin downloaded as 965d1984-3ef1-485d-9e04-4c3f8cea11df.tar.gz

...
```


### delete

Usage: `cfy plugins delete [options] -s SNAPSHOT_ID`

Delete a snapshot from the manager.

#### Required flags

* `-p, --plugin-id=PLUGIN_ID` - The ID of the plugin you would like to delete.

#### Optional flags

*  `-f, --force` - Delete a plugin even if there is a deployment which is currently using it.


&nbsp;
#### Example

```markdown
$ cfy plugins delete -p 965d1984-3ef1-485d-9e04-4c3f8cea11df
...

Deleting plugin 965d1984-3ef1-485d-9e04-4c3f8cea11df...
Plugin deleted

...
```


### list

Usage: `cfy plugins list`

List all available plugins on the manager.
You can use this command to get the IDs of the plugins you would like to download or delete.


&nbsp;
#### Example

```markdown
$ cfy plugins list
...

Listing all plugins...

Plugins:
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+
|                  id                  |      package_name      | package_version | supported_platform | distribution | distribution_release |        uploaded_at         |
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+
| 965d1984-3ef1-485d-9e04-4c3f8cea11df | cloudify-script-plugin |       1.2       |        any         |     None     |         None         | 2016-06-29 07:38:46.547302 |
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+

...
```


### get

Usage: `cfy plugins get -p PLUGIN_ID`

Retrieve information on a single plugin.

#### Required flags

* `-p, --plugin-id=PLUGIN_ID` - The ID of the plugin you would like to retrieve information for.


&nbsp;
#### Example

```markdown
$ cfy plugins get -p 965d1984-3ef1-485d-9e04-4c3f8cea11df
...

Retrieving plugin 965d1984-3ef1-485d-9e04-4c3f8cea11df...

Plugin:
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+
|                  id                  |      package_name      | package_version | supported_platform | distribution | distribution_release |        uploaded_at         |
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+
| 965d1984-3ef1-485d-9e04-4c3f8cea11df | cloudify-script-plugin |       1.2       |        any         |     None     |         None         | 2016-06-29 07:38:46.547302 |
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+

...
```
# recover

{% call c.note("Warning") %}
`cfy recover` currently works only on openstack! The command will run the `heal` workflow to recover the manager.
{% endcall %}


The `cfy recover` command is used to recover a manager to a previous state using a manager snapshot.

Usage: `cfy recover [options] -s SNAPSHOT_PATH`

Recover the manager using the provided snapshot.

#### Required flags

*  `-s, --snapshot-path SNAPSHOT_PATH` - The local path to the snapshot you would like to use for the restoration process.
*  `-f, --force` -          Force recovery. This flag is mandatory

#### Optional flags

*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure (default: 5)
*  `--task-thread-pool-size=TASK_THREAD_POOL_SIZE` -
                        The size of the thread pool to execute tasks in
                        (default: 1)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` -
                        How many seconds to wait before each task is retried
                        (default: 30)

&nbsp;
#### Example

```markdown
$ cfy recover -f -s first_snapshot.zip
...

Recovering manager...
2016-06-29 08:58:56 CFY <manager> Starting 'heal' workflow execution
2016-06-29 08:58:56 LOG <manager> INFO: Starting 'heal' workflow on manager_configuration_ad180, Diagnosis: Not provided
2016-06-29 08:58:56 CFY <manager> [webui_ef68c] Stopping node
.
.
.
2016-06-29 08:59:16 LOG <manager> [elasticsearch_8d1cf.stop] INFO: Stopping systemd service elasticsearch...
2016-06-29 08:59:16 CFY <manager> [elasticsearch_8d1cf.stop] Task succeeded 'fabric_plugin.tasks.run_script'
2016-06-29 08:59:17 CFY <manager> [rabbitmq_023a2] Deleting node
2016-06-29 08:59:17 CFY <manager> [python_runtime_5fdfd] Deleting node
.
.
.
2016-06-29 09:11:06 CFY <manager> 'heal' workflow execution succeeded
[52.31.106.71] put: /home/ubuntu/.ssh/cloudify-agent-kp.pem -> /root/.ssh/agent_key.pem
Uploading snapshot 'first_snapshot.zip' to management server 52.31.106.71 as restored-snapshot
Restoring snapshot 'restored-snapshot'...
Successfully restored snapshot restored-snapshot
Manager recovered successfully

...
```
# rollback

The `cfy rollback` command is used to rollback a manager to the previous version of Cloudify.

{% call c.note("Note") %}
You can only rollback to the version of Cloudify installed before the last `cfy upgrade`.
{% endcall %}

See [manager upgrade]({{ relRef("manager/upgrade.md") }}) for more information.


Usage: `cfy rollback [options] -p BLUEPRINT_PATH`

Rollback a manager to a previous version.

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the desired simple manager blueprint

#### Optional flags

*  `--install-plugins` -    Install the necessary plugins for the given blueprint
*  `-i, --inputs=INPUTS` - The required inputs for running the upgrade process
*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure (default: 5)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` -
                        How many seconds to wait before each task is retried
                        (default: 30)

# snapshots

The `cfy snapshots` command is used to manage data snapshots of a Cloudify manager.

You can use the command to create, upload, download, delete and list snapshots and also to restore a manager using a snapshot archive.

See [snapshots]({{ relRef("manager/snapshots.md") }}) for more information.


## Commands

### create

Usage: `cfy snapshots create [options] -s SNAPSHOT_ID`

Create a snapshot of the manager.

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - A user provided snapshot ID

#### Optional flags

* `--exclude-credentials` - Do not store credentials in the snapshot
* `--include-metrics` - Include metrics data in the snapshot


&nbsp;
#### Example

```markdown
$ cfy snapshots create -s first_snapshot
...

Creating snapshot first_snapshot...
Started workflow execution. The execution's id is 7ac570fd-835f-4cb0-bc23-42f8510710dd

...
```

### delete

Usage: `cfy snapshots delete [options] -s SNAPSHOT_ID`

Delete a snapshot from the manager.

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot


&nbsp;
#### Example

```markdown
$ cfy snapshots delete -s first_snapshot
...

Deleting snapshot first_snapshot...
Snapshot deleted successfully

...
```

### download

Usage: `cfy snapshots download [options] -s SNAPSHOT_ID`

Download a snapshot from the manager.

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot

#### Optional flags

* `-o, --output=OUTPUT_PATH` - The output path for the downloaded file


&nbsp;
#### Example

```markdown
$ cfy snapshots download -s first_snapshot
,,,

Downloading snapshot first_snapshot...
Snapshot downloaded as first_snapshot.zip

...
```


### list

Usage: `cfy snapshots list`

List all available snapshots on the manager.


&nbsp;
#### Example

```markdown
$ cfy snapshots list
...

Listing snapshots...

Snapshots:
+----------------+----------------------------+---------+-------+
|       id       |         created_at         |  status | error |
+----------------+----------------------------+---------+-------+
| first_snapshot | 2016-06-29 08:22:27.673799 | created |       |
+----------------+----------------------------+---------+-------+

...
```


### restore

Usage: `cfy snapshots restore [options] -s SNAPSHOT_ID`

Restore a newly bootstrapped manager using a snapshot archive

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot

#### Optional flags

* `-f, --force` - Force restoring the snapshot on a Manager with existing blueprints or deployments
* `--without-deployments-envs` - Restore a snapshot (excluding existing deployments)


nbsp;
#### Example

```markdown
$ cfy snapshots restore -s first_snapshot
...

Restoring snapshot first_snapshot...
Started workflow execution. The execution's id is 96d826cb-8958-43b5-845d-34ce77291a21

...
```


### upload

Usage: `cfy snapshots upload -p SNAPSHOT_FILE -s SNAPSHOT_ID`

#### Required flags

* `-s, --snapshot-id=SNAPSHOT_ID` - The ID of the snapshot
* `-p, --snapshot-path=SNAPSHOT_FILE` - The local path of the snapshot to upload


&nbsp;
#### Example

```markdown
$ cfy snapshots upload -p first_snapshot.zip -s first_snapshot
...

Uploading snapshot first_snapshot.zip...
Snapshot uploaded. The snapshot's id is first_snapshot

...
```
# ssh

The `cfy ssh` command is used to connect to a Cloudify manager via SSH.

You can use the command to create a new terminal session, run a command or connect to a shared tmux based session.


Usage: `cfy ssh [options]`

Connect to a manager via SSH

#### Optional flags

* `-c, --command=COMMAND` - Execute a command over SSH
* `--sid=SESSION_ID` - Joins an SSH tmux session
* `-l, --list` - Lists available SSH tmux sessions
* `--host` - Hosts an SSH tmux session

&nbsp;
#### Example

```markdown
$ cfy ssh
...

Connecting to centos@52.31.106.71...
Last login: Wed Jun 29 07:55:53 2016 from 52.30.34.244
[centos@ip-172-31-46-107 ~]$

...
```
# status

The `cfy status` command is used to print out the status of a running manager.

To use the command you must `cfy use -t MANAGEMENT_IP` first.


Usage: `cfy status`

Show a list of the services running on the manager, whether it is in maintenance-mode or not and its REST protocol.


&nbsp;
#### Example

```markdown
$ cfy status
...

Retrieving manager services status... [ip=52.31.106.71]

Services:
+--------------------------------+---------+
|            service             |  status |
+--------------------------------+---------+
| InfluxDB                       | running |
| Celery Management              | running |
| Logstash                       | running |
| RabbitMQ                       | running |
| AMQP InfluxDB                  | running |
| Manager Rest-Service           | running |
| Cloudify UI                    | running |
| Webserver                      | running |
| Riemann                        | running |
| Elasticsearch                  | running |
+--------------------------------+---------+

...
# teardown

The `cfy teardown` command is used to teardown a manager and all resources attached to it.

{% call c.note("Note") %}
The teardown process will remove the manager VM and any security groups, ip addresses, key pairs which were provisioned during the bootstrap process. It's important to note that if you used the simple-manager-blueprint to bootstrap a manager, no resources will be deleted but the manager will become non-functional after tearing it down.
{% endcall %}


Usage: `cfy teardown [options] -f`

Teardown a manager.

#### Required flags

* `-f, --force` - This flag is mandatory to perform the teardown. Note that if there are running deployments on the manager, the `--ignore-deployments` flag must also be passed to perform the teardown.

#### Optional flags

* `--ignore-deployments` - Teardown even if there are existing deployments on the manager. Note that ignoring deployments should be used with care as the manager controlling any resources provisioned by it (i.e. running deployments) will not be removed. It will be up to the user to remove those unecessary resources.


&nbsp;
#### Example

```markdown
$ cfy teardown -f --ignore-deployments
...

Using manager 52.31.106.71 with port 80
2016-06-29 14:11:10 CFY <manager> Starting 'uninstall' workflow execution
2016-06-29 14:11:10 CFY <manager> [sanity_dee2c] Stopping node
2016-06-29 14:11:10 CFY <manager> [webui_ef68c] Stopping node
.
.
.
2016-06-29 14:11:25 CFY <manager> [rest_service_fd6df.stop] Task succeeded 'fabric_plugin.tasks.run_script'
2016-06-29 14:11:26 CFY <manager> [rest_service_fd6df] Deleting node
2016-06-29 14:11:26 CFY <manager> [elasticsearch_8d1cf] Stopping node
2016-06-29 14:11:26 CFY <manager> [rabbitmq_023a2] Stopping node
.
.
.
2016-06-29 14:12:56 LOG <manager> [agents_security_group_c58f4.delete] INFO: Attempted to delete Security Group: sg-2f503548.
2016-06-29 14:12:56 CFY <manager> [agents_security_group_c58f4.delete] Task succeeded 'ec2.securitygroup.delete'
2016-06-29 14:12:56 CFY <manager> 'uninstall' workflow execution succeeded

...
# uninstall

The `cfy uninstall` command is used to uninstall an application using a Cloudify manager without having to manually go through the process of executing working, deleting a deployment and deleting a blueprint.


Usage: `cfy uninstall [options]`

Uninstall an application.

#### Optional flags

*  `--allow-custom-parameters` -
                        Allow passing custom parameters (which were not
                        defined in the workflow's schema in the blueprint) to
                        the execution
*  `-d DEPLOYMENT_ID, --deployment-id DEPLOYMENT_ID` -
                        The ID of the deployment you wish to uninstall
*  `--timeout TIMEOUT` -     Operation timeout in seconds (The execution itself
                        will keep going, but the CLI will stop waiting for it
                        to terminate) (default: 900)
*  `-w, --workflow WORKFLOW` -
                        The name of the workflow to execute (default:
                        uninstall)
*  `--json` -               Output events in a consumable JSON format
*  `--parameters=PARAMETERS` -
                        Parameters for the workflow execution (Can be provided
                        as wildcard based paths (*.yaml, etc..) to YAML files,
                        a JSON string or as "key1=value1;key2=value2"). This
                        argument can be used multiple times.
*  `-l, --include-logs` -    Include logs in returned events


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
# upgrade

The `cfy upgrade` command is used to upgrade a manager to later version of Cloudify.

See [manager upgrade]({{ relRef("manager/upgrade.md") }}) for more information.


Usage: `cfy upgrade [options] -p BLUEPRINT_PATH`

Upgrade a manager to a new version.

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the desired simple manager blueprint

#### Optional flags

*  `--task-thread-pool-size TASK_THREAD_POOL_SIZE` -
                        The size of the thread pool to execute tasks in
                        (default: 1)
*  `--install-plugins` -    Install the necessary plugins for the given blueprint
*  `--validate-only` -     Validate without actually performing the upgrade -
                        process
*  `--skip-validations` -   Upgrade the manager without validating resources -
*  `-i, --inputs=INPUTS` - The required inputs for running the upgrade process
*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure (default: 5)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` -
                        How many seconds to wait before each task is retried
                        (default: 30)
# use

The `cfy use` command is used to control a specific manager.

Many of the commands in `cfy` (e.g. `cfy blueprints`, `cfy agents`) are used to perform actions on or using a Cloudify manager. To be able to perform those actions you must `cfy bootstrap` a manager and then `use` it. Note that after bootstrapping a manager, you will automatically `use` it. If you want to control another manager, you will have to use the `use` command.

{% call c.note("Note") %}
After bootstrapping a manager, the user and ssh-key provided to use it will be used to perform ssh related commands (e.g. `cfy logs`, `cfy ssh`) are saved on the machine which performed the bootstrap process. Running `cfy use` to control another manager will remove those settings and will NOT set the user and ssh-key to the manager you ran `cfy use` on.
{% endcall %}

Usage: `cfy use [options] -t MANAGEMENT_IP`

Control the manager accessible on the supplied IP address.

#### Required flags

*  `-t, --management-ip=MANAGEMENT_IP` - The Manager's ip address. Note that this might either be a publically available IP address or an address in a private network - depending on your bootstrap inputs.

#### Optional flags

* `--port=REST_PORT` - The REST server's port (default: 80). This is only relevant when using a secured manager which might then be available on port 443 instead.


&nbsp;
#### Example

```markdown
$ cfy use -t 52.31.106.71
...

Using manager 52.31.106.71 with port 80

...

# workflows

The `cfy workflows` command is used to view information on the different workflows of a deployment.

You can use the command to list the workflows of a specific deployment and to retrieve information on a single workflow.


## Commands

### list

Usage: `cfy workflows list -d DEPLOYMENT_ID`

Lists all workflows for a deployment.

#### Required flags

* `-d, --deployment-id=DEPLOYMENT_ID` - The deployment ID to list executions for


&nbsp;
#### Example

```markdown
$ cfy workflows list -d simple_website
...

Listing workflows for deployment simple_website...

Workflows:
+--------------+----------------+--------------------+------------+
| blueprint_id | deployment_id  |        name        | created_at |
+--------------+----------------+--------------------+------------+
|    simple    | simple_website |       scale        |    None    |
|    simple    | simple_website |        heal        |    None    |
|    simple    | simple_website | execute_operation  |    None    |
|    simple    | simple_website |      install       |    None    |
|    simple    | simple_website | install_new_agents |    None    |
|    simple    | simple_website |     uninstall      |    None    |
+--------------+----------------+--------------------+------------+

...
```


### get

Usage: `cfy workflows get -d DEPLOYMENT_ID -w WORKFLOW`

Retrieve information on a single execution.

#### Required flags

*  `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment to which the workflow belongs
*  `-w, --workflow=WORKFLOW` - The ID of the workflow to retrieve information for


&nbsp;
#### Example

```markdown
$ cfy workflows get -d simple_website -w install
...

Retrieving workflow install for deployment simple_website

Workflows:
+--------------+----------------+---------+------------+
| blueprint_id | deployment_id  |   name  | created_at |
+--------------+----------------+---------+------------+
|    simple    | simple_website | install |    None    |
+--------------+----------------+---------+------------+

Workflow Parameters:
	Mandatory Parameters:
	Optional Parameters:

...
```