+++
blueprint_name = "blueprint.yaml"

title = "Level 1: Fundamentals"
description = "Install plugins, create secrets, deploy your first blueprint, and learn fundamental concepts."

weight = 10
alwaysopen = false
+++

This section explains the fundamental concepts behind the {{< param cfy_manager_name >}}. You will learn several key concepts needed for future examples, including:
* An overview of blueprints
* Creating secrets
* Uploading plugins
* Uploading blueprints
* Creating a deployment
* Verifying a deployment
* Tearing down a deployment

This example deploys a local HTTP server with a "hello world" web page. The local web server runs entirely on the {{< param cfy_manager_name >}}, and no external IaaS or cloud credentials are needed.

You will learn how to upload, install, validate, and deprovision an environment using a blueprint. A blueprint is a general purpose model for describing systems, services, or any orchestrated object topology. Blueprints are represented as descriptive code (YAML-based files) and typically stored and managed as part of a source repository.

The blueprint for this example is available [here]({{< param first_service_blueprint_local >}}/{{< param blueprint_name >}}).


## Prerequisites

This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} setup ready. This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).


## {{< param cfy_cli_name >}} vs. {{< param cfy_console_name >}}

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

### Create secrets

This particular example does not require any secrets in the {{< param cfy_manager_name >}}. However, future examples will ask you to create secrets. Therefore, understanding how to create secrets is an important skill.

To create a new secret, navigate to **Resources > Secrets**. Click the **Create** button and provide a key and value for the secret. For example, create a new secret with a key of "hello" and a value of "world":

![Creating a secret]( /images/trial_getting_started/first_service/fundamentals/create_secrets.png )

You can use the "Hidden Value" checkbox to hide the secret value in the UI. You can also upload secrets from files.

Once a secret has been uploaded to the {{< param cfy_manager_name >}}, it can be used in blueprints. You will leverage secrets in future examples.

### Upload plugins

Plugins are {{< param product_name >}}'s extendable interfaces to services, cloud providers and automation tools. For example: connecting to a cloud provider, such as AWS, requires the AWS plugin.

This particular example does not require any plugins to work. However, future examples will show you how to integrate with cloud providers and automation tools using plugins. Therefore, understanding how to upload plugins is an important skill.

To upload a plugin, navigate to **Resources > Plugins**.  Use the **Upload > Upload from Marketplace** button to load the marketplace of available plugins. Select any plugin and click the upload button to add the plugin to the {{< param cfy_manager_name >}}:

![Uploading a plugin]( /images/trial_getting_started/first_service/fundamentals/upload_plugins.png )

Once a plugin has been uploaded to {{< param cfy_manager_name >}}, it can be used in blueprints. You will leverage several plugins in future examples to orchestrate cloud and application resources.

### Upload Blueprint

To upload a blueprint to the {{< param cfy_manager_name >}}, select the **Blueprints** page and use the **Upload** button. Provide the following inputs to the modal:

* Blueprint package: [link]({{< param first_service_blueprint_local_zip >}})
* Blueprint name: {{< param first_service_blueprint_local_name >}}
* Blueprint YAML file: {{< param blueprint_name >}}

![Upload a Blueprint]( /images/trial_getting_started/first_service/fundamentals/upload_blueprint.png )

### Deploy and Install

Once the blueprint is uploaded, it will be displayed in the Blueprints widget. To deploy the blueprint, click the **Deploy** button next to the blueprint you wish to deploy. Specify the deployment name and click **Install**:

![Create a deployment]( /images/trial_getting_started/first_service/fundamentals/create_deployment.png )

You will be directed to the **Deployment** page and will be able to track the progress of the execution:

![Deployment page]( /images/trial_getting_started/first_service/fundamentals/deployment_page.png )


The deployment you have created for a particular blueprint will be displayed in the deployments list for that blueprint:

![Deployment list]( /images/trial_getting_started/first_service/fundamentals/deployment_list.png )

### Validate

The example blueprint deploys a simple HTTP service with a static website. It runs locally on the {{< param cfy_manager_name >}}. To access it, simply navigate to the appropriate endpoint:

 * `http://127.0.0.1:8000` if you are using your local machine or a Docker container as the {{< param cfy_manager_name >}} machine.
 * `http://<VM IP>:8000` if you are using a VM as the {{< param cfy_manager_name >}} machine.
 * `http://<your {{< param cfy_caas >}} URL>:8000` if you are using {{< param cfy_caas >}}.

### Teardown

To remove the deployment and destroy the orchestrated service, run the **Uninstall** workflow by clicking the **Deployment actions** button on the deployment page and selecting **Uninstall**. Click the **Execute** button on the modal.

![Uninstall deployment]( /images/trial_getting_started/first_service/fundamentals/uninstall.png )


## {{< param cfy_cli_name >}}

This section explains how to run the Hello World example using the {{< param cfy_cli_name >}}. The {{< param cfy_console_name >}} and {{< param cfy_cli_name >}} can be used interchangeably for all {{< param product_name >}} activities.

The {{< param cfy_cli_name >}} enables you to upload a blueprint, create a deployment, and run the install workflow using a single command.

### Create secrets

This particular example does not require any secrets in the {{< param cfy_manager_name >}}. However, future examples will ask you to create secrets. Therefore, understanding how to create secrets is an important skill.

Secrets can be created using the `cfy secrets create` command. For example, create a new secret with a key of "hello" and a value of "world":

```bash
$ cfy secrets create hello --secret-string world
Secret `hello` created
```

If the secret already exists in your manager, you can update the value using the `-u` flag:

```bash
$ cfy secrets create hello -u --secret-string newValue
Secret `hello` created
```

### Upload plugins

Plugins are {{< param product_name >}}'s extendable interfaces to services, cloud providers and automation tools. For example: connecting to a cloud provider, such as AWS, requires the AWS plugin.

This particular example does not require any plugins to work. However, future examples will show you how to integrate with cloud providers and automation tools using plugins. Therefore, understanding how to upload plugins is an important skill.

While individual plugins can be uploaded via the CLI, the easiest method to begin using plugins is to upload the default plugins bundle:

```bash
$ cfy plugins bundle-upload
Starting upload of plugins bundle, this may take few minutes to complete.
```

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
