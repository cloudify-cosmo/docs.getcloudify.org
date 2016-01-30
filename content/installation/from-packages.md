---
layout: bt_wiki
title: Installing from packages
category: Installation
draft: false
weight: 200

---

Cloudify packages greatly reduce the initial complexity of the installation process
and are the recommended way of installing for new users.

This installation method doesn't require an active internet connection during
the installation process.

{{% gsNote title="Installation Environment" %}}
Note that a virtualenv will be automatically created during installation and Cloudify will be installed within it.
{{% /gsNote %}}

## Windows

The Windows installer is a single executable which installs the following:

* Python 2.7.x
* Pip
* Virtualenv
* Cloudify

{{% gsNote title="Installing Prerequisites" %}}
Python's installation requires [Microsoft Visual C++ 2008 Redistributable](https://www.microsoft.com/en-us/download/details.aspx?id=29).
Install it if you stumble upon an error during the Python installation.
{{% /gsNote %}}

{{% gsNote title="Installing Python and Pip" %}}
During Python's setup wizard, you will be able to choose whether to install pip or not.
Regardless of what you choose, pip will be installed in the next steps since it is
required by Cloudify.
{{% /gsNote %}}

### To install on Windows

1. [Download the installer](http://getcloudify.org/downloads/get_cloudify_3x.html).
2. Run the installer and follow the installation instructions.
3. When the installation is finished, double click the new Cloudify icon on your desktop.

### Uninstalling

1. Open Programs and Features by clicking the Start button Picture of the Start button,
clicking Control Panel, clicking Programs, and then clicking Programs and Features.
2. Select a Cloudify CLI and then click Uninstall.

{{% gsNote title="Uninstalling Python" %}}
Note that uninstalling the package will not remove Python, pip and Virtualenv whether
they were or were not installed during the installation process. It is up to the user if
they would like to uninstall these components or not.

In order to uninstall Python, follow the same steps as above only choosing Python
instead of Cloudify CLI.
{{% /gsNote %}}

## Linux

{{% gsNote title="Installing Prerequisites" %}}
To install via rpm packages, you must have `Python2.7.x` and `Pip 6.0+` installed.
Additionally, Python executable must be accessible as `python` from the path
(not as `python2` or `python2.7`).
{{% /gsNote %}}

### Centos/RHEL

1. [Download the installer](http://getcloudify.org/downloads/get_cloudify_3x.html)
2. If running in graphical environment, proceed with graphical package installer
of your environment by double clicking the file you just downloaded.
3. Alternatively, in your terminal run the following command (replacing `<pkg.rpm>` with
the path of the file you just downloaded):

{{< gsHighlight bash>}}
$ sudo rpm -i <pkg.rpm>
$ source /opt/cfy/env/bin/activate
{{< /gsHighlight >}}

### Debian/Ubuntu

Debian based packages will be provided in the future. For now, you can use the [script](installation-script.html) to install Cloudify on Debian/Ubuntu.

## OS X

OS X based packages will be provided in the future. For now, you can use the [script](installation-script.html) to install Cloudify on OS X.
