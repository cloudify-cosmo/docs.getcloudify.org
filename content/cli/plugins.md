---
layout: bt_wiki
title: plugins
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 150
---

The `cfy plugins` command is used to manage plugins stored on a Cloudify manager.

You can use the command to upload, download, delete and list plugins and also to get information on a specific plugin.

A Cloudify plugin is an archive created by [wagon](http://github.com/cloudify-cosmo/wagon).

See [plugins]({{< relref "plugins/overview.md" >}}) for more information.

#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.

## Commands

### upload

#### Usage 
`cfy plugins upload [OPTIONS] PLUGIN_PATH`

Upload a plugin to Cloudify Manager.

`PLUGIN_PATH` is the path to the wagon archive to upload.

{{% gsNote title="Important" %}}
Wagon (via the `--format` flag) enables you to create archives in both `tar.gz` and `zip` formats. Cloudify only supports wagon in the `tar.gz` format.
{{% /gsNote %}}

#### Optional flags

* `-t, --tenant-name TEXT` - The name of the tenant of the plugin. If unspecified, the current tenant is used.
* `-y, --visibility TEXT` - Defines who can access the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy plugins upload cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn
...

Validating plugin cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn...
Plugin validated successfully
Uploading plugin cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn...
 cloudify_aws_plug... |################################################| 100.0%
Plugin uploaded. The plugin's id is e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74

...
{{< /gsHighlight >}}


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

{{< gsHighlight  bash  >}}
$ cfy plugins download e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74
...

Downloading plugin e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74...
 e90b1a09-6b56-4a9... |################################################| 100.0%
Plugin downloaded as e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74.tar.gz

...
{{< /gsHighlight >}}

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

{{< gsHighlight  bash  >}}
$ cfy plugins delete e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74
...

Deleting plugin e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74...
Plugin deleted

...
{{< /gsHighlight >}}

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


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
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
{{< /gsHighlight >}}

### get

#### Usage 
`cfy plugins get [OPTIONS] PLUGIN_ID`

Retrieve information for a specific plugin.


`PLUGIN_ID` is the ID of the plugin for which to retrieve information.

#### Optional flags

* `-t, --tenant-name TEXT` - The name of the tenant of the plugin. If unspecified, the current tenant is used.


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
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
{{< /gsHighlight >}}

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

{{< gsHighlight  bash  >}}
$ cfy plugins validate cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn
...

Validating plugin cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn...
Plugin validated successfully

...
{{< /gsHighlight >}}

### set-visibility

#### Usage
`cfy plugins set-visibility [OPTIONS] PLUGIN_ID`

Set the plugin's visibility

`PLUGIN_ID` - The id of the plugin to update.

#### Mandatory flags

* `-y, --visibility TEXT` - Defines who can access the resource, can be set to one of ['tenant', 'global']  [required].

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy plugins set-visibility e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74 -a global
...

Plugin `e90b1a09-6b56-4a92-b9cd-5fc4ef32ab74` was set to global

...
{{< /gsHighlight >}}
