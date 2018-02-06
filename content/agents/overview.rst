Overview
%%%%%%%%

Cloudify agents are entities that are installed on hosts that are part
of your blueprint, and are used to communicate with Cloudify Manager.

The agents provide a way to:

-  Execute operations
-  Execute workflows on deployments

Agent Packages
--------------

Cloudify includes a set of agent packages with support for:

-  CentOS 6.4 / 6.5 (Python 2.6.x) and CentOS 7.x (Python 2.7.x).
-  RHEL 7.x (Python 2.7.x).
-  Ubuntu 12.04 / 14.04 (Python 2.7.x).
-  Windows 2008, and later (Python 2.7.x).

Communication with the manager
------------------------------

The agents communicate with the manager over two channels: 1. HTTPS on
port 53333 - REST API 2. AMQP over TLS on port 5671 - RabbitMQ

By default, the agent connects to the manager’s private IP [as specified
during manager installation]({{< relref
“installation/installing-manager.md” >}}). It is possible to define
other IPs/hostnames during the manager installation in the agent section
in the config.yaml file.
