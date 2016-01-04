---
layout: bt_wiki
uid: workflows section
title: Upload Resources
category: Blueprints
draft: false
weight: 1900

---

# Declaration
The upload_resources section in the DSL is a dictionary comprises two subsections:

plugin_resources: designated for uploading plugins to the manager.
dsl_resources: designated for uploading resources needed for the process of parsing blueprints.
 
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

 
# Definition
Keyname	            |       Required	|   Type	    | Description
--------------------|-------------------|---------------|-------------------------
plugin_resources    | no	            |   list	    | A list of plugins (URLs or local paths) to be uploaded to the manager.
dsl_resources	    | no	            |   dict	    | A list of dictionaries each comprises a source_path and destination_path for each dsl_resource.
source_path	        | yes	            |   string	    | The source path for the dsl resource.
destination_path    | yes	            |   string	    | A relative destination path for the resource (relative to the file server home dir).
parameters          | no                |   dict        | Describes the different parameters for the upload of resources.
fetch_timout        | no                |   int         | **Available from cloudify 3.3.1**. Describes the timeout of fetching any resource (in seconds). applies mainly to the time required for the download of a resource. note that the timeout refers to an idle connection, and not the entire download process. Note that the `--task-retries` and `--task-retry-interval` args passed to the cli bootstrap command, apply to the resource fetch as well.

{{% gsNote title="Note" %}}
All plugins uploaded to the manager should be in [wgn](https://github.com/cloudify-cosmo/wagon) format. More on using plugin could be found [here]({{< relref "plugins/using-plugins.md" >}}).
{{% /gsNote %}}


# Examples
 
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

 