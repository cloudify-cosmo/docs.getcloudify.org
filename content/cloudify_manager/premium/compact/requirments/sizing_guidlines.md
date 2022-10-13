+++
title = "Sizing Guidlines"
description = "Sizing Guidlines"
weight = 20
alwaysopen = false
+++

Defining the exact sizing of a {{< param cfy_manager_name >}} is tricky because there are many variants in the equation. That said, here are some guidelines and insights to how such sizing can be determined.

**Tenants**

Up to 1000 tenants may be defined in a {{< param cfy_manager_name >}}/cluster.

**Users**

There is virtually no limit to the number of users defined in the system.
The max number of concurrent users interacting with the manager is 200 (based on the recommended spec above.

**Blueprints**

There is no limit on the number of blueprints other than their size.
Blueprints are stored in on the manager hard drive and in the database and are relatively small entities. A very large blueprint may consume 1M of disk space and similar size in the DB. most will require much less than that.
{{< param product_name >}} recommends allocating 50GB of storage to the manager which should suffice for most customers.

**Plugins**

There is no limit on the number of plugins other than their size. Plugins are stored in the manager hard drive.
A typical plugin consumes approximately 5M. Very large plugins consume 20M of storage.

**Deployments**

A single {{< param cfy_manager_name >}}/manager cluster can maintain up to 500K deployed nodes.
Deployments are very light and consume very little space in the DB/hard drive. A typical deployment size would be up to 10K of disk size and consume very few entries in the DB.

**Workflows**

A {{< param cfy_manager_name >}}/cluster can operate up to 100 concurrent workflows. This threshold is enforced by the system.
Note: This threshold may be modified in the configuration, however, {{< param product_name >}} recommends keeping the default.

**Secrets**

There is virtually no limit to the number of secrets.

**Agents**

Up to 2000 agents may be deployed per single {{< param cfy_manager_name >}}/manager cluster.

**UI/CLI/API requests per second**

The REST API performance varies depending on multiple factors, but as a guideline, you should expect the {{< param cfy_manager_name >}} to support up to 10 requests per second with the above-recommended spec.

**Events**

The system can run and track up to 100 events per second with the above-recommended spec.

**Logs, events and metrics**

You must have enough storage to store the logs, events and metrics sent from the hosts. You can configure [log rotation]({{< relref "working_with/manager/service-logs.md#log-rotation" >}}) to reduce the amount of storage space required.