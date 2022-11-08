+++
blueprint_name = "blueprint.yaml"
deployment_name = "Deploy your first blueprint to install a local web server and publish a web page"


title = "Level 1: Hello World"
description = "Deploy your first blueprint installing a local web-server and publish a web page"

weight = 10
alwaysopen = false
+++

This example demonstrates a simple deployment of a local HTTP server with a hello world web page. The local web server runs entirely on the {{< param cfy_manager_name >}}, and no external IaaS or cloud credentials are needed.

You will learn how to upload, install, validate, and deprovision an environment using a blueprint. A blueprint is a general purpose model for describing systems, services, or any orchestrated object topology. Blueprints are represented as descriptive code (YAML-based files) and typically stored and managed as part of a source repository.

The blueprint for this example is available [here]({{< param first_service_blueprint_local >}}/{{< param blueprint_name >}}).

> Note: Creating a deployment typically requires uploading the appropriate {{< param product_name >}} plugins. However, this example does not have any external IaaS or cloud provider dependencies and can be run entirely on the local {{< param cfy_manager_name >}}.

## Prerequisites

This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} setup ready. This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).


### {{< param cfy_cli_name >}} vs. {{< param cfy_console_name >}}

{{< param product_name >}} allows for multiple user interfaces. Some users find the {{< param cfy_console_name >}} (web based UI) more intuitive, while others prefer the {{< param cfy_cli_name >}} (Command Line Interface). These tutorials will describe both methods:

* [Using the {{< param cfy_console_name >}}](#cloudify-management-console)
* [Using the {{< param cfy_cli_name >}}](#cloudify-cli)

If you prefer to use the {{< param cfy_cli_name >}}, then you will need to either use the CLI included on your {{< param cfy_manager_name >}} or [install the CLI.](https://docs.cloudify.co/latest/cloudify_manager/cloudify_cli/)

## {{< param cfy_console_name >}}

This section explains how to run the Hello World example using the {{< param cfy_console_name >}}. The {{< param cfy_console_name >}} and {{< param cfy_cli_name >}} can be used interchangeably for all {{< param product_name >}} activities.

The flow required to setup a service consists of the following steps:

1. Upload the blueprint describing the service to the {{< param cfy_manager_name >}}.
1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

### Upload Blueprint

To upload a blueprint to the {{< param cfy_manager_name >}}, select the **Blueprints** page and use the **Upload** button. Provide the following inputs to the modal:

* Blueprint package: [link]({{< param first_service_blueprint_local_zip >}})
* Blueprint name: {{< param first_service_blueprint_local_name >}}
* Blueprint YAML file: {{< param blueprint_name >}}

![Upload a Blueprint]( /images/trial_getting_started/first_service/local/upload_blueprint.png )

### Deploy and Install

Once the blueprint is uploaded, it will be displayed in the Blueprints widget. to deploy the blueprint, click the **Deploy** button next to the blueprint you wish to deploy. Specify the deployment name and click **Install**:

![Create a deployment]( /images/trial_getting_started/first_service/local/create_deployment.png )

You will be directed to the **Deployment** page and will be able to track the progress of the execution:

![Deployment page]( /images/trial_getting_started/first_service/local/deployment_page.png )


The deployment you have created for a particular blueprint will be displayed in the deployments list for that blueprint:

![Deployment list]( /images/trial_getting_started/first_service/local/deployment_list.png )

### Validate

The example blueprint deploys a simple HTTP service with a static website. It runs locally on the {{< param cfy_manager_name >}}. To access it, simply navigate to the appropriate endpoint:

 * `http://127.0.0.1:8000` if you are using your local machine or a Docker container as the {{< param cfy_manager_name >}} machine.
 * `http://<VM IP>:8000` if you are using a VM as the {{< param cfy_manager_name >}} machine.
 * `http://<your {{< param cfy_caas >}} URL>:8000` if you are using {{< param cfy_caas >}}.

### Teardown

To remove the deployment and destroy the orchestrated service, run the **Uninstall** workflow by clicking the **Deployment actions** button on the deployment page and selecting **Uninstall**. Click the **Execute** button on the modal.

![Deployment list]( /images/trial_getting_started/first_service/local/deployment_list.png )


## {{< param cfy_cli_name >}}

This section explains how to run the Hello World example using the {{< param cfy_cli_name >}}. The {{< param cfy_console_name >}} and {{< param cfy_cli_name >}} can be used interchangeably for all {{< param product_name >}} activities.

The {{< param cfy_cli_name >}} enables you to upload a blueprint, create a deployment, and run the install workflow using a single command.

### Upload Blueprint and Deploy

Uploading a blueprint to {{< param product_name >}} can be done by direct upload or by providing the link in the source code repository. This involves the following steps:

1. Upload the blueprint describing the service to the {{< param cfy_manager_name >}}.
1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

To perform this flow as a single operation, you can use the `install` command:

```bash
cfy install {{< param first_service_blueprint_local_zip >}} -n {{< param blueprint_name >}}
```
The command takes a path to a blueprint archive, which can be a URL or a location on the local filesystem. The `-n` flag specifies the blueprint file within the archive.

### Validate

The example blueprint deploys a simple HTTP service with a static website. It runs locally on the {{< param cfy_manager_name >}}. To access it, simply navigate to the appropriate endpoint:

 * `http://127.0.0.1:8000` if you are using your local machine or a Docker container as the {{< param cfy_manager_name >}} machine.
 * `http://<VM IP>:8000` if you are using a VM as the {{< param cfy_manager_name >}} machine.
 * `http://<your {{< param cfy_caas >}} URL>:8000` if you are using {{< param cfy_caas >}}.

You can also list all of the deployments in the {{< param cfy_manager_name >}} with the `deployments list` command:

```bash
$ cfy deployments list
Listing all deployments...

Deployments:
+----------------------------+----------------------------+----------------------------+--------------------------+--------------------------+------------+----------------+------------+-----------+--------+-------------------+---------------------+
|             id             |        display_name        |        blueprint_id        |        created_at        |        updated_at        | visibility |  tenant_name   | created_by | site_name | labels | deployment_status | installation_status |
+----------------------------+----------------------------+----------------------------+--------------------------+--------------------------+------------+----------------+------------+-----------+--------+-------------------+---------------------+
| simple-hello-world-example | simple-hello-world-example | simple-hello-world-example | 2022-11-08 18:30:07.188  | 2022-11-08 18:30:07.188  |   tenant   | default_tenant |   admin    |           |        |        good       |        active       |
+----------------------------+----------------------------+----------------------------+--------------------------+--------------------------+------------+----------------+------------+-----------+--------+-------------------+---------------------+

Showing 1 of 1 deployments
```
### Teardown

To remove the deployment and destroy the orchestrated service, run the `uninstall` command:
```bash
cfy uninstall simple-hello-world-example
```

This will execute the uninstall workflow, delete the deployment, and remove the blueprint.
