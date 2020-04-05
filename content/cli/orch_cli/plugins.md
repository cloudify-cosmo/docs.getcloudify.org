---
layout: bt_wiki
title: plugins
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/plugins/
---

The `cfy plugins` command is used to manage plugins stored on a Cloudify manager.

You can use the command to upload, download, delete and list plugins and also to get information on a specific plugin.

A Cloudify plugin is an archive created by [wagon](http://github.com/cloudify-cosmo/wagon).

Each plugin has a plugin.yaml file that map node lifecycle operations to appropriate plugin functions.

See [plugins]({{< relref "working_with/official_plugins/_index.md" >}}) for more information.


#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### upload

#### Usage 
`cfy plugins upload [OPTIONS] PLUGIN_PATH`

Upload a plugin to Cloudify Manager.

`PLUGIN_PATH` is the path to the wagon archive to upload.

{{% note title="Important" %}}
Wagon (via the `--format` flag) enables you to create archives in both `tar.gz` and `zip` formats. Cloudify only supports wagon in the `tar.gz` format.
{{% /note %}}

#### Required flags

* `-y, --yaml-path TEXT` - The path to the yaml file for the plugin

#### Optional flags

* `-t, --tenant-name TEXT` - The name of the tenant of the plugin. If unspecified, the current tenant is used.
* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].
* `-i, --icon-path TEXT` - The path to the plugin's icon file (must be a valid PNG image).

{{% note title="Paths" %}}
All the mentioned paths (`PLUGIN_PATH`, `--yaml-path`'s value and `--icon-path`'s value) may be not only local filesystem paths, but also valid URLs (either `http://` or `https://`).
{{% /note %}}


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy plugins upload -y plugin.yaml -i https://cloudify.co/wp-content/uploads/2019/08/aws-1.png cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn
...

Validating plugin cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn...
Plugin validated successfully
Uploading plugin cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn...
 cloudify_aws_plug... |################################################| 100.0%
Plugin uploaded. The plugin's id is e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74

...
{{< /highlight >}}


### download

#### Usage 
`cfy plugins download [OPTIONS] PLUGIN_ID`

Download a plugin from Cloudify Manager.

`PLUGIN_ID` is the ID of the plugin to download.

#### Optional flags

* `-o, --output-path TEXT` -	
						The local path for the download.
* `-t, --tenant-name TEXT` - The name of the tenant of the plugin. If unspecified, the current tenant is used.
						

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy plugins download e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74
...

Downloading plugin e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74...
 e90b1a09-6b56-4a9... |################################################| 100.0%
Plugin downloaded as e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74.tar.gz

...
{{< /highlight >}}

### delete

#### Usage 
`cfy plugins delete [OPTIONS] PLUGIN_ID`

Delete a plugin from Cloudify Manager.

`PLUGIN_ID` is the ID of the plugin to be deleted.

#### Optional flags

*  `-f, --force` -    	Delete the plugin, even if there are deployments that are currently using it.
* `-t, --tenant-name TEXT` - The name of the tenant of the plugin. If unspecified, the current tenant is used.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy plugins delete e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74
...

Deleting plugin e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74...
Plugin deleted

...
{{< /highlight >}}

### list

#### Usage 
`cfy plugins list [OPTIONS]`

List all available plugins on Cloudify Manager.
You can use this command to retrieve the IDs of the plugins you want to download or delete.

#### Optional flags

* `--sort-by TEXT` - Key for sorting the list.
* `--descending` -  Sort list in descending order. [default: False]
* `-t, --tenant-name TEXT` -  The name of the tenant from which to list the plugins. If unspecified, the current tenant is
                            used. This argument cannot be used simultaneously with the `all-tenants` argument.
* `-a, --all-tenants` -    Include resources from all tenants associated with
                            the user. This argument cannot be used simultaneously with the `tenant-name` argument.  
*  `--search TEXT`     Search plugins by package-name. The returned list will include only plugins that contain the given search pattern.
*  `--get-data`     When set to True, displays the full list of connected resources (users/tenants/user-groups), for each listed resource. When set to False displays the total number of connected resources. (default:False)
*  `-o, --pagination-offset INTEGER`     The number of resources to skip; --pagination-offset=1 skips the first resource [default: 0]
*  `-s, --pagination-size INTEGER`     The max number of results to retrieve per page [default: 1000]


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy plugins list
...

Listing all plugins...

Plugins:
+--------------------------------------+---------------------+-----------------+--------------+--------------------+----------------------+--------------------------+------------+----------------+------------+
|                  id                  |     package_name    | package_version | distribution | supported_platform | distribution_release |       uploaded_at        | visibility |  tenant_name   | created_by |
+--------------------------------------+---------------------+-----------------+--------------+--------------------+----------------------+--------------------------+------------+----------------+------------+
| e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74 | cloudify-aws-plugin |      1.4.4      |    centos    |    linux_x86_64    |         core         | 2017-04-04 07:02:54.526  |   tenant   | default_tenant |   admin    |
+--------------------------------------+---------------------+-----------------+--------------+--------------------+----------------------+--------------------------+------------+----------------+------------+

...
{{< /highlight >}}

### get

#### Usage 
`cfy plugins get [OPTIONS] PLUGIN_ID`

Retrieve information for a specific plugin.


`PLUGIN_ID` is the ID of the plugin for which to retrieve information.

#### Optional flags

* `-t, --tenant-name TEXT` - The name of the tenant of the plugin. If unspecified, the current tenant is used.
* `--get-data` - When set to True, displays the full list of connected resources (users/tenants/user-groups), for each listed resource. When set to False displays the total number of connected resources. (default:False)


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy plugins get e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74
...

Retrieving plugin e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74...

Plugin:
+--------------------------------------+---------------------+-----------------+--------------+--------------------+----------------------+--------------------------+------------+----------------+------------+
|                  id                  |     package_name    | package_version | distribution | supported_platform | distribution_release |       uploaded_at        | visibility |  tenant_name   | created_by |
+--------------------------------------+---------------------+-----------------+--------------+--------------------+----------------------+--------------------------+------------+----------------+------------+
| e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74 | cloudify-aws-plugin |      1.4.4      |    centos    |    linux_x86_64    |         core         | 2017-04-04 07:02:54.526  |   tenant   | default_tenant |   admin    |
+--------------------------------------+---------------------+-----------------+--------------+--------------------+----------------------+--------------------------+------------+----------------+------------+

...
{{< /highlight >}}

### validate

#### Usage 
`cfy plugins validate [OPTIONS] PLUGIN_PATH`

Validate a plugin.

This validates that the plugin's archive is not corrupted. A valid
plugin is a wagon (http://github.com/cloudify-cosomo/wagon) in the tar.gz
format.

`PLUGIN_PATH` is the path to wagon archive to validate.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy plugins validate cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn
...

Validating plugin cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn...
Plugin validated successfully

...
{{< /highlight >}}

### set-visibility

#### Usage
`cfy plugins set-visibility [OPTIONS] PLUGIN_ID`

Set the plugin's visibility

`PLUGIN_ID` - The id of the plugin to update.

#### Required flags

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['tenant', 'global'].

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy plugins set-visibility e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74 -l global
...

Plugin `e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74` was set to global

...
{{< /highlight >}}

### bundle-upload

#### Usage
`cfy plugins bundle-upload [OPTIONS]`

Upload a bundle of plugins to Cloudify Manager.


#### Optional flags

* `-p, --path TEXT` - Path to a plugins bundle file or URL. If unspecified, a default URL is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy plugins bundle-upload -p /dir/cloudify-plugins-bundle.tgz
...


{{< /highlight >}}

### update

#### Usage 
`cfy plugins update [OPTIONS] BLUEPRINT_ID`

Update the plugins of all the deployments of the blueprint

`BLUEPRINT_ID` the blueprint's ID to perform the plugins update with.

#### Optional flags 

*  `-q, --quiet`                 - Show only critical logs
*  `--format [plain|json]`
*  `-v, --verbose`               - Show verbose output. You can supply this up to
                              three times (i.e. -vvv)
*  `--json`
*  `-t, --tenant-name TEXT`      - The name of the tenant of the plugin. If not
                              specified, the current tenant will be used
*  `--include-logs / --no-logs`  - Include logs in returned events [default: True]
*  `--json-output`              -  Output events in a consumable JSON format
*  `-f, --force`                 Force running the update in case a previous
                              update on this blueprint has failed to finished
                              successfully.

#### Example

{{< highlight  bash  >}}
$ cfy plugin update openstack_blueprint
...

Updating the plugins of the deployments of the blueprint openstack_blueprint
2019-06-16 15:59:50.843  CFY <None> Starting 'update_plugin' workflow execution
2019-06-16 15:59:50.845  CFY <None> Executing deployment update for deployment openstack_blueprint_deployment...
2019-06-16 15:59:55.880  CFY <None> update_plugin workflow execution succeeded

...
{{< /highlight >}}

### get-update

#### Usage 
`cfy plugins get-update [OPTIONS] PLUGINS_UPDATE_ID`

Retrieve information for a specific plugins update

`PLUGINS_UPDATE_ID` is the id of the plugins update to get information on.

#### Optional flags 

* `-q, --quiet`             - Show only critical logs
* `--format [plain|json]`
* `-v, --verbose`           - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `--json`
* `-t, --tenant-name TEXT`  - The name of the tenant of the plugins update. If not specified, the current tenant will be used


#### Example

{{< highlight  bash  >}}
$ cfy plugin get-update 'bffee604-7133-43b0-9f5f-7a893bffd238'
...
{{< /highlight >}}


### history

#### Usage 
`cfy plugins history [OPTIONS]`

Show blueprint history by listing plugins updates

If `--blueprint-id` is provided, list plugins updates for that blueprint. Otherwise, list plugins updates for all blueprints.


#### Optional flags 

* `-b, --blueprint-id TEXT`         - The unique identifier for the blueprint
* `--sort-by TEXT`                  - Key for sorting the list
* `--descending`                    - Sort list in descending order [default: False]
* `-t, --tenant-name TEXT`          - The name of the tenant to list plugins updates from. If not specified, the current tenant will be used. You cannot use this argument with arguments: [all_tenants]
* `-a, --all-tenants`               - Include resources from all tenants associated with the user. You cannot use this argument with arguments: [tenant_name]
* `--search TEXT`                   - Search resources by name/id. The returned list will include only resources that contain the given search pattern
* `-o, --pagination-offset INTEGER` - The number of resources to skip; --pagination-offset=1 skips the first resource [default: 0]
* `-s, --pagination-size INTEGER`   - The max number of results to retrieve per page [default: 1000]
* `-q, --quiet`                     - Show only critical logs
* `--format [plain|json]`
* `-v, --verbose `                  - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `--json`


#### Example

{{< highlight  bash  >}}
$ cfy plugins history --blueprint-id 'fdse5u0d-6281-43h0-924f-7z693bflw945'
...
{{< /highlight >}}
