---
layout: bt_wiki
title: Installing and Uninstalling the Cloudify CLI
category: Installation
draft: false
weight: 200

---
## Installing the Cloudify CLI

To remotely connect to Cloudify Manager, you can install the Cloudify Command Line Interface (CLI) on a separate host. The Cloudify CLI includes all of the commands that you require to do any actions on Cloudify Manager.

After you download the Cloudify CLI installation package, the installation process does not require an active internet connection.

### Installing on Linux

To install Cloudify CLI on Linux:

1. [Download](http://cloudify.co/downloads/get_cloudify.html) the installation package for your package management system, either RPM or DEB.
1. To install from the CLI on the host, run the command for your operating system.
     
    #### Centos/RHEL
    {{< gsHighlight bash>}}
    $ sudo rpm -i <pkg.rpm>
    {{< /gsHighlight >}}     
    Where `<pkg.rpm>` is the path to the installation file.

    #### Debian/Ubuntu
    {{< gsHighlight bash>}}
    $ sudo dpkg -i <pkg.deb>
    {{< /gsHighlight >}}     
    Where `<pkg.deb>` is the path to the installation file.

### Installing on Mac OSX

To install Cloudify CLI on Mac OSX:

1. [Download](http://cloudify.co/downloads/get_cloudify.html) the OSX installation package.
1. Install the package with Installer or from the CLI:
   
    #### Installer
    Double click the file to open the Installer. If you need 'Open With', open the Installer app located in your Utilities folder.
   
    #### CLI
    {{< gsHighlight bash>}}
    $ sudo installer -pkg <pkg.pkg> -target /
    {{< /gsHighlight >}}    
    Where `</path/to/pkg.pkg>` is the path to the installation file.
     
### Installing on Windows

The Windows installer is a single executable that installs these components:

* Python 2.7.x
* Pip
* Virtualenv
* Cloudify

{{% gsNote title="Installation Note" %}}
If the Python installation shows an error, install make sure that [Microsoft Visual C++ 2008 Redistributable](https://www.microsoft.com/en-us/download/details.aspx?id=29) is installed.
{{% /gsNote %}}

{{% gsNote title="Installing Python and Pip" %}}
The Python setup wizard prompts you to choose to install pip. If you choose not to install pip, it is installed anyway because it is required by the Cloudify environment.
{{% /gsNote %}}

To install Cloudify CLI on Windows:

1. [Download](http://cloudify.co/downloads/get_cloudify.html) the EXE installation package for Windows.
1. Run the installer and respond to the prompts in the installation wizard.

## Uninstalling the Cloudify CLI

When you uninstall the Cloudify CLI, you only remove the CLI from the local host. This process does not change the configurations on the Cloudify Managers that you used the CLI to connect to.

{{% gsNote title="Uninstallation Note" %}}
When you uninstall the Cloudify CLI package, the Python, pip or Virtualenv packages are not removed.
{{% /gsNote %}}

### Uninstalling from Linux

To uninstall the CLI from the host, run the command for your operating system.
     
    #### Centos/RHEL
     {{< gsHighlight bash>}}
     $ sudo rpm -e cloudify
     {{< /gsHighlight >}}
     
    #### Debian/Ubuntu
    {{< gsHighlight bash>}}
    $ sudo dpkg -r cloudify
    {{< /gsHighlight >}}
    
### Uninstalling from Mac

To uninstall the CLI from the host, run:
{{< gsHighlight bash>}}
     $ pkgutil --unlink test.gigaspaces.pkg.cloudify
     $ pkgutil --forget test.gigaspaces.pkg.cloudify
     {{< /gsHighlight >}} 

### Uninstalling from Windows

To uninstall the CLI from the host:

1. Go to the Control Panel and open **Apps**.
1. Select **Cloudify CLI** and click **Uninstall**.