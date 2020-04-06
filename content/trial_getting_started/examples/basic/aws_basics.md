+++
title = "AWS - Infrastructure provisioning basics"
description = "AWS - Infrastructure provisioning basics"
weight = 22
alwaysopen = false
+++

{{%children style="h2" description="true"%}}


This Example demonstrates a simple infrastructure setup in **Amazon Web Services (AWS)**, the deployment consists of a VM, security group, vpc network , and all of the essential peripherals in AWS (ip, nic, etc.).

On this example we will deploy only the infrastructure, later on advanced examples(multi cloud examples) we will deploy an application on this specific infrastructure. 

Cloudify allows for multiple user interfaces. In this tutorial we will demonstrate the usage of the Cloudify management console (web UI) and the Cloudify command line interface (CLI).

The following steps demonstrate firstly the **CLI approach**, while the last section demonstrates **the web UI** approach.



## Step 1: Install the Cloudify Manager inside Docker container

In order to deploy the Cloudify manager inside Docker container follow the instructions on [this page]({{< relref "trial_getting_started/trial_install.md" >}}).


## Step 2: Create the secrets containing the AWS access keys

To connect to AWS a set of access key and secret are required. Cloudify recommends storing such sensitive information in a Cloudify secret. Secrets are kept encrypted in a secure way and used in run-time by the system. Learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).
Use AWS IAM settings to create an access key.

Store the secrets in the manager:
This can be done through the command line or directly via Cloudify management console.

From the hosting shell run:
```bash
docker exec -it cfy_manager_local sh -c "cfy secrets create aws_access_key_id --secret-string <value>"
docker exec -it cfy_manager_local sh -c "cfy secrets create aws_secret_access_key --secret-string <value>"
docker exec -it cfy_manager_local sh -c "cfy secrets create aws_region_name --secret-string <value>"

```
**Note**:AWS region can be for example: us-east-1, us-west-1, etc.

Two more secrets are needed:

agent_key_public: Public key content(usually located at: ~/.ssh/id_rsa.pub).

agent_key_private: Private key content(usually located at: ~/.ssh/id_rsa).

From the hosting shell run:
```
sudo docker cp ~/.ssh/id_rsa.pub  cfy_manager_local:./
sudo docker cp ~/.ssh/id_rsa  cfy_manager_local:./
docker exec -it cfy_manager_local sh -c "cfy secrets create -u agent_key_public -f id_rsa.pub"
docker exec -it cfy_manager_local sh -c "cfy secrets create -u agent_key_private -f id_rsa"
```
**Note**: You can also create those secrets from the UI easily(see last section).

**Tip**: Running commands on Docker containers can be applied directly from the hosting shell by encapsulating the command in quotes and using the docker exec command. For example: `docker exec -it <container name> sh -c "<the command>"`.  Alternatively one may open a shell directly in the container by executing: `docker exec -it <container image name> /bin/bash`

## Step 3: Upload the default plugins

Plugins are Cloudify's extendable interfaces to services, cloud providers, and automation tools. Connecting to AWS requires the AWS plugin. One may upload just specific plugins or for simplicity upload the plugin bundle containing all the basic pre-canned plugins.

Upload the default plugins (this takes a few minutes)
```bash
docker exec -it cfy_manager_local sh -c "cfy plugins bundle-upload"
```

**Tip**: Read more about Cloudify [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}). 

## Step 4: Upload, deploy, and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services, or any orchestrated object topology. Blueprints are represented as descriptive code (yaml files) and typically stored and managed as part of the source repository. The aws infrastructure blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/aws.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repository. The flow is (1) upload the blueprint (2) deploy the blueprint - this generates a model in the Cloudify DB (3) Run the install workflow to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**. 




```bash
docker exec -it cfy_manager_local sh -c "cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-9/virtual-machine.zip -n aws.yaml"
```

**Tip**: If Cloudify got an error on this stage (for example,wrong credentials was provided) and deployment created run:
```
cfy executions start uninstall -d virtual-machine.aws -p ignore_failure=true
cfy  uninstall virtual-machine.aws
```
Fix your mistake and try again. 

If you run the uninstall commands above and got this error message:
```
An error occurred on the server: 404: Requested `Deployment` with ID `virtual-machine.aws` was not found
``` 
Just delete the "virtual-machine.aws" blueprint and try the install command again(read about [blueprints] ({{< relref "cli/orch_cli/blueprints.md" >}}) and [deployments]({{< relref "cli/orch_cli/deployments.md" >}}) commands).

## Step 5: Check your orchestrated services

In this example we  have setup a simple infrastructure. 

Let's examine what we have done:

A VM was created in the region specified in the secrets, alongside VPC and various other nodes.

Go to your AWS console and see the VM and other instances that created.

You can easily get a list of these deployed nodes by running:
```bash
docker exec -it cfy_manager_local sh -c "cfy nodes list -d virtual-machine.aws"
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

An even easier way to review your deployment is through the Cloudify management console. Login to the UI and browse to the Deployments page. Select the deployment (virtual-machine.aws) and explore the topology, inputs, outputs, nodes, and logs.

![aws_simple_vm_topology.png]( /images/trial_getting_started/aws_simple_vm_topology.png )

This will also be a good time to examine the Cloudify blueprint used in the example. The blueprint can be examined in the Cloudify UI, however in this case we will go to the Cloudify examples repository in github and examine it there: [https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/aws.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/virtual-machine/aws.yaml)


## Step 6: OK, I am done, how do I tear it down?

To remove the deployment from AWS simply run the uninstall command:
```bash
docker exec -it cfy_manager_local sh -c "cfy uninstall virtual-machine.aws"
```


----


## Applying the above steps using the Cloudify management console
This section explains how to run the above described steps using the Cloudify management console UI instead of the command line options. The UI and the CLI can be used interchangeably for all Cloudify activities.

Firstly, complete the cloudify manager install inside docker container(step 1 above), if you are using cloudify lab you can pass this step. 

`1`. Download the example zip [here](https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-9/virtual-machine.zip).

`2`. Go to localhost in your browser to see the Cloudify UI. Login and password are both _admin_.

`3`. To upload the required plugins go to **Cloudify Catalog** and upload the plugins you need to use (for this example aws-plugin and utilities-plugin are needed).

`4`. Go to **System Resources** on the left side menu and scroll down to the **Secret Store Management** widget. Create secrets using the `Create` button by adding the following keys and their matching values:

```bash

aws_access_key_id
aws_secret_access_key
aws_region_name
agent_key_public
agent_key_private

```

**Tips**:
 
 - Create agent_key_public, agent_key_private secrets from a file.
 
 - For more information about the secrets values go to step 2 on **CLI steps** described above.
 
`5`. On the right side of the local blueprints page, select **Upload**.

`6`. Paste the URL of the blueprint package in the URL field. Provide any name you like.

`7`. Select aws.yaml from the Blueprint YAML file menu(You can leave the Blueprint icon field blank. It is only for decoration).

`8`. Click **Upload**.

The blueprint should appear in the blueprint list under the name you provided.

`9`. On the right, you will see a rocket icon. Select the rocket icon and you will enter the create deployment dialog.

`10`. Provide a name you like in the Deployment name field.

`11`. You can skip the Site name field.

`12`. Provide values for any inputs that you would like to change.

`13`. Click **Deploy**.

The blueprint should appear in the deployment list under the name you provided.

`14`. Go to Deployments and press on your deployment, then press **Execute workflow->Default workflows->Install**

You did it!
