+++
title = "Community version"
description = "Download page and getting started links for the community version"
weight = 90
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

## Step 1: Install the Cloudify Manager as a Docker container

The easiest way to deploy Cloudify trial manager is as a Docker container. This tutorial assumes that you have [Docker](https://docs.docker.com/install) installed on your local machine.
For more advanced users, other packages can be downloaded [here](https://cloudify.co/getting-started-enterprise).

Open your terminal and create/start the Docker container (requires password)
```
sudo docker run --name cfy_manager_local -d --restart unless-stopped -v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock --security-opt seccomp:unconfined --cap-add SYS_ADMIN -p 80:80 -p 8000:8000 cloudifyplatform/community-cloudify-manager-aio:latest
```

Verify that your manager is running by browsing to [localhost](http://localhost), the Cloudify login page should be displayed.


## Step 2: Run your first example

Learn the Cloudify basics through the following examples:

* [Local hello-world]({{< relref "trial_getting_started/examples/local_hello_world_example.md" >}}) - A simple web service running on your local system
* [AWS - Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/aws_basics.md" >}}) - Introduction to Cloudify basics, setup, configure and teardown AWS based infrastructure.
* [Azure - Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/azure_basics.md" >}}) - Introduction to Cloudify basics, setup, configure and teardown Azure based infrastructure.
* [GCP - Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/gcp_basics.md" >}}) - Introduction to Cloudify basics, setup, configure and teardown GCP based infrastructure.
* [OpenStack - Infrastructure provisioning basics]({{< relref "trial_getting_started/examples/openstack_basics.md" >}}) - Introduction to Cloudify basics, setup, configure and teardown OpenStack based infrastructure.
* [AWS hello-world]({{< relref "trial_getting_started/examples/aws_hello_world_example.md" >}}) - A simple web service running on AWS
* [Azure hello-world]({{< relref "trial_getting_started/examples/azure_hello_world_example.md" >}}) - A simple web service running on Azure
* [GCP hello-world]({{< relref "trial_getting_started/examples/gcp_hello_world_example.md" >}}) - A simple web service running on GCP
* [OpenStack hello-world]({{< relref "trial_getting_started/examples/openstack_hello_world_example.md" >}}) - A simple web service running on OpenStack
* [AWS - multi-cloud JBoss](https://TBD) - Deploy JBoss platform over AWS practicing multi-cloud topology
* [Azure - multi-cloud JBoss](https://TBD) - Deploy JBoss platform over Azure, practicing multi-cloud topology
* [GCP - multi-cloud JBoss](https://TBD) - Deploy JBoss platform over GCP, practicing multi-cloud topology
* [OpenStack - multi-cloud JBoss](https://TBD) - Deploy JBoss platform over OpenStack, practicing multi-cloud topology










___

### Other deployment options and CLI packages

Current Version: 5.0.5  (20.03.03)       [Release Notes](https://cloudify.co/cloudify-5-0-5-release-notes/)

#### Downloads

Cloudify Community Manager Images:  [RPM](http://repository.cloudifysource.org/cloudify/20.03.03/release/cloudify-manager-install-20.03.03-community.x86_64.rpm)	|	[Docker](http://repository.cloudifysource.org/cloudify/20.03.03/build/cloudify-docker-manager-20.03.03.tar)	|	[QCOW](http://repository.cloudifysource.org/cloudify/20.03.03/build/cloudify-manager-community-20.03.18.qcow2)

Cloudify Community CLI: [RPM](http://repository.cloudifysource.org/cloudify/20.03.03/release/cloudify-cli-20.03.03~community.el6.x86_64.rpm)	|	[DEB](http://repository.cloudifysource.org/cloudify/20.03.03/release/cloudify-cli_20.03.03~community_amd64.deb)	|	[EXE](http://repository.cloudifysource.org/cloudify/20.03.03/release/cloudify-windows-cli_20.03.03-community.exe)


By downloading Cloudify, you agree to the [End User License Agreement](https://cloudify.co/license). Cloudify is available for a 60-day evaluation period.

Read about the differences between our [Cloudify versions](https://cloudify.co/product/community-enterprise-editions).
