---

title: Overview
category: Agents
draft: false
weight: 100

autoscale_link: http://docs.celeryproject.org/en/latest/userguide/workers.html#autoscaling
sc_link: https://technet.microsoft.com/en-us/library/bb490995.aspx

---

Cloudify agents are entities that are installed on hosts that are part of your blueprint, and are used to communicate with Cloudify Manager.

The agents provide a way to:

* Execute operations
* Execute workflows on deployments


## Agent Packages

Cloudify includes a set of agent packages with support for:

* CentOS 6.4 / 6.5 (Python 2.6.x) and CentOS 7.x (Python 2.7.x).
* RHEL 7.x (Python 2.7.x).
* Ubuntu 12.04 / 14.04 (Python 2.7.x).
* Windows 2008, and later (Python 2.7.x).


## Installation Methods

There are several methods by which an agent can be installed, configured and started.

* The `remote` method uses SSH on Linux hosts and WinRM on Windows hosts.

* The `init_script` and `provided` methods use an initialization script that is executed on the host when it is created, which usually occurs during the `create` operation of a cloud-specific plugin. (For example, in Openstack `userdata` is used).

### Specifying the Installation Method
To specify the installation method that will be used, set the `install_method` property in the compute node `agent_config` property. For example:

```yaml
node_templates:
  my_vm:
    type: cloudify.nodes.Compute
    properties:
      agent_config:
        # one of none, remote, init_script, provided
        install_method: remote
```

#### Supported Installation Methods
The following list describes the supported installation methods:

* `none` - No agent is installed on the host.
* `remote` - An agent will be installed, using SSH on Linux hosts and WinRM on Windows hosts.
* `init_script` - An agent will be installed via a script that runs on the host when it is created. This method is only supported for specific IaaS plugins.
* `provided` - An agent is assumed to already be installed on the host image. That agent will be configured and started via a script that runs on the host when it is created. This method is only supported for specific IaaS plugins.

{{% gsNote title="Implications of Not Installing an Agent" %}}
In some cases, you cannot or prefer not to install an agent on Cloudify-managed VMs. This might be due to a security restriction, or because a VM is a pre-configured closed appliance that you cannot access or modify. 
In such cases, use `install_method: none` to configure Cloudify not to install an agent on the created VM. 
However, be aware of the following implications: 

* You will not be able to use plugins that assume execution on the agent's VM, meaning plugins that are configured with `executor=host_agent`. This includes Docker, Chef and Puppet plugins, among others. To work around this you must run bash or Python scripts using the [Fabric plugin]({{< relref "plugins/fabric.md" >}}) (for example, invoke the Puppet client from a script instead of using the Puppet plugin). 
* You will not be able to install a [Diamond monitoring agent](http://diamond.readthedocs.org/) using the [Diamond plugin]({{< relref "plugins/diamond.md" >}}) because this plugin requires an agent to run. However, you can install your own monitoring agent using a cloud init / the Fabric plugin. 
{{% /gsNote %}}


### Pre-requisites for Linux Remote Agent Installation

* SSH port (22 by default) must be open for incoming connections.
* An SSH server must be running on the host.

### Pre-requisites for Windows Remote Agent Installation

* WinRM port (5985 by default) must be open for incoming connections.
* WinRM must be enabled. Run these command in `userdata` (or something equivalent), or create an image with the following configuration:

  {{< gsHighlight  bash  >}}
  winrm quickconfig -q
  winrm set winrm/config              @{MaxTimeoutms="1800000"}
  winrm set winrm/config/winrs        @{MaxMemoryPerShellMB="300";MaxShellsPerUser="2147483647"}
  winrm set winrm/config/service      @{AllowUnencrypted="true";MaxConcurrentOperationsPerUser="4294967295"}
  winrm set winrm/config/service/auth @{Basic="true"}
  netsh advfirewall firewall add rule name="WinRM 5985" protocol=TCP dir=in localport=5985 action=allow
  {{< /gsHighlight >}}


{{% gsNote title="Note" %}}
1.  The commands above are provided in a syntax that is suitable for invocation from a command-prompt window. If you
    are using userdata (or an equivalent feature), you might need to adjust the commands to accommodate its requirements(for example:
    if these commands are to be run within a batch file, each line must be prefixed with `call`).
2.  The commands are very permisive and must adjusted according to your requirements. These settings provide
    unencrypted WinRM access to the machine. 
    From MSDN: `AllowUnencrypted` - Enables the client computer to request unencrypted traffic.
{{% /gsNote %}}

## Pre-requisites for Init Script and Provided Agent Installations

To use the `init_script` and `provided` installation methods, you must use an IaaS plugin that supports it. Currently, the Openstack and AWS plugins support these installation methods.


## Configuration Locations

Agent configuration consists of several locations that all adhere to the same schema. The schema is based on the [`cloudify.datatypes.AgentConfig` datatype](#configuration-properties), which is defined in the standard `types.yaml`.

The order in which each property is resolved is as follows:

### 1. Operation Inputs
If a property has been provided as part of the operation inputs in `agent_config` (or the depcrecated `cloudify_agent`), it is used. For example:

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


### 2. Node Instance Runtime Property
If the agent to be installed is a host agent (and not a central deployment agent), and the property is provided as part of the `cloudify_agent` node instance runtime property, it is used.


### 3. Node Property
If the agent to be installed is a host agent (and not a central deployment agent), and the property has been provided as part of the `agent_config` (or the deprecated `cloudify_agent`) node property, it is used. For example:

{{< gsHighlight  yaml  >}}
node_templates:
  my_vm:
    type: cloudify.nodes.Compute
    properties:
      agent_config:
        # configuration goes here
        user: centos
        ...
{{< /gsHighlight >}}


### 4. Bootstrap Context
If the property has been provided during bootstrap as part of the `cloudify_agent` in the Manager blueprint, it is used. For example, consider the following excerpt
from a Manager blueprint:

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

Yu can use this section to specify a global agent configuration that will apply to all installed agents. This is the only way to set deployment agents configuration.

# Configuration Properties

Name                 | Type        | Description
------------         | ----------- | -----------
`user`               | string      | For host agents, the agent will be installed for this user.
`key`                | string      | For host agents that are installed via SSH, this is the path to the private key that will be used to connect to the host. <br> In most cases, this value is derived automatically during bootstrap.
`password`           | string      | For host agents that are installed via SSH (on Linux) and WinRM (on Windows), this property can be used to connect to the host. <br> For Linux hosts, this property is optional if the `key` property is correctly configured (either explicitly or implicitly during bootstrap). <br> For Windows hosts that are installed via WinRM, this property is also optional and depends on whether the `password` runtime property has been set by the relevant IaaS plugin, prior to agent installation.
`port`               | integer     | For host agents that are installed via SSH (on Linux) and WinRM (on Windows), this is the port used to connect to the host. <br> The default values are `22` for Linux hosts and `5985` for Windows hosts.
`min_workers`        | integer     | Minimum number of agent workers. By default, the value is  `0`. See [Auto Scaling]({{< field "autoscale_link" >}}) for further details. <br> Note: For Windows-based agents, this property is ignored and `min_workers` is set to the value of `max_workers`.
`max_workers`        | integer     | Maximum number of agent workers. By default, the value is  `5`. See [Auto Scaling]({{< field "autoscale_link" >}}) for further details.
`disable_requiretty` | boolean     | For Linux based agents, disables the `requiretty` setting in the sudoers file. By default, this value is `true`.
`process_management` | dictionary  | Process management specific configuration. See [Process Management](#process-management).
`env`                | dictionary  | Optional environment variables with which the agent will be started.
`extra`              | dictionary  | Optional additional low-level configuration details.

## Extra configuration properties (that go under the `extra` property)

Name                | Type        | Description
-------------       | ----        | -----------
`distro`            | string      | Linux operation system distribution. See [Agent Package Resolution](#agent-package-resolution).
`distro_codename`   | string      | Linux operation system distribution release. See [Agent Package Resolution](#agent-package-resolution).
`package_url`       | string      | Specify an explicit URL from which to download the agent package.
`uri`               | string      | For Windows-based agents, WinRM URI. By default, the value is `wsman`.
`protocol`          | string      | For Windows-based agents, WinRM protocol. By default, the value is `http`.
`fabric_env`        | dictionary  | For Linux-based agents, configure fabric that is used to SSH into the remote host.


## Process Management

Additional configuration can be supplied to the service manager that will be used to manage the installed agent by using the `process_management` property.

### Linux init.d Process Management

Name                    | Type    | Description
-------------           | ----    | -----------
`start_on_boot`         | boolean | Specifies whether the agent service should be restarted after a system reboot. By default, the value is `true`.


### Windows NSSM Process Management

Name                    | Type    | Description
-------------           | ----    | -----------
`startup_policy`        | string  | Specifies the start type for the service. By default, the value is `auto`. See [*sc config*]({{< field "sc_link" >}}#E0UC0AA).
`failure_reset_timeout` | integer | `reset` value passed to `sc failure` during service configuration. By default, the value is 60. See [*sc failure*]({{< field "sc_link" >}}#E02B0AA).
`failure_restart_delay` | integer | Specifies delay time (in milliseconds) for the restart action. By default, the value is 5000. See [*sc failure*]({{< field "sc_link" >}}#E02B0AA)


## Linux Agent Package Resolution

In most cases, the agent package that will be used to install the agent is automatically resolved and does not require manual configuration. However, a mechanism exists that enables the implicit resolution to be overwritten. Following is a short description of the implicit resolution mechanism and details about how to override the implicit resolution with hard-coded values.

The install process attempts to identify the distribution and its release, and to deploy the correct type of agent for them.
The identification process is based on Python's `platform.dist()`. We reference the first attribute of the tuple returned by this call as `distro`, and the third attribute as `distro_codename`. For example, making this call on Ubuntu trusty returns a tuple in which the `distro` attribute is `Ubuntu` and the `distro_codename` attribute is `trusty`.
After making the call, the package name that is downloaded from the management file server is `{distro}-{distro_codename}-agent.tar.gz`, where `distro` and `distro_codename` are converted to lowercase characters. In the case of Ubuntu trusty, the package name is `ubuntu-trusty-agent.tar.gz`.

If `distro`, `distro_codename`, or `package_url` are provided explicitly in the [extra agent configuration](#extra-configuration-properties-that-go-under-the-extra-property), they will be used instead of the implicit mechanism.

# What's Next

For a more-technical explanation about agents, and how to create one, see the [Agent-Packager tool]({{< relref "agents/packager.md" >}}).
