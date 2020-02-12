---
title: Cloudify High Availability Cluster Upgrade Guide
category: Cluster Upgrade
draft: false
weight: 100
---
## Overview

This guide explains how to upgrade Cloudify to the new Cloudify Manager HA active-active cluster version.<br>
Since the old version of Cloudify cluster was active-passive, the guide is the same for both this case and the Cloudify All-In-One case.<br>
The best-practice to upgrade Cloudify is on new hosts, therefore a new host should be created for every existing Manager. 

### Upgrade to new hosts

1.  Create and download a snapshot from the existing Manager. Please refer to the [Backup and restore guide](http://docs.cloudify.co/5.0.5/ops_guides/backup_restore_guide) for further instructions. 
1.  Install a new Cloudify cluster. Please refer to the [Cloudify cluster installation guide](http://docs.cloudify.co/5.0.5/install_maintain/installation/installing-cluster/) for further instructions. 
1.  After the cluster and CLI installation is done, ssh into all Managers except one (best practice - 2 out of 3) and run `cfy_manager stop`. This would stop Cloudify services on these hosts.
1.  Copy the snapshot to the last Manager (the only active one).
1.  Ssh into this Manager, upload the snapshot, and restore it. Please refer to the [Backup and restore guide](http://docs.cloudify.co/5.0.5/ops_guides/backup_restore_guide) for further instructions.
1.  After the restore is done, connect to the inactive Managers, and on each one run `cfy_manager start`.
1.  Reinstall agents. Please refer to the [Agents installation guide](https://docs.cloudify.co/5.0.5/cli/orch_cli/agents/#install) for further instructions.
1.  Delete old host/s.
