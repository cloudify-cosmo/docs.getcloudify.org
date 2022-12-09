+++
cloud_full = "Amazon Web Services"
cloud = "AWS"
blueprint_name = "aws.yaml"
deployment_name = "virtual-machine.aws"
cloud_auth_ui_link = "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey"
cloud_auth_cli_link = "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey_CLIAPI"

title = "AWS - Infrastructure provisioning basics"
description = "Deploy an AWS EC2 instance and supporting infrastructure resources"
weight = 22
alwaysopen = false
+++

This example demonstrates a simple infrastructure setup in **{{< param cloud_full >}} ({{< param cloud >}})**, the deployment consists of:

 * Instance
 * Security Group
 * Network
 * All of the essential peripherals in {{< param cloud >}} (IP address, NIC, etc.)

In this example we will deploy only the infrastructure.
Later, in the more advanced examples (multi cloud examples)
we will leverage this setup as the basis for deploying a generic application server and an application.

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

|                           Secret Name                            |             Description              |
| ---------------------------------------------------------------- | ------------------------------------ |
| `aws_access_key_id`                                              | The access key ID used to access AWS |
| `aws_secret_access_key` The secret access key used to access AWS |                                      |

{{< param cloud >}} credentials can be created by following the guide [here]({{< param cloud_auth_ui_link>}}).

### Upload Plugins

Connecting to {{< param cloud >}} requires the {{< param cloud >}} plugin. This example also requires the Utilities plugin.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to upload plugins using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-plugins" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-plugins-1" >}})

Upload the following plugins to the {{< param cfy_manager_name >}}:

* Utilities
* {{< param cloud >}}

### Upload Blueprint

The blueprint for this example handles describes all of the components in the environment's topology. Upload a new blueprint to the {{< param cfy_manager_name >}} with the values below.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to upload a blueprint using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-blueprint" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-blueprint-and-deploy" >}})

* **Blueprint package**: `https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip`
* **Blueprint name**: virtual-machine (or any name of your choosing)
* **Blueprint YAML file**: aws.yaml

### Deploy and Install

Once the blueprint has been uploaded, it will be displayed on the Blueprints page. Create a new deployment, adjusting any inputs as needed.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to create a deployment using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#deploy-and-install" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-blueprint-and-deploy" >}})

![Create a Deployment]( /images/trial_getting_started/aws_basic/Screenshot259.png )

You will be directed to the **Deployment** page and will be able to track the progress of the execution:

![Track the progress of a Workflow]( /images/trial_getting_started/aws_basic/Screenshot261.png )

### Validate

This example deployed a simple infrastructure. A virtual instance (VM) was created in the region specified in the Deployment inputs along with a new network and other resources. You can validate this deployment by:

* Navigating to the {{< param cloud >}} console and verifying that the new instance and other resources were created.
* Examining the Deployment page in the {{< param cfy_console_name >}} for more information about your deployed nodes, topology, installation logs.


You can log in to the newly deployed {{< param cloud >}} instance by obtaining the public IP, SSH username, and SSH private key ouputs and capabilities.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of verification steps, including how to obtain outputs and capabilities using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#validate" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#validate-1" >}})

![Get Deployment outputs]( /images/trial_getting_started/aws_basic/Screenshot263.png )

### Teardown

Once you are done testing the environment, you can teardown the deployed resources. Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of teardown steps using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#teardown" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#teardown-1" >}})
