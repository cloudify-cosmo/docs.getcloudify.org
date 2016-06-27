---
layout: bt_wiki
title: nodes
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 150
---

The `cfy nodes` command is used to view information on the different nodes of a deployment.

You can use the command to list all nodes and get information on a single node.


## Commands


### list

Usage: `cfy nodes list`

Lists all nodes

#### Optional flags

* `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment to list nodes for. If omitted, this will list nodes for all deployments

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy nodes list
...

Listing all nodes...

Nodes:
+-----------------+-------------------------------------+-------------------------------------+---------+----------------------------------+---------------------+-----------------------------+
|        id       |            deployment_id            |             blueprint_id            | host_id |               type               | number_of_instances | planned_number_of_instances |
+-----------------+-------------------------------------+-------------------------------------+---------+----------------------------------+---------------------+-----------------------------+
|       host      |            simple_website           |                simple               |   host  |      cloudify.nodes.Compute      |          1          |              1              |
| http_web_server | cloudify-hello-world-example-master | cloudify-hello-world-example-master |    vm   |     cloudify.nodes.WebServer     |          1          |              1              |
|    elastic_ip   | cloudify-hello-world-example-master | cloudify-hello-world-example-master |   None  |   cloudify.aws.nodes.ElasticIP   |          1          |              1              |
| http_web_server |            simple_website           |                simple               |   host  |     cloudify.nodes.WebServer     |          1          |              1              |
|  security_group | cloudify-hello-world-example-master | cloudify-hello-world-example-master |   None  | cloudify.aws.nodes.SecurityGroup |          1          |              1              |
|        vm       | cloudify-hello-world-example-master | cloudify-hello-world-example-master |    vm   |   cloudify.aws.nodes.Instance    |          1          |              1              |
+-----------------+-------------------------------------+-------------------------------------+---------+----------------------------------+---------------------+-----------------------------+

...

$ cfy nodes list -d simple_website
...

Listing nodes for deployment simple_website...

Nodes:
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+
|        id       | deployment_id  | blueprint_id | host_id |           type           | number_of_instances | planned_number_of_instances |
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+
|       host      | simple_website |    simple    |   host  |  cloudify.nodes.Compute  |          1          |              1              |
| http_web_server | simple_website |    simple    |   host  | cloudify.nodes.WebServer |          1          |              1              |
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+

...
{{< /gsHighlight >}}


### get

Usage: `cfy nodes get [options] -d DEPLOYMENT_ID --node-id NODE_ID`

Retrieve information on a single execution.

#### Required flags

*  `--node-id=NODE_ID` -    The node's ID
*  `-d, --deployment-id=DEPLOYMENT_ID` - The deployment ID to which the node is related

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy nodes get -d simple_website --node-id http_web_server
...

Retrieving node http_web_server for deployment simple_website

Node:
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+
|        id       | deployment_id  | blueprint_id | host_id |           type           | number_of_instances | planned_number_of_instances |
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+
| http_web_server | simple_website |    simple    |   host  | cloudify.nodes.WebServer |          1          |              1              |
+-----------------+----------------+--------------+---------+--------------------------+---------------------+-----------------------------+

Node properties:
	port: 8000

Node instance IDs:
	http_web_server_ce97d

...
{{< /gsHighlight >}}