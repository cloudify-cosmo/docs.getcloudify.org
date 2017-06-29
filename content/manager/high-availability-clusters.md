---
layout: bt_wiki
title: Using Clusters to Provide High Availability
category: Manager
draft: false
weight: 850
---

If you have a Premium version of Cloudify Manager, an `admin` user can create a cluster of Cloudify Managers to enable high availability. 

It is recommended that you have three Cloudify Managers in a cluster for the following reasons:

* To ensure resilience in the case of a failure
* To reduce the probability of multiple hot standbys being activated as the active Manager in the event of a network failure (split-brain.) 

A Cloudify Manager cluster is dynamic, meaning that you do not need to specify the size of the cluster in advance. 

For more information about working with clusters, refer to the CLI [cluster command]({{< relref "cli/clusters.md" >}}).

## How High Availability Works 

Using Consul, one Cloudify Manager is designated as the active Cloudify Manager and the others are designated as hot standbys that are constant mirrors of the data of the active Manager. In the event that the active Cloudify Manager health check fails, an automatic failover switch activates one of the hot standbys as the active Manager. Consul works on every Cloudify Manager role via the REST API. It works with an odd number of nodes and uses a majority election mechanism.

{{% gsNote title="Note" %}}
Policies are not synchronized between Cloudify Managers in the cluster.
{{% /gsNote %}}

#### Health Checks
To determine the health of the active Cloudify Manager node, the following are verifed:

* The PostgreSQL database is up (listening on the port)
* The PostgreSQL database responds to a simple ```select 1``` call
* The PostgreSQL database follows correct active master (or if it’s a master on an active Manager)
* All services are up on the active Manager node (with the exception of rabbitmq and mgmtworker, which run on the hot standbys)
* A Consul internal health check
* A simple heartbeat is sent every 15 seconds

A Cloudify Manager that is down remains in the cluster unless you remove it. To remove a Cloudify Manager, run `cfy cluster nodes remove`.

#### Failure of the Master Cloudify Manager
In the event that the active Cloudify Manager fails, it is important to investigate and fix the issues that caused the original master to fail, or add another Cloud Manager to the cluster, so that high availability is maintained, and to avoid having a single point of failure.

{{% gsNote title="Note" %}}
Because operations cannot be performed on a non-active Manager, you will need to connect to that Cloudify Manager using the SSH protocol.
{{% /gsNote %}}

#### Selecting a New Active Manager
 To manage the situation in which the active Cloudify Manager fails one or more health checks, all Managers in the cluster constantly monitor the Consul `next master` function. When one of the standby Manager instances in the cluster detects that `next master` is pointing to it, it starts any services that are not running (RabbitMQ and MgmtWorker) and changes PostgreSQL to master state. When the `active` Manager changes, the hot standby nodes begin to follow it with filesync and database. 

 If the original active Cloudify Manager was processing a workflow at the time it fails, the newly active Manager does not resume and complete that workflow.

 #### Managing Network Failure

If there is a loss of connection between the Cloudify Managers in the cluster, all isolated nodes might independently start RabbitMQ and MgmtWorker and assume the `active` role (split brain). When the connection is resumed, the Cloudify Manager with the most-recently updated database becomes the `active` Manager. Data that was accumulated on the other Cloudify Manager cluster nodes during the disconnection is not synchronized, so is lost. 


## Creating a Cluster

Create a cluster after you complete bootstrapping your Cloudify Managers. When you run the `cluster start` command on a first Cloudify Manager, high availability is configured automatically. Use the `cluster join` command, following bootstrapping, to add more Cloudify Managers to the cluster. The Cloudify Managers that you join to the cluster must be in an empty state, otherwise the operation will fail. 

The data on each Cloudify Manager mirrors that of the active Cloudify Manager. Operations can only be performed on the active Manager in the cluster, but are also reflected on the standby Managers. Similarly, upload requests can only be sent to the active Cloudify Manager.

Within the cluster, Cloudify uses the Consul utility and internal health checks to detect when the active Cloudify Manager is down, and which standby will become active.


### Create Cluster Process
1. Complete bootstrapping a Cloudify Manager.
2. Run `cluster start` on the bootstrapped Manager to designate this Cloudify Manager instance as the active Manager.
3. Run `cluster join` on two other clean Cloudify Manager instances.
4. (Optional) To remove a Cloudify Manager from the cluster, run `cfy cluster nodes remove <node-id>`.

{{< gsHighlight  bash  >}}
cfy profiles use <master IP>
cfy cluster start (on the Manager that you want to set active)
cfy profiles use <secondary IP>
cfy cluster join --cluster-host-ip <new cfy manager IP> --cluster-node-name <some name> <master ip> (on a Manager that you want to add to the cluster)
{{< /gsHighlight >}}

{{% gsNote title="Note" %}}
`--cluster-host-ip` must be an IP that is visible by other Managers in the cluster.
{{% /gsNote %}}

## Upgrading Clusters

Cloudify Manager snapshots do not include clusters. If you restore the snapshot of a Cloudify Manager that was the active Manager in a cluster to a new version, you must [join]({{< relref "cli/clusters.md" >}}) the other Cloudify Managers to recreate the cluster. Managers in a cluster must all be the same Cloudify version.

### Upgrade Cluster Process

**Upgrading via Snapshot Restore on a New VM**<br>
In this process you create new VMs for all Cloudify Managers that will be part of the cluster.

1. Create a snapshot of the active Cloudify Manager.
2. Boostrap three Cloudify Managers with the upgraded version.
3. Restore the snapshot to one of the Cloudify Manager instances.
4. Run `cluster start` on the Manager with the restored snapshot, to designate this Cloudify Manager instance as the active Manager.
5. Run `cluster join` on the two other bootstrapped Cloudify Manager instances to designate them as hot standbys. 

**Upgrading via Snapshot Restore on an Existing VM**<br>
In this process you teardown the active Cloudify Manager and bootstrap a new one on the same VM. You create new VMs for the Cloudify Managers that will become the hot standbys in the cluster.

1. Create a snapshot of the active Cloudify Manager.
2. Perform a [teardown]({{< relref "cli/teardown.md" >}}) on the active Cloudify Manager machine.
3. Bootstrap an updated Manager on the existing machine.
4. Restore the snapshot to the Cloudify Manager instance.
5. Run `cluster start` to designate this Cloudify Manager instance as the active Manager.
6. Boostrap two new Cloudify Manager VMs with the upgraded version.
7. Run `cluster join` on the two new bootstrapped Cloudify Manager instances to designate them as hot standbys. 



## Additional Information
### Cluster Tools
The following tools are used to facilitate clustering in Cloudify.

* [Consul](https://www.consul.io/docs/) - Discovering and configuring services in the infrastructure
* [PostgreSQL](https://wiki.postgresql.org/wiki/Replication,_Clustering,_and_Connection_Pooling) Cluster mechanism (master/follow states)
* [Synchthing](https://docs.syncthing.net/) - File system replicaton

### Services Run with Cluster
The cluster function runs the following services:

* `check-runner`
* `consul-watcher`
* `consul-recovery-watcher`
* `handler-runner`
* `iptables-restore`

### Security
The following security mechanisms are implemented.

* SSL is used internally. All SSL certificates and keys for clustering are stored in `/etc/cloudify/cluster-ssl`.
* The only file that runs with `sudo` privileges is `/opt/cloudify/sudo_trampoline.py`.
* All other services are run with users: `cfyuser`, `cfyuser_consul`, `cfyuser_syncthing`, `postgres`, they belong to cluster group

### Upgrading Clusters

Cloudify Manager snapshots do not include clusters. If you restore the snapshot of a Cloudify Manager that was the active Manager in a cluster, you must [rejoin]({{< relref "cli/clusters.md" >}}) the other Cloudify Managers to recreate the cluster.

### Troubleshooting

The primary log file for troubleshooting is ` /var/log/cloudify/cloudify-cluster.log`. All services log to 	`journalId`.


