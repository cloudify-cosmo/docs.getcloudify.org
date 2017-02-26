---
layout: bt_wiki
title: Installation Using Packages for Common OS Distributions
category: Installation
draft: false
weight: 200

---

Cloudify packages significantly reduce the initial complexity of the installation process and are the recommended way of installing for new users.

This installation method does not require an active internet connection during
the installation process.

## Linux

1. [Download the installer](http://getcloudify.org/downloads/get_cloudify_3x.html) that is appropriate to your operating system and installation preference, either user interface or terminal-based.
2. Select one of the following installation options:   
   * To install from a user interface, double-click the IU installation file you downloaded.<br>
   * To install using terminal commands, run the command appropriate to your operating system.     

     ##### Centos/RHEL

     {{< gsHighlight bash>}}
     $ sudo rpm -i <_pkg.rpm_>
     {{< /gsHighlight >}}

    replacing `<_pkg.rpm_>` with the path of the installation file you downloaded.


    ##### Debian/Ubuntu

    {{< gsHighlight bash>}}
    $ sudo dpkg -i <_pkg.deb_>
    {{< /gsHighlight >}}

    replacing `<_pkg.deb_>` with the path of the installation file you downloaded.

## Windows

The Windows installer is a single executable that installs the following:

* Python 2.7.x
* Pip
* Virtualenv
* Cloudify

{{% gsNote title="Installation Prerequisites" %}}
Python installation requires [Microsoft Visual C++ 2008 Redistributable](https://www.microsoft.com/en-us/download/details.aspx?id=29). Install it if you encounter an error during the Python installation.
{{% /gsNote %}}

{{% gsNote title="Installing Python and Pip" %}}
The Python setup wizard, will prompt you to select whether to install pip. Regardless of your choice, pip isinstalled in the following steps because it is required by the Cloudify environment.
{{% /gsNote %}}


##### Install on Windows

1. [Download the installer](http://getcloudify.org/downloads/get_cloudify_3x.html) appropriate to your Windows environment.
2. Run the installer, following the prompts in the installation.

##### To uninstall Cloudify

1. Open **Programs** from the **Control Panel**.
2. Select **Cloudify CLI**, then click **Uninstall**.

{{% gsNote title="Uninstalling Python" %}}
Uninstalling the package does not remove Python, pip and Virtualenv, regardless of whether
they were installed during the installation process. You must decide whether to uninstall these components.

To uninstall Python, follow the same uninstall process as described above, selecting **Python** instead of **Cloudify CLI**.
{{% /gsNote %}}


## OS X

An OS X installer will be provided in the future. For now, you can use the [script]({{< relref "installation/from-script.md" >}}) to install Cloudify on OS X.
