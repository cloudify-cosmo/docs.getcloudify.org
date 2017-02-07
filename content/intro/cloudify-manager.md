---
layout: bt_wiki
title: Cloudify Manager
category: Intro
draft: false
weight: 500

---

Cloudify allows users to deploy applications using two main methods:

* Using the CLI only
* Using Cloudify Manager

Cloudify Manager is a dedicated environment comprising an open-source stack which allows users to:

* Utilize its different plugins (e.g. Docker, Script, Chef and Puppet Plugins) to manage application hosts.
* Keep a directory of their blueprints.
* Create multiple deployments for each blueprint and install them.
* Execute Healing, Scaling and other custom workflows on their installed applications.
* Run multiple workflows concurrenlty.
* View metrics, search logs, view an application's topology and perform different tasks using its Web UI.

The Manager also:

* Provides a secure environment for managing applications via pluggable authentication and authorization mechanisms.
* Keeps a history of metrics and events.
* Manage agents running on an application's host machines.

While you can use Cloudify to provision resources directly from the CLI, Cloudify Manager should be used to manage production level applications.

To read more about Cloudify Manager, refer to the [Cloudify Manager]({{< relref "manager/getting-started.md" >}}) section.
