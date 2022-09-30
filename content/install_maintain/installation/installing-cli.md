---
title: Command Line Interface (CLI) Installation
description: Communicate with your Cloudify Manager installation using Cloudify CLI.
category: Installation
draft: false
weight: 55
aliases: /installation/uninstall-cloudify-cli/
---
## Installing the {{< param cfy_cli_name >}}

To remotely connect to {{< param cfy_manager_name >}}, you can install the {{< param product_name >}} Command Line Interface (CLI) on a separate host. The {{< param cfy_cli_name >}} includes all of the commands necessary to run any actions on {{< param cfy_manager_name >}}.

{{% note title="Manager local CLI" %}}
The CLI is deployed by default on the {{< param cfy_manager_name >}}. When connected to the manager via SSH, CLI commands can be executed locally without deploying the CLI.
{{% /note %}}

After you download the {{< param cfy_cli_name >}} installation package, the installation process does not require an active internet connection.

### Installing on Linux

To install {{< param cfy_cli_name >}} on Linux, you could use either a single file binary, a RPM
package and a DEB package.

#### Single file binary installation
To install a single file binary on your machine, run the following command:
{{< highlight bash >}}
$ curl -sfL https://cloudify.co/get-cli | sh -
{{< /highlight >}}

This will execute a script which will:
  * determine if your machine meets the requirements:
    - has a `x86_64` architecture,
    - has `curl`, `sudo` and one of the three: `openssl`, `shasum` or `sha256sum` binaries available,
  * download the binary {{< param cfy_cli_name >}}, verify its integrity and install it as
    `/usr/local/bin/cfy`,
  * create CLI auxiliary directories for the current user.

#### Installation from the packages

1. [Download]({{< relref "/trial_getting_started/set_trial_manager/other-deployments.md" >}}) the installation package for your package management system, either RPM or DEB.
2. To install from the CLI on the host, run the command for your operating system.

    ##### Centos/RHEL
    {{< highlight bash>}}
    $ sudo rpm -i <pkg.rpm>
    {{< /highlight >}}
    Where `<pkg.rpm>` is the path to the installation file.

    ##### Debian/Ubuntu
    {{< highlight bash>}}
    $ sudo dpkg -i <pkg.deb>
    {{< /highlight >}}
    Where `<pkg.deb>` is the path to the installation file.

### Installing on Mac OSX

To install {{< param cfy_cli_name >}} on Mac OSX, you could use either a single file binary, or
Python's `pip`.

#### Single file binary installation
To install a single file binary on your machine, run the following command.
{{< highlight bash >}}
$ curl -sfL https://cloudify.co/get-cli | sh -
{{< /highlight >}}

This will execute the script which will:
  * determine if your machine meets the requirements:
    - has either `x86_64` or `arm64` architecture,
    - has `curl`, `sudo` and one of the three: `openssl`, `shasum` or `sha256sum` binaries available,
  * download the binary {{< param cfy_cli_name >}}, verify its integrity and install it as
    `/usr/local/bin/cfy`,
  * create CLI auxiliary directories for the current user.

#### Installation from PyPI (Python Package Index)

1. Install the package using python package manager:
    {{< highlight bash>}}
    $ sudo pip install cloudify=<{{< param product_name >}} version, for example: 6.4.0>
    {{< /highlight >}}

### Installing on Windows

The Windows installer is a single executable that installs these components:

* Python 2.7.x
* Pip
* Virtualenv
* {{< param cfy_cli_name >}}

{{% note title="Installation Note" %}}
If the Python installation shows an error, install make sure that [Microsoft Visual C++ 2008 Redistributable](https://www.microsoft.com/en-us/download/details.aspx?id=29) is installed.
{{% /note %}}

{{% note title="Installing Python and Pip" %}}
The Python setup wizard prompts you to choose to install pip. If you choose not to install pip, it is installed anyway because it is required by the {{< param product_name >}} environment.
{{% /note %}}

{{% note title="Windows Defender" %}}
Windows security tools may identify the {{< param cfy_cli_name >}} as an unrecognized app. If this happens, select the "more info" option and then click "Run anyway".
{{% /note %}}

To install {{< param cfy_cli_name >}} on Windows:

1. [Download]({{< relref "/trial_getting_started/set_trial_manager/other-deployments.md" >}}) the EXE installation package for Windows.
2. Run the installer and respond to the prompts in the installation wizard.

## Uninstalling the {{< param cfy_cli_name >}}

When you uninstall the {{< param cfy_cli_name >}}, you only remove the CLI from the local host. This process does not change the configurations on the {{< param cfy_manager_name >}} that you used the CLI to connect to.

{{% note title="Uninstallation Note" %}}
The Python, pip or Virtualenv packages are not removed when you remove the {{< param cfy_cli_name >}} package.
{{% /note %}}

### Uninstalling from Linux

#### Single file binary installation

To uninstall the CLI which was installed as a single file binary, just remove it with
{{< highlight bash>}}
$ sudo rm /usr/local/bin/cfy
{{< /highlight >}}

#### Installation from the packages

To uninstall the CLI from the host, run the command for your operating system.

##### Centos/RHEL
{{< highlight bash>}}
$ sudo rpm -e cloudify
{{< /highlight >}}

##### Debian/Ubuntu
{{< highlight bash>}}
$ sudo dpkg -r cloudify
{{< /highlight >}}

### Uninstalling from Mac

#### Single file binary installation

To uninstall the CLI which was installed as a single file binary, just remove it with
{{< highlight bash>}}
$ sudo rm /usr/local/bin/cfy
{{< /highlight >}}

#### Installation from PyPI (Python Package Index)

To uninstall the CLI from the host, run:

{{< highlight bash>}}
$ pip uninstall cloudify
{{< /highlight >}}

### Uninstalling from Windows

To uninstall the CLI from the host:

1. Go to the Control Panel and open **Apps**.
1. Select **{{< param cfy_cli_name >}}** and click **Uninstall**.
