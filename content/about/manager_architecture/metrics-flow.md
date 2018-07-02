---
layout: bt_wiki
title: Metrics Workflow
category: Manager Architecture
draft: false
abstract: Describes the flow of streaming metrics from a host to Cloudify's Management Environment
weight: 700
aliases: /manager_architecture/metrics-flow/
---
{{% note %}}
For Cloudify Manager version 4.4 and above, Riemann, InfluxDB, and the proprietary poller (amqpinflux) are not installed by default to reduce storage requirements and improve ease of maintenance where these capabilities are not required.
{{% /note %}}

This section describes the workflow for streaming metrics from a host to a Cloudify management environment. The following diagram illustrates the flow.


{{< mermaid >}}
sequenceDiagram
    participant AD as agent (Diamond)
    participant BR as broker (RabbitMQ)
    participant RR as router (Riemann)
    participant REST
    participant PP as Proprietary poller
    participant MDB as metrics DB (InfluxDB)
    participant UI as UI (ReactJS)
    participant MW as Management Worker
    AD->>BR: send event
    Note over BR: queued
    RR->>BR: poll events
    RR->>RR: analyze stream
    RR->>REST: trigger policy event
    BR->>PP: retrieve event
    PP->>MDB: store event
    REST->>BR: submit task
    Note over MDB: stored
    CR->>MW: poll task
    MW->>BR: poll task
{{< /mermaid >}}

### Monitoring Agent

Diamond is the default agent used by Cloudify for sending metrics back to the Cloudify management environment.

### Metrics Exchange (Broker)

RabbitMQ stores metrics within a metrics-dedicated, non-durable, non-exclusive topic exchange. After a metric is consumed it is removed from the queue.
If you remove the proprietary consumer, you can connect an external system to the RabbitMQ to consume metrics, but this is not an officially supported implementation.

The RabbitMQ connection is secured by SSL and each deployments has its own vhost. The connection parameters are:
```
IP:	<cloudify manager ip>
user:	<by default: cloudify>
password:	<by default: c10udify>
port: <by default: 5672>
exchange:	cloudify-monitoring
routing-key:	*
virtual_host: <deployment vhost>
ssl_options:
  ssl_enabled: True
  cert_path: <path to internal certificate on manager it is under /etc/cloudify/ssl>
```
RabbitMQ credentials can be set on [installation]({{< relref "install_maintain/installation/installing-manager.md" >}}).

### Stream Processor

Riemann is used as an event stream processor and, by default, does not perform actions.

### Metrics Database

The Cloudify proprietary consumer polls metrics from RabbitMQ, reformats them to a Cloudify-specific structure and submits them to InfluxDB.

Although InfluxDB supports JSON structured metrics by default, metric names are being structured in Graphite format due to InfluxDB performance issues. Although metric names are provided in the form of `x.y.z`, the entire metric structure (name + value + ...) is JSON-formatted. 

Message format:
```json
{"metric": <value>, "host": <host node id>, "node_id": <host node instance id>, "path": <path of the metric>, "node_name": <node instance id>, "time": <unix timestamp>, "deployment_id": <deployment id>, "type": <metric type>}
```

### UI

UI ReactJS widgets are used to view the time series within InfluxDB. All queries are passed through the Cloudify backend, to enable query throttling and security. 


