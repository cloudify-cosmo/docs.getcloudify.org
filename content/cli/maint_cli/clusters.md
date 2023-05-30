---
title: cluster
description: The command is used to manage the Manager cluster.
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/clusters/
---

The `cfy cluster` command is used to manage the {{< param cfy_manager_name >}} cluster.

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### Status

#### Usage

`cfy cluster status [OPTIONS]`

  Display the current status of the {{< param cfy_manager_name >}} cluster

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
  replicas are not usable as {{< param cfy_manager_name >}}, so it is left to the user to
  examine and teardown the node.
{{% /note %}}


### List Managers

#### Usage

`cfy cluster managers list [OPTIONS]`

  List managers associated with the cluster.

#### Example

{{< highlight  bash  >}}
$ cfy cluster managers list

HA Cluster manager nodes
+----------+------------+------------+---------+---------+--------------+----------------+--------------------------------------+--------------------------+-----------------------------+
| hostname | private_ip | public_ip  | version | edition | distribution | distro_release |               node_id                |        last_seen         |           networks          |
+----------+------------+------------+---------+---------+--------------+----------------+--------------------------------------+--------------------------+-----------------------------+
| manager1 | 10.0.0.217 | 10.0.0.217 |  5.0.5  | premium |    centos    |      Core      | 3d5d4977-d2c6-46ef-9871-263f43df52f8 | 2020-02-18 13:55:15.234  | {u'default': u'10.0.0.217'} |
| manager2 | 10.0.0.218 | 10.0.0.218 |  5.0.5  | premium |    centos    |      Core      | 34cd3fbb-f461-44b2-94ed-50b724746483 | 2020-02-18 13:52:45.130  | {u'default': u'10.0.0.218'} |
| manager3 | 10.0.0.219 | 10.0.0.219 |  5.0.5  | premium |    centos    |      Core      | cdb5d801-85d0-446e-a34e-30d3daf6f9c9 | 2020-02-18 13:59:21.530  | {u'default': u'10.0.0.219'} |
+----------+------------+------------+---------+---------+--------------+----------------+--------------------------------------+--------------------------+-----------------------------+

{{< /highlight >}}  


### List Databases

#### Usage

`cfy cluster db-nodes list [OPTIONS]`

  List databases associated with the cluster.

#### Example

{{< highlight  bash  >}}
$ cfy cluster db-nodes list

HA Cluster db nodes
+----------+------------+-------------+
|   name   |    host    | is_external |
+----------+------------+-------------+
| db1      | 10.0.0.220 |    False    |
| db2      | 10.0.0.221 |    False    |
| db3      | 10.0.0.222 |    False    |
+----------+------------+-------------+

{{< /highlight >}}


### Update Database Monitoring

#### Usage

`cfy cluster db-nodes update [OPTIONS]`

  Inform the managers about possible changes to the database nodes in the cluster.  Ultimately
  trigger an update to the database part of the monitoring service (a.k.a. Status Reporter).

#### Example

{{< highlight  bash  >}}
$ cfy cluster db-nodes update

HA Cluster db nodes
+----------+------------+-------------+
|   name   |    host    | is_external |
+----------+------------+-------------+
| db1      | 10.0.0.220 |    False    |
| db2      | 10.0.0.221 |    False    |
| db3      | 10.0.0.222 |    False    |
+----------+------------+-------------+

{{< /highlight >}}


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

`cfy cluster brokers add [OPTIONS] NAME ADDRESS`

  Register a broker with the cluster.

  Note that this will not create the broker itself. The broker should have
  been created before running this command.

#### Optional flags

* `--port INTEGER RANGE` - A non-default network port to use for this component.
* `-n, --networks TEXT` - Networks as a JSON string or as 'net1=ip1;net2=ip2'. This argument can be used multiple times.
* `--node-id TEXT` - {{< param product_name >}}'s auto-generated node id. Run `cfy_manager node get-id` on the node to retrieve it.

#### Example

{{< highlight  bash  >}}
$ cfy cluster brokers add new_rabbit 10.0.0.22 -n '{"new_network": "10.0.0.22"}'

Broker new_rabbit was added successfully!

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

#### Example

{{< highlight  bash  >}}
$ cfy cluster brokers remove new_rabbit

Broker new_rabbit was removed successfully!

{{< /highlight >}}
