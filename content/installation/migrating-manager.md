---
layout: bt_wiki
title: Reinstalling and Migrating Cloudify Manager
category: Installation
draft: true
weight: 400

---

To get the latest features and benefits of Cloudify Manager, we recommend that you upgrade to the latest version of Cloudify. You can do this in one of these ways:

* **In-place reinstall** - Replace Cloudify Manager with the same version on the same host
* **Migration reinstall** - Replace Cloudify Manager with the same version on another host

The reinstall process includes:

* In-place reinstall -

  1. Save a snapshot of the Cloudify Manager.
  1. Uninstall the Cloudify Manager from the host
  1. Install the Cloudify Manager on the host.
  1. Restore the snapshot of the Cloudify Manager to the host.

* Migration reinstall -

  1. Save a snapshot of the Cloudify Manager.
  1. Install the Cloudify Manager on the host.
  1. Restore the snapshot of the Cloudify Manager to the host.
  1. (Optional) Uninstall the Cloudify Manager from the original host. In Cloudify 4.2 and below, this is called teardown.
  1. Migrate agents from the old Cloudify Manager.