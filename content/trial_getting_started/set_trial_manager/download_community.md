+++
title = "Cloudify Community"
description = "Download page and getting started links for the community version"
weight = 9
alwaysopen = false
docker_image_name = "cloudifyplatform/community-cloudify-manager-aio:latest"
docker_install_command_prefix = "docker run --name cfy_manager_local -p 8080:80"
+++

{{%children style="h2" description="true"%}}


The {{< param product_name >}} free community version contains a fully functional {{< param product_name >}} engine and supports most of the manager capabilities. This makes it ideal for trying out Cloudify without a premium license. You can read more about the differences between {{< param product_name >}} versions [here]({{< ref "cloudify_manager/architecture/_index.md#comparison-matrix" >}})).

The community version is available as an RPM, OpenStack Image, or Docker container. This page describes the steps necessary to deploy the {{< param product_name >}} trial manager as a Docker container.

You will need a host with [Docker](https://docs.docker.com/install) installed to run the {{< param product_name >}} community container image.

## Step 1: Install the {{< param cfy_manager_name >}} as a Docker container

Deploying the community version of the {{< param product_name >}} manager is simple. Using a container provides an easy way to get started with {{< param product_name >}}.

To deploy the container image, simply launch a terminal and create the container:

```bash
docker run -d -p 80:80 cloudifyplatform/community-cloudify-manager-aio:latest
```

This will publish the web interface on port 8080. Verify that the {{< param cfy_manager_name >}} is running by navigating to [http://localhost:8080](http://localhost:8080). The {{< param product_name >}} login page should be displayed. The default username and password are both _admin_.

![login-page.png]( /images/ui/pages/login-page.png )

### Step 2: Fill Contacts Details

{{% note title="Prerequisites" %}}
NOTE: Internet access is required to complete this step
{{% /note %}}

Once you loged in to Community, you'll be asked to fill contact details. You need to fill the form to access Cloudify Manager. It's required only once on the first loging. 

![community-contact-details.png]( /images/ui/pages/community-contact-details.png )

## Next Steps

* To manage your installation using the command line utility on your docker image refer to the [local CLI guide] ({{< relref "trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli" >}})
* To run your first hello world example on your local manager refer to the **[local hello world example] ({{< relref "trial_getting_started/examples/local/" >}})** (no cloud credentials needed)
* To run your first multi cloud examples on AWS, Azure, GCP and OpenStack using the native {{< param product_name >}} plugins as well as Cloud Formation, Azure ARM and Ansible plugins refer to the  **[example based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}})**.
* To run your first Kubernetes service on OpenShift, KubeSpray, GKE, EKS or AKS refer to the  [Kubernetes reference guide ]({{< relref "working_with/official_plugins/orchestration/kubernetes" >}}).