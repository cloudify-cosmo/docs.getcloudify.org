---
layout: bt_wiki
title: Logs and Events Workflow
category: Manager Architecture
draft: false
abstract: Describes the flow of streaming metrics from a host to the Cloudify management environment
weight: 800
---
This section describes the workflow of streaming metrics from a host to the Cloudify management environment.

![Cloudify Logs Flow]( /images/architecture/cloudify_flow_logs.png )

The workflow is self-explanatory and corresponds with the same principles upon which the metrics workflow is based.

RabbitMQ stores messages within a dedicated, durable, non-exclusive topic exchange. 

Log messages and events have separate queues. Currently, logs and events are stored in Elasticsearch in the same index. Although no abstraction is provided for this, you can use logstash to parse messages and store them in different indices if preferred, but they will not show in the Cloudify user interface.