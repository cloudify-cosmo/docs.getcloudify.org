---
layout: bt_wiki
title: status
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 210
---

The `cfy status` command is used to print out the status of a running manager.

To use the command you must `cfy use -t MANAGEMENT_IP` first.


Usage: `cfy status`

Show a list of the services running on the manager, whether it is in maintenance-mode or not and its REST protocol. 


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy status
...

Retrieving manager services status... [ip=52.31.106.71]

Services:
+--------------------------------+---------+
|            service             |  status |
+--------------------------------+---------+
| InfluxDB                       | running |
| Celery Management              | running |
| Logstash                       | running |
| RabbitMQ                       | running |
| AMQP InfluxDB                  | running |
| Manager Rest-Service           | running |
| Cloudify UI                    | running |
| Webserver                      | running |
| Riemann                        | running |
| Elasticsearch                  | running |
+--------------------------------+---------+

...
{{< /gsHighlight >}}