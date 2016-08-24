---

title: status



weight: 210
---

The `cfy status` command is used to print out the status of a running manager.

To use the command you should `cfy use -t MANAGEMENT_IP` or `cfy bootstrap` first.  See [cfy bootstrap]({{< relref "cli/bootstrap.md" >}}) for more information.


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
