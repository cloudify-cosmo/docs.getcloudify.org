---
title: Cloudify High Availability Cluster Upgrade Guide
category: Cluster Upgrade
draft: false
weight: 100
---
## Overview

These instructions explain how to upgrade a Cloudify High Availablity (HA) cluster. Note that the instructions are relevant to source version 4.3 or later and target version of 4.6.

### Upgrade on new hosts

This is the recommended method. Using this method, if any part of the upgrade process fails, the original Cloudify manager remains active and functional.

The key elements of upgrading a Cloudify HA cluster on new hosts are:

1.  Create and download a snapshot of the manager.
1.  Save agent ssh keys.
1.  Install new version for the master manager on a new host.
1.  Install new version for the standby managers on new hosts.
1.  Apply a license to the master manager.
1.  Restore the last snapshot.
1.  Reinstall agents.
1.  Start cluster on master.
1.  Join standby nodes to the HA cluster.

### In-place upgrade

Upgrading Cloudify HA Cluster entails tearing down the existing Managers and installing a new version of Cloudify manager on the same hosts. You can also restore data from your existing instance to new instance.

The key elements of in-place upgrading a Cloudify HA cluster are:

1.  Create and download snapshot.
1.  Save `/etc/cloudify/ssl` folder of cluster's master manager.
1.  Save agent ssh keys.
1.  Remove standby nodes from the cluster.
1.  Teardown managers.
1.  Clean managers after teardown.
1.  Install new version on master manager's host (In-place installation).
1.  Install new version on standby managers' host (In-place installation).
1.  Start HA cluster on master manager.
1.  Apply a license to the master manager.
1.  Restore last snapshot.
1.  Join standby nodes to the HA cluster.

## Upgrade Cloudify HA cluster

There are two methods to upgrade Cloudify HA cluster.

### Upgrade on new hosts

This is the recommended method. Using this method, if any part of the upgrade process fails, the original Cloudify manager remains active and functional.

The next steps allow you to go through upgrade to new hosts:

1.  Create snapshot on old Cloudify HA cluster and download it:

    ```
    cfy snapshots create my_snapshot  # --include-metrics #(optional)
    cfy snapshots download my_snapshot -o {{ /path/to/the/snapshot/file }}
    ```
1.  Save SSH keys from /etc/cloudify folder:
    ```
    cp –r /etc/cloudify/.ssh <backup_dir>
    ```
1.  Install new Cloudify HA cluster managers to new hosts (See Cloudify HA build guide. Chapter 3).
1.  Upload and restore snapshot to new master manager:
    ```
    cfy snapshots upload {{ /path/to/the/snapshot/file }} --snapshot-id <snapshot_name>
    cfy snapshots restore <snapshot_name>
    ```
1.  Reinstall agents:
    ```
    cfy agents install --all-tenants
    ```
1.  Apply a license to the master manager.
1.  Start cluster on master manager
1.  Join replicas to the new Cloudify HA cluster
1.  Delete old cluster's hosts

### In-place upgrade

This method allows upgrading Cloudify HA cluster on the same hosts. You would run the risk of not being able to do a rollback should anything happen. In addition, in-place upgrades only work if the IP, AMQP credentials and certificates are left unchanged. Otherwise, you will not be able to communicate with the existing agents.

1.  Create a snapshot and download it

    ```
    cfy snapshots create my_snapshot # --include-metrics #(optional)
    cfy snapshots download my_snapshot -o {{ /path/to/the/snapshot/file }}
    ```
1.  Save SSL certificates and SSH key from /etc/cloudify folder
    ```
    cp -r /etc/cloudify/ssl <backup_dir>
    cp –r /etc/cloudify/.ssh <backup_dir>
    ```
1.  Save RabbitMQ credentials. Credentials can be found in next places:
    * /etc/cloudify/config.yaml
    * /opt/mgmtworker/work/broker_config.json
    * /opt/manager/cloudify-rest.conf
    * /etc/cloudify/cluster

        Default credentials: 

        ```
        Username: **cloudify**
       	Password: **c10udify**
        ```

1.  Teardown Cloudify managers. Repeat the next steps on each manager:

        ```
        sudo cfy_manager remove -f
        sudo yum remove cloudify-manager-install
        ```

1.  Remove CLI profiles of deleted hosts.

    ```
    rm -rf ~/.cloudify/profiles/{{ Manager's IP address }}
    ```
1.  Reboot hosts.
1.  (Optional) Fix failed services.

    ```
    sudo systemctl daemon-reload
    sudo systemctl reset-failed
    ```
1.  Install new managers on the same hosts (See Cloudify HA build guide, chapter3).

1. Put rabbitmq credentials and path to certificate files from old cluster into `/etc/cloudify/config.yaml` before run command `cfy_manager install`:

    ```
    rabbitmq:
    username: <username> #must be stored from old CFY HA cluster
    password: <password> #must be stored from old CFY HA cluster
    ssl_inputs:
    external_cert_path: <backup_dir>/ssl/cloudify_external_cert.pem
    external_key_path: <backup_dir>/ssl/cloudify_external_key.pem
    internal_cert_path: <backup_dir>/ssl/cloudify_internal_cert.pem
    internal_key_path: <backup_dir>/ssl/cloudify_internal_key.pem
    ca_cert_path: <backup_dir>/ssl/cloudify_internal_ca_cert.pem
    ca_key_path: <backup_dir>/ssl/cloudify_internal_ca_key.pem
    ca_key_password: ''
    ```
1.  Create cluster (More information in Cloudify HA Build Guide).

    ```
    cfy profiles use <Leader IP> -t default_tenant -u admin -p <admin password>
    cfy profiles use <Replica1 IP> -t default_tenant -u admin -p <admin password>
    cfy profiles use <Replica2 IP> -t default_tenant -u admin -p <admin password>
    cfy profiles use <Leader IP>
    cfy cluster start --cluster-node-name <Leader name>
    ```
1.  Apply a license to the master manager.
1.  Restore the snapshot.
    ```
    cfy snapshots upload {/path/to/the/snapshot/file} --snapshot-id <snapshot_name>
    cfy snapshots restore
    ```
1.  Join replicas to the cluster
    ```
    cfy profiles use <Replica1 IP>
    cfy cluster join --cluster-node-name <Replica1 name> <Leader IP>
    cfy profiles use <Replica2 IP>
    cfy cluster join --cluster-node-name <Replica2 name> <Leader IP>
    ```
