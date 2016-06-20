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

