---

title: Overview
category: Agents
draft: false
weight: 100

autoscale_link: http://docs.celeryproject.org/en/latest/userguide/workers.html#autoscaling
sc_link: https://technet.microsoft.com/en-us/library/bb490995.aspx

---

The Cloudify Agent is a process that is installed on hosts that are part of your blueprint, and are used to communicate with Cloudify Manager.

The Agent's roles are:

* Execute orchestration operations locally
* Collect metrics and report them to Cloudify Manager

If your blueprint requires neither, it is possible to skip the agent's installation as well. This is covered
in the [installation]({{< relref "agents/installation.md"">}}) page.

## Agent Packages

Cloudify ships with agent packages for the following platforms:

* RHEL / CentOS 6.x (Python 2.6).
* RHEL / CentOS 7.x (Python 2.7).
* Ubuntu 12.x / 14.x / 16.x (Python 2.7).
* Windows 2008 and later (Python 2.7).

In addition, a utility called [Cloudify Agent Packager]({{< relref "agents/packager.md" >}}) is available, should you be required to create
your own agent package for any Linux platform.

Notes:

* For Linux platforms, it is required to have Python installed on the image at the time
  of agent installation.
  * If your image does not ship with Python, you may use Cloudify's support for initialization
    scripts (`userdata` on OpenStack, Customization Scripts on AWS etc.) to have Python installed.
* For Windows, the agent installer is bundled with a Python interpreter.

## Communication with the manager

The agent requires access to the manager via the following methods:

1. TCP Port 53333 (REST API; HTTPS)
2. TCP Port 53229 (file server; HTTPS)
3. TCP Port 5671 (RabbitMQ; AMQP over TLS)

By default, the agent connects to the manager's private IP [as specified
during manager installation]({{< relref "installation/installing-manager.md" >}}). This behavior is customizable, to accommodate
cases when such access is not feasible (such as a multi-cloud environment); more information can be found in the
[installation]({{< relref "agents/installation.md"">}}) page.
