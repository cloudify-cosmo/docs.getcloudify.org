+++
title = "Federation"
description = "Describes how Prometheus shares metrics across its multiple instances"
weight = 40
alwaysopen = false
+++


> Federation allows a Prometheus server to scrape selected time series from another Prometheus
> server
> [[Prometheus's documentation](https://prometheus.io/docs/prometheus/latest/federation)]

{{< param product_name >}}'s use case for federation is a “cross-service federation”:

> In cross-service federation, a Prometheus server of one service is configured to scrape selected
> data from another service's Prometheus server to enable alerting and queries against both datasets
> within a single server
> [[Prometheus's documentation](https://prometheus.io/docs/prometheus/latest/federation/#cross-service-federation)]

Below is a diagram of federation used in {{< param product_name >}}'s use case.  Notice that
Prometheus is talking to _Status Reporters_ (not other Promethus instances directly), which is to
note the additional nginx component to all _Status Reporters_.  Black arrows mark the “federation
connections”.

![Status Reporter federation]( /images/monitoring/status_reporter_federation.svg )

# Configuration

## Targets

Targets for federated-scraping are listed in `/etc/prometheus/targets/other_*.yml` files.  These are
the hosts, which will be used in `federate_*` jobs.  For example database nodes are listed in
`/etc/prometheus/targets/other_postgres.yml` file, which might look like this:

{{< highlight yaml >}}
- targets: ["172.22.0.3:8009", "172.22.0.4:8009", "172.22.0.5:8009"]
  labels: {}
{{< /highlight >}}

For more information about defining targets look for the
[file-based service discovery](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#file_sd_config)
in Prometheus's documentation.

## Scraping jobs

`federate_*` scraping jobs are defined in `/etc/prometheus/prometheus.yml` file.  Here is an example
of a pre-defined job for scraping federated database nodes for postgres_exporter's metrics:

{{< highlight yaml >}}
- job_name: 'federate_postgresql'
  honor_labels: true
  scheme: 'https'
  tls_config:
    ca_file: /etc/cloudify/ssl/monitoring_ca_cert.pem
  basic_auth:
    username: a_user
    password: a_password
  metrics_path: /monitoring/federate
  params:
    'match[]':
      - '{job="postgresql",host!="172.22.0.3"}'
  file_sd_configs:
    - files:
      - '/etc/prometheus/targets/other_postgres.yml'
{{< /highlight >}}

It reads: query all targets listed in `/etc/prometheus/targets/other_postgres.yml` file on HTTPS
endpoint `/monitoring/federate` with given credentials and a TLS CA certificate for any metrics
matching labels: ```job="postgresql"``` (postgres_exporter's) and ```host!="172.22.0.3"``` (skip
metrics of the node _this_ Prometheus is running on).

This configuration requires fully-blown _Status Reporter_ to be available on federated nodes.  It
means, that not only should there be a
[service-specific exporter]({{< relref "/install_maintain/monitoring/components.md" >}}#additional-components)
installed (e.g. postgres_exporter for database nodes), but all other
[common components]({{< relref "/install_maintain/monitoring/components.md" >}}#common-components):
node_exporter, Prometheus and nginx, all configured similarly to what {{< param product_name >}}
provides (proper TLS certificates, authentication credentials same as on all other nodes, same
opened ports, etc.)

