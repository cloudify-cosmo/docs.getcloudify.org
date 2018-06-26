---
layout: bt_wiki
title: Upload Blueprint Workflow
category: Manager Architecture
draft: false
abstract: Describes the flow for uploading a Cloudify Blueprint to a Cloudify management environment
weight: 400
aliases: /manager_architecture/upload-blueprint-flow/
---
This section describes the workflow for uploading a Cloudify blueprint to a Cloudify management environment.

{{< mermaid >}}
sequenceDiagram
    participant CLI
    participant Nginx (Proxy)
    participant REST
    participant Nginx (Fileserver)
    participant PostgreSQL
    CLI->>CLI: cfy blueprints upload
    CLI->>CLI: Parse blueprint
    CLI->>Nginx (Proxy): POST /blueprints
    Nginx (Proxy)->>Nginx (Proxy): validate blueprint size
    Nginx (Proxy)->>REST: POST /blueprints
    REST->>Nginx (Fileserver):Copy blueprint & resources
    REST->>PostgreSQL:Save parsed blueprint
{{< /mermaid >}}

<!-- for docs on mermaidjs see https://mermaidjs.github.io/sequenceDiagram.html -->