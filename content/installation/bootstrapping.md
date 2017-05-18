---
layout: bt_wiki
title: Installing a Cloudify Manager
category: Installation
draft: false
weight: 300
---
A Cloudify Manager is a compute host on which the Cloudify Management service runs.

## Prerequisites for Installing a Cloudify Manager
A Cloudify Manager has a set of prerequisites, related to both infrastructure and operating system.

### Manager Environment

### Host Machine

#### Minimal Requirements

Cloudify Manager must run on a 64-bit machine and requires at the very least 2 vCPUs, 4GB RAM and 5GB of free disk space. These are the minimal requirements for a Cloudify Manager to run, and are only sufficient for demos and development. You need to provision larger machines to actually utilize the Manager's capabilites.


##### Bootstrap Validations

During the bootstrap process, validations occur to verify minimum requirements. [Click here]({{< relref "manager/bootstrapping.md" >}}#bootstrap-validations) for more information on bootstrap validations.

#### Recommended Requirements

The recommended requirements vary, based on the following:

* Number of deployments you intend to run.
* Volume of logs and events you need to send concurrently from your hosts.
* Volume of metrics you need to send concurrently from your hosts.

As a general recommendation for the average system, one Cloudify Manager requires at least 8GB of RAM and 4 vCPUs. Disk space requirements vary according to the volume of logs, events and metrics sent. You can configure log index rotation before bootstrapping.


#### Network

Cloudify Manager listens on the following ports:

 Port   | Description
--------|--------------
 80     | REST API and UI. This port must be accessible when SSL is not enabled.
 443    | REST API and UI. This port must be accessible when SSL is enabled.
 8101   | REST API. This port is used for internal access and therefore must only be accessible from `Agent VMs`.
 22     | During bootstrap, components are installed and configured via SSH. It is also used during recovery of cloudify Manager.
 5672   | RabbitMQ. This port must be accessible from agent VMs.
 53229  | File server. This port must be accessible from agent VMs.
 53333  | Internal REST communications. This port must be accessible from agent VMs.

 Additionally, when the Manager is part of a Cloudify Manager cluster, the following ports must be accessible from all the other nodes in the cluster:

 Port   | Description
 -------|--------------
 8300   | Internal port for the distributed key/value store.
 8301   | Internal port for TCP and UDP heartbeats. Must be accessible for both TCP and UDP.
 8500   | Port used for outage recovery in the event that half of the nodes in the cluster failed.
 15432  | Database replication port.
 22000  | Filesystem replication port.

All ports are TCP unless noted otherwise.


### OS Distributions

#### Management Server

Cloudify can be bootstrapped on either CentOS 7.x or RHEL 7.x.

## Creating a Cloudify Manager
There are two ways of creating a Cloudify Manager:

* [Bootstrap your own Cloudify Manager]({{< relref "installation/bootstrapping.md#option-2-bootstrapping-a-cloudify-manager" >}}) on an existing compute host 
* [Install a preconfigured Cloudify Manager image]({{< relref "installation/bootstrapping.md#option-1-installing-a-cloudify-manager-image">}}).

Starting a Cloudify Manager requires that you already have set up the infrastructure (VM, network, etc) on which to run the Cloudify Manager.

If you do not already have the infrastructure, and require help creating it, you can use one of the [infrastructure examples](https://github.com/cloudify-examples/aws-azure-openstack-blueprint) to create the infrastructure before you begin.


## Option 1 Installing a Cloudify Manager Image

If you are not bootstrapping Cloudify Manager, you can deploy one of the provided images listed below. Images include pre-installation of all dependencies and of Cloudify Manager. This enables you to get up and running with Cloudify with minimal user input.

* [QCow2-format image](http://repository.cloudifysource.org/cloudify/4.0.0/ga-release/cloudify-manager-premium-4.0.qcow2)
* [AWS marketplace image] (http://cloudify.co/thank_you_aws_ent)


Note that if you are starting Cloudify Manager from an image in one of our supported cloud providers, the infrastructure examples enable you to input the image's information. (This is the fastest way to start to a new Cloudify Manager.)


{{% gsNote title="Prerequisites" %}}
 * The Cloudify Manager VM must be accessible through [the ports listed here]({{< relref "manager_architecture/components.md#ports-and-entry-points" >}}).
 {{% /gsNote %}}


To deploy Cloudify Manager using an image:

 1. Download an image from the [downloads page](http://getcloudify.org/downloads/get_cloudify.html).

 1. Upload the image to your cloud environment as an image.

 1. Create an instance based on the image you uploaded.

    Make sure you enable inbound traffic from your  security settings in the instance's security group. Port `22` is required for SSH access, and ports `80` and `443` are required for HTTP(S) access.

 1. To use Cloudify Manager from the Cloudify CLI, run the following command.   
    
    {{< gsHighlight  bash  >}}
    $ cfy profiles use <manager-ip> -u admin -p admin -t default_tenant
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

 To access the Cloudify Manager UI, navigate to http://<_manager-ip_>/


## Option 2 Bootstrapping a Cloudify Manager

Bootstrapping consists of running a blueprint of the Cloudify Manager that installs and configures all of the Cloudify components.

1. [Download the Cloudify CLI package](http://getcloudify.org/downloads/get_cloudify.html) to the host on which you want to install Cloudify. It does not have to be the same machine as the one on which Cloudify Manager is installed.   
   For information about installing the Cloudify CLI, [click here]({{< relref "installation/from-packages.md" >}}).

2. Open the `simple-manager-blueprint-inputs.yaml` file.   
   You use the simple-manager-blueprint.yaml blueprint to bootstrap Cloudify.

3. Provide the correct values for `public_ip`, `private_ip`, `ssh_user`, `ssh_key_filename`, `agents_user`, `admin_username`, and `admin_password`. Refer to the descriptions in the blueprint for what these values mean.   
   If you do not specify a password, it will be automatically generated during bootstrapping. The password will be displayed at the end of the bootstrapping process.
   
4. Start the bootstrap by running the following command.   
   {{< gsHighlight   bash  >}}
   cfy bootstrap simple-manager-blueprint.yaml -i inputs.yaml
   {{< /gsHighlight >}}


### Bootstrap Validations

During the first steps of the bootstrap process, validations take place. By default, if any of the validations fail, the bootstrap process also fails. The process validates such things as the volume of physical memory and disk space available on the host, that the relevant resources that are required for the bootstrap process are available for download, that supported OS distributions are being used for the Manager host, and so on.

To override validation preferences, see the `Bootstrap Validations` section in the `simple-manager-blueprint-inputs.yaml`.

{{% gsNote title="Note" %}}
Although it is possible ignore validations or change their defaults, it is not recommended that you do so without good reason.
{{% /gsNote %}}


### Offline Environment

{{% gsInfo title="Info" %}}
If you are bootstrapping Cloudify Manager in an environment with an internet connection, you can skip this section.
{{% /gsInfo %}}

To bootstrap Cloudify Manager in an environment without an internet connenction, you must [download the Manager resources package](http://getcloudify.org/downloads/get_cloudify.html) and store it in a fileserver that is  accessible by the Cloudify Manager VM. The Manager resources package URL can be found in the Manager blueprint inputs file.

{{< gsHighlight yaml >}}
#############################
# Manager Resources Package
#############################
#manager_resources_package: http://repository.cloudifysource.org/cloudify-manager-resources.tar.gz
{{< /gsHighlight >}}

After you have downloaded the Manager resources package to an accessible fileserver, change its URL in the inputs file to point to the accessible location, for example:

{{< gsHighlight yaml >}}
#############################
# Manager Resources Package
#############################
manager_resources_package: http://my-fileserver:8080/cloudify-manager-resources.tar.gz
{{< /gsHighlight >}}


### Bootstrap the Manager

Finally, run the `cfy bootstrap` command, pointing it to the Manager blueprint file and the inputs YAML file.

{{< gsHighlight  sh  >}}
$ cfy bootstrap /path/to/manager/blueprint/file -i /path/to/inputs/yaml/file
...

{{< /gsHighlight >}}

Depending on the cloud environment and the server specifications you provided, the process will take between 10 to 20 minutes to complete.
After validating the configuration, `cfy` downloads the relevant packages and install all of the components.
On successful completion of the process, the following message is displayed.

{{< gsHighlight  bash  >}}
2017-04-20 12:06:36.297  CFY <manager> 'execute_operation' workflow execution succeeded
Bootstrap complete
Manager is up at 10.239.1.205
##################################################
Manager password is Zf9WQyakEaDP
##################################################
{{< /gsHighlight >}}

When the process is complete, you have an operational Cloudify Manager. You can verify completion by making a `status` call.<br>
The Cloudify Web user interface is available (to Premium customers) by accessing the Manager on port 80.

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

 
## What's Next

You can now [upload a blueprint]({{< relref "manager/upload-blueprint.md" >}}).


