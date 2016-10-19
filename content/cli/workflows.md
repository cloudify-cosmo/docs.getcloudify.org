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

Usage: `cfy workflows list [OPTIONS] DEPLOYMENT_ID`

List all workflows on the manager

`DEPLOYMENT_ID` is the id of the deployment to list workflows for.

#### Required flags

* `-d, --deployment-id TEXT` - The deployment ID to list executions for


&nbsp;
#### Example

```markdown
$ cfy workflows list -d nodecellar-blueprint
...

Listing workflows for deployment nodecellar-blueprint...

Workflows:
+----------------------+----------------------+--------------------+------------+
|     blueprint_id     |    deployment_id     |        name        | created_at |
+----------------------+----------------------+--------------------+------------+
| nodecellar-blueprint | nodecellar-blueprint | execute_operation  |    None    |
| nodecellar-blueprint | nodecellar-blueprint |        heal        |    None    |
| nodecellar-blueprint | nodecellar-blueprint |      install       |    None    |
| nodecellar-blueprint | nodecellar-blueprint | install_new_agents |    None    |
| nodecellar-blueprint | nodecellar-blueprint |       scale        |    None    |
| nodecellar-blueprint | nodecellar-blueprint |     uninstall      |    None    |
| nodecellar-blueprint | nodecellar-blueprint |       update       |    None    |
+----------------------+----------------------+--------------------+------------+

...
```


### get

Usage: cfy workflows get [OPTIONS] WORKFLOW_ID

Retrieve information for a specific workflow of a specific deployment

`WORKFLOW_ID` is the id of the workflow to get information on.

#### Required flags

*  `-d, --deployment-id TEXT` - The ID of the deployment to which the workflow belongs


&nbsp;
#### Example

```markdown
$ cfy workflows get execute_operation -d nodecellar-blueprint
...

Retrieving workflow execute_operation for deployment nodecellar-blueprint

Workflows:
+----------------------+----------------------+-------------------+------------+
|     blueprint_id     |    deployment_id     |        name       | created_at |
+----------------------+----------------------+-------------------+------------+
| nodecellar-blueprint | nodecellar-blueprint | execute_operation |    None    |
+----------------------+----------------------+-------------------+------------+

Workflow Parameters:
	Mandatory Parameters:
		operation
	Optional Parameters:
		operation_kwargs: 	{}
		node_ids: 	[]
		node_instance_ids: 	[]
		run_by_dependency_order: 	False
		allow_kwargs_override: 	None
		type_names: 	[]

...
```