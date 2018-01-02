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

{{% gsNote title="Note" %}}
Use of spaces is not supported in file names.
{{% /gsNote %}}

#### Optional Flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)

* `-h, --help` - Show this message and exit.


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
*  `-i, --inputs=INPUTS` - Inputs for the deployment (Can be provided as wildcard-based paths (`.yaml`, etc..) to YAML files, a JSON          string or as `key1=value1;key2=value2`). This argument can be used multiple times.
* `--skip-plugins-validation` - A boolean flag that specifies whether to validate if the required deployment plugins exist on the Manager. [Default: `false`]
* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant'] [default: tenant].

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy deployments create -b simple-python-webserver-blueprint
...

Creating new deployment from blueprint simple-python-webserver-blueprint...
Deployment created. The deployment's id is simple-python-webserver-blueprint

...
{{< /gsHighlight >}}

### update

#### Usage 
`cfy deployments update [OPTIONS] DEPLOYMENT_ID`

Update a specified deployment according to the specified blueprint.

`DEPLOYMENT_ID` -       is the deployment's ID to update.


#### Mandatory flags

*  `-p, --blueprint-path PATH` - 
                        This is a mandatory flag.

#### Optional flags 

 *  `-i, --inputs TEXT` -
                        Inputs for the deployment (Can be provided as
                        wildcard-based paths (`*.yaml`, `/my_inputs/`,
                        etc.) to YAML files, a JSON string or as
                        `key1=value1;key2=value2`). This argument can
                        be used multiple times.
*  `-n, --blueprint-filename TEXT` -
                        The name of the archive's main blueprint file.
                        (default: `blueprint.yaml`). Only relevant if uploading an archive.
*  `-w, --workflow-id TEXT` - 
                        The workflow to execute [default: `update`]
*  `--skip-install` -   Skip install lifecycle operations.

*  `--skip-uninstall` - Skip uninstall lifecycle operations.

*  `-f, --force` -      Force an update to run, in the event that a previous
                        update on this deployment has failed to
                        complete successfully.
*  `--include-logs / --no-logs` - Include logs in returned events [default: `True`]
*  `--json-output` -   Output events in a consumable JSON format
*  `-t, --tenant-name TEXT` - 
                        The name of the tenant of the deployment. If unspecified, the current tenant is
                                 used.



&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy deployments update simple-python-webserver-blueprint -p simple-python-webserver-blueprint/blueprint.yaml
...

Updating deployment cloudify-nodecellar-example using blueprint cloudify-nodecellar-example/simple-blueprint.yaml
2017-03-30 10:26:12.723  CFY <cloudify-nodecellar-example> Starting 'update' workflow execution
2017-03-30 10:26:13.201  CFY <cloudify-nodecellar-example> 'update' workflow execution succeeded
Finished executing workflow 'update' on deployment 'cloudify-nodecellar-example'
Successfully updated deployment cloudify-nodecellar-example. Deployment update id: cloudify-nodecellar-example-d53a26e8-a10a-4545-956b-8bad45b90966. Execution id: dcf2dc2f-dc4f-4036-85a6-e693196e6331

...
{{< /gsHighlight >}}

### delete

#### Usage 
`cfy deployments delete [OPTIONS] DEPLOYMENT_ID`

Delete a deployment from Cloudify Manager. 

{{% gsNote title="Note" %}}
Deleting a deployment does not delete the resources of an application. To delete the resources, run the `uninstall` workflow (unless a custom uninstall workflow is provided).
{{% /gsNote %}}


`DEPLOYMENT_ID` -       The ID of the deployment to delete

#### Optional flags

*  `-f, --force` -      Delete the deployment even if there are existing live nodes for it
*  `-t, --tenant-name TEXT` - 
                        The name of the tenant of the deployment. If unspecified, the current tenant is
                                 used.
&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy deployments delete simple-python-webserver-blueprint
...

Deleting deployment simple-python-webserver-blueprint...
Deployment deleted

...
{{< /gsHighlight >}}

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


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
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
{{< /gsHighlight >}}

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

{{< gsHighlight  bash  >}}
$ cfy deployments outputs cloudify-nodecellar-example
...

Retrieving inputs for deployment cloudify-nodecellar-example...
 - "agent_private_key_path":
     Value: /key.pem
 - "agent_user":
     Value: centos
 - "host_ip":
     Value: 172.16.0.7

...
{{< /gsHighlight >}}

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

{{< gsHighlight  bash  >}}
$ cfy deployments outputs cloudify-nodecellar-example
...

Retrieving outputs for deployment cloudify-nodecellar-example...
 - "endpoint":
     Description: Web application endpoint
     Value: {u'ip_address': u'172.16.0.7', u'port': 8080}

...
{{< /gsHighlight >}}

### set-visibility

#### Usage
`cfy deployments set-visibility [OPTIONS] DEPLOYMENT_ID`

Set the deployment's visibility to tenant

`DEPLOYMENT_ID` - The id of the deployment to update.

#### Mandatory flags

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to 'tenant' [required].

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy deployments set-visibility cloudify-nodecellar-example -l tenant
...

Deployment `cloudify-nodecellar-example` was set to tenant

...
{{< /gsHighlight >}}
