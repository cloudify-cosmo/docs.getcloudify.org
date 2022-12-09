+++
cloud_full = "Amazon Web Services"
cloud = "AWS"
blueprint_name = "aws.yaml"
deployment_name = "hello-world-example.aws"
cloud_auth_ui_link = "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey"
cloud_auth_cli_link = "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey_CLIAPI"

title = "AWS - Service Provisioning"
description = "Deploy a simple web service on AWS"
weight = 40
alwaysopen = false
+++

This example deploys a simple website and all of the supporting infrastructure components, including:

* An EC2 instance
* Security group
* Network
* Essential peripherals in AWS (IP address, NIC, etc.)

The infrastructure components will be deployed using the Cloudify AWS plugin, while the web application will be deployed with the Ansible plugin.

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
* **Blueprint YAML file**: aws.yaml

### Deploy and Install

Once the blueprint has been uploaded, it will be displayed on the Blueprints page. Create a new deployment, adjusting any inputs as needed.

Please refer to the [Fundamentals Example]({{< relref "/trial_getting_started/examples/fundamentals/" >}}) for an explanation of how to create a deployment using the [UI]({{< relref "/trial_getting_started/examples/fundamentals/#deploy-and-install" >}}) or [CLI]({{< relref "/trial_getting_started/examples/fundamentals/#upload-blueprint-and-deploy" >}})

You will be directed to the **Deployment** page and will be able to track the progress of the execution:

![Track the progress of a Workflow]( /images/trial_getting_started/aws_basic/Screenshot261.png )

### Validate









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
cfy secrets create aws_access_key_id --secret-string <value>
cfy secrets create aws_secret_access_key --secret-string <value>
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
+--------------------------------------+-------------------------+-------------------------+---------+-------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|                  id                  |      deployment_id      |       blueprint_id      | host_id |                       type                      | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+--------------------------------------+-------------------------+-------------------------+---------+-------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|                 ami                  | {{< param deployment_name >}} | {{< param deployment_name >}} |         |           cloudify.nodes.aws.ec2.Image          |   tenant   | default_tenant |          1          |              1              |   admin    |
|                subnet                | {{< param deployment_name >}} | {{< param deployment_name >}} |         |          cloudify.nodes.aws.ec2.Subnet          |   tenant   | default_tenant |          1          |              1              |   admin    |
|             hello-world              | {{< param deployment_name >}} | {{< param deployment_name >}} |         |         cloudify.nodes.ansible.Playbook         |   tenant   | default_tenant |          1          |              1              |   admin    |
|              routetable              | {{< param deployment_name >}} | {{< param deployment_name >}} |         |        cloudify.nodes.aws.ec2.RouteTable        |   tenant   | default_tenant |          1          |              1              |   admin    |
|           internet_gateway           | {{< param deployment_name >}} | {{< param deployment_name >}} |         |      cloudify.nodes.aws.ec2.InternetGateway     |   tenant   | default_tenant |          1          |              1              |   admin    |
|                  ip                  | {{< param deployment_name >}} | {{< param deployment_name >}} |         |         cloudify.nodes.aws.ec2.ElasticIP        |   tenant   | default_tenant |          1          |              1              |   admin    |
|              cloud_init              | {{< param deployment_name >}} | {{< param deployment_name >}} |         |       cloudify.nodes.CloudInit.CloudConfig      |   tenant   | default_tenant |          1          |              1              |   admin    |
|                  vm                  | {{< param deployment_name >}} | {{< param deployment_name >}} |    vm   |         cloudify.nodes.aws.ec2.Instances        |   tenant   | default_tenant |          1          |              1              |   admin    |
|         security_group_rules         | {{< param deployment_name >}} | {{< param deployment_name >}} |         | cloudify.nodes.aws.ec2.SecurityGroupRuleIngress |   tenant   | default_tenant |          1          |              1              |   admin    |
|                 vpc                  | {{< param deployment_name >}} | {{< param deployment_name >}} |         |            cloudify.nodes.aws.ec2.Vpc           |   tenant   | default_tenant |          1          |              1              |   admin    |
|                 nic                  | {{< param deployment_name >}} | {{< param deployment_name >}} |         |         cloudify.nodes.aws.ec2.Interface        |   tenant   | default_tenant |          1          |              1              |   admin    |
|            security_group            | {{< param deployment_name >}} | {{< param deployment_name >}} |         |       cloudify.nodes.aws.ec2.SecurityGroup      |   tenant   | default_tenant |          1          |              1              |   admin    |
| route_public_subnet_internet_gateway | {{< param deployment_name >}} | {{< param deployment_name >}} |         |           cloudify.nodes.aws.ec2.Route          |   tenant   | default_tenant |          1          |              1              |   admin    |
+--------------------------------------+-------------------------+-------------------------+---------+-------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 13 of 13 nodes
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

![Successful Cloudify Deployment]( /images/trial_getting_started/first_service/Screenshot324.png )

This is also a good time to examine the blueprint used in the example.
The blueprint can be examined in the {{< param cfy_console_name >}}, however in this case
we will go to the {{< param product_name >}} examples repository in Github and examine it there: [{{< param first_service_blueprint_name >}}]({{< param first_service_blueprint_master >}})


### Teardown

To remove the deployment and delete all resources from {{< param cloud >}} simply run the uninstall command:
```bash
cfy uninstall {{< param deployment_name >}}
```
