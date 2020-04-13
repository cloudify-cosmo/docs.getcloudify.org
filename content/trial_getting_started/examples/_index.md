+++
title = "Learn Through Examples"
description = "Deploying Cloudify trial manager & walkthrough usage examples"
weight = 97
alwaysopen = false
+++

{{%children style="h2" description="true"%}}


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
