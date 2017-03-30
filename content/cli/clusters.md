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


### join

#### Usage 
`cfy cluster join [OPTIONS] JOIN_PROFILE`

Join a Cloudify Manager cluster on this manager.

A cluster with at least one machine must already exist. Pass the
  address of at least one member of the cluster as `--cluster-join`. Specifying
  multiple addresses, even all members of the cluster, is recommended, to enable joining the cluster even if some of the current members are
  unreachable. However, it is not required.


#### Optional flags

*  `--timeout INTEGER` - Operation timeout in seconds. The execution itself
                            keeps going, but the CLI stops waiting for
                            it to terminate) [default: {0}]

*  `--cluster-host-ip TEXT`             - The IP of this machine, to use for advertising to
                            the cluster.

*  `--cluster-node-name TEXT`             - The name of this manager machine, to be used internally
                            in the cluster.

&nbsp;
#### Example

```markdown
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
```


### nodes

#### Usage 
`cfy cluster nodes [OPTIONS] COMMAND [ARGS]`

Manage the nodes in the cluster. (Applicable only in `cluster`.)

#### Optional flags

*  `--list`             - Lists the nodes in the cluster.

*  `--remove`           - Remove a node from the cluster.


&nbsp;
#### Example

```markdown
$ cfy cluster nodes list
...

HA Cluster nodes
+-------------------------+--------------+--------+--------+
|           name          |   host_ip    | master | online |
+-------------------------+--------------+--------+--------+
| cloudify_manager_UAFA8Y | 10.239.0.149 | False  |  True  |
| cloudify_manager_W81PXP | 10.239.0.148 |  True  |  True  |
+-------------------------+--------------+--------+--------+

...

$ cfy cluster nodes remove cloudify_manager_W81PXP
...

Node cloudify_manager_W81PXP was removed successfully!

...
```


### set-active

#### Usage 
`cfy cluster set-active NODE_NAME` 

Specify the node that will be the active node (master) in the cluster.


&nbsp;
#### Example

```markdown
$ cfy cluster set-active cloudify_manager_UAFA8Y
...

cloudify_manager_UAFA8Y set as the new active node

...
```

### start

#### Usage 
`cfy cluster start [OPTIONS]`

Start a Cloudify Manager cluster with the current manager as the master.

This initializes all the Cloudify Manager cluster components on the
  current manager, and marks it as the master. After that, other managers can
  join the cluster by passing this manager's IP address and
  encryption key.

#### Optional flags

*  `--timeout INTEGER` - Operation timeout in seconds. The execution itself
                            keeps going, but the CLI stops waiting for
                            it to terminate) [default: {0}]

*  `--cluster-host-ip TEXT`             - The IP of this machine, to use for advertising to
                            the cluster.

*  `--cluster-node-name TEXT`             - The name of this manager machine, to be used internally
                            in the cluster.

*  `--cluster-encryption-key TEXT`             - The encryption key for the cluster, which must be the same for all members. A new key is
                                 generated if not set here.

&nbsp;
#### Example

```markdown
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
```

### status

#### Usage 
`cfy cluster status`

Display the current status of the Cloudify Manager cluster.

&nbsp;
#### Example

```markdown
$ cfy cluster status
...

Cloudify Manager cluster initialized!
Encryption key: w3Z2klB5B6TU6y19VLvszg==

...
```

### update-profile

#### Usage 
`cfy cluster update-profile`

Fetch the list of cluster nodes and update the current profile.

Use this to update the profile if nodes are added to the cluster from
  another machine. Only the cluster nodes that are stored in the profile are
  contacted in the event of a cluster master failure.


&nbsp;
#### Example

```markdown
$ cfy cluster update-profile
...

Fetching the cluster nodes list...
Profile is up to date with 2 nodes

...
```