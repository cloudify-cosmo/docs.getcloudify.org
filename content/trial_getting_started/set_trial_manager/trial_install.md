+++
title = "Cloudify Premium Trial"
description = "Installing Cloudify trial manager"
weight = 10
alwaysopen = false
docker_image_name = "cloudifyplatform/premium-cloudify-manager-aio:latest"

+++

{{%children style="h2" description="true"%}}

 {{< param product_name >}} Premium Trial provides a fully functional Premium manager as a Docker container image. This page describes the complete setup flow to get an activated {{< param product_name >}} trial manager.

### Step 1: Install the {{< param cfy_manager_name >}} as a Docker container


Deploying {{< param product_name >}} trial manager as a Docker container is the easiest way to go.
This tutorial assumes that you have [Docker](https://docs.docker.com/install) installed on a local or a remote machine.

Open your terminal and create/start the Docker container (requires password)
```
{{< param docker_install_command_prefix >}} {{< param docker_image_name >}}
```

Verify that your manager is running by browsing to [localhost](http://localhost) when running locally,
or to the hosting machine IP when the Docker server is remote.

The {{< param product_name >}} login page should be displayed.

![login-page.png]( /images/ui/pages/login-page.png )


### Step 2: Activate your Trial

A {{< param product_name >}} license is provided to all {{< param product_name >}} Premium subscribed customers by {{< param product_name >}} support.
{{< param product_name >}} Premium trial customers receive their trial license via email upon trial request.
Request your free 60 days trial at https://cloudify.co/download/#trial.  

Once you receive your license activation key, use it to activate your {{< param cfy_manager_name >}}. Manager activation (and most other {{< param product_name >}} actions) can be performed through either {{< param cfy_console_name >}} (UI) or via {{< param cfy_cli_name >}}.
In this tutorial we will demonstrate the usage of the Management Console.

1. Login to the {{< param cfy_console_name >}} (as done in step 1 above). Login and password are both _admin_.
2. Submit your {{< param product_name >}} subscription/trial key. Learn more [here]({{< relref "/install_maintain/installation/manager-license.md#product-activation" >}}).



____

#### Congratulations! you now have your {{< param cfy_manager_name >}} ready.

What's next?

* To manage your installation using the command line utility on your docker image refer to the [local CLI guide] ({{< relref "trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli" >}})
* To run your first hello world example on your local manager refer to the **[local hello world example] ({{< relref "trial_getting_started/examples/local/local_hello_world_example" >}})** (no cloud credentials needed)
* To run your first multi cloud examples on AWS, Azure, GCP and OpenStack using the native {{< param product_name >}} plugins as well as Cloud Formation, Azure ARM and Ansible plugins refer to the  **[example based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}})**.
* To run your first Kubernetes service on OpenShift, KubeSpray, GKE, EKS or AKS refer to the  [Kubernetes reference guide ]({{< relref "working_with/official_plugins/orchestration/kubernetes" >}}).
