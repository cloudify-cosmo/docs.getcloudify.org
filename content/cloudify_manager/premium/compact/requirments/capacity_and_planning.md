+++
title = "Capacity and Planning"
description = "Requirments"
weight = 10
alwaysopen = false
+++

The {{< param product_name >}} Compact cluster deployment is based on 3 servers, each running all of the {{< param product_name >}} services, where the services are deployed in an active-active approach with a high-availability setup.
A Compact cluster provides an enterprise grade {{< param product_name >}} deployment suitable to almost any organization, with a performance and scale equivelent to a fully distributed cluster containing 3 managers and with the option offurther scaling using higher form factor hardware. The compact cluster is designed for mission critical use.

Recommended Resources for each of the 3 nodes:

|         | RECOMMENDED |
|---------|-------------|
| vCPUs   | 8           |
| RAM     | 16GB        |
| Storage | 64GB        |

* The recommended spec was certified with 1M deployments and an average rate of over 2500 workflows per hour.
* Adding more resources has proven to be successful for higher loads.
