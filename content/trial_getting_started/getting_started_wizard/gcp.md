+++
title = "GCP"
description = "Getting started wizard GCP"
weight = 100
alwaysopen = false
+++

The document describes the wizard steps and resources when GCP technology is selected.

When you select GCP technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

* [cloudify-gcp-plugin]({{< relref "/working_with/official_plugins/infrastructure/gcp.md" >}})
* [cloudify-utilities-plugin]({{< relref "/working_with/official_plugins/utilities/_index.md" >}})
* [cloudify-kubernetes-plugin]({{< relref "/working_with/official_plugins/orchestration/kubernetes.md" >}})


## Blueprints

The blueprints bellow will be installed, to get more information regarding the blueprint and how manually to install it click on the blueprint.

* [GCP-Basics-VM-Setup]({{< relref "/trial_getting_started/examples/basic/gcp_basics.md" >}})
* [GCP-Basics-Simple-Service-Setup]({{< relref "/trial_getting_started/examples/first_service/gcp_hello_world_example.md" >}})
* Kubernetes-GCP-GKE

## Secrets

The following secrets will be created:

* GCP Client_x509 Certificate URL (gcp_client_x509_cert_url)
* GCP Client E-mail (gcp_client_email)
* GCP Client ID (gcp_client_id)
* GCP Project ID (gcp_project_id)
* GCP Private Key ID (gcp_private_key_id)
* GCP Private Key (gcp_private_key)
* GCP Zone (gcp_zone)

NOTE: To be able successfully run all the blueprints the secrets should have the following permissions:
....

## Wizard Steps

When selecting AWS technologies AWS secret configuration step will be added to the flow. The summary page will include all the resources that will be created.
 
### Secret

The step that to configure AWS Secrets:


### Summary Page

The summary page will present the following items:
