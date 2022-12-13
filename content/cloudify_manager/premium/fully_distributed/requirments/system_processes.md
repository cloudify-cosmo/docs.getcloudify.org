+++
title = "System Processes"
description = "This section reviews the system processes for the Cloudify Manager environment."
weight = 60
alwaysopen = false
+++

## {{< param product_name >}} System Processes

In a {{< param cfy_manager_name >}} environment, the following system processes exist

| USER        | COMMAND                                                                       | DESCRIPTION                                                 |
|-------------|-------------------------------------------------------------------------------|-------------------------------------------------------------|
| cfyuser     | nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf                | Nginx web server (REST API) root process                    |
| nginx       | nginx: worker process                                                         | Nginx web server (REST API) child process                   |
| stage_u+    | /usr/bin/npm –prefix /opt/cloudify-stage/backend run start                    | React.js web application ({{< param cfy_console_name >}})   |
| composer_u+ | /usr/bin/npm –prefix /opt/cloudify-composer/backend run start                 | React.js web application ({{< param cfy_composer_name >}})  |
| amqpinf+    | /opt/amqpinflux/env/bin/python /opt/amqpinflux/env/bin/cloudify-amqp-influxdb | Cloudify-specific RabbitMQ-to-InfluxDB transport            |
| rabbitmq    | su rabbitmq -s /bin/sh -c /usr/lib/rabbitmq/bin/rabbitm q-server              | RabbitMQ service                                            |
| cfyuser     | /opt/manager/env/bin/python /opt/manager/env/bin/gunicorn                     | Gunicorn HTTP server                                        |
| postgres    | /usr/pgsql-9.5/bin/postgres -D /var/lib/pgsql/9.5/data                        | PostgreSQL database                                         |

## {{< param product_name >}} Systemd Init Services

| SERVICE                         | DESCRIPTION                         |
|---------------------------------|-------------------------------------|
| cloudify-mgmtworker             | Cloudify Manager management worker  |
| cloudify-rabbitmq               | RabbitMQ service                    |
| cloudify-restservice            | Cloudify REST service               |
| cloudify-stage                  | Cloudify Management Console service |
| cloudify-composer               | Cloudify Composer service           |
| cloudify-check-runner.service   | Check runner                        |
| cloudify-handler-runner.service | Handler runner                      |
| cloudify-postgresql.service     | PostgreSQL 9.5 database server      |
| cloudify-syncthing.service      | Files synching                      |

## Cloudify Service Configuration Defaults 

All {{< param product_name >}} specific service configurations can be found in /etc/sysconfig. This area is where default configuration data can be found as well as logging locations for service-specific troubleshooting. These are very useful when trying to understand how a service was instantiated and what logging configuration is being used.

This directory can also be used to derive each core service's Systemd init name. For instance, enumerating /etc/sysconfig will show a file called cloudify-stage. This is the name of the service, and thus to query the service status can be done using the command service cloudify-stage status.

## Discovering {{< param product_name >}} Services

### Service Statuses 

The sections above describe how to identify a {{< param product_name >}} service by looking directly at the output \
of something like _ps_ or by folder snooping. This is not always practical or desired and there are \
other, more developer-friendly, ways of enumerating which {{< param product_name >}} services are present and \
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
  "services": [
    {
      "display_name": "RabbitMQ",
      "instances": [
        {
          "ActiveState": "active",
          "Description": "RabbitMQ Service",
          "Id": "cloudify-rabbitmq.service",
          "LoadState": "loaded",
          "MainPID": 12322,
          "SubState": "running",
          "state": "running"
        }
      ]
    }
  ]
}

```

With this information, in standard JSON format, it is easy to match a core {{< param product_name >}} service with a \
system-level process ID (MainPID) to begin further troubleshooting.

### Cluster status 

{{< param product_name >}} provides system health information for both single box deployments and clustered deployments. Read more about it:

- [Cluster status widget]({{< relref "working_with/console/widgets/highAvailability.md" >}})
- [Cluster status]({{< relref "cli/maint_cli/clusters.md" >}})
- [Manager status]({{< relref "cli/orch_cli/status.md" >}})

## Checking Manager Components 

### RabbitMQ

**System Service**

To check if the RabbitMQ broker is running (and to see many other details such as which applications are running, memory allocation, and other performance metrics), simply run the following command:

**Code Block 7 Bash**

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

In order to utilize the web interface, you will need to have the RabbitMQ username and password for authentication. This can be found in the /etc/cloudify/config.yaml file used for instantiation a {{< param cfy_manager_name >}}.

By default, the user created from the manager instantiation process does not have sufficient permissions to be used with the web interface. Use the following command to promote the default user with the "monitoring" permission (or you can alternatively assign the "administrator" tag).

```
sudo rabbitmqctl set_user_tags <username> monitoring
```

You can now use the RabbitMQ username and password to log in via the web interface to do actions such as view queues, get messages, monitor performance, and monitor connections.

### PostgreSQL

**System Service**

To verify if postgres is working correctly a simple select can be executed:

**Code Block 10 Bash**

```
sudo -u postgres psql --port 15432 -c "select 1"
```

### Syncthing

Checking if syncing is working correctly will need a curl command to the REST API.

**Code Block 12 REST**

```
curl -H "X-Api-Key: <key>" 127.0.0.1:8384/rest/system/status

```

The key can be gathered from: `//configuration/gui/apikey in /opt/syncthing/.config/syncthing/config.xml`