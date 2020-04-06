+++
title = "Local hello-world"
description = "Installing the Cloudify trial manager"
weight = 20
alwaysopen = false
+++

{{%children style="h2" description="true"%}}


This Example demonstrates a simple deployment of local HTTP server and an hello-world aplication on top of it.

Cloudify allows for multiple user interfaces. In this tutorial we will demonstrate the usage of the Cloudify management console (web UI) and the Cloudify command line interface (CLI).

The following steps demonstrate firstly the **CLI approach**, while the last section demonstrates **the web UI** approach.


## Step 1: Install the Cloudify Manager inside Docker container

In order to deploy the Cloudify manager inside Docker container follow the instructions in [this page]({{< relref "trial_getting_started/trial_install.md" >}}).


## Step 2: Upload, deploy, and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services, or any orchestrated object topology. Blueprints are represented as descriptive code (yaml files) and typically stored and managed as part of the source repository. The hello-world blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/simple-hello-world-example/blueprint.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repository. The flow is (1) upload the blueprint (2) deploy the blueprint - this generates a model in the Cloudify DB (3) Run the install workflow to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**. 


```bash
docker exec -it cfy_manager_local sh -c "cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-14/simple-hello-world-example.zip -n blueprint.yaml"
```

**Note**: Usually, in order to connect and deploy instances on cloud platforms(such as AWS, Azure etc.) we need tho upload cloudify plugins, but on this example the infrastructure is locally and not interacting with any cloud provider so we just need to install the blueprint.

 
## Step 3: Check your orchestrated services

In this example we  have setup a simple web service. To access that service we need to get it's URL.
System properties generated in runtime, such as allocated IPs, URLs, etc. can be stored and retrieved in several ways. 
Firstly, in order to see that the deployment created run:
```bash
docker exec -it cfy_manager_local sh -c "cfy deployments list"
```

The returned output would look like:
``` bash
Listing all deployments...

Deployments:
+----------------------------+----------------------------+--------------------------+--------------------------+------------+----------------+------------+-----------+
|             id             |        blueprint_id        |        created_at        |        updated_at        | visibility |  tenant_name   | created_by | site_name |
+----------------------------+----------------------------+--------------------------+--------------------------+------------+----------------+------------+-----------+
| simple-hello-world-example | simple-hello-world-example | 2020-04-05 14:34:49.487  | 2020-04-05 14:34:49.487  |   tenant   | default_tenant |   admin    |           |
+----------------------------+----------------------------+--------------------------+--------------------------+------------+----------------+------------+-----------+

Showing 1 of 1 deployments

```

 Now, go to : 
  ```buildoutcfg
http://localhost:8000/
```
You should see the **Hello world** page.

**Tip**: To check out some more commands to use with Cloudify Manager, run `cfy --help`

another way to review your deployment is through the Cloudify management console. Login to the UI and browse to the Deployments page. Select the deployment (simple-hello-world-example) and explore the topology, inputs, outputs, nodes, and logs.

## Step 4: OK, I am done, how do I tear it down?

To remove the deployment simply run the uninstall command:
```bash
docker exec -it cfy_manager_local sh -c "cfy uninstall simple-hello-world-example"
```

----


## Applying the above steps using the Cloudify management console
This section explains how to run the above described steps using the Cloudify management console UI instead of the command line options. The UI and the CLI can be used interchangeably for all Cloudify activities.

Firstly, complete the cloudify manager install inside docker container(step 1 above), if you are using cloudify lab you can pass this step. 

`1`. Go to localhost in your browser to see the Cloudify UI. Login and password are both _admin_.

`2`. On the right side of the local blueprints page, select **Upload**.

`3`. Paste the URL of the blueprint package in the URL field. Provide any name you like. 

For this example the URL is: https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-14/simple-hello-world-example.zip

`4`. Select blueprint.yaml from the Blueprint YAML file menu(You can leave the Blueprint icon field blank. It is only for decoration).

`5`. Click **Upload**.

The blueprint should appear in the blueprint list under the name you provided.

`6`. On the right, you will see a rocket icon. Select the rocket icon and you will enter the create deployment dialog.

`7`. Provide a name you like in the Deployment name field.

`8`. You can skip the Site name field.

`9`. Provide values for any inputs that you would like to change.

`10`. Click **Deploy**.

The blueprint should appear in the deployment list under the name you provided.

`11`. Go to Deployments and press on your deployment, then press **Execute workflow->Default workflows->Install**

You did it!
