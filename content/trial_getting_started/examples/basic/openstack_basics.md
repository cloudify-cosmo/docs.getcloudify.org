+++
cloud_full = "OpenStack"
cloud = "OpenStack"
blueprint_name = "openstack.yaml"
deployment_name = "virtual-machine.openstack"
cloud_auth_ui_link = "https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/8/html/command-line_interface_reference_guide/ch_cli#cli_openrc"
cloud_auth_cli_link = "https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/8/html/command-line_interface_reference_guide/ch_cli#cli_openrc"

title = "OpenStack - Infrastructure provisioning basics"
description = "Deploy an OpenStack VM and supporting infrastructure resources"
weight = 28
alwaysopen = false
+++

This example demonstrates a simple infrastructure setup in **{{< param cloud_full >}}**, the deployment consists of:

 * Instance
 * Security Group
 * Network
 * All of the essential peripherals in {{< param cloud >}} (IP address, NIC, etc...).

In this example we will deploy only the infrastructure.
Later, in the more advanced examples (multi cloud examples)
we will leverage this setup as the basis for deploying a generic application server and an application.

You should already be familiar with the concepts from the [Fundamentals Example.]({{< relref "/trial_getting_started/examples/fundamentals/" >}})

## Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} setup ready. This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).
* Access to {{< param cloud >}} infrastructure is required to demonstrate this example.
* An available **CentOS 7** cloud image in OpenStack (Glance)

## Deployment Steps

### Create Secrets

Credentials and access information are required to connect to {{< param cloud >}}. {{< param product_name >}} recommends storing such sensitive information in a {{< param product_name >}} secret.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to create secrets using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#create-secrets" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#create-secrets-1" >}})

Create the following secrets in the {{< param cfy_manager_name >}}:

|                           Secret Name                            |             Description              |
| ---------------------------------------------------------------- | ------------------------------------ |
| `openstack_username` | Username to access OpenStack API |
| `openstack_password` | Password to access OpenStack API |
| `openstack_tenant_name` | Openstack tenant |
| `openstack_auth_url` | Keystone v3 authentication url |
| `openstack_external_network` |Floating IP network name in OpenStack. For example, in RackSpace it is "GATEWAY_NET". |
| `openstack_region` | Openstack region |
| `base_image_id` | Image ID of a CentOS 7 image in your OpenStack account |
| `base_flavor_id` | Image flavor ID (size of the VM) |
| `openstack_user_domain_name` | Typically "default" |
| `openstack_project_domain_name` | Typically "default" |

![Required secrets for this example]( /images/trial_getting_started/openstack_basic/create_secrets.png )


### Upload Plugins

Connecting to {{< param cloud >}} requires the {{< param cloud >}} plugin. This example also requires the Utilities plugin.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to upload plugins using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-plugins" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-plugins-1" >}})

Upload the following plugins to the {{< param cfy_manager_name >}}:

* Utilities
* {{< param cloud >}} v3

### Upload Blueprint

The blueprint for this example handles describes all of the components in the environment's topology. Upload a new blueprint to the {{< param cfy_manager_name >}} with the values below.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to upload a blueprint using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-blueprint" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-blueprint-and-deploy" >}})

* **Blueprint package**: `https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip`
* **Blueprint name**: virtual-machine (or any name of your choosing)
* **Blueprint YAML file**: openstack.yaml

### Deploy and Install

Once the blueprint has been uploaded, it will be displayed on the Blueprints page. Create a new deployment, adjusting any inputs as needed.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to create a deployment using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#deploy-and-install" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-blueprint-and-deploy" >}})

![Create a Deployment]( /images/trial_getting_started/openstack_basic/deploy.png)

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
