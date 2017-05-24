---
layout: bt_wiki
uid: workflows section
title: Upload Resources
category: Blueprints
draft: false
weight: 1900

---

Cloudify provides you with a simple way for uploading resources to the manager

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
plugin_resources    | no	            |   list	    | A list of [wgn](https://github.com/cloudify-cosmo/wagon) plugins (URLs or local paths) to be uploaded to the manager. More on plugins [here]({{< relref "plugins/using-plugins.md" >}}).
dsl_resources	    | no	            |   dict	    | A list of dictionaries each comprises a source_path and destination_path for each dsl_resource.
source_path	        | yes	            |   string	    | The source path for the dsl resource.
destination_path    | yes	            |   string	    | A relative destination path for the resource (relative to the file server home dir).
parameters          | no                |   dict        | Describes the different parameters for the upload of resources.
fetch_timeout       | no                |   int         | {{% tag %}}3.3.1 FEATURE {{% /tag %}} Max idle time (in seconds) while fetching any resource. Note that the timeout refers to an idle connection, and not the entire download process. 

## Plugin resources
The plugin_resources section uses the Plugins api to upload any plugin path specified. Every resource is a string representing either a local path or a URL.
{{% gsNote title="Note" %}}
All plugins uploaded to the manager blueprint should be in [wgn](https://github.com/cloudify-cosmo/wagon) format.
{{% /gsNote %}}

## DSL resources
The dsl_resources section enables you to upload any resource needed for parsing blueprints. Every resource comprises source_path and destination_path. 
The source path is either a local path or a URL, and the destination path is relative to the home dir of the file server.

{{% gsNote title="Retries" %}}
The value passed to `--task-retries` and `--task-retry-interval` in the cli bootstrap command, apply to the resource fetching. Each resource is retried up to `--task-retries` times, at intervals of `--task-retry-interval` seconds.
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

In this example we can see the upload of 2 different resources:

- In the `plugin_resources` section, the plugin.wgn is being uploaded. This plugin will be used any time this plugin is needed by any blueprint.
- In the `dsl_resources` section, the yaml file for that plugin is being retrieved from 'http://www.my-plugin.com/path/to/plugin.yaml', and is being uploaded to
the manager's file server with the relative path of '/path/to/local/plugin.yaml'. This resource will be used anytime the manager parses a blueprint which references
this plugin yaml file.

Retrieving each resource is limited to 20 seconds.
