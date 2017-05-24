---
layout: bt_wiki
title: plugins
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 160
---

The `cfy plugins` command is used to manage plugins stored on a Cloudify manager.

You can use the command to upload, download, delete and list plugins and also to get information on a specific plugin.

A Cloudify plugin is an archive created by [wagon]({{< relref "http://github.com/cloudify-cosmo/wagon" >}}).

See [plugins]({{< relref "plugins/overview.md" >}}) for more information.


## Commands

### upload

Usage: `cfy plugins upload -p PLUGIN_FILE`

Upload a plugin to the manager.

#### Required flags

* `-p, --plugin-path=PLUGIN_FILE` - The path to the Cloudify plugin (`.wgn` file) you would like to upload.

{{% gsNote title="Note" %}}
Wagon (via the `--format` flag) allows to create archives in both `tar.gz` and `zip` formats. Cloudify only supports wagon in the `tar.gz` format.
{{% /gsNote %}}


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy plugins upload -p cloudify_script_plugin-1.2-py27-none-any-none-none.wgn
...

Validating plugin cloudify_script_plugin-1.2-py27-none-any-none-none.wgn...
Plugin validated successfully
Uploading plugin cloudify_script_plugin-1.2-py27-none-any-none-none.wgn
Plugin uploaded. The plugin's id is 965d1984-3ef1-485d-9e04-4c3f8cea11df

...
{{< /gsHighlight >}}


### download

Usage: `cfy plugins download [options] -p PLUGIN_ID`

Download a plugin archive from the manager.

#### Required flags

*  `-p, --plugin-id=PLUGIN_ID` - The ID of the plugin you would like to download.

#### Optional flags

* `-o, --output=OUTPUT_PATH` - The output path for the downloaded file.


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy plugins download -p 965d1984-3ef1-485d-9e04-4c3f8cea11df
...

Downloading plugin 965d1984-3ef1-485d-9e04-4c3f8cea11df...
Plugin downloaded as 965d1984-3ef1-485d-9e04-4c3f8cea11df.tar.gz

...
{{< /gsHighlight >}}


### delete

Usage: `cfy plugins delete [options] -s SNAPSHOT_ID` 

Delete a snapshot from the manager.

#### Required flags

* `-p, --plugin-id=PLUGIN_ID` - The ID of the plugin you would like to delete.

#### Optional flags

*  `-f, --force` - Delete a plugin even if there is a deployment which is currently using it.


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy plugins delete -p 965d1984-3ef1-485d-9e04-4c3f8cea11df
...

Deleting plugin 965d1984-3ef1-485d-9e04-4c3f8cea11df...
Plugin deleted

...
{{< /gsHighlight >}}


### list

Usage: `cfy plugins list` 

List all available plugins on the manager.
You can use this command to get the IDs of the plugins you would like to download or delete.


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy plugins list
...

Listing all plugins...

Plugins:
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+
|                  id                  |      package_name      | package_version | supported_platform | distribution | distribution_release |        uploaded_at         |
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+
| 965d1984-3ef1-485d-9e04-4c3f8cea11df | cloudify-script-plugin |       1.2       |        any         |     None     |         None         | 2016-06-29 07:38:46.547302 |
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+

...
{{< /gsHighlight >}}


### get

Usage: `cfy plugins get -p PLUGIN_ID` 

Retrieve information on a single plugin.

#### Required flags

* `-p, --plugin-id=PLUGIN_ID` - The ID of the plugin you would like to retrieve information for.


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy plugins get -p 965d1984-3ef1-485d-9e04-4c3f8cea11df
...

Retrieving plugin 965d1984-3ef1-485d-9e04-4c3f8cea11df...

Plugin:
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+
|                  id                  |      package_name      | package_version | supported_platform | distribution | distribution_release |        uploaded_at         |
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+
| 965d1984-3ef1-485d-9e04-4c3f8cea11df | cloudify-script-plugin |       1.2       |        any         |     None     |         None         | 2016-06-29 07:38:46.547302 |
+--------------------------------------+------------------------+-----------------+--------------------+--------------+----------------------+----------------------------+

...
{{< /gsHighlight >}}