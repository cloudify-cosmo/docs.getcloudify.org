+++
title = "Fully Distributed"
description = "This section covers the requirments, installation and operation step for Fully Distributed cluster (9 nodes cluster). In Fully Distributed cluster Cloudify Manager is installed on 3 node, PostgreSQL deployed on 3 nodes, and RabbitMQ deployed on 3 nodes."
weight = 30
alwaysopen = false
+++

## Cloudify Cluster Architecture

![{{< param product_name >}}_Cluster]( /images/cluster/cluster-architecture.png )

Cloudify Manager 6.4 clusters are composed of three separate services that construct the entire {{< param product_name >}} solution:  

1. {{< param product_name >}} Management Service – The Management service embeds the {{< param product_name >}} workers framework, the REST API,
the user interface infrastructure and other backend services.
The {{< param product_name >}} Management Service is a cluster of at least two manager nodes running in an active/ active mode.
1. PostgreSQL Database Cluster – This service provides a high-availability PostgreSQL cluster based on [Patroni](https://patroni.readthedocs.io/en/latest/). The cluster must consist of at least 3 nodes.
1. RabbitMQ cluster – This service provides a high-availability RabbitMQ cluster based on RabbitMQ best practices.
The cluster must consist of 3 nodes.

Each of those services is accompanied by a customized monitoring service.  The service monitors the node for some basic metrics and also service-specific: message broker nodes will have RabbitMQ monitoring enabled, database nodes – PostgreSQL, and manager nodes – HTTP checks.

* An optional service is the load balancer that is used to distribute the load between the different manager nodes.
