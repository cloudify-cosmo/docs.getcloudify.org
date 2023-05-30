+++
title = "AWS AMI"
description = "AWS AMI Installation (BYOL)"
weight = 35
alwaysopen = false
+++

## Overview
This page describes the complete setup flow to install {{< param cfy_manager_name >}} Manager Premium as an AWS AMI - A fully functional All-In-One {{< param cfy_manager_name >}}.


## Install

This tutorial assumes that you have a non free-tier AWS account and familiar with the basic actions of EC2.

Using the standard ec2 instance creation process, the non-default, and important parts are:

1. Choosing the Cloudify AMI, search for **`Cloudify Platform BYOL`**

2. Choose an instance type that answers at least the [basic requirements](https://docs.cloudify.co/latest/install_maintain/installation/prerequisites/) (e.g. t3.medium) | 2Vcpu, 4GB RAM
   
   - ARM64 instance types can't be selected for now - the AMI is x86_64 only. If you require an ARM64 architecture, please refer to our [downloads page]({{< relref "trial_getting_started/set_trial_manager/other-deployments.md" >}}) for more download options.

3. For SSH access, choose an existing Key pair you own or create a new one.

4. Network Settings
   - Make sure to select a vpc that matches your requirements, if you want public access to the manager instance, expose it using public VPC & Subnet
   - Make sure to set **Auto-assign public IP** to `Enable`
   - Security Group should be suggested by the AMI; but in general, for {{< param product_name >}} you need the following ports:
     - 22 - ssh access
     - 80 - http access (not a must if the manager is going to accessed by SSL only)
     - 443 - https access
     - 53333 - Internal rest service (required by {{< param product_name >}})

Click - **`Launch instance`**

A few minutes after the instance is created, the Manager UI should be available at https://\<instance-public-ip\> (will prompt 'unsafe' warning).

* Please Note: default username and password are admin/admin. It's recommended to change the default password.

* For license activation, please see this [page]({{< relref "cloudify_manager/premium/aio/install_and_configure/activate.md" >}})

For CLI access there are two options:

1. ssh to the running instance using the the following command: (Also good for administrating {{< param cfy_manager_name >}} instance)
```
ssh -i <keyPair> centos@<instance-public-ip>
``` 

2. Install cloudify cli locally and set a profile to access your desired manager [see here]({{< relref "cloudify_manager/cloudify_cli/_index.md" >}}) (Good for external connections to the manager commands only).

### Advanced configuration and options ###
- To connect by ssl to the manager (CLI & UI), configure a DNS record to the instance, or to an LB in front of it, and set an SSL certificate to that record, there are many ways to do so via AWS (e.g. [aws-docs](https://docs.aws.amazon.com/cloudhsm/latest/userguide/ssl-offload-linux.html))
- To control the ssl option of the {{< param cfy_manager_name >}} itself, connect using ssh and follow [this section](https://docs.cloudify.co/latest/cloudify_manager/architecture/security/communication/#ssl-mode-for-external-communication)
- To adjust more options of the {{< param cfy_manager_name >}}, run `sudo vi /etc/cloudify/config.yaml`, edit the file according to your needs, and run `cfy_manager configure` to apply the changes. See all the available options [here]({{< relref "cloudify_manager/premium/aio/install_and_configure/centos_rhel.md" >}})
  - e.g. changing the admin password, setting a hostname, adjusting postgresql/rabbitmq configurations
