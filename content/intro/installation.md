---
layout: bt_wiki
title: Installing Cloudify
category: Intro
draft: false
weight: 200
---

To start using Cloudify, you must first install it.


# Installing using packages

Currently, packages are distributed for Centos 6+/RHEL 6+, Debian 7+/Ubuntu 14+ and Windows (all packages are provided for x64 only).

## Windows

To install on Windows:

* Download the installer from the [Downloads page](http://getcloudify.org/downloads/get_cloudify_3x.html) corresponding with the version you would like to install.
* Run the executable installer.
* Follow the installation instructions.
* When the installation is finished, double click the new Cloudify icon on your desktop.

After the installation is complete, try running `cfy -h` in your terminal.


## Linux

### Centos/RHEL

* Download the installer from the [Downloads page](http://getcloudify.org/downloads/get_cloudify_3x.html) corresponding with the version you would like to install.
* Open a terminal at the directory where you downloaded the file.
* Run (replacing `<pkg.rpm>` with the path to the file you downloaded):

{{< gsHighlight  bash  >}}
$ sudo rpm -i <pkg.rpm>
...

{{< /gsHighlight >}}

After the installation is complete, try running `cfy -h` in your terminal.

### Debian/Ubuntu

* Download the installer from the [Downloads page](http://getcloudify.org/downloads/get_cloudify_3x.html) corresponding with the version you would like to install.
* Open a terminal at the directory where you downloaded the file.
* Run (replacing `<pkg.deb>` with the path to the file you downloaded):

{{< gsHighlight  bash  >}}
$ sudo dpkg -i <pkg.deb>
...

{{< /gsHighlight >}}

After the installation is complete, try running `cfy -h` in your terminal.

# Installing using an installation script

A script is supplied for you to install Cloudify on Linux, Windows and OS X.

## Prerequisites

To install using the script, you must have Python 2.7.x preinstalled.

{{% gsWarning title="Prerequisites Installation" %}}
By default, this script will not install any prerequisites (like pip, or any required compilers). You can supply it with the `--force` flag which will install all prerequisites without prompting you for anything other than a sudoer password (if required).
{{< /gsWarning >}}

Note that the script requires an internet connection.

Run `python get-cloudify.py -h` for additional information.


## Installation

You can download the script from [here](https://github.com/cloudify-cosmo/get-cloudify.py)

Then, run `sudo python get-cloudify.py` on Linux or OS X and `python get-cloudify.py` on Windows.

After the installation is complete, try running `cfy -h` in your terminal.


# Which method should I use?

Our provided packages should be used unless one of the following applies:

* You're installing on OS X or a Linux distribution not supported by one of the installers.
* You don't have sudo privileges on Linux.
* For development purposes.

If one of the above applies, you should use the installation script.


That's it! Cloudify is installed. You can now try using it to [deploy your first application]({{< relref "intro/getting-started.md" >}}).
