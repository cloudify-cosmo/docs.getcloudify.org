---
layout: bt_wiki
title: Starting a Cloudify Manager Image
category: Installation
draft: false
weight: 150
---
A Cloudify Manager is a compute host that runs the Cloudify Management service. To help you get running with Cloudify Manager easily, Cloudify provides images of Cloudify Manager for Amazon AWS and OpenStack clouds. Rather than create a host instance and [install Cloudify Manager]({{< relref "installation/installing-manager.md" >}}), you can subscribe to the Amazon AMI in your Amazon AWS account or create an OpenStack instance with the OpenStack QCOW file. Images include pre-installation of Cloudify Manager and its dependencies.

Then you are ready to start working with Cloudify.

{{% gsNote title="Prerequisites" %}}

Make sure that your environment meets the [prerequisites]({{< relref "installation/prerequisites.md" >}}) before you install Cloudify Manager.

{{% /gsNote %}}

## Setup an instance of a Cloudify Manager image

1. Download and install the Cloudify Manager image

    * *Amazon AWS*
    
        1. Go to the [Cloudify download page](http://cloudify.co/download/), click on *Choose Manager Image* and select the *AWS EC2* image.
        1. Start an instance for AWS:

            1. Subscribe to Cloudify Manager in the AWS Marketplace.
            1. In your EC2 account, go to *AMIs* and find the Cloudify Manager in the public images.
            1. Launch an instance and configure the instance resources.
                Make sure you enable inbound traffic from your security settings in the security group assigned to the instance. Port `22` is required for SSH access, and ports `80` and `443` are required for HTTP(S) access.
            1. Click *Accept Software Terms and Launch with 1-Click*.
            1. In the EC2 Management Console, note the IP addresses assigned to your instance.

    * *OpenStack*
        1. Go to the [Cloudify download page](http://cloudify.co/download/), click on *Choose Manager Image* and select the *OpenStack QCOW* image.
        1. Go to your OpenStack cloud and launch an instance based on the image you uploaded:
            1. Go to *Compute* > *Images* and click *Create Image*.
            1. Enter the details of the image, including:
                * Image Source - Select *Image File* and click *Choose File* to browse to the QCOW2 image file
                * Format - Select *QCOW2*
            1. Configure the instance resources.
                Make sure you enable inbound traffic from your security settings in the security group assigned to the instance. Port `22` is required for SSH access, and ports `80` and `443` are required for HTTP(S) access.
            1. Note the IP addresses assigned to your instance.

    * *Docker*
        1. Go to the [Cloudify download page](http://cloudify.co/download/), click on *Choose Manager Image* and select the *Docker* image.
        1. Copy the file to an instance that has Docker installed.
            *Note* - The host instance must have at least 4096MB of memory.
        1. To load the Docker file, run: `sudo docker load < cloudify-docker-manager-4.3ga.tar`
        1. To run the Docker containter, run: `sudo docker run --name cfy_manager -d --restart unless-stopped -v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock --security-opt seccomp:unconfined --cap-add SYS_ADMIN --network host docker_cfy_manager:latest`
        You can connect to the Cloudify Manager on the IP address of the host instance.

1. To use Cloudify Manager from the Cloudify CLI, run the following command on your instance.
    
    {{< gsHighlight  bash  >}}
    $ cfy profiles use <manager-ip> -u admin -p admin -t default_tenant
    {{< /gsHighlight >}}
   
    The default credentials are:

    * username - ```admin```
    * password - ```admin```

    Because the `cfy` command is already available and configured, you can navigate to Cloudify Manager using SSH and use the already configured CLI environment. You can also install [Cloudify CLI]({{< relref "installation/installing-cli.md" >}}) on a local host and connect to the instance remotely.

1. To change the `admin` password, run:   
    {{< gsHighlight  bash  >}}
    cfy users set-password admin -p <new-password>
    {{< /gsHighlight >}}

1. To update the active CLI profile to use the new password, run:   
    {{< gsHighlight  bash  >}}
    cfy profiles use <manager-ip> -u admin -p <the-new-password> -t default_tenant
    {{< /gsHighlight >}}

To access the Cloudify Manager web interface, go to: ```http://<cloudify_manager_ip>```
 
## Next Steps

After Cloudify Manager is installed, you can configure your Cloudify Manager for your environment, including:

* [Upload plugins]({{< relref "plugins/overview.md" >}}) to add functionality to Cloudify Manager
* If you intend to use Cloudify to work with LDAP, setup the [LDAP connection]({{< relref "manager_webui/tenant-management-page.md" >}}).
* Build the [secrets store]({{< relref "manager/using-secrets.md" >}}) for your tenants to store data variables that you do not want to expose in plain text in Cloudify, such as login credentials for a platform.
