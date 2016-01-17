---
layout: bt_wiki
title: Packaging Your Plugin
category: Docs
draft: false
weight: 10050

---

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
To learn more about how to use wagon, see the [Wagon documentation](https://github.com/cloudify-cosmo/wagon).