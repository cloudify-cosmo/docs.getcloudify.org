+++
title = "Monitoring"
description = "Describes tools and configuration used for monitoring (a.k.a. Status Reporter)"
weight = 600
alwaysopen = false
+++

# Overview

{{< param product_name >}} ships with a monitoring and alerting software build around
[Prometheus](https://prometheus.io/) behind a [Nginx](https://www.nginx.org) HTTP reverse proxy
and a few [exporters](https://prometheus.io/docs/instrumenting/exporters/).
[This bundle]({{< relref "/install_maintain/monitoring/components.md" >}}) is called _Status Reporter_ and is used to check
and report on the status of a {{< param cfy_manager_name >}}, a database and a queuing service,
combining them into single information about the services' health.

Below is the diagram of _Status Reporter_ components (in blue) in All-in-One environment (all
{{< param product_name >}}'s components running on the same single node).

![Status Reporter deployed in All-in-One environment]( /images/monitoring/status_reporter_aio.svg )


# Installation

_Status Reporter_ is enabled by default.  But it could be disabled by removing
`monitoring_service` entry from the list of `services_to_install` in {{< param product_name >}}'s
`config.yaml`, prior to installation.

Example `config.yaml` part with _Status Reporter_ installation enabled:

{{< highlight yaml >}}
services_to_install:
  - manager_service
  - monitoring_service
{{< /highlight >}}

The same part of `config.yaml`, but with _Status Reporter_ installation disabled:

{{< highlight yaml >}}
services_to_install:
  - manager_service
{{< /highlight >}}
