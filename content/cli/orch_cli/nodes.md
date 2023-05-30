---
title: nodes
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/nodes/
---

The `cfy nodes` command is used to view information on the different nodes of a deployment.

You can use the command to list all nodes and get information on a single node.


#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands


### list

#### Usage
`cfy nodes list [OPTIONS]`

Lists all nodes for a deployment.

If `DEPLOYMENT_ID` is provided, lists nodes for that deployment. Otherwise,
list nodes for all deployments.

#### Optional flags

* `-d, --deployment-id TEXT` -
						The unique identifier for the deployment.
*  `--sort-by TEXT` - 	Key for sorting the list.
*  `--descending` - 	Sort list in descending order. [default: False]
*  `-t, --tenant-name TEXT` -  The name of the tenant from which to list the nodes. If unspecified, the current tenant is
                            used. This argument cannot be used simultaneously with the `all-tenants` argument.
*  `-a, --all-tenants` -    Include resources from all tenants associated with
                            the user. This argument cannot be used simultaneously with the `tenant-name` argument.

*  `--search TEXT`     Search nodes by id. The returned list will include only nodes that contain the given search pattern.

*  `-o, --pagination-offset INTEGER`       The number of resources to skip;
                                  --pagination-offset=1 skips the first resource [default: 0]

*  `-s, --pagination-size INTEGER`       The max number of results to retrieve per page [default: 1000]

*  `--run-checks` Run the check_drift and check_status workflows before listing nodes. (Note: the relevant instance counts are only shown in the extended view)


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy nodes list
...

Listing all nodes...

Nodes:
+-----------------+------------------------------+------------------------------+---------+----------------------------------------------+---------------------+-----------------------------+------------+----------------+------------+
|        id       |        deployment_id         |         blueprint_id         | host_id |                     type                     | number_of_instances | planned_number_of_instances | permission |  tenant_name   | created_by |
+-----------------+------------------------------+------------------------------+---------+----------------------------------------------+---------------------+-----------------------------+------------+----------------+------------+
| http_web_server | cloudify-hello-world-example | cloudify-hello-world-example |    vm   |           cloudify.nodes.WebServer           |          1          |              1              |  creator   | default_tenant |   admin    |
|        vm       | cloudify-hello-world-example | cloudify-hello-world-example |    vm   |            cloudify.nodes.Compute            |          1          |              1              |  creator   | default_tenant |   admin    |
|      mongod     | cloudify-nodecellar-example  | cloudify-nodecellar-example  |   host  |   nodecellar.nodes.MonitoredMongoDatabase    |          1          |              1              |  creator   | default_tenant |   admin    |
|    nodecellar   | cloudify-nodecellar-example  | cloudify-nodecellar-example  |   host  | nodecellar.nodes.NodecellarApplicationModule |          1          |              1              |  creator   | default_tenant |   admin    |
|       host      | cloudify-nodecellar-example  | cloudify-nodecellar-example  |   host  |       nodecellar.nodes.MonitoredServer       |          1          |              1              |  creator   | default_tenant |   admin    |
|      nodejs     | cloudify-nodecellar-example  | cloudify-nodecellar-example  |   host  |        nodecellar.nodes.NodeJSServer         |          1          |              1              |  creator   | default_tenant |   admin    |
+-----------------+------------------------------+------------------------------+---------+----------------------------------------------+---------------------+-----------------------------+------------+----------------+------------+

...

$ cfy nodes list -d simple_website
...

Listing nodes for deployment cloudify-hello-world-example...

Nodes:
+-----------------+------------------------------+------------------------------+---------+--------------------------+---------------------+-----------------------------+------------+----------------+------------+
|        id       |        deployment_id         |         blueprint_id         | host_id |           type           | number_of_instances | planned_number_of_instances | permission |  tenant_name   | created_by |
+-----------------+------------------------------+------------------------------+---------+--------------------------+---------------------+-----------------------------+------------+----------------+------------+
| http_web_server | cloudify-hello-world-example | cloudify-hello-world-example |    vm   | cloudify.nodes.WebServer |          1          |              1              |  creator   | default_tenant |   admin    |
|        vm       | cloudify-hello-world-example | cloudify-hello-world-example |    vm   |  cloudify.nodes.Compute  |          1          |              1              |  creator   | default_tenant |   admin    |
+-----------------+------------------------------+------------------------------+---------+--------------------------+---------------------+-----------------------------+------------+----------------+------------+

...

{{< /highlight >}}

### summary

#### Usage
`cfy nodes summary <field> [optional sub-field] [OPTIONS]`

Summarizes nodes, giving a count of elements with each distinct value for the selected field.
If a sub-field is selected then a count will be given for each distinct field and sub-field combination, as well as totals for each field.

For valid field/sub-field names, invoke `cfy nodes summary`

&nbsp;
#### Example

{{< highlight  bash  >}}

$ cfy nodes summary deployment_id
Retrieving summary of nodes on field deployment_id

Node summary by deployment_id
+---------------+-------+
| deployment_id | nodes |
+---------------+-------+
|      sga1     |   5   |
|      sga3     |   5   |
|      sga2     |   5   |
|       s3      |   1   |
|       s2      |   1   |
|       s1      |   1   |
|       s5      |   1   |
|       s4      |   1   |
|      sg1      |   2   |
+---------------+-------+

...

$ cfy nodes summary --all-tenants tenant_name deployment_id
Retrieving summary of nodes on field tenant_name

Node summary by tenant_name
+----------------+---------------+-------+
|  tenant_name   | deployment_id | nodes |
+----------------+---------------+-------+
|     test1      |       s1      |   1   |
|     test1      |      sg1      |   2   |
|     test1      |      sg2      |   2   |
|     test1      |      sg3      |   2   |
|     test1      |      sga1     |   5   |
|     test1      |      sga2     |   5   |
|     test1      |      sga3     |   5   |
|     test1      |      sga4     |   5   |
|     test1      |      sga5     |   5   |
|     test1      |     TOTAL     |   32  |
|     test2      |       s1      |   1   |
|     test2      |       s2      |   1   |
|     test2      |       s3      |   1   |
|     test2      |      sg1      |   2   |
|     test2      |      sg2      |   2   |
|     test2      |      sg3      |   2   |
|     test2      |      sg4      |   2   |
|     test2      |      sg5      |   2   |
|     test2      |      sga1     |   5   |
|     test2      |     TOTAL     |   18  |
| default_tenant |       s1      |   1   |
| default_tenant |       s2      |   1   |
| default_tenant |       s3      |   1   |
| default_tenant |       s4      |   1   |
| default_tenant |       s5      |   1   |
| default_tenant |      sg1      |   2   |
| default_tenant |      sga1     |   5   |
| default_tenant |      sga2     |   5   |
| default_tenant |      sga3     |   5   |
| default_tenant |     TOTAL     |   22  |
+----------------+---------------+-------+

...

{{< /highlight >}}

### get

#### Usage
`cfy nodes get [OPTIONS] NODE_ID`

Retrieve information for a specific node of a specific deployment.

`NODE_ID` is the ID of the node for which to retrieve information.

#### Required flags

*  `-d, --deployment-id TEXT` - The unique identifier for the deployment. [required]

#### Optional flags
*  `-t, --tenant-name TEXT` -  The name of the tenant of the node. If unspecified, the current tenant is used


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy nodes get -d cloudify-nodecellar-example nodecellar
...

Retrieving node nodecellar for deployment cloudify-nodecellar-example

Node:
+------------+-----------------------------+-----------------------------+---------+----------------------------------------------+---------------------+-----------------------------+------------+----------------+------------+
|     id     |        deployment_id        |         blueprint_id        | host_id |                     type                     | number_of_instances | planned_number_of_instances | permission |  tenant_name   | created_by |
+------------+-----------------------------+-----------------------------+---------+----------------------------------------------+---------------------+-----------------------------+------------+----------------+------------+
| nodecellar | cloudify-nodecellar-example | cloudify-nodecellar-example |   host  | nodecellar.nodes.NodecellarApplicationModule |          1          |              1              |  creator   | default_tenant |   admin    |
+------------+-----------------------------+-----------------------------+---------+----------------------------------------------+---------------------+-----------------------------+------------+----------------+------------+

Node properties:
	application_url: https://github.com/cloudify-cosmo/nodecellar/archive/master.tar.gz
	port: 8080
	startup_script: server.js

Node instance IDs:
	nodecellar_gj0mj2


...
{{< /highlight >}}
