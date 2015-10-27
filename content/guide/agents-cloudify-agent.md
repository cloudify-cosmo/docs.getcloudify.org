---

title: Cloudify Agent
category: Agents
publish: true
abstract: "Description of the Cloudify Agent installation and configuration"
pageord: 220

terminology_link: reference-terminology.html
agent_packager_link: agents-packager.html

autoscale_link: http://docs.celeryproject.org/en/latest/userguide/workers.html#autoscaling
sc_link: https://technet.microsoft.com/en-us/library/bb490995.aspx

---

{{% gsSummary %}} {{% /gsSummary %}}

# Overview

Cloudify Agents are entities installed on hosts that are part of your [blueprint]({{page.terminology_link}}#blueprint).

{{% gsNote title="Note" %}}
Some agents are actually also installed outside the scope of a specific host, but usually you wont need to bother
with these agents.
**See the [Terminology page]({{page.terminology_link}}#agent) for a more elaborate explanation on each type of agent.**

{{% /gsNote %}}


Agents are basically a piece of software used for communicating with Cloudify's Manager.

Cloudify's agents provide a way to:

* Execute general [operations]({{page.terminology_link}}#operation). ([Deployment Agents]({{page.terminology_link}}#deployment-agent))
* Execute [operations]({{page.terminology_link}}#operation) on specific hosts. ([Host Agents]({{page.terminology_link}}#host-agent))
* Execute [workflows]({{page.terminology_link}}#workflow) on [deployments]({{page.terminology_link}}#deployment) ([Workflow Agents]({{page.terminology_link}}#workflow-agent))


# Provided Agent Packages

Cloudify comes with a set of pre-made agent packages:

* Centos Agent - Centos/REHL with Python 2.6.x (Tested on Centos 6.4/5, and REHL 7.0)
* Ubuntu Precise Agent - Ubuntu 12.04 with Python 2.7.x (Might work on Debian, but untested)
* Ubuntu Trusty Agent - Ubuntu 14.04 with Python 2.7.x (Might work on Debian, but untested)
* Windows Agent - Windows 2008+ with Python 2.7.x

# Installation Methods

There are several methods by which an agent can be installed, configured and started.

The `remote` method uses SSH on linux hosts and WinRM on windows hosts.
The `init_script` and `provided` methods make use of an initialization script that gets executed on the host when it gets created; This usually takes place during the `create` operation of the cloud specific plugin used (e.g. in Openstack, `userdata` is used).

To configure which installation method will be used, set the `install_method` property in the compute node `agent_config` property. For example:

{{< gsHighlight  yaml  >}}
node_templates:
  my_vm:
    type: cloudify.nodes.Compute
    property:
      agent_config:
        # one of none, remote, init_script, provided
        install_method: remote
{{< /gsHighlight >}}

Following are all the supported installation methods:

* `none` - No agent will be installed on the host.
* `remote` - An agent will be installed using SSH on linux hosts and WinRM on windows hosts.
* `init_script` - An agent will be installed via a script that will run on the host when it gets created. This method is only supported for specific IaaS plugins.
* `provided` - An agent is assumed to already be installed on the host image. That agent will be configured and started via a script that will run on the host when it gets created. This method is only supported for specific IaaS plugins.


## Pre-requisites for Linux Remote Agent Installation

* SSH port (22 by default) should be open for incoming connections.
* An SSH server should be running on the host.

## Pre-requisites for Windows Remote Agent Installation

* WinRM port (5985 by default) should be open for incoming connections.
* WinRM should be enabled. Run these command in userdata (or something equivalent) or create an image with this configuration:

{{< gsHighlight  bash  >}}
winrm quickconfig -q
winrm set winrm/config              '@{MaxTimeoutms="1800000"}'
winrm set winrm/config/winrs        '@{MaxMemoryPerShellMB="300";MaxShellsPerUser="2147483647"}'
winrm set winrm/config/service      '@{AllowUnencrypted="true";MaxConcurrentOperationsPerUser="4294967295"}'
winrm set winrm/config/service/auth '@{Basic="true"}'
&netsh advfirewall firewall add rule name="WinRM 5985" protocol=TCP dir=in localport=5985 action=allow
{{< /gsHighlight >}}

{{% gsNote title="Note" %}}
Note that the previous commands are very permisive and should adjusted according to your requirements.

These settings provide unencrypted WinRM access to the machine. We're working on adding Kerberos support.
From MSDN: AllowUnencrypted - Allows the client computer to request unencrypted traffic.
{{% /gsNote %}}

## Pre-requisites for Init Script and Provided Agent Installations

To use the `init_script` and `provided` installation methods, an IaaS plugin that supports it should be used. At the moment, only the openstack plugin supports
these installation methods.


# Configuration Locations

Agent configuration is composed of several locations which all adhere to the same schema. The schema is based on the [`cloudify.datatypes.AgentConfig` datatype](#configuration-properties) which is defined in the standard `types.yaml`.

The order in which each property gets resolves is as follows:

## 1. Operation Inputs
If a property has been provided as part of the operation inputs in `agent_config` (or the depcrecated `cloudify_agent`) it will be used. For example:

{{< gsHighlight  yaml  >}}
node_templates:
  my_vm:
    type: cloudify.nodes.Compute
    interfaces:
      cloudify.interfaces.cloudify_agent:
        create:
          inputs:
            agent_config:
              # configuration goes here
              user: centos
              ...
{{< /gsHighlight >}}


## 2. Node Instance Runtime Property
If the agent to be installed is a host agent (and not a central deployment agent) and the propery has been provided as part of the `cloudify_agent` node instance runtime property, it will be used.


## 3. Node Property
If the agent to be installed is a host agent (and not a central deployment agent) and the propery has been provided as part of the `agent_config` (or the deprecated `cloudify_agent`) node property, it will be used. For example:

{{< gsHighlight  yaml  >}}
node_templates:
  my_vm:
    type: cloudify.nodes.Compute
    property:
      agent_config:
        # configuration goes here
        user: centos
        ...
{{< /gsHighlight >}}


## 4. Bootstrap Context
If the property has been provided during bootstrap as part of the `cloudify_agent` in the manager blueprint, it will be used. For example, consider the following excerpt
from a manager blueprint:

{{< gsHighlight  yaml  >}}
...
node_templates:
  manager_configuration:
    type: cloudify.nodes.MyCloudifyManager
    properties:
      ...
      cloudify:
        ...
        cloudify_agent:
          # configuration goes here
          user: centos
          ...
...
{{< /gsHighlight >}}

This section can be used to set global agent configuration that will apply to all installed agents. This sections is especially useful when deployment agents configuration is required as this is currently the only way to do so.

# Configuration Properties

Name                 | Type        | Description
------------         | ----------- | -----------
`user`               | string      | For host agents, the agent will be installed for this user.
`key`                | string      | For host agents that are installed via SSH, this is the path to the private key that will be used to connect to the host. <br> In most cases, this value will be derived automatically during bootstrap.
`password`           | string      | For host agents that are installed via SSH (on linux) and WinRM (on windows) this property can be used to connect to the host. <br> For linux hosts, this property is optional in case the `key` property is properly configured (either explicitly or implicitly during bootstrap). <br> For windows hosts that are installed via WinRM, this property is also optional and depends on whether the `password` runtime property has been set by the relevant IaaS plugin, prior to the agent installation.
`port`               | integer     | For host agents that are installed via SSH (on linux) and WinRM (on windows), this is the port used to connect to the host. <br> The default values are `22` for linux hosts and `5985` for windows hosts.
`min_workers`        | integer     | Minimum number of agent workers. By default, the value will be  `0`. See [Auto Scaling]({{page.autoscale_link}}) for further details. <br> Note: For windows based agents, this property is ignored and `min_workers` is set to the value of `max_workers`.
`max_workers`        | integer     | Maximum number of agent workers. By default, the value will be  `5`. See [Auto Scaling]({{page.autoscale_link}}) for further details.
`disable_requiretty` | boolean     | For linux based agents, disables the `requiretty` setting in the sudoers file. By default, this value will be `true`.
`process_management` | dictionary  | Process management specific configuration. See [Process Management](#process-management).
`env`                | dictionary  | Optional environment variables that the agent will be started with.
`extra`              | dictionary  | Optional additional low level configuration details.

## Extra configuration properties (that go under the `extra` property)

Name                | Type        | Description
-------------       | ----        | -----------
`distro`            | string      | Linux operation system distribution. See [Agent Package Resolution](#agent-package-resolution).
`distro_codename`   | string      | Linux operation system distribution release. See [Agent Package Resolution](#agent-package-resolution).
`package_url`       | string      | Specify an explicit URL to download the agent package from.
`uri`               | string      | For windows based agents, WinRM URI. By default, the value will be `wsman`.
`protocol`          | string      | For windows based agents, WinRM protocol. By default, the value will be `http`.
`fabric_env`        | dictionary  | For linux based agents, configure fabric which is used to SSH into the remote host.


## Process Management

Additional configuration may be supplied to the service manager that will be used to manage the installed agent by using the `process_management` property.

### Linux init.d Process Management

Name                    | Type    | Description
-------------           | ----    | -----------
`start_on_boot`         | boolean | Specifies whether the agent service should be restarted after a system reboot. By default, the value will be `true`.


### Windows NSSM Process Management

Name                    | Type    | Description
-------------           | ----    | -----------
`startup_policy`        | string  | Specifies the start type for the service. By default, the value will be `auto`. See [*sc config*]({{page.sc_link}}#E0UC0AA).
`failure_reset_timeout` | integer | `reset` value passed to `sc failure` during service configuration. By default, the value will be 60. See [*sc failure*]({{page.sc_link}}#E02B0AA).
`failure_restart_delay` | integer | Specifies delay time (in milliseconds) for the restart action. By default, the value will be 5000. See [*sc failure*]({{page.sc_link}}#E02B0AA)


## Linux Agent Package Resolution

In most cases, the agent package that will be used to install the agent is automatically resolved and should not be configured manually. However, there exists a mechanism to override the implicit resolution. What follows is a short description of the implicit resolution mechanism and details on how to override the implicit resolution with hard coded values.

The install process will try to identify the distribution and its release and deploy the correct type of agent for them.
The identification process is based python's `platform.dist()`. We will reference the first attribute of the tuple returned by this call as `distro` and the third attribute as `distro_codename`. For example, making this call on Ubuntu trusty will return a tuple in which the `distro` attribute is `Ubuntu` and the `distro_codename` attribute is `trusty`.
After making this call, the package name that will be downloaded from the management file server is `{distro}-{distro_codename}-agent.tar.gz` where `distro` and `distro_codename` are converted to lowercase. In the case of Ubuntu trusty, the package name will be `ubuntu-trusty-agent.tar.gz`.

If `distro`, `distro_codename`, or `package_url` are provided explicitly in the [extra agent configuration](#extra-configuration-properties-that-go-under-the-extra-property), they will be used instead of the implicit mechanism.

# What's Next

For a more elaborate and technical explanation on agents, and how to create one, please refer to the the [Agent-Packager tool]({{page.agent_packager_link}}).
