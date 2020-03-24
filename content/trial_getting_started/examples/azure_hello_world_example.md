+++
title = "Azure hello-world"
description = "Installing the Cloudify trial manager"
weight = 42
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

This Example demonstrates a simple topology setup in **Azure**, the deployment consists of a VM, a simple web service + app, and all of the essential peripherals in Azure (security group, network, etc.)

Cloudify allows for multiple user interfaces. In this tutorial we will demonstrate the usage of the Cloudify management console (web UI) and the Cloudify command line (cfy). The following steps demonstrate both approaches.

## Step 1: Install the Cloudify Manager inside Docker container

In order to deploy the Cloudify manager inside Docker container follow the instructions in [this page]({{< relref "trial_getting_started/trial_install.md" >}}).

## Step 2: Create the secrets containing Azure credentials

To connect to Azure a set of credentials are required. Cloudify recommends storing such sensitive information in a Cloudify secret. Secrets are kept encrypted in a secure way and used in run-time by the system. learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).

Store the secrets in the manager:

This can be done through command line or directly via Cloudify management console.

From the hosting shell run:
```bash   
docker exec -it cfy_manager_local sh -c "cfy secrets create azure_client_id --secret-string <client_id>"
docker exec -it cfy_manager_local sh -c "cfy secrets create azure_tenant_id --secret-string <tenant_id>"
docker exec -it cfy_manager_local sh -c "cfy secrets create azure_subscription_id --secret-string <subscription_id>"
docker exec -it cfy_manager_local sh -c "cfy secrets create azure_client_secret --secret-string <client_secret>"

```                                             
**Note**: For help with getting your Azure credentials read [Azure plugin documentation]({{< relref "working_with/official_plugins/Infrastructure/azure.md" >}}).

Two more secrets are needed:

agent_key_public: Public key content(usually located at: ~/.ssh/id_rsa.pub).

agent_key_private: Private key content(usually located at: ~/.ssh/id_rsa).

From the hosting shell run:

```
sudo docker cp ~/.ssh/id_rsa.pub  cfy_manager_local:./
sudo docker cp ~/.ssh/id_rsa  cfy_manager_local:./
docker exec -it cfy_manager_local sh -c "cfy secrets create -u agent_key_public -f id_rsa.pub"
docker exec -it cfy_manager_local sh -c "cfy secrets create -u agent_key_private -f ~/.ssh/id_rsa"
```
**Note**: You can also create those secrets from the UI easily(see last section).

**Tip**: Running commands on Docker containers can be applied directly from the hosting shell by encapsulating the command in quotes and using the docker exec command. for example: `docker exec -it <container name> sh -c "<the command>"`.  Alternatively, you can open a shell directly in the container by executing: `docker exec -it <container image name> /bin/bash`

## Step 3: Upload the default plugins (this takes a few minutes)

Plugins are Cloudify's extendable interfaces to services, cloud providers, and automation tools. Connecting to Azure requires the Azure plugin. One may upload just specific plugins or for simplicity upload the plugin bundle containing all the basic pre-canned plugins.

Upload the default plugins (this takes a few minutes)
```bash
docker exec -it cfy_manager_local sh -c "cfy plugins bundle-upload"
```
**Tip**: Read more about Cloudify [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}). 

## Step 4: Upload, deploy, and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services, or any orchestrated object topology. Blueprints are represented as descriptive code (yaml files) and typically stored and managed as part of the source repository. The hello-world blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/azure.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repo.
The flow is (1) upload the blueprint (2) deploy the blueprint - this generates a model in the Cloudify DB (3) Run the install workflow to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**. 


**Notes**: 

Specify thoes inputs in the below command:

1. location - Your Azure region.


```bash
docker exec -it cfy_manager_local sh -c "cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-1/hello-world-example.zip -n azure.yaml -i location=<YOUR_REGION> "
```

**Tip**: If Cloudify got an error on this stage (for example,wrong credentials was provided) and deployment created run:
```
cfy executions start uninstall -d hello-world-example.azure -p ignore_failure=true
cfy  uninstall hello-world-example.azure
```
Fix your mistake and try again. 

If you run the uninstall commands above and got this error message:
```
An error occurred on the server: 404: Requested `Deployment` with ID `hello-world-example.azure` was not found
``` 
Just delete the hello-world-example.azure blueprint and try the install command again(read about [blueprints] ({{< relref "cli/orch_cli/blueprints.md" >}}) and [deployments]({{< relref "cli/orch_cli/deployments.md" >}}) commands).

## Step 5: Check your orchestrated services

In this example we  have setup a simple web service. To access that service we need to get it's URL.
System properties generated in runtime, such as allocated IPs, URLs, etc. can be stored and retrieved in several ways. in this example we are using the deployment **Outputs** as the means to get this info. During installation the relevant properties are stored in the deployment Outputs and can now be retrieved via the CLI or the UI.

To get the Outputs of our deployment run:
```bash
docker exec -it cfy_manager_local sh -c "cfy deployment outputs hello-world-example.azure"
```
The returned output would look like:
``` bash
Retrieving outputs for deployment hello-world-example.azure...
 - "application_endpoint":
     Description: The external endpoint of the application.
     Value: http://13.92.102.8:80

```

Copy and paste the URL **Value** into your browser, and if you see the **Hello world** page, you did it!

Let's examine what we have done:
A VM was created in the region specified in the blueprint input, alongside network and various other nodes.

You can easily get a list of these deployed nodes by running:
```bash
docker exec -it cfy_manager_local sh -c "cfy nodes list -d hello-world-example.azure"
```

which will return

```bash
Listing nodes for deployment hello-world-example.azure...

Nodes:
+------------------------+---------------------------+---------------------------+---------+---------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|           id           |       deployment_id       |        blueprint_id       | host_id |                        type                       | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+------------------------+---------------------------+---------------------------+---------+---------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|         subnet         | hello-world-example.azure | hello-world-example.azure |         |        cloudify.azure.nodes.network.Subnet        |   tenant   | default_tenant |          1          |              1              |   admin    |
|    availability_set    | hello-world-example.azure | hello-world-example.azure |         |    cloudify.azure.nodes.compute.AvailabilitySet   |   tenant   | default_tenant |          1          |              1              |   admin    |
|        network         | hello-world-example.azure | hello-world-example.azure |         |    cloudify.azure.nodes.network.VirtualNetwork    |   tenant   | default_tenant |          1          |              1              |   admin    |
|     resource_group     | hello-world-example.azure | hello-world-example.azure |         |         cloudify.azure.nodes.ResourceGroup        |   tenant   | default_tenant |          1          |              1              |   admin    |
|          nic           | hello-world-example.azure | hello-world-example.azure |         | cloudify.azure.nodes.network.NetworkInterfaceCard |   tenant   | default_tenant |          1          |              1              |   admin    |
|           vm           | hello-world-example.azure | hello-world-example.azure |    vm   |    cloudify.azure.nodes.compute.VirtualMachine    |   tenant   | default_tenant |          1          |              1              |   admin    |
| network_security_group | hello-world-example.azure | hello-world-example.azure |         | cloudify.azure.nodes.network.NetworkSecurityGroup |   tenant   | default_tenant |          1          |              1              |   admin    |
|           ip           | hello-world-example.azure | hello-world-example.azure |         |    cloudify.azure.nodes.network.PublicIPAddress   |   tenant   | default_tenant |          1          |              1              |   admin    |
|    storage_account     | hello-world-example.azure | hello-world-example.azure |         |    cloudify.azure.nodes.storage.StorageAccount    |   tenant   | default_tenant |          1          |              1              |   admin    |
|      hello-world       | hello-world-example.azure | hello-world-example.azure |         |          cloudify.nodes.ansible.Playbook          |   tenant   | default_tenant |          1          |              1              |   admin    |
|       ip_config        | hello-world-example.azure | hello-world-example.azure |         |    cloudify.azure.nodes.network.IPConfiguration   |   tenant   | default_tenant |          1          |              1              |   admin    |
+------------------------+---------------------------+---------------------------+---------+---------------------------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 11 of 11 nodes
                                                                                                                                
```
**Tip**: To check out some more commands to use with Cloudify Manager, run `cfy --help`


An even easier way to review your deployment is through the Cloudify management console. Login to the UI and browse to the Deployments page. Select the deployment (hello-world-example.azure) and explore the topology, inputs, outputs, nodes, and logs.

![azure_hello_world_deployment_topology.png]( /images/trial_getting_started/azure_hello_world_deployment_topology.png )

This will also be a good time to examine the Cloudify blueprint used in the example. The blueprint can be examined in the Cloudify UI, however in this case we will go to the Cloudify examples repository in github and examine it there: [https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/azure.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/azure.yaml).


## Step 6: OK, I am done, how do I tear it down?

To remove the deployment from Azure simply run the uninstall command:
```bash
docker exec -it cfy_manager_local sh -c "cfy uninstall hello-world-example.azure"
```


----


## Applying the above steps using the Cloudify management console
This section explains how to run the above described steps using the Cloudify management console UI instead of the command line options. The UI and the CLI can be used interchangeably for all Cloudify activities.

1. Download the example zip [here](https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-7/hello-world-example.zip).

2. Go to localhost in your browser to see the Cloudify UI. Login and password are both _admin_.

3. To upload the required plugins go to **Cloudify Catalog** and upload the plugins you need to use.

4. Go to **System Resources** on the left side menu and scroll down to the **Secret Store Management** widget. Create secrets using the `Create` button by adding the following keys and their matching values:

``` 
azure_client_id
azure_tenant_id
azure_subscription_id
azure_client_secret
agent_key_public
agent_key_private
```

5. On the right side of the local blueprints page, select **Upload**.

6. Paste the URL of the blueprint package in the URL field. Provide any name you like.

7. Select azure.yaml from the Blueprint YAML file menu(You can leave the Blueprint icon field blank. It is only for decoration).

8. Click **Upload**.

The blueprint should appear in the blueprint list under the name you provided.

9. On the right, you will see a rocket icon. Select the rocket icon and you will enter the create deployment dialog.

10. Provide a name you like in the Deployment name field.

11. You can skip the Site name field.

12. Provide values for any inputs that you would like to change.

13. Click **Deploy**.

The blueprint should appear in the deployment list under the name you provided.

14. Go to Deployments and press on your deployment, then press **Execute workflow->Default workflows->Install**

You did it!
