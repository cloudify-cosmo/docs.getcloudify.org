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


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
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
{{< /gsHighlight >}}


### get

Usage: `cfy workflows get -d DEPLOYMENT_ID -w WORKFLOW`

Retrieve information on a single execution.

#### Required flags

*  `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment to which the workflow belongs
*  `-w, --workflow=WORKFLOW` - The ID of the workflow to retrieve information for


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
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
{{< /gsHighlight >}}