+++
title = "Compact"
description = "This section covers the requirments, installation, and operation steps for a Compact cluster (3-node cluster). In a Compact cluster each node has 3 layers, Cloudify Manager, PostgreSQL, and RabbitMQ."
weight = 20
alwaysopen = false
+++

## {{< param product_name >}} Compact Cluster

![compact_Cluster]( /images/cluster/three_nodes_cluster.png )

{{< param product_name >}}'s clustering architecture is based on an active-active model, and on service separation,
allowing {{< param product_name >}} to offer a high availability architecture while keeping the flexibility to leverage
a managed external PostgreSQL database service or RabbitMQ messaging queue.
The separation of services approach was introduced in v5.0.5 and improved the scaling ability and
the robustness of the failover mechanism thanks to the active-active approach and to the usage of
industry-standard replication and synchronization concepts.    

When using the complete high availability cluster a minimal number of 9 VMs is required.
Some organizations are seeking a more compact model leveraging just 3 VMs for ease of maintenance and control.
The 3 nodes cluster topology was designed to answer this. A 3 VM compact model still offers an active-active
approach and complete high availability, yet leveraging just 3 VMs for simplified management and operational flows.
In this model, each of the VMs is running all of the {{< param product_name >}} services, namely the {{< param cfy_manager_name >}},
the PostgreSQL database, and the Rabbit messaging queue.  

{{% note title="Note" %}}
Note: While all services are running on each of the VMs, it does not necessarily mean that communication
is always internal in the VM. For example, the database's high availability setup is such that at any given
time one node is active while the other nodes are in synchronous replica and async replica.
That means that all the managers will be communicating with the active database node regardless if it is a local or a remote one.
{{% /note %}}