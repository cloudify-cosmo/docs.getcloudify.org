+++
title = "Azure"
description = "Getting started wizard Azure"
weight = 120
alwaysopen = false
+++

The document describes the wizard steps and resources when Azure technology is selected.

When you select Azure technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

* [cloudify-azure-plugin]({{< relref "/working_with/official_plugins/infrastructure/azure.md" >}})
* [cloudify-utilities-plugin]({{< relref "/working_with/official_plugins/utilities/_index.md" >}})
* [cloudify-kubernetes-plugin]({{< relref "/working_with/official_plugins/orchestration/kubernetes.md" >}})


## Blueprints

The blueprints bellow will be installed, to get more information regarding the blueprint and how manually to install it click on the blueprint.

* [Azure-Basics-VM-Setup]({{< relref "/trial_getting_started/examples/basic/azure_basics" >}})
* [Azure-Basics-Simple-Service-Setup]({{< relref "/trial_getting_started/examples/first_service/azure_hello_world_example.md" >}})
* [Azure-VM-Setup-using-ARM]({{< relref "/trial_getting_started/examples/automation_tools/azure_arm_basics.md" >}})
* Kubernetes-Azure-AKS

## Secrets

The following secrets will be created:

* Azure Subscription ID (azure_subscription_id)
* Azure Tenant ID (azure_tenant_id)
* Azure Client ID (azure_client_id)
* Azure Client Secret (azure_client_secret)

NOTE: To be able successfully run all the blueprints the secrets should have the following permissions:
....

## Wizard Steps

When selecting AWS technologies AWS secret configuration step will be added to the flow. The summary page will include all the resources that will be created.
 
### Secret

The step that to configure AWS Secrets:


### Summary Page

The summary page will present the following items:
