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
$ cfy workflows list -d cloudify-nodecellar-example
...

Listing workflows for deployment cloudify-nodecellar-example...

Workflows:
+-----------------------------+-----------------------------+--------------------+------------+
|         blueprint_id        |        deployment_id        |        name        | created_at |
+-----------------------------+-----------------------------+--------------------+------------+
| cloudify-nodecellar-example | cloudify-nodecellar-example | execute_operation  |            |
| cloudify-nodecellar-example | cloudify-nodecellar-example |        heal        |            |
| cloudify-nodecellar-example | cloudify-nodecellar-example |      install       |            |
| cloudify-nodecellar-example | cloudify-nodecellar-example | install_new_agents |            |
| cloudify-nodecellar-example | cloudify-nodecellar-example |       scale        |            |
| cloudify-nodecellar-example | cloudify-nodecellar-example |     uninstall      |            |
| cloudify-nodecellar-example | cloudify-nodecellar-example |       update       |            |
+-----------------------------+-----------------------------+--------------------+------------+

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
$ cfy workflows get execute_operation -d cloudify-nodecellar-example
...

Retrieving workflow execute_operation for deployment cloudify-nodecellar-example

Workflows:
+-----------------------------+-----------------------------+-------------------+------------+
|         blueprint_id        |        deployment_id        |        name       | created_at |
+-----------------------------+-----------------------------+-------------------+------------+
| cloudify-nodecellar-example | cloudify-nodecellar-example | execute_operation |            |
+-----------------------------+-----------------------------+-------------------+------------+

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