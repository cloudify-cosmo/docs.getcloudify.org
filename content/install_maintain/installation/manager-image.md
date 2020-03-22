---
layout: bt_wiki
title: Deploying a Cloudify Manager Image
description: On your preferred cloud provider, deploy a Cloudify Manager from an image.
category: Installation
draft: false
weight: 4
---
A Cloudify Manager is a compute host that runs the Cloudify Management services. To help you get running with Cloudify Manager easily, Cloudify provides images of Cloudify Manager for:

* OpenStack
* Docker

You can create an OpenStack instance with the OpenStack QCOW file, or load a Docker container. Images include pre-installation of Cloudify Manager and its dependencies.

To install Cloudify Manager on bare-metal or other platforms using a single offline RPM package, go to [installing Cloudify Manager]({{< relref "install_maintain/installation/installing-manager.md" >}}).

{{% note title="Prerequisites" %}}

Make sure that your environment meets the [prerequisites]({{< relref "install_maintain/installation/prerequisites.md" >}}) before you install Cloudify Manager.

{{% /note %}}

## Setup an Instance of a Cloudify Manager Image

1. Go to the [Cloudify download page](http://cloudify.co/download/) and select the Cloudify Enterprise or Community image for your platform.
1. Start the image in your platform:


    * ##### OpenStack

        Go to your OpenStack cloud and launch an instance based on the image you downloaded:

        1. Go to **Compute** > **Images** and click **Create**.
        1. Enter the details of the image, including:
            * Image Source - Select **Image File** and click **Browse File** to browse to the QCOW2 image file.
            * Format - Select **QCOW2**.
        1. Configure the instance resources according to the [prerequisites]({{< relref "install_maintain/installation/prerequisites.md" >}}).
        1. Launch the instance.
        1. To verify that the Cloudify Manager is installed after the instance is created and running, go to the Cloudify Console at `http://<public_ip>`. Use this IP address as the manager IP address for CLI and Cloudify Console connections.

    * ##### Docker
        {{< warning title="For Remote Instances Only" >}}
        This Docker image is designed to run on a remote instance, not on a docker installation on your local machine.
        {{< /warning >}}

        1. Verify that the target computer meets the [prerequisites]({{< relref "install_maintain/installation/prerequisites.md" >}}).

        1. To create and start a Docker container with Cloudify Manager, run:

            {{< highlight bash >}}
docker run --name cfy_manager_local -d --restart unless-stopped \
  -v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock \
  --security-opt seccomp:unconfined --cap-add SYS_ADMIN \
  -p 80:80 -p 5671:5671 -p 53333:53333 \
  cloudifyplatform/premium-cloudify-manager-aio:latest
{{< /highlight >}}

        1. To verify that the Cloudify Manager is installed after the instance is created and running, go to the Cloudify Console at `http://<host_ip>`. Use this IP address as the manager IP address for CLI and Cloudify Console connections.

        1. Cloudify Console's HTTP port depends on actual Cloudify Manager's configuration.  If you wish [to enable SSL]({{< relref "about/manager_architecture/security.md#ssl-mode-for-external-communication" >}}), you should also start using `443` port (`-p 443:443` in the `docker run` command) and `https://` protocol for accessing Cloudify Console.

        1. Activate your license - [Learn more about license activation]({{< relref "install_maintain/installation/manager-license.md" >}})


1. To use Cloudify Manager from the terminal using the [Cloudify CLI]({{< relref "install_maintain/installation/installing-cli.md" >}}), run the following command with your instance details.

    {{< highlight bash >}}
    $ cfy profiles use <manager-ip> -u admin -p admin -t default_tenant
    {{< /highlight >}}

    The default credentials are:

    * username - `admin`
    * password - `admin`

    Because the `cfy` command is already available and configured, you can navigate to Cloudify Manager using SSH and use the already configured CLI environment (except for Docker). You can also install [Cloudify CLI]({{< relref "install_maintain/installation/installing-cli.md" >}}) on a local host and connect to the instance remotely.

1. To change the `admin` password, run:

    {{< highlight bash >}}
    cfy users set-password admin -p <new-password>
    {{< /highlight >}}

1. To update the active CLI profile to use the new password, run:

    {{< highlight bash >}}
    cfy profiles use <manager-ip> -u admin -p <the-new-password> -t default_tenant
    {{< /highlight >}}

## Next Steps

After Cloudify Manager is installed, you can configure your Cloudify Manager for your environment, including:

* [Upload plugins]({{< relref "working_with/official_plugins/_index.md" >}}) to add functionality to Cloudify Manager
* If you intend to use Cloudify to work with LDAP, setup the [LDAP connection]({{< relref "working_with/console/tenant-management-page.md" >}}).
* Build the [secrets store]({{< relref "working_with/manager/using-secrets.md" >}}) for your tenants to store data variables that you do not want to expose in plain text in Cloudify, such as login credentials for a platform.
