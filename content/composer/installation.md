---
layout: bt_wiki
title: Overview
category: Docs
draft: false
weight: 10

---

Installing Cloudify's Blueprint Composer is currently done via a script.
which can be downloaded from [here](http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/get-cloudify-composer.py).

# Prerequisites

The script requires that you have:

* Python 2.7.x
* pip 1.5+
* Virtualenv 12+
* Sudo privileges
* An internet connection.

# Usage

To install run:

```shell
sudo python get-cloudify-composer.py
```

And follow the instructions to run it.

Note that if the `python` executable in your path is not python2.7 by default, you can run the script using `python2` instead:

``shell
sudo python2.7 get-cloudify-composer.py
```

