---
title: Reinstalling and Migrating Cloudify Manager
category: Installation
draft: true
weight: 8

---

To move your {{< param cfy_manager_name >}} to another host, you must use same process as a reinstall. One reason to migrate is to move your {{< param cfy_manager_name >}} to a host with more resources. You can do this in one of these ways:

* **In-place reinstall** - Replace {{< param cfy_manager_name >}} with the same version on the same host
* **Migration reinstall** - Replace {{< param cfy_manager_name >}} with the same version on another host

The reinstall process includes:

* In-place reinstall -

  1. Backup a snapshot of the {{< param cfy_manager_name >}}.
  1. Backup the agents certificates from the {{< param cfy_manager_name >}}.
  1. Uninstall the {{< param cfy_manager_name >}} from the host
  1. Install the {{< param cfy_manager_name >}} on the host.
  1. Restore the snapshot of the {{< param cfy_manager_name >}} to the host.
  1. Restore

* Migration reinstall -

  1. Backup a snapshot of the {{< param cfy_manager_name >}}.
  1. Backup the agents certificates from the {{< param cfy_manager_name >}}.
  1. Install the {{< param cfy_manager_name >}} on the host.
  1. Restore the snapshot of the {{< param cfy_manager_name >}} to the host.
  1. Migrate agents from the old {{< param cfy_manager_name >}}.
  1. (Optional) Uninstall the {{< param cfy_manager_name >}} from the original host. 
