+++
deployment_name = "getting-started"
deployment_name_cli = "getting-started.mc-nodejs"

title = "Multi-cloud Node.js Example"
description = "Multi-cloud Node.js Example"
weight = 62
alwaysopen = false
+++

This example demonstrates deploying Node.js web server and application on a chosen infrastructure.

The infrastructure can be one of the following:

* Amazon Web Services (AWS)
* AWS - Terraform
* AWS - Cloudformation
* Google Cloud Platform (GCP)
* Azure
* Azure - ARM
* Openstack

The infrastructure deployment consists of:

 * VM
 * network
 * all of the essential peripherals in each infrastructure (IP address, NIC, etc...).

the second deployment consists of the chosen infrastructure, Node.js, Node.js http-server module, and a sample page.


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
| AWS (Terraform) | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/automation_tools/aws_terraform_basics.md" >}}) |
| AWS (Cloudformation) | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/automation_tools/aws_cloudformation_basics.md" >}}) |
| GCP | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/basic/gcp_basics.md" >}}) |
| Azure | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/basic/azure_basics.md" >}}) |
| Azure (ARM) | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/automation_tools/azure_arm_basics.md" >}}) |
| OpenStack | [Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/basic/openstack_basics.md" >}}) |

To store the access keys as secrets in the {{< param cfy_manager_name >}}, login to the {{< param cfy_console_name >}} and select the **System Resources** page. Scroll to the **Secret Store Management** widget and use the **Create** button to add the following new secrets:

### Upload Plugins

Plugins are {{< param product_name >}}'s extendable interfaces to services, cloud providers and automation tools.
I.e., connecting to AWS requires the AWS plugin.

To upload the required plugins to your manager, select the **{{< param product_name >}} Catalog** page, scroll to the **Plugins Catalog** widget and select the plugins you wish to upload.

For this example, upload the following plugins:

* Utilities
* Fabric
* The plugin that matches the infrastructure you're going to use




### Upload Blueprint

A blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The  infrastructure blueprint is available [here]({{< param multicloud_blueprint_nodejs_master >}}).

The flow required to setup a service consists of:

1. Upload the blueprint describing the service to the {{< param cfy_manager_name >}}.
1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

Let's run these one by one.

To upload a blueprint to the {{< param cfy_manager_name >}}, select the **Local Blueprints** page, and use the **Upload** button.

* Blueprint package: [link]({{< param multicloud_blueprint_zip >}})
* Blueprint name: {{< param multicloud_blueprint_name >}}
* Blueprint YAML file: {{< param multicloud_blueprint_nodejs_name >}}

![Upload a Blueprint]( /images/trial_getting_started/multicloud/Screenshot307.png )


### Deploy & Install

Once the blueprint is uploaded, it will be displayed in the Blueprints widget. to deploy the blueprint click the **Create deployment** button next to the blueprint you wish to deploy. Specify a deployment name, update any inputs (such as the infrastructure region), and click **Deploy & Install**. Changing inputs is completely optional and the defaults are safe to use.

![Create a Deployment]( /images/trial_getting_started/multicloud/Screenshot291.png )

You will be directed to the **Deployment** page and will be able to track the progress of the execution.

The deployment you have created should be displayed in the deployments list in the **Deployments** page.

![Track the progress of a Workflow]( /images/trial_getting_started/multicloud/Screenshot312.png )


### Validate

In this example we have setup a simple infrastructure. A virtual instance (VM) was created in the region specified in the Deployment inputs alongside a new network and various other resources.

* Go to your infrastructure (AWS, Azure, etc...) console and see the new instance and other resources that were created.
* Examine the Deployment page in the {{< param cfy_console_name >}} for more information about your deployed nodes, topology, and view the installation logs.

To login to your new instance, you can look at the **Deployment Outputs/Capabilities** widget on the Deployment screen to find your instance public IP, SSH username, and SSH private key.

![Get Deployment outputs]( /images/trial_getting_started/aws_basic/Screenshot263.png )

### Teardown

To remove the deployment and destroy the orchestrated infrastructure resources, run the **Uninstall** workflow by clicking the **Execute workflow** menu next to the deployment, expanding **Default workflows**, and selecting **Uninstall**.


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

The  infrastructure blueprint is available [here]({{< param multicloud_blueprint_nodejs_master >}}).

Uploading a blueprint to {{< param product_name >}} can be done by direct upload or by providing the link in the source code repository.
The flow to do that is:

 1. Upload the blueprint.
 1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
 1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

In order to perform this flow as a single unit, we will use the **install** command.

```bash
cfy install {{< param multicloud_blueprint_zip >}} -n {{< param multicloud_blueprint_nodejs_name >}} -i infra_name=<YOUR_INFRASTRUCTURE_NAME>
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

In this example we have setup a simple infrastructure. A virtual instance (VM) was created in the region specified in the Deployment inputs alongside a new network and various other resources.

* Go to your infrastructure console and see the new instance and other resources that were created.
* You can easily get a list of all deployed nodes by running:

```bash
Listing nodes for deployment {{< param deployment_name_cli >}}...

Nodes:
+----------------+---------------------------+---------------------------+---------+----------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|       id       |       deployment_id       |        blueprint_id       | host_id |               type               | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+----------------+---------------------------+---------------------------+---------+----------------------------------+------------+----------------+---------------------+-----------------------------+------------+
| infrastructure | {{< param deployment_name_cli >}} | {{< param deployment_name_cli >}} |         |     cloudify.nodes.Component     |   tenant   | default_tenant |          1          |              1              |   admin    |
|   sample_app   | {{< param deployment_name_cli >}} | {{< param deployment_name_cli >}} |         | cloudify.nodes.SoftwareComponent |   tenant   | default_tenant |          1          |              1              |   admin    |
|  http_server   | {{< param deployment_name_cli >}} | {{< param deployment_name_cli >}} |         | cloudify.nodes.ApplicationServer |   tenant   | default_tenant |          1          |              1              |   admin    |
|     nodejs     | {{< param deployment_name_cli >}} | {{< param deployment_name_cli >}} |         | cloudify.nodes.ApplicationServer |   tenant   | default_tenant |          1          |              1              |   admin    |
+----------------+---------------------------+---------------------------+---------+----------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 4 of 4 nodes
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
     Value: http://40.79.42.39:8080

```

Copy and paste the URL **Value** into your browser, you should see a simple web page.

An even easier way to review your deployment is through the [{{< param cfy_console_name >}}](#validate).
Login to the console and browse to the **Deployments** page.
Select the deployment (`{{< param deployment_name_cli >}}`) and explore the topology, inputs, outputs, nodes, and logs.

![Successful Deployment]( /images/trial_getting_started/multicloud/Screenshot313.png )

This is also a good time to examine the blueprint used in the example.
The blueprint can be examined in the {{< param cfy_console_name >}}, however in this case
we will go to the {{< param product_name >}} examples repository in Github and examine it there: [{{< param multicloud_blueprint_nodejs_name >}}]({{< param multicloud_blueprint_nodejs_master >}})


### Teardown

To remove the deployment and delete all resources, simply run the uninstall command:
```bash
cfy uninstall {{< param deployment_name_cli >}}
```
