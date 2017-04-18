---
layout: bt_wiki
title: Installing a Cloudify Manager
category: Manager Intro
draft: false
weight: 300
---
A Cloudify Manager is a compute host that the Cloudify Management service runs on.

## Installation Methods

There are two ways of creating a Cloudify Manager. You can either start a preconfigured Cloudify Manager image or bootstrap your own Cloudify Manager on an existing compute host.

Starting a Cloudify Manager requires that you already have set up the infrastructure (VM, network, etc) on which to run the Cloudify Manager.

If you do not already have the infrastructure, and require help creating it, you can use one of the [infrastructure examples](https://github.com/cloudify-examples/aws-azure-openstack-blueprint) to create the infrastructure before you begin.

### Starting a Cloudify Manager from an Image

Several Cloudify Manager images are provided, in different formats and in various cloud providers' image marketplaces:

Formats:

* [QCow2](http://repository.cloudifysource.org/org/cloudify3/3.4.0/ga-RELEASE/manager3.4_insecure_image.qcow2)
* RAW 
* VHD 

Marketplaces:

* [AWS] (http://getcloudify.org/thank_you_aws.htm)
* Azure 
* GCP 
* others

Note that if you are starting Cloudify Manager from an image in one of our supported cloud providers, the infrastructure examples enable you to input the image's information. (This is the fastest way to start to a new Cloudify Manager.)

### Bootstrapping a Cloudify Manager

Bootstrapping consists of running a blueprint of the Cloudify Manager, which installs and configures all of the Cloudify components for you.

1. [Download the Cloudify CLI package](http://getcloudify.org/downloads/get_cloudify.html) to the host on which you want to install Cloudify.   
   For information about installing the Cloudify CLI, [click this link]({{< relref "installation/from-packages.md" >}})

2. Open the `simple-manager-blueprint-inputs.yaml` file.   
   You use the simple-manager-blueprint.yaml blueprint to bootstrap Cloudify.

3. Determine which components in the Blueprint that you need to change.   
   At the very least you must provide the correct values for `public_ip`, `private_ip`, `ssh_user`, `ssh_key_filename`, and `agents_user`. Refer to the documentation for what these values mean.

4. Start the bootstrap by running `cfy bootstrap --install-plugins -p simple-manager-blueprint.yaml -i inputs.yaml`.


# Bootstrap Validations

During the first steps of the bootstrap process, some validations take place. By default, if any of the validations fail, the bootstrap process will also fail. The process validates things like the amount of physical memory and disk space available on the host; that the relevant resources required for the bootstrap process are available for download, that you're using the supported OS distributions for the Manager host and more.

To override validation preferences, see the `Bootstrap Validations` section in the `inputs.yaml` file corresponding with your chosen Manager blueprint.

{{% gsNote title="Note" %}}
While you can ignore validations or change their defaults, we do not recommend doing so unless there's a good reason for it.
{{% /gsNote %}}


# Offline Environment

{{% gsInfo title="Info" %}}
If you are planning to bootstrap a manager in an envrionment **with** internet connection, this section can be skipped.
{{% /gsInfo %}}

In order to bootstrap a manager in an environment with no internet connenction, it is needed to download the manager resources package and store it in a fileserver, accessible by the manager's vm. The manager resources package URL can be found in the manager blueprint inputs file:

{{< gsHighlight yaml >}}
...

#############################
# Manager Resources Package
#############################
#manager_resources_package: http://repository.cloudifysource.org/org/cloudify3/3.4.0/ga-RELEASE/cloudify-manager-resources_3.4.0-ga-b400.tar.gz

...
{{< /gsHighlight >}}

After downloading the manager resources package, and placing it in an accessible fileserver, change its URL in the inputs file to point to the accessible location, for example:

{{< gsHighlight yaml >}}
#############################
# Manager Resources Package
#############################
manager_resources_package: http://my-fileserver:8080/cloudify-manager-resources_3.4.0-ga-b400.tar.gz
{{< /gsHighlight >}}


# Bootstrap the Manager

Finally, run the `cfy bootstrap` command, pointing it to the manager blueprint file and the inputs YAML file, like so:

{{< gsHighlight  sh  >}}
$ cfy bootstrap --install-plugins -p /path/to/manager/blueprint/file -i /path/to/inputs/yaml/file
...

{{< /gsHighlight >}}

Depending on the cloud environment and the server specifications you provided, this should take between 10 to 20 minutes to complete.
After validating the configuration, `cfy` will create the management VM, related networks and security groups, download the relevant packages and install all of the components.
At the end of this process you should see the following message:

{{< gsHighlight  bash  >}}
...

bootstrapping complete
management server is up at <YOUR MANAGER IP ADDRESS>

...
{{< /gsHighlight >}}

To validate this installation, point your web browser to the manager IP address (port 80) and you should see Cloudify's Web UI.
At this point there's nothing much to see since you haven't uploaded any blueprints yet.

When the process is complete, you'll have an operational Cloudify manager on the desired provider. You can verify this by making a *status* call.

An example output:

{{< gsHighlight  sh  >}}
$ cfy status
...

Retrieving manager services status... [ip=127.0.0.1]

Services:
+--------------------------------+---------+
|            service             |  status |
+--------------------------------+---------+
| InfluxDB                       | running |
| Celery Management              | running |
| Logstash                       | running |
| RabbitMQ                       | running |
| AMQP InfluxDB                  | running |
| PostgreSQL					 | running |
| Manager Rest-Service           | running |
| Cloudify Stage                 | running |
| Webserver                      | running |
| Riemann                        | running |
| Webserver                      | running |
+--------------------------------+---------+

...
{{< /gsHighlight >}}


# Deploying a Cloudify Manager Image

Images include pre-installation of all dependencies and Cloudify Manager. This enables you to get up and running with Cloudify with minimal user input.


{{% gsNote title="Prerequisites" %}}
 * The Cloudify Manager VM must be accessible through [the ports listed here]({{< relref "manager_architecture/components.md#ports-and-entry-points" >}}).
 {{% /gsNote %}}


To run Cloudify Manager using an Image:

 1. Download an image from the [downloads page](http://getcloudify.org/downloads/get_cloudify.html)

    Choose the image that corresponds to your platform.
    If you are using AWS you can use the public AMI provided through the link above, skip to <a href='#create-instance'>creating an instance</a>.

 1. Upload it to your cloud environment as an image

    [Openstack image upload instructions](http://docs.openstack.org/user-guide/dashboard_manage_images.html)

 1. <span id='create-instance'>Create an instance</span> based on the image you've uploaded.

    Make sure you enable inbound traffic from your  security settings in the instance's security group. Port `22` is required for `ssh` access, and ports `80` and `443` are required for HTTP(S) access.

 
# What's Next

You can now [upload a blueprint]({{< relref "manager/upload-blueprint.md" >}}).


