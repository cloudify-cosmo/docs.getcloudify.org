---
title: Service Logs
category: Manager Intro
draft: false
weight: 1000
aliases: /manager/service-logs/
---

This page briefly explains the different log files that will be available on the {{< param cfy_manager_name >}} host.

## Downloading the logs

Running `cfy logs download` will download a tar gzipped file containing the log files discussed in this page. This archive will be vital when requesting support with your {{< param cfy_manager_name >}}.

{{% note title="SSH access in the CLI" %}}
`cfy logs download` requires SSH access to your {{< param cfy_manager_name >}} machine. This means that the SSH key and the SSH username must be set in your CLI profile. You can set them using `cfy profiles set --ssh-key <path/to/file.pem>` and `cfy profiles set --ssh-user <username>`.
{{% /note %}}

{{% note title="Downloading logs from clusters" %}}
When working with a cluster of {{< param cfy_manager_name >}}s, use `cfy logs download --all-nodes` to download logs from all of the reachable cluster nodes. This will require the SSH key and user be set in the CLI profile for every node. You can set those by using `cfy profiles set-cluster <cluster node name> --ssh-user <username>` and `--ssh-key <path/to/file.pem>`.
{{% /note %}}


## REST

The REST service runs using the Flask web framework on top of the Gunicorn HTTP server. Each of these layers has its own logs.

### Flask Log
The Flask logger is used by the REST service to write custom logs. The information about exceptions raised by the REST service is stored in this log. Additionally, when the logging level is set to DEBUG, it records each request-response pair with their relevant parameters and information.

This log file is located at `/var/log/cloudify/rest/cloudify-rest-service.log`.

{{% note title="Setting the REST service logging level" %}}
The logging level can be set to debug by running `cfy config update rest_service_log_level=DEBUG` if more information about requests and responses is required. It can then be set back to the recommended level of info by running `cfy config update rest_service_log_level=INFO`.
{{% /note %}}


### Gunicorn Logs
There are two log files Gunicorn writes to: an access log and a general log.

The access log simply logs a concise entry for each request made to the web server.

This log file is located at `/var/log/cloudify/rest/gunicorn-access.log`.

The general log mostly has information on Gunicorn workers. It is usually only interesting when there was a problem in starting up the REST
service and Flask.

This log file is located at `/var/log/cloudify/rest/gunicorn.log`.


## Management Worker

The management worker is responsible for *all* central deployment operations of *all* deployments.

### Worker Logs

The management worker log contains top level details regarding the tasks it handles, such as task accepted,
task succeeded, task failed (with a generic traceback that will always look the same), etc...

The management worker handles _all_ of the workflow tasks, and some operation
tasks that use the `central_deployment_agent` as their executor. The
workflow/operation execution is done in its own subprocess.

This log file is located at `/var/log/cloudify/mgmtworker/mgmtworker.log`.

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
Remote hosts that have a {{< param product_name >}} Agent running on them will have their log files located at `$HOME/<compute_instance_id>/work` on the remote host.
{{% /note %}}

## Other Components

You can find all log files for {{< param product_name >}} related services located at `/var/log/cloudify`.

## Log Rotation {#log-rotation}

All {{< param product_name >}} related log files on the manager host are managed by logrotate. Log files are configured to rotate when they reach the size of `100MB`.
At most, 7 rotated files are kept for each rotated log file.

## Log Cleanup

You can remove {{< param product_name >}} logs and events from the database with the delete_logs_and_events_from_db.py that is located on the {{< param cfy_manager_name >}} under /etc/cloudify.
When you run the script, the logs and events that exist from after the save period configured in the script are removed.

You can change the DEFAULT_SAVE_PERIOD parameter in the script to set the number of days that are kept in the database (Default: 5). For example, if the DEFAULT_SAVE_PERIOD is 7, logs and events that are older than 7 days are deleted.
