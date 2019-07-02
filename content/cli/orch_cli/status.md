---
layout: bt_wiki
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

#### Optional flags
This command supports the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy status
...

Retrieving manager services status... [ip=10.239.2.241]

Services:
+--------------------------------+---------+
|            service             |  status |
+--------------------------------+---------+
| Management Worker              | running |
| RabbitMQ                       | running |
| AMQP Postgres                  | running |
| PostgreSQL                     | running |
| Manager Rest-Service           | running |
| Webserver                      | running |
| Cloudify Stage                 | running |
+--------------------------------+---------+

...

## in cluster mode

Retrieved manager services status... [ip=10.239.2.162]

Services:
+--------------------------------+---------+
|            service             |  status |
+--------------------------------+---------+
| AMQP Postgres                  | running |
| RabbitMQ                       | running |
| PostgreSQL                     | running |
| Syncthing                      | running |
| Management Worker              | running |
| Webserver                      | running |
| Cloudify Stage                 | running |
| Manager Rest-Service           | running |
| Consul                         | running |
+--------------------------------+---------+
...
{{< /highlight >}}
