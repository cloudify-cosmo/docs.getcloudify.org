+++
title = "Cloudify Community"
description = "Deploy the community version of the manager using a Docker container"
weight = 9
alwaysopen = false
docker_image_name = "cloudifyplatform/community-cloudify-manager-aio:latest"
docker_install_command_prefix = "docker run --name cfy_manager_local -p 8080:80"
+++

{{%children style="h2" description="true"%}}


The {{< param product_name >}} free community version contains a fully functional {{< param product_name >}} engine that supports most of the Manager's capabilities. This makes it ideal for trying out Cloudify without a premium license. You can read more about the differences between {{< param product_name >}} versions [here]({{< ref "cloudify_manager/architecture/_index.md#comparison-matrix" >}}).

The community version is available as an RPM, OpenStack Image, or Docker container. This page describes the steps necessary to deploy the {{< param product_name >}} Trial Manager as a Docker container.

You will need a host with [Docker](https://docs.docker.com/install) installed to run the {{< param product_name >}} community container image.

## Step 1: Install the {{< param cfy_manager_name >}} as a Docker Container

Deploying the community version of the {{< param product_name >}} Manager is simple. Using a container provides an easy way to get started with {{< param product_name >}}.

To deploy the container image, simply launch a terminal and create the container:

```bash
docker run -d -p 80:80 cloudifyplatform/community-cloudify-manager-aio:latest
```

This will publish the web interface on port 8080. Then verify that the {{< param cfy_manager_name >}} is running by navigating to [http://localhost:8080](http://localhost:8080). The {{< param product_name >}} login page should appear. The default username and password are both _admin_.

![login-page.png]( /images/ui/pages/login-page.png )

## Step 2: Fill in Contact Details

{{% note title="Prerequisites" %}}
NOTE: Internet access is required to complete this step.
{{% /note %}}

Once you log into the Community, you'll be asked to fill in your contact details. You need to fill in the form to access the Cloudify Manager. It's required only once on the first log in.

![community-contact-details.png]( /images/ui/pages/community-contact-details.png )

## Step 3: Install your First Deployment on your New {{< param cfy_manager_name >}}
Check out your new {{< param cfy_manager_name >}} by installing the [Local Hello-World Example Deployment]({{< relref "trial_getting_started/examples/local/local_hello_world_example.md" >}}).  

This example demonstrates how you can use {{< param product_name >}} to easily install a local HTTP server with a hello-world page on it.

## Step 4: (Optional) - Setup your Command Line Interface (CLI)

{{< param product_name >}} offers multiple user interfaces. All orchestration actions can be performed from the Management Console UI you logged into in Step 2, however, in many cases, a CLI access from your Mac, Windows, or Linux station is easier.

Follow [these]({{< relref "/trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli.md" >}}) instructions to deploy your CLI.

## Next Steps

Now that you have access to a {{< param cfy_manager_name >}} environment, we recommend performing some additional activities to become comfortable with {{< param company_name >}}. The following suggestions will get you started!

* Try out the [local Hello World]({{< relref "trial_getting_started/examples/local/local_hello_world_example" >}}) example using your new manager. No cloud credentials are required for this simple example.
* Run your first multi-cloud example on AWS, Azure, GCP, and OpenStack using the native {{< param product_name >}} plugins as well as Cloud Formation, Azure ARM, and Ansible plugins by following the [example-based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}}).
* Run your first Kubernetes service on OpenShift, KubeSpray, GKE, EKS, or AKS by following the [Kubernetes reference guide]({{< relref "working_with/official_plugins/orchestration/kubernetes" >}}).
* Manage your installation using the command line utility by reviewing the [local CLI guide]({{< relref "trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli" >}}).
