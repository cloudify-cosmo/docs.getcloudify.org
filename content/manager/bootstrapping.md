---
layout: bt_wiki
title: Installing a Cloudify Manager
category: Manager Intro
draft: false
weight: 300
---
A Cloudify Manager is a compute host on which the Cloudify Management service runs.

## Installation Methods

There are two ways of creating a Cloudify Manager. You can either [start a preconfigured Cloudify Manager image](#starting-a-cloudify-manager-from-an-image) or [bootstrap your own Cloudify Manager](#bootstrapping-a-cloudify-manager) on an existing compute host.

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

Bootstrapping consists of running a blueprint of the Cloudify Manager that installs and configures all of the Cloudify components.

1. [Download the Cloudify CLI package](http://getcloudify.org/downloads/get_cloudify.html) to the host on which you want to install Cloudify.   
   For information about installing the Cloudify CLI, [click here]({{< relref "installation/from-packages.md" >}}).

2. Open the `simple-manager-blueprint-inputs.yaml` file.   
   You use the simple-manager-blueprint.yaml blueprint to bootstrap Cloudify.

3. Determine which components in the blueprint you need to modify.   
   At the very least you must provide the correct values for `public_ip`, `private_ip`, `ssh_user`, `ssh_key_filename`, and `agents_user`. Refer to the documentation for what these values mean.

4. Start the bootstrap by running the following command.   
   {{< gsHighlight   bash  >}}
   cfy bootstrap --install-plugins -p simple-manager-blueprint.yaml -i inputs.yaml
   {{< /gsHighlight >}}


#### Bootstrap Validations

During the first steps of the bootstrap process, validations take place. By default, if any of the validations fail, the bootstrap process also fails. The process validates such things as the volume of physical memory and disk space available on the host, that the relevant resources that are required for the bootstrap process are available for download, that supported OS distributions are being used for the Manager host, and so on.

To override validation preferences, see the `Bootstrap Validations` section in the `inputs.yaml` file that corresponds with your selected Cloudify Manager blueprint.

{{% gsNote title="Note" %}}
Although it is possible ignore validations or change their defaults, it is not recommended that you do so without good reason.
{{% /gsNote %}}


#### Offline Environment

{{% gsInfo title="Info" %}}
If you intend to bootstrap Cloudify Manager in an environment with an internet connection, you can skip this section.
{{% /gsInfo %}}

To bootstrap Cloudify Manager in an environment without an internet connenction, you must download the Manager resources package and store it in a fileserver that is  accessible by the Cloudify Manager VM. The Manager resources package URL can be found in the Manager blueprint inputs file.

{{< gsHighlight yaml >}}
#############################
# Manager Resources Package
#############################
#manager_resources_package: http://repository.cloudifysource.org/org/cloudify3/3.4.0/ga-RELEASE/cloudify-manager-resources_3.4.0-ga-b400.tar.gz
{{< /gsHighlight >}}

After you have downloaded the Manager resources package to an accessible fileserver, change its URL in the inputs file to point to the accessible location, for example:

{{< gsHighlight yaml >}}
#############################
# Manager Resources Package
#############################
manager_resources_package: http://my-fileserver:8080/cloudify-manager-resources_3.4.0-ga-b400.tar.gz
{{< /gsHighlight >}}


#### Bootstrap the Manager

Finally, run the `cfy bootstrap` command, pointing it to the Manager blueprint file and the inputs YAML file.

{{< gsHighlight  sh  >}}
$ cfy bootstrap --install-plugins -p /path/to/manager/blueprint/file -i /path/to/inputs/yaml/file
...

{{< /gsHighlight >}}

Depending on the cloud environment and the server specifications you provided, this should take between 10 to 20 minutes to complete.
After validating the configuration, `cfy` will create the management VM, related networks and security groups, download the relevant packages and install all of the components.
On successful completion of the process, the following message is displayed.

{{< gsHighlight  bash  >}}
...

bootstrapping complete
management server is up at <YOUR MANAGER IP ADDRESS>

...
{{< /gsHighlight >}}

To validate the installation, point your browser to the Manager IP address (port 80) to display the Cloudify Web UI.
The interface will not display much because no blueprints have yet been uploaded.

When the process is complete, you have an operational Cloudify Manager on your specified provider. You can verify completion by making a `status` call.

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
| PostgreSQL                     | running |
| Manager Rest-Service           | running |
| Cloudify Stage                 | running |
| Webserver                      | running |
| Riemann                        | running |
| Webserver                      | running |
+--------------------------------+---------+

...
{{< /gsHighlight >}}


### Deploying a Cloudify Manager Image

Images include pre-installation of all dependencies and of Cloudify Manager. This enables you to get up and running with Cloudify with minimal user input.


{{% gsNote title="Prerequisites" %}}
 * The Cloudify Manager VM must be accessible through [the ports listed here]({{< relref "manager_architecture/components.md#ports-and-entry-points" >}}).
 {{% /gsNote %}}


To deploy Cloudify Manager using an image:

 1. Download an image from the [downloads page](http://getcloudify.org/downloads/get_cloudify.html)

    Choose the image that corresponds to your platform.
    If you are using AWS you can use the public AMI provided through the link above, skip to <a href='#create-instance'>creating an instance</a>.

 1. Upload it to your cloud environment as an image

    [Openstack image upload instructions](http://docs.openstack.org/user-guide/dashboard_manage_images.html)

 1. <span id='create-instance'>Create an instance</span> based on the image you've uploaded.

    Make sure you enable inbound traffic from your  security settings in the instance's security group. Port `22` is required for `ssh` access, and ports `80` and `443` are required for HTTP(S) access.

 1. To use Cloudify Manager from the Cloudify CLI, run the following command.   
    
    {{< gsHighlight  bash  >}}
    $ cfy cfy profiles use <manager-ip> -u admin -p admin -t default_tenant
    {{< /gsHighlight >}}
   
    The default username and password are `admin`/`admin`. 

    Because the `cfy` command is already available and configured, you can navigate to Cloudify Manager using SSH and use the already configured CLI environment.

 1. It is good practice to change the `admin` password as soon as Cloudify is up. Use the following command.   
    {{< gsHighlight  bash  >}}
    cfy users set-password admin -p <new-password>
    {{< /gsHighlight >}}

 1. After you have changed the password, run the following command to update the active CLI profile to use the new password.   
    {{< gsHighlight  bash  >}}
    cfy profiles use <manager-ip> -u admin -p <the-new-password> -t default_tenant
    {{< /gsHighlight >}}

 1. To access the Cloudify Manager UI, navigate to http://<_manager-ip_>/
 
# What's Next

You can now [upload a blueprint]({{< relref "manager/upload-blueprint.md" >}}).


