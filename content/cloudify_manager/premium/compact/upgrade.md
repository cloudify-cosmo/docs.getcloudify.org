+++
title = "Upgrade"
description = "Upgrade"
weight = 60
alwaysopen = false
+++

## Upgrading a Cloudify Compact Cluster (3 Nodes)

If the initial cluster installation was done using the Cloudify Cluster Manager, follow this simplified process.
Updating a Cloudify Compact Cluster leveraging the Cloudify Cluster Manager,
you can use the Cloudify Cluster Manager tool to upgrade a compact cluster.

Upgrade your Cloudify Cluster Manager by running:

```
sudo yum install -y <Cloudify Manager Installation RPM>
```

On the host that has Cloudify Cluster Manager installed, run:
```
cfy_cluster_manager upgrade
```

Optional arguments: 

```
--config-path The completed cluster configuration file path. Default: ./cfy_cluster_config.yaml
--upgrade-rpm Path to a v6.4.0 cloudify-manager-install RPM. This can be either a local or remote path.

Default:<Cloudify Manager Installation RPM>

-v, --verbose Show verbose output
```

Running this command will automatically run the upgrade procedure on the cluster. 

If the Cluster was manually deployed, please follow this procedure instead:

### Manually Updating a Cloudify Compact Cluster

Install the new 6.4 release `cloudify-manager-install` RPM on all 3 nodes of the cluster, by using the command: 

```
sudo yum install -y <Cloudify Manager Installation RPM>
```

Repeat this step on all 3 nodes.

On each of the cluster nodes, run:
```
cfy_manager upgrade -c <path to DB config>. 
```

Do it one after the other, not in parallel.

{{% note %}}
Tip: If you used the cloudify-cluster-manager tool to generate the Cloudify cluster, the path to the DB config file is /etc/cloudify/postgresql-<node number>_config.yaml.
{{% /note %}}

If the cluster was manually installed, please direct the command to the path of the file you generated.


On each of the cluster nodes, run:
```
cfy_manager upgrade -c <path to rabbitmq config>. 
```

Do it one after the other, not in parallel.

{{% note %}}
Tip: If you used the cloudify-cluster-manager tool to generate the Cloudify cluster, the path to the RabbitMQ config file is  /etc/cloudify/rabbitmq-<node number>_config.yaml. If the cluster was manually installed, please direct the command to the path of the file you generated.
{{% /note %}}

On each one of the cluster nodes, run:
```
cfy_manager upgrade -c <path to manager config>
```

Do it one after the other, not in parallel.

{{% note %}}
Tip: If you used the cloudify-cluster-manager tool to generate the Cloudify cluster, the path to the manager config file is /etc/cloudify/manager-<node number>_config.yaml. If the cluster was manually installed, please direct the command to the path of the file you generated. 
{{% /note %}}

If Cloudify agents are used in your deployments, run the following command from just one of the cluster nodes:
```
cfy agents install
```

When opening the Cloudify Management Console after the upgrade, you might see “This page is empty”, this happens because of cached data. To solve this, press CTRL + Shift + R.