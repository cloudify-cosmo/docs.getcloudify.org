+++
title = "vSphere"
description = "Getting started wizard vSphere"
weight = 150
alwaysopen = false
+++

The document describes the wizard steps and resources when vCloud technology is selected.

When you select vCloud technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

* [cloudify-vsphere-plugin]({{< relref "/working_with/official_plugins/infrastructure/vsphere.md" >}})


## Blueprints

The following blueprints will be installed:
None

## Secrets

The following secrets will be created. The value in parentheses is the secret name that will be created:

* vSphere Username (vsphere_username)
* vSphere Password (vsphere_password)
* vSphere Host (vsphere_host)
* vSphere Datacenter Nameas (vsphere_datacenter_nameas)
* vSphere Resource Pool Name (vsphere_resource_pool_name)
* vSphere Auto Placement (vsphere_auto_placement)