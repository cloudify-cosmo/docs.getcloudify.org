---
layout: bt_wiki
title: Installing a Cloudify Manager
category: Installation
draft: false
weight: 300
---

This topic describes the various options for installing Cloudify Manager, including installation from an image, and online and offline bootstrapping. After you have completed the installation, you need to [upload plugins]({{< relref "plugins/using-plugins.md" >}}) and [create secrets]({{< relref "manager/using-secrets.md" >}}) in order for your installation to run in a meaningful way.



## Prerequisites for Installing a Cloudify Manager
A Cloudify Manager has a set of prerequisites, related to both infrastructure and operating system.

### Manager Requirements

#### Manager Resources

Cloudify Manager must run on a 64-bit machine with a RHEL/CentOS 7.x or higher platform. Cloudify Manager requires at the least:

 -       | Minimum | Recommended |
---------|---------|-------------|
 vCPUs   | 2       | 16          |
 RAM     | 4GB     | 8GB         |
 Storage | 5GB     | 64GB        |

The minimum requirements are enough for small deployments that only manage a few compute instances. Managers that manage more deployments or large deployments need at least the recommended resources.

Recommended resource requirements are tested and verified to be dependent on these criteria:

* Blueprints: The only limit to the number of blueprints is the storage required to store the number and size of the local blueprints.
* Deployments: Each deployment requires minimal storage.
* Nodes: Cloudify can orchestrate 12,000 non-monitored nodes (tested with 2000 deployments, each spanning 6 node instances). Monitored nodes add CPU load to the manager and require storage for the logs, events and metrics.
* Tenants: You can run up to 1000 tenants on a manager.
* Workflows & Concurrency: You can run up to 100 concurrent workflows.
* Logs, events and metrics: You must have enough storage to store the logs, events and metrics sent from the hosts. You can configure log index rotation before bootstrapping to the reduce the amount of storage space required.

{{% gsNote title="Bootstrap Validations" %}}

The bootstrap process validates that the manager has the minimum system resources. For more information, see the Bootstrap Validations note below.

{{% /gsNote %}}

#### Network Ports

Cloudify Manager listens on the following ports:

 Port   | Description
--------|--------------
 80     | REST API and UI. This port must be accessible when SSL is not enabled.
 443    | REST API and UI. This port must be accessible when SSL is enabled.
 22     | During bootstrap, components are installed and configured via SSH. It is also used during recovery of cloudify Manager.
 5671   | RabbitMQ. This port must be accessible from agent VMs.
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


{{% gsNote title="Bootstrap Validations" %}}

During the first steps of the bootstrap process, validations take place. By default, if any validations fail, the bootstrap process also fails. The process validates such things as the volume of physical memory and disk space available on the host, that the relevant resources that are required for the bootstrap process are available for download, that supported OS distributions are being used for the Manager host, and so on.

To override validation preferences, see the `Bootstrap Validations` section in the `simple-manager-blueprint-inputs.yaml`.

{{% gsWarning title="Note" %}}
Although it is possible ignore validations or change their defaults, it is not recommended that you do so without good reason.
{{% /gsWarning %}}

{{% /gsNote %}}

{{% gsNote title="Note" %}}
You can specify a custom directory to use as temporary storage for executable files that you do not want to have stored in the `temp dir` directory. Provide an environment variable for the directory that is exported during bootstrapping.
{{% /gsNote %}}


## Option 1 Installing a Cloudify Manager Image

If you are not bootstrapping Cloudify Manager, you can deploy one of the provided images listed below. Images include pre-installation of all dependencies and of Cloudify Manager. This enables you to get up and running with Cloudify with minimal user input.

* [QCow2-format image](http://repository.cloudifysource.org/cloudify/4.0.1/sp-release/cloudify-manager-premium-4.0.1.qcow2)
* [AWS marketplace image] (http://cloudify.co/thank_you_aws_ent)


Note that if you are starting Cloudify Manager from an image in one of our supported cloud providers, the infrastructure examples enable you to input the image's information. (This is the fastest way to start to a new Cloudify Manager.)


{{% gsNote title="Prerequisites" %}}
 * The Cloudify Manager VM must be accessible through [the ports listed here]({{< relref "manager_architecture/components.md#ports-and-entry-points" >}}).
 {{% /gsNote %}}

#### Process Overview
Getting your Cloudify Manager up and running comprises the following steps:

1. Downloading the Cloudify CLI image.
2. Uploading the image to your Cloud environment.
3. Creating an instance of the Manager.
4. Running Cloudify Manager.
5. Validating the installation.
6. [Installing the required plugins]({{< relref "plugins/using-plugins.md" >}}) for your operating system.
7. [Configuring secrets]({{< relref "manager/using-secrets.md" >}}).


#### Procedure

 1. Download an image from the [downloads page](http://getcloudify.org/downloads/get_cloudify.html).

 1. Upload the image to your Cloud environment as an image.

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
 
### What's Next

You can now [upload a plugin]({{< relref "plugins/using-plugins.md" >}}) or [configure secrets]({{< relref "manager/using-secrets.md" >}}).

## Option 2 Bootstrapping a Cloudify Manager

Bootstrapping consists of running a blueprint of the Cloudify Manager that installs and configures all of the Cloudify components. If you are installing Cloudify Manager in an offline environment, [click here]({{< relref "installation/bootstrapping.md#installing-cloudify-manager-in-an-offline-environment" >}}).

{{% gsNote title="Note" %}}
You can install Cloudify using [pip 6.0 or higher](https://pip.pypa.io/en/stable/installing/). It is possible to operate Cloudify on [virtualenv 12.0 or higher](https://virtualenv.readthedocs.org/en/latest/installation.html). However, it is recommended that you download the Cloudify CLI package (see Step 1 of the following procedure).
{{% /gsNote %}}

### Process Overview

Getting your Cloudify Manager up and running comprises the following steps:

1. Downloading the Cloudify CLI package.
2. Providing input data in the blueprint inputs file.
3. Running the bootstrap process.
4. Validate the bootstrap.
5. [Installing the required plugins]({{< relref "plugins/using-plugins.md" >}}) for your operating system.
6. [Configuring secrets]({{< relref "manager/using-secrets.md" >}}).

### Procedure

#### Step 1: Download the Cloudify CLI Package
[Download the Cloudify CLI package](http://getcloudify.org/downloads/get_cloudify.html) to the host on which you want to install Cloudify. It does not have to be the same machine as the one on which Cloudify Manager is installed.

For information about installing the Cloudify CLI, [click here]({{< relref "installation/from-packages.md" >}}).

#### Step 2: Edit the Blueprints Input File

1. Navigate to the cloudify-manager-blueprints directory and open the `simple-manager-blueprint-inputs.yaml` file to specify the correct values for the mandatory parameters. The blueprint _inputs_ file enables you to specify values for the `simple-manager-blueprint.yaml` blueprint, which is what you use to bootstrap Cloudify.   

   * On Linux systems, the file is located under ``` /opt/cfy/cloudify-manager-blueprints/simple-manager-blueprint-inputs.yaml```
   * On Windows systems, by default the file is located under ```C:\Program Files (x86)\Cloudify\cloudify-manager-blueprints\simple-manager-blueprint-inputs.yaml```. If you changed the default, the file will be located in ```<destination location>\cloudify-manager-blueprints\simple-manager-blueprint-inputs.yaml```.<br>
   Note that the `simple-manager-blueprint.yaml` blueprint is located in the same directory.

2. Specify values for the following parameters.   
   
   * `public_ip` - The public IP address of the Cloudify Manager to which the CLI will connect.
   * `private_ip` - The private IP address of the Manager. This is the address that is used by the application hosts to connect to the fileserver and message broker of the Manager.
   * `ssh_user` - The SSH user that is used to connect to the Manager. *See note below for important considerations regarding this input*.
   * `ssh_key_filename` - The SSH key path that is used to connect to the Manager.
   * `agents_user` - The user with which the Manager will try to connect to the application hosts.
   * `admin_username` - The name of the Admin user.
   * `admin_password` - The password of the Admin user. If you do not specify a password, it is automatically generated during bootstrapping. The password will be displayed at the end of the bootstrapping process.
   * `network_configuration` - The network IPs/hostnames that the agents
   [can be configured]({{< relref "agents/configuration.md" >}}#configuration-properties)
   to use to communicate with the manager. A dictionary
   of network names mapped to IPs/hostnames. A "default" entry can be
   specified. Otherwise, `private_ip` will be used as the default.
   *See note below for examples for this input*.

   **NOTE**: The specified `ssh_user` must fulfill the following requirements, otherwise bootstrapping errors will occur:

   * Must be permitted to SSH into the target machine using key authentication only (no password)
   * Must be permitted to run any `sudo` command without being prompted for a password
   * Must be permitted to execute `sudo` commands through SSH (this is typically achieved by disabling `requiretty` for this user in the system's `sudoers` file)
   * Must be permitted to impersonate other users through the `sudo -u` command
   * Must have an effective `umask` such that the "others" permission bits are not masked (we recommend a `umask` of `0002`)

   **NOTE**: Examples for the `network_configuration` input:
   An example of a manager that has a private IP (1.2.3.4) and two
   additional IPs (10.0.0.1 and 192.168.0.2) through which an agent can
   connect to it. For each IP, a network is specified in the
   `network_configuration` input. In the blueprint the agent can be
   configured to use one of these networks. If the blueprint doesn't
   specify a network for the agent, the private IP (1.2.3.4) will be used.

   ```yaml
   inputs:
     private_ip: 1.2.3.4
     network_configuration:
       network_a: 10.0.0.1
       network_b: 192.168.0.2
   ```

   An example of overriding the "default" network:
   The manager has a private IP (1.2.3.4) used for its internal services
   and two additional IPs (10.0.0.1 and 192.168.0.2) for agents to
   communicate with it. In the blueprint the agent can be configured
   to use `other_network` (192.168.0.2). Otherwise, the "default"
   network will be used (10.0.0.1).

   ```yaml
   inputs:
     private_ip: 1.2.3.4
     network_configuration:
       default: 10.0.0.1
       other_network: 192.168.0.2
   ```

#### Step 3: Start the Bootstrap Process

Start the bootstrap by running the following command.   

   {{< gsHighlight   bash  >}}
   cfy bootstrap simple-manager-blueprint.yaml -i simple-manager-blueprint-inputs.yaml
   {{< /gsHighlight >}}

#### Step 4: Validate the Installation

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

#### Step 5: Install Plugins

Install your required plugins. For more information, see [the Plugins section]({{< relref "plugins/using-plugins.md" >}}).

#### Step 6: Configure Secret Storage

Secret storage provides a tenant-wide store for data variables that you might not want to expose in plain text in Cloudify, such as login credentials for a platform. When you use secrets, the plugins that you have uploaded, consume the secrets to provide credential values. To implement secret storage for your tenants, see [_Using Secret Storage_]({{< relref "manager/using-secrets.md" >}}).


## Installing Cloudify Manager in an Offline Environment

This section describes how to bootstrap Cloudify Manager in an environment without an internet connection. 

When you are working offline in Cloudify, all resources required by Cloudify Manager, ranging from the bootstrap process to workflow execution, are contained within Cloudify Manager, rather than being retrieved from any other source, such as an internal or public network. Working offline provides advantages in the areas of stability and security and is a good solution for environments in which access to public networks is prohibited.

{{% gsWarning title="File Locations" %}}
This guide makes references to downloading specific files to specific locations. If the machine on which a file is supposed to be located does not have access to a public network, you need to download the file in some way and save it in the relevant location.
{{% /gsWarning %}}

### Process Overview
The process comprises the following steps.

1. Downloading the Manager resources package.
2. Preparing the CLI machine.
3. Preparing the Python virtual environment.
4. Downloading the YAML files and DSL resources.
5. Downloading and installing Wagon files.
6. Preparing the inputs file.
7. Bootstrapping the Manager.
8. Validating the installation.
9. [Installing the required plugins]({{< relref "plugins/using-plugins.md" >}}) for your operating system.
10. [Configuring secrets]({{< relref "manager/using-secrets.md" >}}).

#### Prerequisites

* A VM on which the CLI is installed. This VM will be used to orchestrate the bootstrap process. (The instructions assume that the OS is CentOS 7.x.)
* A VM on which Cloudify Manager is hosted.

### Procedure

####  Step 1: Download the Manager Resources Package
Download the [Manager resources package](http://repository.cloudifysource.org/cloudify/4.1.0/ga-release/cloudify-manager-resources_4.1.0-ga.tar.gz) and store it on the Cloudify Manager VM as `/tmp/cloudify-manager-resources.tar.gz`. The Manager resources package URL can be found in the Manager blueprint inputs file.

#### Step 2: Prepare the CLI Virtual Machine
Prepare the CLI VM, as follows:   
   
   1. Create a new directory to be used as the root directory for your work (for example: ~/cloudify).
   2. Create a new directory to be used as the Cloudify working directory (for example: ~/cloudify/manager).
   3. Create a new directory to host offline resources (for example: ~/cloudify/offline).
   4. Verify that you have access to the Cloudify Manager blueprints.   
      
      * If you installed the CLI from the CLI RPM, the Manager blueprints are located in `/opt/cloudify/cloudify-manager-blueprints`.  
        {{< gsHighlight  bash  >}}
        export MANAGER_BLUEPRINTS_DIR=/opt/cfy/cloudify-manager-blueprints
        {{< /gsHighlight >}}

      * If you did not install the CLI from the CLI RPM, download the Manager blueprints (https://github.com/cloudify-cosmo/cloudify-manager-blueprints/archive/4.1.tar.gz) and extract them to your preferred location (for example: ~/cloudify-manager-blueprints).  
        {{< gsHighlight  bash  >}}
        export MANAGER_BLUEPRINTS_DIR=~/cloudify/manager-blueprints
        curl -L -o /tmp/cloudify-manager-blueprints.tar.gz
        https://github.com/cloudify-cosmo/cloudify-manager-blueprints/archive/4.1.tar.gz
        mkdir -p $MANAGER_BLUEPRINTS_DIR
        cd $MANAGER_BLUEPRINTS_DIR
        tar -zxvf /tmp/cloudify-manager-blueprints.tar.gz --strip-components=1
        {{< /gsHighlight >}}


#### Step 3: Prepare the Python Virtual Environment
Run the following command to prepare the python virtual environment. 
{{< gsHighlight  bash  >}}
virtualenv ~/cloudify/env
source ~/cloudify/env/bin/activate
pip install https://github.com/cloudify-cosmo/cloudify-rest-client/archive/4.1.zip
pip install https://github.com/cloudify-cosmo/cloudify-dsl-parser/archive/4.1.zip
pip install https://github.com/cloudify-cosmo/cloudify-plugins-common/archive/4.1.zip
pip install https://github.com/cloudify-cosmo/cloudify-script-plugin/archive/1.4.zip
pip install https://github.com/cloudify-cosmo/cloudify-cli/archive/4.1.zip
{{< /gsHighlight >}}

#### Step 4: Download the YAML Files and DSL Resources 
The simple-manager-blueprint imports two YAML files and, by default, uploads a number of DSL resources to the Manager. Download all the files to the same base directory.   <br>
   **YAML files**   <br>

      * http://www.getcloudify.org/spec/cloudify/4.1/types.yaml
      * http://cloudify.co/spec/fabric-plugin/1.5/plugin.yaml

   **DSL resources**   <br>

      * http://cloudify.co/spec/openstack-plugin/2.0.1/plugin.yaml
      * http://cloudify.co/spec/aws-plugin/1.4.10/plugin.yaml
      * http://www.getcloudify.org/spec/tosca-vcloud-plugin/1.3.1/plugin.yaml
      * http://cloudify.co/spec/vsphere-plugin/2.3.0/plugin.yaml
      * http://cloudify.co/spec/diamond-plugin/1.3.5/plugin.yaml

   {{< gsHighlight  bash  >}}
   cd ~/cloudify/offline
   mkdir plugins && cd plugins
   curl -L -O http://repository.cloudifysource.org/cloudify/wagons/cloudify-fabric-plugin/1.5/cloudify_fabric_plugin-1.5-py27-none-linux_x86_64-centos-Core.wgn
    {{< /gsHighlight >}}

#### Step 5: Download and Install the Wagon Files
The simple-manager-blueprint uses the Fabric plugin. Run the following command to download and install the plugin into the Python virtualenv from which the bootstrap will run.

   {{< gsHighlight yaml >}}
   cd ~/cloudify/offline
   mkdir plugins && cd plugins
   curl -L -O http://repository.cloudifysource.org/cloudify/wagons/cloudify-fabric-plugin/1.5/cloudify_fabric_plugin-1.5-py27-none-linux_x86_64-centos-Core.wgn
   wagon install cloudify_fabric_plugin-1.4.2-py27-none-linux_x86_64-centos-Core.wgn
   {{< /gsHighlight >}}

#### Step 6: Prepare the Inputs File
There are a number of mandatory inputs for which you must provide values. These inputs are included in the `simple-manager-blueprints-inputs.yaml` file. 

1. Run the following command to open the inputs file.   
   {{< gsHighlight yaml >}}
   cp $MANAGER_BLUEPRINTS_DIR/simple-manager-blueprints-inputs.yaml ~/cloudify/manager/manager-inputs.yaml
   vi ~/cloudify/manager/manager-inputs.yaml
   {{< /gsHighlight >}}

2. Provide values for the following inputs. In addition, ensure that the`minimum_required_total_physical_memory_in_mb` value is lower than, or equal to, to the volume of RAM (in MB) on the Manager VM.    
   {{< gsHighlight yaml >}}
   public_ip: <manager-public-ip>
   private_ip: <manager-private-ip>
   ssh_user: centos
   ssh_key_filename: <manager-ssh-key>
   manager_resources_package: file:///tmp/cloudify-manager-resources.tar.gz
   dsl_resources:
     - {'source_path': '/home/centos/cloudify/offline/dsl/openstack-plugin/1.4/plugin.yaml', 'destination_path': '/spec/openstack-plugin/1.4/plugin.yaml'}
     - {'source_path': '/home/centos/cloudify/offline/dsl/aws-plugin/1.4.1/plugin.yaml', 'destination_path': '/spec/aws-plugin/1.4.1/plugin.yaml'}
     - {'source_path': '/home/centos/cloudify/offline/dsl/tosca-vcloud-plugin/1.3.1/plugin.yaml', 'destination_path': '/spec/tosca-vcloud-plugin/1.3.1/plugin.yaml'}
     - {'source_path': '/home/centos/cloudify/offline/dsl/vsphere-plugin/2.0/plugin.yaml', 'destination_path': '/spec/vsphere-plugin/2.0/plugin.yaml'}
     - {'source_path': '/home/centos/cloudify/offline/dsl/fabric-plugin/1.4.1/plugin.yaml', 'destination_path': '/spec/fabric-plugin/1.4.1/plugin.yaml'}
     - {'source_path': '/home/centos/cloudify/offline/dsl/diamond-plugin/1.3.3/plugin.yaml', 'destination_path': '/spec/diamond-plugin/1.3.3/plugin.yaml'}
     - {'source_path': '/home/centos/cloudify/offline/dsl/cloudify/3.4.1/types.yaml', 'destination_path': '/spec/cloudify/3.4.1/types.yaml'}
  {{< /gsHighlight >}}


#### Step 7: Start the Bootstrap Process

Run one of the following commands to invoke the bootstrap process. The second option generates additional logging, to assist in potential troubleshooting.

{{< gsHighlight yaml >}}
cfy bootstrap $MANAGER_BLUEPRINTS_DIR/simple-manager-blueprint.yaml -i ~/cloudify/manager/manager-inputs.yaml
{{< /gsHighlight >}}

{{< gsHighlight yaml >}}
cfy bootstrap $MANAGER_BLUEPRINTS_DIR/simple-manager-blueprint.yaml -i ~/cloudify/manager/manager-inputs.yaml --debug | tee bootstrap.log
{{< /gsHighlight >}}

Depending on the cloud environment and the server specifications you provided, the process will take between 10 to 20 minutes to complete.
After validating the configuration, `cfy` downloads the relevant packages and installs all of the components.


#### Step 8: Validate the Installation


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
* If you intend to use Cloudify to work with LDAP, set the connection now, on the clean machine. For instructions, [click here].
* You can now [upload a plugin]({{< relref "plugins/using-plugins.md" >}}).
* The secrets store provides tenant-wide storage for data variables that you might not want to expose in plain text in Cloudify, such as login credentials for a platform. When you use secrets, the plugins that you have uploaded, consume the secrets to provide credential values. To implement the secrets store for your tenants, see [Using the Secrets Store]({{< relref "manager/using-secrets.md" >}}).



