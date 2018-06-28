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
    participant NP as Nginx (Proxy)
    participant REST
    participant NF as Nginx (Fileserver)
    participant PSQL as PostgreSQL
    CLI->>CLI: cfy blueprints upload
    CLI->>CLI: Parse blueprint
    CLI->NP: POST /blueprints
    NP->>NP: validate blueprint size
    NP->>REST: POST /blueprints
    REST->>NF:Copy blueprint & resources
    REST->>PSQL:Save parsed blueprint
{{< /mermaid >}}

<!-- for docs on mermaidjs see https://mermaidjs.github.io/sequenceDiagram.html -->