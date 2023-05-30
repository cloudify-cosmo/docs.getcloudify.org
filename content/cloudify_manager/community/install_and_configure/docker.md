+++
title = "Docker"
description = "Docker"
weight = 20
+++

## Overview
The {{< param product_name >}} free community version contains a fully functional {{< param product_name >}} engine & most of the manager capabilities (read about the differences between our [{{< param product_name >}} versions]({{< ref "cloudify_manager/architecture/_index.md#comparison-matrix" >}})). 

This section describes how to install and run {{< param cfy_manager_name >}} as a Docker container.

Verify that the target computer meets the [prerequisites]({{< relref "cloudify_manager/community/capacity_and_planning.md" >}}).

## Install

Deploying the {{< param product_name >}} trial manager as a Docker container is the easiest way to go. This tutorial assumes that you have Docker installed on a local or remote machine.
Open your terminal and create/ start the Docker container (requires password).

```
docker run --name cfy_manager_local -p 80:80 cloudifyplatform/community-cloudify-manager-aio:latest
```

Verify that your manager is running by browsing to localhost when running locally, or to the hosting machine IP when the Docker server is remote.

The {{< param product_name >}} login page should be displayed.

![login-page.png]( /images/ui/pages/login-page.png )

{{% note %}}
Note: the default login username and password are _admin/admin_.
{{% /note %}}

## Configure

commonly used `docker run` flags:

| FLAG                                                                                   | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                        |
|----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--restart unless-stopped`                                                             | Auto-restart of the container                                                                                                                                                                                                                                                                                                                                                                                                      |
| `security-opt secconmp:unconfined --cap-add SYS_ADMIN` or alternatively `--privileged` | When running a SystemD based container, giving the container elevated privileges is required for SystemD itself to run. When using a new enough Docker Engine (at least 17.05+), those flags can be omitted, but the host SELinux policy might need to be adjusted by doing `setsebool -P container_manage_cgroup true`. Neither those flags nor the SELinux adjustment, are required when using containers not based on SystemD. |
| `-v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock`                   | Mounts required only when using a SystemD based container. Note that the host machine must also be using SystemD.                                                                                                                                                                                                                                                                                                                  |
| `-p 80:80 -p 5671:5671 -p 53333:53333 -p 8000:8000` or alternatively `-p 443:443`      | The ports 5671 and 53333 are used for manager/ agent communication, while the port 80 or 443 is used for CLI/UI access to the manager. Port 8000 is used for the hello-world example and is optional. Using the `-p` flags, or even `--network host`, these ports can be forwarded from the host machine to the container.                                                                                                          |
| `--name cfy_manager_local`                                                             | Is the name given to the container, for use with later `docker exec` calls.                                                                                                                                                                                                                                                                                                                                                           |
| `-v /some/absolute/path/to/config.yaml:/etc/cloudify/config.yaml:rw`                   | Mounting a yaml file at `/etc/cloudify/config.yaml` allows configuring the manager container, including setting an admin password and providing paths to TLS certificates.                                                                                                                                                                                                                                                        |

The container's starter service will take a while to boot up all the manager components. Run `cfy_manager wait-for-starter` to synchronously wait for the manager to fully start:

```
docker exec cfy_manager_local cfy_manager wait-for-starter
```

When done, `wait-for-starter` will print out the manager's admin password to stdout.

