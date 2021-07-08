+++
title = "Openstack v3"
description = "Getting started wizard Openstack v3"
weight = 130
alwaysopen = false
+++

The document describes the wizard steps and resources when Openstack v3 technology is selected.

When you select Openstack v3 technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

* [cloudify-openstack-plugin]({{< relref "/working_with/official_plugins/infrastructure/openstackv3.md" >}})
* [cloudify-utilities-plugin]({{< relref "/working_with/official_plugins/utilities/_index.md" >}})


## Blueprints

The blueprints bellow will be installed, to get more information regarding the blueprint and how manually to install it click on the blueprint.

* [OpenStack-Basics-VM-Setup]({{< relref "/trial_getting_started/examples/basic/openstack_basics.md" >}})
* [OpenStack-Basics-Simple-Service-Setup]({{< relref "/trial_getting_started/examples/first_service/openstack_hello_world_example" >}})

## Secrets

The following secrets will be created. The value in parentheses is the secret name that will be created:

* Openstack Username (openstack_username)
* Openstack Password (openstack_password)
* Openstack Auth Url (openstack_auth_url)
* Openstack Project Name (openstack_project_name)
* Openstack Tenant Name (openstack_tenant_name)