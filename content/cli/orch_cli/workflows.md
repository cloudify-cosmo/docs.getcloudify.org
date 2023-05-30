---
title: workflows
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/workflows/
---

The `cfy workflows` command is used to view information about the different workflows of a deployment.

You can use the command to list the workflows of a specific deployment and to retrieve information about a single workflow.

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### list

#### Usage
`cfy workflows list [OPTIONS]`

Lists all workflows on the {{< param cfy_manager_name >}} for a specific deployment.

`DEPLOYMENT_ID` The ID of the deployment for which you want to list the workflows.

#### Required flags

* `-d, --deployment-id TEXT` - The unique identifier for the deployment.

#### Optional flags

* `-t, --tenant-name TEXT` - The name of the tenant of the deployment. If unspecified, the current tenant is used.
* `--all` - Also show unavailable workflows


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy workflows list -d cloudify-nodecellar-example
...

Listing workflows for deployment cloudify-nodecellar-example...

Workflows:
+-----------------------------+-----------------------------+--------------------+--------------------+
|         blueprint_id        |        deployment_id        |        name        | availability_rules |
+-----------------------------+-----------------------------+--------------------+--------------------+
| cloudify-nodecellar-example | cloudify-nodecellar-example | execute_operation  |                    |
| cloudify-nodecellar-example | cloudify-nodecellar-example |        heal        |                    |
| cloudify-nodecellar-example | cloudify-nodecellar-example |      install       |                    |
| cloudify-nodecellar-example | cloudify-nodecellar-example | install_new_agents |                    |
| cloudify-nodecellar-example | cloudify-nodecellar-example |       scale        |                    |
| cloudify-nodecellar-example | cloudify-nodecellar-example |     uninstall      |                    |
| cloudify-nodecellar-example | cloudify-nodecellar-example |       update       |                    |
+-----------------------------+-----------------------------+--------------------+--------------------+

...
{{< /highlight >}}


### get

#### Usage
`cfy workflows get [OPTIONS] WORKFLOW_ID`

Retrieves information for a specific workflow of a specific deployment.

`WORKFLOW_ID` The ID of the workflow for which you want to get information.

#### Required flags

*  `-d, --deployment-id TEXT` - The ID of the deployment to which the workflow belongs.

#### Optional flags

* `-t, --tenant-name TEXT` - The name of the tenant of the deployment. If unspecified, the current tenant is used.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy workflows get execute_operation -d cloudify-nodecellar-example
...

Retrieving workflow execute_operation for deployment cloudify-nodecellar-example

Workflows:
+-----------------------------+-----------------------------+-------------------+--------------------+
|         blueprint_id        |        deployment_id        |        name       | availability_rules |
+-----------------------------+-----------------------------+-------------------+--------------------+
| cloudify-nodecellar-example | cloudify-nodecellar-example | execute_operation |                    |
+-----------------------------+-----------------------------+-------------------+--------------------+

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
{{< /highlight >}}
