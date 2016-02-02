---
layout: bt_wiki
title: Overview
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 1
---

Cloudify's Command-Line Interface is the default method for interacting with Cloudify and managing your applications. It allows you to execute workflows on your local machine as well as interact with a running [Cloudify Manager]({{< relref "manager/intro.md" >}}) (to ssh into a running Manager, upload blueprints, delete them, create deployments, execute workflows, retrieve events and more).

If you haven't already [installed Cloudify]({{< relref "installation/from-packages.md" >}}), now would be a good time to do so.

The interface can be accessed by running the `cfy` command. `cfy -h` will get you started.

A full `cfy` commands reference can be found [here]({{< relref "cli/reference.html" >}}).

Note that some features (such as viewing metric graphs and application topologies) are only available via the Web UI if running Cloudify Manager.