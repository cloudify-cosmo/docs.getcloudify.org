---
layout: bt_wiki
title: Installing using a script
category: Installation
publish: true
weight: 300

---

A script is supplied for you to install Cloudify on different OS distributions.

You can download the script from [here](#){: .openRegisForm}

{{% gsNote %}}
Please consider running `python get-cloudify.py -h` before installing to get familiarized with what this script provides.
{{% /gsNote %}}

{{% gsWarning title="Prerequisites Installation" %}}
By default, this script will not install any prerequisites. You can supply it with the `--force` flag which will install all prerequisites without prompting you for anything other than a sudoer password (if required).

The prerequisites are:

* pip - for Linux, Windows and OS X
* virtualenv - for Linux, Windows and OS X
* python-dev and gcc - for Ubuntu/Debian to be able to compile Fabric.
* python-devel and gcc - for CentOS/RHEL to be able to compile Fabric.
* gcc - for Arch-Linux to be able to compile Fabric.
* PyCrypto - for Windows as it's not automatically compiled when installing Cloudify's CLI.
{{% /gsWarning %}}

{{% gsNote title="Update Your Package Manager" %}}
If you are using Linux, and you choose to use either the `--force` flag or the `--installpythondev` flag, you must first update your package manager:
    sudo apt-get update
    or
    sudo yum update
{{% /gsNote %}}


## Installing the latest Stable Release into a virtualenv

Download the [script](http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/get-cloudify.py) and run:

{{< gsHighlight  bash  >}}
$ sudo python get-cloudify.py -e my_virtualenv --installvirtualenv
...

20:21:40 [INFO] [get-cloudify.py] virtualenv is already installed in the path.
20:21:40 [INFO] [get-cloudify.py] Dropping root permissions...
20:21:40 [INFO] [get-cloudify.py] Creating Virtualenv my_virtualenv...
20:21:41 [INFO] [get-cloudify.py] Installing cloudify...
20:21:48 [INFO] [get-cloudify.py] You can now run: "source my_virtualenv/bin/activate" to activate the Virtualenv.
...

$ source my_virtualenv/bin/activate
...

{{< /gsHighlight >}}

{{% gsNote title="Installing within a virtualenv" %}}
If you're already within a virtualenv when running the script and have not supplied the `--virtualenv` flag, the script will install Cloudify within the currently active virtualenv.
{{% /gsNote %}}


## Installing the latest Milestone Release

{{< gsHighlight  bash  >}}
$ python get-cloudify.py --pre
...

{{< /gsHighlight >}}

## Installing a specific Milestone Release

{{< gsHighlight  bash  >}}
$ python get-cloudify.py --version 3.2a4
...

{{< /gsHighlight >}}
