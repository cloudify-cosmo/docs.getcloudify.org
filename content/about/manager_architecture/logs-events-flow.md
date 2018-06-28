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

![Cloudify Logs Flow]( /images/architecture/cloudify_flow_logs.png )

RabbitMQ stores messages within a dedicated, durable, non-exclusive topic exchange. 

Log messages and events have separate queues. Currently, logs and events are stored in Postgres and can be accessed using the events endpoint or in the web UI.
