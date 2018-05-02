---
layout: bt_wiki
title: cluster
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 32
---

The `cfy cluster` command is used to manage clusters of tenants in Cloudify Manager.

#### Optional flags

These will work on each command

*  `-v, --verbose` -    Show verbose output. You can supply this up to three
                        times (i.e. -vvv)
*  `-h, --help` -       Show this message and exit.

## Commands

### Start

#### Usage
`cfy cluster start [OPTIONS]`

Start a Cloudify Manager cluster with the current manager as the master.

This initializes all the Cloudify Manager cluster components on the
  current manager, and marks it as the master. After that, other managers can
  join the cluster by passing this manager's IP address and
  encryption key.

#### Optional flags

*  `--timeout INTEGER` - Operation timeout in seconds (The execution itself will keep going, but the CLI will stop waiting for it to terminate) [default: 900]
*  `-o, --options TEXT` - Additional options for the cluster node configuration (Can be provided as wildcard based paths (*.yaml, /my_inputs/, etc..) to YAML files, a JSON string or as key1=value1;key2=value2). This argument can be used multiple times
* `--cluster-host-ip TEXT` - The IP of this machine to use for advertising to the cluster
* `--cluster-node-name TEXT` - Name of this manager machine to be used internally in the cluster

#### Example

{{< highlight  bash  >}}
$ cfy cluster start
...

Creating a new Cloudify Manager cluster
2017-03-30T08:53:40 Started /opt/manager/env/bin/create_cluster_node.
2017-03-30T08:53:40 Starting /opt/manager/env/bin/create_cluster_node...
.
.
.
2017-03-30T08:55:32 commands.create_cluster_node:INFO: Starting filesystem replication
2017-03-30T08:55:35 commands.create_cluster_node:INFO: HA Cluster configuration complete
Cloudify Manager cluster started at 10.239.0.148.

...
{{< /highlight >}}


### Join

#### Usage
`cfy cluster join [OPTIONS] JOIN_PROFILE`

Join a Cloudify Manager cluster on this manager.

A cluster with at least one machine must already exist. Pass the address of at least one member of the cluster as `--cluster-join`. Specifying multiple addresses, even all members of the cluster, is recommended, to enable joining the cluster even if some of the current members are unreachable. However, it is not required.

#### Optional flags

*  `--timeout INTEGER` - Operation timeout in seconds (The execution itself will keep going, but the CLI will stop waiting for it to terminate) [default: 900]
*  `-o, --options TEXT` - Additional options for the cluster node configuration (Can be provided as wildcard based paths (*.yaml, /my_inputs/, etc..) to YAML files, a JSON string or as key1=value1;key2=value2). This argument can be used multiple times
* `--cluster-host-ip TEXT` - The IP of this machine to use for advertising to the cluster
* `--cluster-node-name TEXT` - Name of this manager machine to be used internally in the cluster


#### Example

{{< highlight  bash  >}}
$ cfy cluster join 10.239.0.148
...

Joining the Cloudify Manager cluster: [u'10.239.0.148']
2017-03-30T09:14:28 Started /opt/manager/env/bin/create_cluster_node.
2017-03-30T09:14:28 Starting /opt/manager/env/bin/create_cluster_node...
.
.
.
2017-03-30T09:14:33 commands.create_cluster_node:INFO: Starting database
Node joined the cluster, waiting for database replication to be established
Cloudify Manager joined cluster successfully.

...
{{< /highlight >}}


### Update Profile

#### Usage
`cfy cluster update-profile`

Fetch the list of cluster nodes and update the current profile.

Use this to update the profile if nodes are added to the cluster from
another machine. Only the cluster nodes that are stored in the profile are
contacted in the event of a cluster master failure.

This means that when a cluster administrator adds or removes a node from the cluster, all users must run this command to update their CLI profile.

#### Example

{{< highlight  bash  >}}
$ cfy cluster update-profile
...

Fetching the cluster nodes list...
Profile is up to date with 2 nodes

...
{{< /highlight >}}


### Nodes

#### Usage
`cfy cluster nodes [OPTIONS] COMMAND [ARGS]`

Manage the nodes in the cluster. (Applicable only in `cluster`.)

#### Subcommands

*  `list`             - Lists the nodes in the cluster.

*  `remove`           - Remove a node from the cluster.


#### list

Display a table with basic information about the nodes in the cluster. This is the primary way of retrieving the cluster status.

#### Example

{{< highlight  bash  >}}
$ cfy cluster nodes list
HA Cluster nodes
+----------------+-----------+---------+--------+-------------------+----------+-----------+
|      name      |  host_ip  |  state  | consul | cloudify services | database | heartbeat |
+----------------+-----------+---------+--------+-------------------+----------+-----------+
| manager_node_1 | 10.10.1.1 |  leader |   OK   |         OK        |    OK    |     OK    |
| manager_node_2 | 10.10.1.2 | replica |   OK   |         OK        |    OK    |     OK    |
| manager_node_3 | 10.10.1.3 | replica |   OK   |         OK        |    OK    |     OK    |
+----------------+-----------+---------+--------+-------------------+----------+-----------+
{{< /highlight >}}


#### remove

Unregister a node from the cluster.

Note that this will not teardown the removed node, only remove it from the
cluster. Removed replicas are not usable as Cloudify Managers, so it is
left to the user to examine and teardown the node.

#### Example

{{< highlight  bash  >}}
$ cfy cluster nodes remove cloudify_manager_W81PXP
Node cloudify_manager_W81PXP was removed successfully!
{{< /highlight >}}


### Set Active

#### Usage
`cfy cluster set-active NODE_NAME`

Specify the node that will be the active node (master) in the cluster.


#### Example

{{< highlight  bash  >}}
$ cfy cluster set-active cloudify_manager_UAFA8Y
...

cloudify_manager_UAFA8Y set as the new active node

...
{{< /highlight >}}

### Status

#### Usage
`cfy cluster status`

Display the current installation status of the Cloudify Manager cluster.

#### Example

{{< highlight  bash  >}}
$ cfy cluster status
...

Cloudify Manager cluster initialized!

...
{{< /highlight >}}
