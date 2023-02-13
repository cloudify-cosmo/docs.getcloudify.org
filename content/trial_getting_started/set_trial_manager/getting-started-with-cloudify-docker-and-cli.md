+++
title = "Cloudify CLI"
description = "This guide illustrates how to use {{< param product_name >}} docker image as local CLI client"
weight = 300
alwaysopen = false
docker_image_name = "cloudifyplatform/community-cloudify-manager-aio:latest"
docker_install_command_prefix = "docker run --name cfy_manager_local -p 8080:80"
+++

{{%children style="h2" description="true"%}}

## Install Cloudify CLI

### Linux & Mac (Binary)
```
curl -sfL https://cloudify.co/get-cli | sh -
```
### Windows

The EXE installation package for Windows can be downloaded from the [link](https://repository.cloudifysource.org/cloudify/6.4.0/ga-release/cloudify-windows-cli_6.4.0-ga.exe)

### PyPI (Python Package)

```
pip install cloudify
```
### Docker
```
docker pull cloudifyplatform/cloudify-cli
```

## CLI Autocomplete

To allow autocompletion for our cli command, run the following command:
```
eval "$(_CFY_COMPLETE=source cfy)"
```

## Connect to a remote manager

By default CLI pointing to `localhost`. In case you've installed Cloudify CLI on a different machine or you are using Cloudify SaaS, you'll need to set up a new profile to redirect to a remote {{< param cfy_manager_name >}}

```bash
cfy init
cfy profiles use <HOSTNAME|URL|IP> -u admin -p <ADMIN_PASSWORD> --ssl
cfy profiles set --manager-tenant default_tenant
```

Next, initialize and configure a profile to use with the CLI using the following syntax:

```bash
cfy init
cfy profiles use http://XXXX.app.cloudify.co -u admin -p my_password --ssl
cfy profiles set --manager-tenant default_tenant
```

For example, to connect to the remotely running manager at https://manager.yoursite.com, you can use the following command:

```bash
cfy init
cfy profiles use https://manager.yoursite.com -u admin -p admin --ssl
cfy profiles set --manager-tenant default_tenant
```

## Additional Resources

For more information about the commands that are available using the CLI, please review the [command line reference guide]({{< relref "cli/" >}}).

For more options on how to install the {{< param cfy_cli_name >}} on Linux, Windows or Mac refer to the [CLI installation guide] ({{< relref "cloudify_manager/cloudify_cli" >}}).
