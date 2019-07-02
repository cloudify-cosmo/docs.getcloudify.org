---
title: High Availabilty Guides
description: Guides for HA scenarios
weight: 60
alwaysopen: false
---
Cloudify Manager HA supports having a resilient and self sustained environment, based on error detection and automatic failover accordingly.  
Cloudify Manager HA works in an active/passive manner with a minimum of at least 3 nodes and a recommended number of an odd number of nodes (for a split-brain scenario).  
In case of any failure, specifically on the master node, HA will detect the error and an election will trigger, once a new master has been elected, a failover will trigger.  

Currently, HA supports 2 different Clustering architectures:

## All-in-one Cluster

In an all-in-one cluster scenario, you will have Cloudify Manager with all services installed on the same machine, that includes the database.  
In such a scenario, as part of the cluster initialization, Cloudify Manager will replicate the DB across the joining nodes.

![Cloudify all-in-one_Cluster]( /images/ops_guides/ha_guides/All-in-one_Cluster.jpg )

## External DB Cluster

When using an external DB, whether it was installed using Cloudify's Installer or using an existing DB, HA's behavior is the same, failover and error detection remain the same.  
The only exception - Cloudify Manager now treats the external DB as it is not managed by it, meaning it will not try to replicate the data, and will not detect any DB service errors.  
In such a scenario, the user is completely responsible for the external DB and any HA mechanisms he chooses to to incorporate with it.

![Cloudify External_DB_Cluster]( /images/ops_guides/ha_guides/External_DB_Cluster.jpg )
