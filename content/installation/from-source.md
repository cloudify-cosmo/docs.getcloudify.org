---
layout: bt_wiki
title: Installing from Source
category: Installation
draft: true
weight: 500

---

You can install a Cloudify environment from source, from [PyPi](https://pypi.python.org/pypi)
and [GitHub](http://github.com/).

{{% gsNote title="Advanced Process" %}}
This method of installation is intended for advanced-level users or developers.

Installation from source requires that you have an environment in which the compilers are installed and
configured, because some Cloudify's dependencies are not pure Python modules.

Familiarity with [virtualenv](https://virtualenv.readthedocs.org/en/latest/) and [Pip](https://pip.pypa.io/en/stable/) is also recommended.
{{% /gsNote %}}

{{% gsTip title="Install inside virtualenv" %}}
It is recommended that you install all of the components described below in a virtualenv,
to avoid corrupting the global Python environment on your system and to
remove the requirement for root permissions on some systems.
{{% /gsTip %}}

## Installation Prerequisites
For all operating systems, the following components are required. Additional, system-specfic requirements are also provided.

* [Python 2.7.X](https://www.python.org/downloads/)
* [pip 6.0+](https://pip.pypa.io/en/stable/installing/)
* [virtualenv 12.0+](https://virtualenv.readthedocs.org/en/latest/installation.html)

### Windows System Prerequisites
* [Microsoft Visual C++ Compiler for Python 2.7](https://www.microsoft.com/en-us/download/details.aspx?id=44266)

### Linux System Prerequisites

Verify that the following is available in your OS package repository:

* Python header files (`python-dev` in Ubuntu/Debian or `python-devel` in CentOS/RHEL)
* GNU C compiler (`gcc`)

### OS X System Prerequisites

* [Xcode Command Line Tools](https://developer.apple.com/library/ios/technotes/tn2339/_index.html#//apple_ref/doc/uid/DTS40014588-CH1-DOWNLOADING_COMMAND_LINE_TOOLS_IS_NOT_AVAILABLE_IN_XCODE_FOR_OS_X_10_9__HOW_CAN_I_INSTALL_THEM_ON_MY_MACHINE_)

## Installing from PyPi

PyPi is the official repository for third-party Python modules. Cloudify uploads
its Python artifacts to PyPi.

Run the following commands in a terminal to install the latest release from PyPi.

```$ pip install cloudify```

You can also specify a version, using the following command.
```$ pip install cloudify==3.3```

PyPi contains the same [releases](https://github.com/cloudify-cosmo/cloudify-cli/tags) that you can find on GitHub, however naming convention
is a bit different, for example, to get `3.3m6` you must to request
`cloudify==3.3a6`.

The full list of PyPi versions is [available at this link](https://pypi.python.org/pypi/cloudify/json).

## Installing from GitHub

Cloudify uses GitHub as its primary online source code repository.


##### Install the latest stable release

Run the following commands in a terminal to install the latest stable release from GitHub.

{{< gsHighlight bash >}}
$ CFY_VERSION="4.0.0"
$ pip install "https://github.com/cloudify-cosmo/cloudify-cli/archive/$CFY_VERSION.zip" \
  --requirement "https://raw.githubusercontent.com/cloudify-cosmo/cloudify-cli/$CFY_VERSION/dev-requirements.txt"
{{< /gsHighlight >}}


##### Install the latest development milestone release

You can install the latest development milestone release using the following command.

{{< gsHighlight bash >}}
$ CFY_VERSION="master"
$ pip install "https://github.com/cloudify-cosmo/cloudify-cli/archive/$CFY_VERSION.zip" \
  --requirement "https://raw.githubusercontent.com/cloudify-cosmo/cloudify-cli/$CFY_VERSION/dev-requirements.txt"
{{< /gsHighlight >}}

##### Specify a release version

You can set the `CFY_VERSION` variable to any version in the [version list](https://github.com/cloudify-cosmo/cloudify-cli/tags).
