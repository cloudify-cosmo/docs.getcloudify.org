+++
title = "Level 3: Service Provisioning"
description = "Learn how to setup a simple service topology consisting of an Apache2 web-server running on a VM and hosting a sample HTML page.  These examples also explain the setup of all essential peripherals (Security group, network interfaces, etc.) in AWS, Azure, GCP and OpenStack. Some of the examples demonstrate usage of Ansible Playbook with cloudify-ansible-plugin."
weight = 30
alwaysopen = false
+++

The service provisioning examples build on the [Infrastructure Provisioning Basics]({{< relref "/trial_getting_started/examples/basic/" >}}) section to add a simple web application to the deployed infrastructure. Each example is designed to match a different IaaS (infrastructure as a service) with examples for AWS, Azure, GCP and OpenStack.

Running these examples will help you build your knowledge of blueprints to see how Cloudify can model both the infrastructure and application environment.

{{%children style="h2" description="true"%}}
