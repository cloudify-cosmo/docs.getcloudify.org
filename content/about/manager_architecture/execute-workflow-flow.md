---
layout: bt_wiki
title: Workflow Execution Flow
category: Manager Architecture
draft: false
abstract: Describes the flow of executing a Workflow on an existing Deployment
weight: 600
aliases: /manager_architecture/execute-workflow-flow/
---
This section describes the flow for executing a workflow on an existing deployment.

{{< mermaid >}}
sequenceDiagram
    participant CLI
    participant Nginx
    participant REST
    participant PostgreSQL
    participant RabbitMQ
    participant Management Worker
    CLI->>Nginx: cfy executions start workflow_name -d deployment_id - POST /executions
    Nginx->>REST: POST /executions
    REST->>PostgreSQL: Get deployment by ID
    REST->>RabbitMQ: Submit workflow
    Management Worker->>RabbitMQ: Pull workflow
    REST->>PostgreSQL: Store workflow information
    Management Worker->>Management Worker: Process workflow
{{< /mermaid >}}

<!-- for docs on mermaidjs see https://mermaidjs.github.io/sequenceDiagram.html -->