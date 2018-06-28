---
layout: bt_wiki
title: Logs and Events Workflow
category: Manager Architecture
draft: false
abstract: Describes the flow of streaming metrics from a host to the Cloudify management environment
weight: 800
aliases: /manager_architecture/logs-events-flow/
---
This section describes the workflow of streaming metrics from a host to the Cloudify management environment.


{{< mermaid >}}
sequenceDiagram
    participant X as external
    participant RMQ as RabbitMQ
    participant LS as logstash
    participant PSQL as PostgreSQL
    participant REST
    participant Nginx
    participant UI
    participant EV as External View
    X->>RMQ: submit event
    Note over RMQ: queued
    LS->>RMQ: retrieve
    Note over LS: processed
    LS->>PSQL: index
    Note over PSQL: stored
    REST->>PSQL: db query
    Note over REST: proxy query request
    Nginx->>REST: db query
    Note over Nginx: proxy query request
    UI->>Nginx: db query
    EV-->>Nginx: db query
{{< /mermaid >}}

The workflow is self-explanatory and corresponds with the same principles upon which the metrics workflow is based.

RabbitMQ stores messages within a dedicated, durable, non-exclusive topic exchange. 

Log messages and events have separate queues. Currently, logs and events are stored in Elasticsearch in the same index. Although no abstraction is provided for this, you can use logstash to parse messages and store them in different indices if preferred, but they will not show in the Cloudify user interface.