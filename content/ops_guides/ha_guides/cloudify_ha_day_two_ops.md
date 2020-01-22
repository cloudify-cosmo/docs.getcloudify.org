---
title: Cloudify cluster day 2 operations
description: Guides for manging Cloudify HA clusters
weight: 80
alwaysopen: false
---

## Introduction

Cloudify HA solution can contains three different clusters of database nodes, message queue brokers and Cloudify Managers.
This require the ability to manage those cluster, which include add/removing/listing/custom-action to the cluster.  

<aside class="notice">
All day 2 operations should only be conducted while the cluster is in maintenance mode.
</aside>

## Cloudify management service operations  

* For removing a management service cluster node, please run on a management node (not the one you wish to remove):

```bash  
   cfy cluster remove <A resolvable hostname>
``` 

* For adding a management service cluster node, please install the new node on the same network settings as in Cloudify management service nodes.

## Message queue cluster operations

* A new broker node (an installed node) can be added to the cluster by running the following:

  * Run the following command on the newly installed node to connect a broker to the cluster:
  
    ```bash  
       cfy_manager brokers add -j\--join-node <A resolvable hostname  or IP of an existing member of the cluster>
    ``` 

  * Run the following command to register the new broker node at the Cloudify management service:

    ```bash  
      cfy cluster brokers add <new broker name> <new broker address>
    ```

* Listing all the current message queue brokers in the cluster is retrieved by running the following command: 

    ```bash  
       cfy_manager brokers list
    ``` 

* An existing broker node can be removed from the cluster by running the following command:

  * First the broker node should be uninstalled, please run the following:
    
    <aside class="notice">
    Please note that it's recommended to have at least three node cluster.
    </aside>
  
    ```bash  
       cfy_manager remove
    ``` 

  * Run the following command to remove the broker from the cluster, which should be run from one of the remaining cluster nodes:
    
    ```bash  
       cfy_manager brokers remove -r\--remove-node <nodename>
    ``` 

  * Run the following command to unregister the new broker node at the Cloudify management service:
  
    ```bash  
       cfy cluster brokers remove <broker name>
    ``` 

## Database cluster operations

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
