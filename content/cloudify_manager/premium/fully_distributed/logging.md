+++
title = "Logging"
description = "Logging"
weight = 120
alwaysopen = false
+++

## Overview

Log locations vary from service to service, but the majority of logs can be found in `/var/log` and `/var/log/cloudify`.

Within these folders are folders for each service with distinguishable names such as "rabbitmq" and "postgres". If logs for a service aren't found here, the next place to look would be in the service configuration defaults file for any indication of a log file path (see the section "{{< param product_name >}} Service Configuration Defaults").

## {{< param product_name >}} Agent Worker Logs

{{< param product_name >}} agent worker logs can be found on deployed instances/ virtual machines with an installed {{< param product_name >}} agent. Typically, the logs are stored in the {{< param product_name >}} agent user's home directory in a folder named after the node instance ID for the instance/ VM.

*   {{< param product_name >}} agent worker log. `~/<Node instance ID>/work/<Node instance ID>.log`
*   This is the agent counterpart to the {{< param product_name >}} Management Worker logs. ~/<Node instance ID>/work/<Node instance ID>-<Worker ID>.log
*   Worker-specific log
    *   Each worker gets its own numbered log file. `~/<Node instance ID>/work/<Node instance ID>%I.log`


## {{< param product_name >}} Management Worker Logs

* `/var/log/cloudify/mgmtworker/cloudify.management_worker.log`

    *   {{< param product_name >}} management worker log
    *   Useful for troubleshooting management worker issues such as {{< param product_name >}} agent deployment, blueprint deployment creation, and heartbeat errors
    *   Contains information about deployment executions from the perspective of the management worker
    *   Shows worker tracebacks
    *   Task execution logs are followed by noting the task dispatch ID (a UUID). Task IDs can also be found in execution logs and used to search this worker log for further details. Specific task logs will have prefixes of "Received task", "Task accepted", and "Task [succeeded | failed]". Here's an example:

    **Code Block 13 LOG**

    ```
    Received task: cloudify.dispatch.dispatch[b164cf2c-d601-4484-bbce-927e1106de27]
    Task accepted: cloudify.dispatch.dispatch[b164cf2c-d601-4484-bbce-927e1106de27] pid:5683
    Task cloudify.dispatch.dispatch[b164cf2c-d601-4484-bbce-927e1106de27] succeeded in 1.015225859s

    ```

* `/var/log/cloudify/mgmtworker/logs/<Deployment ID>.log`

    *   Cloudify deployment worker log
    *   Useful for troubleshooting deployment executions of all types. Low-level logging of worker tasks and is generally used as an additional source of information if the execution logs themselves aren't sufficient
    *   Shows worker tracebacks

## {{< param product_name >}} REST API Service Logs

* `/var/log/cloudify/rest/cloudify-rest-service.log`

    *   Serves as a central log file for all incoming and outgoing REST API requests and responses. Log entries are in a well-defined, human-readable format
    *   Provides a host of useful information such as request details (HTTP method, headers, query string details, JSON data, endpoint path, etc…) and response details (HTTP status, headers)
    *   Can be monitored, on-demand, for bad HTTP response codes, blueprint file names, endpoint security checks, etc

* `/var/log/cloudify/rest/gunicorn-access.log`

    *   Verbose access logs directly from the HTTP server itself
    *   Well-structured, dense logging format
    *   Useful for monitoring REST API interaction, user fingerprinting, and this log file includes maintenance endpoint calls and other "internal" endpoints that {{< param product_name >}} uses

* `/var/log/cloudify/rest/gunicorn.log`

    *   Gunicorn HTTP server system service log
    *   Useful for troubleshooting SysV init service failures as well as enumerating the
    *   HTTP server worker process IDs and HTTP server listening endpoint

## PostgreSQL Logs 

* `/var/log/cloudify/postgresql`

    *   PostgreSQL system service log
    *   Useful for gathering information about the PostgreSQL service such as version, process ID, build, and cluster information
    *   Useful for monitoring cluster state and indexing tasks
    *   Useful for PostgreSQL service troubleshooting

## RabbitMQ Logs 

* `/var/log/cloudify/rabbitmq/<RabbitMQ Node>.log`

    *   RabbitMQ system service log.
    *   Useful for gathering information about the RabbitMQ service such as node name, config file locations, database directory, and running reporting info.
    *   Useful for RabbitMQ service troubleshooting.

## Cluster Logs

* `/var/log/cloudify/cloudify-cluster.log`

    *   Cluster services log
    *   All cluster services log to this file and journald
    *   Useful for gathering information about Cluster operations