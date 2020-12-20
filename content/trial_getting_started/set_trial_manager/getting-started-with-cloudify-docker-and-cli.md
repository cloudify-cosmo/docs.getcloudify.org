+++
title = "Local Command Line Interface "
description = "This guide illustrates how to use cloudify docker image as local CLI client"
weight = 95
alwaysopen = false
docker_image_name = "cloudifyplatform/community-cloudify-manager-aio:latest"
+++

{{%children style="h2" description="true"%}}

The Cloudify Docker image comes with [Cloudify CLI] ({{< relref "cli/" >}}) pre installed.
This guide illustrates how to use cloudify docker image as local CLI client.

## Install local Docker image

Install Cloudify on your local desktop.
Use the [following steps] ({{< relref "trial_getting_started/set_trial_manager/download_community" >}}) to install cloudify docker image on your local desktop.

For example:

```bash
> {{< param docker_install_command_prefix >}} {{< param docker_image_name >}}
```

## Executing the Cloudify CLI outside your local Community or Premium docker image

To execute the cloudify cli from your desktop to your local docker image you can use the following command:

```bash
> docker exec -it <cloudify docker image name> cfy <command>
```
For example to get the local manager status you can run the following command:

```bash
> docker exec -it cfy_manager_local cfy status
```
## Running the CLI on your local Community or Premium docker image

Open an interactive shell on the manger using the following command

```bash
> docker exec -it <image name> /bin/sh
```

This command will open a shell on your manager instance.
You can now run any of the CLI command directly (without the "docker exec" prefix)

```bash
> cfy <command>
```

For example:

```bash
> docker exec -it cfy_manager_local /bin/sh
```
On your image prompt run the following cli command

```bash
sh-4.2#> cfy status
```

## Connect to a remote manager
This option will allow you to redirect the CLI to a remote a cloudify manager

```bash
> cfy init
> cfy profiles use <your manager hostname / URL / IP> -u admin -p <the admin  password> --ssl
> cfy profiles set --manager-tenant default_tenant
```

For example:

```bash
> cfy init
> cfy profiles use http://manaager.yoursite.com -u admin -p admin --ssl
> cfy profiles set --manager-tenant default_tenant
```


## Deploy your first service

To run your first example on your local docker image run the [local hello world example]({{< relref "trial_getting_started/examples/local_hello_world_example#cloudify-cli" >}}).
This example deploys an http deamon on on your docker instance. (The example doesn't require any cloud credentials)

## CLI Reference Guide

See the [command line reference guide]({{< relref "cli/" >}}) to learn how to deploy a new service, execute workflow, etc..

For more options on how to install the cloudify command line utility on Linux, Windows or Mac refer to the [CLI installation guide] ({{< relref "install_maintain/installation/installing-cli" >}}).
