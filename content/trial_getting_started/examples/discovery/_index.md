+++
deployment_name_cli = "account"

title = "Level 7: Discovery and Batch Workload Deployment"
description = "Learn how to discover your existing Kubernetes Clusters in AWS, Azure, and GCP, and to batch deploy workloads across them."
weight = 70
alwaysopen = false
+++


This example demonstrates discovering existing EKS clusters in your AWS account.

The story comprises three features:
 * A Discovery blueprint
 * The Shared Cluster node type.
 * Batch Deploy and Install workflow.


## Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} setup ready. This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).
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

In this example, an infrastructure provider is selected during blueprint install. To ensure the correct secrets are created, use the following table to import the secrets for the provider selected.

<div class="infra_table"></div>

| Infrastructure Provider | Example |
| --- | --- |
| AWS | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/basic/aws_basics.md" >}}) |

To store the access keys as secrets in the {{< param cfy_manager_name >}}, login to the {{< param cfy_console_name >}} and select the **System Resources** page. Scroll to the **Secret Store Management** widget and use the **Create** button to add the following new secrets:

### Upload Plugins

Plugins are {{< param product_name >}}'s extendable interfaces to services, cloud providers and automation tools.
I.e., connecting to AWS requires the AWS plugin.

To upload the required plugins to your manager, select the **{{< param product_name >}} Catalog** page, scroll to the **Plugins Catalog** widget and select the plugins you wish to upload.

For this example, upload the following plugins:

* Utilities
* Kubernetes
* AWS


### Upload Blueprints

A blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The Discovery blueprints are available [here]({{< param discovery_master >}}).

If you have installed an example before, the Discovery flow is slightly different.

The general flow required to setup a service consists of:

1. Upload the blueprint describing a service to the {{< param cfy_manager_name >}}.
1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

For the Discovery and Batch Workload Management feature, the flow is:

1. Upload the blueprint describing an existing EKS Cluster to the {{< param cfy_manager_name >}}.
1. Upload the blueprint that enables us to scan your AWS Account for existing EKS clusters to the {{< param cfy_manager_name >}}.
1. Upload the blueprint that runs a Kubernetes workload on a Kubernetes Cluster managed in another Deployment {{< param cfy_manager_name >}}.
1. Create a deployment from the uploaded AWS Account blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.
1. Run the **discover_and_deploy** workflow from the "account" deployment to discover Kubernetes Clusters and install existing cluster deployments for them on the {{< param cfy_manager_name >}}.
1. Run the **batch_deploy_and_install** workflow from the "account" deployment to install a Kubernetes workload on the discovered clusters.

Let's run these one by one.


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
    * AWS users should use: {{< param discovery_account_id >}}.
    * Azure users should use: {{< param discovery_azure_account_id >}}.
    * GCP users should use: {{< param discovery_gcp_account_id >}}.
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

Once the blueprints are uploaded, they will be displayed in the Blueprints widget.

![Upload a Blueprint]( /images/trial_getting_started/discovery/discovery-workload-upload.png )

Create a new deployment from the "account" blueprint.

To deploy the blueprint click the **Create deployment** button next to the "account" blueprint. Specify a deployment name, update any inputs, and click **Deploy & Install**. Changing inputs is completely optional and the defaults are safe to use.

![Create a Deployment]( /images/trial_getting_started/discovery/discovery-deploy.png )

You will be directed to the **Deployment** page and will be able to track the progress of the execution.

The deployment you have created should be displayed in the deployments list in the **Deployments** page.

![Track the progress of a Workflow]( /images/trial_getting_started/discovery/discovery-install.png )


### Discovery and Deploy

Once the "Account" deployment has installed, you need to execute the "discovery and deploy" workflow.

Select the **Execute workflow** button.

This will open a drop down menu. Click on "AWS", and then click on "discover and deploy".

![Execute workflow drop down]( /images/trial_getting_started/discovery/discovery-drop-down.png )

Click *Execute*.

![Execute discover and deploy workflow]( /images/trial_getting_started/discovery/discovery-workflow.png )

After the workflow has completed, you should see all of the Kubernetes clusters in your account in the services list.

![Services List]( /images/trial_getting_started/discovery/discovery-services.png )


### Batch Deploy

Now, you should have deployments for all of the Kubernetes clusters in your cloud account. The next step is to deploy identical workloads across them.

Select the **Execute workflow** button.

This will open a drop down menu. Click on "{{< param product_name >}} custom workflow", and then click on "batch deploy and install".

![Execute workflow drop down]( /images/trial_getting_started/discovery/discovery-drop-down2.png )

This will open a dialog. You need to provide a values for the blueprint_id parameter, and for the parent_deployments parameter.

The blueprint_id parameter should be "kubernetes-workload".

The parent_deployments parameter should be a list of deployment IDs. You should provide the IDs of the existing Kubernetes Cluster deployments that were discovered and deployed in the last step.

![Execute workflow drop down]( /images/trial_getting_started/discovery/discovery-workload-deploy.png )

### Validate

In this example we have install the Kubernetes workload defined in the "kubernetes-workload" blueprint on all of the Kubernetes Clusters that you provide in the "parent_deployments" field. If you will log into your Kubernetes clusters, you will see the Nginx Pod application is running on those clusters.

### Teardown

To remove the deployment and destroy the orchestrated infrastructure resources, run the **Uninstall** workflow by clicking the **Execute workflow** menu next to the deployment that we installed, expanding **Default workflows**, and selecting **Uninstall**.


____


## {{< param cfy_cli_name >}}

### Create Secrets

To enable {{< param product_name >}} to connect to infrastructure, credentials are required.
{{< param product_name >}} recommends storing such sensitive information as a {{< param product_name >}} secret.
Secrets are encrypted in a secure way and used during run-time by the system.
Learn more about {{< param product_name >}} secrets [here]({{< relref "/working_with/manager/using-secrets.md" >}}).

In this example, an infrastructure provider is selected during blueprint install. To ensure the correct secrets are created, use the following table to import the secrets for the provider selected.

<div class="infra_table"></div>

| Infrastructure Provider | Example |
| --- | --- |
| AWS | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/basic/aws_basics.md" >}}) |
| AWS (Terraform) | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/automation_tools/aws_terraform_basics.md" >}}) |
| AWS (Cloudformation) | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/automation_tools/aws_cloudformation_basics.md" >}}) |
| GCP | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/basic/gcp_basics.md" >}}) |
| Azure | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/basic/azure_basics.md" >}}) |
| Azure (ARM) | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/automation_tools/azure_arm_basics.md" >}}) |
| OpenStack | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/basic/openstack_basics.md" >}}) |


### Upload Plugins

Plugins are {{< param product_name >}}'s extendable interfaces to services, cloud providers, and automation tools.
For example, connecting to AWS requires the AWS plugin. You may upload specific plugins or, for simplicity, upload the plugin bundle containing all of the basic, pre-packaged, plugins.

To upload the default plugins bundle (this may take a few minutes depending on your internet speed):
```bash
cfy plugins bundle-upload
```

**Tip**: Read more about [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}).


### Upload Blueprint and Deploy

A blueprint is a general purpose model for describing systems, services or any orchestrated object topology. Blueprints are represented as descriptive code (YAML-based files) and are typically stored and managed as part of the source code repository.

The  infrastructure blueprint is available [here]({{< param multicloud_blueprint_jboss_master >}}).

Uploading a blueprint to {{< param product_name >}} can be done by direct upload or by providing the link in the source code repository.
The flow to do that is:

 1. Upload the blueprint.
 1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
 1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

In order to perform this flow as a single unit, we will use the **install** command.

```bash
cfy install {{< param multicloud_blueprint_zip >}} -n {{< param multicloud_blueprint_jboss_name >}} -i infra_name=<YOUR_INFRASTRUCTURE_NAME>
```

Replace `YOUR_INFRASTRUCTURE_NAME` with any of the following -

* openstack
* azure
* azure-arm
* aws
* aws-terraform
* aws-cloudformation
* gcp
* ansible


### Validate

In this example we have setup a simple infrastructure with a JBoss application. A virtual instance (VM) was created in the region specified in the Deployment inputs alongside a new network and various other resources.

* Go to your infrastructure console and see the new instance and other resources that were created.
* You can easily get a list of all deployed nodes by running:

```bash
Listing nodes for deployment {{< param deployment_name_cli >}}...

Nodes:
+----------------+--------------------------+--------------------------+---------+----------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|       id       |      deployment_id       |       blueprint_id       | host_id |               type               | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+----------------+--------------------------+--------------------------+---------+----------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|     jboss      | {{< param deployment_name_cli >}} | {{< param deployment_name_cli >}} |         | cloudify.nodes.ApplicationServer |   tenant   | default_tenant |          1          |              1              |   admin    |
| infrastructure | {{< param deployment_name_cli >}} | {{< param deployment_name_cli >}} |         |     cloudify.nodes.Component     |   tenant   | default_tenant |          1          |              1              |   admin    |
+----------------+--------------------------+--------------------------+---------+----------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 2 of 2 nodes
```

**Tip**: To check out some more commands to use with the {{< param cfy_console_name >}}, run `cfy --help`

To get the Outputs of our deployment run:
```bash
cfy deployment outputs {{< param deployment_name_cli >}}
```

The returned output would look like:

``` bash
Retrieving outputs for deployment {{< param deployment_name_cli >}}...
 - "admin_url":
     Description: Administration console URL
     Value: http://15.223.62.18:9990/console

```

Copy and paste the URL **Value** into your browser, you should see the JBoss HAL management console.

An even easier way to review your deployment is through the [{{< param cfy_console_name >}}](#validate).
Login to the console and browse to the **Deployments** page.
Select the deployment (`{{< param deployment_name_cli >}}`) and explore the topology, inputs, outputs, nodes, and logs.

![Successful Cloudify Deployment]( /images/trial_getting_started/mc_jboss_deployment_topology.png )

This is also a good time to examine the blueprint used in the example.
The blueprint can be examined in the {{< param cfy_console_name >}}, however in this case
we will go to the {{< param product_name >}} examples repository in Github and examine it there: [{{< param multicloud_blueprint_jboss_name >}}]({{< param multicloud_blueprint_jboss_master >}})


### Teardown

To remove the deployment and delete all resources, simply run the uninstall command:
```bash
cfy uninstall {{< param deployment_name_cli >}}
```
