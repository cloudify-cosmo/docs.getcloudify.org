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

RabbitMQ stores messages within a dedicated, durable, non-exclusive topic exchange. 

Log messages and events have separate queues. For Cloudify Manager version 4.4 and above, logs and events are stored in PostgreSQL. You can access the logs and events from the REST API events endpoint and from the Cloudify Console.
