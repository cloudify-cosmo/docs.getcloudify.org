---
layout: bt_wiki
title: Metrics Workflow
category: Manager Architecture
draft: false
abstract: Describes the flow of streaming metrics from a host to Cloudify's Management Environment
weight: 700
---
This section describes the workflow for streaming metrics from a host to a Cloudify management environment. The following diagram illustrates the flow.


![Cloudify Metrics Flow]({{< img "architecture/cloudify_flow_metrics.png" >}})

### Monitoring Agent

Diamond is the default agent used by Cloudify for sending metrics back to the Cloudify management environment.

You can send metrics to the management environment using any transport (agent), so long as it the metrics are of the same structure managed by Cloudify. See the [Diamond plugin]({{< relref "plugins/diamond.md" >}}) documentation for more information.

### Metrics Exchange (Broker)

RabbitMQ stores metrics within a metrics-dedicated, non-durable, non-exclusive topic exchange.

After a metric is consumed it is removed from the queue. In principle, you can consume metrics directly from RabbitMQ for processing in systems outside Cloudify. Cloudify does not provide any implementation to officially support this, however it is enables by the architecture, and by removing the proprietary consumer, you it is possible to consume metrics directly from RabbitMQ.

### Stream Processor

Riemann is used as an event stream processor and, by default, does not perform actions.

{{% gsNote title="Planned Changes" %}}
Cloudify intends to have Riemann process streams of information (metrics, logs, etc..) on-the-fly, to provide live analysis of service/system states and execute workflows accordingly.
{{% /gsNote %}}

### Metrics Database

The Cloudify proprietary consumer polls metrics from RabbitMQ, reformats them to a Cloudify-specific structure and submits them to InfluxDB.

Although InfluxDB supports JSON structured metrics by default, metric names are being structured in Graphite format due to InfluxDB performance issues. Although metric names are provided in the form of `x.y.z`, the entire metric structure (name + value + ...) is JSON-formatted. 

{{% gsNote title="Planned Changes" %}}
As InfluxDB grows, Cloudify intends to match the metrics structure to meet the [Metrics2.0](http://metrics20.org/) standard.

{{% /gsNote %}}

### UI

Grafana is used to view the time series within InfluxDB. While Grafana usually interacts with InfluxDB directly, all queries are passed through the Cloudify backend, to enable query throttling and security. 
