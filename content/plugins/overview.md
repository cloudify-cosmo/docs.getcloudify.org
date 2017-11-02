---
layout: bt_wiki
title: Overview
category: Docs
draft: false
weight: 1

---

Cloudify communicates with external services via plugins.

Examples of external services include:

- Cloud service APIs, such as AWS, GCP, Azure, Openstack, VSphere, and others.
- Container platforms, such as Kubernetes, GKE, AKS, ECS, Docker, etc.
- Configuration management tools, such as Ansible, Chef, Fabric (SSH), and Puppet.
- Other functions such as HTTP requests, REST service management, File management, etc.

For example, if your blueprint defines an Azure VM, you need the [Azure]({{< "plugins/azure.md" >}}) plugin. If your blueprint defines a Kubernetes Deployment, you need the [Kubernetes]({{< "plugins/kubernetes.md" >}}) plugin.


# Distribution

Cloudify distributes plugins in [Wagon](https://github.com/cloudify-cosmo/wagon/blob/master/README.md) format. Wagon packages sets of Python [Wheels](https://packaging.python.org/tutorials/distributing-packages/#wheels) for dependency management. Official Cloudify publishes wagons for official plugins on the [plugins download page](http://cloudify.co/plugins).

Plugin source code is also available at Github.

The [Script plugin]({{< relref "plugins/script.md" >}}) is distributed with Cloudify.


# Plugin Usage

In order to use a plugin, you must first upload the plugin Wagon to your Cloudify Manager tenant.

- For UI usage, see [managing system resources]({{< "manager_webui/plugins-snapshots-page.md#plugins" >}}).
- For CLI usage, see [cfy plugins upload]({{< relref "cli/plugins.md#upload" >}}).

Then you may use the plugin in your blueprints. See [importing]({{< relref "blueprints/spec-imports.md" >}}) plugins.

For more information, also see [using plugins]({{< "plugins/using-plugins.md" >}}).


# Plugin Development

Cloudify plugins are Python projects with functions that that may be called by Cloudify.

For more information, see [creating your own plugin]({{< relref "plugins/creating-your-own-plugin.md" >}}).

For a plugin template, see [plugin template](https://github.com/cloudify-cosmo/cloudify-plugin-template).
