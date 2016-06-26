---
layout: bt_wiki
title: uninstall
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 230
---

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
