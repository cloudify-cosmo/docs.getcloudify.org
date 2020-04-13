+++
title = "Cloudify as a Service"
description = "Try our hosted Cloudify service"
weight = 8
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

Hello , you have come to the right place if you don't want to go through any installation processes
in this option you will have the experience of Cloudify without worrying about the infrastructure
that hosts Cloudify environment, so if you are ready for this, you can go through the bellow steps.


## Step 1: Request a Cloudify trial account

To start using Cloudify hosted service, a dedicated account must be created for you.
If you have requested an account and received the details via email please continue to step 2.
If you still have not got any email yet,
please request your Cloudify trial account [here](https://cloudify.co/hostedcloudify-2/)

## Step 2: Activate your Cloudify trial and Login

Once you have your Lab control page,
you can choose start Lab, and once the progress is at 100%,
the Lab link along side the credentials will be shown,
and you can navigate to that Lab link.

Given the information from Lab control page,
Login to Cloudify Manager, and you are set now

## Step 3: Run your First Example

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
