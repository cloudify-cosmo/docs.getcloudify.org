---
layout: bt_wiki
title: Configuration Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the **utilities plugin**.
{{% /note %}}

## Description
The purpose of this plugin is to provide mechanism, to update node's (or group of nodes) runtime configuration which is represented by runtime properties. Runtime properties reflect "the state" of the given node instance. If we change them - we change "the state" of the node instance. This is neccessary when we need to make some changes in deployment - for instance, we need to change DNS server name in all CPE's represented by given deployment.

Configuration plugin is also addressing more complex scenario, where we can selectively provide & update configuration on given node instances. For example, node instance may contain "global" configuration (the same of all node instances) and in case of vCPE it may be DNS and NTP servers, however it may also contain node instance specific configuration like loopback IP address.

Configuration plugin can be used in combination with other plugins like terminal plugin or netconf plugin providing powerful capability to provision physical endpoints.

{{% note %}}
This plugin does not currently have a configuration_rollback workflow.
{{% /note %}}

## Blueprint
Configration plugin requires two components in a blueprint:

* node type "configuration_loader" - node which holds configuration for node instances under key "params" in its runtime properties. We pass configuration through "parameters_json" key. Once node is instantiated, plugin populates key "params" with content provided in "parameters_json".
* relationship "load_from_config" - relationship which is applied to node which needs configuration and is responsible for sourcing configuration from "configuration_loader" type to node instance "params" key. Very important is key "params_list" in "properties". This is **configuration selector** which decides, which keys should be pulled from "configuration_loader" properites. We may decide here, which configuration items are global and local. In example below, "global_config" key is being populated to cpe1 & cpe2 node instances, whereby each cpe have own loopback IP.

```
node_templates:

  config_holder:
    type: configuration_loader
    properties:
      parameters_json: { get_input: cpe_configuration }

  cpe1:
    type: cloudify.nodes.Cpe
    properties:
      params_list:
        - global_config
        - loopback_1
    relationships:
      - type: load_from_config
        target: config_holder

  cpe2:
    type: cloudify.nodes.Cpe
    properties:
      params_list:
        - global_config
        - loopback_2
    relationships:
      - type: load_from_config
        target: config_holder
```

Input file for above blueprint:

```
cpe_configuration:
  global_config:
    ntp: "ntp-global"
    dns: "dns-global"
  loopback_1: "1.1.1.1"
  loopback_2: "2.2.2.2"
  loopback_3: "3.3.3.3"
```

## Operation

Plugin operation is split into **two stages**:

* **STAGE 1:** loading configuration from "configuration_loader" node type - this operation is happening once we instantiate blueprint. Parser is reading "load_from_config" relationship and based on keys in selector "params_list" will import only keys listed in selector to "params" key in node runtime properties.
* **STAGE 2:** this stage is responsible for actual configuration change which is triggered by running "configuration_update" workflow. This workflow takes 

Special parameters: **params**, **node_types_to_update**, **configuration_node_id**

- **params** - represent JSON formatted input of configuration which will be sent to "confguration_loader" type. Regular JSON with braces {} can be used or just properly idented string.
- **node_types_to_update** - represent **types** of the nodes that need to be updated. Thanks to node types as selector, we can do batch processing
- **configuration_node_id** - represent **type** of the node which holds configuration. Common error is to use node name instead of type.
- Example of parameter file:

```
params:
   "global_config":
    "dns": "new-dns-for-all"
  "loopback_2": "200.200.200.200"
node_types_to_update: [cloudify.nodes.Cpe]
configuration_node_id: configuration_loader
```

Once "configuration_workflow" is executed the **update** interface will be called on updated node instance.

{{% warning title="Important" %}}
This is very important "connector" between updating node instance runtime properties and actual action which may change configuration on entity that node represents (for instance change DNS entry).
{{% /warning %}}

Below is an example of node type with **update** interface:

```
cloudify.nodes.Cpe:
    derived_from: cloudify.nodes.Root
    properties:
      params:
        default: {}
      params_list:
        default: {}
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: cpe/start.py
          executor: central_deployment_agent
        update:
          implementation: cpe/update.py
          executor: central_deployment_agent
```

Sample execution of "configuration_update" workflow:

`cfy executions start -d test1 -p ./sg-dns-update.yaml configuration_update`

In here we are executing "configuration_update" workflow on existing "test1" deployment with parameters captured in "sg-dns-update.yaml" file.

{{% warning title="Warning" %}}
Configuration DIFF is made only on **primary keys**. If you have configuration nested under primary key like above: "global_config" is primary key and holds "dns" key - we'll not only change dns to "new-dns-for-all" but as well **remove** existing key: **ntp: "ntp-global"**. If you want to just change DNS and keep NTP intact - you need to provide all "sub-keys" in this data structure:
{{% /warning %}}

```
params:
   "global_config":
    "dns": "new-dns-for-all"
    "ntp": "ntp-global"
  "loopback_2": "200.200.200.200"
node_types_to_update: [cloudify.nodes.Cpe]
configuration_node_id: configuration_loader
```

## STAGE 1 Example
Instantiate blueprint:

`cfy install -d test1 -b test1 -i ./deploy_inputs.yaml ./sg-blueprint.yaml`

List nodes:

```
[vagrant@localhost]$ cfy node-instances list
Listing all instances...

Node-instances:
+----------------------+---------------+---------+---------------+---------+------------+----------------+------------+
|          id          | deployment_id | host_id |    node_id    |  state  | permission |  tenant_name   | created_by |
+----------------------+---------------+---------+---------------+---------+------------+----------------+------------+
| config_holder_6c4wxt |     test1     |         | config_holder | started |    None    | default_tenant |   admin    |
|     cpe1_wfxzsw      |     test1     |         |      cpe1     | started |    None    | default_tenant |   admin    |
|     cpe2_q6n0wf      |     test1     |         |      cpe2     | started |    None    | default_tenant |   admin    |
|     cpe3_vkm558      |     test1     |         |      cpe3     | started |    None    | default_tenant |   admin    |
+----------------------+---------------+---------+---------------+---------+------------+----------------+------------+

```
List node instances runtime properties:

`[vagrant@localhost]$ cfy node-instance get cpe1_wfxzsw`

```
[vagrant@localhost]$ cfy node-instance get cpe1_wfxzsw
Retrieving node instance cpe1_wfxzsw

Node-instance:
+-------------+---------------+---------+---------+---------+------------+----------------+------------+
|      id     | deployment_id | host_id | node_id |  state  | permission |  tenant_name   | created_by |
+-------------+---------------+---------+---------+---------+------------+----------------+------------+
| cpe1_wfxzsw |     test1     |         |   cpe1  | started |    None    | default_tenant |   admin    |
+-------------+---------------+---------+---------+---------+------------+----------------+------------+

Instance runtime properties:
	params: {'diff_params': ['loopback_1', 'global_config'], 'loopback_1': '1.1.1.1', 'old_params': {'old_params': {}}, 'global_config': {'ntp': 'ntp-global', 'dns': 'dns-global'}}
```

`[vagrant@localhost]$ cfy node-instance get config_holder_6c4wxt`

```
[vagrant@localhost]$ cfy node-instance get config_holder_6c4wxt
Retrieving node instance config_holder_6c4wxt

Node-instance:
+----------------------+---------------+---------+---------------+---------+------------+----------------+------------+
|          id          | deployment_id | host_id |    node_id    |  state  | permission |  tenant_name   | created_by |
+----------------------+---------------+---------+---------------+---------+------------+----------------+------------+
| config_holder_6c4wxt |     test1     |         | config_holder | started |    None    | default_tenant |   admin    |
+----------------------+---------------+---------+---------------+---------+------------+----------------+------------+

Instance runtime properties:
	params: {'loopback_3': '3.3.3.3', 'loopback_1': '1.1.1.1', 'loopback_2': '2.2.2.2', 'global_config': {'ntp': 'ntp-global', 'dns': 'dns-global'}}

```
## Stage 2 Example
Execution of "configuration_update" workflow

`cfy executions start -d test1 -p ./sg-dns-update.yaml configuration_update`

```
[vagrant@localhost hierarchical_config]$ cfy node-instance get config_holder_6c4wxt
Retrieving node instance config_holder_6c4wxt

Node-instance:
+----------------------+---------------+---------+---------------+---------+------------+----------------+------------+
|          id          | deployment_id | host_id |    node_id    |  state  | permission |  tenant_name   | created_by |
+----------------------+---------------+---------+---------------+---------+------------+----------------+------------+
| config_holder_6c4wxt |     test1     |         | config_holder | started |    None    | default_tenant |   admin    |
+----------------------+---------------+---------+---------------+---------+------------+----------------+------------+

Instance runtime properties:
	params: {'loopback_3': '3.3.3.3', 'loopback_1': '1.1.1.1', 'loopback_2': '200.200.200.200', 'global_config': {'dns': 'new-dns-for-all'}}
```

...notice that NTP **is gone** (see WARNING above).

```
[vagrant@localhost hierarchical_config]$ cfy node-instance get cpe2_q6n0wf
Retrieving node instance cpe2_q6n0wf

Node-instance:
+-------------+---------------+---------+---------+---------+------------+----------------+------------+
|      id     | deployment_id | host_id | node_id |  state  | permission |  tenant_name   | created_by |
+-------------+---------------+---------+---------+---------+------------+----------------+------------+
| cpe2_q6n0wf |     test1     |         |   cpe2  | started |    None    | default_tenant |   admin    |
+-------------+---------------+---------+---------+---------+------------+----------------+------------+

Instance runtime properties:
	params: {'diff_params': ['loopback_2', 'global_config'], 'old_params': {'diff_params': ['loopback_2', 'global_config'], 'loopback_2': '2.2.2.2', 'old_params': {}, 'global_config': {'ntp': 'ntp-global', 'dns': 'dns-global'}}, 'loopback_2': '200.200.200.200', 'global_config': {'dns': 'new-dns-for-all'}}
```
