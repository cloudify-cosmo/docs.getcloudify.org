---
layout: bt_wiki
title: node-instances
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 130
---

The `cfy node-instances` command is used to view information on the different node-instances of a deployment.

You can use the command to list the node-instances of a specific deployment or of all deployments and to retrieve information on a single node-instance.


## Commands

### list

Usage: `cfy node-instances list [OPTIONS]`

List node-instances

If `DEPLOYMENT_ID` is provided, list node-instances for that deployment.
Otherwise, list node-instances for all deployments.

#### Optional flags

*  `-d, --deployment-id TEXT` - 
						The unique identifier for the deployment
*  `-n, --node-name TEXT` - 
						The node's name
*  `--sort-by TEXT` - 	Key for sorting the list
*  `--descending` - 	Sort list in descending order [default: False]

&nbsp;
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

Usage: `cfy node-instances get [OPTIONS] NODE_INSTANCE_ID`

Retrieve information for a specific node-instance

`NODE_INSTANCE_ID` is the id of the node-instance to get information on.

&nbsp;
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