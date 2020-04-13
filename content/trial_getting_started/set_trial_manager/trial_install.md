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
sudo docker run --name cfy_manager_local -d --restart unless-stopped
-v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock
--security-opt seccomp:unconfined --cap-add SYS_ADMIN -p 80:80
-p 8000:8000 cloudifyplatform/premium-cloudify-manager-aio:latest
```

Verify that your manager is running by browsing to [localhost](http://localhost) when running locally,
or to the hosting machine IP when the Docker server is remote.

The Cloudify login page should be displayed.

![login-page.png]( /images/ui/login/login-page.png )


### Step 2: Activate your Trial

A Cloudify license is provided to all Cloudify Premium subscribed customers by Cloudify support.
Cloudify Premium trial customers receive their trial license via email upon trial request.
Request your free 60 days trial at https://cloudify.co/download/#trial.  

Once you receive your license activation key, use it to activate your Cloudify manager. Manager activation (and most other Cloudify actions) can be performed through either Cloudify management console (UI) or via Cloudify CLI.
In this tutorial we will demonstrate the usage of the both options.

#### Activating Cloudify using the UI

1. Go to localhost in your browser to see the Cloudify UI. Login and password are both _admin_.
2. Submit your Cloudify subscription/trial key. Learn more [here](https://docs.cloudify.co/latest/install_maintain/installation/manager-license/#product-activation).

#### Activating Cloudify using the CLI

Save the Cloudify subscription/trial license key as a file on your machine.
Copy the license key file to the container by running:

```
docker cp <file path on local system> cfy_manager_local:/tmp/license.yaml
```

e.g. docker cp C:\Users\John\Downloads\my-license.yaml docker-cfy-manager:/tmp/

Apply the license by running:

```
docker exec -it cfy_manager_local sh -c "cfy license upload /tmp/license.yaml"
```

#### Congratulations! you now have your Cloudify manager ready.

What's next?
* Optional - When using a remote Docker service, working with Cloudify using a local CLI is the recommended approach. [Install local Cloudify CLI]({{< relref "trial_getting_started/set_trial_manager/cli_install.md" >}}).
* Go ahead and examine our [example based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}}) to learn about Cloudify basics


____


By downloading Cloudify, you agree to the [End User License Agreement](https://cloudify.co/license).
Cloudify is available for an evaluation period of 60-days.

Read about the differences between our [Cloudify versions](https://cloudify.co/product/community-enterprise-editions).
