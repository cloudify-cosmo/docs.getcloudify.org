+++
title = "Architecture"
description = "Architecture"
weight = 10
alwaysopen = false
+++

## Overview 
The {{< param cfy_manager_name >}} contains several open-source components. The relationships between the components in the {{< param cfy_manager_name >}} architecture are illustrated in the diagram below.

* [Nginx](#nginx)
* [File Server](#file-server)
* [Gunicorn](#gunicorn-and-flask)
* [Flask](#gunicorn-and-flask)
* [PostgreSQL](#postgresql)
* [RabbitMQ](#rabbitmq)
* [Pika](#pika)

![Cloudify components]( /images/architecture/cloudify_advanced_architecture.png )

## Nginx {#nginx}

[Nginx](http://nginx.com/) is a high-performing web server. In the {{< param cfy_manager_name >}} it serves two purposes:

1. A proxy for the {{< param product_name >}} REST service and {{< param cfy_console_name >}}
2. A file server to host {{< param product_name >}}-specific resources, agent packages, and blueprint resources.

### File Server {#file-server}

The file server served by Nginx, is available at `https://{manager_ip}:53333/resources`, which is mapped to the `/opt/manager/resources/` directory. You must authenticate in order to access the file server.

To access subdirectories that include tenant names in their path, you must have privileges on that tenant. These subdirectories are:

* `blueprints`
* `uploaded-blueprints`
* `deployments`
* `tenant-resources`

The directories that are stored in snapshots are:

* `blueprints`
* `uploaded-blueprints`
* `deployments`
* `tenant-resources`
* `plugins`
* `global-resources`

{{% note title="Note" %}}
The `tenant-resources` and `global-resources` directories are not used by {{< param cfy_manager_name >}} and can be created by the user for storing custom resources.
{{% /note %}}


## Gunicorn and Flask {#gunicorn-and-flask}

[Gunicorn](http://gunicorn.org/) is a web server gateway interface HTTP server. [Flask](http://flask.pocoo.org/) is a web framework.

Together, Gunicorn and Flask provide the {{< param product_name >}} REST service. The REST service is written using Flask, and Gunicorn is the server. Nginx is the proxy to that server.
{{< param product_name >}}'s REST service is the integrator of all parts of the {{< param product_name >}} environment.

## PostgreSQL {#postgresql}

[PostgreSQL](https://www.postgresql.org/) is an object-relational database that can handle workloads ranging from small single-machine applications to large Internet-facing applications.

In the {{< param cfy_manager_name >}}, PostgreSQL serves two purposes:

1. Provides the main database that stores the application's model (i.e. blueprints, deployments, runtime properties)
2. Provides indexing, logs', and events' storage

## RabbitMQ {#rabbitmq}

[RabbitMQ](http://www.rabbitmq.com/) is a queue-based messaging platform.

RabbitMQ is used by {{< param product_name >}} as a message queue for different purposes:

* Queueing deployment tasks
* Queueing logs and events
* Queueing metrics

## Pika {#pika}

[Pika](http://pika.readthedocs.io/en/latest/) is a pure-Python implementation
of the AMQP 0-9-1 protocol.

The {{< param product_name >}} management worker and the host agents are using `pika` to
communicate with RabbitMQ.

### Management Worker (or Agent)

Both the `Workflow Executor` and the `Task Broker` that appear in the diagram are part of the {{< param product_name >}} Management Worker.

* The `Workflow Executor` receives workflow execution requests, creates the tasks specified by the workflow, submits the tasks for execution by host agents and the `Task Broker`, and manages the workflow state.
* The `Task Broker` executes API calls to IaaS providers to create deployment resources and executes other tasks specified in `central_deployment_agent` plugins.

{{% note %}}
Note: All the agents (the Management Worker, and Agents deployed on application hosts) are using the same implementation.
{{% /note %}}