+++
title = "Software Requirements"
description = "This section reviews the specific software requirements before you install the Cloudify Manager."
weight = 50
alwaysopen = false
+++

## Overview

These are specific packages that are commonly included in RHEL/ CentOS. You must have these packages installed before you install the {{< param cfy_manager_name >}}.

## {{< param cfy_manager_name >}}

| PACKAGE                             | DESCRIPTION                                                                                                                                 |
|-------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| sudo                                | Password-less sudo is required to run commands with root privileges (note that this is still a requirement even when running with root user). |
| systemd                             | Create {{< param product_name >}} Services                                                                                                  |
| yum                                 | Install {{< param product_name >}}'s required packages                                                                                      |
| openssl-1.0.2k                      | Generate internal/ external certificates                                                                                                     |
| openssh-server                      | Creating SSH keys during the sanity check                                                                                                   |
| logrotate                           | Rotating {{< param product_name >}} log files                                                                                               |
| sed                                 | Required by the CLI                                                                                                                         |
| tar                                 | Required by the CLI                                                                                                                         |
| python-setuptools                   | Required by Python                                                                                                                          |
| python-backports                    | Required by Python                                                                                                                          |
| python-backports-ssl_match_hostname | Required by Python                                                                                                                          |
| policycoreutils-python              | Required if SELinux is enforcing                                                                                                            |

## PostgreSQL Database

| PACKAGE                             | DESCRIPTION                                                                                                                                 |
|-------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| sudo                                | Passwordless sudo is required to run commands with root privileges (note that this is still a requirement even when running with root user) |
| systemd                             | Create {{< param product_name >}} Services                                                                                                  |
| yum                                 | Install {{< param product_name >}}'s required packages                                                                                      |
| logrotate                           | Rotating {{< param product_name >}} log files                                                                                               |
| python-setuptools                   | Required by Python                                                                                                                          |
| python-backports                    | Required by Python                                                                                                                          |
| python-backports-ssl_match_hostname | Required by Python                                                                                                                          |
| policycoreutils-python              | Required if SELinux is enforcing                                                                                                            |

## RabbitMQ Message Queue

| PACKAGE                             | DESCRIPTION                                            |
|-------------------------------------|--------------------------------------------------------|
| systemd                             | Create {{< param product_name >}} Services             |
| yum                                 | Install {{< param product_name >}}'s required packages |
| logrotate                           | Rotating {{< param product_name >}} log files          |
| initscripts                         | Required by RabbitMQ                                   |
| python-setuptools                   | Required by Python                                     |
| python-backports                    | Required by Python                                     |
| python-backports-ssl_match_hostname | Required by Python                                     |
| policycoreutils-python              | Required if SELinux is enforcing                       |

## Interoperability

The {{< param cfy_manager_name >}} is a complete application. As such, it contains several installed dependencies such as PostgreSQL, NGINX, RabbitMQ, and others.
It is required that you install {{< param cfy_manager_name >}} on a standalone VM or container and do not co-locate any other applications on that machine or container (beyond possible monitoring or logging software).
You must install the {{< param cfy_manager_name >}} as described in the installation instructions in this guide.

## Supported Resolution

Minimal supported resolution of screen width is 1,280 px

## Supported Browsers

The browsers that {{< param cfy_manager_name >}} Manager and {{< param cfy_manager_name >}} Composer support are: Chrome, Edge, Firefox, and Safari.
