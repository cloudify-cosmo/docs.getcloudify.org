+++
cloud_full = "Google Cloud Platform"
cloud = "GCP"
blueprint_name = "gcp.yaml"
deployment_name = "hello-world-example.gcp"
cloud_auth_ui_link = "https://cloud.google.com/iam/docs/service-accounts"
cloud_auth_cli_link = "https://cloud.google.com/iam/docs/service-accounts"

title = "GCP - Service Provisioning"
description = "Deploy a simple web service on GCP"
weight = 40
alwaysopen = false
+++

This example deploys a simple website and all of the supporting infrastructure components, including:

 * Instance
 * Web server + simple website
 * Security Group
 * Network
 * All of the essential peripherals in {{< param cloud >}} (IP address, NIC, etc.).

The infrastructure components will be deployed using the Cloudify GCP plugin, while the web application will be deployed with the Ansible plugin.

You should already be familiar with the concepts from the [Fundamentals Example.]({{< relref "/trial_getting_started/examples/fundamentals/" >}})

## Prerequisites

This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} setup ready. This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).
* Access to {{< param cloud >}} infrastructure is required to demonstrate this example.

## Deployment Steps

### Create Secrets

Credentials are required to connect to {{< param cloud >}}. {{< param product_name >}} recommends storing such sensitive information in a {{< param product_name >}} secret.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to create secrets using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#create-secrets" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#create-secrets-1" >}})

Create the following secrets in the {{< param cfy_manager_name >}}:

|    Secret Name    |                 Description                  |
| ----------------- | -------------------------------------------- |
| `gcp_credentials` | JSON containing credential for accessing GCP |

{{< param cloud >}} credentials can be created by following the guide [here]({{< param cloud_auth_ui_link>}}).

![Required secrets for this example]( /images/trial_getting_started/gcp_basic/create_secrets.png )

### Upload Plugins

Connecting to {{< param cloud >}} requires the {{< param cloud >}} plugin. This example also requires the Utilities plugin and the Ansible plugin to deploy the website.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to upload plugins using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-plugins" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-plugins-1" >}})

Upload the following plugins to the {{< param cfy_manager_name >}}:

* Utilities
* {{< param cloud >}}
* Ansible

### Upload Blueprint

The blueprint for this example handles describes all of the components in the environment's topology. Upload a new blueprint to the {{< param cfy_manager_name >}} with the values below.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to upload a blueprint using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-blueprint" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-blueprint-and-deploy" >}})

* **Blueprint package**: `https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip`
* **Blueprint name**: hello-world-example (or any name of your choosing)
* **Blueprint YAML file**: gcp.yaml

### Deploy and Install

Once the blueprint has been uploaded, it will be displayed on the Blueprints page. Create a new deployment, adjusting any inputs as needed.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to create a deployment using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#deploy-and-install" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-blueprint-and-deploy" >}})

You will be directed to the **Deployment** page and will be able to track the progress of the execution:

![Track the progress of a Workflow]( /images/trial_getting_started/first_service/Screenshot325.png )

### Validate

This example deployed a simple web application on a virtual machine with supporting resources, such as a new network. You can validate this deployment by:

* Navigating to the {{< param cloud >}} console and verifying that the new instance and other resources were created.
* Examining the Deployment page in the {{< param cfy_console_name >}} for more information about your deployed nodes, topology, installation logs.

To access the new service, you can locate the `application_endpoint` containing a URL to the service on the **Deployment Outputs/Capabilities** section on the Deployment Info page. Simply navigate to the URL in a web browser to view the deployed service.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of verification steps, including how to obtain outputs and capabilities using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#validate" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#validate-1" >}})

![Get Deployment outputs]( /images/trial_getting_started/first_service/Screenshot327.png )

### Teardown

Once you are done testing the environment, you can teardown the deployed resources. Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of teardown steps using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#teardown" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#teardown-1" >}})
