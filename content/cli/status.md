---
layout: bt_wiki
title: status
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 210
---

The `cfy status` command is used to display the status of a running Cloudify Manager.

To use the command you must `cfy use -t MANAGEMENT_IP` first.


#### Usage
`cfy status`

Show a list of the services running on the manager, whether it is in maintenance-mode, and its REST protocol. 


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy status
...

Retrieving manager services status... [ip=10.239.2.241]

Services:
+--------------------------------+---------+
|            service             |  status |
+--------------------------------+---------+
| InfluxDB                       | running |
| Celery Management              | running |
| Logstash                       | running |
| RabbitMQ                       | running |
| AMQP InfluxDB                  | running |
| PostgreSQL                     | running |
| Manager Rest-Service           | running |
| Cloudify Stage                 | running |
| Riemann                        | running |
| Webserver                      | running |
+--------------------------------+---------+

...

## in cluster mode

Retrieved manager services status... [ip=10.239.2.162]

Services:
+--------------------------------+---------+
|            service             |  status |
+--------------------------------+---------+
| InfluxDB                       | running |
| Logstash                       | running |
| AMQP InfluxDB                  | running |
| RabbitMQ                       | running |
| PostgreSQL                     | running |
| Syncthing                      | running |
| Celery Management              | running |
| Webserver                      | running |
| Cloudify Stage                 | running |
| Manager Rest-Service           | running |
| Consul                         | running |
| Riemann                        | running |
+--------------------------------+---------+
...
{{< /gsHighlight >}}