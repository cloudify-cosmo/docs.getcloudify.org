+++
title = "Level 2: Infra Provisioning Basics"
description = "Learn how to setup basic infrastructure in AWS, Azure, GCP and OpenStack"
weight = 20
alwaysopen = false
vCloud_blueprint_name = "vcloud.yaml"
vSphere_blueprint_name = "vsphere.yaml"
+++

The infrastructure provisioning basics examples demonstrate the basic concepts of {{< param product_name >}} by orchestrating a simple infrastructure setup consisting of a VM with its basic peripherals (Security group, network, etc.). Each example is designed to match a different IaaS (infrastructure as a service) with examples for AWS, Azure, GCP and OpenStack.

Running these examples and going through the tutorial you will be learning the concept of blueprints, plugins, deployment, secret store and more.


{{%children style="h3" description="true"%}}

## Additional Infrastructure Support

For the full list of infrastructure examples refer to the [virtual-machine git repository]({{< param basic_blueprint_master >}})

* The vCloud infrastructure blueprint example is available [here]({{< param basic_blueprint_master >}}/{{< param vCloud_blueprint_name >}}).

* The vSphere infrastructure blueprint example is available [here]({{< param basic_blueprint_master >}}/{{< param vSphere_blueprint_name >}}).
