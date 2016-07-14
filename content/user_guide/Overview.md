---
layout: bt_wiki
title: Overview
category: User Guide
draft: false
weight: 1

---

# About this guide

So you want to use Cloudify but you're not sure how?

This page can help you get started by giving you a few detailed examples with commentaries and pointers

Easy to use examples for day-to-day use cases to help you see just how helpful Cloudify could be.

Cloudify has two major work states: Local and Manager.

When using local remember you must one machine the execute any action on the deployment and in general this work state in not suitible for teams.

### Installing Cloudify

Follow the instruction in the [Installation Page](http://stage-docs.getcloudify.org/howto/intro/installation/) to get Cloudify on your machine.

### Initializing Cloudify

Before staring to work run the init command.

{{< gsHighlight  markdown  >}}
$ cfy init
...

Initialization completed successfully

...
{{< /gsHighlight >}}

This will initialize the Cloudify working environment with the folder you're current located at.


# What's Next

To get started you can try any one of our examples

* [Initiating a VM on AWS](http://stage-docs.getcloudify.org/howto/user_guide/aws-vm/)

* [Scaling VMs on AWS](http://stage-docs.getcloudify.org/howto/user_guide/Scaling/)