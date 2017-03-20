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

A Cloudify plugin is an archive created by [wagon]({{< relref "http://github.com/cloudify-cosmo/wagon" >}}).

See [plugins]({{< relref "plugins/overview.md" >}}) for more information.

#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.

## Commands

### add-permission

#### Usage 
` cfy plugins [OPTIONS] COMMAND [ARGS]`

Add `viewer`/`owner` permissions to users on a specific plugin.

`PLUGIN_ID` is the ID of the plugin on which to set permissions.

Optional flags:

*  `-u, --users TEXT` -  The user name of the user to whom the permissions
                                  apply. This argument can be used multiple
                                  times. [required]
*  `-p, --permission [viewer|owner]` - The permission applicable to a resource
                                  [viewer|owner]. (Default:viewer)
*  `-t, --tenant-name TEXT` - The name of the tenant of the plugin. If unspecified, the current tenant is used.

### upload

#### Usage 
`cfy plugins upload [OPTIONS] PLUGIN_PATH`

Upload a plugin to Cloudify Manager.

`PLUGIN_PATH` is the path to the wagon archive to upload.

{{% gsNote title="Important" %}}
Wagon (via the `--format` flag) enables you to create archives in both `tar.gz` and `zip` formats. Cloudify only supports wagon in the `tar.gz` format.
{{% /gsNote %}}

#### Optional flags

* `--private-resource` -  If set to `True`, the uploaded resource is only accessible by its creator. Otherwise, the resource
                          is accessible by all users that belong to the same tenant. (default: False)
* `-t, --tenant-name TEXT` - The name of the tenant of the plugin. If unspecified, the current tenant is used.



&nbsp;
#### Example

```markdown
$ cfy plugins upload cloudify_aws_plugin-1.4.2.dev0-py27-none-macosx_10_11_x86_64-none-none.wgn
...

Validating plugin cloudify_aws_plugin-1.4.2.dev0-py27-none-macosx_10_11_x86_64-none-none.wgn...
Plugin validated successfully
Uploading plugin cloudify_aws_plugin-1.4.2.dev0-py27-none-macosx_10_11_x86_64-none-none.wgn...
 cloudify_aws_plug... |################################################| 100.0%
Plugin uploaded. The plugin's id is ab313b30-ffc6-4c16-9ae5-600deb34cd4b

...
```


### download

#### Usage 
`cfy plugins download [OPTIONS] PLUGIN_ID`

Download a plugin from the manager.

`PLUGIN_ID` is the ID of the plugin to download.

#### Optional flags

* `-o, --output-path TEXT` -	
						The local path for the download.
* `-t, --tenant-name TEXT` - The name of the tenant of the plugin. If unspecified, the current tenant is used.
						

&nbsp;
#### Example

```markdown
$ cfy plugins download 965d1984-3ef1-485d-9e04-4c3f8cea11df
...

Downloading plugin ab313b30-ffc6-4c16-9ae5-600deb34cd4b...
 ab313b30-ffc6-4c1... |################################################| 100.0%
Plugin downloaded as ab313b30-ffc6-4c16-9ae5-600deb34cd4b.tar.gz

...
```


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

```markdown
$ cfy plugins delete 965d1984-3ef1-485d-9e04-4c3f8cea11df
...

Deleting plugin 965d1984-3ef1-485d-9e04-4c3f8cea11df...
Plugin deleted

...
```

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

```markdown
$ cfy plugins list
...

Listing all plugins...

Plugins:
+--------------------------------------+---------------------+-----------------+---------------------+--------------+----------------------+--------------------------+
|                  id                  |     package_name    | package_version |  supported_platform | distribution | distribution_release |       uploaded_at        |
+--------------------------------------+---------------------+-----------------+---------------------+--------------+----------------------+--------------------------+
| ab313b30-ffc6-4c16-9ae5-600deb34cd4b | cloudify-aws-plugin |    1.4.2.dev0   | macosx_10_11_x86_64 |     None     |         None         | 2016-08-11T08:43:38.043Z |
+--------------------------------------+---------------------+-----------------+---------------------+--------------+----------------------+--------------------------+

...
```

### get

#### Usage 
`cfy plugins get [OPTIONS] PLUGIN_ID`

Retrieve information for a specific plugin.

`PLUGIN_ID` is the ID of the plugin for which to retrieve information.

#### Optional flags

* `-t, --tenant-name TEXT` - The name of the tenant of the plugin. If unspecified, the current tenant is used.


&nbsp;
#### Example

```markdown
$ cfy plugins get ab313b30-ffc6-4c16-9ae5-600deb34cd4b
...

Retrieving plugin ab313b30-ffc6-4c16-9ae5-600deb34cd4b...

Plugin:
+--------------------------------------+---------------------+-----------------+---------------------+--------------+----------------------+--------------------------+
|                  id                  |     package_name    | package_version |  supported_platform | distribution | distribution_release |       uploaded_at        |
+--------------------------------------+---------------------+-----------------+---------------------+--------------+----------------------+--------------------------+
| ab313b30-ffc6-4c16-9ae5-600deb34cd4b | cloudify-aws-plugin |    1.4.2.dev0   | macosx_10_11_x86_64 |     None     |         None         | 2016-08-11T08:43:38.043Z |
+--------------------------------------+---------------------+-----------------+---------------------+--------------+----------------------+--------------------------+

...
```

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

```markdown
$ cfy plugins validate cloudify_aws_plugin-1.4.2.dev0-py27-none-macosx_10_11_x86_64-none-none.wgn
...

Validating plugin cloudify_aws_plugin-1.4.2.dev0-py27-none-macosx_10_11_x86_64-none-none.wgn...
Plugin validated successfully

...
```

### remove-permission

#### Usage 
`cfy plugins remove-permission [OPTIONS] PLUGIN_ID`

Remove `viewer`/`owner` permissions from users on a specific plugin.

`PLUGIN_ID` is the ID of the plugin from which to remove permissions.

#### Optional flags

*  `-u, --users TEXT` - Username of user to whom the permissions
                                  apply. This argument can be used multiple
                                  times. [required]
*  `-p, --permission [viewer|owner]` - The permission applicable to a resource
                                  [viewer|owner]. (Default:viewer)
*  `-t, --tenant-name TEXT` -  The name of the tenant of the plugin. If unspecified, the current tenant is used.
