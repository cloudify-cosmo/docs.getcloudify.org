+++
title = "Cloudify CLI"
description = "This guide illustrates how to use {{< param product_name >}} docker image as local CLI client"
weight = 300
alwaysopen = false
docker_image_name = "cloudifyplatform/community-cloudify-manager-aio:latest"
+++

{{%children style="h2" description="true"%}}


## Install Cloudify CLI

### Linux & Mac (Binary)
```
curl -sfL https://cloudify.co/get-cli | sh -
```
### Windows

The EXE installation package for Windows can be downloaded from the [link](https://repository.cloudifysource.org/cloudify/6.4.0/ga-release/cloudify-windows-cli_6.4.0-ga.exe)

### PyPI

```
sudo pip install cloudify
```
### Docker
```
 docker pull cloudifyplatform/cloudify-cli
```

## Connect to a remote manager

By default CLI pointing to `localhost`. In case you've installed Cloudify CLI on a different machine you'll need to set up a new profile to redirect to a remote {{< param cfy_manager_name >}}

```bash
> cfy init
> cfy profiles use <HOSTNAME|UR|IP> -u admin -p <ADMIN_PASSWORD> --ssl
> cfy profiles set --manager-tenant default_tenant
```

For example:

```bash
> cfy init
> cfy profiles use http://manaager.yoursite.com -u admin -p admin --ssl
> cfy profiles set --manager-tenant default_tenant
```


## Deploy your first service

To run your first example on your local docker image run the [local hello world example]({{< relref "trial_getting_started/examples/local/local_hello_world_example#cloudify-cli" >}}).
This example deploys an http deamon on on your docker instance. (The example doesn't require any cloud credentials)

## CLI Reference Guide

See the [command line reference guide]({{< relref "cli/" >}}) to learn how to deploy a new service, execute workflow, etc..

For more options on how to install the {{< param cfy_cli_name >}} on Linux, Windows or Mac refer to the [CLI installation guide] ({{< relref "install_maintain/installation/installing-cli" >}}).
