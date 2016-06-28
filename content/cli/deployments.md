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


### delete

Usage: `cfy deployments delete [options] -d DEPLOYMENT_ID` 

Delete an existing deployment. It's important to note that deleting a deployment does not mean deleting the resources of an application - for which you need to run the `uninstall` workflow (unless a custom uninstall workflow is provided).

#### Required flags

*  `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment to delete

#### Optional flags

*  `-f, --ignore-live-nodes` - Delete the deployment even if there are existing live resources for that deployment


### list

Usage: `cfy deployments list -b BLUEPRINT_ID`

List all existing deployment for a blueprint.

#### Required flags

*  `-b, --blueprint-id BLUEPRINT_ID` - The ID of the blueprint you would like to list deployments for


### outputs

Usage: `cfy deployments outputs [options] -d DEPLOYMENT_ID`

Lists all outputs for a deployment. Note that not every deployment has outputs and it depends on whether or not outputs were defined in the blueprint from which the deployment was created

#### Required flags

* `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment you would like to list outputs for
