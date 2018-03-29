---
layout: bt_wiki
title: Deployment Creation Workflow
category: Manager Architecture
draft: false
abstract: Describes the flow of creating a deployment for a Blueprint
weight: 500
---
This section describes the workflow for creating a deployment for a blueprint.

![Cloudify Create Deployment]( ./images/architecture/cloudify_flow_create_deployment.png )

The REST service retrieves the blueprint document from Elasticsearch and creates a tangible manifestation of it by expanding nodes to node-instances, attaching node-instance ID's to them, and so on.