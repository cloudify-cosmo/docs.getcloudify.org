---
layout: bt_wiki
title: Using Plugins in Your Application
category: Docs
draft: false
weight: 50

---

Cloudify Manager exposes a plugins API used to allow users to upload Cloudify plugins to Cloudify Manager and install them.

### Using Plugins

Cloudify's RESTful API enables the uploading, downloading, deletion and listing of all plugins stored on the Manager. These abilities are exposed by the rest client as well as via the CLI. For example:

{{< gsHighlight  bash  >}}
$> cfy plugins upload -p /path/to/wagon/archive.wgn

   Validating /path/to/wagon/archive.wgn
   Plugin validated successfully
   Uploading plugin '/path/to/wagon/archive.wgn' to management server x.x.x.215
   Uploaded plugin successfully, plugin's id is: f82610f0-42d6-4ce4-9efa-9ad21e4fd557
{{< /gsHighlight >}}

After uploading the relevant plugin, blueprints can make use of it by having the plugin defined in the blueprint itself.


{{% gsNote title="Note" %}}
Read more about how to define the plugin in the blueprint [here]({{< relref "blueprints/spec-plugins.md" >}}).
{{% /gsNote %}}

{{% gsNote title="Note" %}}
Pre-packaged plugins that were uploaded to Cloudify Manager eliminate the need for access to PyPI or the internet, and for system level compilation tools (such as gcc) during installation.
{{% /gsNote %}}

{{% gsTip title="Uploading plugins during bootstrap" %}}
Cloudify enables uploading plugins to the Manager during bootstrap. For more on that, please refer to [Plugin Resources]({{< relref "blueprints/spec-upload-resources.md" >}}).
{{% /gsTip %}}

# What's Next

Cloudify's Team provides a set of Official Plugins you can use. You can find further details about them here, under the 'plugins' section.

You can also write your own plugin. To see how, read [this]({{< relref "plugins/creating-your-own-plugin.md" >}}).
