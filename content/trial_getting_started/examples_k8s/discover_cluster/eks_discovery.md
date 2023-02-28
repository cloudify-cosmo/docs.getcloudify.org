+++
deployment_name_cli = "account"

title = "AWS EKS Discovery"
description = "Discover pre-provisioned EKS Clusters in your AWS Account."
weight = 10
alwaysopen = false
+++


This example demonstrates discovering existing EKS clusters in your AWS account.

The story comprises three features:
 * A Discovery blueprint
 * The Shared Cluster node type.


## Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} setup is ready. This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).
* Access to the cloud infrastructure you select is required to demonstrate this example.

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



### Create Secrets

To connect to an infrastructure, a set of credentials are required.
{{< param product_name >}} recommends storing such sensitive information in a {{< param product_name >}} secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about {{< param product_name >}} secrets [here]({{< relref "/working_with/manager/using-secrets.md" >}}).

In this example, an infrastructure provider is selected during the blueprint installation. To ensure the correct secrets are created, use the following table to import the secrets for the provider selected.

<div class="infra_table"></div>

| Infrastructure Provider | Example |
| --- | --- |
| AWS | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/basic/aws_basics.md" >}}) |

To store the access keys as secrets in the {{< param cfy_manager_name >}}, log in to the {{< param cfy_console_name >}} and select the **System Resources** page. Scroll to the **Secret Store Management** widget and use the **Create** button to add the following new secrets:

### Upload Plugins

Plugins are {{< param product_name >}}'s extendable interfaces to services, cloud providers, and automation tools.
I.e., connecting to AWS requires the AWS plugin.

To upload the required plugins to your manager, select the **Cloudify Catalog** page, scroll to the **Plugins Catalog** widget, and select the plugins you wish to upload.

For this example, upload the following plugins:

* Utilities
* Kubernetes
* AWS


### Upload Blueprints

A blueprint is a general purpose model for describing systems, services, or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and are typically stored and managed as part of the source repository.
The Discovery blueprints are available [here]({{< param discovery_master >}}).

If you have installed an example before, the Discovery flow is slightly different.

The general flow required to set up a service consists of:

1. Upload the blueprint describing a service to the {{< param cfy_manager_name >}}.
1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

For the Discovery and Batch Workload Management feature, this is the flow:

1. Upload the blueprint describing an existing EKS Cluster to the {{< param cfy_manager_name >}}.
1. Upload the blueprint that enables us to scan your AWS Account for existing EKS clusters to the {{< param cfy_manager_name >}}.
1. Upload the blueprint that runs a Kubernetes workload on a Kubernetes Cluster managed in another Deployment {{< param cfy_manager_name >}}.
1. Create a deployment from the uploaded AWS Account blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.
1. Run the **discover_and_deploy** workflow from the "account" deployment to discover Kubernetes Clusters and install existing cluster deployments for them on the Cloudify manager.
1. Run the **batch_deploy_and_install** workflow from the "account" deployment to install a Kubernetes workload on the discovered clusters.

Let's run these, one by one.


#### Upload Existing Cluster Blueprint

To upload the Existing Cluster blueprint to the {{< param cfy_manager_name >}}, select the **Local Blueprints** page, and use the **Upload** button.

* Blueprint package: [link]({{< param discovery_zip >}})
* Blueprint name:
    * AWS users should use {{< param discovery_existing_cluster_id >}}
    * Azure users should use {{< param discovery_existing_aks_cluster_id >}}
    * GCP users should use {{< param discovery_existing_gke_cluster_id >}}
* Blueprint YAML file:
    * AWS users should use {{< param discovery_existing_cluster_yaml >}}
    * Azure users should use {{< param discovery_existing_aks_cluster_yaml >}}
    * GCP users should use {{< param discovery_existing_gke_cluster_yaml >}}

![Upload a Blueprint]( /images/trial_getting_started/discovery/discovery-existing-eks-upload.png )


#### Upload Account Blueprint

To upload the Account blueprint to the {{< param cfy_manager_name >}}, select the **Local Blueprints** page, and use the **Upload** button.

* Blueprint package: [link]({{< param discovery_zip >}})
* Blueprint name:
    * AWS users should use: {{< param discovery_account_id >}}
    * Azure users should use: {{< param discovery_azure_account_id >}}
    * GCP users should use: {{< param discovery_gcp_account_id >}}
* Blueprint YAML file:
    * AWS users should use {{< param discovery_account_yaml >}}
    * Azure users should use {{< param discovery_azure_account_yaml >}}
    * GCP users should use {{< param discovery_gcp_account_yaml >}}

![Upload a Blueprint]( /images/trial_getting_started/discovery/discovery-account-upload.png )


#### Upload Kubernetes Workload Blueprint

To upload the Kubernetes Workload blueprint to the {{< param cfy_manager_name >}}, select the **Local Blueprints** page, and use the **Upload** button.

* Blueprint package: [link]({{< param discovery_zip >}})
* Blueprint name: {{< param discovery_workload_id >}}
* Blueprint YAML file: {{< param discovery_workload_yaml >}}

![Upload a Blueprint]( /images/trial_getting_started/discovery/discovery-workload-upload.png )


### Deploy & Install

Once the blueprints are uploaded, they will be displayed in the lueprints widget.

![Upload a Blueprint]( /images/trial_getting_started/discovery/discovery-workload-upload.png )

Create a new deployment from the "Account" blueprint.

To deploy the blueprint click the **Create deployment** button next to the "Account" blueprint. Specify a deployment name, update any inputs, and click **Deploy & Install**. Changing inputs is completely optional and the defaults are safe to use.

![Create a Deployment]( /images/trial_getting_started/discovery/discovery-deploy.png )

You will be directed to the **Deployment** page and will be able to track the progress of the execution.

The deployment you created should be displayed in the deployments list on the **Deployments** page.

![Track the progress of a Workflow]( /images/trial_getting_started/discovery/discovery-install.png )


### Discovery and Deploy

Once the "Account" deployment is installed, you need to execute the "discovery and deploy" workflow.

Select the **Execute workflow** button.

This will open a drop down menu. Click on "AWS", and then click on "discover and deploy".

![Execute workflow drop down]( /images/trial_getting_started/discovery/discovery-drop-down.png )

Click *Execute*.

![Execute discover and deploy workflow]( /images/trial_getting_started/discovery/discovery-workflow.png )

After the workflow complete, you should see all of the Kubernetes clusters in your account in the services list.

![Services List]( /images/trial_getting_started/discovery/discovery-services.png )

