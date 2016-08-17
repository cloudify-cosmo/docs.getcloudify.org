---
layout: bt_wiki
title: Installation
category: Installation
draft: false
weight: 200

---

# Installing from Packages for OS distributions

Cloudify packages greatly reduce the initial complexity of the installation process and are the recommended way of installing for new users.

This installation method doesn't require an active internet connection during
the installation process.

## Linux

### Centos/RHEL

1. [Download the installer](http://getcloudify.org/downloads/get_cloudify_3x.html)
2. If running in graphical environment, proceed with graphical package installer
of your environment by double clicking the file you just downloaded.
3. Alternatively, in your terminal run the following command (replacing `<pkg.rpm>` with
the path of the file you just downloaded):

```bash
$ sudo rpm -i <pkg.rpm>
```

### Debian/Ubuntu

1. [Download the installer](http://getcloudify.org/downloads/get_cloudify_3x.html)
2. If running in graphical environment, proceed with graphical package installer
of your environment by double clicking the file you just downloaded.
3. Alternatively, in your terminal run the following command (replacing `<pkg.deb>` with
the path of the file you just downloaded):

```bash
$ sudo dpkg -i <pkg.deb>
```

## Windows

The Windows installer is a single executable which installs the following:

* Python 2.7.x
* Pip
* Virtualenv
* Cloudify

{% call c.note("Installing Prerequisites") %}
Python's installation requires [Microsoft Visual C++ 2008 Redistributable](https://www.microsoft.com/en-us/download/details.aspx?id=29).
Install it if you stumble upon an error during the Python installation.
{% endcall %}

{% call c.note("Installing Python and Pip") %}
During Python's setup wizard, you will be able to choose whether to install pip or not.
Regardless of what you choose, pip will be installed in the next steps since it is
required by Cloudify.
{% endcall %}

### To install on Windows

1. [Download the installer](http://getcloudify.org/downloads/get_cloudify_3x.html).
2. Run the installer and follow the installation instructions.
3. When the installation is finished, double click the new Cloudify icon on your desktop.

### Uninstalling

1. Open Programs and Features by clicking the Start button Picture of the Start button,
clicking Control Panel, clicking Programs, and then clicking Programs and Features.
2. Select Cloudify CLI and then click Uninstall.

{% call c.note("Uninstalling Python") %}
Note that uninstalling the package will not remove Python, pip and Virtualenv whether
they were or were not installed during the installation process. It is up to the user if
they would like to uninstall these components or not.

In order to uninstall Python, follow the same steps as above only choosing Python
instead of Cloudify CLI.
{% endcall %}

## OS X

An OS X installer will be provided in the future. For now, you can use the [script]({{ relRef("installation/from-script.md") }}) to install Cloudify on OS X.

# Installing from Script

[get-cloudify.py](http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/get-cloudify.py) is a Python script that is dedicated to installing Cloudify on different platforms.

{% call c.note("Prerequisites Installation") %}
By default, this script will not install any prerequisites. You can supply it with the `--force` flag which will install all prerequisites without prompting you for anything other than a sudoer password (if required).
{% endcall %}

## Installation Prerequisites
For all users the following components are required:

* [Python 2.7.X](https://www.python.org/downloads/)
* [pip 6.0+](https://pip.pypa.io/en/stable/installing/)
* [virtualenv 12.0+](https://virtualenv.readthedocs.org/en/latest/installation.html)

### For Windows users
* PyCrypto ([32bit](http://repository.cloudifysource.org/org/cloudify3/components/pycrypto-2.6.win32-py2.7.exe) / [64bit](http://repository.cloudifysource.org/org/cloudify3/components/pycrypto-2.6.win-amd64-py2.7.exe))

### For Linux users
* Python development headers (`python-dev` in Ubuntu/Debian or `python-devel` in CentOS/RHEL)
* C compiler (`gcc`)

### For OS X users
* [Xcode Command Line Tools](https://developer.apple.com/library/ios/technotes/tn2339/_index.html#//apple_ref/doc/uid/DTS40014588-CH1-DOWNLOADING_COMMAND_LINE_TOOLS_IS_NOT_AVAILABLE_IN_XCODE_FOR_OS_X_10_9__HOW_CAN_I_INSTALL_THEM_ON_MY_MACHINE_)

## Downloading and using
1. [Download](http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/get-cloudify.py) the script (right click the link and choose Save).
2. Run `python get-cloudify.py -h` to get a detailed help manual.

### Installing the latest stable release into a new virtualenv
Run the following command in order to create new virtualenv (`my_virtualenv`) and
install Cloudify in it:

```bash
$ sudo python get-cloudify.py -e my_virtualenv --installvirtualenv
...

20:21:40 [INFO] [get-cloudify.py] virtualenv is already installed in the path.
20:21:40 [INFO] [get-cloudify.py] Dropping root permissions...
20:21:40 [INFO] [get-cloudify.py] Creating Virtualenv my_virtualenv...
20:21:41 [INFO] [get-cloudify.py] Installing cloudify...
20:21:48 [INFO] [get-cloudify.py] You can now run: "source my_virtualenv/bin/activate" to activate the Virtualenv.
...

$ source my_virtualenv/bin/activate

```

{% call c.note("Installing within a virtualenv") %}
If you're already within a virtualenv when running the script and have not supplied the `--virtualenv` flag, the script will install Cloudify within the currently active virtualenv.
{% endcall %}

### Installing the latest milestone release
Run the following command in order to install that latest bleeding edge release:

```bash
$ python get-cloudify.py --pre
```

### Installing a specific version
Run the following command in order to install a specific version of Cloudify:

```bash
$ python get-cloudify.py --version 3.2a4
```

Full list of PyPi versions is [available here](https://pypi.python.org/pypi/cloudify/json).

# Installing from Source

Installing Cloudify from sources is possible from [PyPi](https://pypi.python.org/pypi)
and [GitHub](http://github.com/).

{% call c.note("Advanced Section") %}
This method of installation is intended for advanced users or developers.

Installation from sources requires an environment with compilers installed and
configured since some of Cloudify's dependencies are not pure Python modules.

Familiarity with [Virtualenv](https://virtualenv.readthedocs.org/en/latest/) and [Pip](https://pip.pypa.io/en/stable/) is recommended as well.
{% endcall %}

{% call c.note("Install inside Virtualenv") %}
It is recommended to install all of the components below in a virtualenv
in order to avoid polluting the global Python environment on your system and to
remove the requirement for root permissions on some of the systems.
{% endcall %}

## Installation Prerequisites
For all users the following components are required:

* [Python 2.7.X](https://www.python.org/downloads/)
* [pip 6.0+](https://pip.pypa.io/en/stable/installing/)
* [virtualenv 12.0+](https://virtualenv.readthedocs.org/en/latest/installation.html)

### For Windows users
* [Microsoft Visual C++ Compiler for Python 2.7](https://www.microsoft.com/en-us/download/details.aspx?id=44266)

### For Linux users
The following should be available in your OS package repository:

* Python header files (`python-dev` in Ubuntu/Debian or `python-devel` in CentOS/RHEL)
* GNU C compiler (`gcc`)

### For OS X users
* [Xcode Command Line Tools](https://developer.apple.com/library/ios/technotes/tn2339/_index.html#//apple_ref/doc/uid/DTS40014588-CH1-DOWNLOADING_COMMAND_LINE_TOOLS_IS_NOT_AVAILABLE_IN_XCODE_FOR_OS_X_10_9__HOW_CAN_I_INSTALL_THEM_ON_MY_MACHINE_)

## Installing from PyPi

PyPi is the official repository for 3rd party Python modules. Cloudify uploads
its Python artifacts to PyPi.

Installing the latest release from PyPi is done by running the following commands
in a terminal:
```bash
$ pip install cloudify
```

It's also possible to request a specific version:
```bash
$ pip install cloudify==3.3
```

PyPi contains the same [releases](https://github.com/cloudify-cosmo/cloudify-cli/tags) that you can find on GitHub, however naming convention
is a bit different, for example, to get `3.3m6` you'll need to request
`cloudify==3.3a6`.

Full list of PyPi versions is [available here](https://pypi.python.org/pypi/cloudify/json).

## Installing from GitHub

Cloudify uses GitHub as its main online source code repository.

Installing the latest stable version from GitHub can be done by running the following
commands in a terminal:
```bash
$ CFY_VERSION="3.3"
$ pip install "https://github.com/cloudify-cosmo/cloudify-cli/archive/$CFY_VERSION.zip" \
  --requirement "https://raw.githubusercontent.com/cloudify-cosmo/cloudify-cli/$CFY_VERSION/dev-requirements.txt"
```

Installing latest bleeding edge release can be done in the similar manner:
```bash
$ CFY_VERSION="master"
$ pip install "https://github.com/cloudify-cosmo/cloudify-cli/archive/$CFY_VERSION.zip" \
  --requirement "https://raw.githubusercontent.com/cloudify-cosmo/cloudify-cli/$CFY_VERSION/dev-requirements.txt"
```

You can set the `CFY_VERSION` variable to any desired version from [version list](https://github.com/cloudify-cosmo/cloudify-cli/tags).
