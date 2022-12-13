---
title: Broker Security (RabbitMQ)
category: Manager
draft: false
weight: 1000
aliases: /manager/broker-security/
---

{{< param product_name >}} uses RabbitMQ as its broker, and supports configurable security.

# Authentication

When installing the {{< param cfy_manager_name >}}, RabbitMQ credentials can be provided in the configuration file before running `cfy_manager install` or `cfy_manager configure`. The default location of this configuration file is `/etc/cloudify/config.yaml`.

## Username

It is suggested that you change the username to something other than the default. It is recommended that you use only upper and lower case letters and numbers for the username.

The username can be changed using the `rabbitmq.username` setting in the configuration file.

## Password

It is recommended that you set the password to something strong that is known only to those who are authorized.

It is recommended that the password is comprised of only ASCII characters, excluding quotes, line feeds, and dollar signs, as these may cause the password to be set incorrectly during the installation.

The password can be changed using the `rabbitmq.password` setting in the configuration file.

# Network Encryption

Communications with the broker is secured using SSL/TLS. The {{< param cfy_manager_name >}} uses a CA certificate, which is deployed to the agents on managed compute nodes, and a server certificate (the "internal" certificate) that is used by RabbitMQ.

Those certificates can also be provided by the user using the `ssl_inputs` setting in the configuration file. For more information about configuring the certificates, [see the description in the article about Manager Architecture - Security]({{< relref "cloudify_manager/architecture/security/communication.md#customizing-ssl-for-internal-communication" >}})


{{% note title="Note" %}}
{{< param product_name >}} agents require Python 2.7.9+ in order to connect to the RabbitMQ service on the manager using TLS 1.2 (recommended TLS version).

{{< param product_name >}} agent for Windows is packed with Python 2.7.9 but will not install it if Python is already installed on the host.
{{% /note %}}
