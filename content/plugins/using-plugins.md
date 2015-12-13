---
layout: bt_wiki
title: Working With Plugins
category: Docs
draft: false
weight: 50

---

Cloudify Manager exposes a plugins API, used to allow the installation of Python dependencies from pre-packaged Python wheels. The plugins could come in handy for the following:

* Allowing installation of Python dependencies without needing access to PyPi or the internet.
* Eliminating the need for system level compilation tools such as gcc.

### Creating A Plugin Package

The official Cloudify tool used to create plugin packages is named [Wagon](https://github.com/cloudify-cosmo/wagon). In addition to the required package wheels, plugin packages created by Wagon also contain metadata regarding the plugin such as package name, compiled distribution, plugin package version and more.
The plugin metadata will be used to determine the compatibility of the plugin upon installation on the destination host. Wagon allows creating packages using PyPi or using the actual plugin source code, for example:
{{< gsHighlight  bash  >}}
$> cd /path/to/python-example-package
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

The Cloudify RESTful API enables the upload, download, delete and list of all plugins stored on the Cloudify manager. These abilities are available from the rest client as well as via the CLI. For example:

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

{{% gsTip title="Uploading plugins via manager blueprint" %}}
Cloudify enables uploading plugins via the manager blueprint. For more on that, please refer to [Plugin Resources]({{< relref "blueprints/upload-resources.md" >}}#plugin-resources).
{{% /gsTip %}}

# What's Next

Cloudify's Team provides a set of Official Plugins you can use. You can find further details about them here, under the 'plugins' section.