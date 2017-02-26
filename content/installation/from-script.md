---
layout: bt_wiki
title: Installing Using a Python Script
category: Installation
draft: false
weight: 300

---

You can use the [get-cloudify.py](http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/get-cloudify.py) Python script to install the Cloudify environment on various operating sytems.


{{% gsWarning title="Forced Prerequisites Installation" %}}

By default, this script does not install any prerequisites. If required, you can force prerequisites' installation using the `--force` flag. This argument installs all prerequisites without prompting you for anything other than a sudoer password (if required).
{{% /gsWarning %}}

## Installation Prerequisites
The following components are required for all operating systems. Additional, system-specfic requirements are also provided.

* [Python 2.7.X](https://www.python.org/downloads/)
* [pip 6.0+](https://pip.pypa.io/en/stable/installing/)
* [virtualenv 12.0+](https://virtualenv.readthedocs.org/en/latest/installation.html)

### Windows System Prerequisites
* PyCrypto ([32bit](http://repository.cloudifysource.org/org/cloudify3/components/pycrypto-2.6.win32-py2.7.exe) / [64bit](http://repository.cloudifysource.org/org/cloudify3/components/pycrypto-2.6.win-amd64-py2.7.exe))

### Linux System Prerequisites
* Python development headers (`python-dev` in Ubuntu/Debian or `python-devel` in CentOS/RHEL)
* C compiler (`gcc`)

### OS X  System Prerequisites

* [Xcode Command Line Tools](https://developer.apple.com/library/ios/technotes/tn2339/_index.html#//apple_ref/doc/uid/DTS40014588-CH1-DOWNLOADING_COMMAND_LINE_TOOLS_IS_NOT_AVAILABLE_IN_XCODE_FOR_OS_X_10_9__HOW_CAN_I_INSTALL_THEM_ON_MY_MACHINE_)

## Download the Script
1. [Download the script](http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/get-cloudify.py) by right-clicking the link and selecting **Save**.
2. Run `python get-cloudify.py -h` to display detailed help.

### Install the latest stable release to a new virtualenv
Run the following command to create new virtualenv (`my_virtualenv`) and
install the Cloudify environment in it.

{{% gsNote title="Installing within a virtualenv" %}}
If you are already within a virtualenv when you run the script, if have not specified the `--virtualenv` flag, the script installs the Cloudify environment in the currently active virtualenv.
{{% /gsNote %}}

{{< gsHighlight  bash  >}}
$ python get-cloudify.py -e my_virtualenv --installvirtualenv
...

20:21:40 [INFO] [get-cloudify.py] virtualenv is already installed in the path.
20:21:40 [INFO] [get-cloudify.py] Dropping root permissions...
20:21:40 [INFO] [get-cloudify.py] Creating Virtualenv my_virtualenv...
20:21:41 [INFO] [get-cloudify.py] Installing cloudify...
20:21:48 [INFO] [get-cloudify.py] You can now run: "source my_virtualenv/bin/activate" to activate the Virtualenv.
...

$ source my_virtualenv/bin/activate

{{< /gsHighlight >}}



### Install the latest milestone release
Run the following command to install that latest development milestone release.

{{< gsHighlight  bash  >}}
$ python get-cloudify.py --pre
{{< /gsHighlight >}}

### Install a specific version
Run the following command to install a specific version of Cloudify:

{{< gsHighlight  bash  >}}
$ python get-cloudify.py --version [_3.2a4_]
{{< /gsHighlight >}}

The complete list of PyPi versions is [available here](https://pypi.python.org/pypi/cloudify/json).
