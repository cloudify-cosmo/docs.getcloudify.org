+++
cloud_full = "Amazon Web Services"
cloud = "AWS"
engine_full = "Elastic Kubernetes Service"
engine = "EKS"
blueprint_name = "aws.yaml"
deployment_name = "virtual-machine.aws"
cloud_auth_ui_link = "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey"
cloud_auth_cli_link = "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey_CLIAPI"

title = "AWS EKS - Cluster provisioning"
description = "AWS EKS - Cluster provisioning"
weight = 22
alwaysopen = false
+++

This example demonstrates provisioning an **{{< param engine_full >}} ({{< param engine >}})** cluster on the **{{< param cloud >}}** cloud. The deployment consists of:

 * {{< param cloud >}} {{< param engine >}} cluster
 * Security Group
 * Network
 * All of the essential peripherals in {{< param cloud >}} (IP address, NIC, etc...).

In this example, we will deploy only the cluster.
Later, in the more advanced examples (multi-cloud examples)
we will leverage this setup as the basis for deploying a containerized service.

## Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} is installed and accessible.
  * This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).
* Access to {{< param cloud >}} infrastructure is required to demonstrate this example.

#### {{< param cfy_cli_name >}} or {{< param cfy_console_name >}}?

{{< param product_name >}} allows for multiple user interfaces. Some users find the {{< param cfy_console_name >}} (web-based UI) more intuitive while others prefer the {{< param cfy_cli_name >}} (Command Line Interface). This tutorial and all the following ones will describe both methods.

* [Using the {{< param cfy_console_name >}}](#cloudify-management-console)
* [Using the {{< param cfy_cli_name >}}](#cloudify-cli)

{{% note %}}
Community version - Some of the options described in the guide are not available in the community version management console (web UI). An example would be setting up secrets. You can still perform all of the functionality using the {{< param cfy_cli_name >}}.
{{% /note %}}

## {{< param cfy_console_name >}}

This section explains how to run the above-described steps using the {{< param cfy_console_name >}}.
The {{< param cfy_console_name >}} and {{< param cfy_cli_name >}} can be used interchangeably for all {{< param product_name >}} activities.



### Import Plugins and Secrets

To connect to {{< param cloud >}}, credentials, and Cloudify plugins are required.
{{< param product_name >}} recommends storing such sensitive information in a {{< param product_name >}} secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about {{< param product_name >}} secrets [here]({{< relref "/working_with/manager/using-secrets.md" >}}).

{{< param product_name >}} version 6+ offers a fast-track process to import both credentials and all necessary plugins. As soon as the {{< param cfy_console_name >}} loads, it will present several "getting started" options. Choose the {{< param cloud >}} option and enter the requested credentials to automatically import the required secrets and plugins.

![AWS getting started]( /images/trial_getting_started/k8s/create_cluster/getting-started-auth.jpg )

![AWS import access]( /images/trial_getting_started/k8s/create_cluster/getting-started-auth-aws.jpg )

![AWS import summary]( /images/trial_getting_started/k8s/create_cluster/getting-started-auth-aws-summary.jpg )

#### Validate Secrets

To view the imported secrets in the {{< param cfy_manager_name >}}, log in to the {{< param cfy_console_name >}} and select the **Resources** page and navigate to the **Secrets** tab. The following secrets should exist after following the above steps:

* aws_access_key_id
* aws_secret_access_key

![Required secrets for this example]( /images/trial_getting_started/k8s/create_cluster/secrets-aws.jpg )

#### Validate Plugins

To view the imported plugins in the {{< param cfy_manager_name >}}, log in to the {{< param cfy_console_name >}} and select the **Resources** page and navigate to the **Plugins** tab. The following plugins should exist after following the above steps:

* AWS
* Kubernetes
* Utilities

![Required plugins for this example]( /images/trial_getting_started/k8s/create_cluster/plugins-aws.jpg )

### Import Kubernetes Blueprint

The {{< param cfy_manager_name >}} provides an easy method of provisioning a Kubernetes cluster on {{< param cloud >}} {{< param engine >}}. On the **Marketplace** page, navigate to the **Kubernetes Blueprint Examples** tab and upload the **Kubernetes-{{< param cloud >}}-{{< param engine >}}** blueprint. 

![AWS EKS import blueprint]( /images/trial_getting_started/k8s/create_cluster/k8s-bp-examples.jpg )

![AWS EKS import blueprint]( /images/trial_getting_started/k8s/create_cluster/k8s-bp-examples-aws.jpg )

Once imported, you can find the resulting **Kubernetes-{{< param cloud >}}-{{< param engine >}}** blueprint by clicking on the **Blueprints** page. 

![AWS blueprints]( /images/trial_getting_started/k8s/create_cluster/blueprints-aws.jpg )

### Deploy an {{< param cloud >}} {{< param engine >}} Cluster

On the **Blueprints** page, click the **Create deployment** button for the **Kubernetes-{{< param cloud >}}-{{< param engine >}}** blueprint. 

* Create a *Deployment name*.
* Adjust any of the *Region* and *Availability zone* inputs to match your preferences.

Click the **Deploy & Install** button at the bottom of the form to start the deployment. On the following page, click the **Execute** button. 

![AWS blueprints]( /images/trial_getting_started/k8s/create_cluster/k8s-bp-examples-aws-deploy.jpg )

You now have a {{< param product_name >}} Deployment running the default *install* workflow. {{< param product_name >}} will begin actively interfacing with {{< param cloud >}} to deploy an {{< param cloud >}} {{< param engine >}} Kubernetes cluster. You can track the status of the Deployment in the *Execution Task Graph* panel on the *Deployments* page. 

![AWS Kubernetes cluster complete]( /images/trial_getting_started/k8s/create_cluster/k8s-bp-examples-aws-complete.jpg )

____

## Using the {{< param cloud >}} {{< param engine >}} Cluster

### Install CLI tools

#### Kubectl

{{< param cloud >}} documentation: https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html

#### {{< param cloud >}} CLI

{{< param cloud >}} documentation: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv1.html 

For Linux users, we recommend the quick install method using Python3 and PIP. 

```bash
python3 -m venv venv
source venv/bin/activate
pip3 install awscli

# Check the AWS CLI version
aws --version

# Configure the CLI (enter your access credentials here)
aws configure

# Confirm everything is working
aws sts get-caller-identity

# Create a Kubectl config
# replace "your_cluster_name" and "your_region" with the values you 
# used in your Deployment earlier. 
aws eks --region your_region update-kubeconfig --name your_cluster_name
```

### Verify access

```bash
# List version
kubectl version --kubeconfig ~/.kube/config

# List namespaces
kubectl get ns --kubeconfig ~/.kube/config

# List nodes
kubectl get nodes --kubeconfig ~/.kube/config
```
