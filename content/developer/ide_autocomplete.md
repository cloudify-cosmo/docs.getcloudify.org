---
layout: bt_wiki
title: IDE Auto Completion
weight: 80
---

# General
This document describes the {{< param product_name >}} schema for IDEs allowing for a simpler & faster blueprint development via blueprint syntax validation and code auto-completion. 
The validation and autocomplete are done through a JSON schema. The schema source can be found in the link.

In order to use the validation and auto completion feature you need to save you blueprints in the following name convention `[BLUEPRINT_NAME].cfy.yaml`

# Supported IDEs
We use [SchemaStore](http://www.schemastore.org/json/) open source project to automatically distribute our JSON schema to IDEs

The integration provides a {{< param product_name >}} JSON schema which is automatically available in the following IDEs:

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

If your IDE is not in the list and supports JSON schema you can download the {{< param product_name >}} JSON Schema directly from our [repository](https://github.com/cloudify-cosmo/cloudify-dsl-schema)
   
# Functionality
## Autocomplete
Similar to any programming language, you can press `CTRL+SPACE` and it will suggest the available options.

## Property type validation
Each property is assigned to a specific type. The type can be integer, string, boolean, object, array. If the value is not of the right type the IDE will notify you about it.
![Cloudify components]( /images/blueprint/ide_autocomplete/wrong_property_type.png )
## Suggest properties based on type
In the node templates when you specify type the JSON schema will suggest properties and interfaces that are available for that specific type.

As you can see in the images below the available properties for `type cloudify.rest.request` are different from `cloudify.nodes.ftp`

{{< param product_name >}} Rest Request
![{{< param product_name >}} components]( /images/blueprint/ide_autocomplete/properties_rest_request.png )
Cloudify FTP
![Cloudify components]( /images/blueprint/ide_autocomplete/properties_ftp.png )

## Detect Missing Required Properties
If a mandatory field is expected and it's missing you'll get a notification.
![Cloudify components]( /images/blueprint/ide_autocomplete/property_missing.png )

## Property Description
For most of the properties a description is available. The description can assist you to understand what is the best way to use it.
![Cloudify components]( /images/blueprint/ide_autocomplete/property_description.png )

## Detect not allowed property
Some of the objects are sealed to certain properties. If an unknown property is introduced it will show an error message. It's good in cases when an attribute is misspelled.
![Cloudify components]( /images/blueprint/ide_autocomplete/property_not_allowed.png )
 
## Supported plugins
- [x] [cloudify-docker-plugin](https://github.com/cloudify-cosmo/cloudify-docker-plugin)
- [x] [cloudify-kubernetes-plugin](https://github.com/cloudify-cosmo/cloudify-kubernetes-plugin)
- [x] [cloudify-helm-plugin](https://github.com/cloudify-incubator/cloudify-helm-plugin)
- [x] [cloudify-ansible-plugin](https://github.com/cloudify-cosmo/cloudify-ansible-plugin)
- [x] [cloudify-terraform-plugin](https://github.com/cloudify-cosmo/cloudify-terraform-plugin)
- [x] [cloudifu-aws-plugin (prtially)](https://github.com/cloudify-cosmo/cloudify-aws-plugin)
- [x] [cloudify-openstack-plugin](https://github.com/cloudify-cosmo/cloudify-openstack-plugin)
- [x] [cloudify-utilities-plugin](https://github.com/cloudify-incubator/cloudify-utilities-plugin)
- [x] [cloudify-azure-plugin](https://github.com/cloudify-cosmo/cloudify-azure-plugin)
- [ ] [cloudify-gcp-plugin](https://github.com/cloudify-cosmo/cloudify-gcp-plugin)
- [ ] [cloudify-vsphere-plugin](https://github.com/cloudify-cosmo/cloudify-vsphere-plugin)
- [ ] [tosca-vcloud-plugin](https://github.com/cloudify-cosmo/tosca-vcloud-plugin)
