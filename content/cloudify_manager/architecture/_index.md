+++
title = "Architecture"
description = "Covers high level architecture and security aspects."
weight = 10
+++

## Overview

This section is a collection of information about the architecture and operational characteristics of Cloudify Manager.

For the most part, documents in this section are not intended as task-oriented instructions. Instead, they are offered as background information to help inform your own proactive administration, maintenance, and architecture practices.

There are 3 options to consume Cloudify Manager, Community, Premium, and SaaS. 

## Community

Cloudify Community is an open-source version. Cloudify Manager Community can be installed either as a docker container, on VM (RHEL/CentOS), or on Kubernetes using our Helm Chart.

## Premium

Cloudify Premium is a commercial version. Cloudify Manager Premium can be installed either as a docker container, on VM (RHEL/CentOS), or on Kubernetes using our Helm Chart. 


## SaaS

Cloudify SaaS provides all of the Premium features. It is a hosted Cloudify Manager, so you don’t need to worry about installation, maintenance, and availability. The SaaS is always up to date with the most recent features.

## Comparison Matrix {#comparison-matrix}

| Feature                 | SaaS | Premium | Community |
|-------------------------|------|---------|-----------|
| Marketplace             | V    | V       | V         |
| Blueprints              | V    | V       | V         |
| Services & Environments | V    | V       | V         |
| Plugins                 | V    | V       | V         |
| Secrets                 | V    | V       | V         |
| Agents                  | V    | V       | V         |
| Users/Groups/Tenants    | V    | V       |           |
| RBAC                    | V    | V       |           |
| AD/OKTA/SAML            | V    | V       |           |
| Snapshots               | V    | V       |           |
| High Availability       | V    | V       |           |
| Maps                    | V    | V       |           |