+++
title = "Upgrade"
description = "Upgrade"
weight = 80
alwaysopen = false
+++

## Upgrading a {{< param product_name >}} Fully Distributed Cluster (9 Nodes)
        
If the initial cluster installation was done using the {{< param product_name >}} Cluster Manager, follow this simplified process.
Updating a {{< param product_name >}} Fully Distributed Cluster leveraging the {{< param product_name >}} Cluster Manager
you can use the {{< param product_name >}} Cluster Manager tool to upgrade a fully distributed cluster.

Upgrade your {{< param product_name >}} Cluster Manager by running:
```
sudo yum install -y <Cluster Manager Installation RPM>
```

On the host that has {{< param product_name >}} Cluster Manager installed, run cfy_cluster_manager upgrade. 
Optional Arguments: 
```
--config-path The completed cluster configuration file path. Default: ./cfy_cluster_config.yaml
--upgrade-rpm Path to a v6.1.0 cloudify-manager-install RPM. This can be either a local or remote path.
Default: <{{< param product_name >}} Manager Installation RPM>

-v, --verbose Show verbose output
Running this command will automatically run the upgrade procedure on the cluster. 
```

If the cluster was manually deployed, please follow this procedure instead:

Manually updating a Fully Distributed Cluster
Update steps:
Install the new 6.1.0 cloudify-manager-install RPM on all the cluster nodes, by using the command: 
```
sudo yum install -y <{{< param product_name >}} Manager Installation RPM> 
```

Repeat this step on all 9 nodes.


On all three database nodes run 
```
cfy_manager upgrade 
```
Do it one after the other, not in parallel.


On all three RabbitMQ nodes run 
```
cfy_manager upgrade
```
Do it one after the other, not in parallel.


On all manager nodes, run 
```
cfy_manager upgrade
```
Do it one after the other, not in parallel.


If {{< param product_name >}} agents are used in your deployments, run the following command from just one of the manager nodes:
```
cfy agents install
```

When opening the {{< param product_name >}} Management Console after the upgrade, you might see “This page is empty”, this happens because of cached data. To solve this, press CTRL + Shift + R.