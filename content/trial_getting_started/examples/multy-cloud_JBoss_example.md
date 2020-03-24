+++
title = "Multy-cloud JBoss Example"
description = "Multy-cloud JBoss Example"
weight = 48
alwaysopen = false
+++

This Example demonstrates deploying JBoss application on chosen infrastructure.

The infrastructure can be one of those:

1. Amazon web services (AWS).

2. AWS - terraform.

3. AWS - cloudformation.

4. Google cloud platform (GCP).

5. Azure. 

6. Azure - arm.

7. Openstack.


the infrastructure deployment  consists of a VM, a network and all of the essential peripherals in each infrastructure (For example in AWS: security group, nic, etc.).

the second deployment consists of the chosen infrastructure and the JBoss app.

Cloudify allows for multiple user interfaces. In this tutorial we will demonstrate the usage of the Cloudify management console (web UI) and the Cloudify command line (cfy). The following steps demonstrate both approaches.

## Step 1: Install the Cloudify Manager inside Docker container

In order to deploy the Cloudify manager inside Docker container follow the instructions in [this page]({{< relref "trial_getting_started/trial_install.md" >}}).

## Step 2: Create the secrets containing chosen infrastructure credentials
To connect to an infrastructure  a set of credentials are required. Cloudify recommends storing such sensitive information in a Cloudify secret. Secrets are kept encrypted in a secure way and used in run-time by the system. learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).

On this example, the infrastructure deployment is the same as on the simple infrastructure deployment examples, so the secrets are the same too.

follow stage 2 on your chosen infrastructure example:

For AWS:

visit [AWS - Infrastructure provisioning basics example]({{< relref "trial_getting_started/examples/aws_basics.md" >}}).

For AWS - terraform:

visit [AWS-terraform - Infrastructure provisioning basics example]({{< relref "trial_getting_started/examples/aws_terraform_basics.md" >}}).

For AWS - cloudformation:

visit [AWS-cloudformation - Infrastructure provisioning basics example]({{< relref "trial_getting_started/examples/aws_cloudformation_basics.md" >}}).

For GCP:

visit [GCP - Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/gcp_basics.md" >}}).

For Azure:

visit [Azure - Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/azure_basics.md" >}}).

For Azure-arm:

visit [Azure-arm - Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/azure_arm_basics.md" >}}).

For Openstack:

visit [Openstack - Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/openstack_basics.md" >}}).

## Step 3: Upload the default plugins (this takes a few minutes)

Plugins are Cloudify's extendable interfaces to services, cloud providers, and automation tools. Connecting to the infrastructure requires the infrastructure plugin. One may upload just specific plugins or for simplicity upload the plugin bundle containing all the basic pre-canned plugins.

Upload the default plugins (this takes a few minutes):

```bash
docker exec -it cfy_manager_local sh -c "cfy plugins bundle-upload"
```

**Tip**: Read more about Cloudify [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}). 

## Step 4: Upload, deploy, and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services, or any orchestrated object topology. Blueprints are represented as descriptive code (yaml files) and typically stored and managed as part of the source repository.
On this example, we actually deploy two blueprints:
1. the infrastructure blueprint, can be found [here](https://github.com/cloudify-community/blueprint-examples/tree/master/virtual-machine).
2. the mc-jboss  blueprint that links between the infrastructure deployment and the app, can be found [here](https://github.com/cloudify-community/blueprint-examples/blob/master/getting-started/mc-jboss.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repo.
The flow is (1) upload the blueprint (2) deploy the blueprint - this generates a model in the Cloudify DB (3) Run the install workflow to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**. 


**Notes**: 

Specify thoes inputs in the below command:

1. infra_name - the infrastructure to deploy on.

valid values are:
 - openstack
 - azure
 - azure-arm
 - aws
 - aws-terraform
 - aws-cloudformation
 - gcp

```bash
docker exec -it cfy_manager_local sh -c "cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-4/getting-started.zip -n mc-jboss.yaml -i infra_name=<YOUR_INFRASTRUCTURE_NAME> "
```

**Tip**: If Cloudify got an error on this stage (for example,wrong credentials was provided) and deployment created run:
```
cfy executions start uninstall -d getting-started.mc-jboss -p ignore_failure=true
cfy  uninstall getting-started.mc-jboss
```
Fix your mistake and try again. 

If you run the uninstall commands above and got this error message:
```
An error occurred on the server: 404: Requested `Deployment` with ID `getting-started.mc-jboss` was not found
``` 
Just delete the getting-started.mc-jboss and the infrastructure blueprints and try the install command again(read about [blueprints] ({{< relref "cli/orch_cli/blueprints.md" >}}) and [deployments]({{< relref "cli/orch_cli/deployments.md" >}}) commands).


## Step 5: Check your orchestrated services

In this example we  have setup a JBoss application. To access that service we need to get it's URL.
System properties generated in runtime, such as allocated IPs, URLs, etc. can be stored and retrieved in several ways. in this example we are using the deployment **Outputs** as the means to get this info. During installation the relevant properties are stored in the deployment Outputs and can now be retrieved via the CLI or the UI.

To get the Outputs of our deployment run:
```bash
docker exec -it cfy_manager_local sh -c "cfy deployment outputs getting-started.mc-jboss"
```

The returned output would look like:

``` bash
Retrieving outputs for deployment getting-started.mc-jboss...
 - "admin_url":
     Description: Administration console URL
     Value: http://15.223.62.18:9990/console

```

Copy and paste the URL **Value** into your browser, the username and the password are both "admin" ,you should see the HAL management console.

Let's examine what we have done:
An infrastructure deployment created as specified in the blueprint input (this infrastructure consist of VM, network etc.)

Moreover,An application deployment over the infrastructure created.

You can easily get a list of these deployed nodes by running:
```bash
docker exec -it cfy_manager_local sh -c "cfy nodes list -d getting-started.mc-jboss"
```

which will return:

```bash
Listing nodes for deployment getting-started.mc-jboss...

Nodes:
+----------------+--------------------------+--------------------------+---------+----------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|       id       |      deployment_id       |       blueprint_id       | host_id |               type               | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+----------------+--------------------------+--------------------------+---------+----------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|     jboss      | getting-started.mc-jboss | getting-started.mc-jboss |         | cloudify.nodes.ApplicationServer |   tenant   | default_tenant |          1          |              1              |   admin    |
| infrastructure | getting-started.mc-jboss | getting-started.mc-jboss |         |     cloudify.nodes.Component     |   tenant   | default_tenant |          1          |              1              |   admin    |
+----------------+--------------------------+--------------------------+---------+----------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 2 of 2 nodes
                                                                                                                                                  
```

**Note**: you can also see the infrastructure deployment nodes by replacing the name of the deployment (getting-started.mc-jboss) to the infrastructure deployment name.  

_Tip: To check out some more commands to use with Cloudify Manager, run `cfy --help`_


An even easier way to review your deployment is through the Cloudify management console. Login to the UI and browse to the Deployments page. Select the deployment (getting-started.mc-jboss) and explore the topology, inputs, outputs, nodes, and logs.

![mc_jboss_deployment_topology.png]( /images/trial_getting_started/mc_jboss_deployment_topology.png )


And, for example, the AWS infrastructure deployment:

![aws_infra_deployment_topology.png]( /images/trial_getting_started/aws_infra_deployment_topology.png )



This will also be a good time to examine the Cloudify blueprints used in the example.
The blueprint can be examined in the Cloudify UI, however in this case we will go to the Cloudify examples repository in github and examine the blueprints there: 
1. [infrstructure bluepint](https://github.com/cloudify-community/blueprint-examples/tree/master/virtual-machine).
2. [mc-jboss blueprint](https://github.com/cloudify-community/blueprint-examples/blob/master/getting-started/mc-jboss.yaml).

## Step 6: OK, I am done, how do I tear it down?

To remove the deployments simply run the uninstall command:
```bash
docker exec -it cfy_manager_local sh -c "cfy uninstall getting-started.mc-jboss"
```


----


## Applying the above steps using the Cloudify management console
This section explains how to run the above described steps using the Cloudify management console UI instead of the command line options. The UI and the CLI can be used interchangeably for all Cloudify activities.

1. Download the example zip [here](https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-5/getting-started.zip).

2. Go to localhost in your browser to see the Cloudify UI. Login and password are both _admin_.

3. To upload the required plugins go to **Cloudify Catalog** and upload the plugins you need to use.

4. Go to **System Resources** on the left side menu and scroll down to the **Secret Store Management** widget. Create secrets using the `Create` button by adding the following keys and their matching values(correspondingly your infrastructure).

5. Select **Local Blueprints** from the menu on the left.

6. On the right side of the local blueprints page, select **Upload**.

7. Paste the URL of the blueprint package in the URL field. Provide any name you like.

8. Select mc-jboss.yaml from the Blueprint YAML file menu(You can leave the Blueprint icon field blank. It is only for decoration).

9. Click **Upload**.

The blueprint should appear in the blueprint list under the name you provided.

10. On the right, you will see a rocket icon. Select the rocket icon and you will enter the create deployment dialog.

11. Provide a name you like in the Deployment name field.

12. You can skip the Site name field.

13. Provide values for any inputs that you would like to change.

14. Click Deploy.

The blueprint should appear in the deployment list under the name you provided.

15. Go to Deployments and press on your deployment, then press **Execute workflow->Default workflows->Install**

You did it!
