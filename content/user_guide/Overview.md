---
layout: bt_wiki
title: Overview
category: User Guide
draft: false
weight: 1

---

So you want to use Cloudify but you're not sure how?

This page can help you get started by giving you a few detailed examples with commentaries and pointers

### Installing Cloudify

Follow the instruction in the [Installation Page](http://stage-docs.getcloudify.org/howto/intro/installation/) to get Cloudify on your machine.

Once you have selected your prefered method of installation and finshed, you can confirm it's installed and check the version you're running by executing `cfy --veriosn`

{{< gsHighlight  markdown  >}}
$ cfy --version
...

Cloudify CLI 3.4.0

...
{{< /gsHighlight >}}

### Initializing your Cloudify environment

This will initiate the cloudify working environment with the folder you're current located at

{{< gsHighlight  markdown  >}}
$ cfy init
...

Initialization completed successfully

...
{{< /gsHighlight >}}