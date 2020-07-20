+++
title = "Community version"
description = "Download page and getting started links for the community version"
weight = 90
alwaysopen = false
+++

{{%children style="h2" description="true"%}}


The Cloudify free community version contains a fully functional Cloudify engine & most of the manager capabilities (read about the differences between our [Cloudify versions](https://cloudify.co/product/community-enterprise-editions)).
The community version is available as an rpm, OpenStack Image or as a Docker based container. This page describes the complete setup flow to get an activated Cloudify trial manager as a Docker container.

### Step 1: Install the Cloudify Manager as a Docker container


Deploying Cloudify trial manager as a Docker container is the easiest way to go.
This tutorial assumes that you have [Docker](https://docs.docker.com/install) installed on a local or a remote machine.

Open your terminal and create/start the Docker container (requires password)
```
sudo docker run --name cfy_manager_local -d --restart unless-stopped -v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock --security-opt seccomp:unconfined --cap-add SYS_ADMIN -p 80:80 -p 8000:8000 cloudifyplatform/community-cloudify-manager-aio:latest
```

Verify that your manager is running by browsing to [localhost](http://localhost) when running locally,
or to the hosting machine IP when the Docker server is remote.

The Cloudify login page should be displayed.

![login-page.png]( /images/ui/login/login-page.png )


____

#### Congratulations! you now have your Cloudify manager ready.

What's next?

* Optional - When using a remote Docker service, working with Cloudify using a local CLI is the recommended approach. [Install local Cloudify CLI]({{< relref "/install_maintain/installation/installing-cli.md" >}}).
* Go ahead and examine our [example based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}}) to learn about Cloudify basics.
