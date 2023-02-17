+++
title = "External services"
description = "Tips on including external services into _Status Reporter_'s monitoring routine"
weight = 20
alwaysopen = false
+++

The easiest method to monitor an external service with the {{< param product_name >}}'s
_Status Reporter_ is to add additional scraping targets to existing Prometheus installation (e.g.
the one running with {{< param cfy_manager_name >}}).  It is not the only way.  An alternative is
to configure an additional external Prometheus instance (along with the appropriate exporter), which
handles the service, and have it [federated]({{< relref "/cloudify_manager/architecture/monitoring/federation.md">}})
with existing Prometheus.  The latter is more complicated, but has its advantages (residency,
load-distribution etc.).  This guide will focus on the former approach, which is probably the
simplest, and, in most cases, the best one.

# Prerequisites

In order to add metrics of external services to {{< param product_name >}}'s _Status Reporter_,
additional [scraping targets should be configured](#examples).  For example Prometheus's
[file-based service discovery](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#file_sd_config)
could be used to do that.

{{% note title="Note" %}}
All metrics parsed by {{< param product_name >}}'s _Status Reporter_ must come with
a `host` label.  This is how it distinguishes between different nodes.  Label's value should match
the `host` column of [db-nodes]({{< relref "/cli/maint_cli/clusters.md" >}}#list-databases) or
[brokers]({{< relref "/cli/maint_cli/clusters.md" >}}#list-brokers) lists, or the `private_ip` of
[managers]({{< relref "/cli/maint_cli/clusters.md" >}}#list-managers) list.
{{% /note %}}

# Database (PostgreSQL compliant) monitoring

## Requirements

These two services should be accessible from the node on which Prometheus is running (e.g. the
node with {{< param cfy_manager_name >}} installed):
* Prometheus's [postgres_exporter](https://github.com/prometheus-community/postgres_exporter#postgresql-server-exporter)
  which monitors an external database must be deployed.  The exporter listens on port 9187
  by default,
* Prometheus's [node_exporter](https://github.com/prometheus/node_exporter#node-exporter) to monitor
  the status of system services (programs running on the node, managed by process supervisor, e.g.
  supervisor or systemd).  The exporter listens on port 9100 by default.


## PostgreSQL recording rules

_Status Reporter_ queries Prometheus for the ```(postgres_healthy) or (postgres_service)``` metrics.
These are configured as Prometheus's
[recording rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/) in
`/etc/prometheus/alerts/postgres.yml` file:

{{< highlight yaml >}}
- record: postgres_healthy
  expr: pg_up{job="postgresql"} == 1 and up{job="postgresql"} == 1
{{< /highlight >}}
: combines two metrics from the
[postgres_exporter]({{< relref "/cloudify_manager/architecture/monitoring/components.md" >}}#additional-components):
`up` monitors status of postgres_exporter and `pg_up` – that of PostgreSQL server.  Both metrics
should have values of `1`.

{{< highlight yaml >}}
- record: postgres_service
  expr: postgres_service_supervisord
- record: postgres_service_supervisord
  expr: sum by (host, name) (node_supervisord_up{name=~"(etcd|patroni|node_exporter|prometheus|postgres_exporter|postgresql-14|nginx)"})
  labels:
    process_manager: supervisord
{{< /highlight >}}
: returns a list of running services (as reported by the
[node_exporter]({{< relref "/cloudify_manager/architecture/monitoring/components.md" >}}#common-components)),
which could be relevant for determining database node's status.  The above rules are meant for
a system which is operated with [supervisord](http://supervisord.org/).  In case
[systemd](https://systemd.io/) is the process supervisor of choice, update the rules accordingly,
e.g.:
{{< highlight yaml >}}
- record: postgres_service
  expr: postgres_service_systemd
- record: postgres_service_systemd
  expr: sum by (host, name) (node_systemd_unit_state{name=~"(etcd|patroni|node_exporter|prometheus|postgres_exporter|postgresql-14|nginx).service", state="active"})
  labels:
    process_manager: systemd
{{< /highlight >}}

## Expected results

The following method might be used to test PostgreSQL metrics (for other methods look
[here]({{< relref "/cloudify_manager/architecture/monitoring/access.md" >}})):

{{< highlight bash >}}
curl "http://localhost:9090/monitoring/api/v1/query?query=postgres_healthy%20or%20postgres_service"
{{< /highlight >}}

For an environment with a single database, the output might be similar to this one.  Notice all
metrics are of value `1`, which suggests that (but is not synonymous with) the database service
is healthy.

{{< highlight json >}}
{
    "data": {
        "result": [
            {
                "metric": {
                    "__name__": "postgres_healthy",
                    "host": "172.20.0.3",
                    "instance": "localhost:9187",
                    "job": "postgresql"
                },
                "value": [
                    1674055762.262,
                    "1"
                ]
            },
            {
                "metric": {
                    "__name__": "postgres_service",
                    "host": "172.20.0.3",
                    "name": "nginx",
                    "process_manager": "supervisord"
                },
                "value": [
                    1674055762.262,
                    "1"
                ]
            },
            {
                "metric": {
                    "__name__": "postgres_service",
                    "host": "172.20.0.3",
                    "name": "node_exporter",
                    "process_manager": "supervisord"
                },
                "value": [
                    1674055762.262,
                    "1"
                ]
            },
            {
                "metric": {
                    "__name__": "postgres_service",
                    "host": "172.20.0.3",
                    "name": "postgres_exporter",
                    "process_manager": "supervisord"
                },
                "value": [
                    1674055762.262,
                    "1"
                ]
            },
            {
                "metric": {
                    "__name__": "postgres_service",
                    "host": "172.20.0.3",
                    "name": "postgresql-14",
                    "process_manager": "supervisord"
                },
                "value": [
                    1674055762.262,
                    "1"
                ]
            },
            {
                "metric": {
                    "__name__": "postgres_service",
                    "host": "172.20.0.3",
                    "name": "prometheus",
                    "process_manager": "supervisord"
                },
                "value": [
                    1674055762.262,
                    "1"
                ]
            }
        ],
        "resultType": "vector"
    },
    "status": "success"
}
{{< /highlight >}}

# Message Queue (RabbitMQ compliant) monitoring

## Requirements

These two services should be accessible from the node on which Prometheus is running (e.g. the
node with {{< param cfy_manager_name >}} installed):
* RabbitMQ's [rabbitmq_prometheus plugin](https://www.rabbitmq.com/prometheus.html#overview-prometheus)
  must be enabled on message queue nodes.  The plugin/exporter listens on port 15692 by default,
* Prometheus's [node_exporter](https://github.com/prometheus/node_exporter#node-exporter) to monitor
  the status of system services (programs running on the node, managed by process supervisor, e.g.
  supervisor or systemd).  The exporter listens on port 9100 by default.

## RabbitMQ recording rules

_Status Reporter_ queries Prometheus for the ```(rabbitmq_healthy) or (rabbitmq_service)``` metrics.
These are configured as Prometheus's
[recording rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/) in
`/etc/prometheus/alerts/rabbitmq.yml` file:

{{< highlight yaml >}}
- record: rabbitmq_healthy
  expr: sum by(host, instance, job, monitor) (up{job="rabbitmq"}) == 1
{{< /highlight >}}
: is a simple metric from the
[rabbitmq_prometheus plugin](https://www.rabbitmq.com/prometheus.html#overview-prometheus) which
monitors status of RabbitMQ service.  Should be of value `1`.

{{< highlight yaml >}}
- record: rabbitmq_service
  expr: rabbitmq_service_supervisord
- record: rabbitmq_service_supervisord
  expr: sum by (host, name) (node_supervisord_up{name=~"(node_exporter|prometheus|cloudify-rabbitmq|nginx)"})
  labels:
    process_manager: supervisord
{{< /highlight >}}
: returns a list of running services (as reported by the
[node_exporter]({{< relref "/cloudify_manager/architecture/monitoring/components.md" >}}#common-components)),
which could be relevant for determining message queue node's status.  The above rules are meant for
a system which is operated with [supervisord](http://supervisord.org/).  In case
[systemd](https://systemd.io/) is the process supervisor of choice, update the rules accordingly,
e.g.:
{{< highlight yaml >}}
- record: rabbitmq_service
  expr: rabbitmq_service_systemd
- record: rabbitmq_service_systemd
  expr: sum by (host, name) (node_systemd_unit_state{name=~"(node_exporter|prometheus|cloudify-rabbitmq|nginx).service", state="active"})
  labels:
    process_manager: systemd
{{< /highlight >}}

## Expected results

The following method might be used to test RabbitMQ metrics (for other methods look
[here]({{< relref "/cloudify_manager/architecture/monitoring/access.md" >}})):

{{< highlight bash >}}
curl "http://localhost:9090/monitoring/api/v1/query?query=rabbitmq_healthy%20or%20rabbitmq_service"
{{< /highlight >}}

{{< highlight json >}}
{
    "data": {
        "result": [
            {
                "metric": {
                    "__name__": "rabbitmq_healthy",
                    "host": "172.20.0.3",
                    "instance": "localhost:15692",
                    "job": "rabbitmq"
                },
                "value": [
                    1674062821.859,
                    "1"
                ]
            },
            {
                "metric": {
                    "__name__": "rabbitmq_service",
                    "host": "172.20.0.3",
                    "name": "cloudify-rabbitmq",
                    "process_manager": "supervisord"
                },
                "value": [
                    1674062821.859,
                    "1"
                ]
            },
            {
                "metric": {
                    "__name__": "rabbitmq_service",
                    "host": "172.20.0.3",
                    "name": "nginx",
                    "process_manager": "supervisord"
                },
                "value": [
                    1674062821.859,
                    "1"
                ]
            },
            {
                "metric": {
                    "__name__": "rabbitmq_service",
                    "host": "172.20.0.3",
                    "name": "node_exporter",
                    "process_manager": "supervisord"
                },
                "value": [
                    1674062821.859,
                    "1"
                ]
            },
            {
                "metric": {
                    "__name__": "rabbitmq_service",
                    "host": "172.20.0.3",
                    "name": "prometheus",
                    "process_manager": "supervisord"
                },
                "value": [
                    1674062821.859,
                    "1"
                ]
            }
        ],
        "resultType": "vector"
    },
    "status": "success"
}
{{< /highlight >}}


# Examples

Assume there are:
* an external PostgreSQL-compatible database running on host 172.20.0.5, which has a corresponding
  postgres_exporter monitoring it, running on the same host (172.20.0.5) and listening on its
  default port (9187), accompanied by node_exporter listening on port 9100,
* an external RabbitMQ service with rabbitmq_prometheus plugin enabled on host 172.20.0.6, serving
  metrics on plugin's default port (15692) with node_exporter listening on port 9100.

In order to make the metrics available for _Status Reporter_:

1. Make sure postgres_exporter has the
   [necessary recording rules](#postgresql-recording-rules) configured.

2. Make sure rabbitmq_prometheus has the
   [necessary recording rules](#message-queue-rabbitmq-compliant-monitoring) configured.

3. Consider adding the following contents to your configuration files:

`/etc/prometheus/targets/other_postgres.yml`
: {{< highlight yaml >}}
- targets: ["172.20.0.5:9187", "172.20.0.5:9100"]
  labels: {"host": "172.20.0.5"}
{{< /highlight >}}

`/etc/prometheus/targets/other_rabbits.yml`
: {{< highlight yaml >}}
- targets: ["172.20.0.6:15692", "172.20.0.6:9100"]
  labels: {"host": "172.20.0.6"}
{{< /highlight >}}
