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
    
        1. Go to the [Cloudify download page](http://cloudify.co/download/) and choose a Cloudify Enterprise or Community Manager AMI.
        1. Start an instance for AWS:

            1. From the AMI page, click on the image in your preferred region and you will be redirected to the Amazon Instance Launch page.
            1. Choose your Instance Type and configure the instance resources. We suggest a machine with a minimum of 2 vCPUs and 4GB of memory.
                Make sure you enable inbound traffic from your security settings in the security group assigned to the instance. Port `22` is required for SSH access, and ports `80` and `443` are required for HTTP(S) access. Don't forget to open all ports noted in the [prerequisites](https://docs.cloudify.co/latest/installation/prerequisites/) as well.
            1. Once you have configured the machine, click *Launch*.
            1. Once the instance is up, you can access Cloudify Console (UI) at the Public IP address assigned to your instance or go to Step 2 to access Cloudify Manager via the CLI.

    * *OpenStack*
        1. Go to the [Cloudify download page](http://cloudify.co/download/) and choose a Cloudify Enterprise or Community Manager QCOW image.
        1. Go to your OpenStack cloud and launch an instance based on the image you downloaded:
            1. Go to *Compute* > *Images* and click *Create Image*.
            1. Enter the details of the image, including:
                * Image Source - Select *Image File* and click *Choose File* to browse to the QCOW2 image file
                * Format - Select *QCOW2*
            1. Configure the instance resources.
                Make sure you enable inbound traffic from your security settings in the security group assigned to the instance. Port `22` is required for SSH access, and ports `80` and `443` are required for HTTP(S) access. Don't forget to open all ports noted in the [prerequisites](https://docs.cloudify.co/latest/installation/prerequisites/) as well.
            1. Once the instance is up, you can access Cloudify Console (UI) at the Floating IP address assigned to your instance or go to Step 2 to access Cloudify Manager via the CLI.

    * *Docker*
        1. Go to the [Cloudify download page](http://cloudify.co/download/) and choose a Cloudify Enterprise or Community Manager Docker Image.
        1. Copy the file to an machine that has the latest Docker build installed.
            *Note* - The host machine must have at least 4096MB of memory.
        1. To load the Docker file, go to the directory the image is located and run: `sudo docker load < cloudify-docker-manager-4.3ga.tar` 
        1. To create and start a Docker containter with Cloudify Manager, run: `sudo docker run --name cfy_manager -d --restart unless-stopped -v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock --security-opt seccomp:unconfined --cap-add SYS_ADMIN --network host docker_cfy_manager:latest`
            1. Once the instance is up, you can access Cloudify Console (UI) at the Public IP address of the host instance or go to Step 2 to access Cloudify Manager via the CLI.


1. To use Cloudify Manager from the terminal, run the following command with your instance details.
    
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
 
## Next Steps

After Cloudify Manager is installed, you can configure your Cloudify Manager for your environment, including:

* [Upload plugins]({{< relref "plugins/overview.md" >}}) to add functionality to Cloudify Manager
* If you intend to use Cloudify to work with LDAP, setup the [LDAP connection]({{< relref "manager_webui/tenant-management-page.md" >}}).
* Build the [secrets store]({{< relref "manager/using-secrets.md" >}}) for your tenants to store data variables that you do not want to expose in plain text in Cloudify, such as login credentials for a platform.
