---
title: Configuration
category: Agents
draft: false
weight: 20
aliases: /agents/configuration/

sc_link: https://technet.microsoft.com/en-us/library/bb490995.aspx
pywinrm_transport_link: https://github.com/diyan/pywinrm/tree/v0.3.0#valid-transport-options
---

## Configuration Locations {#configuration-locations}

Agent configuration consists of several locations that all adhere to the same schema. The schema is based on the [`cloudify.datatypes.AgentConfig` datatype](#configuration-properties), which is defined in the standard `types.yaml`.

The order in which each property is resolved is as follows:

### 1. Operation Inputs
If a property has been provided as part of the operation inputs in `agent_config` (or the deprecated `cloudify_agent`), it is used. For example:

{{< highlight  yaml  >}}
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
{{< /highlight >}}


### 2. Node Instance Runtime Property
If the Agent to be installed is a Host Agent (and not a Central Deployment Agent), and the property is provided as part of the `cloudify_agent` node instance runtime property, it is used.


### 3. Node Property
If the Agent to be installed is a host agent (and not a central deployment agent), and the property has been provided as part of the `agent_config` (or the deprecated `cloudify_agent`) node property, it is used. For example:

{{< highlight  yaml  >}}
node_templates:
  my_vm:
    type: cloudify.nodes.Compute
    properties:
      agent_config:
        # configuration goes here
        user: centos
        ...
{{< /highlight >}}

### 4. Installation Context

If the property has been provided during manager installation as part of the `agent` section in the `config.yaml` file, it is used. For example, consider the following excerpt
from a `config.yaml` file:

{{< highlight  yaml  >}}
...
agent:
  networks:
    some_network: 10.0.0.1
  min_workers: 2
  max_workers: 5
...
{{< /highlight >}}

You can use this section to specify a global agent configuration that will apply to all installed agents.

# Configuration Properties {#configuration-properties}

| NAME                   | TYPE        | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                           |
|------------------------|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `user`                 | string      | For Linux agents, this is the user account for which the Agent service will be installed. If the Agent installation method is `remote`, then this user will also be used for SSH'ing to the Agent host.<br><br>For Windows agents, this parameter is only applicable when the installation method is `remote`, and it is used by WinRM to connect to the Agent host. |
| `key`                  | string      | For Linux agents installed with the `remote` method, this may be either the path to the private key that will be used to connect to the host, or the actual private key (beginning with "`-----BEGIN RSA PRIVATE KEY-----`").                                                                                                                                        |
| `password`             | string      | For the `remote` installation method, define the password to authenticate with.<br><br>For Linux hosts, this property is optional if the `key` property is provided.<br><br>For Windows hosts, this property is also optional, depending on whether the `password` runtime property has been set by the relevant IaaS plugin, prior to Agent installation.           |
| `port`                 | integer     | For the `remote` installation method, this is the port used to connect to the host. <br> The default values are `22` for Linux hosts and `5985` for Windows hosts.                                                                                                                                                                                                   |
| `min_workers`          | integer     | Minimum number of Agent workers. By default, the value is  `0`. See [Auto Scaling]({{< field "autoscale_link" >}}) for further details. <br> Note: For Windows-based agents, this property is ignored and `min_workers` is set to the value of `max_workers`.                                                                                                        |
| `max_workers`          | integer     | Maximum number of agent workers. By default, the value is  `5`. See [Auto Scaling]({{< field "autoscale_link" >}}) for further details.                                                                                                                                                                                                                              |
| `disable_requiretty`   | boolean     | For Linux based agents, disables the `requiretty` setting in the sudoers file. By default, this value is `true`.                                                                                                                                                                                                                                                     |
| `process_management`   | dictionary  | Process management specific configuration. See [Process Management](#process-management).                                                                                                                                                                                                                                                                            |
| `network`              | string      | Optional name of the network to use when communicating with the manager. The mapping of network names to IPs/hostnames is specified [during manager installation]({{< relref "cloudify_manager/premium/aio/install_and_configure/centos_rhel.md" >}}). If not specified, the manager's `private IP` will be used.                                                    |
| `extra_env_path`       | string      | Optional path to a file (on the agent host) containing environment variables to be added to the agent's process. The file should be in the format of multiple `export KEY=VALUE` lines for Linux, or `set KEY=VALUE` for Windows.                                                                                                                                    |
| `extra`                | dictionary  | Optional additional low-level configuration details.                                                                                                                                                                                                                                                                                                                 |
| `executable_temp_path` | string      | An alternative path to use for temporary executable files (default is `/tmp`). Useful for environments where `/tmp` is mounted with `noexec` for security purposes.                                                                                                                                                                                                  |
| `log_level`            | string      | The logging level for the {{< param cfy_agent_name >}} service. Can be any of the following values: `critical`, `error`, `warning`, `info`, `debug`. The default is `debug`. The default is `info`.                                                                                                                                                                  |
| `log_max_bytes`        | integer     | Maximum size of agent log file, in bytes, before rotation takes place (default: 5\*1024\*1024 (5MB)).                                                                                                                                                                                                                                                                |
| `log_max_history`      | integer     | Number of historical log files to maintain (default: 7).                                                                                                                                                                                                                                                                                                             |
| `heartbeat`            | integer     | AMQP heartbeat interval in seconds, 0 means disabled (default: 0)                                                                                                                                                                                                                                                                                                    |

## Extra Configuration Properties (that go under the `extra` property) {#extra-configuration-properties-that-go-under-the-extra-property}

| NAME                | TYPE        | DESCRIPTION                                                                                                                                                                           |
|---------------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `distro`            | string      | Linux operation system distribution. See [Agent Package Resolution](#agent-package-resolution).                                                                                       |
| `distro_codename`   | string      | Linux operation system distribution release. See [Agent Package Resolution](#agent-package-resolution).                                                                               |
| `package_url`       | string      | Specify an explicit URL from which to download the Agent package.                                                                                                                     |
| `uri`               | string      | For Windows-based agents, WinRM URI. By default, the value is `wsman`.                                                                                                                |
| `protocol`          | string      | For Windows-based agents, WinRM protocol. By default, the value is `http`.                                                                                                            |
| `transport`         | string      | For Windows agents installed with the `remote` installation method only: defines the WinRM transport to use (valid values are outlined here: {{< field "pywinrm_transport_link" >}}). |
| `fabric_env`        | dictionary  | For Linux-based agents, configure fabric that is used to SSH into the remote host.                                                                                                    |

## Process Management

Additional configuration can be supplied to the service manager that will be used to manage the installed agent by using the `process_management` property.

### Linux init.d Process Management

| NAME            | TYPE    | DESCRIPTION                                                                                                     |
|-----------------|---------|-----------------------------------------------------------------------------------------------------------------|
| `start_on_boot` | boolean | Specifies whether the agent service should be restarted after a system reboot. By default, the value is `true`. |


### Windows NSSM Process Management

| NAME                    | TYPE    | DESCRIPTION
|-------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `startup_policy`        | string  | Specifies the start type for the service. By default, the value is `auto`. See [*sc config*]({{< field "sc_link" >}}#E0UC0AA).                                                                       |
| `failure_reset_timeout` | integer | `reset` value passed to `sc failure` during service configuration. By default, the value is 60. See [*sc failure*]({{< field "sc_link" >}}#E02B0AA).                                                 |
| `failure_restart_delay` | integer | Specifies delay time (in milliseconds) for the restart action. By default, the value is 5000. See [*sc failure*]({{< field "sc_link" >}}#E02B0AA).                                                   |
| `service_user`          | string  | Specifies the user account that the service should run with. If not specified, then `LOCALSYSTEM` is used. The format should be `DOMAIN\username`. For a local user, use a dot (`.`) for the domain. |
| `service_password`      | string  | Specifies the password for the user account specified by `service_user`. If not specified, then an empty string is used.                                                                             |

## Linux Agent Package Resolution {#agent-package-resolution}

In most cases, the Agent package that will be used to install the agent is automatically resolved and does not require manual configuration. However, a mechanism exists that enables the implicit resolution to be overwritten. Following is a short description of the implicit resolution mechanism and details about how to override the implicit resolution with hard-coded values.

The install process attempts to identify the distribution and its release, and to deploy the correct type of agent for them.
The identification process is based on Python's `platform.dist()`. We reference the first attribute of the tuple returned by this call as `distro`, and the third attribute as `distro_codename`. For example, making this call on Ubuntu trusty returns a tuple in which the `distro` attribute is `Ubuntu` and the `distro_codename` attribute is `trusty`.
After making the call, the package name that is downloaded from the management file server is `{distro}-{distro_codename}-agent.tar.gz`, where `distro` and `distro_codename` are converted to lowercase characters. In the case of Ubuntu trusty, the package name is `ubuntu-trusty-agent.tar.gz`.

If `distro`, `distro_codename`, or `package_url` are provided explicitly in the [extra agent configuration](#extra-configuration-properties-that-go-under-the-extra-property), they will be used instead of the implicit mechanism.

# Next Steps

For a more-technical explanation about agents, and how to create one, see the [Agent-Packager tool]({{< relref "cloudify_manager/agents/packager.md" >}}).
