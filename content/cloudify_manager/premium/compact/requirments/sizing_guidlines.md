+++
title = "Sizing Guidelines"
description = "Defining the exact sizing of a Manager is based on many variants in the equation. These are the guidelines and insights into how such sizing can be determined."
weight = 20
alwaysopen = false
+++

## Overview

Defining the exact size of a {{< param cfy_manager_name >}} is tricky because there are many variables in the equation. That said, here are some guidelines and insights into how such sizing can be determined.

**Tenants**

Up to 1,000 tenants may be defined in a {{< param cfy_manager_name >}}/ cluster.

**Users**

There is virtually no limit to the number of users defined in the system.
The max number of concurrent users interacting with the manager is 200 (based on the recommended spec above).

**Blueprints**

There is no limit on the number of blueprints other than their size.
Blueprints are stored on the manager's hard drive and in the database and are relatively small entities. A very large blueprint may consume 1 MB of disk space and a similar size in the database. Most will require much less than that.
{{< param product_name >}} recommends allocating 50 GB of storage to the manager which should suffice for most customers.

**Plugins**

There is no limit on the number of plugins other than their size. Plugins are stored in the manager's hard drive.
A typical plugin consumes approximately 5 M. Very large plugins consume 20M of storage.

**Deployments**

A single {{< param cfy_manager_name >}}/ manager cluster can maintain up to 500K deployed nodes.
Deployments are very light and consume very little space in the database/ hard drive. A typical deployment size would be up to 10K of disk size and consume very few entries in the database.

**Workflows**

A {{< param cfy_manager_name >}}/ cluster can operate up to 100 concurrent workflows. This threshold is enforced by the system.
Note: This threshold may be modified in the configuration, however, {{< param product_name >}} recommends keeping the default.

**Secrets**

There is virtually no limit to the number of secrets.

**Agents**

Up to 2000 agents may be deployed per single {{< param cfy_manager_name >}}/ manager cluster.

**UI/ CLI/ API Requests per Second**

The REST API performance varies depending on multiple factors, but as a guideline, you should expect the {{< param cfy_manager_name >}} to support up to 10 requests per second with the above-recommended specs.

**Events**

The system can run and track up to 100 events per second with the above recommended specs.

**Logs, events, and metrics**

You must have enough storage to store the logs, events, and metrics sent from the hosts. You can configure [log rotation]({{< relref "working_with/manager/service-logs.md#log-rotation" >}}) to reduce the amount of storage space required.