+++
title = "Cloudify Premium Trial"
description = "Installing Cloudify trial manager"
weight = 10
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

 Cloudify Premium Trial provides a fully functional Premium manager as a Docker container image. This page describes the complete setup flow to get an activated Cloudify trial manager.

### Step 1: Install the Cloudify Manager as a Docker container


Deploying Cloudify trial manager as a Docker container is the easiest way to go.
This tutorial assumes that you have [Docker](https://docs.docker.com/install) installed on a local or a remote machine.

Open your terminal and create/start the Docker container (requires password)
```
sudo docker run --name cfy_manager_local -d --restart unless-stopped -v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock --security-opt seccomp:unconfined --cap-add SYS_ADMIN -p 80:80 -p 8000:8000 cloudifyplatform/premium-cloudify-manager-aio:latest
```

Verify that your manager is running by browsing to [localhost](http://localhost) when running locally,
or to the hosting machine IP when the Docker server is remote.

The Cloudify login page should be displayed.

![login-page.png]( /images/ui/login/login-page.png )


### Step 2: Activate your Trial

A Cloudify license is provided to all Cloudify Premium subscribed customers by Cloudify support.
Cloudify Premium trial customers receive their trial license via email upon trial request.
Request your free 60 days trial at https://cloudify.co/download/#trial.  

Once you receive your license activation key, use it to activate your Cloudify manager. Manager activation (and most other Cloudify actions) can be performed through either Cloudify Management Console (UI) or via Cloudify CLI.
In this tutorial we will demonstrate the usage of the Management Console.

1. Login to the Cloudify Management Console (as done in step 1 above). Login and password are both _admin_.
2. Submit your Cloudify subscription/trial key. Learn more [here](https://docs.cloudify.co/latest/install_maintain/installation/manager-license/#product-activation).



____

#### Congratulations! you now have your Cloudify manager ready.

What's next?

* To execute the CLI on your docker image refer to the [local CLI guide] ({{< relref "trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli" >}})
* To run your first hello world example on your local manager refer to the the [local hello world example] ({{< relref "trial_getting_started/examples/first_service/local_hello_world_example" >}}) (no cloud credentials needed)
* Optional - When using a remote Docker service, working with Cloudify using a local CLI is the recommended approach. [Install local Cloudify CLI]({{< relref "/install_maintain/installation/installing-cli.md" >}}).
* Go ahead and examine our **[example based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}})** to learn about Cloudify basics.
