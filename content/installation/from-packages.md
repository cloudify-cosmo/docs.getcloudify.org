---
layout: bt_wiki
title: Installing the Cloudify Command Line Interface
category: Installation
draft: false
weight: 200

---

You install the CLI by downloading and installing a Cloudify package. Cloudify packages significantly reduce the initial complexity of the installation process.

This installation method does not require an active internet connection during
the installation process.

## Linux

1. [Download the installer](http://getcloudify.org/downloads/get_cloudify_3x.html) that is appropriate to your operating system and installation preference, either user interface or terminal-based.
2. Select one of the following installation options:   
   * To install from a user interface, double-click the UI installation file you downloaded.<br>
   * To install using terminal commands, run the command appropriate to your operating system.     <br>

     
    #### Centos/RHEL

     {{< gsHighlight bash>}}
     $ sudo rpm -i <_pkg.rpm_>
     {{< /gsHighlight >}}     

     replacing `<pkg.rpm>` with the path of the installation file you downloaded.


    #### Debian/Ubuntu

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
The Python setup wizard, will prompt you to select whether to install pip. Regardless of your choice, pip is installed as part of the Cloudify installation because it is required by the Cloudify environment.
{{% /gsNote %}}


##### Install on Windows

1. [Download the installer](http://getcloudify.org/downloads/get_cloudify_3x.html) appropriate to your Windows environment.
2. Run the installer, following the prompts in the installation.

