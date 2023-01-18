+++
title = "Components"
description = "Description of Status Reporter's components and architecture"
weight = 10
alwaysopen = false
+++

# Common components
At its core, _Status Reporter_ contains these three components:

[Nginx](https://www.nginx.org)
: is a HTTP reverse proxy handling TLS termination and authentication.  It's role is to provide
secure access to the underlying monitoring service from outside a node the _Status Reporter_ is
running on.

: If _Status Reporter_ is installed on a node which also has {{< param cfy_manager_name >}}
installed on it, then only one _nginx_ instance will be deployed.  In that case just the additional
configuration for _Status Reporter_ will be added.

[Prometheus](https://prometheus.io/)
: a monitoring and alerting software, which gathers and stores metrics related to
{{< param product_name >}} operation.  In case of a
[fully distributed cluster]({{< relref "/cloudify_manager/premium/fully_distributed/_index.md" >}})
or a [compact cluster]({{< relref "/cloudify_manager/premium/compact/_index.md" >}}) installations,
Prometheus instances create a
[federated network]({{< relref "/cloudify_manager/architecture/monitoring/federation.md">}}) in order
to exchange information without the involvement of {{< param cfy_manager_name >}}.

Prometheus's [node_exporter](https://github.com/prometheus/node_exporter#node-exporter)
: is a service responsible for exporting node's hardware and OS metrics for machines running \*NIX kernels.  Used by _Status Reporter_ to find out if a required system services (e.g. nginx, PostgreSQL etc.) are running.


# Additional components

## Manager nodes

![Status Reporter deployed on Manager node]( /images/monitoring/status_reporter_manager_nodes.svg )

Prometheus's [blackbox_exporter](https://github.com/prometheus/blackbox_exporter#blackbox-exporter-) on {{< param cfy_manager_name >}} nodes
: a service for probing HTTP/HTTPS endpoints (among others).  Used by _Status Reporter_ to validate that certain crucial Manager's endpoints return expected HTTP statuses.

## Database nodes

![Status Reporter deployed on DB node]( /images/monitoring/status_reporter_db_nodes.svg )

Prometheus's [postgres_exporter](https://github.com/prometheus-community/postgres_exporter#postgresql-server-exporter) on database nodes
: a service which provides a good deal of PostgreSQL server metrics.  Used by _Status Reporter_ to monitor health of a database engine.

## Message Queue nodes

![Status Reporter deployed on Message Queue node]( /images/monitoring/status_reporter_mq_nodes.svg )

RabbitMQ [rabbitmq_prometheus plugin](https://www.rabbitmq.com/prometheus.html#overview-prometheus) on message queue nodes
: RabbitMQ (as of 3.8.0) comes with a plugin which makes its metrics available for Prometheus.  It is used by _Status Reporter_ to monitor RabbitMQ's status.
