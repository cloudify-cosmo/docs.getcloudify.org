---
layout: bt_wiki
title: Using Plugins in Your Application
category: Docs
draft: false
weight: 50

---


## Installing Plugins
Cloudify utilizes [Wagon](http://github.com/cloudify-cosmo/wagon) to [create]({{< relref "plugins/creating-your-own-plugin.md" >}}) and install plugins.

### Installing Plugins in the Cloudify CLI

To use plugins in the Cloudify CLI, install them via Wagon's command-line interface itself (which is installed alongside Cloudify CLI).

To install a plugin, run:

{{< gsHighlight  bash  >}}
wagon install -s /path/to/wagon/archive.wgn
...

INFO - Installing cloudify_aws_plugin-1.4.1.dev0-py27-none-linux_x86_64-none-none.wgn
...
{{< /gsHighlight >}}

{{% gsNote title="Note" %}}
`sudo` privileges might be required to use a Cloudify CLI package.
{{% /gsNote %}}

### Process Overview

### Configuring Plugins
To configure a plugin to work with your application, you ensure that required application-specific details, for example login credentials, are accessible to the plugin. There are three methods you can use to achieve this.

* Point to the secret storage in which the credentials are configured. This method enables you to store sensitive information such as login usernames and passwords that you might not want to expose to users who can access the details of the plugin in a secret safe. When a deployment is being executed, the plugin retrieves the data from the secret storage.

* Point to a blueprint inputs file in which the details are specified. 

* Specify the pathfile of the required inputs.

### Uploading Plugins to Cloudify Manager

You can upload and download plugins to and from Cloudify Manager, and can delete and list plugins already on a Manager. These functions are exposed by the REST client via the REST API, and through the CLI. 

Go to the [downloads page](http://getcloudify.org/downloads/plugin-packages.html) to view the list of downloadable plugin packages.


##### Procedure

To upload a plugin to Cloudify Manager, run the following command.

{{< gsHighlight  bash  >}}
$ cfy plugins upload /path/to/wagon/archive.wgn
...

Validating /path/to/wagon/archive.wgn
Plugin validated successfully
Uploading plugin '/path/to/wagon/archive.wgn' to management server x.x.x.215
Uploaded plugin successfully, plugin's id is: f82610f0-42d6-4ce4-9efa-9ad21e4fd557
...
{{< /gsHighlight >}}

The `cfy plugins` command exposes additional commands such as downloading and listing the plugins found on Cloudify Manager.

When a plugin is uploaded to Cloudify Manager, if it matches the Manager architecture, it is installed on it. The plugin
can then be used globally by all deployments that require it, as a `central_deployment_agent` plugin.
Conversely, when a plugin is deleted from Cloudify Manager, it is also uninstalled, unless it is being used by at least one
deployment, in which case the `delete` request fails.

### Uploading Wagons via the CLI

For instructions about uploading wagons via the CLI, [click here]({{< relref "cli/plugins.md" >}})


### Using Wagons in a Blueprint

After you have installed/uploaded a plugin, it is available for use in the blueprints in which the plugin is defined. For more information about defining a plugin in a blueprint, [click here]({{< relref "blueprints/spec-plugins.md" >}}).

{{% gsTip title="Uploading plugins during bootstrap" %}}
Cloudify enables plugins to be uploaded to Cloudify Manager during bootstrap. For more information, see [Plugin Resources]({{< relref "blueprints/spec-upload-resources.md" >}}).
{{% /gsTip %}}

### What's Next?