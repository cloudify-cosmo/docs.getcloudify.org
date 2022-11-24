+++
title = "Capacity and Planning"
description = "The Cloudify Compact Cluster deployment capacity and planning are based on the server and the following recommendations."
weight = 10
alwaysopen = false
+++

## Overview

The {{< param product_name >}} Compact Cluster deployment is based on 3 servers, each running all of the {{< param product_name >}} services. The services are deployed in an active-active approach with a high-availability setup.
A Compact Cluster provides an enterprise-grade {{< param product_name >}} deployment suitable to almost any organization, with a performance and scale equivalent to a fully distributed cluster containing 3 managers and with the option of further scaling using higher form factor hardware. The Compact Cluster is designed for mission-critical use.

Recommended resources for each of the 3 nodes:

|         | RECOMMENDED |
|---------|-------------|
| vCPUs   | 8           |
| RAM     | 16GB        |
| Storage | 64GB        |

* The recommended specs were certified with 1M deployments and an average rate of over 2,500 workflows per hour.
* Adding more resources has proven to be successful for higher loads.
