---
title: Cloudify High Availability Cluster Upgrade Guide
category: Cluster Upgrade
draft: false
weight: 100
---
## Overview

This guide explains how to upgrade a high-availability {{< param cfy_manager_name >}} cluster to a new version.<br>
Since the old version of {{< param product_name >}} cluster was active-passive, the guide is the same for both this case and the {{< param product_name >}} All-In-One case.<br>
The best-practice to upgrade {{< param product_name >}} is to deploy the new version on a new set of hosts, therefore a new host should be created for every existing Manager.

### Upgrade to new hosts

1.  Create and download a snapshot from the existing Manager. Please refer to the [Backup and restore guide]({{< relref "/ops_guides/backup_restore_guide.md" >}}) for further instructions.
1.  Install a new {{< param product_name >}} cluster. Please refer to the [{{< param product_name >}} cluster installation guide]({{< relref "/install_maintain/installation/installing-cluster.md" >}}) for further instructions.
1.  After the cluster and CLI installation is done, ssh into all Managers except one (best practice - 2 out of 3) and run `cfy_manager stop`. This would stop {{< param product_name >}} services on these hosts.
1.  Copy the snapshot to the last Manager (the only active one).
1.  Ssh into this Manager, and run the following code:

        sudo /opt/patroni/bin/patronictl -c /etc/patroni.conf show-config | sudo tee /etc/patroni.conf.bak
        sudo /opt/patroni/bin/patronictl -c /etc/patroni.conf edit-config -s ttl=86400 -s retry_timeout=86400 --force
        if [[ -f /etc/haproxy/haproxy.cfg ]]; then
          sudo sed -i.bak -e 's/timeout client.*$/timeout client 1440m/' -e 's/timeout server.*$/timeout server 1440m/' /etc/haproxy/haproxy.cfg
          sudo service haproxy reload
        fi

    This will increase the Patroni and HAproxy timeouts, which is necessary for large snapshots to restore correctly.
1.  On the same Manager, upload the snapshot, and restore it. Please refer to the [Backup and restore guide]({{< relref "/ops_guides/backup_restore_guide.md" >}}) for further instructions.
1.  After the restore is done, revert the Patroni and HAproxy timeouts to their defaults:

        sudo /opt/patroni/bin/patronictl -c /etc/patroni.conf edit-config --apply /etc/patroni.conf.bak --force
        if [[ -f /etc/haproxy/haproxy.cfg ]]; then
          sudo mv /etc/haproxy/haproxy.cfg.bak /etc/haproxy/haproxy.cfg
          sudo service haproxy reload
        fi

1.  Connect to the inactive Managers, and on each one run `cfy_manager start`.
1.  Reinstall agents. Please refer to the [Agents installation guide]({{< relref "/cli/orch_cli/agents.md#install" >}}) for further instructions.
1.  Delete old host/s.
