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


### nodes

#### Usage 
`cfy cluster nodes [OPTIONS] COMMAND [ARGS]`

Manage the nodes in the cluster. (Applicable only in `cluster`.)

#### Optional flags

*  `--list`             - Lists the nodes in the cluster.

*  `--remove`           - Remove a node from the cluster.


### set-active

#### Usage 
`cfy cluster set-active NODE_NAME` 

Specify the node that will be the active node (master) in the cluster.


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


### status

#### Usage 
`cfy cluster status`

Display the current status of the Cloudify Manager cluster.


### update-profile

#### Usage 
`cfy cluster update-profile`

Fetch the list of cluster nodes and update the current profile.

Use this to update the profile if nodes are added to the cluster from
  another machine. Only the cluster nodes that are stored in the profile are
  contacted in the event of a cluster master failure.

