---
title: Troubleshooting FAQ
category: Operations Guides
draft: false
weight: 100
---
This troubleshooting guide provides a list of frequently asked questions that point to common troubleshooting techniques or external cloudify documents where necessary.

## Deleting a deployment fails with the error message: **Deployment still has active nodes**

First uninstall the deployment (i.e. run the "uninstall" workflow on the deployment) and then run the delete on the deployment again.


## A deployment install failed, how do I find out what went wrong?

By searching through the Cloudify logs and events you should be able to ascertain what went wrong with the install.  The following Cloudify page [here](https://docs.cloudify.co/latest/working_with/console/deployments-page/) should detail how to retrieve events and logs for deployment workflows from the Cloudify UI.


## Where are the Cloudify service log files?

There are many different services running on the cloudify managers most of which an operator should not need to access in day-to-day operation of the platform.  However in the case where a cloudify service cannot be restarted or appears to not be working these service log files are detailed [here](https://docs.cloudify.co/latest/working_with/manager/service-logs/) in this Cloudify document.


## What do the different status badges shown on the topology diagram in the cloudify UI mean?

The following cloudify document details these status badges [here](https://docs.cloudify.co/latest/working_with/console/deployments-page/)).


## How do I know if a deployment is installed or not?

The status badges on each of the nodes in the deployments topology diagram indicate which nodes have been installed.  See the following cloudify document for details of these status badges [here](https://docs.cloudify.co/latest/working_with/console/deployments-page/).


## Where can I see the inputs and outputs of a deployment?

You will be able to see these from the Cloudify UI from the deployments dashboard as per this example.



<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/Cloudify-Troubleshooting0.png). Store image on your image server and adjust path/filename if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/Cloudify-Troubleshooting0.png "image_tooltip")



## How can I check to see if the Cloudify Manager is operating correctly?

There is a way to find out this information using the Cloudify cli, this method is detailed in the "Troubleshooting techniques" section below.


## We have a stuck deployment with 'starting' or 'cancelling' state?

Sometimes you will have deployments you can't delete via the UI / CLI / API. These simple instructions will help you remove these.

First, make sure to cancel stuck execution:


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

You should run uninstall to clean manager from deployment data:


```
cfy uninstall -d <deployment id>

```



## What to do if an active manager is stopped or fails during workflow execution?

This will result in a stuck deployment. Follow the steps described in the previous answer.


## What to do if an active manager is stopped or fails during plugin upload?

This will result in an inconsistent plugin management. Follow these steps:


```
cfy plugins delete <plugin id>

cfy plugins upload <plugin file path> -y plugin.yaml path

```



# Troubleshooting techniques


## How to run cloudify cli commands

In order to run the cloudify cli command 'cfy' you need to ensure that you have installed the Cloudify CLI


```
rpm –qa | grep cloudify-cli
```

Make sure your CLI profile is properly set:

```
$ cfy profiles use <manager IP>

```

Alternatively the cloudify CLI tool can be installed on your system by following one of the methods on the cloudify web site [here](https://docs.cloudify.co/5.0.0/install_maintain/installation/installing-cli/).


## How to retrieve the status of the cloudify manager or cluster via the cli

login to a server

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
