+++
title = "Local Command Line Interface "
description = "Install the CLI client using a Docker image"
weight = 95
alwaysopen = false
docker_image_name = "cloudifyplatform/community-cloudify-manager-aio:latest"
docker_install_command_prefix = "docker run --name cfy_manager_local -p 8080:80"
+++

{{%children style="h2" description="true"%}}

The {{< param product_name >}} Docker image comes with the [{{< param cfy_cli_name >}}]({{< relref "cli/" >}}) pre-installed. Some users prefer to use the CLI contained within the Docker image to execute {{< param product_name >}} commands. This guide explains how to use the {{< param product_name >}} Docker image as a local CLI client.

You will need a host with [Docker](https://docs.docker.com/install) installed to run the {{< param product_name >}} CLI container image.

## Installing the Docker image

To deploy the container image, simply launch a terminal and create the container:

```bash
$ {{< param docker_install_command_prefix >}} {{< param docker_image_name >}}
```

## Running commands

There are two ways to execute {{< param product_name >}} commands. You can pass commands to the container to execute, or you can launch a shell within the container to execute commands. The sections below cover each approach.

### Passing commands to the container

You can pass {{< param product_name >}} commands to the CLI container by using them as arguments to the `docker exec` command. The general syntax for running any CLI command is shown below:

```bash
docker exec -it <{{< param product_name >}} docker image name> cfy <command>
```

For example, to execute a `cfy status` against the locally running {{< param cfy_manager_name >}} using the container:

```bash
docker exec -it cfy_manager_local cfy status
```

Please review the [command line reference guide]({{< relref "cli/" >}}) to learn more about the available commands.

### Launching a shell in the container

You can also launch a shell within the running container to execute commands. The shell will provide an interactive terminal within the container to launch commands from. To obtain an interactive shell within the container, simply specify `/bin/sh` as the argument to `docker exec`:


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

## Connecting to a remote manager

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

For more information about the commands that are available using the CLI, please review the [command line reference guide]({{< relref "cli/" >}}).

For information about how to install the {{< param cfy_cli_name >}} directly on Linux, Windows, or Mac refer to the [CLI installation guide]({{< relref "install_maintain/installation/installing-cli" >}}).
