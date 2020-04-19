+++
title = "AWS - Infrastructure provisioning basics"
description = "AWS - Infrastructure provisioning basics"
weight = 22
alwaysopen = false
+++

{{%children style="h2" description="true"%}}


This Example demonstrates a simple infrastructure setup in **Amazon Web Services (AWS)**,
the deployment consists of :

 * EC2 Instance
 * Security Group
 * VPC Network
 * All of the essential peripherals in AWS (ip, nic, etc...).

In this example we will deploy only the infrastructure.
Later, in the more advanced examples (multi cloud examples)
we will leverage this setup as the basis for deploying a generic application server and an application.

#### Prerequisites
This example expects the following prerequisites:

* A cloudify manager setup ready. This can be either a [Cloudify Hosted service trial account]({{< relref "trial_getting_started/set_trial_manager/hosted_trial.md" >}}), a [Cloudify Premium Manager]({{< relref "trial_getting_started/set_trial_manager/trial_install.md" >}}), or a [Cloudify Community Manager]({{< relref "trial_getting_started/set_trial_manager/download_community.md" >}}).
* unless you are running a local manager, a [Cloudify CLI deployment]({{< relref "/install_maintain/installation/installing-cli.md" >}}) is recommended if you wish to learn how to manage Cloudify through command line.
* Access to AWS infrastructure is required to demonstrate this example.

#### Command line or management console interface?

Cloudify allows for multiple user interfaces. Some users find the management console (web based UI) more intuitive while others prefer the command line interface. This tutorial and all following ones will describe both methods.


## Getting started with the Cloudify CLI


### Step 1: Create the secrets containing the AWS access keys

To connect to AWS a set of access key and secret is required.
Cloudify recommends storing such sensitive information in a Cloudify secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).

Use AWS IAM settings to create an API access key.

To store the access keys as secrets in the Cloudify manager run the following replacing <value> with the actual string retrieved from AWS.

```bash
cfy secrets create aws_access_key_id --secret-string <value>
cfy secrets create aws_secret_access_key --secret-string <value>
cfy secrets create aws_region_name --secret-string <value>

```
**Note**:AWS region can be for example: us-east-1, us-west-1, etc.


To access the EC2 instance that we will create via SSH, a set of SSH keys (private and public) is required.
These keys are available on your manager and can be easily retrieved by:

If you are using the hosted trial service, these keys are available in your account management page.

If your manager is running as a Docker container, run a shell on the hosting server and execute:
```
sudo docker cp ~/.ssh/id_rsa.pub  cfy_manager_local:./
sudo docker cp ~/.ssh/id_rsa  cfy_manager_local:./
```

Store the files locally and create secrets:
```
cfy secrets create -u agent_key_public -f id_rsa.pub
cfy secrets create -u agent_key_private -f id_rsa
```


### Step 2: Upload the default plugins

Plugins are Cloudify's extendable interfaces to services, cloud providers and automation tools.
Connecting to AWS requires the AWS plugin. One may upload just specific plugins
or for simplicity upload the plugin bundle containing all the basic pre-packaged plugins.

Upload the default plugins: (this may take a few minutes depending on your internet speed)
```bash
cfy plugins bundle-upload
```

**Tip**: Read more about Cloudify [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}).

### Step 3: Upload, deploy and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The aws infrastructure blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/aws.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repository.
The flow to do that is :

 1. Upload the blueprint
 1. Create a deployment from that uploaded blueprint - this generates a model in Cloudify DB
 1. Run the install workflow for that created deployment to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**.

```bash
cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-9/virtual-machine.zip -n aws.yaml
```

**Tip**: If the above flow returns an error on this stage (for example, wrong credentials were provided) and deployment was already created, you should stop the installation and remove that deployment before you run the command again. To do that run:
```
cfy executions start stop -d virtual-machine.aws -p ignore_failure=true
cfy executions start uninstall -d virtual-machine.aws -p ignore_failure=true
cfy uninstall virtual-machine.aws
```
Fix your mistake and try again.

If you run the uninstall commands above and get this error message:
```
An error occurred on the server: 404: Requested `Deployment` with ID `virtual-machine.aws` was not found
```
Just delete the "virtual-machine.aws" blueprint and try the install command again (read about [blueprints] ({{< relref "cli/orch_cli/blueprints.md" >}}) and [deployments]({{< relref "cli/orch_cli/deployments.md" >}}) commands).

### Step 4: Check your orchestrated services

In this example we have setup a simple infrastructure. An EC2 instance was created in the region specified in the secrets, alongside VPC and various other nodes.

* Go to your AWS console and see the EC2 instance and other instances that were created.

* You can easily get a list of all deployed nodes by running:
```
cfy nodes list -d virtual-machine.aws
```

which will return:
```bash
Listing nodes for deployment virtual-machine.aws...

Nodes:
+--------------------------------------+---------------------+---------------------+---------+-------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|                  id                  |    deployment_id    |     blueprint_id    | host_id |                       type                      | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+--------------------------------------+---------------------+---------------------+---------+-------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|                subnet                | virtual-machine.aws | virtual-machine.aws |         |          cloudify.nodes.aws.ec2.Subnet          |   tenant   | default_tenant |          1          |              1              |   admin    |
|                 ami                  | virtual-machine.aws | virtual-machine.aws |         |           cloudify.nodes.aws.ec2.Image          |   tenant   | default_tenant |          1          |              1              |   admin    |
|              routetable              | virtual-machine.aws | virtual-machine.aws |         |        cloudify.nodes.aws.ec2.RouteTable        |   tenant   | default_tenant |          1          |              1              |   admin    |
|           internet_gateway           | virtual-machine.aws | virtual-machine.aws |         |      cloudify.nodes.aws.ec2.InternetGateway     |   tenant   | default_tenant |          1          |              1              |   admin    |
|                 nic                  | virtual-machine.aws | virtual-machine.aws |         |         cloudify.nodes.aws.ec2.Interface        |   tenant   | default_tenant |          1          |              1              |   admin    |
|              cloud_init              | virtual-machine.aws | virtual-machine.aws |         |       cloudify.nodes.CloudInit.CloudConfig      |   tenant   | default_tenant |          1          |              1              |   admin    |
|                  vm                  | virtual-machine.aws | virtual-machine.aws |    vm   |         cloudify.nodes.aws.ec2.Instances        |   tenant   | default_tenant |          1          |              1              |   admin    |
|         security_group_rules         | virtual-machine.aws | virtual-machine.aws |         | cloudify.nodes.aws.ec2.SecurityGroupRuleIngress |   tenant   | default_tenant |          1          |              1              |   admin    |
|                 vpc                  | virtual-machine.aws | virtual-machine.aws |         |            cloudify.nodes.aws.ec2.Vpc           |   tenant   | default_tenant |          1          |              1              |   admin    |
|                  ip                  | virtual-machine.aws | virtual-machine.aws |         |         cloudify.nodes.aws.ec2.ElasticIP        |   tenant   | default_tenant |          1          |              1              |   admin    |
|            security_group            | virtual-machine.aws | virtual-machine.aws |         |       cloudify.nodes.aws.ec2.SecurityGroup      |   tenant   | default_tenant |          1          |              1              |   admin    |
| route_public_subnet_internet_gateway | virtual-machine.aws | virtual-machine.aws |         |           cloudify.nodes.aws.ec2.Route          |   tenant   | default_tenant |          1          |              1              |   admin    |
+--------------------------------------+---------------------+---------------------+---------+-------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 12 of 12 nodes                                                                                                                                                                                                                            
```
**Tip**: To check out some more commands to use with Cloudify Manager, run `cfy --help`

An even easier way to review your deployment is through Cloudify management console.
Login to the UI and browse to the Deployments page.
Select the deployment (virtual-machine.aws) and explore the topology, inputs, outputs, nodes, and logs.

![aws_simple_vm_topology.png]( /images/trial_getting_started/aws_simple_vm_topology.png )

This will also be a good time to examine the Cloudify blueprint used in the example.
The blueprint can be examined in the Cloudify UI, however in this case
we will go to the Cloudify examples repository in github and examine it there: [aws.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/aws.yaml)


## Step 5: OK, I am done, how do I tear it down?

To remove the deployment and delete all resources from AWS simply run the uninstall command:
```bash
cfy uninstall virtual-machine.aws
```


____

## Getting started with the Cloudify Management Console UI

This section explains how to run the above described steps using
Cloudify management console UI instead of the command line options.
The UI and the CLI can be used interchangeably for all Cloudify activities.

### Step 1: Create the secrets containing the AWS access keys

To connect to AWS a set of access key and secret is required.
Cloudify recommends storing such sensitive information in a Cloudify secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).

Use AWS IAM settings to create an API access key.

To store the access keys as secrets in the Cloudify manager, login to the Cloudify management console and select the **System Resources** page. Scroll to the **Secret Store Management** widget and use the **Create** button to add the following new secrets:

* aws_access_key_id
* aws_secret_access_key
* aws_region_name


**Note**: set the secret value based on your access key properties. AWS region can be for example: us-east-1, us-west-1, etc.


To access the EC2 instance that we will create via SSH, a set of SSH keys (private and public) is required.
These keys are available on your manager and can be easily retrieved by:

If you are using the hosted trial service, these keys are available in your account management page.

If your manager is running as a Docker container, run a shell on the hosting server and execute:
```
sudo docker cp ~/.ssh/id_rsa.pub  cfy_manager_local:./
sudo docker cp ~/.ssh/id_rsa  cfy_manager_local:./
```

Store the files locally and create secrets, this time using the **Get secret value from file** option.

* agent_key_public - use the file id_rsa.pub
* agent_key_private - use the file id_rsa

### Step 2: Upload the required plugins

Plugins are Cloudify's extendable interfaces to services, cloud providers and automation tools.
Connecting to AWS requires the AWS plugin.

To upload the required plugins to your manager, in the management console UI select the **Cloudify Catalog** page, scroll to the **Plugins Catalog** widget and select the plugins you wish to upload.

For this example, upload the following plugins:

* Utilities
* AWS

### Step 3: Upload, deploy and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The aws infrastructure blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/aws.yaml).

The flow required to setup a service consists of:

1. Upload the blueprint describing the service to the Cloudify Manager.
1. Create a deployment from that uploaded blueprint - this generates a model of the service topology in the Cloudify Database
1. Run the install workflow for that created deployment to apply the model to the infrastructure.

Let's run these one by one.

To upload a blueprint to the Cloudify manager using the Management Console UI, select the **Local Blueprints** page, and use the **Upload** button.

* Blueprint package: https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-9/virtual-machine.zip
* Blueprint name: virtual-machine
* Blueprint YAML file: aws.yaml

Once the blueprint is uploaded, it will be displayed in the Blueprints widget. to deploy the blueprint click the **Create deployment** button next to the blueprint you wish to deploy. Specify a deployment name, and click **Deploy**

Switch to the **Deployments** page. The deployment you have created should be displayed in the deployments list.

To apply the deployment and push it to the infrastructure run the **Install** workflow by clicking the **Execute workflow** menu next to the deployment and selecting **Install**.

You can track the progress of the installation workflow by checking the node instances progress, or get a detailed view by clicking the deployment, and in the drill down page scroll down to the **Deployment Executions** widget and expand the **Install** workflow.

### Step 4: Check your orchestrated services

In this example we have setup a simple infrastructure. An EC2 instance was created in the region specified in the secrets, alongside VPC and various other nodes.

* Go to your AWS console and see the EC2 instance and other instances that were created.
* Examine the deployment page in the Management Console for more information about your deployed nodes, the topology, and the installation logs.

## Step 5: OK, I am done, how do I tear it down?

To remove the deployment and delete all resources from AWS simply run the **uninstall workflow**, then Delete the deployment and if relevant delete the blueprint.
