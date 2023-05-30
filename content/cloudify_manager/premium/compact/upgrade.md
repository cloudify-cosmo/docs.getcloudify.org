+++
title = "Upgrade"
description = "Upgrade"
weight = 60
alwaysopen = false
+++

## Upgrading a {{< param product_name >}} Compact Cluster (3 Nodes)

If the initial cluster installation was done using the {{< param product_name >}} Cluster Manager, follow this simplified process.
Updating a {{< param product_name >}} Compact Cluster leveraging the {{< param product_name >}} Cluster Manager,
you can use the {{< param product_name >}} Cluster Manager tool to upgrade a compact cluster.

Upgrade your {{< param product_name >}} Cluster Manager by running:

```
sudo yum install -y <{{< param product_name >}} Manager Installation RPM>
```

On the host that has {{< param product_name >}} Cluster Manager installed, run:
```
cfy_cluster_manager upgrade
```

Optional arguments: 

```
--config-path The completed cluster configuration file path. Default: ./cfy_cluster_config.yaml
--upgrade-rpm Path to a v6.4.0 cloudify-manager-install RPM. This can be either a local or remote path.

Default:<{{< param product_name >}} Manager Installation RPM>

-v, --verbose Show verbose output
```

Running this command will automatically run the upgrade procedure on the cluster. 

If the Cluster was manually deployed, please follow this procedure instead:

### Manually Updating a {{< param product_name >}} Compact Cluster

Install the new 6.4 release `{{< param product_name >}}-manager-install` RPM on all 3 nodes of the cluster, by using the command: 

```
sudo yum install -y <{{< param product_name >}} Manager Installation RPM>
```

Repeat this step on all 3 nodes.

On each of the cluster nodes, run:
```
cfy_manager upgrade -c <path to DB config>. 
```

Do it one after the other, not in parallel.

{{% note %}}
Tip: If you used the cloudify-cluster-manager tool to generate the {{< param product_name >}} cluster, the path to the DB config file is /etc/cloudify/postgresql-<node number>_config.yaml.
{{% /note %}}

If the cluster was manually installed, please direct the command to the path of the file you generated.


On each of the cluster nodes, run:
```
cfy_manager upgrade -c <path to rabbitmq config>. 
```

Do it one after the other, not in parallel.

{{% note %}}
Tip: If you used the {{< param product_name >}}-cluster-manager tool to generate the {{< param product_name >}} cluster, the path to the RabbitMQ config file is  /etc/cloudify/rabbitmq-<node number>_config.yaml. If the cluster was manually installed, please direct the command to the path of the file you generated.
{{% /note %}}

On each one of the cluster nodes, run:
```
cfy_manager upgrade -c <path to manager config>
```

Do it one after the other, not in parallel.

{{% note %}}
Tip: If you used the {{< param product_name >}}-cluster-manager tool to generate the {{< param product_name >}} cluster, the path to the manager config file is /etc/cloudify/manager-<node number>_config.yaml. If the cluster was manually installed, please direct the command to the path of the file you generated. 
{{% /note %}}

If {{< param product_name >}} agents are used in your deployments, run the following command from just one of the cluster nodes:
```
cfy agents install
```

When opening the {{< param product_name >}} Management Console after the upgrade, you might see “This page is empty”, this happens because of cached data. To solve this, press CTRL + Shift + R.