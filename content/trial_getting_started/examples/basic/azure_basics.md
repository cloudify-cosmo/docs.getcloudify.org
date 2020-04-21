+++
title = "Azure - Infrastructure provisioning basics"
description = "Azure - Infrastructure provisioning basics"
weight = 25
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

This Example demonstrates a simple infrastructure setup in **Azure**,
the deployment consists of :

 * VM Instance
 * Security Group
 * Network
 * All of the essential peripherals in Azure (ip, nic, etc...).

In this example we will deploy only the infrastructure.
Later, in the more advanced examples (multi cloud examples)
we will leverage this setup as the basis for deploying a generic application server and an application.

#### Prerequisites
This example expects the following prerequisites:


* A cloudify manager setup ready. This can be either a [Cloudify Hosted service trial account]({{< relref "trial_getting_started/set_trial_manager/hosted_trial.md" >}}), a [Cloudify Premium Manager]({{< relref "trial_getting_started/set_trial_manager/trial_install.md" >}}), or a [Cloudify Community Manager]({{< relref "trial_getting_started/set_trial_manager/download_community.md" >}}).
* unless you are running a local manager, a [Cloudify CLI deployment]({{< relref "/install_maintain/installation/installing-cli.md" >}}) is recommended if you wish to learn how to manage Cloudify through command line.
* Access to Azure infrastructure is required to demonstrate this example.

#### Command line or management console interface?

Cloudify allows for multiple user interfaces. Some users find the management console (web based UI) more intuitive while others prefer the command line interface. This tutorial and all following ones will describe both methods.




## Getting started with the Cloudify CLI


### Step 1: Create the secrets containing the Azure access credentials

To connect to Azure a set of credentials is required.
Cloudify recommends storing such sensitive information in a Cloudify secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).

To store the access keys as secrets in the Cloudify manager run the following replacing <value> with the actual string retrieved from Azure.

```bash   
cfy secrets create azure_client_id --secret-string <client_id>
cfy secrets create azure_tenant_id --secret-string <tenant_id>
cfy secrets create azure_subscription_id --secret-string <subscription_id>
cfy secrets create azure_client_secret --secret-string <client_secret>

```                                             
**Note**: For help with getting your Azure credentials read [Azure plugin documentation]({{< relref "working_with/official_plugins/Infrastructure/azure.md" >}}).

### Step 2: Upload the default plugins

Plugins are Cloudify's extendable interfaces to services, cloud providers and automation tools.
Connecting to Azure requires the Azure plugin. One may upload just specific plugins
or for simplicity upload the plugin bundle containing all the basic pre-packaged plugins.

Upload the default plugins: (this may take a few minutes depending on your internet speed)
```bash
cfy plugins bundle-upload
```

**Tip**: Read more about Cloudify [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}).



### Step 3: Upload, deploy and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The azure infrastructure blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/azure.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repository.
The flow to do that is :

1. Upload the blueprint
1. Create a deployment from that uploaded blueprint - this generates a model in Cloudify DB
1. Run the install workflow for that created deployment to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**.


```bash
cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-40/virtual-machine.zip -n azure.yaml
```

**Tip**: If the above flow returns an error on this stage (for example, wrong credentials were provided) and deployment was already created, you should stop the installation and remove that deployment before you run the command again. To do that run:
```
cfy executions start stop -d virtual-machine.azure -p ignore_failure=true
cfy executions start uninstall -d virtual-machine.azure -p ignore_failure=true
cfy uninstall virtual-machine.azure
```
Fix your mistake and try again.

If you run the uninstall commands above and get this error message:
```
An error occurred on the server: 404: Requested `Deployment` with ID `virtual-machine.azure` was not found
```
Just delete the "virtual-machine.azure" blueprint and try the install command again (read about [blueprints] ({{< relref "cli/orch_cli/blueprints.md" >}}) and [deployments]({{< relref "cli/orch_cli/deployments.md" >}}) commands).




### Step 4: Check your orchestrated services

In this example we have setup a simple infrastructure. An Azure VM instance was created in the region specified in the secrets, alongside security group and various other nodes.

Go to your Azure console and see the VM and other instances that were created.
You can do it by clicking on "resource groups" on the menu in the left side of the console.
Look for resource group with the name: "cfyinfrarg0",
click on it and you can see all the resources that were created on this deployment(except ip_config).

You can easily get a list of all deployed nodes by running:
```bash
cfy nodes list -d virtual-machine.azure
```

which will return:

```bash
Listing nodes for deployment virtual-machine.azure...

Nodes:
+------------------------+-----------------------+-----------------------+---------+---------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|           id           |     deployment_id     |      blueprint_id     | host_id |                        type                       | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+------------------------+-----------------------+-----------------------+---------+---------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|         subnet         | virtual-machine.azure | virtual-machine.azure |         |        cloudify.azure.nodes.network.Subnet        |   tenant   | default_tenant |          1          |              1              |   admin    |
|    availability_set    | virtual-machine.azure | virtual-machine.azure |         |    cloudify.azure.nodes.compute.AvailabilitySet   |   tenant   | default_tenant |          1          |              1              |   admin    |
|        network         | virtual-machine.azure | virtual-machine.azure |         |    cloudify.azure.nodes.network.VirtualNetwork    |   tenant   | default_tenant |          1          |              1              |   admin    |
|     resource_group     | virtual-machine.azure | virtual-machine.azure |         |         cloudify.azure.nodes.ResourceGroup        |   tenant   | default_tenant |          1          |              1              |   admin    |
|          nic           | virtual-machine.azure | virtual-machine.azure |         | cloudify.azure.nodes.network.NetworkInterfaceCard |   tenant   | default_tenant |          1          |              1              |   admin    |
|           vm           | virtual-machine.azure | virtual-machine.azure |    vm   |    cloudify.azure.nodes.compute.VirtualMachine    |   tenant   | default_tenant |          1          |              1              |   admin    |
|       ip_config        | virtual-machine.azure | virtual-machine.azure |         |    cloudify.azure.nodes.network.IPConfiguration   |   tenant   | default_tenant |          1          |              1              |   admin    |
|           ip           | virtual-machine.azure | virtual-machine.azure |         |    cloudify.azure.nodes.network.PublicIPAddress   |   tenant   | default_tenant |          1          |              1              |   admin    |
|    storage_account     | virtual-machine.azure | virtual-machine.azure |         |    cloudify.azure.nodes.storage.StorageAccount    |   tenant   | default_tenant |          1          |              1              |   admin    |
| network_security_group | virtual-machine.azure | virtual-machine.azure |         | cloudify.azure.nodes.network.NetworkSecurityGroup |   tenant   | default_tenant |          1          |              1              |   admin    |
+------------------------+-----------------------+-----------------------+---------+---------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 10 of 10 nodes

```
**Tip**: To check out some more commands to use with Cloudify Manager, run `cfy --help`


An even easier way to review your deployment is through Cloudify management console.
Login to the UI and browse to the Deployments page.
Select the deployment (virtual-machine.azure) and explore the topology, inputs, outputs, nodes, and logs.

![azure_simple_vm_topology.png]( /images/trial_getting_started/azure_simple_vm_topology.png )

This will also be a good time to examine the Cloudify blueprint used in the example.
The blueprint can be examined in the Cloudify UI, however in this case
we will go to the Cloudify examples repository in github and examine it there: [azure.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/azure.yaml).


### Step 5: OK, I am done, how do I tear it down?

To remove the deployment and delete all resources from Azure simply run the uninstall command:
```bash
cfy uninstall virtual-machine.azure
```


____


## Getting started with the Cloudify Management Console UI

### Step 1: Create the secrets containing the Azure access keys


To connect to Azure a set of credentials is required.
Cloudify recommends storing such sensitive information in a Cloudify secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).


To store the credentials as secrets in the Cloudify manager, login to the Cloudify management console and select the **System Resources** page. Scroll to the **Secret Store Management** widget and use the **Create** button to add the following new secrets:

* azure_client_id
* azure_tenant_id
* azure_subscription_id
* azure_client_secret			   


**Note**: For help with getting your Azure credentials read [Azure plugin documentation]({{< relref "working_with/official_plugins/Infrastructure/azure.md" >}}).



### Step 2: Upload the required plugins

Plugins are Cloudify's extendable interfaces to services, cloud providers and automation tools.
Connecting to Azure requires the Azure plugin.

To upload the required plugins to your manager, in the management console UI select the **Cloudify Catalog** page, scroll to the **Plugins Catalog** widget and select the plugins you wish to upload.

For this example, upload the following plugins:

* Utilities
* Azure

### Step 3: Upload, deploy and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The Azure infrastructure blueprint is available [here](install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-40/virtual-machine.zip).

The flow required to setup a service consists of:

1. Upload the blueprint describing the service to the Cloudify Manager.
1. Create a deployment from that uploaded blueprint - this generates a model of the service topology in the Cloudify Database
1. Run the install workflow for that created deployment to apply the model to the infrastructure.

Let's run these one by one.

To upload a blueprint to the Cloudify manager using the Management Console UI, select the **Local Blueprints** page, and use the **Upload** button.

* Blueprint package: https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-40/virtual-machine.zip
* Blueprint name: virtual-machine
* Blueprint YAML file: azure.yaml

Once the blueprint is uploaded, it will be displayed in the Blueprints widget. to deploy the blueprint click the **Create deployment** button next to the blueprint you wish to deploy. Specify a deployment name, and click **Deploy**

Switch to the **Deployments** page. The deployment you have created should be displayed in the deployments list.

To apply the deployment and push it to the infrastructure run the **Install** workflow by clicking the **Execute workflow** menu next to the deployment and selecting **Install**.

You can track the progress of the installation workflow by checking the node instances progress, or get a detailed view by clicking the deployment, and in the drill down page scroll down to the **Deployment Executions** widget and expand the **Install** workflow.

### Step 4: Check your orchestrated services

In this example we have setup a simple infrastructure. An Azure VM instance was created in the region specified in the secrets, alongside security group and various other nodes.

* Go to your Azure console and see the VM and other instances that were created. You can do it by clicking on "resource groups" on the menu in the left side of the console. Look for resource group with the name: "cfyinfrarg0",
click on it and you can see all the resources that were created on this deployment(except ip_config).
* Examine the deployment page in the Management Console for more information about your deployed nodes, the topology, and the installation logs.

## Step 5: OK, I am done, how do I tear it down?

To remove the deployment and delete all resources from Azure simply run the **uninstall workflow**, then Delete the deployment and if relevant delete the blueprint.
