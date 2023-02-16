+++
title = "Cloudify CLI"
description = "Install the CLI client using a Docker image"
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

The EXE installation package for Windows can be downloaded from the [link](https://repository.cloudifysource.org/cloudify/6.4.0/ga-release/cloudify-windows-cli_6.4.0-ga.exe).

### PyPI (Python Package)

```
pip install cloudify
```
### Docker
```
docker pull cloudifyplatform/cloudify-cli
```

## CLI Autocomplete

To allow autocompletion for our CLI command, run the following command:
```
eval "$(_CFY_COMPLETE=source cfy)"
```

## Connect to a Remote Manager

By default CLI points to `localhost`. In case you've installed Cloudify CLI on a different machine or you are using Cloudify SaaS, you'll need to set up a new profile to redirect to a remote {{< param cfy_manager_name >}}

```bash
cfy init
cfy profiles use <HOSTNAME|URL|IP> -u admin -p <ADMIN_PASSWORD> --ssl
cfy profiles set --manager-tenant default_tenant
```

## Running Commands

There are two ways to execute {{< param product_name >}} commands. You can pass commands to the container to execute, or you can launch a shell within the container to execute commands. The sections below cover each approach.

### Passing Commands to the Container

You can pass {{< param product_name >}} commands to the CLI container by using them as arguments to the `docker exec` command. The general syntax for running any CLI command is shown below:

```bash
docker exec -it <{{< param product_name >}} docker image name> cfy <command>
```

For example, to execute a `cfy status` against the locally running {{< param cfy_manager_name >}} using the container:

```bash
docker exec -it cfy_manager_local cfy status
```

Please review the [Command Line Reference guide]({{< relref "cli/" >}}) to learn more about the available commands.

### Launching a Shell in the Container

You can also launch a shell within the running container to execute commands. The shell will provide an interactive terminal within the container to launch commands. To obtain an interactive shell within the container, simply specify `/bin/sh` as the argument to `docker exec`:


```bash
docker exec -it cfy_manager_local /bin/sh
```

Once you have obtained a shell within the container, you can execute commands using the CLI using the following syntax:

```bash
cfy <command>
```

For example, to execute a `cfy status` against the locally running {{< param cfy_manager_name >}} using the container:

```bash
cfy status
```

## Connecting to a Remote Manager

The examples above execute commands against the locally running {{< param cfy_manager_name >}} within the container. You may also want to connect to a remote {{< param cfy_manager_name >}}. This can be achieved by configuring and using a profile within the container.

First, launch a shell within the container:

```bash
docker exec -it cfy_manager_local /bin/sh
```

Next, initialize and configure a profile to use with the CLI using the following syntax:

```bash
cfy init
cfy profiles use <your manager hostname / URL / IP> -u admin -p <the admin  password> --ssl
cfy profiles set --manager-tenant default_tenant
```

For example, to connect to the remotely running manager at https://manager.yoursite.com, you can use the following command:

```bash
cfy init
cfy profiles use https://manager.yoursite.com -u admin -p admin --ssl
cfy profiles set --manager-tenant default_tenant
```

## Additional Resources

For more information about the commands that are available using the CLI, please review the [Command Line Reference guide]({{< relref "cli/" >}}).

For more options on how to install the {{< param cfy_cli_name >}} on Linux, Windows, or Mac refer to the [CLI installation guide] ({{< relref "cloudify_manager/cloudify_cli" >}}).
