---
layout: bt_wiki
title: deployments
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/deployments/
---

The `cfy deployments` command is used to manage running deployments on a Cloudify manager.

You can use the command to create, delete, update and list deployments and to show the outputs for a specific deployment.

{{% note title="Note" %}}
Use of spaces is not supported in file names.
{{% /note %}}


For more information, see [deployment update process]({{< relref "working_with/manager/update-deployment.md" >}}).

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### create

#### Usage 
`cfy deployments create [OPTIONS] [DEPLOYMENT_ID]`

Create a deployment on the Manager

`DEPLOYMENT_ID` -       The ID of the deployment to be created.


#### Mandatory flags

*  `-b, --blueprint-id TEXT` -   
                        The unique identifier for the blueprint
                        [required]


#### Optional flags

*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        A unique ID for the deployment
* `-s, --site-name TEXT`    -   Deployment's site name
*  `-i, --inputs=INPUTS` - Inputs for the deployment (Can be provided as wildcard-based paths (`.yaml`, etc..) to YAML files, a JSON          string or as `key1=value1;key2=value2`). This argument can be used multiple times.
* `--skip-plugins-validation` - A boolean flag that specifies whether to validate if the required deployment plugins exist on the Manager. [Default: `false`]
* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].
* `--runtime-only-evaluation` - `If set, all intrinsic functions will only be evaluated at runtime, and no intrinsic functions will be evaluated at parse time (such as get_input, get_property).`

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments create -b simple-python-webserver-blueprint
...

Creating new deployment from blueprint simple-python-webserver-blueprint...
Deployment created. The deployment's id is simple-python-webserver-blueprint

...
{{< /highlight >}}

### update

#### Usage 
`cfy deployments update [OPTIONS] DEPLOYMENT_ID`

Update a specified deployment according to the specified blueprint.

`DEPLOYMENT_ID` -       is the deployment's ID to update.


#### Mandatory flags

*  `-b, --blueprint-id TEXT` - The unique identifier of the blueprint to use for deployment update.

#### Optional flags 

 *  `-i, --inputs TEXT` -
                        Inputs for the deployment (Can be provided as
                        wildcard-based paths (`*.yaml`, `/my_inputs/`,
                        etc.) to YAML files, a JSON string or as
                        `key1=value1;key2=value2`). This argument can
                        be used multiple times.
*  `--skip-install` -   Skip install lifecycle operations.
*  `--skip-uninstall` - Skip uninstall lifecycle operations.
*  `--skip-reinstall` - Skip automatic reinstall of node-instances
                                 whose properties are modified in the
                                 deployment update. Node instances
                                 explicitly included in the reinstall
                                 list are not skipped.
*  `-r, --reinstall-list TEXT` - Node instances IDs to reinstall. This argument can
                        be used multiple times.
*  `--ignore-failure` - Pass ignore-failure option to uninstall workflow.
*  `--install-first` - First run the install workflow and then run the uninstall workflow.
*  `--preview` - If set, does not perform the update and returns the steps this update would make.
*  `--dont-update-plugins` - If set, does not perform any of the plugin updates.
*  `-f, --force` -      Force an update to run, in the event that a previous
                        update on this deployment did not complete successfully.
*  `--include-logs / --no-logs` - Include logs in returned events [default: `True`]
*  `--json-output` -   Output events in a consumable JSON format
*  `-t, --tenant-name TEXT` - 
                        The name of the tenant of the deployment. If unspecified, the current tenant is
                                 used.
* `--runtime-only-evaluation` - `If set, all intrinsic functions will only be evaluated at runtime, and no intrinsic functions will be evaluated at parse time (such as get_input, get_property).`

For more information, see [deployment update process]({{< relref "working_with/manager/update-deployment.md" >}}).


#### Example

{{< highlight  bash  >}}
$ cfy deployments update simple-python-webserver-blueprint -p simple-python-webserver-blueprint/blueprint.yaml
...

Updating deployment cloudify-nodecellar-example using blueprint cloudify-nodecellar-example/simple-blueprint.yaml
2017-03-30 10:26:12.723  CFY <cloudify-nodecellar-example> Starting 'update' workflow execution
2017-03-30 10:26:13.201  CFY <cloudify-nodecellar-example> 'update' workflow execution succeeded
Finished executing workflow 'update' on deployment 'cloudify-nodecellar-example'
Successfully updated deployment cloudify-nodecellar-example. Deployment update id: cloudify-nodecellar-example-d53a26e8-a10a-4545-956b-8bad45b90966. Execution id: dcf2dc2f-dc4f-4036-85a6-e693196e6331

...
{{< /highlight >}}


### history

#### Usage 
`cfy deployments history [OPTIONS]`

List deployment updates history.


#### Optional flags

*  `-d, --deployment-id TEXT` - 
                        The ID of the deployment for which you want to show the history of deployment updates.

*  `--sort-by TEXT` -   Key for sorting the list

*  `--descending` -     Sort list in descending order [default: False]

*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to show the history of deployment updates. If
                           unspecified, the current tenant is used.
                           This argument cannot be used simultaneously with the `all-tenants` argument.
                           
*  `-a, --all-tenants`        Include resources from all tenants associated with
                           the user. This option cannot be used simultaneously with the `tenant-name` argument.

*  `--search TEXT`     Search deployments by ID. The returned list will include only deployments that contain the given search pattern.

*  `-o, --pagination-offset INTEGER` -    The number of resources to skip; --pagination-offset=1 skips the first resource 
                                         [default: 0].

*  `-s, --pagination-size INTEGER` -    The max number of results to retrieve per page [default: 1000]


### get-update

#### Usage 
`cfy dep get-up [OPTIONS] DEPLOYMENT_UPDATE_ID`

List deployment update details.


#### Optional flags

*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to show the history of deployment updates. If
                           unspecified, the current tenant is used.
                           This argument cannot be used simultaneously with the `all-tenants` argument.


### delete

#### Usage 
`cfy deployments delete [OPTIONS] DEPLOYMENT_ID`

Delete a deployment from Cloudify Manager. 

{{% note title="Note" %}}
Deleting a deployment does not delete the resources of an application. To delete the resources, run the `uninstall` workflow (unless a custom uninstall workflow is provided).
{{% /note %}}


`DEPLOYMENT_ID` -       The ID of the deployment to delete

#### Optional flags

*  `-f, --force` -      Delete the deployment even if there are existing live nodes for it, or existing installations which depend on it
* `-l, --with-logs` -        If set, then the deployment's management workers
                          logs are deleted as well [default: False]
*  `-t, --tenant-name TEXT` - 
                        The name of the tenant of the deployment. If unspecified, the current tenant is
                                 used.
&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments delete simple-python-webserver-blueprint
...

Deleting deployment simple-python-webserver-blueprint...
Deployment deleted

...
{{< /highlight >}}

### list

#### Usage 
`cfy deployments list [OPTIONS]`

List deployments.

If `--blueprint-id` is provided, list deployments for that blueprint.
  Otherwise, list deployments for all blueprints.

#### Optional flags

*  `-b, --blueprint-id TEXT` - 
                        The ID of the blueprint for which you want to list deployments.

*  `--sort-by TEXT` -   Key for sorting the list

*  `--descending` -     Sort list in descending order [default: False]

*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to list deployments. If
                           unspecified, the current tenant is used.
                           This argument cannot be used simultaneously with the `all-tenants` argument.
                           
*  `-a, --all-tenants`        Include resources from all tenants associated with
                           the user. This option cannot be used simultaneously with the `tenant-name` argument.

*  `--search TEXT`     Search deployments by id. The returned list will include only deployments that contain the given search pattern.

*  `-o, --pagination-offset INTEGER` -    The number of resources to skip; --pagination-offset=1 skips the first resource 
                                         [default: 0].

*  `-s, --pagination-size INTEGER` -    The max number of results to retrieve per page [default: 1000]

      


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments list
...

Listing all deployments...

Deployments:
+-----------------------------+-----------------------------+--------------------------+--------------------------+------------+----------------+------------+
|              id             |         blueprint_id        |        created_at        |        updated_at        | visibility |  tenant_name   | created_by |
+-----------------------------+-----------------------------+--------------------------+--------------------------+------------+----------------+------------+
| cloudify-nodecellar-example | cloudify-nodecellar-example | 2017-03-30 10:14:40.556  | 2017-03-30 10:14:40.556  |   tenant   | default_tenant |   admin    |
+-----------------------------+-----------------------------+--------------------------+--------------------------+------------+----------------+------------+

...
{{< /highlight >}}

### summary

#### Usage
`cfy deployments summary <field> [optional sub-field] [OPTIONS]`

Summarizes deployments, giving a count of elements with each distinct value for the selected field.
If a sub-field is selected then a count will be given for each distinct field and sub-field combination, as well as totals for each field.

For valid field/sub-field names, invoke `cfy deployments summary`

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments summary blueprint_id
Retrieving summary of deployments on field blueprint_id

Deployment summary by blueprint_id
+--------------+-------------+
| blueprint_id | deployments |
+--------------+-------------+
|     sga      |      3      |
|      s       |      5      |
|      sg      |      1      |
+--------------+-------------+

...

$ cfy deployments summary --all-tenants tenant_name blueprint_id
Retrieving summary of deployments on field tenant_name

Deployment summary by tenant_name
+----------------+--------------+-------------+
|  tenant_name   | blueprint_id | deployments |
+----------------+--------------+-------------+
|     test1      |      s       |      1      |
|     test1      |      sg      |      3      |
|     test1      |     sga      |      5      |
|     test1      |    TOTAL     |      9      |
|     test2      |     sga      |      1      |
|     test2      |      s       |      3      |
|     test2      |      sg      |      5      |
|     test2      |    TOTAL     |      9      |
| default_tenant |     sga      |      3      |
| default_tenant |      s       |      5      |
| default_tenant |      sg      |      1      |
| default_tenant |    TOTAL     |      9      |
+----------------+--------------+-------------+

...

{{< /highlight >}}

### inputs

#### Usage 
` cfy deployments inputs [OPTIONS] DEPLOYMENT_ID`

Retrieve inputs for a specific deployment

`DEPLOYMENT_ID` -       The ID of the deployment for which you want to list inputs.

#### Optional flags

*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to list inputs. If
                           unspecified, the current tenant is used.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments inputs cloudify-nodecellar-example
...

Retrieving inputs for deployment cloudify-nodecellar-example...
 - "agent_private_key_path":
     Value: /key.pem
 - "agent_user":
     Value: centos
 - "host_ip":
     Value: 172.16.0.7

...
{{< /highlight >}}

### outputs

#### Usage 
`cfy deployments outputs [OPTIONS] DEPLOYMENT_ID`

Lists all outputs for a deployment. Note that not every deployment has outputs and it depends on whether or not outputs were defined in the blueprint from which the deployment was created

`DEPLOYMENT_ID` -       The ID of the deployment for which you want to list outputs.


#### Optional flags


*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to list outputs. If
                           unspecified, the current tenant is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments outputs cloudify-nodecellar-example
...

Retrieving outputs for deployment cloudify-nodecellar-example...
 - "endpoint":
     Description: Web application endpoint
     Value: {u'ip_address': u'172.16.0.7', u'port': 8080}

...
{{< /highlight >}}

### capabilities

#### Usage 
`cfy deployments capabilities [OPTIONS] DEPLOYMENT_ID`

Lists all capabilities for a deployment. Note that not every deployment has capabilities and it depends on whether or not capabilities were defined in the blueprint from which the deployment was created

`DEPLOYMENT_ID` -       The ID of the deployment for which you want to list capabilities.


#### Optional flags


*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to list capabilities. If
                           unspecified, the current tenant is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments capabilities cloudify-nodecellar-example
...

Retrieving capabilities for deployment cloudify-nodecellar-example...
 - "endpoint":
     Description: Web application endpoint
     Value: {u'ip_address': u'172.16.0.7', u'port': 8080}

...
{{< /highlight >}}

### set-visibility

#### Usage
`cfy deployments set-visibility [OPTIONS] DEPLOYMENT_ID`

Set the deployment's visibility to tenant

`DEPLOYMENT_ID` - The id of the deployment to update.

#### Mandatory flags

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['tenant', 'global'] [required].

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments set-visibility cloudify-nodecellar-example -l tenant
...

Deployment `cloudify-nodecellar-example` was set to tenant

...
{{< /highlight >}}


### set-site

#### Usage

`cfy depployments set-site [OPTIONS] DEPLOYMENT_ID`

  Set the deployment's site

  `DEPLOYMENT_ID` is the id of the deployment to update


#### Optional flags

*  `-s, --site-name TEXT` -  Deployment's site name
*  `-d, --detach-site`  -    If set, detach the current site, making the
                         deployment siteless [default: False]. You cannot use
                         this argument with arguments: [site_name]

