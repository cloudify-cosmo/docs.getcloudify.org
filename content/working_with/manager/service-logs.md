---
layout: bt_wiki
title: Service Logs
category: Manager Intro
draft: false
weight: 1000
aliases: /manager/service-logs/
---

This page briefly explains the different log files that will be available on the Cloudify Manager host.

{{% note title="Note" %}}
Running `cfy logs download` will download a tar gzipped file containing most log files discussed in this page.
{{% /note %}}

## REST

The REST service runs using the Flask web framework on top of the Gunicorn HTTP server. Each of these layers has its own logs.


### Flask Log
The Flask logger is used by the REST service to write custom logs. Additionally, it records each request-response pair with their relevant
parameters and information.

This log file is located at `/var/log/cloudify/rest/cloudify-rest-service.log`.

The log level of the different packages that can be found in this log file can be configured using the log config file: /etc/cloudify/logging.conf.

The default content of the log config file is:
```bash
# usage: (DEBUG, INFO, WARNING, ERROR) service_name
WARNING pika
WARNING cloudify.rest_client
WARNING cloudify.rest_client.http
WARNING urllib3
WARNING requests
WARNING amqp
WARNING cloudify.amqp_client
WARNING elasticsearch
WARNING kombu.mixins
```


### Gunicorn Logs
There are two log files Gunicorn writes to: an access log and a general log.

The access log simply logs a concise entry for each request made to the web server.

This log file is located at `/var/log/cloudify/rest/gunicorn-access.log`.

The general log mostly has information on Gunicorn workers. It is usually only interesting when there was a problem in starting up the REST
service and Flask.

This log file is located at `/var/log/cloudify/rest/gunicorn.log`.

### Security Audit Log
When starting the Cloudify Manager in a secured mode, requests sent to the REST server go through authentication.
The security audit log file documents successful and failed REST calls, their origin, method of authentication and,
if the authentication failed, the reason for the failure.

The audit log file is located at `/var/log/cloudify/rest/rest-security-audit.log`.

## Management Worker

Starting with Cloudify 3.4, the management worker is responsible for *all* central deployment operations of *all* deployments.

### Celery Logs

The management worker log only contains celery specific logging. This log will contain top level details regarding the tasks it handles, such as task accepted,
task succeeded, task failed (with a generic traceback that will always look the same), etc...
The task it handles will always be `cloudify.dispatch.dispatch` which will actually start the operation/workflow code in its own subprocess.

This log file is located at `/var/log/cloudify/mgmtworker/cloudify.management_worker.log`.

### Deployment Logs

In the aformentioned subprocess, which is where the operation/workflow actually runs, the root logger handler is configured to send all logging of all
loggers in this subprocess to a deployment specific log file. This is where the "interesting" stuff appears. Specifically, if you are looking for a traceback,
this is where you should be looking.

These logs files are located at `/var/log/cloudify/mgmtworker/logs/<deployment_id>.log`.

### System Logs

In addition, the `mgmtworker/logs` dir will contain an additional log file, that will include all logging from operations/workflows that are
"system wide" (e.g. snapshot, install plugin on REST upload, etc...)

This log file is located at `/var/log/cloudify/mgmtworker/logs/__system__.log`.

{{% note title="Note" %}}
Remote hosts that have a Cloudify Agent running on them will have their log files located at `$HOME/<compute_instance_id>/work` on the remote host.
{{% /note %}}

## Other Components

You can find all log files for Cloudify related services located at `/var/log/cloudify`.

## Log Rotation

All Cloudify related log files on the manager host are managed by logrotate. Log files are configured to rotate when they reach the size of `100MB`.
At most, 7 rotated files are kept for each rotated log file.

## Log Cleanup

You can remove Cloudify logs and events from the database with the delete_logs_and_events_from_db.py that is located on the Cloudify Manager under /etc/cloudify. 
When you run the script, the logs and events that exist from after the save period configured in the script are removed.

You can change the DEFAULT_SAVE_PERIOD parameter in the script to set the number of days that are kept in the database (Default: 5). For example, if the DEFAULT_SAVE_PERIOD is 7, logs and events that are older than 7 days are deleted.
