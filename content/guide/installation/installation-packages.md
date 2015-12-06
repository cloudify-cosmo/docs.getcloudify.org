---
layout: bt_wiki
title: Installing using packages
category: Installation
publish: true
weight: 200

---

Compiled binaries are provided for Windows and RHEL based distributions. You can use these to easily install Cloudify.

## Windows

The Windows installer is a single executable which performs the following (offline) installation:

* Installs Python 2.7.x
* Installs pip
* Installs Virtualenv
* Installs cfy

{{% gsNote title="Installing Prerequisites" %}}
If Python is not already installed, the executable will attempt to install it. During Python's installation you will be able to choose different installation options such as installing pip, adding the python executable to the path, and so on. If you choose, for instance, to not install pip and continue with the installation, you will be notified that you must install pip and it will be installed for you. The same goes for virtualenv.

Python's installation requires a specific Microsoft Visual C++ 2008 Redistributable Package provided [here](https://www.microsoft.com/en-us/download/details.aspx?id=29). Install it if you stumble upon an error during the Python installation.
{{% /gsNote %}}

{{% gsNote title="Installation Environment" %}}
Note that a virtualenv will be automatically created during installation and Cloudify's CLI will be installed within it.
{{% /gsNote %}}

To install on Windows:

* Download the installer from the [Downloads page](http://getcloudify.org/downloads/get_cloudify_3x.html) corresponding with the version you would like to install.
* Run the executable installer.
* Follow the installation instructions.
* When the installation is finished, double click the new Cloudify icon on your desktop.

After the installation is complete, try running `cfy -h` in your terminal.

{{% gsNote title="Uninstall" %}}
Note that uninstalling the package will not remove Python, pip and Virtualenv whether they were or were not installed during the installation process.
{{% /gsNote %}}


## Linux

To install via rpm packages, you must have Python2.7.x and pip 1.5+ installed and Python2.7.x must be executable as `python` from the path.

### Centos/RHEL

* Download the installer from the [Downloads page](http://getcloudify.org/downloads/get_cloudify_3x.html) corresponding with the version you would like to install.
* Open a terminal at the directory where you downloaded the file.
* Run (replacing `<pkg.rpm>` with the path to the file you downloaded):

{{< gsHighlight  bash  >}}
$ sudo rpm -i <pkg.rpm>
$ source /opt/cfy/env/bin/activate
...
{{< /gsHighlight >}}

After the installation is complete, try running `cfy -h` in your terminal.

### Debian/Ubuntu

Debian based packages will be provided in the future. For now, you can use the [script](installation-script.html) to install Cloudify on Debian/Ubuntu.


## OS X

OS X based packages will be provided in the future. For now, you can use the [script](installation-script.html) to install Cloudify on OS X.