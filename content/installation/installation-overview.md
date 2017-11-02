---
layout: bt_wiki
title: Overview of Cloudify Installation
category: Installation
draft: false
weight: 100
---
A Cloudify Manager is a compute host on which the Cloudify Management service runs. The key processes in getting Cloudify Manager up and running are installing the CLI, installing Cloudify Manager, and configuring the installed Manager.

1. To install the Cloudify CLI, [click here]({{< relref "installation/from-packages.md" >}}).
2. There are two options for installing Cloudify Manager. You can either [install from an image]({{< relref "installation/bootstrapping.md#option-1-installing-a-cloudify-manager-image" >}}) or [bootstrap via the CLI]({{< relref "installation/bootstrapping.md#option-2-bootstrapping-a-cloudify-manager" >}}).   <br>
   Either of these processes will result in a configuration-ready installation.

3. After Cloudify Manager is installed, you need to perform some configuration tasks. These include [uploading plugins]({{< relref "plugins/using-plugins.md" >}}) and [configuring secrets]({{< relref "manager/using-secrets.md" >}}).


### Uninstalling Cloudify

Instructions for uninstalling the Cloudify CLI from Windows are [located here]({{< relref "installation/uninstall-cloudify-cli.md" >}}).
test
