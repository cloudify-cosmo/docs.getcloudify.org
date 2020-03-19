+++
title = "AWS hello-world"
description = "Installing the Cloudify trial manager"
weight = 40
alwaysopen = false
+++

{{%children style="h2" description="true"%}}


This Example demonstrates a simple topology setup in **Amazon Web Services (AWS)**, the deployment consists of a VM, a simple web service + app, and all of the essential peripherals in AWS (VPC, security group, network interface, etc.)

Cloudify allows for multiple user interfaces. In this tutorial we will demonstrate the usage of the Cloudify management console (web UI) and the Cloudify command line (cfy). The following steps demonstrate both approaches.


## Step 1: Install the Cloudify Manager inside Docker container

In order to deploy the Cloudify manager inside Docker container follow the instructions in [this page]({{< relref "trial_getting_started/trial_install.md" >}}).


## Step 2: Create the secrets containing the AWS access keys

To connect to AWS a set of access key and secret are required. Cloudify recommends storing such sensitive information in a Cloudify secret. Secrets are kept encrypted in a secure way and used in run-time by the system. learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).
Use AWS IAM settings to create an access key.

Store the secrets in the manager:
This can be done through command line or directly via Cloudify management console.

From the hosting shell run:
```bash
docker exec -it cfy_manager_local sh -c "cfy secrets create aws_access_key_id --secret-string <value>"
docker exec -it cfy_manager_local sh -c "cfy secrets create aws_secret_access_key --secret-string <value>"
```

_**Tip**: Running commands on Docker containers can be applied directly from the hosting shell by encapsulating the command in quotes and using the docker exec command. for example: `docker exec -it <container name> sh -c "<the command>"`.  Alternatively one may open a shell directly in the container by executing: `docker exec -it <container image name> /bin/bash`_

## Step 3: Upload the default plugins (this takes a few minutes)

Plugins are Cloudify's extendable interfaces to services, cloud providers, and automation tools. Connecting to AWS requires the AWS plugin. One may upload just specific plugins or for simplicity upload the plugin bundle containing all the basic pre-canned plugins.

Upload the default plugins (this takes a few minutes)
```bash
docker exec -it cfy_manager_local sh -c "cfy plugins bundle-upload"
```
**Tip**: Read more about Cloudify [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}). 

## Step 4: Upload, deploy, and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services, or any orchestrated object topology. Blueprints are represented as descriptive code (yaml files) and typically stored and managed as part of the source repository. The hello-world blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/aws.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repo. The flow is (1) upload the blueprint (2) deploy the blueprint - this generates a model in the Cloudify DB (3) Run the install workflow to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**. 


_**Note**: specify the AWS region in the below command_

```bash
docker exec -it cfy_manager_local sh -c "cfy install https://github.com/cloudify-cosmo/cloudify-hello-world-example/archive/master.zip -n aws.yaml -i aws_region_name=<AWS_REGION_NAME>"
```
# need to fix the link to the zip above!


## Step 5: Check your orchestrated services

In this example we  have setup a simple web service. To access that service we need to get it's URL.
System properties generated in runtime, such as allocated IPs, URLs, etc. can be stored and retreived in several ways. in this example we are using the deployment **Outputs** as the means to get this info. During installation the relevant properties are stored in the deployment Outputs and can now be retrieved via the CLI or the UI.

To get the Outputs of our deployment run:
```bash
docker exec -it cfy_manager_local sh -c "cfy deployment outputs cloudify-hello-world-example-master.aws"
```

The returned output would look like:
``` bash
Retrieving outputs for deployment cloudify-hello-world-example-master.aws...
 - "application_endpoint":
     Description: The external endpoint of the application.
     Value: http://3.122.71.142:80
```

Copy and paste the URL **Value** into your browser, and if you see the **Hello world** page, you did it!

Let's examine what we have done:
A VM was created in the region specified in the blueprint input, alongside VPC and various other nodes.

You can easily get a list of these deployed nodes by running:
```bash
cfy nodes list -d cloudify-hello-world-example-master.aws
```

which will return

```bash
Listing nodes for deployment cloudify-hello-world-example-master.aws...                                                                                                                                                                                                                 

Nodes:                                                                                                                                                                                                                                                                                  
+--------------------------------------+-----------------------------------------+-----------------------------------------+---------+-------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|                  id                  |              deployment_id              |               blueprint_id              | host_id |                       type                      | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+--------------------------------------+-----------------------------------------+-----------------------------------------+---------+-------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|                 ami                  | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |         |           cloudify.nodes.aws.ec2.Image          |   tenant   | default_tenant |          1          |              1              |   admin    |
|                subnet                | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |         |          cloudify.nodes.aws.ec2.Subnet          |   tenant   | default_tenant |          1          |              1              |   admin    |
|              routetable              | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |         |        cloudify.nodes.aws.ec2.RouteTable        |   tenant   | default_tenant |          1          |              1              |   admin    |
|           internet_gateway           | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |         |      cloudify.nodes.aws.ec2.InternetGateway     |   tenant   | default_tenant |          1          |              1              |   admin    |
|                  ip                  | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |         |         cloudify.nodes.aws.ec2.ElasticIP        |   tenant   | default_tenant |          1          |              1              |   admin    |
|                  vm                  | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |    vm   |         cloudify.nodes.aws.ec2.Instances        |   tenant   | default_tenant |          1          |              1              |   admin    |
|         security_group_rules         | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |         | cloudify.nodes.aws.ec2.SecurityGroupRuleIngress |   tenant   | default_tenant |          1          |              1              |   admin    |
|                 vpc                  | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |         |            cloudify.nodes.aws.ec2.Vpc           |   tenant   | default_tenant |          1          |              1              |   admin    |
|                 nic                  | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |         |         cloudify.nodes.aws.ec2.Interface        |   tenant   | default_tenant |          1          |              1              |   admin    |
|            security_group            | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |         |       cloudify.nodes.aws.ec2.SecurityGroup      |   tenant   | default_tenant |          1          |              1              |   admin    |
| route_public_subnet_internet_gateway | cloudify-hello-world-example-master.aws | cloudify-hello-world-example-master.aws |         |           cloudify.nodes.aws.ec2.Route          |   tenant   | default_tenant |          1          |              1              |   admin    |
+--------------------------------------+-----------------------------------------+-----------------------------------------+---------+-------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 11 of 11 nodes                                                                                                                                                                                                                                                                  
```
_Tip: To check out some more commands to use with Cloudify Manager, run `cfy --help`_

An even easier way to review your deployment is through the Cloudify management console. Login to the UI and browse to the Deployments page. Select the deployment (cloudify-hello-world-example-master.aws) and explore the topology, inputs, outputs, nodes, and logs.

![aws_hello_world_deployment_topology.png]( /images/trial_getting_started/aws_hello_world_deployment_topology.png )

This will also be a good time to examine the Cloudify blueprint used in the example. The blueprint can be examined in the Cloudify UI, however in this case we will go to the Cloudify examples repository in github and examine it there: [https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/aws.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/aws.yaml)


## Step 6: OK, I am done, how do I tear it down?

To remove the deployment from AWS simply run the uninstall command:
```bash
docker exec -it cfy_manager_local sh -c "cfy uninstall cloudify-hello-world-example-master.<aws/gcp/azure/openstack>"
```


----


## Applying the above steps using the Cloudify management console
This section explains how to run the above described steps using the Cloudify management console UI instead of the command line options. The UI and the CLI can be used interchangeably for all Cloudify activities.

1. Download the example zip [here](https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-1/hello-world-example.zip) and unzip it.

2. Go to localhost in your browser to see the Cloudify UI. Login and password are both _admin_.

3. To upload the required plugins go to **Cloudify Catalog** and upload the plugins you need to use.

4. Go to **System Resources** on the left side menu and scroll down to the **Secret Store Management** widget. Create secrets using the `Create` button by adding the following keys and their matching values:

```
aws_access_key_id
aws_secret_access_key
```
5. Go to **Local Blueprints** and upload the **aws.yaml** blueprint.

6. Press on the **Create deployment** button(near the trash button).

7. Go to Deployments and press on your deployment, then press **Execute workflow->Default workflows->Install**

You did it!
