---
layout: bt_wiki
title: Overview
category: Docs
draft: false
weight: 1

---

Cloudify communicates with external services via plugins.

Examples of external services include:

- Cloud services, such as AWS, GCP, Azure, Openstack, and VSphere.
- Container-management systems, such as Kubernetes.
- Configuration management tools, such as Ansible, Chef, and Puppet.
- Other types of services used for resource management, such as HTTP, SSH, and REST.

For example, if your blueprint defines an Azure VM, you need the [Azure]({{< relref "plugins/azure.md" >}}) plugin. If your blueprint defines a Kubernetes Deployment, you need the [Kubernetes]({{< relref "plugins/kubernetes.md" >}}) plugin.

Many can be supported with existing plugins, such as [script plugin]({{< relref "plugins/script.md" >}}), for more information, see:

- How to work with [Configuration Management]({{< relref "plugins/creating-your-own-plugin.md" >}})
- How to work with [Containers]({{< relref "plugins/container-support.md" >}})


# Distribution

Cloudify distributes plugins in [Wagon](https://github.com/cloudify-cosmo/wagon/blob/master/README.md) format. Wagon packages sets of Python [Wheels](https://packaging.python.org/tutorials/distributing-packages/#wheels) for dependency management. Official Cloudify publishes wagons for official plugins on the [plugins download page](http://cloudify.co/plugins).

_Note: The one exception to this rule is the [Script plugin]({{< relref "plugins/script.md" >}}) is distributed with Cloudify._


# Plugin Installation

The first step to using a plugin is to upload the plugin to your Cloudify Manager tenant.

To upload a plugin:

- For UI usage, see [managing system resources]({{< relref "manager_webui/plugins-snapshots-page.md#plugins" >}}).
- For CLI usage, see [cfy plugins upload]({{< relref "cli/plugins.md#upload" >}}).


**Local Python Path Installation**

You can also install the wagon in your local Python path:

```
$ wagon install -s [path-to-wagon-file]
```

_Note: This method is available when working in a [Local CLI profile]({{< relref "cli/profiles.md ">}})._


# Usage

Plugin usage inside of blueprints varies. However, these two general rules apply:

- Your blueprint must import the `plugin.yaml`. See [importing]({{< relref "blueprints/spec-imports.md" >}}) plugins for information on that. See also [spec-plugins]({{< relref "blueprints/spec-plugins.md" >}}).
- Either the `plugin.yaml` or your blueprint will map node lifecycle operations to appropriate plugin functions.

See your desired plugin's documentation for complete usage information. 


# Plugin Development

Cloudify plugins are Python projects with functions that that may be called by Cloudify.

For more information, see [creating your own plugin]({{< relref "plugins/creating-your-own-plugin.md" >}}).

For a plugin template, see [plugin template](https://github.com/cloudify-cosmo/cloudify-plugin-template).

For information on packaging a plugin in wagon format, see [creating wagons]({{< relref "plugins/packaging-your-plugin.md" >}}).