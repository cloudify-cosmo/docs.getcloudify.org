---
title: Agents
description: APIs and Customizing Blueprints and Plugins
weight: 200
alwaysopen: false
aliases: /agents/overview/
---

The {{< param cfy_agent_name >}} is a component that is installed on hosts that are part of your blueprint. The {{< param cfy_agent_name >}} communicates with the {{< param cfy_manager_name >}}.

The Agent execute orchestration operations locally, and collects metrics and report them to the {{< param cfy_manager_name >}}.

If your blueprint does not require these functions, you can exclude the agent installation from the {{< param cfy_manager_name >}} [installation process]({{< relref "install_maintain/agents/installation.md" >}}).

## Agent Packages

{{< param cfy_agent_name >}} is supported over the following platforms:

* RHEL / CentOS 7.x (Python 3.6)
* RHEL / CentOS 8.x (Python 3.6)
* Ubuntu 16.x / 18.x (Python 3.6)
* Windows 2012 and later (Python 2.7)

In addition, you can use the [{{< param cfy_agent_name >}} Packager]({{< relref "install_maintain/agents/packager.md" >}}) in case you need an agent package for other Linux platforms.

Notes:

* For Linux platforms, you must have Python installed on the image at the time of the agent installation.
  * If your image does not include Python, you can use initialization scripts supported by {{< param product_name >}} (`userdata` on OpenStack, Customization Scripts on AWS etc.) to install Python.
* For Windows, the agent installer is bundled with a Python interpreter.

## Communication with the manager

The agent requires access to the manager with these services:

1. TCP Port 53333 (REST API; HTTPS)
2. TCP Port 53229 (file server; HTTPS)
3. TCP Port 5671 (RabbitMQ; AMQP over TLS)

By default, the {{< param cfy_agent_name >}} connects to the private IP of the {{< param cfy_manager_name >}} [as specified in the Manager installation]({{< relref "install_maintain/installation/installing-manager.md" >}}). You can [change the ports]({{< relref "install_maintain/agents/installation.md" >}}) used by these services if necessary, such as in a multi-cloud environment.
