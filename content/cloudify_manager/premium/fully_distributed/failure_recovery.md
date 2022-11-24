+++
title = "Failure Recovery"
description = "Failure Recovery"
weight = 100
alwaysopen = false
+++

## Failure Recovery

### The Whole Cluster is Down or Working Wrong

1.  Save `/etc/cloudify/ssl/*` files
1.  Teardown managers
1.  Install fresh managers with existing certificates in `/etc/cloudify/config.yaml`
1.  Create and join cluster
1.  Apply the latest working version snapshot on the active manager

### One Manager Cluster Node Down

1.  Remove the manager from the cluster
1.  Destroy manager
1.  Bootstrap fresh manager
1.  Join existing cluster

Effect: Healthy manager cluster

### Active Manager Node Down

1. Another healthy manager from the cluster automatically becomes an active manager.
1. Investigate error:
1. Either:
    * Fix problem
    * Destroy manager
        1. Install manager
        1. Join cluster

Effect: Healthy manager cluster

## Split Brain

This situation happens when for a while there is no connectivity between managers. Then each of them thinks that other managers are unhealthy and becomes a master. After connectivity is back master becomes the only one in the cluster. It's chosen based on the newest version of the PostgreSQL database. All data from other managers will be synced with the active one and others will become standbys. All data/ installed deployments/ plugins will get lost.
