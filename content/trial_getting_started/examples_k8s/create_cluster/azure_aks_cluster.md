+++
cloud_full = "Azure"
cloud = "Azure"
engine_full = "Azure Kubernetes Service"
engine = "AKS"
cloud_auth_ui_link = "https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli"
cloud_auth_cli_link = "https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli"
kubectl_cli_link = "https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html"
cloud_cli_link = "https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"

title = "Azure AKS"
description = "Azure AKS - Cluster provisioning"
weight = 27
alwaysopen = false
+++

This example demonstrates provisioning a **{{< param engine_full >}} ({{< param engine >}})** cluster on the **{{< param cloud >}}** cloud. The deployment consists of:

 * {{< param cloud >}} {{< param engine >}} cluster
 * Security Group
 * Network
 * All of the essential peripherals in {{< param cloud >}} (IP address, NIC, etc...).

In this example we will deploy only the cluster.
Later, in the more advanced examples (multi cloud examples)
we will leverage this setup as the basis for deploying a containerized service.

## Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} installed and accessible.
  * This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).
* Access to {{< param cloud >}} infrastructure is required to demonstrate this example. 
* Credentials to Azure. You'll need **Subscription ID**, ** Tenant ID**, **Client ID**, and **Client Secret**

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

To connect to {{< param cloud >}}, credentials and {{< param product_name >}} plugins are required.
{{< param product_name >}} recommends storing such sensitive information in a {{< param product_name >}} secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about {{< param product_name >}} secrets [here]({{< relref "/working_with/manager/using-secrets.md" >}}).

{{< param cloud >}} credentials can be created by following the guide [here]({{< relref "working_with/official_plugins/Infrastructure/azure.md" >}}).

{{< param product_name >}} version 6+ offers a fast-track process to import both credentials and all necessary plugins. As soon as the {{< param cfy_console_name >}} loads, it will present several "getting started" options. Choose the {{< param cloud >}} option and enter the requested credentials to automatically import the required secrets and plugins.

![{{< param cloud >}} getting started]( /images/trial_getting_started/k8s/create_cluster/azure_setup_cloud.png )

![{{< param cloud >}} import access]( /images/trial_getting_started/k8s/create_cluster/azure_secrets.png )

![{{< param cloud >}} import summary]( /images/trial_getting_started/k8s/create_cluster/azure_summary.png )

#### Validate Secrets

To view the imported secrets in the {{< param cfy_manager_name >}}, login to the {{< param cfy_console_name >}} and select the **Resources** page and navigate to the **Secrets** tab. The following secrets should exist after following the above steps:

* azure_subscription_id
* azure_tenant_id
* azure_client_id
* azure_client_secret

**Notes**

* `azure_subscription_id` - the account subscription ID.
* `azure_tenant_id` - the Service Principal `tenant`.
* `azure_client_id` - the Service Principal `appId`.
* `azure_client_secret` - the Service Principal `password`.

![Validate secrets for this example]( /images/trial_getting_started/k8s/create_cluster/azure_secret_store.png )

#### Validate Plugins

To view the imported plugins in the {{< param cfy_manager_name >}}, login to the {{< param cfy_console_name >}} and select the **Resources** page and navigate to the **Plugins** tab. The following plugins should exist after following the above steps:

* Azure
* Kubernetes
* Utilities

![Required plugins for this example]( /images/trial_getting_started/k8s/create_cluster/azure_plugins.png )

### Deploy an {{< param cloud >}} {{< param engine >}} Cluster

On the **Blueprints** page, click the **Create deployment** button for the **Kubernetes-{{< param cloud >}}-{{< param engine >}}** blueprint. 

* Create a *Deployment name*.
* Adjust the *Zone* input to match your preferences.

Click the **Deploy & Install** button at the bottom of the form to start the deployment. On the following page, click the **Execute** button. 

![{{< param cloud >}} blueprints]( /images/trial_getting_started/k8s/create_cluster/azure_aks_create_deployment.png )

You now have a {{< param product_name >}} Deployment running the default *install* workflow. {{< param product_name >}} will begin actively interfacing with {{< param cloud >}} to deploy a {{< param cloud >}} {{< param engine >}} Kubernetes cluster. You can track the status of the Deployment in the *Execution Task Graph* panel in the *Deployments* page. 

![{{< param cloud >}} Kubernetes cluster complete]( /images/trial_getting_started/k8s/create_cluster/azure_aks_deployment.png )

____


## Using the {{< param cloud >}} {{< param engine >}} Cluster

### Install CLI tools

#### Kubectl

{{< param cloud >}} documentation: [{{< param kubectl_cli_link >}}]({{< param kubectl_cli_link >}})

#### {{< param cloud >}} CLI

{{< param cloud >}} documentation: [{{< param cloud_cli_link >}}]({{< param cloud_cli_link >}})

To initialize Kubectl, go to the {{< param cloud >}} Console, navigate to the **Kubernetes Service** page, select your cluster, and click **Connect**. This will display a CLI command to use to setup the Kubectl config. 

![kubectl access]( /images/trial_getting_started/k8s/create_cluster/azure-kubectl.jpg )

```bash
# Example GKE Kubectl init command
az aks get-credentials --resource-group aks-test-rgaks --name aks-test-mcaks
```

### Verify access

```bash
# List version
kubectl version

# List namespaces
kubectl get ns

# List nodes
kubectl get nodes
```
