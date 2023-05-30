---
title: node-instances
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/node-instances/
---

The `cfy node-instances` command is used to view information about the different node-instances of a deployment.

You can use the command to list the node-instances of a specific deployment or of all deployments, and to retrieve information about a single node-instance.

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

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

### summary

#### Usage
`cfy node-instances summary <field> [optional sub-field] [OPTIONS]`

Summarizes node-instances, giving a count of elements with each distinct value for the selected field.
If a sub-field is selected then a count will be given for each distinct field and sub-field combination, as well as totals for each field.

For valid field/sub-field names, invoke `cfy node-instances summary`

&nbsp;
#### Example

{{< highlight  bash  >}}

$ cfy node-instances summary deployment_id
Retrieving summary of node instances on field deployment_id

Node instance summary by deployment_id
+---------------+----------------+
| deployment_id | node_instances |
+---------------+----------------+
|      sga1     |       51       |
|      sga3     |       51       |
|      sga2     |       51       |
|       s3      |       2        |
|       s2      |       2        |
|       s1      |       2        |
|       s5      |       2        |
|       s4      |       2        |
|      sg1      |       35       |
+---------------+----------------+

...

$ cfy node-instances summary deployment_id state
Retrieving summary of node instances on field deployment_id

Node instance summary by deployment_id
+---------------+---------+----------------+
| deployment_id |  state  | node_instances |
+---------------+---------+----------------+
|      sga1     | started |       51       |
|      sga1     |  TOTAL  |       51       |
|      sga3     | started |       51       |
|      sga3     |  TOTAL  |       51       |
|      sga2     | started |       51       |
|      sga2     |  TOTAL  |       51       |
|       s3      | started |       2        |
|       s3      |  TOTAL  |       2        |
|       s2      | started |       2        |
|       s2      |  TOTAL  |       2        |
|       s1      | started |       2        |
|       s1      |  TOTAL  |       2        |
|       s5      | started |       2        |
|       s5      |  TOTAL  |       2        |
|       s4      | started |       2        |
|       s4      |  TOTAL  |       2        |
|      sg1      | started |       35       |
|      sg1      |  TOTAL  |       35       |
+---------------+---------+----------------+

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

### update-runtime

#### Usage
`cfy node-instances update-runtime [OPTIONS] NODE_INSTANCE_ID`

Update the runtime properties of a specific node-instance.

NODE_INSTANCE_ID is the id of the node-instance to update.


#### Mandatory flags

*  ` -p, --properties TEXT` Runtime properties for the node instance (Can be
provided as wildcard based paths (*.yaml, /my_inputs/, etc..) to YAML files, a JSON string or as 'key1=value1;key2=value2'). <br>
This argument can be used multiple times.
                          
#### Optional flags

*  ` -t, --tenant-name TEXT`  The name of the tenant of the node-instance. If unspecified, the current tenant is used.

#### Example

{{< highlight  bash  >}}
$ cfy node-instances update-runtime vm_d720jr -p new_property=value -p dict_property.key=value

Successfully updated the runtime properties of "vm_d720jr"

Node-instance:
+-----------+---------------+-----------+---------+---------+------------+----------------+------------+
|     id    | deployment_id |  host_id  | node_id |  state  | visibility |  tenant_name   | created_by |
+-----------+---------------+-----------+---------+---------+------------+----------------+------------+
| vm_d720jr | hello_world   | vm_d720jr |    vm   | started |   tenant   | default_tenant |   admin    |
+-----------+---------------+-----------+---------+---------+------------+----------------+------------+

Instance runtime properties:
    dict_property:   {'key': 'value'}
    new_property:    value
	ipv6_address:    None
	cloudify_agent:  {'broker_ip': ['172.16.3.112'], 'file_server_url': 'https://172.16.3.112:53333/resources', ... }
	external_name:   server_hello_world_2_vm_d720jr
	ip:              172.16.3.114
	ipv6_addresses:  []
	networks:        {'cloudify-management-network': ['172.16.3.114']}
    ...

{{< /highlight >}}

Notice how using the dot notation `dict_property.key` has created a property `dict_property` and within it a
sub-property `key`. <br>
In the same way, we can access sub-properties to update them, e.g. `dict_property.key = [value1, value2]`.


#### Options for providing the runtime properties

* Providing the properties to be updated directly:
{{< highlight  bash  >}}
cfy node-instances update-runtime vm_d720jr -p 'a=b; c.d.e=f'
{{< /highlight >}}

* Through repeated usage of the `--properties` flag:
{{< highlight  bash  >}}
cfy node-instances update-runtime vm_d720jr -p a=b -p c.d.e=f
{{< /highlight >}}

* In dictionary format:
{{< highlight  bash  >}}
cfy node-instances update-runtime vm_d720jr -p '{a: b, c: {d: {e: f}}}'
{{< /highlight >}}

* Providing a path to a YAML file containing the runtime properties to be updated (must end with `.yaml`):
{{< highlight  bash  >}}
cfy node-instances update-runtime vm_d720jr -p my_yamls/update_runtime_props.yaml
{{< /highlight >}}
Where a YAML file may be formatted as follows:
{{< highlight  bash  >}}
a: b
c:
   d:
      e: f
{{< /highlight >}}

* Providing a path to a directory of YAML files containing the runtime properties to be updated (must end with `/`):
{{< highlight  bash  >}}
cfy node-instances update-runtime vm_d720jr -p my_yamls/
{{< /highlight >}}


##### Usage note:

Updating a sub-property within a runtime property does <b>not</b> affect other sub-properties.
For example, running `cfy node-instances update-runtime vm_d720jr -p '{a: {b: 5}}'` on a node-instance where:

{{< highlight  bash  >}}
Instance runtime properties:
    a:  {b: 4, c: 3}
    ...
{{< /highlight >}}

Will result in:
{{< highlight  bash  >}}
Instance runtime properties:
    a:  {b: 5, c: 3}
    ...
{{< /highlight >}}


### delete-runtime

#### Usage
`cfy node-instances delete-runtime [OPTIONS] NODE_INSTANCE_ID`

Delete specified runtime properties of a specific node-instance

NODE_INSTANCE_ID is the id of the node-instance to update.


#### Mandatory flags

*  ` -p, --properties TEXT` Runtime properties for the node instance (Can be
provided as wildcard based paths (*.yaml, /my_inputs/, etc..) to YAML files, a JSON string or as 'key1=value1;key2=value2'). <br>
This argument can be used multiple times.

#### Optional flags

*  ` -t, --tenant-name TEXT`  The name of the tenant of the node-instance. If unspecified, the current tenant is used.


#### Example

{{< highlight  bash  >}}
$ cfy node-instances delete-runtime vm_d720jr -p 'dict_property.key' -p 'new_property'

Successfully updated the runtime properties of "vm_d720jr"

Node-instance:
+-----------+---------------+-----------+---------+---------+------------+----------------+------------+
|     id    | deployment_id |  host_id  | node_id |  state  | visibility |  tenant_name   | created_by |
+-----------+---------------+-----------+---------+---------+------------+----------------+------------+
| vm_d720jr | hello_world   | vm_d720jr |    vm   | started |   tenant   | default_tenant |   admin    |
+-----------+---------------+-----------+---------+---------+------------+----------------+------------+

Instance runtime properties:
    dict_property:   {}
	ipv6_address:    None
	cloudify_agent:  {'broker_ip': ['172.16.3.112'], 'file_server_url': 'https://172.16.3.112:53333/resources', ... }
	external_name:   server_hello_world_2_vm_d720jr
	ip:              172.16.3.114
	ipv6_addresses:  []
	networks:        {'cloudify-management-network': ['172.16.3.114']}
    ...

{{< /highlight >}}

Notice how using the dot notation `dict_property.key` allowed us to delete the sub-property `key` within the property `dict_property`.


#### Options for providing the runtime properties

* Providing the properties to be deleted directly:
{{< highlight  bash  >}}
cfy node-instances delete-runtime vm_d720jr -p 'a; c.d'
{{< /highlight >}}

* Through repeated usage of the `--properties` flag:
{{< highlight  bash  >}}
cfy node-instances delete-runtime vm_d720jr -p 'a' -p 'c.d'
{{< /highlight >}}

* In dictionary format:
{{< highlight  bash  >}}
cfy node-instances delete-runtime vm_d720jr -p '{a, c: {d}}'
{{< /highlight >}}

* Providing a path to a YAML file containing the runtime properties to be deleted (must end with `.yaml`):
{{< highlight  bash  >}}
cfy node-instances delete-runtime vm_d720jr -p my_yamls/update_runtime_props.yaml
{{< /highlight >}}
Where a YAML file may be formatted as follows:
{{< highlight  bash >}}
a:
c:
   d:
{{< /highlight >}}
Which will also delete the property `a` and the property `d` (which is within another property `c`).

* Providing a path to a directory of YAML files containing the runtime properties to be deleted (must end with `/`):
{{< highlight  bash  >}}
cfy node-instances delete-runtime vm_d720jr -p my_yamls/
{{< /highlight >}}


##### Usage note:

Deleting a sub-property within a runtime property does <b>not</b> affect other sub-properties. For example, running `cfy node-instances delete-runtime
vm_d720jr -p '{a: {b}}'` on a node-instance where:
{{< highlight  bash  >}}
Instance runtime properties:
    a:  {b: 4, c: 3}
    ...
{{< /highlight >}}

Will result in:
{{< highlight  bash  >}}
    a:  {c: 3}
    ...
{{< /highlight >}}
