---
layout: bt_wiki
title: workflows
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 260
---

The `cfy workflows` command is used to view information on the different workflows of a deployment.

You can use the command to list the workflows of a specific deployment and to retrieve information on a single workflow.


## Commands

### list

Usage: `cfy workflows list -d DEPLOYMENT_ID`

Lists all workflows for a deployment.

#### Required flags

* `-d, --deployment-id=DEPLOYMENT_ID` - The deployment ID to list executions for


### get

Usage: `cfy workflows get -d DEPLOYMENT_ID -w WORKFLOW`

Retrieve information on a single execution.

#### Required flags

*  `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment to which the workflow belongs
*  `-w, --workflow=WORKFLOW` - The ID of the workflow to retrieve information for

