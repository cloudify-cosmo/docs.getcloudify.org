+++
title = "Capacity and Planning"
description = "The Cloudify Compact Cluster deployment capacity and planning are based on the server and the following recommendations."
weight = 10
alwaysopen = false
+++

## Overview
A {{< param product_name >}} cluster consists of 3 main services: 
1. {{< param cfy_manager_name >}}
1. Database
1. Messaging Queue

{{< param product_name >}} cluster topology assures high availability and should be leveraged for mission-critical deployments.
Learn more about the [{{< param product_name >}} cluster]({{< relref "cloudify_manager/premium/fully_distributed/_index.md" >}}).

## {{< param cfy_manager_name >}} Server {#cloudify-cluster}

For a highly available setup at least two managers are required, and 3 are recommended.

Recommended resources per manager server:

|         | RECOMMENDED |
|---------|-------------|
| vCPUs   | 4           |
| RAM     | 8GB         |
| Storage | 32GB        |

* The recommended spec. is for average use of 1,000 - 2,000 workflows per hour and was certified with 1M deployments.
* Scaling to higher volume can be achieved via:
  * Additional {{< param cfy_manager_name >}}s - an almost linear scaling was verified leveraging 3 - 6 managers.
  * Higher hardware spec. - a linear scaling was verified with stronger hardware.
* The equivalent AWS instance is c5.xlarge.
* Customized sizing and tunning may further improve the supported scale. Over 2M deployed nodes and over 5,000 workflows per hour were tested in some scenarios.

## Database (PostgreSQL) Server

For a highly available setup, 3 database servers are required.

Recommended resources per database server:

|         | RECOMMENDED |
|---------|-------------|
| vCPUs   | 2           |
| RAM     | 16GB        |
| Storage | 64GB        |

* The recommended spec is for average use of 1,000 - 2,000 workflows per hour and was certified with 1M deployments.
* Scaling to higher volume can be achieved via:
  * Higher hardware spec. - a linear scaling was verified with stronger hardware.
* The equivalent AWS instance is r5.large.

## Messaging queue (RabbitMQ) Server

For a highly available setup, 3 messaging queue servers are required.

Recommended resources per messaging queue server

|         | RECOMMENDED |
|---------|-------------|
| vCPUs   | 4           |
| RAM     | 8GB         |
| Storage | 32GB        |

* The recommended spec is for average use of 1,000 - 2,000 workflows per hour and was certified with 1M deployments.
* Scaling to higher volume can be achieved via:
  * Higher hardware spec. - a linear scaling was verified with stronger hardware
* The equivalent AWS instance is c5.large.

