+++
blueprint_name = "blueprint.yaml"
deployment_name = "simple-hello-world-example"

title = "Local hello-world"
description = "Local - Simple hello world"
weight = 20
alwaysopen = false
+++

This example demonstrates a simple deployment of local HTTP server with a hello-world page on it.


## Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} setup ready. This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).


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

### Upload Blueprint

A blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The blueprint is available [here]({{< param first_service_blueprint_local >}}/{{< param blueprint_name >}}).

The flow required to setup a service consists of:

1. Upload the blueprint describing the service to the {{< param cfy_manager_name >}}.
1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

Let's run these one by one.

To upload a blueprint to the {{< param cfy_manager_name >}}, select the **Local Blueprints** page, and use the **Upload** button.

* Blueprint package: [link]({{< param first_service_blueprint_local_zip >}})
* Blueprint name: {{< param first_service_blueprint_local_name >}}
* Blueprint YAML file: {{< param blueprint_name >}}

![Upload a Blueprint]( /images/trial_getting_started/first_service/local/upload_blueprint.png )

### Deploy & Install

Once the blueprint is uploaded, it will be displayed in the Blueprints widget. to deploy the blueprint click the **Create deployment** button next to the blueprint you wish to deploy. Specify a deployment name, update any inputs, and click **Deploy & Install**

You will be directed to the **Deployment** page and will be able to track the progress of the execution.

The deployment you have created should be displayed in the deployments list in the **Deployments** page.



### Validate

In this example we have setup a simple HTTP service hosting a static site.

To access your new service, simply browse to http://localhost:8000/

### Teardown

To remove the deployment and destroy the orchestrated service, run the **Uninstall** workflow by clicking the **Execute workflow** menu next to the deployment, expanding **Default workflows**, and selecting **Uninstall**.


____


## {{< param cfy_cli_name >}}

### Upload Blueprint and Deploy

A blueprint is a general purpose model for describing systems, services or any orchestrated object topology. Blueprints are represented as descriptive code (YAML-based files) and are typically stored and managed as part of the source code repository. The blueprint is available [here]({{< param first_service_blueprint_local >}}/{{< param blueprint_name >}}).

Uploading a blueprint to {{< param product_name >}} can be done by direct upload or by providing the link in the source code repository.
The flow to do that is:

 1. Upload the blueprint.
 1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
 1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

In order to perform this flow as a single unit, we will use the **install** command.

```bash
cfy install {{< param first_service_blueprint_local_zip >}} -n {{< param blueprint_name >}}
```

**Note**: Usually, in order to connect and deploy instances on cloud platforms (such as AWS, Azure etc.)
we need to upload the appropriate {{< param product_name >}} plugins, but in this example the infrastructure is local and not interacting with any cloud provider.


### Validate

In this example we have setup a simple HTTP service hosting a static site.

Firstly, in order to see that the deployment was successfully created, run:
```bash
$ cfy deployments list
Listing all deployments...

Deployments:
+----------------------------+----------------------------+--------------------------+--------------------------+------------+----------------+------------+-----------+
|             id             |        blueprint_id        |        created_at        |        updated_at        | visibility |  tenant_name   | created_by | site_name |
+----------------------------+----------------------------+--------------------------+--------------------------+------------+----------------+------------+-----------+
| {{< param deployment_name >}} | {{< param deployment_name >}} | 2020-04-05 14:34:49.487  | 2020-04-05 14:34:49.487  |   tenant   | default_tenant |   admin    |           |
+----------------------------+----------------------------+--------------------------+--------------------------+------------+----------------+------------+-----------+

Showing 1 of 1 deployments

```

To access your new service, simply browse to http://localhost:8000/


### Teardown

To remove the deployment and destroy the orchestrated service, run the uninstall command:
```bash
cfy uninstall {{< param deployment_name >}}
```
