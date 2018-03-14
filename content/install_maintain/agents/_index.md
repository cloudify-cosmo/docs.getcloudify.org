+++
title = "Agents"
description = "APIs and Customizing Blueprints and Plugins"
weight = 200
alwaysopen = false
+++

The Cloudify Agent is a component that is installed on hosts that are part of your blueprint. The Cloudify Agent communicates with Cloudify Manager.

The Agent execute orchestration operations locally, and collects metrics and report them to the Cloudify Manager.

If your blueprint does not require these functions, you can exclude the agent installation from the Cloudify Manager [installation process]({{< relref "install_maintain/agents/installation.md" >}}).

## Agent Packages

Cloudify ships with agent packages for these platforms:

* RHEL / CentOS 6.x (Python 2.6)
* RHEL / CentOS 7.x (Python 2.7)
* Ubuntu 12.x / 14.x / 16.x (Python 2.7)
* Windows 2008 and later (Python 2.7)

In addition, you can use the [Cloudify Agent Packager]({{< relref "install_maintain/agents/packager.md" >}}) in case you need an agent package for other Linux platforms.

Notes:

* For Linux platforms, you must have Python installed on the image at the time of the agent installation.
  * If your image does not include Python, you can use initialization scripts supported by Cloudify (`userdata` on OpenStack, Customization Scripts on AWS etc.) to install Python.
* For Windows, the agent installer is bundled with a Python interpreter.

## Communication with the manager

The agent requires access to the manager with these services:

1. TCP Port 53333 (REST API; HTTPS)
2. TCP Port 53229 (file server; HTTPS)
3. TCP Port 5671 (RabbitMQ; AMQP over TLS)

By default, the agent connects to the private IP of the Cloudify Manager [as specified in the Manager installation]({{< relref "install_maintain/installation/installing-manager.md" >}}). You can [change the ports]({{< relref "install_maintain/agents/installation.md" >}}) used by these services if necessary, such as in a multi-cloud environment.
