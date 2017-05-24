---
layout: bt_wiki
title: Overview
category: Docs
draft: false
weight: 1

---

While Cloudify itself provides a framework for orchestrating applications, the actual work of interacting with IaaS APIs and running scripts, configuration management tools, monitoring tools and any other tools used when managing applications is performed using _plugins_. There are two major types of plugins, IaaS plugins and management tool plugins.

Like workflows, plugins are Python code that provide an abstraction for using a specific tool by configuring its usage pattern within your blueprint, or for using a specific API to create and configure resources on a specific IaaS provider. For example, the Cloudify AWS plugin enables you to configure nodes in your blueprint that will be mapped to different resources on AWS. You can declare instances, key-pairs, security groups with rules, Elastic IPs and any other resource that the plugin supports in your blueprint. By running a workflow (in this case, the Install workflow), the resources will be created and configured (and potentially, stopped and deleted) when the g workflow is executed.

The Docker plugin provides an example in the context of the resources created using the AWS plugin. The Docker plugin enables you to pull images and run containers on your provisioned instances.

Plugins can be used with the Cloudify CLI (for local workflows) and Cloudify Manager.

# Plugin Development

Many plugins are provided by Cloudify out-of-the-box, but you can also write your own plugins for your preferred tools or IaaS provider. For further information, see [Creating Your Own Plugin]({{< relref "plugins/creating-your-own-plugin.md" >}}).

To learn how to use a plugin package, see [Using plugins in your application]({{< relref "plugins/using-plugins.md" >}}).

The Python package, which provides the API for a plugin to interact with Cloudify, is called `cloudify-plugins-common`.
This package provides features for getting and setting context, downloading blueprint resources, and more. You can access its reference [here]({{< relref "apis/plugins-common.html" >}}).

