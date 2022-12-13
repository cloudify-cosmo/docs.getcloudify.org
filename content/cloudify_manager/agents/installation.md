---
title: Installation
category: Agents
draft: false
weight: 10
aliases: /agents/installation/
---

## Installation Script

The same installation script is used in all of the installation methods.
This is either a `bash` script on Linux or a PowerShell script on Windows.
The script is agent-specific, and a separate script is rendered from a
template for each agent during the `install` workflow.
The script downloads the agent package from the manager (over port 53333),
extracts it on the agent host, creates a daemon and starts it.

## Installation Methods

There are several methods by which the installation script is distributed
to the agent host and executed.

### `remote` (default)

In this method, the installation script is pushed to the agent host, and
executed remotely using SSH on Linux hosts and WinRM on Windows hosts.
This is the default and simplest way for systems that allow SSH/ WinRM
access. The pre-requisites for remote installation are:

* For Linux, an SSH server must be running on the agent host, and
  the SSH port (22 by default) must be open for incoming connections.
* For Windows, WinRM must be enabled, and the WinRM port (5985 by
  default) must be open for incoming connections. To enable WinRM,
  the following commands must be executed on the host (e.g. in `userdata`).

  {{< highlight bash  >}}
  winrm quickconfig -q
  winrm set winrm/config              @{MaxTimeoutms="1800000"}
  winrm set winrm/config/winrs        @{MaxMemoryPerShellMB="300";MaxShellsPerUser="2147483647"}
  winrm set winrm/config/service      @{AllowUnencrypted="true";MaxConcurrentOperationsPerUser="4294967295"}
  winrm set winrm/config/service/auth @{Basic="true"}
  netsh advfirewall firewall add rule name="WinRM 5985" protocol=TCP dir=in localport=5985 action=allow
  {{< /highlight >}}

{{% note title="Note" %}}
1. The commands above are provided in a syntax that is suitable for
invocation from a command-prompt window. If using userdata (or an
equivalent feature), it might be necessary to adjust the commands to
accommodate its requirements (for example: if these commands are to be
run within a batch file, each line must be prefixed with `call`).
2. The commands are very permisive and must adjusted according to
your requirements. These settings provide unencrypted WinRM access to
the machine (from the MSDN documentation: `AllowUnencrypted` - Enables the client
computer to request unencrypted traffic).
{{% /note %}}

The output (both standard output and standard error streams) generated during the agent
installation process is accumulated in memory, and echoed to {{< param product_name >}}'s logger
once the agent installation is completed.

### `init_script`

For systems that don't have SSH/ WinRM access, `userdata`
(e.g. cloud-init) may be used. In this method, an install script is
rendered, and a temporary link pointing to it is created. This link is
then embedded in a separate download script, which is injected into
the agent host's `userdata`. When the host is booted for the first time,
the download script is executed. It downloads the installation script
from the temporary link and executes it.
To use the `init_script` method, the IaaS provider and {{< param product_name >}} plugin
need to support `userdata`. Currently, the Openstack,
AWS and AWS-SDK plugins support this installation method.

The output generated during the agent installation process is not
echoed to {{< param product_name >}}'s logger; instead, you can find it in:

* On Linux: `/var/log/cloudify/agent-install.log`
* On Windows: `%AppData%\cloudify-agent-install.log` (where `%AppData%` resolves based on the user account
that runs the initialization script)

### `plugin`

For systems that have neither SSH/ WinRM access, nor
the ability to inject a script into userdata, the `plugin` installation
method allows implementing a custom way to download and execute the
installation script. In this method, a temporary download link for the
installation script is created and made available to the plugin using
the `ctx`. It is up to the plugin's developer then to implement a custom
method for downloading and executing the installation script on the
agent's host.

### `provided`

For systems that require the agent to be embedded in the
image, users can use the `provided` method. In this mode, it is up to
the user to make sure the agent is **already installed** on the image.<br>
During the `install` workflow, a configuration script will be rendered
and a temporary link to it will created and made available
via {{< param product_name >}}'s logs (reading the logs is the only way to retrieve
the temporary link). This script is
similar to the installation script, except that it doesn't download or
install the agent package, but only configures and starts the agent
daemon. This script needs to be downloaded and executed manually for
every agent.

#### Provided Agent Step-by-Step-Guide

For the purposes of this example we will be using a manager IP of _192.0.2.4_
and deploying an agent for the node with node instance ID _container_nwxqiu_.

1. Prepare a Virtual Machine or Image with a custom agent. Either Prepare
   a custom agent or just upload an agent archive from:
   `https://192.0.2.4:53333/resources/packages/agents/` <br>
1. Install the blueprint:
    ```yaml
    node_templates:
      server:
        type: cloudify.nodes.Compute
        properties:
          agent_config:
            install_method: provided
            user: centos
    ```
1. Find out the node instance name using `cfy node-instances list` in the 
   CLI, or through the **Deployments** -> **Deployment Info** -> **Deployment 
   Nodes**  widget in the UI:   
   ![Node instance]( /images/manager/agent_installation/node_instance.webp )
1. Get the configuration script link from the runtime properties of the 
   node instance, or form the deployment logs:    
   ![Script in logs]( /images/manager/agent_installation/logs_script.webp )
1. Login to the agent's VM.
1. Prepare the agent directory
   ```shell
   sudo mkdir -p /opt/cloudify-agent-6.3.0/
   sudo chown $(whoami) /opt/cloudify-agent-6.3.0/
   mkdir -p /opt/cloudify-agent-6.3.0/container_nwxqiu/cloudify/ssl
   ```
1. Untar the archive to a folder with the same as the node instance. 
   ("container_nwxqiu" in the above example):
   ```shell
   tar xzfv centos-core-agent.tar.gz --strip=1 -C /opt/cloudify-agent-6.3.0/container_nwxqiu
   ```
1. Download the configuration script using the link from step 4:
   ```shell
   wget --no-check-certificate --user admin --password admin https://192.0.2.4:53333/resources/cloudify_agent/3631bbc3-fc37-4a9f-9db3-81adb2d8e182.sh
   ```
1. The script doesn't copy the SSL certificate, so just do it manually &mdash;
   copy *cloudify_internal_ca_cert.pem* from the manager into
   `/opt/cloudify-agent-6.3.0/container_nwxqiu/cloudify/ssl/cloudify_internal_cert.pem` in the
   VM, e.g. using `scp`.
1. Run the downloaded script:
   ```shell
   chmod 700 3631bbc3-fc37-4a9f-9db3-81adb2d8e182.sh
   sudo ./3631bbc3-fc37-4a9f-9db3-81adb2d8e182.sh
   ```
   
The Agent has now joined to the {{< param product_name >}} Manager.
<u>Note:</u> It is recommended to automate the above steps if used often. 

### `none`

In some cases, the user cannot or prefers not to install an Agent
on {{< param product_name >}}-managed VMs. This might be due to a security restriction,
or because a VM is a pre-configured closed appliance that the user cannot
access or modify.

This has the following implication:

* It is not possible to run operations that have the `executor` field set to `host_agent` (such as the Script plugin). In the case of script invocation, a workaround would be to use the [Fabric plugin]({{< relref "working_with/official_plugins/Configuration/fabric.md" >}}) (which runs scripts or commands by establishing an SSH connection and running scripts or commands through that).

### Specifying the Installation Method

To specify the installation method that will be used, set the `install_method` key in the `agent_config` structure.
This can be done in various ways, as described in the [agent configuration documentation]({{< ref "cloudify_manager/agents/configuration.md#configuration-locations" >}}).

For example, you can set the `install_method` as a property on the compute node's template as follows:

```yaml
node_templates:
  my_vm:
    type: cloudify.nodes.Compute
    properties:
      agent_config:
        install_method: remote
```
