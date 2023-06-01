+++
cloud_full = "OpenStack"
cloud = "OpenStack"
blueprint_name = "openstack.yaml"
deployment_name = "hello-world-example.openstack"
cloud_auth_ui_link = "https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/8/html/command-line_interface_reference_guide/ch_cli#cli_openrc"
cloud_auth_cli_link = "https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/8/html/command-line_interface_reference_guide/ch_cli#cli_openrc"

title = "OpenStack hello-world"
description = "OpenStack - Simple hello world"
weight = 40
alwaysopen = false
+++

This example demonstrates a simple infrastructure setup in **{{< param cloud_full >}}**, the deployment consists of:

 * Instance
 * Web server + simple website
 * Security Group
 * Network
 * All of the essential peripherals in {{< param cloud >}} (IP address, NIC, etc...).

In this example we will deploy virtual infrastructure and a "hello world" application using the {{< param cloud >}} and Ansible plugins.

## Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} setup ready. This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).
* Access to {{< param cloud >}} infrastructure is required to demonstrate this example.
* An available **Ubuntu 14.04 (Trusty Tahr)** cloud image in OpenStack (Glance)

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

To connect to {{< param cloud >}}, credentials are required.
{{< param product_name >}} recommends storing such sensitive information in a {{< param product_name >}} secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about {{< param product_name >}} secrets [here]({{< relref "/working_with/manager/using-secrets.md" >}}).

{{< param cloud >}} credentials can be downloaded by following the guide [here]({{< param cloud_auth_ui_link>}}).

To store the access keys as secrets in the {{< param cfy_manager_name >}}, login to the {{< param cfy_console_name >}} and select the **System Resources** page. Scroll to the **Secret Store Management** widget and use the **Create** button to add the following new secrets:

```bash   
* openstack_username
* openstack_password
* openstack_tenant_name
* openstack_auth_url
* openstack_external_network
* openstack_region
* base_image_id
* base_flavor_id
* openstack_user_domain_name
* openstack_project_domain_name
```

**Notes**

* `openstack_auth_url` - a Keystone v3 authentication url.
* `openstack_external_network` - the Floating IP network name in OpenStack. For example, in RackSpace it is "GATEWAY_NET".
* `base_image_id` - the image_id of a Ubuntu 14.04 (Trusty Tahr) image in your OpenStack account.
* `base_flavor_id` - the image flavor id (the "t-shirt" size of the VM).
* `openstack_user_domain_name` - usually "default".
* `openstack_project_domain_name` - usually "default".

![Required secrets for this example]( /images/trial_getting_started/first_service/openstack/openstack_hello_world_secrets.png )

### Upload Plugins

Plugins are {{< param product_name >}}'s extendable interfaces to services, cloud providers and automation tools.
I.e., connecting to {{< param cloud >}} requires the {{< param cloud >}} plugin.

To upload the required plugins to your manager, select the **{{< param product_name >}} Catalog** page, scroll to the **Plugins Catalog** widget and select the plugins you wish to upload.

For this example, upload the following plugins:

* Utilities
* Ansible (`cloudify-ansible-plugin`)
* {{< param cloud >}} v3




### Upload Blueprint

A  blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The blueprint is available [here]({{< param first_service_blueprint_master >}}/{{< param blueprint_name >}}).

The flow required to setup a service consists of:

1. Upload the blueprint describing the service to the {{< param cfy_manager_name >}}.
1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

Let's run these one by one.

To upload a blueprint to the {{< param cfy_manager_name >}}, select the **{{< param product_name >}} Catalog** page, and use the **Upload blueprint** button next to the {{< param cloud >}}-Basics-Simple-Service-Setup blueprint.


### Deploy & Install

Once the blueprint is uploaded, it will be displayed in the Blueprints widget. to deploy the blueprint click the **Create deployment** button next to the blueprint you wish to deploy. Specify a deployment name, update any inputs, and click **Deploy & Install**. Changing inputs is completely optional and the defaults are safe to use.

You will be directed to the **Deployment** page and will be able to track the progress of the execution.

The deployment you have created should be displayed in the deployments list in the **Deployments** page.

![Track the progress of a Workflow]( /images/trial_getting_started/first_service/Screenshot325.png )

### Validate

In this example we have setup a simple infrastructure. A virtual instance (VM) was created in the region specified in the Deployment inputs alongside a new network and various other resources.

* Go to your {{< param cloud >}} console and see the new instance and other resources that were created.
* Examine the Deployment page in the {{< param cfy_console_name >}} for more information about your deployed nodes, topology, and view the installation logs.

To access your new service,  you can look at the **Deployment Outputs/Capabilities** widget on the Deployment screen to find your new **application_endpoint** output containing a URL to the service. Simply put that URL into a web browser to view the deployed service.

![Get Deployment outputs]( /images/trial_getting_started/first_service/Screenshot327.png )

### Teardown

To remove the deployment and destroy the orchestrated service, run the **Uninstall** workflow by clicking the **Execute workflow** menu next to the deployment, expanding **Default workflows**, and selecting **Uninstall**.


____




## {{< param cfy_cli_name >}}

Create a CLI profile instructing your CLI how to connect with the {{< param cfy_manager_name >}} by running the following CLI commands

```bash
cfy init
cfy profiles use <your manager hostname / URL / IP> -u admin -p <the admin  password> --ssl
cfy profiles set --manager-tenant default_tenant
```

### Create Secrets

To enable {{< param product_name >}} to connect to {{< param cloud >}}, credentials are required.
{{< param product_name >}} recommends storing such sensitive information as a {{< param product_name >}} secret.
Secrets are encrypted in a secure way and used during run-time by the system.
Learn more about {{< param product_name >}} secrets [here]({{< relref "/working_with/manager/using-secrets.md" >}}).

{{< param cloud >}} credentials can be created by following the guide [here]({{< param cloud_auth_cli_link>}}).

To store the access keys as secrets via the {{< param cfy_cli_name >}}, run the following (replacing <value> with the actual string retrieved from {{< param cloud >}}):

```bash   
cfy secrets create openstack_username --secret-string <user_name>
cfy secrets create openstack_password --secret-string <password>
cfy secrets create openstack_tenant_name --secret-string <tenant_name>
cfy secrets create openstack_auth_url --secret-string <url>
cfy secrets create openstack_external_network --secret-string <external_network_name>
cfy secrets create openstack_region --secret-string <openstack_region>
cfy secrets create base_image_id --secret-string <base_image_id>
cfy secrets create base_flavor_id --secret-string <base_flavor_id>
cfy secrets create openstack_user_domain_name --secret-string <value>
cfy secrets create openstack_project_domain_name --secret-string <value>
```

**Notes**

* `openstack_auth_url` - a Keystone v3 authentication url.
* `openstack_external_network` - the Floating IP network name in OpenStack. For example, in RackSpace it is "GATEWAY_NET".
* `base_image_id` - the image_id of a Ubuntu 14.04 (Trusty Tahr) image in your OpenStack account.
* `base_flavor_id` - the image flavor id (the "t-shirt" size of the VM).
* `openstack_user_domain_name` - usually "default".
* `openstack_project_domain_name` - usually "default".

**Advanced users tip**:

You can also source the OpenStack RC file, then use the environment variables, for example:
```
cfy secrets create openstack_username -s ${OS_USERNAME}
```

### Upload Plugins

Plugins are {{< param product_name >}}'s extendable interfaces to services, cloud providers, and automation tools.
Connecting to {{< param cloud >}} requires the {{< param cloud >}} plugin. You may upload specific plugins or, for simplicity, upload the plugin bundle containing all of the basic, pre-packaged, plugins.

To upload the default plugins bundle (this may take a few minutes depending on your internet speed):
```bash
cfy plugins bundle-upload
```

**Tip**: Read more about [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}).

### Upload Blueprint and Deploy

A blueprint is a general purpose model for describing systems, services or any orchestrated object topology. Blueprints are represented as descriptive code (YAML-based files) and are typically stored and managed as part of the source code repository.

The {{< param cloud >}} infrastructure blueprint is available [here]({{< param first_service_blueprint_master >}}/{{< param blueprint_name >}}).

Uploading a blueprint to {{< param product_name >}} can be done by direct upload or by providing the link in the source code repository.
The flow to do that is:

 1. Upload the blueprint.
 1. Create a deployment from the uploaded blueprint. This generates a model of the service topology in the {{< param product_name >}} database and provides the "context" needed for running workflows.
 1. Run the **install** workflow for the created deployment to apply the model to the infrastructure.

In order to perform this flow as a single unit, we will use the **install** command.

```bash
cfy install {{< param first_service_blueprint_zip >}} -n {{< param blueprint_name >}}
```

### Validate

In this example we have setup a simple infrastructure. A virtual instance (VM) was created in the region specified in the Deployment inputs alongside a new network and various other resources.

* Go to your {{< param cloud >}} console and see the new instance and other resources that were created.
* You can easily get a list of all deployed nodes by running:

```
$ cfy nodes list -d {{< param deployment_name >}}

Listing nodes for deployment {{< param deployment_name >}}...

Nodes:
+------------------+-------------------------------+-------------------------------+---------+----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|        id        |         deployment_id         |          blueprint_id         | host_id |                  type                  | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+------------------+-------------------------------+-------------------------------+---------+----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|    cloud_init    | hello-world-example.openstack | hello-world-example.openstack |         |  cloudify.nodes.CloudInit.CloudConfig  |   tenant   | default_tenant |          1          |              1              |   admin    |
|        ip        | hello-world-example.openstack | hello-world-example.openstack |         |  cloudify.nodes.openstack.FloatingIP   |   tenant   | default_tenant |          1          |              1              |   admin    |
|      subnet      | hello-world-example.openstack | hello-world-example.openstack |         |    cloudify.nodes.openstack.Subnet     |   tenant   | default_tenant |          1          |              1              |   admin    |
|   hello-world    | hello-world-example.openstack | hello-world-example.openstack |         |    cloudify.nodes.ansible.Playbook     |   tenant   | default_tenant |          1          |              1              |   admin    |
|     network      | hello-world-example.openstack | hello-world-example.openstack |         |    cloudify.nodes.openstack.Network    |   tenant   | default_tenant |          1          |              1              |   admin    |
|  security-group  | hello-world-example.openstack | hello-world-example.openstack |         | cloudify.nodes.openstack.SecurityGroup |   tenant   | default_tenant |          1          |              1              |   admin    |
|        vm        | hello-world-example.openstack | hello-world-example.openstack |    vm   |    cloudify.nodes.openstack.Server     |   tenant   | default_tenant |          1          |              1              |   admin    |
| external-network | hello-world-example.openstack | hello-world-example.openstack |         |    cloudify.nodes.openstack.Network    |   tenant   | default_tenant |          1          |              1              |   admin    |
|      router      | hello-world-example.openstack | hello-world-example.openstack |         |    cloudify.nodes.openstack.Router     |   tenant   | default_tenant |          1          |              1              |   admin    |
|       port       | hello-world-example.openstack | hello-world-example.openstack |         |     cloudify.nodes.openstack.Port      |   tenant   | default_tenant |          1          |              1              |   admin    |
+------------------+-------------------------------+-------------------------------+---------+----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 10 of 10 nodes
```
**Tip**: To check out some more commands to use with the {{< param cfy_console_name >}}, run `cfy --help`

To get the Outputs of our deployment run:
```bash
cfy deployment outputs {{< param deployment_name >}}
```

The returned output would look like:

``` bash
Retrieving outputs for deployment {{< param deployment_name >}}...
 - "application_endpoint":
     Description: The external endpoint of the application.
     Value: http://40.79.42.39:80

```

Copy and paste the URL **Value** into your browser, you should see a simple web page.

An even easier way to review your deployment is through the [{{< param cfy_console_name >}}](#validate).
Login to the console and browse to the **Deployments** page.
Select the deployment (`{{< param deployment_name >}}`) and explore the topology, inputs, outputs, nodes, and logs.

![Successful Cloudify Deployment]( /images/trial_getting_started/first_service/openstack/openstack_hello_world_topology.png )

This is also a good time to examine the blueprint used in the example.
The blueprint can be examined in the {{< param cfy_console_name >}}, however in this case
we will go to the {{< param product_name >}} examples repository in Github and examine it there: [{{< param first_service_blueprint_name >}}]({{< param first_service_blueprint_master >}})


### Teardown

To remove the deployment and delete all resources from {{< param cloud >}} simply run the uninstall command:
```bash
cfy uninstall {{< param deployment_name >}}
```
