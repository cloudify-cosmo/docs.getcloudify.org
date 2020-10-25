---
layout: bt_wiki
title: IDE Auto Completion
category: Blueprints
draft: false
weight: 2000
aliases: /blueprints/built-in-types/
---

# General
This document is about how you can use your IDE to ensure your blueprint is valid and use auto complete functionality when writing a bluebrint.
The validation and autocomplete is done through a JSON schema.

In order to use the validation and autocompletion feature you need to save you blueprints in the following name convention `[BLUEPRINT_NAME].cfy.yaml`

# Supported IDEs
We use SchemaStore open source project to automatically distribute our JSON schema to IDEs

The integration provides Cloudify Json schema to be auto available in the following IDEs:

- IntelliJ IDEA
- PhpStorm
- PyCharm
- Rider
- RubyMine
- Visual Studio 2013+
- Visual Studio Code
- Visual Studio for Mac
- WebStorm
- JSONBuddy
  
# Functionalities
## Autocomplete
Similar to any programing language you can press `CTRL+SPACE` and it will suggest what are the available options.

## Property type validation
Each property is assigned to a specific type. The type can be integer, string, boolean, object, array. If the value is not of the right type the IDE will notify you about it.
[PICTURE]
## Suggest properties based on type
In the node templates when you specify type the JSON schema will suggest properties and interfaces that are available for that specific type.

As you can see in the images bellow the available properties for `type cloudify.rest.request` are different from `cloudify.nodes.ftp`

Cloudify Rest Request
[PICTURE]
Cloudify FTP
[PICTURE]

## Detect Missing Required Properties
If a mandatory field is expected and it's missing you'll get a notification.
[PICTURE]

## Property Description
For most of the properties a description is available. The description can assist you to understand what is the best way to use it.
[PICTURE]

## Detect not allowed property
Some of the objects are sealed to certain properties. If an unknown property is introduced it will show an error message. It's good in cases when an attribute is misspelled.
[PICTURE]
 
## Supported plugins
[x] cloudify-docker-plugin
[x] cloudify-kubernetes-plugin
[x] cloudify-ansible-plugin
[x] cloudify-terraform-plugin
[x] cloudify-helm
[x] cloudifu-aws-plugin (prtially)
[] cloudify-openstack-plugin
[] cloudify-utilities-plugin
[] cloudify-azure-plugin
[] cloudify-gcp-plugin
[] cloudify-vsphere-plugin
[] tosca-vcloud-plugin