---
title: Cloudify High Availability Cluster Upgrade Guide
category: Cluster Upgrade
draft: false
weight: 100
---
## Overview

These instructions explain how to upgrade a Cloudify High Availablity (HA) cluster from version 4.3 to version 5.0.

### Upgrade to new hosts

The key elements of upgrading a Cloudify HA cluster on new hosts are:

1.  Create and download a snapshot.
1.  Save agent ssh keys.
1.  Install new Cloudify version of manager on a new host.
1.  Restore previously downloaded snapshot on the new manager.
1.  Reinstall agents.
1.  Install new Cloudify version of extra managers on new hosts joining to the 1st manager.

### Upgrade on new hosts

1.  Create a snapshot on the old Cloudify HA cluster and download it:

    ```
    cfy snapshots create my_snapshot
    cfy snapshots download my_snapshot -o {{ /path/to/the/snapshot/file }}
    ```
1.  Save SSH keys from /etc/cloudify folder:
    ```
    cp –r /etc/cloudify/.ssh <backup_dir>
    ```
1.  Install a new Cloudify manager on a new host (See Installing Cloudify Manager Cluster guide).
1.  Upload and restore snapshot to the new manager:
    ```
    cfy snapshots upload {{ /path/to/the/snapshot/file }} --snapshot-id <snapshot_name>
    cfy snapshots restore <snapshot_name>
    ```
1.  Reinstall agents:
    ```
    cfy agents install --all-tenants
    ```
1.  Install the extra Cloudify managers on new host and add them to the cluster (See Installing Cloudify Manager Cluster guide).
1.  Delete old cluster's hosts
