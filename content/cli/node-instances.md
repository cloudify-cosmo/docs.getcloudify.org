---
layout: bt_wiki
title: node-instances
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 140
---

The `cfy node-instances` command is used to view information on the different node-instances of a deployment.

You can use the command to list the node-instances of a specific deployment or of all deployments and to retrieve information on a single node-instance.


## Commands

### list

Usage: `cfy node-instances list`

List node-instances.

#### Optional flags

*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        The ID of the deployment to list node-instances for.
                        If omitted, this will list node-instances for all
                        deployments


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
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
{{< /gsHighlight >}}

### get

Usage: `cfy node-instances get --node-instance-id NODE_INSTANCE_ID`

Retrieve information for a single node-instance.

#### Required flags

*  `--node-instance-id=NODE_INSTANCE_ID` -
                        The ID of the node-instance to get

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy node-instances get --node-instance-id elastic_ip_f6edf
...

Retrieving node instance elastic_ip_f6edf

Instance:
+------------------+-------------------------------------+---------+------------+---------+
|        id        |            deployment_id            | host_id |  node_id   |  state  |
+------------------+-------------------------------------+---------+------------+---------+
| elastic_ip_f6edf | cloudify-hello-world-example-master |   None  | elastic_ip | started |
+------------------+-------------------------------------+---------+------------+---------+

Instance runtime properties:
	instance_id: i-9a314816
	vpc_id: vpc-fbddd89e
	aws_resource_id: 52.18.204.246
	allocation_id: eipalloc-2955194c

...
{{< /gsHighlight >}}