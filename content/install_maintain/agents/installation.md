---

title: Installation
category: Agents
draft: false
weight: 120

autoscale_link: http://docs.celeryproject.org/en/latest/userguide/workers.html#autoscaling
sc_link: https://technet.microsoft.com/en-us/library/bb490995.aspx

---

## Installation script

The same installation script is used in all of the installation methods.
This is either a `bash` script on Linux or a `powershell` script on Windows.
The script is agent-specific, and a separate script is rendered from a
template for each agent during the `install` workflow.
The script downloads the agent package from the manager (over port 53333),
extracts it on the agent host, creates a daemon and starts it.

## Installation methods

There are several methods by which the installation script is distributed
to the agent host and executed.

### `remote` (default)

In this method, the installation script is pushed to the agent host, and
executed remotely using SSH on Linux hosts and WinRM on Windows hosts.
This is the default and simplest way for systems that allow SSH/WinRM
access. A pre-requisite for remote installation is:

* For Linux, an SSH server must be running on the agent host, and
  the SSH port (22 by default) must be open for incoming connections.
* For Windows, WinRM must be enabled, and the WinRM port (5985 by
  default) must be open for incoming connections. To enable WinRM,
  the following commands must be executed on the host (e.g. in `userdata`).

  {{< highlight  bash  >}}
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
the machine. From MSDN: `AllowUnencrypted` - Enables the client computer
to request unencrypted traffic.
{{% /note %}}

### `init_script`

For systems that don't have SSH/WinRM access, userdata
(e.g. cloud-init) may be used. In this method, an install script is
rendered, and a temporary link pointing to it is created. This link is
then embedded in a separate `download script`, which is injected into
the agent host's userdata. When the host is booted for the first time,
the download script is executed. It downloads the installation script
from the temporary link and executes it.
To use the `init_script` method, the IaaS provider and Cloudify plugin
need to support userdata. Currently, the Openstack
and AWS plugins support this installation method.

### `plugin`

For systems that have neither SSH/WinRM access, nor
the ability to inject a script into userdata, the `plugin` installation
method allows implementing a custom way to download and execute the
installation script. In this method, a temporary download link for the
installation script is created and made available to the plugin using
the `ctx`. It is upt to the plugin developer then to implement a custom
method for downloading and executing the installation script on the
agent's host.

### `provided`

For systems that require the agent to be embedded in the
image, users can use the `provided` method. In this mode, it is up to
the user to make sure the agent is already installed on the image.
During the `install` workflow, a configuration script will be rendered
and a temporary link to it will created and made available
via Cloudify's logs (reading the logs is the only way to retrieve
the temporary link). This script is
similar to the installation script, except that it doesn't download or
install the agent package, but only configures and starts the agent
daemon. This script needs to be downloaded and executed manually for
every agent.

### `none`

In some cases, the user cannot or prefers not to install an agent
on Cloudify-managed VMs. This might be due to a security restriction,
or because a VM is a pre-configured closed appliance that the user cannot
access or modify.
This has the following implications:

* It will not be possible to use plugins that assume execution on the agent's VM, meaning plugins that are configured with `executor=host_agent`. This includes Docker, Chef and Puppet plugins, among others. To work around this you must run bash or Python scripts using the [Fabric plugin]({{< relref "developer/official_plugins/fabric.md" >}}) (for example, invoke the Puppet client from a script instead of using the Puppet plugin).
* It will not be possible to install a [Diamond monitoring agent](http://diamond.readthedocs.org/) using the [Diamond plugin]({{< relref "developer/official_plugins/diamond.md" >}}) because this plugin requires an agent to run. However, you can install your own monitoring agent using a cloud-init / the Fabric plugin.

### Specifying the Installation Method

To specify the installation method that will be used, set the `install_method` property in the compute node `agent_config` property. For example:

```yaml
node_templates:
  my_vm:
    type: cloudify.nodes.Compute
    properties:
      agent_config:
        # one of none, remote, init_script, provided, plugin
        install_method: remote
```
