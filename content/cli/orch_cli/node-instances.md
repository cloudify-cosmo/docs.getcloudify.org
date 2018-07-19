---
layout: bt_wiki
title: node-instances
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/node-instances/
---

The `cfy node-instances` command is used to view information about the different node-instances of a deployment.

You can use the command to list the node-instances of a specific deployment or of all deployments, and to retrieve information about a single node-instance.

#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.

## Commands

### list

#### Usage 
`cfy node-instances list [OPTIONS]`

List node-instances.

If `DEPLOYMENT_ID` is provided, lists node-instances for that deployment.
Otherwise, lists node-instances for all deployments.

#### Optional flags

*  `-d, --deployment-id TEXT` - 
						The unique identifier for the deployment
*  `-n, --node-name TEXT` - 
						The node's name
*  `--sort-by TEXT` - 	Key for sorting the list
*  `--descending` - 	Sort list in descending order [default: False]
*  `-t, --tenant-name TEXT` -  The name of the tenant from which to list node-instance. If unspecified, the current tenant is
                            used. This argument cannot be used simultaneously with the `all-tenants` argument.
*  `-a, --all-tenants` -    Include resources from all tenants associated with
                            the user. This argument cannot be used simultaneously with the `tenant-name` argument.           

*  `--search TEXT`     Search node-instances by id. The returned list will include only node-instances that contain the given search pattern.

*  `-o, --pagination-offset INTEGER`       The number of resources to skip;
                                  --pagination-offset=1 skips the first resource [default: 0]

*  `-s, --pagination-size INTEGER`       The max number of results to retrieve per page [default: 1000]


                           

&nbsp;

#### Example

{{< highlight  bash  >}}
$ cfy node-instances list
...

Listing all instances...

Node-instances:
+------------------------+------------------------------+-------------+-----------------+---------+------------+----------------+------------+
|           id           |        deployment_id         |   host_id   |     node_id     |  state  | visibility |  tenant_name   | created_by |
+------------------------+------------------------------+-------------+-----------------+---------+------------+----------------+------------+
|      host_gkxr6j       | cloudify-nodecellar-example  | host_gkxr6j |       host      | started |  creator   | default_tenant |   admin    |
| http_web_server_mwtpct | cloudify-hello-world-example |  vm_qu2t7i  | http_web_server | started |  creator   | default_tenant |   admin    |
|     mongod_nps479      | cloudify-nodecellar-example  | host_gkxr6j |      mongod     | started |  creator   | default_tenant |   admin    |
|   nodecellar_gj0mj2    | cloudify-nodecellar-example  | host_gkxr6j |    nodecellar   | started |  creator   | default_tenant |   admin    |
|     nodejs_gsy2zz      | cloudify-nodecellar-example  | host_gkxr6j |      nodejs     | started |  creator   | default_tenant |   admin    |
|       vm_qu2t7i        | cloudify-hello-world-example |  vm_qu2t7i  |        vm       | started |  creator   | default_tenant |   admin    |
+------------------------+------------------------------+-------------+-----------------+---------+------------+----------------+------------+

...
{{< /highlight >}}

### get

#### Usage 
`cfy node-instances get [OPTIONS] NODE_INSTANCE_ID`

Retrieve information for a specific node-instance.

`NODE_INSTANCE_ID` is the ID of the node-instance for which to retrieve information.

#### Optional flags

*  ` -t, --tenant-name TEXT`  The name of the tenant of the node-instance. If unspecified, the current tenant is used.


#### Example

{{< highlight  bash  >}}
$ cfy node-instances get nodecellar_gj0mj2
...

Retrieving node instance nodecellar_gj0mj2

Node-instance:
+-------------------+-----------------------------+-------------+------------+---------+------------+----------------+------------+
|         id        |        deployment_id        |   host_id   |  node_id   |  state  | visibility |  tenant_name   | created_by |
+-------------------+-----------------------------+-------------+------------+---------+------------+----------------+------------+
| nodecellar_gj0mj2 | cloudify-nodecellar-example | host_gkxr6j | nodecellar | started |  creator   | default_tenant |   admin    |
+-------------------+-----------------------------+-------------+------------+---------+------------+----------------+------------+

Instance runtime properties:
	mongo_port: 27017
	nodejs_binaries_path: /tmp/68672f1b-b49a-4e58-ae6f-b2de63676e4f/nodejs/nodejs-binaries
	pid: 27816
	nodecellar_source_path: /tmp/68672f1b-b49a-4e58-ae6f-b2de63676e4f/nodecellar/nodecellar-source
	mongo_ip_address: localhost

...

{{< /highlight >}}
