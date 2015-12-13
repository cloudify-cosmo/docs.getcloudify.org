---
layout: bt_wiki
title: Upload Resources
category: Blueprints
draft: false
weight: 1900

---

Cloudify provides you with a simple way for uploading resources to the manager. In the example below you can see how `upload_resource` section comprises two resource types: 
 
## DSL resources
The `dsl_resources` section enables you to upload any resource needed for parsing blueprints. Every resource comprises `source_path` and `destination_path`. The source path 
is either a local path or a URL, and the destination path is relative to the home dir of the file server.
## Plugin resources
The `plugin_resources` section uses the [Plugins]({{< relref "plugins/overview.md" >}}) api to upload any plugin path specified. Every resource is a string representing
either a local path or a URL. 
{{% gsNote title="Note" %}}
All plugins uploaded to the manager blueprint should be in [wgn](https://github.com/cloudify-cosmo/wagon) format. 
{{% /gsNote %}}

**Example:**
{{< gsHighlight  yaml  >}}
upload_resources:
    plugin_resources: 
     - 'http://www.my-plugin.com/path/to/plugin.wgn'
    dsl_resources: 
     - 'source_path': 'http://www.my-plugin.com/path/to/plugin.yaml'
       'destination_path': '/path/to/local/plugin.yaml'
{{< /gsHighlight >}}
