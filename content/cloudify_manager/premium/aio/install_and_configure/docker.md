+++
title = "Docker"
description = "Docker"
weight = 10
alwaysopen = false
+++

## Overview
{{< param product_name >}} Premium provides a fully functional Premium manager as a Docker container image. This page describes the complete setup flow to install {{< param cfy_manager_name >}} Premium as a docker container.


## Install

Deploying {{< param product_name >}} trial manager as a Docker container is the easiest way to go. This tutorial assumes that you have Docker installed on a local or remote machine.

Open your terminal and create/ start the Docker container.

```
docker run -d cloudifyplatform/premium-cloudify-manager-aio:latest -p 80:80
```

Verify that your manager is running by browsing to localhost when running locally, or to the hosting machine IP when the Docker server is remote.

The {{< param product_name >}} login page should be displayed.

## Activate

A {{< param product_name >}} license is provided to all {{< param product_name >}} Premium subscribed customers by {{< param product_name >}} support. {{< param product_name >}} Premium trial customers receive their trial license via email upon trial request. Request your free 60 days trial at https://cloudify.co/cloudify-premium-download/.

Once you receive your license activation key, use it to activate your {{< param cfy_manager_name >}}. Manager activation (and most other {{< param product_name >}} actions) can be performed through either {{< param product_name >}} Management Console (UI) or via {{< param product_name >}} CLI. In this tutorial, we will demonstrate the usage of the Management Console.

1. Log in to the {{< param product_name >}} Management Console (as done in step 1 above). username and password are _admin/ admin_.
2. Submit your {{< param product_name >}} subscription/ trial key. Learn more here.

## Configure

commonly used `docker run` flags:

| FLAG                                                                                   | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                        |
|----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--restart unless-stopped`                                                             | auto-restart of the container                                                                                                                                                                                                                                                                                                                                                                                                      |
| `security-opt secconmp:unconfined --cap-add SYS_ADMIN` or alternatively `--privileged` | when running a SystemD-based container, giving the container elevated privileges is required for SystemD itself to run. When using a new enough Docker Engine (at least 17.05+), those flags can be omitted, but the host SELinux policy might need to be adjusted by doing `setsebool -P container_manage_cgroup true`. Neither those flags, nor the SELinux adjustment, are required when using containers not based on SystemD. |
| `-v /sys/fs/cgroup:/sys/fs/cgroup:ro --tmpfs /run --tmpfs /run/lock`                   | mounts required only when using a SystemD-based container. Note that the host machine must also be using SystemD.                                                                                                                                                                                                                                                                                                                  |
| `-p 80:80 -p 5671:5671 -p 53333:53333 -p 8000:8000` or alternatively `-p 443:443`      | the ports 5671 and 53333 are used for manager/agent communication, while the port 80 or 443 is used for CLI/UI access to the manager. Port 8000 is used for the hello-world example and is optional. Using the `-p` flags, or even `--network host`, these ports can be forwarded from the host machine to the container.                                                                                                          |
| `--name cfy_manager_local`                                                             | the name given to the container, for use with later `docker exec` calls.                                                                                                                                                                                                                                                                                                                                                           |
| `-v /some/absolute/path/to/config.yaml:/etc/cloudify/config.yaml:rw`                   | mounting a yaml file at `/etc/cloudify/config.yaml` allows configuring the manager container, including setting an admin password, and providing paths to TLS certificates.                                                                                                                                                                                                                                                        |

The container's starter service will take a while to boot up all the manager components. Run `cfy_manager wait-for-starter` to synchronously wait for the manager to fully start:

```
docker exec cfy_manager_local cfy_manager wait-for-starter
```

When done, `wait-for-starter` will print out the manager's admin password to stdout.

