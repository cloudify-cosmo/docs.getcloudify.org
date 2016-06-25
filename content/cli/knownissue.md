---
layout: bt_wiki
title: Known Issues
category: Docs
draft: false
abstract: Known Issues in Cloudify's CLI
weight: 200
---

* In 3.3.1, the directory that [bootstrap]({{< relref 'manager/bootstrapping.md' >}}) is executed from is compressed and included in the [provider context](http://cloudify-plugins-common.readthedocs.org/en/latest/context.html#cloudify.context.CloudifyContext.provider_context). This context is stored both in the Cloudify manager and in the directory itself when bootstrap is complete. If this directory also contained the manager blueprints git repository, this will cause the CLI to be exceedingly slow. The issue has already been fixed for [3.4 release](http://docs.getcloudify.org/3.4.0/intro/what-is-cloudify/), however for 3.3.1 users, you will need to [teardown]({{< relref 'manager/teardown.md' >}}) your 3.3.1 manager and bootstrap again. Please see the [Cloudify User Groups](https://groups.google.com/forum/#!forum/cloudify-users) for more info.
