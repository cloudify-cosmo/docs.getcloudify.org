+++
title = "OpenStack hello-world"
description = "OpenStack - Simple hello world"
weight = 46
alwaysopen = false
+++

{{%children style="h2" description="true"%}}


This Example demonstrates a simple topology setup in **OpenStack**,
the deployment consists of :

 * VM
 * Simple Web Server + Simple Page
 * All of the essential peripherals in OpenStack (security group, network, etc.)

Cloudify allows for multiple user interfaces.
In this tutorial we will demonstrate the usage of Cloudify management console (web UI)
and the Cloudify command line interface (CLI).

The following steps demonstrate firstly the **CLI approach**,
while the last section demonstrates **the web UI** approach.

## Step 1: Install Cloudify Manager inside Docker container

In order to deploy Cloudify manager inside Docker container follow the instructions in [this page]({{< relref "trial_getting_started/set_trial_manager/trial_install.md" >}}).

## Step 2: Create the secrets containing OpenStack credentials

To connect to OpenStack a set of credentials are required.
Cloudify recommends storing such sensitive information in a Cloudify secret.
Secrets are kept encrypted in a secure way and used in run-time by the system.
Learn more about Cloudify secrets [here]({{< relref "/cli/orch_cli/secrets.md" >}}).

To store the secrets in the manager:

This can be done through the command line or directly via Cloudify management console.

From the hosting shell run:
```bash   
docker exec -it cfy_manager_local sh -c "cfy secrets create openstack_username --secret-string <user_name>"
docker exec -it cfy_manager_local sh -c "cfy secrets create openstack_password --secret-string <password>"
docker exec -it cfy_manager_local sh -c "cfy secrets create openstack_tenant_name --secret-string <tenant_name>"
docker exec -it cfy_manager_local sh -c "cfy secrets create openstack_auth_url --secret-string <url>"

```                                             
you can get the values for these secrets from your OpenStack environment
by going to your OpenStack project and under Compute on the side menu then Access&Security
then sub-tab API Access there you will find Download OpenStack RC File that will contain them.

**Note** openstack_auth_url - For this example use v3 authentication url.

**Tips**:
1. Running commands on Docker containers can be applied
directly from the hosting shell by encapsulating the command in quotes
and using the docker exec command.
For example: `docker exec -it <container name> sh -c "<the command>"`.
Alternatively one may open a shell directly in the container by executing:
`docker exec -it <container image name> /bin/bash`

2.You can also source the OpenStack RC file, then use the environment variables, for example:
```
docker exec -it cfy_manager_local sh -c   "cfy secrets create openstack_username -s ${OS_USERNAME}"
```
You can read [here](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux_OpenStack_Platform/4/html/End_User_Guide/cli_openrc.html) how to do so.


## Step 3: Upload the default plugins

Plugins are Cloudify's extendable interfaces to services, cloud providers, and automation tools.
Connecting to OpenStack requires the OpenStack plugin.One may upload just specific plugins
or for simplicity upload the plugin bundle containing all the basic pre-packaged plugins.

Upload the default plugins (this may take a few minutes depending on your internet speed)
```bash
docker exec -it cfy_manager_local sh -c "cfy plugins bundle-upload"
```
**Tip**: Read more about Cloudify [plugins]({{< relref "/working_with/official_plugins/_index.md" >}}) and [writing your own plugins]({{< relref "/developer/writing_plugins/_index.md" >}}).

## Step 4: Upload, deploy and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The hello-world blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/openstack.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repository.
The flow to do that is :

 * (1) upload the blueprint
 * (2) create a deployment from that uploaded blueprint - this generates a model in Cloudify DB
 * (3) run the install workflow for that created deployment to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**.


**Notes**:

Specify these inputs in the below command:

1. region - OS_REGION_NAME as specified in OpenStack RC file.

2. external_network_id - the Floating IP network id in OpenStack. For example, on RackSpace it is the id of "GATEWAY_NET".

3. image - the image_id of trusty Ubuntu in your OpenStack account.

4. flavor - your image flavor. For example, on RackSpace it is "m1.small".

5. user_domain_name - your openstack user domain name, usually "default".

6. project_domain_name - your openstack project domain name, usually "default".

```bash
docker exec -it cfy_manager_local sh -c "cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip -n openstack.yaml -i region=<Openstack_REGION> -i external_network_id=<NETWORK_ID> -i image=<UBUNTU_TRUSTY_IMAGE_ID> -i flavor=<IMAGE_FLAVOR> -i user_domain_name=<value> -i project_domain_name=<value> "
```

**Tip**: If Cloudify print out any error on this stage (for example, wrong credentials were provided) and deployment was created run:
```
docker exec -it cfy_manager_local sh -c "cfy executions start uninstall -d hello-world-example.openstack -p ignore_failure=true"
docker exec -it cfy_manager_local sh -c "cfy uninstall hello-world-example.openstack"
```
Fix your mistake and try again.

If you run the uninstall commands above and got this error message:
```
An error occurred on the server: 404: Requested `Deployment` with ID `hello-world-example.openstack` was not found
```
Just delete the hello-world-example.openstack blueprint and try the install command again (read about [blueprints] ({{< relref "cli/orch_cli/blueprints.md" >}}) and [deployments]({{< relref "cli/orch_cli/deployments.md" >}}) commands).


## Step 5: Check your orchestrated services

In this example we have setup a simple web server with a simple html page.
To access that server page we need to get it's URL.
System properties generated in runtime, such as allocated IPs, URLs, etc...
can be stored and retrieved in several ways.
In this example we are using the deployment **Outputs** as the means to get this info.
During installation the relevant properties are stored in the deployment Outputs
and can now be retrieved via the CLI or the UI.

To get the Outputs of our deployment run:
```bash
docker exec -it cfy_manager_local sh -c "cfy deployment outputs hello-world-example.openstack"
```
The returned output would look like:
```bash
Retrieving outputs for deployment hello-world-example.openstack...
 - "application_endpoint":
     Description: The external endpoint of the application.
     Value: http://3.122.71.142:80
```

Copy and paste the URL **Value** into your browser, and if you see the **Hello World** page, you did it!

Let's examine what we have done:

A VM was created in the region specified in the blueprint input, alongside network and various other nodes.

You can easily get a list of these deployed nodes by running:
```bash
docker exec -it cfy_manager_local sh -c "cfy nodes list -d hello-world-example.openstack"
```

which will return

```bash
Listing nodes for deployment hello-world-example.openstack...

Nodes:
+------------------+-------------------------------+-------------------------------+---------+----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|        id        |         deployment_id         |          blueprint_id         | host_id |                  type                  | visibility |  tenant_name   | number_of_instances | planned_number_of_instances | created_by |
+------------------+-------------------------------+-------------------------------+---------+----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+
|    cloud_init    | hello-world-example.openstack | hello-world-example.openstack |         |  cloudify.nodes.CloudInit.CloudConfig  |   tenant   | default_tenant |          1          |              1              |   admin    |
|        ip        | hello-world-example.openstack | hello-world-example.openstack |         |  cloudify.nodes.openstack.FloatingIP   |   tenant   | default_tenant |          1          |              1              |   admin    |
|      subnet      | hello-world-example.openstack | hello-world-example.openstack |         |    cloudify.nodes.openstack.Subnet     |   tenant   | default_tenant |          1          |              1              |   admin    |
|   hello-world    | hello-world-example.openstack | hello-world-example.openstack |         |    cloudify.nodes.ansible.Playbook     |   tenant   | default_tenant |          1          |              1              |   admin    |
|     network      | hello-world-example.openstack | hello-world-example.openstack |         |    cloudify.nodes.openstack.Network    |   tenant   | default_tenant |          1          |              1              |   admin    |
|  security-group  | hello-world-example.openstack | hello-world-example.openstack |         | cloudify.nodes.openstack.SecurityGroup |   tenant   | default_tenant |          1          |              1              |   admin    |
|        vm        | hello-world-example.openstack | hello-world-example.openstack |    vm   |    cloudify.nodes.openstack.Server     |   tenant   | default_tenant |          1          |              1              |   admin    |
| external-network | hello-world-example.openstack | hello-world-example.openstack |         |    cloudify.nodes.openstack.Network    |   tenant   | default_tenant |          1          |              1              |   admin    |
|      router      | hello-world-example.openstack | hello-world-example.openstack |         |    cloudify.nodes.openstack.Router     |   tenant   | default_tenant |          1          |              1              |   admin    |
|       port       | hello-world-example.openstack | hello-world-example.openstack |         |     cloudify.nodes.openstack.Port      |   tenant   | default_tenant |          1          |              1              |   admin    |
+------------------+-------------------------------+-------------------------------+---------+----------------------------------------+------------+----------------+---------------------+-----------------------------+------------+

Showing 10 of 10 nodes

```
**Tip**: To check out some more commands to use with Cloudify Manager, run `cfy --help`.


An even easier way to review your deployment is through Cloudify management console.
Login to the UI and browse to the Deployments page.
Select the deployment (hello-world-example.openstack) and explore the topology, inputs, outputs, nodes, and logs.

![openstack_hello_world_deployment_topology.png]( /images/trial_getting_started/openstack_hello_world_deployment_topology.png )

This will also be a good time to examine the Cloudify blueprint used in the example.
The blueprint can be examined in the Cloudify UI, however in this case
we will go to the Cloudify examples repository in github and examine it there: [openstack.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/hello-world-example/openstack.yaml).


## Step 6: OK, I am done, how do I tear it down?

To remove the deployment and delete all resources from OpenStack simply run the uninstall command:
```bash
docker exec -it cfy_manager_local sh -c "cfy uninstall hello-world-example.openstack"
```


----


## Applying the above steps using Cloudify management console
This section explains how to run the above described steps using
Cloudify management console UI instead of the command line options.
The UI and the CLI can be used interchangeably for all Cloudify activities.

Firstly, complete Cloudify manager installation inside docker container(step 1 above),
if you are using Cloudify lab you can skip this step.

`1`. Download the example zip [here](https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip).

`2`. Go to localhost in your browser to see Cloudify UI. Login and password are both _admin_.

`3`. To upload the required plugins go to **Cloudify Catalog** and upload the plugins you need to use
     (for this example openstack-plugin, ansible-plugin and utilities-plugin are needed).

`4`. Go to **System Resources** on the left side menu and scroll down to the **Secret Store Management** widget.
Create secrets using the `Create` button by adding the following keys and their matching values:

```
openstack_username
openstack_password
openstack_tenant_name
openstack_auth_url

```

**Tip**:

 - For more information about the secrets values go to step 2 on **CLI steps** described above.

`5`. On the right side of the local blueprints page, select **Upload**.

`6`. Paste the URL of the blueprint package in the URL field. Provide any name you like.

`7`. Select openstack.yaml from the Blueprint YAML file menu
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
