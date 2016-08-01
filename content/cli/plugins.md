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


## Commands

### upload

Usage: `cfy plugins upload [OPTIONS] PLUGIN_PATH`

Upload a plugin to the manager

`PLUGIN_PATH` is the path to wagon archive to upload.

{{% gsNote title="Note" %}}
Wagon (via the `--format` flag) allows to create archives in both `tar.gz` and `zip` formats. Cloudify only supports wagon in the `tar.gz` format.
{{% /gsNote %}}


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

Usage: `cfy plugins download [OPTIONS] PLUGIN_ID`

Download a plugin from the manager

`PLUGIN_ID` is the id of the plugin to download.

#### Optional flags

* `-o, --output-path TEXT` -	
						The local path to download to


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

Usage: `cfy plugins delete [OPTIONS] PLUGIN_ID`

Delete a plugin from the manager

`PLUGIN_ID` is the id of the plugin to delete.Delete a snapshot from the manager.

#### Optional flags

*  `-f, --force` -    	Delete the plugin even if there are deployments which are currently using it


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

Usage: `cfy plugins list [OPTIONS]`

List all available plugins on the manager.
You can use this command to get the IDs of the plugins you would like to download or delete.

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

Usage: `cfy plugins get [OPTIONS] PLUGIN_ID`

Retrieve information for a specific plugin

`PLUGIN_ID` is the id of the plugin to get information on.

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

Usage: `cfy plugins validate [OPTIONS] PLUGIN_PATH`

Validate a plugin

This will try to validate the plugin's archive is not corrupted. A valid
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