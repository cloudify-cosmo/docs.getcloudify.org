---
title: Cloudify System Processes and Logging Guide
category: Operations Guides
draft: false
weight: 100
---
The purpose of this document is to provide detailed information for:

*   Identifying Cloudify Manager's processes
*   Defining how these processes should be tracked for monitoring and alerting
*   Defining locations of Cloudify Manager log files

## Cloudify System Processes

In a Cloudify Manager environment, the following system processes exist:

| User | Command | Description |
|------|---------|-------------|
| cfyuser | nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf | Nginx web server (REST API) root process |
| nginx | nginx: worker process | Nginx web server (REST API) child process |
| stage_u+ | /opt/nodejs/bin/node /opt/cloudify-stage/backend/server.js | React.js web application (Cloudify front-end web UI) |
| cfyuser | /opt/mgmtworker/env/bin/python /opt/mgmtworker/env/bin/celery worker | Cloudify Manager management worker Celery processes |
| amqpinf+ | /opt/amqpinflux/env/bin/python /opt/amqpinflux/env/bin/cloudify-amqp-influxdb | Cloudify-specific RabbitMQ-to-InfluxDB transport |
| influxdb | /usr/bin/influxdb -config=/opt/influxdb/shared/ config.toml | InfluxDB |
| rabbitmq | su rabbitmq -s /bin/sh -c /usr/lib/rabbitmq/bin/rabbitm q-server | RabbitMQ service |
| cfyuser | /opt/manager/env/bin/python /opt/manager/env/bin/gunicorn | Gunicorn HTTP server |
| postgres | /usr/pgsql-9.5/bin/postgres -D /var/lib/pgsql/9.5/data | PostgreSQL database |
| cfyuser+ | /opt/consul/consul agent -config-dir /etc/consul.d | Consul |
| cfyuser | /opt/manager/env/bin/python /opt/manager/env/bin/consul_watcher | Consul-watcher |

##  Cloudify SysV Init Services

| Service | Description |
|---------|-------------|
| cloudify-amqpinflux | Cloudify-specific RabbitMQ-to-InfluxDB transport service |
| cloudify-influxdb | InfluxDB service |
| cloudify-mgmtworker | Cloudify Manager management worker Celery service |
| cloudify-rabbitmq | RabbitMQ service |
| cloudify-restservice | Cloudify REST service |
| cloudify-riemann | Cloudify policy manager |
| cloudify-stage | Cloudify UI service |
| cloudify-check-runner.service | check runner |
| cloudify-consul-watcher.service | consul members watcher |
| cloudify-consul.service | consul |
| cloudify-handler-runner.service | handler runner |
| cloudify-postgresql.service | PostgreSQL 9.5 database server |
| cloudify-syncthing.service | Files syncthing |

##  Cloudify Service Configuration Defaults

All Cloudify-specific service configurations can be found in /etc/sysconfig. This area is where default configuration data can be found as well as logging locations for service-specific troubleshooting. These are very useful when trying to understand how a service was instantiated and what logging configuration is being used.

This directory can also be used to derived each core service's SysV init name. For instance, enumerating /etc/sysconfig will show a file called cloudify-amqpinflux. This is the name of the service, and thus to query the service status can be done using the command service cloudify-amqpinflux status.

## Discovering Cloudify Services and Service

### Statuses

The sections above describe how to identify a Cloudify service by looking directly at the output \
of something like _ps_ or by folder snooping. This is not always practical or desired and there are \
other, more developer-friendly, ways of enumerating which Cloudify services are present and \
how to harvest information about them.

The best starting point is to utilize the REST API of the manager to get service information. \
Simply craft a GET request for the status endpoint: GET /status HTTP/1.1 \
If cURL and Python are available, it's very easy to make the request as well as visualize the \
returned data.

**Code Block 1 REST**

```
curl -X GET http://<manager-ip>/status | python -m json.tool

```

An example, partial, return is as follows:

**Code Block 2 JSON**

```
{
"services": [{
"display_name": "InfluxDB",
"instances": [{
"ActiveState": "active",
"Description": "InfluxDB Service",
"Id": "cloudify-influxdb.service",
"LoadState": "loaded",
"MainPID": 13129,
"SubState": "running",
"state": "running"
}
]
}, {
"display_name": "Celery Management"
"instances": [{
"ActiveState": "active",
"Description": "Cloudify Management Worker Service",
"Id": "cloudify-mgmtworker.service",
"LoadState": "loaded",
"MainPID": 18161,
"SubState": "running",
"state": "running"
}
]
}, {
"display_name": "RabbitMQ",
"instances": [{
"ActiveState": "active",
"Description": "RabbitMQ Service",
"Id": "cloudify-rabbitmq.service",
"LoadState": "loaded",
"MainPID": 12322,
"SubState": "running",
"state": "running"
}
]
},
]
}

```


With this information, in standard JSON format, it is easy to match a core Cloudify service with a \
system-level process ID (MainPID) to begin further troubleshooting.

### Cluster status

Cloudify provides API to get information about current cluster state. Using first it is easy to determine if the manager is in a cluster state.

**Code Block 3 REST**

```
curl -u user:password "http://<manager-ip>/api/v3.1/cluster"

```

**Code Block 4 JSON**

```
{
"initialized": true,
"consul": {
"leader": "172.20.0.3:8300"
},
"error": null,
"logs": [
{
"message": "HA Cluster configuration complete",
"timestamp": 1485778546965628,
"cursor": "opaque cursor value"
}
]
} 

```

While the second call response provides information about each node in the cluster and indicates which node is the current master.

**Code Block 5 REST**

```
curl --header -u user:password "http://<manager-ip>/api/v3.1/cluster/nodes"

```

**Code Block 6 JSON**

```
{
"items":
[
{
"initialized": true,
"online": true,
"master": true,
"host_ip": "172.20.0.2",
"name": "cloudify_manager_LMJZA2",
"credentials": "<REDACTED>"
}
]
}
```

## Checking Manager Components

### RabbitMQ

**System Service**

To check if the RabbitMQ broker is running (and to see many other details such as which applications are running, memory allocation, and other performance metrics), simply run the following command:

**Code Block 7 bash**

```
sudo rabbitmqctl -n cloudify-manager@localhost status 

```

An error message will be presented if the service has an issue such as a failed broker.

**Management Operations**

To get started working with the RabbitMQ management interface, the management interface must be enabled via a plugin. Execute the following to enable the management plugin:

```
sudo rabbitmq-plugins -n cloudify-manager@localhost enable rabbitmq_management
```

Once this is complete, there will be a management web interface located at http://<server IP>:15672/

In order to utilize the web interface, you will need to have the RabbitMQ username and password for authentication. This can be found in the /etc/cloudify/config.yaml file used for instantiation a Cloudify manager.

By default, the user created from the manager instantiation process does not have sufficient permissions to be used with the web interface. Use the following command to promote the default user with the "monitoring" permission (or you can alternatively assign the "administrator" tag).

```
sudo rabbitmqctl set_user_tags <username> monitoring
```

You can now use the RabbitMQ username and password to log in via the web interface to do actions such as view queues, get messages, monitor performance, and monitor connections.

### Celery

**System Service **
The best way to tell if Celery is alive and healthy is to perform a "ping". Before working with Celery, it is necessary to know the RabbitMQ username and password for the service. Please refer to the RabbitMQ section in this document titled "Management Operations" to find your username and password. Here is how to query Celery for liveness:

1.  Go to the management worker directory: `cd /opt/mgmtworker/`
1.  Load the Python virtual environment: `source env/bin/activate`
1.  "Ping" the Celery workers: `celery inspect --broker="amqp://<RabbitMQ username>:<RabbitMQ password>@localhost//" ping`

A successful response will be similar to this:
```
_-> celery@cloudify.management: OK_ \
_pong_
```
### InfluxDB

**System Service**
InfluxDB exposes a RESTful API that can be used for status checking, reading/writing data, and executing SQL-like queries. To check if the service is running and is healthy, we can check the "/ping" endpoint using the default InfluxDB credentials of "root":"root".

**Code Block 8 REST**

```
curl 'http://localhost:8086/ping?u=root&p=root' 

```

A successful response would be similar to this:

**Code Block 9 JSON**

```
{"status":"ok"} 
```

Additional information can be found in the [Influxdata documentation](https://docs.influxdata.com/influxdb/v0.9/concepts/api/). There's also a web interface that's available for use at _http://<manager IP>:8083/_ from any system that has access to port 8083 and 8086 on the manager. The "Hostname and Port Settings" area must have the hostname set to the externally visible manager IP and the port set to 8086.

### PostgreSQL

**System Service**

To verify if postgres is working correctly a simple select can be executed:

**Code Block 10 bash**

```
sudo -u postgres psql --port 15432 -c "select 1"
```
### Consul

Consul status can be checked in the following way:

**Code Block 11 REST**

```
sudo curl --cacert /etc/cloudify/ssl/cloudify_internal_ca_cert.pem --cert /etc/cloudify/cluster-ssl/consul_client.crt --key /etc/cloudify/cluster-ssl/consul_client.key https://localhost:8500/v1/status/leader

```

### Syncthing

Checking if syncthing is working correctly will need a curl command to the REST API.

**Code Block 12 REST**

```
curl -H "X-Api-Key: <key>" 127.0.0.1:8384/rest/system/status

```

The key can be gathered from: `//configuration/gui/apikey in /opt/syncthing/.config/syncthing/config.xml`

## Logging

### Overview

Log locations vary from service to service, but the majority of logs can be found in /var/log and /var/log/cloudify.

Within these folders are folders for each service with distinguishable names such as "rabbitmq" and "postgres". If logs for a service aren't found here, the next place to look would be in the service configuration defaults file for any indication of a log file path (see the section "Cloudify Service Configuration Defaults").

### Cloudify Agent Worker Logs

Cloudify agent worker logs can be found on deployed instances / virtual machines with an installed Cloudify agent. Typically, the logs are stored in the Cloudify agent user's home directory in a folder named after the node instance ID for the instance / VM.

*   The Celery service SysV Init file is /etc/init.d/celeryd-<Node instance ID>.
*   The Celery service config file is /etc/default/celeryd-<Node instance ID>.
*   Cloudify agent worker log. ~/<Node instance ID>/work/<Node instance ID>.log
*   This is the agent counterpart to the Cloudify Management Worker logs. ~/<Node instance ID>/work/<Node instance ID>-<Worker ID>.log
*   Worker-specific log.
    *   Each Celery worker gets its own numbered log file. ~/<Node instance ID>/work/<Node instance ID>%I.log
*   Celery daemon / service logs

### Cloudify Management Worker Logs 

* /var/log/cloudify/mgmtworker/cloudify.management_worker.log

    *   Cloudify management worker log.
    *   Useful for troubleshooting management worker issues such as Cloudify agent deployment, blueprint deployment creation, and heartbeat errors.
    *   Contains information about deployment executions from the perspective of the management worker.
    *   Shows worker tracebacks.
    *   Task execution logs are followed by noting the task dispatch ID (a UUID). Task IDs can also be found in execution logs and used to search this worker log for further details. Specific task logs will have prefixes of "Received task", "Task accepted", and "Task [succeeded | failed]". Here's an example:

    **Code Block 13 LOG**

    ```
    Received task: cloudify.dispatch.dispatch[b164cf2c-d601-4484-bbce-927e1106de27]
    Task accepted: cloudify.dispatch.dispatch[b164cf2c-d601-4484-bbce-927e1106de27] pid:5683
    Task cloudify.dispatch.dispatch[b164cf2c-d601-4484-bbce-927e1106de27] succeeded in 1.015225859s

    ```

* /var/log/cloudify/mgmtworker/logs/<Deployment ID>.log

    *   Cloudify deployment worker log.
    *   Useful for troubleshooting deployment executions of all types. Low-level logging of worker tasks and is generally used as an additional source of information if the execution logs themselves aren't sufficient.
    *   Shows worker tracebacks.
        
###  Cloudify REST API Service Logs

* /var/log/cloudify/rest/cloudify-rest-service.log

    *   Serves as a central log file for all incoming and outgoing REST API requests and responses. Log entries are in a well-defined, human-readable format.
    *   Provides a host of useful information such as request details (HTTP method, headers, query string details, JSON data, endpoint path, etc…) and response details (HTTP status, headers).
    *   Can be monitored, on-demand, for bad HTTP response codes, blueprint file names, endpoint security checks, etc

* /var/log/cloudify/rest/gunicorn-access.log

    *   Verbose access logs directly from the HTTP server itself.
    *   Well-structured, dense logging format.
    *   Useful for monitoring REST API interaction, user fingerprinting, and this log file includes maintenance endpoint calls and other "internal" endpoints that Cloudify uses.

* /var/log/cloudify/rest/gunicorn.log

    *   Gunicorn HTTP server system service log.
    *   Useful for troubleshooting SysV init service failures as well as enumerating the
    *   HTTP server worker process IDs and HTTP server listening endpoint.

### PostgreSQL Logs

* /var/log/cloudify/postgresql

    *   PostgreSQL system service log.
    *   Useful for gathering information about the PostgreSQL service such as version, process ID, build, and cluster information.
    *   Useful for monitoring cluster state and indexing tasks.
    *   Useful for PostreSQL service troubleshooting.

###  RabbitMQ Logs

* /var/log/cloudify/rabbitmq/<RabbitMQ Node>.log

    *   RabbitMQ system service log.
    *   Useful for gathering information about the RabbitMQ service such as node name, config file locations, database directory, and running reporting info.
    *   Useful for RabbitMQ service troubleshooting.

###  Cluster Logs

* /var/log/cloudify/cloudify-cluster.log

    *   Cluster services log.
    *   All cluster services log to this file and journald.
    *   Useful for gathering information about Cluster operations.
