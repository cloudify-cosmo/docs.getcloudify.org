+++
title = "Cloudify Premium"
description = "Deploy a premium manager using a Docker container"
weight = 10
alwaysopen = false
docker_image_name = "cloudifyplatform/premium-cloudify-manager-aio:latest"

+++

{{%children style="h2" description="true"%}}

The {{< param product_name >}} Premium Trial provides a fully functional Premium Manager as a Docker container image. This page describes the complete setup flow to install and activate a {{< param product_name >}} Trial Manager.

You will need a host with [Docker](https://docs.docker.com/install) installed to run the {{< param product_name >}} Premium Trial container image.

## Step 1: Install the {{< param cfy_manager_name >}} as a Docker Container

Deploying the  trial as a Docker container is simple. Using a container provides an easy way to get started with the Premium {{< param cfy_manager_name >}}.

To deploy the container image, simply launch a terminal and create the container:

```
docker run -d -p 80:80 cloudifyplatform/premium-cloudify-manager-aio:latest
```

It can take up to one minute for all the services in the Docker container to be initiated and then the manager will be up and running.

This will publish the web interface on port 8080. Verify that the {{< param cfy_manager_name >}} is running by navigating to [http://localhost](http://localhost). The {{< param product_name >}} login page should be displayed. The default username and password are both _admin_.

![login-page.png](/images/ui/pages/login-page.png)

## Step 2: Activate your Trial

A {{< param product_name >}} license is provided to all {{< param product_name >}} Premium customers by {{< param product_name >}} support.
{{< param product_name >}} Premium Trial customers receive their trial license via email upon trial request. You can request a free 60-day trial [here]({{< param cfy_premium_download_link >}}).

Once you receive your license activation key, use it to activate your {{< param cfy_manager_name >}}. Manager activation (and most other {{< param product_name >}} actions) can be performed through either the {{< param cfy_console_name >}} (UI) or the {{< param cfy_cli_name >}}.

To activate your trial using the UI:

1. Log in to the {{< param cfy_console_name >}} as done in Step 1. The username and password are both _admin_.
2. You will be prompted for your subscription key. Provide the subscription key using the dialog.
   * Additional information about the licensing process can be found [here]({{< relref "cloudify_manager/premium/aio/install_and_configure/activate.md" >}}).

## Next Steps

Now that you have access to a {{< param cfy_manager_name >}} environment, we recommend performing some additional activities to become comfortable with {{< param company_name >}}. The following suggestions will get you started!

* Try out the [local Hello World]({{< relref "trial_getting_started/examples/local/local_hello_world_example" >}}) example using your new manager. No cloud credentials are required for this simple example.
* Run your first multi-cloud example on AWS, Azure, GCP, and OpenStack using the native {{< param product_name >}} plugins as well as Cloud Formation, Azure ARM, and Ansible plugins by following the [example-based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}}).
* Run your first Kubernetes service on OpenShift, KubeSpray, GKE, EKS, or AKS by following the [Kubernetes reference guide]({{< relref "working_with/official_plugins/orchestration/kubernetes" >}}).
* Manage your installation using the command line utility by reviewing the [local CLI guide]({{< relref "trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli" >}}).