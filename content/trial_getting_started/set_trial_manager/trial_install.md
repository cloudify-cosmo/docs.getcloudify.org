+++
title = "Cloudify Premium Trial"
description = "Installing Cloudify trial manager"
weight = 10
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

 Cloudify Premium Trial provides a fully functional Premium manager as a Docker container image. This page describes the complete setup flow to get an activated Cloudify trial manager.

## Step 1: Install the Cloudify Manager as a Docker container


Deploying Cloudify trial manager as a Docker container is the easiest way to go.
This tutorial assumes that you have [Docker](https://docs.docker.com/install) installed on a local or a remote machine.

Open your terminal and create/start the Docker container (requires password)
```
sudo docker run --name cfy_manager_local -d --restart unless-stopped
-v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock
--security-opt seccomp:unconfined --cap-add SYS_ADMIN -p 80:80
-p 8000:8000 cloudifyplatform/premium-cloudify-manager-aio:latest
```

Verify that your manager is running by browsing to [localhost](http://localhost) when running locally,
or to the hosting machine IP when the Docker server is remote, the Cloudify login page should be displayed.
Cloudify login page should be displayed.

![login-page.png]( /images/ui/login/login-page.png )

Cloudify allows for multiple user interfaces;
In this tutorial we will demonstrate the usage of Cloudify management console (web UI)
and Cloudify command line (cfy).
The following steps will demonstrate both approaches.  

## Step 2: Activate your Trial

A Cloudify license is provided to all Cloudify Premium subscribed customers by Cloudify support.
Cloudify Premium trial customers receive their trial license via email upon trial request.
Request your free 60 days trial at https://cloudify.co/download/#trial.  
To activate your Cloudify manager submit your license through either
Cloudify management console (UI) or via Cloudify CLI.
Cloudify allows for multiple user interfaces;
in this tutorial we will demonstrate the usage of the Cloudify management console (web UI) and the Cloudify command line (cfy). The following steps demonstrate both approaches.

#### Activating Cloudify using the UI

1. Go to localhost in your browser to see the Cloudify UI. Login and password are both _admin_.
2. Submit your Cloudify subscription/trial key. Learn more [here](https://docs.cloudify.co/latest/install_maintain/installation/manager-license/#product-activation).

#### Activating Cloudify using the CLI

Save Cloudify subscription/trial license that you acquired by following
the previous step above inside a file on your machine.
Copy the subscription file to the container by running:

```
docker cp <file path on local system> cfy_manager_local:/tmp/license.yaml
```

e.g. docker cp C:\Users\John\Downloads\my-license.yaml docker-cfy-manager:/tmp/

Apply the license by running:

```
docker exec -it cfy_manager_local sh -c "cfy license upload /tmp/license.yaml"
```

#### Congratulations! you now have your Cloudify manager ready.

What's next?
Go ahead and examine our example based tutorials to learn about Cloudify basics:


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


By downloading Cloudify, you agree to the [End User License Agreement](https://cloudify.co/license).
Cloudify is available for an evaluation period of 60-days.

Read about the differences between our [Cloudify versions](https://cloudify.co/product/community-enterprise-editions).
