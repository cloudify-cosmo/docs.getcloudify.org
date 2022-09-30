---
title: status
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/status/
---

The `cfy status` command is used to display the status of a running Cloudify Manager.

To use the command you must `cfy profiles use -t MANAGEMENT_IP` first.


#### Usage
`cfy status`

Show a list of the services running on the manager, whether it is in maintenance-mode, and its REST protocol.
In cluster mode, PostgreSQL and RabbitMQ don't run on the manager, so it verifies their connection.


#### Optional flags
This command supports the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy status
...

Retrieving manager services status... [ip=10.239.2.241]

Services:
+--------------------------------+--------+
|            service             | status |
+--------------------------------+--------+
| Cloudify Console               | Active |
| PostgreSQL                     | Active |
| AMQP-Postgres                  | Active |
| Manager Rest-Service           | Active |
| RabbitMQ                       | Active |
| Webserver                      | Active |
| Cloudify Composer              | Active |
| Management Worker              | Active |
+--------------------------------+--------+

...

## In Cluster Mode

Retrieved manager services status... [ip=10.239.2.162]

Services:
+--------------------------------+--------+
|            service             | status |
+--------------------------------+--------+
| Cloudify Console               | Active |
| Manager Rest-Service           | Active |
| PostgreSQL                     | Active |
| AMQP-Postgres                  | Active |
| File Sync Service              | Active |
| RabbitMQ                       | Active |
| Webserver                      | Active |
| Cloudify Composer              | Active |
| Management Worker              | Active |
+--------------------------------+--------+
...
{{< /highlight >}}
