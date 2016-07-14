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

### Initializing your Cloudify environment

Before staring to work run the init command.

{{< gsHighlight  markdown  >}}
$ cfy init
...

Initialization completed successfully

...
{{< /gsHighlight >}}

This will initiate the cloudify working environment with the folder you're current located at.