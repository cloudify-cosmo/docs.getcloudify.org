+++
title = "Getting Started Wizard Openstack v3"
description = "Getting started wizard Openstack v3"
weight = 97
alwaysopen = false
+++

The document describes the wizard steps and resources when Openstack v3 technology is selected.

When you select Openstack v3 technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

[cloudify-openstack-plugin]{{ /working_with/official_plugins/infrastructure/aws/ }]
[cloudify-utilities-plugin]{{ }}


## Blueprints

The following blueprints will be installed:
OpenStack-Basics-VM-Setup (openstack.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip)
OpenStack-Basics-Simple-Service-Setup (openstack.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip)

## Secrets

The following secrets will be created:

Openstack Username (openstack_username)
Openstack Password (openstack_password)
Openstack Auth Url (openstack_auth_url)
Openstack Project Name (openstack_project_name)
Openstack Tenant Name (openstack_tenant_name)

NOTE: To be able successfully run all the blueprints the secrets should have the following permissions:
....

## Wizard Steps

When selecting AWS technologies AWS secret configuration step will be added to the flow. The summary page will include all the resources that will be created.
 
### Secret

The step that to configure AWS Secrets:


### Summary Page

The summary page will present the following items:
