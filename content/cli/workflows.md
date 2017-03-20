---
layout: bt_wiki
title: workflows
category: Docs
draft: false
abstract: Cloudify Command-Line Interface
weight: 260
---

The `cfy workflows` command is used to view information about the different workflows of a deployment.

You can use the command to list the workflows of a specific deployment and to retrieve information about a single workflow.

#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.

## Commands

### list

#### Usage 
`cfy workflows list [OPTIONS] DEPLOYMENT_ID`

Lists all workflows on the Cloudify Manager for a specific deployment.

`DEPLOYMENT_ID` The ID of the deployment for which you want to list the workflows.

#### Required flags

* `-d, --deployment-id TEXT` - The ID of the deployment for which you want to list the executions.

#### Optional flags

* `-t, --tenant-name TEXT` - The name of the tenant of the deployment. If unspecified, the current tenant is used.


&nbsp;
#### Example

```markdown
$ cfy workflows list -d nodecellar-blueprint
...

This command ists the workflows for the nodecellar-blueprint deployment.

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

#### Usage 
`cfy workflows get [OPTIONS] WORKFLOW_ID`

Retrieves information for a specific workflow of a specific deployment.

`WORKFLOW_ID` The ID of the workflow for which you want to to get information.

#### Required flags

*  `-d, --deployment-id TEXT` - The ID of the deployment to which the workflow belongs.

#### Optional flags

* `-t, --tenant-name TEXT` - The name of the tenant of the deployment. If unspecified, the current tenant is used.


&nbsp;
#### Example

```markdown
$ cfy workflows get execute_operation -d nodecellar-blueprint
...

This example retrieves the workflow execute_operation for the nodecellar-blueprint deployment.

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