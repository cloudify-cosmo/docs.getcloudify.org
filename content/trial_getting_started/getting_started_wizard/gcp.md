+++
title = "Getting Started Wizard GCP"
description = "Getting started wizard GCP"
weight = 97
alwaysopen = false
+++

The document describes the wizard steps and resources when GCP technology is selected.

When you select GCP technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

* [cloudify-gcp-plugin]({{< relref "/working_with/official_plugins/infrastructure/gcp.md" >}})
* [cloudify-utilities-plugin]({{< relref "/working_with/official_plugins/utilities.md" >}})
* [cloudify-kubernetes-plugin]({{< relref "/working_with/official_plugins/orchestration/kubernetes.md" >}})


## Blueprints

The following blueprints will be installed:
* GCP-Basics-VM-Setup (gcp.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip)
* GCP-Basics-Simple-Service-Setup (gcp.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip)
* Kubernetes-GCP-GKE (blueprint.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-gcp-gke.zip)

## Secrets

The following secrets will be created:

- GCP Client_x509 Certificate URL (gcp_client_x509_cert_url)
- GCP Client E-mail (gcp_client_email)
- GCP Client ID (gcp_client_id)
- GCP Project ID (gcp_project_id)
- GCP Private Key ID (gcp_private_key_id)
- GCP Private Key (gcp_private_key)
- GCP Zone (gcp_zone)

NOTE: To be able successfully run all the blueprints the secrets should have the following permissions:
....

## Wizard Steps

When selecting AWS technologies AWS secret configuration step will be added to the flow. The summary page will include all the resources that will be created.
 
### Secret

The step that to configure AWS Secrets:


### Summary Page

The summary page will present the following items:
