---
layout: bt_wiki
title: cluster
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/clusters/
---

The `cfy cluster` command is used to manage Cloudify Manager cluster.

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### Status

#### Usage

`cfy cluster status [OPTIONS]`

  Display the current status of the Cloudify Manager cluster

#### Example

{{< highlight  bash  >}}

$ cfy cluster status
Retrieving Cloudify cluster status... [ip=10.239.1.160]
Current cluster status is OK:

Cluster status services:
+--------------------------------+----------+
|            service             |  status  |
+--------------------------------+----------+
| manager                        |    OK    |
| db                             |    OK    |
| broker                         |    OK    |
+--------------------------------+----------+

{{< /highlight >}}

##### Detailed status

For a JSON formatted detailed cluster status use `cfy cluster status --json`


### Update Profile

#### Usage
`cfy cluster update-profile`

Fetch the list of cluster nodes and update the current CLI profile.

Use this to update the profile if nodes are added to the cluster from
another machine.

#### Example

{{< highlight  bash  >}}
$ cfy cluster update-profile
...

{{< /highlight >}}


### Remove Manager Node

#### Usage

`cfy cluster remove [OPTIONS] HOSTNAME`

  Unregister a node from the cluster.

{{% note title="Warning" %}}
  Note that this will not teardown the removed node, only remove it from the
  cluster, it will still contact the cluster's DB and RabbitMQ. Removed
  replicas are not usable as Cloudify Managers, so it is left to the user to
  examine and teardown the node.
{{% /note %}}

  

### List Brokers

#### Usage

`cfy cluster brokers list [OPTIONS]`

  List brokers associated with the cluster.

#### Example

{{< highlight  bash  >}}
$ cfy cluster brokers list

Cluster brokers
+---------+------+---------------------------+
|   name  | port |          networks         |
+---------+------+---------------------------+
| rabbit1 | 5671 | {"default": "10.0.0.132"} |
| rabbit2 | 5671 | {"default": "10.0.0.133"} |
| rabbit3 | 5671 | {"default": "10.0.0.134"} |
+---------+------+---------------------------+

{{< /highlight >}}


### Add Broker

#### Usage

`cfy cluster brokers add [OPTIONS] NAME ADDRESS [PORT] [NETWORKS]`

  Register a broker with the cluster.

  Note that this will not create the broker itself. The broker should have
  been created before running this command.

#### Example

{{< highlight  bash  >}}
$ cfy cluster brokers add new_rabbit 10.0.0.22 '{"new_network": "10.0.0.222"}'
...

{{< /highlight >}}


### Get Broker

#### Usage
`cfy cluster brokers get [OPTIONS] NAME`

  Get full details of a specific broker associated with the cluster.


### Remove Broker

#### Usage
`cfy cluster brokers remove [OPTIONS] NAME`

  Unregister a broker from the cluster.

  Note that this will not uninstall the broker itself. The broker should be
  removed and then disassociated from the broker cluster using cfy_manager
  after being removed from the cluster.

