---
title: Writing Plugins
description: How to write and package plugins
weight: 30
alwaysopen: false
---

{{< param product_name >}} uses plugins to communicate with external services/systems.

Examples of external services include:

- Cloud services, such as AWS, GCP, Azure, Openstack, and VSphere.
- Container-management systems, such as Kubernetes.
- Configuration management tools, such as Ansible, Chef, and Puppet.
- Other methods used for communicating with service endpoints, such as HTTP and SSH.

For example:

* If your blueprint defines an Azure VM, you need the [Azure]({{< relref "working_with/official_plugins/Infrastructure/azure.md" >}}) plugin.
* If your blueprint defines a Kubernetes Deployment, you need the [Kubernetes]({{< relref "working_with/official_plugins/Orchestration/kubernetes.md" >}}) plugin.

Many services can be supported with a generic existing plugin, such as {{< param product_name >}}'s built-in [script plugin]({{< relref "working_with/official_plugins/Configuration/script.md" >}}).

for more information, see:

- How to work with [Configuration Management]({{< relref "developer/writing_plugins/creating-your-own-plugin.md" >}})
- How to work with [Containers]({{< relref "developer/writing_plugins/container-support.md" >}})


# Distribution

{{< param product_name >}} distributes plugins in [Wagon](https://github.com/cloudify-cosmo/wagon/blob/master/README.md) format. Wagon packages are a sets of Python [Wheels](https://packaging.python.org/tutorials/distributing-packages/#wheels) for dependency management. {{< param product_name >}} publishes official wagons, which are found on [plugins download page](http://cloudify.co/plugins).

_Note: The [Script plugin]({{< relref "working_with/official_plugins/Configuration/script.md" >}}) is distributed with {{< param product_name >}}._


# Plugin Installation

The first step to start using a plugin is to upload the plugin to your {{< param cfy_manager_name >}} tenant.

To upload a plugin:

- For UI usage, see [managing plugins]({{< relref "working_with/console/pages/plugins-page.md" >}}).
- For CLI usage, see [cfy plugins upload]({{< relref "cli/orch_cli/plugins.md#upload" >}}).


**Local Python Path Installation**

You can also install the wagon in your local Python path:

```
$ wagon install -s [path-to-wagon-file]
```

_Note: This method is available when working in a [Local CLI profile]({{< relref "cli/maint_cli/profiles.md">}})._


# Usage

Plugin usage inside of blueprints varies. However, these two general rules apply:

- Your blueprint must add an import statement for the plugins that are in use. See [importing]({{< relref "developer/blueprints/spec-imports.md" >}}) plugins for more information
- We still support importing the `plugin.yaml` of the plugins you want to use. See [spec-plugins]({{< relref "developer/blueprints/spec-plugins.md" >}}).
- If you don't use the `plugin:` import statement, either the `plugin.yaml` or your blueprint will map node lifecycle operations to appropriate plugin functions.

See specific plugin documentation for complete usage information.


# Plugin Development

{{< param product_name >}} plugins are Python projects with functions that that may be called by {{< param product_name >}}.

For more information, see [creating your own plugin]({{< relref "developer/writing_plugins/creating-your-own-plugin.md" >}}).

For a plugin template, see [plugin template](https://github.com/cloudify-cosmo/cloudify-plugin-template).

For information on packaging a plugin in wagon format, see [creating wagons]({{< relref "developer/writing_plugins/packaging-your-plugin.md" >}}).
