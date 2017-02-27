---
layout: bt_wiki
title: Creating a Cloudify Manager
category: Manager Intro
draft: false
weight: 300
---
A Cloudify Manager is a compute host that the Cloudify Management service runs on.

## Installation Methods

There are two ways of creating a Cloudify Manager. You can either start a preconfigured Cloudify Manager image or bootstrap your own Cloudify Manager on an existing compute host.

Starting a Cloudify Manager requires that you already have set up the infrastructure (VM, network, etc) on which to run the Cloudify Manager.

If you do not already have the infrastructure, and require help creating it, you can use one of the [infrastructure examples](https://github.com/cloudify-examples/aws-azure-openstack-blueprint) to create the infrastructure before you begin.

### Starting a Cloudify Manager from an Image

Several Cloudify Manager images are provided, in different formats and in various cloud providers' image marketplaces:

Formats:

* [QCow2](http://repository.cloudifysource.org/org/cloudify3/3.4.0/ga-RELEASE/manager3.4_insecure_image.qcow2)
* RAW 
* VHD 

Marketplaces:

* [AWS] (http://getcloudify.org/thank_you_aws.htm)
* Azure 
* GCP 
* others

Note that if you are starting Cloudify Manager from an image in one of our supported cloud providers, the infrastructure examples enable you to input the image's information. (This is the fastest way to start to a new Cloudify Manager.)

### Bootstrapping a Cloudify Manager

Bootstrapping consists of running a single Blueprint of the Cloudify Manager, which will install and configure all of the Cloudify components for you.

1. [Download the Cloudify CLI package](http://getcloudify.org/downloads/get_cloudify.html) to the host on which you want to install Cloudify.

2. Open the `simple-manager-blueprint-inputs.yaml` file.   
   You use the simple-manager-blueprint.yaml blueprint to bootstrap Cloudify.

3. Determine which components in the Blueprint that you need to change.   
   At the very least you must provide the correct values for `public_ip`, `private_ip`, `ssh_user`, `ssh_key_filename`, and `agents_user`. Refer to the documentation for what these values mean.

4. Start the bootstrap by running `cfy bootstrap --install-plugins -p simple-manager-blueprint.yaml -i inputs.yaml`.


