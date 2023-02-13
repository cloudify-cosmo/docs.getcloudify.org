+++
title = "Capacity and Planning"
description = "Capacity and Planing"
weight = 1
alwaysopen = false
+++

## Overview

All-in-One (AIO) deployment is based on a single {{< param product_name >}} box (single VM/ Container) running all the {{< param product_name >}} components, mainly the manager, the database and the messaging queue.
An AIO deployment is recommended for non-mission critical use when High-availability is not required and the scale is not extreme.
{{< param product_name >}} AIO is typically used for development and testing systems, it is also common in production for smaller-scale areas.

Recommended Resources

|         | MINIMUM | RECOMMENDED |
|---------|---------|-------------|
| vCPUs   | 2       | 8           |
| RAM     | 4GB     | 16GB        |
| Storage | 20GB    | 64GB        |

* The minimum requirements are enough for a manager running just a few compute instances, typically for developer use, POC, or a small edge site.
* The recommended spec was certified with 500K deployments and an average rate of over 1000 workflows per hour.
* Adding more resources has proven to be successful for higher loads.