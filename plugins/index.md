---

title: Overview


weight: 1

---

While Cloudify itself provides a framework for orchestrating applications, the actual work of interacting with IaaS APIs and running scripts, Configuration Management tools, Monitoring tools and any other tools used when managing applications is done by what we call Plugins.

Much like Workflows, Plugins are Python code which provide an abstraction for using a certain tool by configuring its usage pattern within your Blueprint or for using a certain API for creating and configuring resources on a certain IaaS provider.

Let's take Cloudify's AWS Plugin for instance. The plugin allows you to configure nodes in your blueprint that will be mapped to different resources on AWS. You can declare Instances, Key-Pairs, Security Groups with rules, Elastic IPs and any other resource the plugin supports in your blueprint, and by running a workflow (namely, the Install Workflow), the resources will be created and configured (and potentially, stopped and deleted) when executing workflows.

To cover the two major types of plugins (IaaS and Management tools), let's also take the Docker plugin as an example in the context of the resources created using the AWS plugin. The Docker plugin will allow you to pull images and run containers on your provisioned instances.

Plugins can be used both using Cloudify CLI (for local workflows) or Cloudify Manager.

# Plugin Development

You should check out the [Creating Your Own Plugin]({{ relRef("plugins/creating-your-own-plugin.md") }}) page if you want to write your own plugin for your chosen tool or IaaS provider.

In order to learn how to use a plugin package, see the [Using plugins in your application]({{ relRef("plugins/using-plugins.md") }}) page.

The Python package which provides the API for a plugin to interact with Cloudify is called cloudify-plugins-common.
This package provides features for getting and setting context, downloading blueprint resources and much more and its reference can be found [here]({{ relRef("apis/plugins-common.html") }}).

