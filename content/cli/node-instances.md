---
layout: bt_wiki
title: node-instances
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 130
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
                           
#### Example

```markdown
$ cfy node-instances list
...

Listing all instances...

Instances:
+-----------------------+-------------------------------------+------------+-----------------+----------+
|           id          |            deployment_id            |  host_id   |     node_id     |  state   |
+-----------------------+-------------------------------------+------------+-----------------+----------+
|        vm_eb405       | cloudify-hello-world-example-master |  vm_eb405  |        vm       | started  |
| http_web_server_ce97d |            simple_website           | host_130e9 | http_web_server | creating |
|  security_group_e07d0 | cloudify-hello-world-example-master |    None    |  security_group | started  |
|    elastic_ip_f6edf   | cloudify-hello-world-example-master |    None    |    elastic_ip   | started  |
|       host_130e9      |            simple_website           | host_130e9 |       host      | started  |
| http_web_server_30b1d | cloudify-hello-world-example-master |  vm_eb405  | http_web_server | started  |
+-----------------------+-------------------------------------+------------+-----------------+----------+

...
```

### get

#### Usage 
`cfy node-instances get [OPTIONS] NODE_INSTANCE_ID`

Retrieve information for a specific node-instance.

`NODE_INSTANCE_ID` is the ID of the node-instance for which to retrieve information.

#### Optional flags

*  ` -t, --tenant-name TEXT`  The name of the tenant of the node-instance. If unspecified, the current tenant is used.


#### Example

```markdown
$ cfy node-instances get elastic_ip_f6edf
...

Retrieving node instance elastic_ip_f6edf

Node-instance:
+------------------+-------------------------------------+---------+------------+---------+
|        id        |            deployment_id            | host_id |  node_id   |  state  |
+------------------+-------------------------------------+---------+------------+---------+
| elastic_ip_f6edf | cloudify-hello-world-example-master |   None  | elastic_ip | started |
+------------------+-------------------------------------+---------+------------+---------+

Node instance runtime properties:
	instance_id: i-9a314816
	vpc_id: vpc-fbddd89e
	aws_resource_id: 52.18.204.246
	allocation_id: eipalloc-2955194c

...
```