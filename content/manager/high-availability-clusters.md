---
layout: bt_wiki
title: High Availability Clusters
category: Manager
draft: false
weight: 899
---
# Using Clusters to Provide High Availability

If you have a Premium version of Cloudify Manager, an admin user can create a cluster of Cloudify Managers to enable high availability. One Cloudify Manager is designated as the active Cloudify Manager and the others are designated as hot standbys that are constant mirrors of the data of the active. In the event that the master Cloudify Manager fails, an automatic failover switch activates one of the hot standbys as the master.

 It is recommended that you have three Cloudify Managers in a cluster for the following reasons:

* To ensure resilience in the case of a failure
* To reduce the probability of multiple hot standbys being activated as the master in the event of a network failure (split-brain.) 

The cluster is dynamic, meaning that you do not need to specify the size of the cluster in advance. 

## Creating a Cluster
Create a cluster after you complete bootstrapping your Cloudify Managers. When you run the `cluster-start` command on a first Cloudify Manager, high availability is configured automatically. Use the `cluster-join` command, following bootstrapping, to add more Cloudify Managers to the cluster. The Cloudify Managers that you join to the cluster must be in an empty state, otherwise the operation will fail. 

The data on each Cloudify Manager mirrors that of the active Cloudify Manager. Operations can only be performed on the active manager in the cluster, but are also reflected on the standby managers. Similarly, upload requests can only be sent to the active Cloudify Manager.

Within the cluster, Cloudify uses the Consul utility and internal health checks to detect when the active Cloudify Manager is down, and which standby will become active.

### Create Cluster Process
1. Complete bootstrapping a Cloudify Manager.
2. Run `cluster-start` on the bootstrapped manager to designate this Cloudify Manager instance as the active manager.
3. Run `cluster-add` on two other clean Cloudify Manager instances.
4. (Optional) To remove a Cloudify Manager from the cluster, run `cluster-remove-node`.

## Failure of the Master Cloudify Manager
As already mentioned, in the event that the active Cloudify Manager fails, one of the hot standbys is activated. It is important that the user investigates and fixes the issues that caused the original master to fail, or adds another Cloud Manager to the cluster, so that high availability is maintained, and to avoid having a single point of failure.

Because operations cannot be performed on a non-active manager, you will need to connect to that Cloudify Manager using the SSH protocol.

## Important Considerations
Be aware of the following considerations when you are implementing clustering.

* If the active Cloudify Manager was processing a workflow at the time it fails, the new active manager does not resume and complete the workflow.
* Policies are not synchronized between Cloudify Managers in the cluster.
* If there is a loss of connection between the Cloudify Managers in the cluster, they independently assume the `active` role. When the connection is resumed, the most recently updated Cloudify Manager becomes the active manager. Data that was accumulated on the other Cloudify Manager instances during the disconnection is not synchronized, so is lost. 
* A Cloudify Manager that is down remains in the cluster unless you remove it. To remove a Cloudify Manager, run `cluster-remove-node`.


