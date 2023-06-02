+++
title = "Manager Setup"
description = "Get started with setting up your hosted service trial or deploying your own trial server"
weight = 102
alwaysopen = false
+++

The first step in this journey is to setup your {{< param product_name >}} Environment.

If you have x_clop2_cloudify.admin role you should be able to see the application menu - from the menu modules you can select Getting Started Setup then you can get started with {{< param product_name >}} Environment

{{< param product_name >}} Environment can be in many flavors :

* As a Hosted Service
* Installed on public network [SSL,Non-SSL] and in case of SSL with self-signed certificate
  {the certificate needs to be added to ServiceNow}
* Installed on private network [mid-server needs to be configured]

For more details on how to setup {{< param product_name >}} manager please refer to [{{< param cfy_manager_name >}} setup]({{< relref "/trial_getting_started/set_trial_manager/_index.md" >}}) before moving on.


## Adding {{< param cfy_manager_name >}} External Certificate *Self-Signed*

To add the certificate you will need to do the following:

* Get the manager external certificate
* Login to your ServiceNow instance as an admin
* Using the navigation on left pane , search for certificate
* Under System Definitions -> you will find Certificates
* Click on new and give it a name , and select PEM format and paste the content of the certificate


## Mid Server Configuration

To configure the mid server we will follow ServiceNow installation instructions:

* Create a user and grant it `mid_server` role and specific to our application we will also grant it access to `sys_attachment` table
* Download the mid_installer package and install it on the host inside the private network
* Add the mid server name to the config that refers to the local manager endpoint

You can watch this video that shows the mid-server installation and configuration

<iframe src="https://player.vimeo.com/video/672061772" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>


## Getting Started {{< param product_name >}} Environment

This video demonstrates how to setup {{< param product_name >}} as a service and configure various flavors of {{< param product_name >}} environments:

<iframe src="https://player.vimeo.com/video/664376837" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

{{%children style="h3" description="true"%}}
