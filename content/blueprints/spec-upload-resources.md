---
layout: bt_wiki
uid: workflows section
title: Upload Resources
category: Blueprints
draft: false
weight: 1900

---

Cloudify provides you with a simple way to upload resources to Cloudify Manager.

# Declaration

{{< gsHighlight  yaml >}}
upload_resources:
    plugin_resources:
     - ...
    dsl_resources:
     - 'source_path': ...
       'destination_path': ...
    parameters:
      fetch_timeout: ...
{{< /gsHighlight >}}


# Schema
Keyname	            |       Required	|   Type	    | Description
--------------------|-------------------|---------------|-------------------------
plugin_resources    | no	            |   list	    | A list of [wgn](https://github.com/cloudify-cosmo/wagon) plugins (URLs or local paths) to be uploaded to the Manager. For more information about plugins, [click here]({{< relref "plugins/using-plugins.md" >}}).
dsl_resources	    | no	            |   dict	    | A list of dictionaries, each of which comprises a source_path and destination_path for each dsl_resource.
source_path	        | yes	            |   string	    | The source path for the DSL resource.
destination_path    | yes	            |   string	    | A relative destination path for the resource (relative to the file server home directory).
parameters          | no                |   dict        | Describes the different parameters for the upload of resources.
fetch_timeout       | no                |   int         | The maximum idle time (in seconds) allowed while fetching any resource. Note that the timeout refers to an idle connection, not the entire download process. 

## Plugin Resources
The `plugin_resources` section uses the Plugins API to upload any plugin path specified. Every resource is a string representing either a local path or a URL.
{{% gsNote title="Note" %}}
All plugins uploaded to the Manager blueprint must be in [wgn](https://github.com/cloudify-cosmo/wagon) format.
{{% /gsNote %}}

## DSL Resources
The `dsl_resources` section enables you to upload any resource required for parsing blueprints. Every resource comprises a source_path and destination_path. 
The source path is either a local path or a URL. The destination path is relative to the home directory of the file server.

{{% gsNote title="Retries" %}}
The value passed to `--task-retries` and `--task-retry-interval` in the CLI bootstrap command, applies to resource fetching. Each resource is retried up to `--task-retries` times, at intervals of `--task-retry-interval` seconds.
{{% /gsNote %}}


# Example

{{< gsHighlight  yaml >}}
upload_resources:
    plugin_resources:
     - 'http://www.my-plugin.com/path/to/plugin.wgn'
    dsl_resources:
     - 'source_path': 'http://www.my-plugin.com/path/to/plugin.yaml'
       'destination_path': '/path/to/local/plugin.yaml'
    parameters:
      fetch_timeout: 20
{{< /gsHighlight >}}

In this example you see the upload of two different resources:

- In the `plugin_resources` section, the plugin.wgn is being uploaded. This plugin is used any time it is required by any blueprint.
- In the `dsl_resources` section, the yaml file for that plugin is being retrieved from 'http://www.my-plugin.com/path/to/plugin.yaml', and is being uploaded to the Manager's file server, with the relative path of '/path/to/local/plugin.yaml'. This resource is used anytime the Manager parses a blueprint that references this plugin yaml file.

Retrieving each resource is limited to 20 seconds.
