+++
title = "Getting Started Wizard Azure"
description = "Getting started wizard Azure"
weight = 97
alwaysopen = false
+++

The document describes the wizard steps and resources when Azure technology is selected.

When you select Azure technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

[cloudify-azure-plugin]{{ /working_with/official_plugins/infrastructure/aws/ }]
[cloudify-utilities-plugin]{{ }}
[cloudify-kubernetes-plugin]{{}}


## Blueprints

The following blueprints will be installed:
Azure-Basics-VM-Setup (azure.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip)
Azure-Basics-Simple-Service-Setup (azure.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip)
Azure-VM-Setup-using-ARM (azure-arm.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip)
Kubernetes-Azure-AKS (blueprint.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-azure-aks.zip)

## Secrets

The following secrets will be created:

Azure Subscription ID (azure_subscription_id)
Azure Tenant ID (azure_tenant_id)
Azure Client ID (azure_client_id)
Azure Client Secret (azure_client_secret)

NOTE: To be able successfully run all the blueprints the secrets should have the following permissions:
....

## Wizard Steps

When selecting AWS technologies AWS secret configuration step will be added to the flow. The summary page will include all the resources that will be created.
 
### Secret

The step that to configure AWS Secrets:


### Summary Page

The summary page will present the following items:
