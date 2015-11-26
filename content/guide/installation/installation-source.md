---
layout: bt_wiki
title: Installing from source
category: Installation
publish: true
weight: 500

---

To install Cloudify from source you must install several packages in the correct order.

Let's say you want to install from the `master` branch. run:

{{< gsHighlight  bash  >}}
$ pip install https://github.com/cloudify-cosmo/cloudify-dsl-parser/archive/master.zip
$ pip install https://github.com/cloudify-cosmo/cloudify-rest-client/archive/master.zip
$ pip install https://github.com/cloudify-cosmo/cloudify-plugins-common/archive/master.zip
$ pip install https://github.com/cloudify-cosmo/cloudify-script-plugin/archive/master.zip
$ pip install https://github.com/cloudify-cosmo/cloudify-cli/archive/master.zip
...

{{< /gsHighlight >}}


To install from any other tag or branch (e.g. "my_tag"), run:

{{< gsHighlight  bash  >}}
$ pip install https://github.com/cloudify-cosmo/cloudify-dsl-parser/archive/my_tag.zip
$ pip install https://github.com/cloudify-cosmo/cloudify-rest-client/archive/my_tag.zip
$ pip install https://github.com/cloudify-cosmo/cloudify-plugins-common/archive/my_tag.zip
$ pip install https://github.com/cloudify-cosmo/cloudify-script-plugin/archive/my_tag.zip
$ pip install https://github.com/cloudify-cosmo/cloudify-cli/archive/my_tag.zip
...

{{< /gsHighlight >}}
