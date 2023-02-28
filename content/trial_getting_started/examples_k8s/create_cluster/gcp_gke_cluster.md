+++
cloud_full = "Google Cloud Platform"
cloud = "GCP"
engine_full = "Google Kubernetes Engine"
engine = "GKE"
cloud_auth_ui_link = "https://cloud.google.com/iam/docs/service-accounts"
cloud_auth_cli_link = "https://cloud.google.com/iam/docs/service-accounts"
kubectl_cli_link = "https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html"
cloud_cli_link = "https://cloud.google.com/sdk/docs/install"

title = "GCP GKE"
description = "GCP GKE - Cluster provisioning"
weight = 27
alwaysopen = false
+++

This example demonstrates provisioning a **{{< param engine_full >}} ({{< param engine >}})** cluster on the **{{< param cloud >}}** cloud. The deployment consists of:

 * {{< param cloud >}} {{< param engine >}} cluster
 * Security group
 * Network
 * All of the essential peripherals in {{< param cloud >}} (IP address, NIC, etc.)

In this example, we will deploy only the cluster.
Later, in the more advanced examples (multi-cloud examples)
we will leverage this setup as the basis for deploying a containerized service.

## Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} installed and accessible
  * This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}})
* Access to {{< param cloud >}} infrastructure is required to demonstrate this example

#### {{< param cfy_cli_name >}} or {{< param cfy_console_name >}}?

{{< param product_name >}} allows for multiple user interfaces. Some users find the {{< param cfy_console_name >}} (web based UI) more intuitive while others prefer the {{< param cfy_cli_name >}} (Command Line Interface). This tutorial and all following ones will describe both methods.

* [Using the {{< param cfy_console_name >}}](#cloudify-management-console)
* [Using the {{< param cfy_cli_name >}}](#cloudify-cli)

{{% note %}}
Community version - Some of the options described in the guide are not available in the community version management console (web UI). An example would be setting up secrets. You can still perform all of the functionality using the {{< param cfy_cli_name >}}.
{{% /note %}}

## {{< param cfy_console_name >}}

This section explains how to run the above described steps using the {{< param cfy_console_name >}}.
The {{< param cfy_console_name >}} and {{< param cfy_cli_name >}} can be used interchangeably for all {{< param product_name >}} activities.



### Import Plugins and Secrets

To connect to {{< param cloud >}}, credentials and Cloudify plugins are required.
{{< param product_name >}} recommends storing such sensitive information in a {{< param product_name >}} secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about {{< param product_name >}} secrets [here]({{< relref "/working_with/manager/using-secrets.md" >}}).

{{< param cloud >}} credentials can be created by following the guide [here]({{< param cloud_auth_ui_link>}}).

To store the access keys as secrets in the {{< param cfy_manager_name >}}, log in to the {{< param cfy_console_name >}} and select the **Resources** page. In the **Secrets** panel, scroll to the **Secret Store Management** widget and use the **Create** button to add the following new secret:

* gcp_credentials

![Required secrets for this example]( /images/trial_getting_started/k8s/create_cluster/secrets-gcp-2.jpg )

#### Validate Secrets

To view the imported secrets in the {{< param cfy_manager_name >}}, log in to the {{< param cfy_console_name >}} and select the **Resources** page and navigate to the **Secrets** tab. The following secrets should exist after following the above steps:

* gcp_credentials

![Validate secrets for this example]( /images/trial_getting_started/k8s/create_cluster/gcp_secret_store.png )

### Import Kubernetes Blueprint

The {{< param cfy_manager_name >}} provides an easy method of provisioning a Kubernetes cluster on {{< param cloud >}} {{< param engine >}}. On the **Marketplace** page, navigate to the **Kubernetes Blueprint Examples** tab and upload the **Kubernetes-{{< param cloud >}}-{{< param engine >}}** blueprint. Once the blueprint will be uploaded you'll be redirected to create a deployment dialog.

![{{< param cloud >}} import blueprint]( /images/trial_getting_started/k8s/create_cluster/gke_select_from_marketplace.png )

### Deploy a {{< param cloud >}} {{< param engine >}} Cluster

* Create a *Deployment name*
* Adjust the *Zone* input to match your preferences

Click the **Install** button at the bottom of the form to start the deployment. On the following page, click the **Execute** button. 

![{{< param cloud >}} blueprints]( /images/trial_getting_started/k8s/create_cluster/gcp_gke_create_deployment.png )

You now have a {{< param product_name >}} Deployment running the default *install* workflow. {{< param product_name >}} will begin actively interfacing with {{< param cloud >}} to deploy a {{< param cloud >}} {{< param engine >}} Kubernetes cluster. You can track the status of the Deployment in the *Execution Task Graph* panel on the *Deployments* page. 

![{{< param cloud >}} Kubernetes cluster complete]( /images/trial_getting_started/k8s/create_cluster/gcp_gke_deployment.png )
____

## Using the {{< param cloud >}} {{< param engine >}} Cluster

### Install CLI Tools

#### Kubectl

{{< param cloud >}} documentation: [{{< param kubectl_cli_link >}}]({{< param kubectl_cli_link >}})

#### {{< param cloud >}} CLI

{{< param cloud >}} documentation: [{{< param cloud_cli_link >}}]({{< param cloud_cli_link >}})

To initialize Kubectl, go to the {{< param cloud >}} Console, navigate to the **Kubernetes Engine** page and in the dropdown for your cluster, click **Connect**. This will display a CLI command to use to set up the Kubectl config. 

![kubectl access]( /images/trial_getting_started/k8s/create_cluster/gcp-kubectl.jpg )

```bash
# Example GKE Kubectl init command
gcloud container clusters get-credentials ex2-cluster --zone europe-central2-a --project eaas-266314
```

### Verify Access

```bash
# List version
kubectl version --kubeconfig ~/.kube/config

# List namespaces
kubectl get ns --kubeconfig ~/.kube/config

# List nodes
kubectl get nodes --kubeconfig ~/.kube/config
```
