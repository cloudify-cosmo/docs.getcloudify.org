---
layout: bt_wiki
title: Working With Plugins
category: Docs
draft: false
weight: 50

---

Cloudify Manager exposes a plugins API used to allow users to upload Cloudify plugins to Cloudify Manager and install them.

### Creating A Plugin Package

The official Cloudify tool used to create plugin packages is named [Wagon](https://github.com/cloudify-cosmo/wagon). In addition to wheels, plugin packages created by Wagon also contain metadata regarding the plugin such as package name, the distribution the plugin was compiled on (if not Pure Python), plugin package version and more.
The plugin's metadata will be used to determine the compatibility of the plugin with the host it is about to be installed on. Wagon allows creating packages directly from PyPI or using the actual plugin source code, for example:
{{< gsHighlight  bash  >}}
$> cd /path/to/plugin/root/dir
$> wagon create -s .
   INFO - Creating archive for ....
   INFO - Package name: python-example-package
   INFO - Package version: 1.0
   INFO - Downloading Wheels for ....
   INFO - Removing previous archive...
   INFO - Creating tar.gz archive: ./python_example_package-1.0-py27-none-linux_x86_64-Ubuntu-trusty.wgn...
   INFO - Process complete!

{{< /gsHighlight >}}
To learn more about how to create a plugin package, see the [Wagon documentation](https://github.com/cloudify-cosmo/wagon).

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
Cloudify enables uploading plugins to the Manager during bootstrap. For more on that, please refer to [Plugin Resources]({{< relref "blueprints/upload-resources.md" >}}#plugin-resources).
{{% /gsTip %}}

# What's Next

Cloudify's Team provides a set of Official Plugins you can use. You can find further details about them here, under the 'plugins' section.