+++
title = "OpenStack - Infrastructure provisioning basics"
description = "OpenStack - Infrastructure provisioning basics"
weight = 28
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

This Example demonstrates a simple infrastructure setup in **OpenStack**,
the deployment consists of :

 * VM Instance
 * Security Group
 * Network
 * All of the essential peripherals in OpenStack (ip, nic, etc...).

 In this example we will deploy only the infrastructure.
 Later, in the more advanced examples (multi cloud examples)
 we will leverage this setup as the basis for deploying a generic application server and an application.

 #### Prerequisites
This example expects the following prerequisites:


* A cloudify manager setup ready. This can be either a [Cloudify Hosted service trial account]({{< relref "trial_getting_started/set_trial_manager/hosted_trial.md" >}}), a [Cloudify Premium Manager]({{< relref "trial_getting_started/set_trial_manager/trial_install.md" >}}), or a [Cloudify Community Manager]({{< relref "trial_getting_started/set_trial_manager/download_community.md" >}}).
* unless you are running a local manager, a [Cloudify CLI deployment]({{< relref "/install_maintain/installation/installing-cli.md" >}}) is recommended if you wish to learn how to manage Cloudify through command line.
* Access to OpenStack infrastructure is required to demonstrate this example.

#### Command line or management console interface?

Cloudify allows for multiple user interfaces. Some users find the management console (web based UI) more intuitive while others prefer the command line interface. This tutorial and all following ones will describe both methods.


## Getting started with the Cloudify CLI

### Step 1: Create the secrets containing Openstack credentials

To connect to OpenStack a set of credentials is required.
Cloudify recommends storing such sensitive information in a Cloudify secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).


To store the access keys as secrets in the Cloudify manager run the following replacing <value> with the actual string retrieved from OpenStack.


```bash   
cfy secrets create openstack_username --secret-string <user_name>
cfy secrets create openstack_password --secret-string <password>
cfy secrets create openstack_tenant_name --secret-string <tenant_name>
cfy secrets create openstack_auth_url --secret-string <url>
cfy secrets create openstack_external_network --secret-string <external_network_name>
cfy secrets create openstack_region --secret-string <openstack_region>
cfy secrets create base_image_id --secret-string <base_image_id>
cfy secrets create base_flavor_id --secret-string <base_flavor_id>

```

you can get the values for these secrets from your OpenStack environment
by going to your OpenStack project and under **Compute** on the side menu select **Access&Security**
then sub-tab **API Access**. Select the **Download OpenStack RC File** option andthe file will contain all required values.

**Note** openstack_auth_url - For this example use v2.0 authentication url.

openstack_external_network - the Floating IP network name in OpenStack. For example, in RackSpace it is "GATEWAY_NET".

base_image_id - the image_id of a Centos image in your OpenStack account.

base_flavor_id - your image flavor id(the size of the vm).


**Advanced users Tip**:

You can also source the OpenStack RC file, then use the environment variables, for example:
```
cfy secrets create openstack_username -s ${OS_USERNAME}
```
[Learn](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux_OpenStack_Platform/4/html/End_User_Guide/cli_openrc.html) how to do that.


### Step 2: Upload the default plugins

Plugins are Cloudify's extendable interfaces to services, cloud providers, and automation tools.
Connecting to OpenStack requires the OpenStack plugin.One may upload just specific plugins
or for simplicity upload the plugin bundle containing all the basic pre-packaged plugins.

Upload the default plugins (this may take a few minutes depending on your internet speed)
```bash
cfy plugins bundle-upload
```

**Tip**: Read more about Cloudify [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}).

### Step 3: Upload, deploy and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The OpenStack infrastructure blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/openstack.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repository.
The flow to do that is :

 1. Upload the blueprint
 1. Create a deployment from that uploaded blueprint - this generates a model in Cloudify DB
 1. Run the install workflow for that created deployment to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**.

```bash
cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-40/virtual-machine.zip -n openstack.yaml
```

**Tip**: If the above flow returns an error on this stage (for example, wrong credentials were provided) and deployment was already created, you should stop the installation and remove that deployment before you run the command again. To do that run:
```
cfy executions start uninstall -d virtual-machine.openstack -p ignore_failure=true
cfy uninstall virtual-machine.openstack
```
Fix your mistake and try again.

If you run the uninstall commands above and get this error message:
```
An error occurred on the server: 404: Requested `Deployment` with ID `virtual-machine.openstack` was not found
```
Just delete the "virtual-machine.openstack" blueprint and try the install command again (read about [blueprints] ({{< relref "cli/orch_cli/blueprints.md" >}}) and [deployments]({{< relref "cli/orch_cli/deployments.md" >}}) commands).


### Step 4: Check your orchestrated services

In this example we  have setup a simple infrastructure.

In order to see that the instances created go to your OpenStack console and see the VM and other instances created.
the name of the VM should be "vm".

You can easily get a list of all deployed nodes by running:
```bash
cfy nodes list -d virtual-machine.openstack
```

which will return:

```bash

Nodes:
+------------------+---------------------------+---------------------------+---------+----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|        id        |       deployment_id       |        blueprint_id       | host_id |                  type                  | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+------------------+---------------------------+---------------------------+---------+----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|      subnet      | virtual-machine.openstack | virtual-machine.openstack |         |    cloudify.nodes.openstack.Subnet     |   tenant   | default_tenant |          1          |              1              |   admin    |
|     network      | virtual-machine.openstack | virtual-machine.openstack |         |    cloudify.nodes.openstack.Network    |   tenant   | default_tenant |          1          |              1              |   admin    |
|  security-group  | virtual-machine.openstack | virtual-machine.openstack |         | cloudify.nodes.openstack.SecurityGroup |   tenant   | default_tenant |          1          |              1              |   admin    |
|        ip        | virtual-machine.openstack | virtual-machine.openstack |         |  cloudify.nodes.openstack.FloatingIP   |   tenant   | default_tenant |          1          |              1              |   admin    |
|    cloud_init    | virtual-machine.openstack | virtual-machine.openstack |         |  cloudify.nodes.CloudInit.CloudConfig  |   tenant   | default_tenant |          1          |              1              |   admin    |
|        vm        | virtual-machine.openstack | virtual-machine.openstack |    vm   |    cloudify.nodes.openstack.Server     |   tenant   | default_tenant |          1          |              1              |   admin    |
| external-network | virtual-machine.openstack | virtual-machine.openstack |         |    cloudify.nodes.openstack.Network    |   tenant   | default_tenant |          1          |              1              |   admin    |
|      router      | virtual-machine.openstack | virtual-machine.openstack |         |    cloudify.nodes.openstack.Router     |   tenant   | default_tenant |          1          |              1              |   admin    |
|       port       | virtual-machine.openstack | virtual-machine.openstack |         |     cloudify.nodes.openstack.Port      |   tenant   | default_tenant |          1          |              1              |   admin    |
+------------------+---------------------------+---------------------------+---------+----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 9 of 9 nodes

```
**Tip**: To check out some more commands to use with Cloudify Manager, run `cfy --help`_


An even easier way to review your deployment is through Cloudify management console.
Login to the UI and browse to the Deployments page.
Select the deployment (virtual-machine.openstack) and explore the topology, inputs, outputs, nodes, and logs.

![openstack_simple_vm_topology.png]( /images/trial_getting_started/openstack_simple_vm_topology.png )

This will also be a good time to examine the Cloudify blueprint used in the example.
The blueprint can be examined in the Cloudify UI, however in this case
we will go to the Cloudify examples repository in github and examine it there: [openstack.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/openstack.yaml).


### Step 5: OK, I am done, how do I tear it down?

To remove the deployment and delete all resources from OpenStack simply run the uninstall command:
```bash
cfy uninstall virtual-machine.openstack
```


____

## Getting started with the Cloudify Management Console UI


This section explains how to run the above described steps using
Cloudify management console UI instead of the command line options.
The UI and the CLI can be used interchangeably for all Cloudify activities.

### Step 1: Create the secrets containing the OpenStack credentials


To connect to OpenStack a set of credentials is required.
Cloudify recommends storing such sensitive information in a Cloudify secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).

you can get the values for these secrets from your OpenStack environment
by going to your OpenStack project and under **Compute** on the side menu select **Access&Security**
then sub-tab **API Access**. Select the **Download OpenStack RC File** option andthe file will contain all required values.

**Note** openstack_auth_url - For this example use v2.0 authentication url.

openstack_external_network - the Floating IP network name in OpenStack. For example, in RackSpace it is "GATEWAY_NET".

base_image_id - the image_id of a Centos image in your OpenStack account.

base_flavor_id - your image flavor id(the size of the vm).

To store the access keys as secrets in the Cloudify manager, login to the Cloudify management console and select the **System Resources** page. Scroll to the **Secret Store Management** widget and use the **Create** button to add the following new secrets:															  

* openstack_username
* openstack_password
* openstack_tenant_name
* openstack_auth_url
* openstack_external_network
* openstack_region
* base_image_id
* base_flavor_id

**Note**: set the secret value based on your access key properties.



### Step 2: Upload the required plugins

Plugins are Cloudify's extendable interfaces to services, cloud providers and automation tools.
Connecting to OpenStack requires the OpenStack v3 plugin.

To upload the required plugins to your manager, in the management console UI select the **Cloudify Catalog** page, scroll to the **Plugins Catalog** widget and select the plugins you wish to upload.

For this example, upload the following plugins:


* Utilities
* OpenStack v3

### Step 3: Upload, deploy and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The OpenStack infrastructure blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/openstack.yaml).

The flow required to setup a service consists of:

1. Upload the blueprint describing the service to the Cloudify Manager.
1. Create a deployment from that uploaded blueprint - this generates a model of the service topology in the Cloudify Database
1. Run the install workflow for that created deployment to apply the model to the infrastructure.

Let's run these one by one.

To upload a blueprint to the Cloudify manager using the Management Console UI, select the **Local Blueprints** page, and use the **Upload** button.

* Blueprint package: https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-40/virtual-machine.zip
* Blueprint name: virtual-machine
* Blueprint YAML file: openstack.yaml

Once the blueprint is uploaded, it will be displayed in the Blueprints widget. to deploy the blueprint click the **Create deployment** button next to the blueprint you wish to deploy. Specify a deployment name, and click **Deploy**

Switch to the **Deployments** page. The deployment you have created should be displayed in the deployments list.

To apply the deployment and push it to the infrastructure run the **Install** workflow by clicking the **Execute workflow** menu next to the deployment and selecting **Install**.

You can track the progress of the installation workflow by checking the node instances progress, or get a detailed view by clicking the deployment, and in the drill down page scroll down to the **Deployment Executions** widget and expand the **Install** workflow.

### Step 4: Check your orchestrated services

In this example we have setup a simple infrastructure. A VM instance was created in the region specified in the secrets, alongside  various other nodes.

* Go to your OpenStack console and see the VM instance and other resources that were created.
* Examine the deployment page in the Management Console for more information about your deployed nodes, the topology, and the installation logs.

### Step 5: OK, I am done, how do I tear it down?

To remove the deployment and delete all resources from OpenStack simply run the **uninstall workflow**, then Delete the deployment and if relevant delete the blueprint.

















`1`. Download the example zip [here](https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-40/virtual-machine.zip).
