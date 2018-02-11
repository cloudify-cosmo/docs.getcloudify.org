---
layout: bt_wiki
title: Reinstalling and Migrating Cloudify Manager
category: Installation
draft: true
weight: 400

---

To move your Cloudify Manager to another host, you must use same process as a reinstall. One reason to migrate is to move your Cloudify Manager to a host with more resources. You can do this in one of these ways:

* **In-place reinstall** - Replace Cloudify Manager with the same version on the same host
* **Migration reinstall** - Replace Cloudify Manager with the same version on another host

The reinstall process includes:

* In-place reinstall -

  1. Backup a snapshot of the Cloudify Manager.
  1. Backup the agents certificates from the Cloudify Manager.
  1. Uninstall the Cloudify Manager from the host
  1. Install the Cloudify Manager on the host.
  1. Restore the snapshot of the Cloudify Manager to the host.
  1. Restore 

* Migration reinstall -

  1. Backup a snapshot of the Cloudify Manager.
  1. Backup the agents certificates from the Cloudify Manager.
  1. Install the Cloudify Manager on the host.
  1. Restore the snapshot of the Cloudify Manager to the host.
  1. Migrate agents from the old Cloudify Manager.
  1. (Optional) Uninstall the Cloudify Manager from the original host. In Cloudify 4.2 and below, this is called teardown.
