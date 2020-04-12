+++
title = "Cloudify Premium Trial"
description = "Installing the Cloudify trial manager"
weight = 10
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

## Step 1: Install the Cloudify Manager as a Docker container

The easiest way to deploy Cloudify trial manager is as a Docker container. This tutorial assumes that you have [Docker](https://docs.docker.com/install) installed on your local machine.
For more advanced users, other packages can be downloaded [here](https://cloudify.co/getting-started-enterprise).

Open your terminal and create/start the Docker container (requires password)
```
sudo docker run --name cfy_manager_local -d --restart unless-stopped -v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock --security-opt seccomp:unconfined --cap-add SYS_ADMIN -p 80:80 -p 8000:8000 cloudifyplatform/premium-cloudify-manager-aio:latest
```

Verify that your manager is running by browsing to [localhost](http://localhost), the Cloudify login page should be displayed.

Cloudify allows for multiple user interfaces; in this tutorial we will demonstrate the usage of the Cloudify management console (web UI) and the Cloudify command line (cfy). The following steps demonstrate both approaches.  

## Step 2: Activate your Trial

A Cloudify license is provided to all Cloudify Premium subscribed customers by Cloudify support. Cloudify Premium trial customers receive their trial license via email upon trial request. Request your free 60 day trial at https://cloudify.co/download/#trial.  
To activate your Cloudify manager submit your license through either the Cloudify management console (UI) or via the Cloudify CLI.

#### Activating Cloudify using the UI

1. Go to localhost in your browser to see the Cloudify UI. Login and password are both _admin_.
1. Submit your Cloudify subscription/trial key. Learn more [here](https://docs.cloudify.co/latest/install_maintain/installation/manager-license/#product-activation).

#### Activating Cloudify using the CLI

Save the Cloudify subscription/trial file you received to a local folder.
Copy the subscription file to the container by running:

```
docker cp <file path on local system> cfy_manager_local:/tmp/license.yaml
```

e.g. docker cp C:\Users\John\Downloads\my-license.yaml docker-cfy-manager:/tmp/

Apply the license by running:

```
docker exec -it cfy_manager_local sh -c "cfy license upload /tmp/license.yaml"
```

## Step 3: Run your first example

Learn the Cloudify basics through the following examples:

* [Level 1: Infra Provisioning Basics]({{< relref "trial_getting_started/examples/basic/_index.md" >}}) - Learn how to setup basic infrastructure in AWS, Azure, GCP, and Openstack.
* [Level 2: Setup Your First Service]({{< relref "trial_getting_started/examples/first_service/_index.md" >}}) - Learn how to setup a simple service topology consisting of a simple web service , and application running on a VM. These examples also explain the setup of all essential peripherals (Security group, network interfaces, etc.) in AWS, Azure, GCP, and Openstack.
* [Level 3: Use Automation Tools]({{< relref "trial_getting_started/examples/automation_tools/_index.md" >}}) - Learn how to create infrastructure objects and services through orchestration of orchestrators and automation tools such as AWS CloudFormation, Azure ARM, and Terraform.
* [Level 4: Multi-Cloud Orchestration]({{< relref "trial_getting_started/examples/multi_cloud/_index.md" >}}) - Learn how to design your service topology such that it is abstracted from the infrastructure layer and can be deployed on any infra using a single, flexible template.










___

### Other deployment options and CLI packages

Current Version: 5.0.5         [Release Notes](https://cloudify.co/cloudify-5-0-5-release-notes/)

#### Downloads

Cloudify Manager Images:  [RPM](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-manager-install-5.0.5-ga.x86_64.rpm)	|	[Docker](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-docker-manager-5.0.5.tar)	|	[QCOW](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-manager-5.0.5ga.qcow2)

Cloudify CLI: [RPM](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-cli-5.0.5.1~ga.el6.x86_64.rpm)	|	[DEB](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-cli_5.0.5.1~ga_amd64.deb)	|	[EXE](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-cli-5.0.5.1ga.exe)	|	[OSX](hhttp://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-cli-5.0.5-ga.pkg)


By downloading Cloudify, you agree to the [End User License Agreement](https://cloudify.co/license). Cloudify is available for a 60-day evaluation period.

Read about the differences between our [Cloudify versions](https://cloudify.co/product/community-enterprise-editions).
