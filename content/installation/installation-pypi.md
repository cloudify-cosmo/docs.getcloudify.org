---
layout: bt_wiki
title: Installing from PyPI
category: Installation
publish: true
weight: 400

---

Cloudify is also distributed via PyPI. You can install Cloudify from PyPI though we recommend using the script as installing from PyPI does not handle prerequisites and does not provide some other comforts the script is designed to provide.

You must have Python 2.7.x and pip installed and configured on your system.

{{% gsTip title="Using virtualenv" %}}
It's recommended to create a [virtualenv]({{ page.venv_link }}) and install the CLI in it. To do so type the following commands (replace virtual-env-name with the name of your choice, e.g. cloudify:

{{< gsHighlight  bash  >}}
$ virtualenv cloudify
...

$ source cloudify/bin/activate
...

{{< /gsHighlight >}}

{{% /gsTip %}}

## Installing the latest Stable Release

To install Cloudify run the following command:

{{< gsHighlight  bash  >}}
$ pip install cloudify
Collecting cloudify==3.3
...

{{< /gsHighlight >}}

## Installing the latest Milestone Release

{{< gsHighlight  bash  >}}
$ pip install cloudify --pre
Collecting cloudify==3.3rc1
...

{{< /gsHighlight >}}

## Installing a specific Milestone Release

{{< gsHighlight  bash  >}}
$ pip install cloudify==3.3rc1
Collecting cloudify==3.3rc1
...

{{< /gsHighlight >}}

