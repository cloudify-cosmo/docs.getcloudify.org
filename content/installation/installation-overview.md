---
layout: bt_wiki
title: Installing Cloudify Manager
category: Installation
draft: false
weight: 100
---
A Cloudify Manager is a compute host that runs the Cloudify Management service runs. For version 4.3 and higher, you can install a single rpm file that installs Cloudify Manager with all of its dependencies. This installation also includes plugins and blueprints so you can run a demonstration of the Cloudify features. You can then install the Cloudify CLI to manage your Cloudify Manager remotely.

### Installing Cloudify Manager

_To install Cloudify Manager:_

1. Go to the download page of the [Cloudify website](http://cloudify.co/download/).
2. Copy the link address for the Cloudify Manager rpm file.
3. From the CLI of your target host, run: _sudo yum install \<rpm file link address>_
   
   For example: _sudo yum install http://cloudify-release-eu.s3.amazonaws.com/cloudify/4.3.0/release/cloudify-manager-install-4.3ga.x86_64.rpm_

After Cloudify Manager is installed, you must configure your Cloudify Manager for your environment, including [uploading plugins]({{< relref "plugins/using-plugins.md" >}}) and [configuring secrets]({{< relref "manager/using-secrets.md" >}}).

### Uninstalling Cloudify Manager

To uninstall the Cloudify Manager, run: _cfy_manager remove_

### Installing Cloudify CLI

To install the Cloudify CLI, see the [CLI installation instructions]({{< relref "installation/from-packages.md" >}}).

### Uninstalling Cloudify CLI

To uninstall the Cloudify CLI, see the [CLI uninstallation instructions]({{< relref "installation/uninstall-cloudify-cli.md" >}}).
