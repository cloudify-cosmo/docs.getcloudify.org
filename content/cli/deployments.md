---
layout: bt_wiki
title: deployments
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 40
---

The `cfy deployments` command is used to manage running deployments on a Cloudify manager.

You can use the command to create, delete, update and list deployments and to show the outputs for a specific deployment.


## Commands

### create

Usage: `cfy deployments create [OPTIONS] [DEPLOYMENT_ID]`

Create a deployment on the manager

`DEPLOYMENT_ID` -       is the id of the deployment you'd like to create.

#### Optional flags

*  `-b, --blueprint-id TEXT` -   
                        The unique identifier for the blueprint
                        [required]

*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        A unique ID for the deployment
*  `-i, --inputs=INPUTS` -
                        Inputs for the deployment (Can be provided as wildcard
                        based paths (*.yaml, etc..) to YAML files, a JSON
                        string or as "key1=value1;key2=value2"). This argument
                        can be used multiple times.


&nbsp;
#### Example

```markdown
$ cfy deployments create -b simple-python-webserver-blueprint
...

Creating new deployment from blueprint simple-python-webserver-blueprint...
Deployment created. The deployment's id is simple-python-webserver-blueprint

...
```

### update

Usage: `cfy deployments update [OPTIONS] DEPLOYMENT_ID`

Update a specified deployment according to the specified blueprint

`DEPLOYMENT_ID` -       is the deployment's id to update.

#### Optional flags

*  `-i, --inputs TEXT` -
                        Inputs for the deployment (Can be provided as
                        wildcard based paths (*.yaml, /my_inputs/,
                        etc..) to YAML files, a JSON string or as
                        key1=value1;key2=value2). This argument can
                        be used multiple times
*  `-n, --blueprint-filename TEXT` -
                        The name of the archive's main blueprint file.
                        (default: blueprint.yaml)
*  `-w, --workflow-id TEXT` - 
                        The workflow to execute [default: update]
*  `--skip-install` -   Skip install lifecycle operations

*  `--skip-uninstall` - Skip uninstall lifecycle operations

*  `-f, --force` -      Force running update in case a previous
                        update on this deployment has failed to
                        finished successfully
*  `--include-logs / --no-logs` -     
                        Include logs in returned events [default: True]
*  `--json` -           Output events in a consumable JSON format

&nbsp;
#### Example

```markdown
$ cfy deployments update simple-python-webserver-blueprint -p simple-python-webserver-blueprint/blueprint.yaml
...

Updating deployment simple-python-webserver-blueprint using blueprint simple-python-webserver-blueprint/blueprint.yaml
2016-08-03 07:00:36.443  CFY <simple-python-webserver-blueprint> Starting 'update' workflow execution
2016-08-03 07:00:36.949  CFY <simple-python-webserver-blueprint> 'update' workflow execution succeeded
Finished executing workflow 'update' on deployment 'simple-python-webserver-blueprint'
Successfully updated deployment simple-python-webserver-blueprint. Deployment update id: simple-python-webserver-blueprint-e9c19b3a-563b-480c-b5b1-edabfaad0fdd. Execution id: d0829eb4-ea5b-472f-af6f-b04107aeca83

...
```

### delete

Usage: `cfy deployments delete [OPTIONS] DEPLOYMENT_ID`

Delete an existing deployment. It's important to note that deleting a deployment does not mean deleting the resources of an application - for which you need to run the `uninstall` workflow (unless a custom uninstall workflow is provided).

`DEPLOYMENT_ID` -       The ID of the deployment to delete

#### Optional flags

*  `-f, --force` -      Delete the deployment even if there are existing live nodes for it

&nbsp;
#### Example

```markdown
$ cfy deployments delete simple-python-webserver-blueprint
...

Deleting deployment simple-python-webserver-blueprint...
Deployment deleted

...
```

### list

Usage: `cfy deployments list [OPTIONS]`

List deployments.

If `--blueprint-id` is provided, list deployments for that blueprint.
  Otherwise, list deployments for all blueprints.

#### Optional flags

*  `-b, --blueprint-id TEXT` - 
                        The ID of the blueprint you would like to list deployments for

*  `--sort-by TEXT` -   Key for sorting the list

*  `--descending` -     Sort list in descending order [default: False]


&nbsp;
#### Example

```markdown
$ cfy deployments list
...

Listing all deployments...

Deployments:
+-----------------------------------+-----------------------------------+--------------------------+--------------------------+
|                 id                |            blueprint_id           |        created_at        |        updated_at        |
+-----------------------------------+-----------------------------------+--------------------------+--------------------------+
| simple-python-webserver-blueprint | simple-python-webserver-blueprint | 2016-08-02 12:03:17.974  | 2016-08-02T12:03:17.974Z |
|                test               | simple-python-webserver-blueprint | 2016-08-03 06:47:30.774  | 2016-08-03T06:47:30.774Z |
+-----------------------------------+-----------------------------------+--------------------------+--------------------------+

...
```

### outputs

Usage: `cfy deployments outputs [OPTIONS] DEPLOYMENT_ID`

Lists all outputs for a deployment. Note that not every deployment has outputs and it depends on whether or not outputs were defined in the blueprint from which the deployment was created

`DEPLOYMENT_ID` -       The ID of the deployment you would like to list outputs for.

&nbsp;
#### Example

```markdown
$ cfy deployments outputs simple-python-webserver-blueprint
...

Retrieving outputs for deployment simple-python-webserver-blueprint...
 - "http_endpoint":
     Description: Web server external endpoint
     Value: http://localhost:8000

...
```