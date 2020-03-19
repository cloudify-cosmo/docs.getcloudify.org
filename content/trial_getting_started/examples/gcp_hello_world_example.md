+++
title = "GCP hello-world"
description = "Installing the Cloudify trial manager"
weight = 44
alwaysopen = false
+++

{{%children style="h2" description="true"%}}


This Example demonstrates a simple topology setup in **Google Cloud Platform (GCP)**, the deployment consists of a VM, a simple web service + app, and all of the essential peripherals in GCP (firewall, VPC network, etc.)

Cloudify allows for multiple user interfaces. In this tutorial we will demonstrate the usage of the Cloudify management console (web UI) and the Cloudify command line (cfy). The following steps demonstrate both approaches.

## Step 1: Install the Cloudify Manager inside Docker container

In order to deploy the Cloudify manager inside Docker container follow the instructions in [this page]({{< relref "trial_getting_started/trial_install.md" >}}).

## Step 2: Create the secrets containing GCP credentials

To connect to GCP a set of credentials are required. Cloudify recommends storing such sensitive information in a Cloudify secret. Secrets are kept encrypted in a secure way and used in run-time by the system. learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).

Use GCP IAM settings to create an service account key.

Store the secrets in the manager:
This can be done through command line or directly via Cloudify management console.

From the hosting shell run:
```bash   
docker exec -it cfy_manager_local sh -c "cfy secrets create gcp_credentials --secret-file ./path/to/JSON key"
docker exec -it cfy_manager_local sh -c "cfy secrets create gcp_zone --secret-string <zone>"
```                                             
gcp_credentials: A GCP service account key in JSON format. **Hint: We create this secret from a file.**

gcp_zone: A GCP Zone such as `us-east1-b`.

**Note**: If you are not familiar with GCP service accounts visit [GCP service accounts documentation](https://cloud.google.com/iam/docs/service-accounts).                                                          

_**Tip**: Running commands on Docker containers can be applied directly from the hosting shell by encapsulating the command in quotes and using the docker exec command. for example: `docker exec -it <container name> sh -c "<the command>"`.  Alternatively, you can open a shell directly in the container by executing: `docker exec -it <container image name> /bin/bash`_

## Step 3: Upload the default plugins (this takes a few minutes)

Plugins are Cloudify's extendable interfaces to services, cloud providers, and automation tools. Connecting to GCP requires the GCP plugin. One may upload just specific plugins or for simplicity upload the plugin bundle containing all the basic pre-canned plugins.

Upload the default plugins (this takes a few minutes)
```bash
docker exec -it cfy_manager_local sh -c "cfy plugins bundle-upload"
```
**Tip**: Read more about Cloudify [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}). 

## Step 4: Upload, deploy, and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services, or any orchestrated object topology. Blueprints are represented as descriptive code (yaml files) and typically stored and managed as part of the source repository. The hello-world blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/gcp.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repo.
The flow is (1) upload the blueprint (2) deploy the blueprint - this generates a model in the Cloudify DB (3) Run the install workflow to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**. 


**Note**: specify the GCP region in the below command(it should be compatible with your gcp_zone)

```bash
docker exec -it cfy_manager_local sh -c "cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-1/hello-world-example.zip -n gcp.yaml -i region=<GCP_REGION>"
```
# need to fix the link to the zip above!

## Step 4: Check your orchestrated services

In this example we  have setup a simple web service. To access that service we need to get it's URL.
System properties generated in runtime, such as allocated IPs, URLs, etc. can be stored and retrieved in several ways. in this example we are using the deployment **Outputs** as the means to get this info. During installation the relevant properties are stored in the deployment Outputs and can now be retrieved via the CLI or the UI.

To get the Outputs of our deployment run:
```bash
docker exec -it cfy_manager_local sh -c "cfy deployment outputs hello-world-example.gcp"
```
The returned output would look like:
``` bash
Retrieving outputs for deployment hello-world-example.gcp...
 - "application_endpoint":
     Description: The external endpoint of the application.
     Value: http://3.122.71.142:80
```

Copy and paste the URL **Value** into your browser, and if you see the **Hello world** page, you did it!

Let's examine what we have done:
A VM was created in the region specified in the blueprint input, alongside network and various other nodes.

You can easily get a list of these deployed nodes by running:
```bash
cfy nodes list -d hello-world-example.gcp
```

which will return

```bash
Listing nodes for deployment hello-world-example.gcp...

Nodes:
+-------------+-------------------------+-------------------------+---------+---------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|      id     |      deployment_id      |       blueprint_id      | host_id |               type              | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+-------------+-------------------------+-------------------------+---------+---------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|   firewall  | hello-world-example.gcp | hello-world-example.gcp |         | cloudify.gcp.nodes.FirewallRule |   tenant   | default_tenant |          1          |              1              |   admin    |
|    subnet   | hello-world-example.gcp | hello-world-example.gcp |         |  cloudify.gcp.nodes.SubNetwork  |   tenant   | default_tenant |          1          |              1              |   admin    |
| hello-world | hello-world-example.gcp | hello-world-example.gcp |         | cloudify.nodes.ansible.Playbook |   tenant   | default_tenant |          1          |              1              |   admin    |
|   network   | hello-world-example.gcp | hello-world-example.gcp |         |    cloudify.gcp.nodes.Network   |   tenant   | default_tenant |          1          |              1              |   admin    |
|      vm     | hello-world-example.gcp | hello-world-example.gcp |    vm   |   cloudify.gcp.nodes.Instance   |   tenant   | default_tenant |          1          |              1              |   admin    |
+-------------+-------------------------+-------------------------+---------+---------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 5 of 5 nodes
                                                                                                                                                                                                                                         
```
_Tip: To check out some more commands to use with Cloudify Manager, run `cfy --help`_


An even easier way to review your deployment is through the Cloudify management console. Login to the UI and browse to the Deployments page. Select the deployment (hello-world-example.gcp) and explore the topology, inputs, outputs, nodes, and logs.

![gcp_hello_world_deployment_topology.png]( /images/trial_getting_started/gcp_hello_world_deployment_topology.png )

This will also be a good time to examine the Cloudify blueprint used in the example. The blueprint can be examined in the Cloudify UI, however in this case we will go to the Cloudify examples repository in github and examine it there: [https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/gcp.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/gcp.yaml).


## Step 5: OK, I am done, how do I tear it down?

To remove the deployment from GCP simply run the uninstall command:
```bash
docker exec -it cfy_manager_local sh -c "cfy uninstall hello-world-example.<aws/gcp/azure/openstack>"
```


----


## Applying the above steps using the Cloudify management console
This section explains how to run the above described steps using the Cloudify management console UI instead of the command line options. The UI and the CLI can be used interchangeably for all Cloudify activities.

1. Download the example zip [here](https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-1/hello-world-example.zip) and unzip it.

2. Go to localhost in your browser to see the Cloudify UI. Login and password are both _admin_.

3. To upload the required plugins go to **Cloudify Catalog** and upload the plugins you need to use.

4. Go to **System Resources** on the left side menu and scroll down to the **Secret Store Management** widget. Create secrets using the `Create` button by adding the following keys and their matching values:

``` 
gcp_credentials
gcp_zone
```

5. Go to **Local Blueprints** and upload the **gcp.yaml** blueprint.

6. Press on the **Create deployment** button(near the trash button).

7. Go to Deployments and press on your deployment, then press **Execute workflow->Default workflows->Install**

You did it!
