+++
title = "Community version"
description = "Download page and getting started links for the community version"
weight = 90
alwaysopen = false
docker_image_name = "cloudifyplatform/community-cloudify-manager-aio:latest"

+++

{{%children style="h2" description="true"%}}


The Cloudify free community version contains a fully functional Cloudify engine & most of the manager capabilities (read about the differences between our [Cloudify versions](https://cloudify.co/download/community-vs-enterprise/)).
The community version is available as an rpm, OpenStack Image or as a Docker based container. This page describes the complete setup flow to get an activated Cloudify trial manager as a Docker container.

### Step 1: Install the Cloudify Manager as a Docker container


Deploying Cloudify trial manager as a Docker container is the easiest way to go.
This tutorial assumes that you have [Docker](https://docs.docker.com/install) installed on a local or a remote machine.

Open your terminal and create/start the Docker container (requires password)



```
<<<<<<< HEAD
sudo docker run --name cfy_manager_local -d --restart unless-stopped -v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock --security-opt seccomp:unconfined --cap-add SYS_ADMIN -p 80:80 -p 8000:8000 cloudifyplatform/community-cloudify-manager-aio:latest
=======
{{< param docker_install_command_prefix >}} {{< param docker_image_name >}}
>>>>>>> master
```

Verify that your manager is running by browsing to [localhost](http://localhost) when running locally,
or to the hosting machine IP when the Docker server is remote.

The Cloudify login page should be displayed.

![login-page.png]( /images/ui/login/login-page.png )


____

#### Congratulations! you now have your Cloudify manager ready.

What's next?

* To manage your installation using the command line utility on your docker image refer to the [local CLI guide] ({{< relref "trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli" >}})
* To run your first hello world example on your local manager refer to the the **[local hello world example] ({{< relref "trial_getting_started/examples/first_service/local_hello_world_example" >}})** (no cloud credentials needed)
* To run your first multi cloud examples on AWS, Azure, GCP and OpenStack using the native Cloudify plugins as well as Cloud Formation, Azure ARM and Ansible plugins refer to the  **[example based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}})**.
* To run your first Kubernetes service on OpenShift, KubeSpray, GKE, EKS or AKS refer to the  [Kubernetes reference guide ]({{< relref "working_with/official_plugins/orchestration/kubernetes" >}}).
