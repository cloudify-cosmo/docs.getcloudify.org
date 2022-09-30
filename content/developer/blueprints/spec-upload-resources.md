---
uid: workflows section
title: Upload Resources
category: Blueprints
draft: false
weight: 1900
aliases: /blueprints/spec-upload-resources/
---

You can package resources with your blueprint that you would like to be uploaded to your {{< param cfy_manager_name >}}.

# Declaration

{{< highlight  yaml >}}
upload_resources:
    plugin_resources:
     - https://the-url-of-some-plugin-wagon/file.wgn
    dsl_resources:
     - 'source_path': a/path/that/is/relative/to/the/blueprint/archive/root.file
       'destination_path': /the/destination/file/path/on/your/cloudify/manager/filesystem
    parameters:
      fetch_timeout: 10
{{< /highlight >}}


# Schema
Keyname	            |       Required	|   Type	    | Description
--------------------|-------------------|---------------|-------------------------
plugin_resources    | no	            |   list	    | A list of [wgn](https://github.com/cloudify-cosmo/wagon) plugins (URLs or local paths) to be uploaded to the Manager. For more information about plugins, [click here]({{< relref "working_with/official_plugins/_index.md" >}}).
dsl_resources	    | no	            |   dict	    | A list of dictionaries, each of which comprises a source_path and destination_path for each dsl_resource.
source_path	        | yes	            |   string	    | The source path for the DSL resource.
destination_path    | yes	            |   string	    | A relative destination path for the resource (relative to the file server home directory).
parameters          | no                |   dict        | Describes the different parameters for the upload of resources.
fetch_timeout       | no                |   int         | The maximum idle time (in seconds) allowed while fetching any resource. Note that the timeout refers to an idle connection, not the entire download process.

## Plugin Resources
The `plugin_resources` section uses the Plugins API to upload any plugin path specified. Every resource is a string representing either a local path or a URL.
{{% note title="Note" %}}
All plugins uploaded to the Manager blueprint must be in [wgn](https://github.com/cloudify-cosmo/wagon) format.
{{% /note %}}

## DSL Resources
The `dsl_resources` section enables you to upload any resource required for parsing blueprints. Every resource comprises a source_path and destination_path.
The source path is either a local path or a URL. The destination path is relative to the home directory of the file server.

{{% note title="Retries" %}}
During manager installation, it is possible to set the `task_retries` and `task_retry_interval` parameters in the `mgmtworker.workflows` section of the config.yaml file. They can also be changed at any time using the CLI (`cfy config`).
{{% /note %}}


# Example

{{< highlight  yaml >}}
upload_resources:
    plugin_resources:
     - 'http://www.my-plugin.com/path/to/plugin.wgn'
    dsl_resources:
     - 'source_path': 'http://www.my-plugin.com/path/to/plugin.yaml'
       'destination_path': '/opt/cfy/plugins/my-plugin-name/plugin.yaml'
    parameters:
      fetch_timeout: 20
{{< /highlight >}}

In this example you see the upload of two different resources:

- In the `plugin_resources` section, the plugin.wgn is being uploaded. This plugin is used any time it is required by any blueprint.
- In the `dsl_resources` section, the yaml file for that plugin is being retrieved from 'http://www.my-plugin.com/path/to/plugin.yaml', and is being uploaded to the Manager's file server, with the relative path of '/opt/cfy/plugins/my-plugin-name/plugin.yaml'. This resource is used anytime the Manager parses a blueprint that references this plugin yaml file.

The maximum idle time during resource download is limited to 20 seconds.
