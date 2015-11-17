---
layout: bt_wiki
title: Prerequisites
category: Installation
publish: true
pageord: 100

---

Cloudify has dependencies that require C-Extension compilation on your machine.
This is only relevant when installing from PyPI or from source. The premade packages and the script (depending on the flags you provide it with) already take care of these.

# Windows

For Windows it's suggested to use [Unofficial Windows Binaries for Python](http://www.lfd.uci.edu/~gohlke/pythonlibs)
and install the following packages:

1. PyCrypto
2. PyYAML (by default, if no compiler is found, PyYAML's installation will fall-through to a non-compiled version.)

# Linux

* Under Ubuntu/Debian, you'll need to install the `python-dev` and `gcc` packages.
* Under CentOS/RHEL, you'll need to install the `python-devel` and `gcc` packages.

# OS X

You will need Apple's developers tools that are installed with Xcode.
