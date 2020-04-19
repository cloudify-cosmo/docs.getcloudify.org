+++
title = "AWS-Cloudformation - Infrastructure provisioning basics"
description = "AWS-Cloudformation - Infrastructure provisioning basics"
weight = 24
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

This Example demonstrates a simple infrastructure setup in **Amazon Web Services (AWS)** using CloudFormation,
the deployment consists of :

 * VM
 * Security Group
 * All of the essential peripherals in AWS (ip, nic, etc.).

On this example we will deploy only the infrastructure,
later on more advanced examples (multi cloud examples)
we will deploy an application on this specific infrastructure.

Cloudify allows for multiple user interfaces.
In this tutorial we will demonstrate the usage of Cloudify management console (web UI)
and Cloudify command line interface (CLI).

The following steps demonstrate firstly the **CLI approach**,
while the last section demonstrates **the web UI** approach.


## Step 1: Install Cloudify Manager inside Docker container

In order to deploy Cloudify manager inside Docker container,
follow the instructions on [this page]({{< relref "trial_getting_started/set_trial_manager/trial_install.md" >}}).


## Step 2: Create the secrets containing the AWS access keys

To connect to AWS a set of access key and secret are required.
Cloudify recommends storing such sensitive information in a Cloudify secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).
Use AWS IAM settings to create an access key.

To store the secrets in the manager:

This can be done through the command line or directly via Cloudify management console.

From the hosting shell run:
```bash
docker exec -it cfy_manager_local sh -c "cfy secrets create aws_access_key_id --secret-string <value>"
docker exec -it cfy_manager_local sh -c "cfy secrets create aws_secret_access_key --secret-string <value>"

```

**Tip**: Running commands on Docker containers can be applied
directly from the hosting shell by encapsulating the command in quotes
and using the docker exec command.
For example: `docker exec -it <container name> sh -c "<the command>"`.
Alternatively one may open a shell directly in the container by executing:
`docker exec -it <container image name> /bin/bash`

## Step 3: Upload the default plugins

Plugins are Cloudify's extendable interfaces to services, cloud providers, and automation tools.
Using AWS CloudFormation requires the AWS plugin. One may upload just specific plugins
or for simplicity upload the plugin bundle containing all the basic pre-packaged plugins.

Upload the default plugins (this may take a few minutes depending on your internet speed)
```bash
docker exec -it cfy_manager_local sh -c "cfy plugins bundle-upload"
```

**Tip**: Read more about Cloudify [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}).

## Step 4: Upload, deploy and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The aws-cloudformation infrastructure blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/aws-cloudformation.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repository.
The flow to do that is :

 * (1) upload the blueprint
 * (2) create a deployment from that uploaded blueprint - this generates a model in Cloudify DB
 * (3) run the install workflow for that created deployment to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**.


```bash
docker exec -it cfy_manager_local sh -c "cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-40/virtual-machine.zip -n aws-cloudformation.yaml"
```

**Note**:On this example AWS region can be only one of those: us-east-1, us-west-1, us-west-2, eu-west-1. In order to choose region just add "-i aws_region_name=<value>" to the command above.


**Tip**: If Cloudify print out any error on this stage (for example, wrong credentials were provided) and deployment was created run:
```
docker exec -it cfy_manager_local sh -c "cfy executions start uninstall -d virtual-machine.aws-cloudformation -p ignore_failure=true"
docker exec -it cfy_manager_local sh -c "cfy uninstall virtual-machine.aws-cloudformation"
```
Fix your mistake and try again.

If you run the uninstall commands above and got this error message:
```
An error occurred on the server: 404: Requested `Deployment` with ID `virtual-machine.aws-cloudformation` was not found
```
Just delete the "virtual-machine.aws-cloudformation" blueprint and try the install command again (read about [blueprints] ({{< relref "cli/orch_cli/blueprints.md" >}}) and [deployments]({{< relref "cli/orch_cli/deployments.md" >}}) commands).

## Step 5: Check your orchestrated services

In this example we have setup a simple infrastructure.

Let's examine what we have done:

An EC2 Instance was created in the region specified alongside network and various other nodes (contained in two_tier_stack).

In order to see The EC2 Instance that was created go to your AWS console, change the region to the region you chose during the deployment creation, click on EC2 -> Running instances.

You should see an active VM with the name "cf-virtual-machine-example".

You can easily get a list of these deployed nodes by running:
```bash
docker exec -it cfy_manager_local sh -c "cfy nodes list -d virtual-machine.aws-cloudformation"
```

which will return:

```bash
Listing nodes for deployment virtual-machine.aws-cloudformation...

Nodes:
+------------------+------------------------------------+------------------------------------+---------+-----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|        id        |           deployment_id            |            blueprint_id            | host_id |                   type                  | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+------------------+------------------------------------+------------------------------------+---------+-----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
| two_tier_keypair | virtual-machine.aws-cloudformation | virtual-machine.aws-cloudformation |         |      cloudify.nodes.aws.ec2.Keypair     |   tenant   | default_tenant |          1          |              1              |   admin    |
|  two_tier_stack  | virtual-machine.aws-cloudformation | virtual-machine.aws-cloudformation |         | cloudify.nodes.aws.CloudFormation.Stack |   tenant   | default_tenant |          1          |              1              |   admin    |
+------------------+------------------------------------+------------------------------------+---------+-----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 2 of 2 nodes

```
on this example we got two nodes that deploy the instance with key pair that using CloudFormation template file.
You can check the CloudFormation template file of this example [here](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/resources/cloudformation/template.yaml).

**Tip**: To check out some more commands to use with Cloudify Manager, run `cfy --help`.

An even easier way to review your deployment is through Cloudify management console.
Login to the UI and browse to the Deployments page.
Select the deployment (virtual-machine.aws) and explore the topology, inputs, outputs, nodes, and logs.

![aws_cloudformation_simple_vm_topology.png]( /images/trial_getting_started/aws_cloudformation_simple_vm_topology.png )

This will also be a good time to examine the Cloudify blueprint used in the example.
The blueprint can be examined in the Cloudify UI, however in this case
we will go to the Cloudify examples repository in github and examine it there: [aws-cloudformation.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/aws-cloudformation.yaml).


## Step 6: OK, I am done, how do I tear it down?

To remove the deployment and delete all resources from AWS simply run the uninstall command:
```bash
docker exec -it cfy_manager_local sh -c "cfy uninstall virtual-machine.aws-cloudformation"
```


----


## Applying the above steps using the Cloudify management console
This section explains how to run the above described steps using
Cloudify management console UI instead of the command line options.
The UI and the CLI can be used interchangeably for all Cloudify activities.

Firstly, complete Cloudify manager installation inside docker container(step 1 above),
if you are using Cloudify lab you can skip this step.

`1`. Download the example zip [here](https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-40/virtual-machine.zip).

`2`. Go to localhost in your browser to see the Cloudify UI. Login and password are both _admin_.

`3`. To upload the required plugins go to **Cloudify Catalog** and upload the plugins you need to use
     (for this example aws-plugin and utilities-plugin are needed).

`4`. Go to **System Resources** on the left side menu and scroll down to the **Secret Store Management** widget.
Create secrets using the `Create` button by adding the following keys and their matching values:

```bash

aws_access_key_id
aws_secret_access_key

```

**Tip**:


 - For more information about the secrets values go to step 2 on **CLI steps** described above.

`5`. On the right side of the local blueprints page, select **Upload**.

`6`. Paste the URL of the blueprint package in the URL field. Provide any name you like.

`7`. Select aws-cloudformation.yaml from the Blueprint YAML file menu
     (You can leave the Blueprint icon field blank. It is only for decoration).

`8`. Click **Upload**.

The blueprint should appear in the blueprint list under the name you provided.

`9`. On the right, you will see a rocket icon. click the rocket icon and create deployment dialog will be shown.

`10`. Provide a name you like in the Deployment name field.

`11`. You can skip the Site name field.

`12`. Provide values for any inputs that you would like to change.

`13`. Click **Deploy**.

The newly created deployment should appear in the deployment list under the name you provided.

`14`. Go to Deployments and press on your deployment, then press **Execute workflow->Default workflows->Install**

You did it!
