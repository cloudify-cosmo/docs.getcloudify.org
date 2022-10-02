+++
title = "Cloudify Premium"
description = "Installing Cloudify trial manager"
weight = 10
alwaysopen = false
docker_image_name = "cloudifyplatform/premium-cloudify-manager-aio:latest"

+++

{{%children style="h2" description="true"%}}

 The {{< param product_name >}} Premium Trial version provides a fully functional {{< param product_name >}} engine & all of the manager capabilities (read about the differences between our [Cloudify versions](https://cloudify.co/download/community-vs-enterprise/)). The Premium version is available as an RPM, Helm Chart or as a Docker based conainer. This page describes the complete setup flow to get an activated {{< param product_name >}} Premium trial manager as a Docker container.

### Step 1: Install the {{< param cfy_manager_name >}} as a Docker container


Deploying {{< param product_name >}} trial manager as a Docker container is the easiest way to go.
This tutorial assumes that you have [Docker](https://docs.docker.com/install) installed on a local or a remote machine.

Open your terminal and create/start the Docker container

```
docker run -d -p 80:80 cloudifyplatform/premium-cloudify-manager-aio:latest
```

It can take up to 1 minute unitl all the services in the docker container will be initiated and the manager will be up and running.

Verify that your manager is running by browsing to [localhost](http://localhost) when running locally,
or to the hosting machine IP when the Docker server is remote.

The {{< param product_name >}} login page should be displayed.

![login-page.png]( /images/ui/pages/login-page.png )

Note: the default login username and password are _admin/admin_

### Step 2: Activate your Trial
A {{< param product_name >}} license is provided to all {{< param product_name >}} Premium subscribed customers by {{< param product_name >}} support.
{{< param product_name >}} Premium trial customers receive their trial license via email upon trial request.
Request your free 60 days trial at https://cloudify.co/cloudify-premium-download/.  

Once you receive your license activation key, use it to activate your {{< param cfy_manager_name >}}. Manager activation (and most other {{< param product_name >}} actions) can be performed through either {{< param cfy_console_name >}} (UI) or via {{< param cfy_cli_name >}}.
In this tutorial we will demonstrate the usage of the Management Console.

1. Login to the {{< param cfy_console_name >}} (as done in step 1 above). Login and password are _admin/admin_.
2. Submit your {{< param product_name >}} subscription/trial key. Learn more [here]({{< relref "/install_maintain/installation/manager-license.md#product-activation" >}}).

### Step 3: Install your first deployment on your new {{< param cfy_manager_name >}}
Check out your new {{< param cfy_manager_name >}} by installing the [Local Hello-World Example Deployment]({{< relref "trial_getting_started/examples/local/local_hello_world_example.md" >}}).  

This example demonstrates how you can use {{< param product_name >}} to easily install a local HTTP server with a hello-world page on it.

### Step 4: (Optional) - Setup your command line interface (CLI)

{{< param product_name >}} offers multiple user interfaces. All orchestration actions can be performed from the Management Console UI you have logged into in Step 2, however in many cases a CLI access from your Mac, Windows, or Linux station is easier.

Follow [these]({{< relref "/trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli.md" >}}) instructions to deploy your CLI.

____

#### Congratulations! you now have your {{< param cfy_manager_name >}} ready.

What's next?

* To run your first multi cloud examples on AWS, Azure, GCP and OpenStack using the native {{< param product_name >}} plugins as well as Cloud Formation, Azure ARM and Ansible plugins refer to the  **[example based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}})**.
* To run your first Kubernetes service on OpenShift, KubeSpray, GKE, EKS or AKS refer to the  [Kubernetes reference guide ]({{< relref "working_with/official_plugins/orchestration/kubernetes" >}}).