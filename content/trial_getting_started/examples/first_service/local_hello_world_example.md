+++
title = "Local hello-world"
description = "Local - Simple hello world"
weight = 20
alwaysopen = false
+++

{{%children style="h2" description="true"%}}


This Example demonstrates a simple deployment of local HTTP server and an hello-world page on it.

Cloudify allows for multiple user interfaces.
In this tutorial we will demonstrate the usage of Cloudify management console (web UI)
and the Cloudify command line interface (CLI).

The following steps demonstrate firstly the **CLI approach**,
while the last section demonstrates **the web UI** approach.


## Step 1: Install Cloudify Manager inside Docker container

In order to deploy Cloudify manager inside Docker container follow the instructions in [this page]({{< relref "trial_getting_started/set_trial_manager/trial_install.md" >}}).


## Step 2: Upload, deploy and install the blueprint

A Cloudify blueprint is a general purpose model for describing systems, services or any orchestrated object topology.
Blueprints are represented as descriptive code (yaml based files) and typically stored and managed as part of the source repository.
The hello-world blueprint is available [here](https://github.com/cloudify-community/blueprint-examples/blob/master/simple-hello-world-example/blueprint.yaml).

Uploading a blueprint to Cloudify can be done by direct upload or by providing the link in the code repository.
The flow to do that is :

 * (1) upload the blueprint
 * (2) create a deployment from that uploaded blueprint - this generates a model in Cloudify DB
 * (3) run the install workflow for that created deployment to apply the model to the infrastructure.

In order to perform this flow as a single unit we will use the **install command**.


```bash
docker exec -it cfy_manager_local sh -c "cfy install https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-14/simple-hello-world-example.zip -n blueprint.yaml"
```

**Note**: Usually, in order to connect and deploy instances on cloud platforms (such as AWS, Azure etc.)
we need to upload the appropriate Cloudify plugins, but on this example the infrastructure is locally and not interacting with any cloud provider so we just need to install the blueprint.


## Step 3: Check your orchestrated services

In this example we have setup a simple web server with a simple html page.
To access that service we need to get it's URL.
System properties generated in runtime, such as allocated IPs, URLs, etc...
can be stored and retrieved in several ways.

Firstly, in order to see that the deployment created run:
```bash
docker exec -it cfy_manager_local sh -c "cfy deployments list"
```

The returned output would look like:
```bash
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

An even easier way to review your deployment is through Cloudify management console.
Login to the UI and browse to the Deployments page.
Select the deployment (simple-hello-world-example) and explore the topology, inputs, outputs, nodes, and logs.

## Step 4: OK, I am done, how do I tear it down?

To remove the deployment simply run the uninstall command:
```bash
docker exec -it cfy_manager_local sh -c "cfy uninstall simple-hello-world-example"
```

----


## Applying the above steps using Cloudify management console
This section explains how to run the above described steps using
Cloudify management console UI instead of the command line options.
The UI and the CLI can be used interchangeably for all Cloudify activities.

`1`. Go to localhost in your browser to see Cloudify UI. Login and password are both _admin_.

`2`. On the right side of the local blueprints page, select **Upload**.

`3`. Paste the URL of the blueprint package in the URL field. Provide any name you like.

For this example the URL is: https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-14/simple-hello-world-example.zip

`4`. Select blueprint.yaml from the Blueprint YAML file menu(You can leave the Blueprint icon field blank. It is only for decoration).

`5`. Click **Upload**.

The blueprint should appear in the blueprint list under the name you provided.

`6`. On the right, you will see a rocket icon. click the rocket icon and create deployment dialog will be shown.

`7`. Provide a name you like in the Deployment name field.

`8`. You can skip the Site name field.

`9`. Provide values for any inputs that you would like to change.

`10`. Click **Deploy**.

The newly created deployment should appear in the deployment list under the name you provided.

`11`. Go to Deployments and press on your deployment, then press **Execute workflow->Default workflows->Install**

You did it!
