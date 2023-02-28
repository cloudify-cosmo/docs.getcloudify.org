+++
blueprint_name = "helm-blueprint"
deployment_name = "keycloak"

example_bp_package = "https://github.com/cloudify-community/blueprint-examples/releases/download/latest/kubernetes-helm-eks.zip"
example_bp_direct = "https://github.com/cloudify-community/blueprint-examples/blob/master/kubernetes/helm-eks/blueprint.yaml"

title = "Deploying Charts"
description = "Deploying Charts"
weight = 22
alwaysopen = false
+++

This example demonstrates deploying a Helm chart (including the binary installation, repo install, and repo update) to an existing Kubernetes cluster. The deployment consists of:

 * Helm binary installation
 * Helm repo
 * Helm chart
 * Reference to an existing Kubernetes cluster

## Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} installed and accessible
  * This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}})

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

Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about {{< param product_name >}} secrets [here]({{< relref "/working_with/manager/using-secrets.md" >}}).

{{< param product_name >}} version 6+ offers a fast-track process to import the Helm plugin by going to the **Marketplace** tab and importing the Helm plugin using the download icon. 

![Marketplace plugins list]( /images/trial_getting_started/k8s/helm/helm_plugins_list.jpg )

![Import Helm plugin]( /images/trial_getting_started/k8s/helm/helm_plugin_upload.jpg )

#### Validate Secrets

This example doesn't require any secrets, but it does depend on an existing *Shared Cluster* node being available in an existing Deployment, which would be using secrets. Refer to the [Kubernetes Cluster Discovery](/trial_getting_started/examples_k8s/discover_cluster/) tutorial to learn more about this and the prerequisites. 

#### Validate Plugins

To view the imported plugins in the {{< param cfy_manager_name >}}, log in to the {{< param cfy_console_name >}} and select the **Resources** page and navigate to the **Plugins** tab. The following plugins should exist after following the above steps:

* Helm
* Kubernetes
* Utilities

### Import Blueprint

The Helm example used in this example can be found [here]({{< param example_bp_direct >}}). The easiest way to install this blueprint would be to use the release package. 

Go to the **Blueprints** page, click the **Upload** button, and use the following values. 

* **Blueprint package**: [link]({{< param example_bp_package >}})
* **Blueprint name**: {{< param blueprint_name >}}
* **Blueprint YAML file**: blueprint.yaml


### Deploy a Helm Chart

On the **Blueprints** page, click the **Create deployment** button for the **{{< param blueprint_name >}}** blueprint. Use the following values:

* **Deployment name**: {{< param deployment_name >}}

Click the **Deploy & Install** button at the bottom of the form to start the deployment. On the following page, click the **Execute** button. 

![Helm deployment inputs]( /images/trial_getting_started/k8s/helm/helm_deploy_inputs.jpg )

You now have a {{< param product_name >}} Deployment running the default *install* workflow. {{< param product_name >}} will begin actively interfacing with the Helm binary (including installing it!) to deploy a Helm Chart on an existing Kubernetes cluster. You can track the status of the Deployment in the *Execution Task Graph* panel on the *Deployments* page. 

![Helm deployment installation]( /images/trial_getting_started/k8s/helm/helm_install_complete.jpg )
