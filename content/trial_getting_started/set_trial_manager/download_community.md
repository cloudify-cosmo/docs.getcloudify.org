+++
title = "Community version"
description = "Download page and getting started links for the community version"
weight = 90
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

## Step 1: Install the Cloudify Manager as a Docker container

Deploying Cloudify trial manager as a Docker container is the easiest way to go.
This tutorial assumes that you have [Docker](https://docs.docker.com/install) installed on your local machine.
For more advanced users, other packages can be downloaded [here](https://cloudify.co/getting-started-enterprise).

Open your terminal and create/start the Docker container (requires password)
```
sudo docker run --name cfy_manager_local -d --restart unless-stopped \
-v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock \
--security-opt seccomp:unconfined --cap-add SYS_ADMIN -p 80:80 \
-p 8000:8000 cloudifyplatform/community-cloudify-manager-aio:latest
```

Verify that your manager is running by browsing to [localhost](http://localhost),
Cloudify login page should be displayed.


## Step 2: Run your first example

Learn Cloudify basics through one of the following examples:

* [Level 1: Infra Provisioning Basics]({{< relref "trial_getting_started/examples/basic/_index.md" >}})

- You will learn how to setup basic infrastructure in one of the following Cloud Environments:

 * AWS
 * Azure
 * GCP
 * OpenStack.

* [Level 2: Setup Your First Service]({{< relref "trial_getting_started/examples/first_service/_index.md" >}})

- You will learn how to setup a simple service topology composed of:

 * Apache2 WebServer
 * Sample HTML page deployed on that WebServer.

 the above is setup up, using Ansible Playbook with cloudify-ansible-plugin.

 These examples also explain the setup of all essential peripherals
 (Security group, network interfaces, etc.) in AWS, Azure, GCP and OpenStack.

* [Level 3: Use Automation Tools]({{< relref "trial_getting_started/examples/automation_tools/_index.md" >}})

- You learn how to create infrastructure objects and services through orchestration
  of orchestrators and automation tools such as:

 * AWS CloudFormation
 * Azure ARM
 * Terraform.

* [Level 4: Multi-Cloud Orchestration]({{< relref "trial_getting_started/examples/multi_cloud/_index.md" >}})

- You learn how to design your service topology in abstracted manner away from the infrastructure layer
  and can be deployed on any infrastructure using a single and flexible template.

___

### Other deployment options and CLI packages

Current Version: 5.0.5  (20.03.03)       [Release Notes](https://cloudify.co/cloudify-5-0-5-release-notes/)

#### Downloads

Cloudify Community Manager Images:  [RPM](http://repository.cloudifysource.org/cloudify/20.03.03/release/cloudify-manager-install-20.03.03-community.x86_64.rpm)	|	[Docker](http://repository.cloudifysource.org/cloudify/20.03.03/build/cloudify-docker-manager-20.03.03.tar)	|	[QCOW](http://repository.cloudifysource.org/cloudify/20.03.03/build/cloudify-manager-community-20.03.18.qcow2)

Cloudify Community CLI: [RPM](http://repository.cloudifysource.org/cloudify/20.03.03/release/cloudify-cli-20.03.03~community.el6.x86_64.rpm)	|	[DEB](http://repository.cloudifysource.org/cloudify/20.03.03/release/cloudify-cli_20.03.03~community_amd64.deb)	|	[EXE](http://repository.cloudifysource.org/cloudify/20.03.03/release/cloudify-windows-cli_20.03.03-community.exe)


By downloading Cloudify, you agree to the [End User License Agreement](https://cloudify.co/license).
Cloudify is available for an evaluation period of 60-days.

Read about the differences between our [Cloudify versions](https://cloudify.co/product/community-enterprise-editions).
