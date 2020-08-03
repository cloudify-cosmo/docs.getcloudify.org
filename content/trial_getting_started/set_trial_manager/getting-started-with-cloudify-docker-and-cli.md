+++
title = "Getting started with cfy command line interface"
description = "This guide illustrates how to use cloudify docker image as local CLI client"
weight = 95
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

The Cloudify Docker image comes with [Cloudify CLI] ({{< relref "cli/" >}}) pre installed.
This guide illustrates how to use cloudify docker image as local CLI client.

## Prerequisites

Install Cloudify on your local desktop.
Use the [following steps] ({{< relref "trial_getting_started/set_trial_manager/download_community/" >}}) to install cloudify docker image on your local desktop.

## Executing the Cloudify CLI remotely on your docker image

To run the cli on docker image you can use the following command:

```bash
> docker exec -it {{<cloudify docker image name>}} cfy {{<command>}}
```
For example to get the local manager status you can run the following command:

```bash
> docker exec -it cfy_manager_local cfy status
```
## Running the CLI locally on the manager image

Open an interactive shell on the manger using the following command

```bash
> docker exec -it {{<image name>}} /bin/sh
```

This command will open a shell on your manager instance.
You can now run any of the CLI command directly (without the "docker exec" prefix)

```bash
> cfy {{<command>}}
```

For example:

```bash
> docker exec -it cfy_manager_local /bin/sh
```
On your image prompt run the follwoing cli command

```bash
sh-4.2#> cfy status
```

## To connect to another remote manager follow the steps here

```bash
> cfy init
> cfy profiles use <your manager hostname / URL / IP> -u admin -p <the admin  password> --ssl
> cfy profiles set --manager-tenant default_tenant
```

## Deploy your first service

To run your first example on your local docker image run the [local hello world example]({{< relref "trial_getting_started/examples/first_service/local_hello_world_example/#cloudify-cli">}}).
This example deploys an http deamon on on your docker instance. (The example doesn't require any cloud credential)
