+++
title = "Troubleshooting FAQ"
description = "Troubleshooting FAQ"
weight = 130
alwaysopen = false
+++

## Overview
This troubleshooting guide provides a list of frequently asked questions that point to common troubleshooting techniques or external {{< param product_name >}} documents where necessary.

## Deleting a deployment fails with the error message: **Deployment still has active nodes**

First uninstall the deployment (i.e. run the "uninstall" workflow on the deployment) and then run the delete on the deployment again.


## A deployment install failed, how do I find out what went wrong?

By searching through the {{< param product_name >}} logs and events you should be able to ascertain what went wrong with the installation.  The following {{< param product_name >}} page [here]({{< relref "working_with/console/pages/services-page.md" >}}) should detail how to retrieve events and logs for deployment workflows from the {{< param cfy_console_name >}}.


## Where are the {{< param product_name >}} service log files?

There are many different services running on the {{< param cfy_manager_name >}} most of which an operator should not need to access to in the day-to-day operation of the platform. However, in the case where a {{< param product_name >}} service cannot be restarted or appears to not be working these service log files are detailed [here]({{< relref "working_with/manager/service-logs.md" >}}) in this document.


## What do the different status badges shown on the topology diagram in the {{< param cfy_console_name >}} mean?

this [document]({{< relref "working_with/console/pages/services-page.md" >}}) details these status badges.


## How do I know if a deployment is installed or not?

The status badges on each of the nodes in the deployments topology diagram indicate which nodes have been installed.  See the following document for details of these status badges [here]({{< relref "working_with/console/pages/services-page.md" >}}).


## Where can I see the inputs and outputs of a deployment?

You can see these in {{< param cfy_console_name >}} in deployment page (in **Deployments** page click on specific deployment to enter it).


## How can I fix a failing deployment install?
If a deployment installation is failing with a runtime error (for example, the wrong credentials were provided), you should stop the installation and remove the deployment before you run the command again. To do that, run: replace `DEPLOYMENT_NAME` with an appropriate value.

```
cfy executions start stop -d DEPLOYMENT_NAME -p ignore_failure=true
cfy executions start uninstall -d DEPLOYMENT_NAME -p ignore_failure=true
cfy uninstall DEPLOYMENT_NAME
```

Fix the mistake and try again. If you run the uninstall commands above and get this error message:

```
An error occurred on the server: 404: Requested `Deployment` with ID `DEPLOYMENT_NAME` was not found
```

Just delete the "DEPLOYMENT_NAME" blueprint and try the install command again (read about [blueprints]({{< relref "cli/orch_cli/blueprints.md" >}}) and [deployments]({{< relref "cli/orch_cli/deployments.md" >}}) commands).


## How can I check to see if the {{< param cfy_manager_name >}} is operating correctly?

There is a way to find out this information using the {{< param cfy_cli_name >}}, this method is detailed in the "Troubleshooting techniques" section below.


## We have a stuck deployment with a starting or canceling state

Sometimes you will have deployments you can't delete via the UI/ CLI /API. These simple instructions will help you remove these.

First, make sure to cancel the stuck execution:


```
cfy executions list -d <deployment id>

cfy executions cancel <stuck execution id>
```


From the manager machine:


```
psql -U cloudify -W cloudify -h localhost -d cloudify_db –p 5432 # -p 15432 for CFY HA cluster
pass: cloudify

To remove a stuck execution:
delete from executions where status='cancelling';

To exit the CLI:
\q
```


Once you are done – refresh the UI. You should see these execution removed from the list.

You should run uninstall to clean the manager from deployment data:


```
cfy uninstall -d <deployment id>
```



## What to do if an active manager is stopped or fails during workflow execution?

This will result in a stuck deployment. Follow the steps described in the previous answer.


## What to do if an active manager is stopped or fails during plugin upload?

This will result in inconsistent plugin management. Follow these steps:


```
cfy plugins delete <plugin id>

cfy plugins upload <plugin file path> -y plugin.yaml path
```

## Failing to restore a snapshot on a cluster

Please ensure the system is in the maintanance mode. If the system is in the maintanance mode and you are still failing to take a snapshot due to DB deadlocks, keep one manager running and stop the rest.

## Troubleshooting techniques


### How to run {{< param cfy_cli_name >}} commands?

In order to run the {{< param cfy_cli_name >}} command 'cfy' you need to ensure that you have installed the {{< param cfy_cli_name >}}


```
rpm –qa | grep cloudify-cli
```

Make sure your CLI profile is properly set:

```
cfy profiles use <manager IP>
```

Alternatively, the {{< param cfy_cli_name >}} tool can be installed on your system by following one of the methods  [here]({{< relref "cloudify_manager/cloudify_cli" >}}).


### How to retrieve the status of the {{< param cfy_manager_name >}} or cluster via the CLI?

Login to a server

```
$ [centos@cm-1 ~]$ cfy status
Retrieving manager services status... [ip=10.1.1.41]
Services:
+--------------------------------+--------+
|            service             | status |
+--------------------------------+--------+
| Cloudify Console               | Active |
| Manager Rest-Service           | Active |
| PostgreSQL                     | Active |
| AMQP-Postgres                  | Active |
| File Sync Service              | Active |
| RabbitMQ                       | Active |
| Webserver                      | Active |
| Cloudify Composer              | Active |
| Management Worker              | Active |
+--------------------------------+--------+


$ cfy cluster status
Retrieving Cloudify cluster status... [ip=10.1.1.41]
Current cluster status is OK:

Cluster status services:
+--------------------------------+----------+
|            service             |  status  |
+--------------------------------+----------+
| manager                        |    OK    |
| db                             |    OK    |
| broker                         |    OK    |
+--------------------------------+----------+
```
