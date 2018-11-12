---
title: Cloudify High Availability - All-in-one
category: Cluster Installation
draft: false
weight: 100
---
## Environment

Cloudify HA cluster builds on three Cloudify managers. To deploy 3 Cloudify Managers, please checkout - [Installing Cloudify Manager]({{< relref "install_maintain/installation/_index.md" >}})

### Network Ports Requirements

In addition to Cloudify Manager single node network requirements, the 3-node cluster has some network requirements as well.

**Cloudify Manager HA cluster:**

| Source | <-> | Target | Port | Description |
|--------|-----------|--------|------|-------------|
| Cloudify Manager | <-> | Cloudify Manager | 8300 | Internal port for the distributed key/value store. |
| Cloudify Manager | <-> | Cloudify Manager | 8301 | Internal port for TCP and UDP heartbeats. Must be accessible for both TCP and UDP. |
| Cloudify Manager | <-> | Cloudify Manager | 8500 | Port used for outage recovery in the event that half of the nodes in the cluster failed. |
| Cloudify Manager | <-> | Cloudify Manager | 22000 | Filesystem replication port. |
| Cloudify Manager | <-> | Cloudify Manager | 15432 | Database replication port. |

## Build Cloudify HA cluster

Create a cluster when you completed installing your Cloudify Managers. When you run the `cfy cluster start` command on a first Cloudify Manager, high availability is configured automatically. Use the `cfy cluster join` command, following installation, to add more Cloudify Managers to the cluster. The Cloudify Managers that you join to the cluster must be in an empty state, otherwise the operation will fail.

1.  Add profiles of all three Cloudify managers on Cloudify cli:

    ```
       cfy profiles use <Leader IP> -t default_tenant -u admin -p <admin password>
       cfy profiles use <Replica1 IP> -t default_tenant -u admin -p <admin password>
       cfy profiles use <Replica2 IP> -t default_tenant -u admin -p <admin password>
    ```
1.  Start cluster:

    ```
       cfy profiles use <Leader IP>
       cfy cluster start --cluster-node-name <Leader name>
    ```
1.  Switch to second profile:

    ```
       cfy profiles use <Replica1 IP>
    ```
1.  Join the manager to the cluster:

    ```
       cfy cluster join --cluster-node-name <Replica1 name> <Leader IP>
    ```
1.  Switch to third profile:

    ```
       cfy profiles use <Replica2 IP>
    ```
1.  Join the manager to the cluster:

    ```
       cfy cluster join --cluster-node-name <Replica2 name> <Leader IP>
    ```

## Cloudify HA cluster management

Cloudify HA cluster manages in the same way as a single Cloudify manager, but there are small differences when a leader changing. 

Cloudify CLI profile contains all information about managers of the HA Cluster and if the leader manager does not answer Cloudify CLI starts finding new leader.

If new profile is created for existing cluster, or new nodes joined to the cluster the command should be run to retrieve the information about all cluster managers and upgrade the profile:
```
cfy cluster update-profile
```

When using Cloudify WEB UI -  Cloudify HA cluster does not provide out of the box mechanism to update the WEB UI  to switch to a new leader due to Security limitations. Cloudify WEB UI User should make sure to have a mechanism to be aware which Cloudify Manager is the current leader. There are several well known mechanisms to achieve this, for example using a Load Balancer, using a Proxy such as HAProxy and configure it to poll the cluster IPs,  or using a CNAME instead of explicit IPs.

You can also implement a [load balancer health check]({{< relref "working_with/manager/high-availability-clusters.md#implementing-a-load-balancer-health-check" >}}).