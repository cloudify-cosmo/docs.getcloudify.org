---
title: Deployment Creation Workflow
category: Manager Architecture
draft: false
abstract: Describes the flow of creating a deployment for a Blueprint
weight: 500
aliases: /manager_architecture/create-deployment-flow/
---
This section describes the workflow for creating a deployment for a blueprint.

{{< mermaid >}}
sequenceDiagram
    participant CLI
    participant NP as Nginx (Proxy)
    participant REST
    participant ES as Elasticsearch
    participant MA as Management Agent
    CLI->>NP: cfy deployments create - PUT /deployments/{{deployment-id}}
    NP->>CLI: PUT /deployments/{{deployment-id}}
    REST->>ES: get blueprint by ID
    REST->>REST: create deployment data
    REST->>ES: save deployment data
    REST->>MA:create deployment agents
{{< /mermaid >}}

<!-- for docs on mermaidjs see https://mermaidjs.github.io/sequenceDiagram.html -->

The REST service retrieves the blueprint document from Elasticsearch and creates a tangible manifestation of it by expanding nodes to node-instances, attaching node-instance ID's to them, and so on.