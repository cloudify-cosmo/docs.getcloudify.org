+++
title = "Getting Started Wizard vCloud"
description = "Getting started wizard vCloud"
weight = 97
alwaysopen = false
+++

The document describes the wizard steps and resources when vCloud technology is selected.

When you select vCloud technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

[cloudify-vsphere-plugin]{{ /working_with/official_plugins/infrastructure/aws/ }]


## Blueprints

The following blueprints will be installed:
None

## Secrets

The following secrets will be created:

vSphere Username (vsphere_username)
vSphere Password (vsphere_password)
vSphere Host (vsphere_host)
vSphere Datacenter Nameas (vsphere_datacenter_nameas)
vSphere Resource Pool Name (vsphere_resource_pool_name)
vSphere Auto Placement (vsphere_auto_placement)

NOTE: To be able successfully run all the blueprints the secrets should have the following permissions:
....

## Wizard Steps

When selecting AWS technologies AWS secret configuration step will be added to the flow. The summary page will include all the resources that will be created.
 
### Secret

The step that to configure AWS Secrets:


### Summary Page

The summary page will present the following items:
