+++
title = "Community Version Docker Container"
description = "Deploy the community version of manager using a Docker container"
weight = 90
alwaysopen = false
docker_image_name = "cloudifyplatform/community-cloudify-manager-aio:latest"
docker_install_command_prefix = "docker run --name cfy_manager_local -p 8080:80"
+++

{{%children style="h2" description="true"%}}


The {{< param product_name >}} free community version contains a fully functional {{< param product_name >}} engine and supports most of the manager capabilities. This makes it ideal for trying out Cloudify without a premium license. You can read more about the differences between {{< param product_name >}} versions [here](https://cloudify.co/download/community-vs-enterprise/)).

The community version is available as an RPM, OpenStack Image, or Docker container. This page describes the steps necessary to deploy the {{< param product_name >}} trial manager as a Docker container.

You will need a host with [Docker](https://docs.docker.com/install) installed to run the {{< param product_name >}} community container image.

## Step 1: Install the {{< param cfy_manager_name >}} as a Docker container

Deploying the community version of the {{< param product_name >}} manager is simple. Using a container provides an easy way to get started with {{< param product_name >}}.

To deploy the container image, simply launch a terminal and create the container:

```bash
{{< param docker_install_command_prefix >}} {{< param docker_image_name >}}
```

This will publish the web interface on port 8080. Verify that the {{< param cfy_manager_name >}} is running by navigating to [http://localhost:8080](http://localhost:8080). The {{< param product_name >}} login page should be displayed. The default username and password are both _admin_.

![login-page.png]( /images/ui/pages/login-page.png )
## Next Steps

Now that you have access to a {{< param cfy_manager_name >}} environment, we recommend performing some additional activities to become comfortable with {{< param company_name >}}. The ideas below are just suggestions to get you started on your journey!

* Try out the [local Hello World example]({{< relref "trial_getting_started/examples/local/local_hello_world_example" >}}) example using your new manager. No cloud credentials are required for this simple example.
* Run your first multi-cloud example on AWS, Azure, GCP and OpenStack using the native {{< param product_name >}} plugins as well as Cloud Formation, Azure ARM, and Ansible plugins by following the  **[example based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}})**.
* Run your first Kubernetes service on OpenShift, KubeSpray, GKE, EKS, or AKS by following the [Kubernetes reference guide]({{< relref "working_with/official_plugins/orchestration/kubernetes" >}}).
* Manage your installation using the command line utility by reviewing the [local CLI guide]({{< relref "trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli" >}}).
