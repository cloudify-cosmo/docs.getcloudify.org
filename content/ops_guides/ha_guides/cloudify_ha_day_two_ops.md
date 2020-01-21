---
title: Cloudify HA Day-2 Operations
description: Guides for manging Cloudify HA clusters
weight: 80
alwaysopen: false
---

# Day-2 operations for Cloudify HA

## Introduction

## Managing message queue cluster

* A new broker node (an installed node) can be added to the cluster by running the following command:

```bash  
   cfy_manager brokers add --join-node <A resolvable hostname which complies to the format rabbit@<hostname> >
``` 

* Listing all the current message queue brokers in the cluster is retrieved by running the following command: 

```bash  
   cfy_manager brokers list
``` 

* An existing broker node can be removed from the cluster by running the following command:

```bash  
   cfy_manager brokers remove <nodename>
``` 

## Managing database cluster

* Listing all the current database nodes in the cluster is retrieved by running the following command: 

```bash  
   cfy_manager dbs list
``` 

* A new database node (an installed node) can be added to the cluster by running the following command:

  * Database's node id can be obtained by running `cfy_manager node get-id`.

```bash  
   cfy_manager dbs add -a\--address <Node address> -i\--node-id <Node's cloudify node id> -n\--hostname <node's hostname>
``` 

* An existing database node can be removed from the cluster by running the following command:

  * Database's node id can be obtained by running `cfy_manager node get-id`.

```bash  
   cfy_manager dbs remove -a\--address <node's address> -i\--node-id <Node's cloudify node id>
``` 

* If a database node becomes unhealthy according to the cluster status, it can be re-initialized by running the following command:  

```bash  
   cfy_manager dbs reinit -a\--address <node's address>
``` 

* For switching the current database master node in the database cluster by running the following command:

```bash  
   cfy_manager dbs set-master -a\--address <node's address>
``` 
