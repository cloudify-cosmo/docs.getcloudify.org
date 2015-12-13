---
layout: bt_wiki
title: Overview
category: Docs
draft: false
weight: 1

---

While Cloudify itself provides a framework for orchestrating applications, the actual work of interacting with IaaS APIs and running scripts, Configuration Management tools, Monitoring tools and any other tools used when managing applications is done by what we call Plugins.

Much like Workflows, Plugins are Python code which provide an abstraction for using a certain tool by configuring its usage pattern within your Blueprint or for using a certain API for creating and configuring resources on a certain IaaS provider.

Let's take Cloudify's AWS Plugin for instance. The plugin allows you to configure nodes in your blueprint that will be mapped to different resources on AWS. You can declare Instances, Key-Pairs, Security Groups with rules, Elastic IPs and any other resource the plugin supports in your blueprint, and by running a workflow (namely, the Install Workflow), the resources will be created and configured (and potentially, stopped and deleted) when executing workflows.

To cover the two major types of plugins (IaaS and Management tools), let's also take the Docker plugin as an example in the context of the resources created using the AWS plugin. The Docker plugin will allow you to pull images and run containers on your provisioned instances.

# Plugin Development

You should check out the [Plugins Authoring Guide](plugins-authoring.html) if you want to write your own plugin for your chosen tool or IaaS provider.

The Python module which provides the API for a plugin to interact with Cloudify is called the cloudify-plugins-common module.
The module provides features for getting and setting context, downloading blueprint resources and much more and its reference can be found [here](apis-plugins-common.html).

# Working with plugins in an offline environment

The Cloudify manager exposes a plugins API, used to allow the installation of Python dependencies from pre-packed Python wheels. The plugins could come in handy for the following:

* Allowing installation of Python dependencies without needing access to PyPi or the internet.
* Eliminating the need for system level compilation tools such as gcc.

### Create An Offline Plugin Package

The official Cloudify tool used to create plugin packages is named [Wagon](https://github.com/cloudify-cosmo/wagon). In addition to the required module wheels, plugin packages created by Wagon also contain metadata regarding the plugin such as package name, compiled distribution, plugin package version and more.
The plugin metadata will be used to determine the compatibility of the plugin upon installation on the destination host. Wagon allows creating packages using PyPi or using the actual plugin source code, for example:
{{< gsHighlight  bash  >}}
$> cd /path/to/python-example-module
$> wagon create -s .
   INFO - Creating archive for ....
   INFO - Package name: python-example-module
   INFO - Package version: 1.0
   INFO - Downloading Wheels for ....
   INFO - Removing previous archive...
   INFO - Creating tar.gz archive: ./python_example_module-1.0-py27-none-linux_x86_64-Ubuntu-trusty.wgn...
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

Cloudify's Team provides a set of Official Plugins you can use. [Go check them out](plugins-official-general.html). You can also check the [Community Plugins](plugins-contrib-general.html) available which provide a different level of support.
