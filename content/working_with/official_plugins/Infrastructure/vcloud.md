---
layout: bt_wiki
title: vCloud Plugin
category: Official Plugins
draft: false
abstract: Cloudify vCloud plugin description and configuration
weight: 100
aliases:
    - /plugins/vcloud/
    - /developer/official_plugins/vcloud/
---

The vCloud Plugin 2 enables you to use a vCloud-based infrastructure for deploying services and applications.


# Plugin Requirements

* Python version 3.6.

The plugin is not compatible with blueprints written for tosca-vcloud-plugin.


## Authentication with vCloud Director

Each node template, has a `client_config` property which stores your account credentials. Use an intrinsic function to assign these to the values of secrets]({{< relref "working_with/manager/using-secrets.md" >}}) in your manager.

```yaml
  test_gateway:
    type: cloudify.nodes.vcloud.Gateway
    properties:
      client_config:
        uri: { get_secret: vcloud_uri }
        org: { get_secret: vcloud_org }
        vdc: { get_secret: vcloud_vdc }
        user: { get_secret: vcloud_user }
        password: { get_secret: vcloud_password }
        verify_ssl_certs: false
      resource_id: { get_input: vcloud_gateway_id }
```


## Common Properties

The vCloud Plugin node types have these common properties, except where noted:

**Properties**

  * `client_config`: A dictionary that contains values to be passed to the connection handler. The following keys are accepted:
    * client config parameters: ['uri', 'api_version', 'verify_ssl_certs', 'log_file', 'log_requests', 'log_headers', 'log_bodies']
    * credentials parameters: ['user', 'password', 'org']
  * `resource_config`: A dictionary with required and common parameters to the resource's create or put call.
  * `use_external_resource`: Boolean. The default value is `false`. Set to `true` if the resource already exists.
  * `resource_id`: The name of an existing resource in vCloud. Required if `use_external_resource` is `true`. If not set, this will default to the [node instance ID]({{< relref "cli/orch_cli/node-instances/>}})).

## Common Runtime Properties

The vCloud Plugin stores runtime properties reflecting important data about the resource in VCD. These are the commond properties:

**Runtime Properties**

  * `resource_id`: The name of the existing resource. If the `resource_id` was provided as a node property, then this will be the same value. (Except for virtual machines, for more information, please see cloudify.nodes.vcloud.VM below.) Otherwise, this is the node instance ID of the given node instance.
  * `data`: Please see the runtime property section of each resource for specific keys.
  * `tasks`: Stores information about tasks that have been executed on the node instance.

# Node Types

Each node type refers to a resource in VCloud.


## **cloudify.nodes.vcloud.Gateway**

Allows Cloudify to verify that a given gateway exists, to store the gateway's properties in runtime properties, and to allow other resources to interact with it.

**Properties**

  * `resource_id`: Required. The name of the gateway in VCD.
  * `resource_config`: Not required. There is only one parameter, `name`, which defaults to `resource_id`.

**Runtime Properties**

  * `data`:
    * `gateway_address`: The gateway IP.

**Example**:

```yaml
  my_gateway:
    type: cloudify.nodes.vcloud.Gateway
    properties:
      client_config: *client_config
      resource_id: MyGatewayName
 ```


## **cloudify.nodes.vcloud.NatRules**

Create and delete NAT rules in the gateway. As this resource is on the gateway, it also preserves the runtime properties of `cloudify.nodes.vcloud.Gateway`.

**Properties**

  * `resource_id`: Required. The name of the gateway in VCD.
  * `resource_config`: Required. A list of dicts. Each dict has these required keys:
    - `action`: dnat or snat. Required.
      `original_address`: The original address, for example 10.10.10.10. Required.
      `translated_address`: The translated address, for example 10.11.10.10. Required.
      `description`: A simple description.
      `protocol`: The IP protocol.
      `original_port`: The original port.
      `translated_port`: The translated port.
      `type`: Type. Default `User`.
      `icmp_type`: ICMP type.
      `logging_enabled`: Logging enabled.
      `enabled`: Enabled.
      `vnic`: Interface of VNIC.

**Runtime Properties**

  * `data`:
    * `gateway_address`: The gateway IP.
  * `rules`: A dictionary of rules. Each dict accepts these keys:
    * `ID`: The rule ID.
      * `ID`: The rule ID.
      * `OriginalAddress`: The original address.
      * `OriginalPort`: The original port.
      * `TranslatedAddress`: The translated address.
      * `TranslatedPort`: The translated port.
      * `Action`: The action.
      * `Protocol`: The protocol.
      * `Enabled`: Enabled.
      * `Logging`: Logging.
      * `Description`: Description.


**Relationships**

  * `cloudify.relationships.vcloud.nat_rules_contained_in_gateway`: Required relationship to a node template of `cloudify.nodes.vcloud.Gateway`.

**Examples**

```yaml
  my_nat_rules:
    type: cloudify.nodes.vcloud.NatRules
    properties:
      client_config: *client_config
      resource_config:
        - action: 'dnat'
          original_address: '10.10.10.10.'
          translated_address: '10.10.11.10'
          description: 'Test blueprint example 1'
        - action: 'dnat'
          original_address: '10.11.10.10.'
          translated_address: '10.11.11.10'
          description: 'Test blueprint example 2'
    relationships:
      - type: cloudify.relationships.vcloud.nat_rules_contained_in_gateway
        target: my_gateway
```


## **cloudify.nodes.vcloud.DHCPPools**

Create and delete DHCP Pool in the gateway. As this resource is on the gateway, it also preserves the runtime properties of `cloudify.nodes.vcloud.Gateway`.

**Properties**

  * `resource_id`: Required. The name of the gateway in VCD.
  * `resource_config`: Required. A list of dicts. Each dict accepts these keys:
    - `ip_range`: dnat or snat. Required.
      `auto_config_dns`: Auto configuration of DNS Default
      `default_gateway`: The default gateway ip
      `domain_name`: A domain name.
      `lease_never_expires`: If the lease expires.
      `lease_time`: Time for the expiration of lease.
      `subnet_mask`: Subnet mask of the DHCP pool.
      `primary_server`: IP of the primary server.
      `secondary_server`: IP of the secondary server.

**Runtime Properties**

  * `data`:
    * `gateway_address`: The gateway IP.

**Relationships**

  * `cloudify.relationships.vcloud.dhcp_pools_contained_in_gateway`: Required relationship to a node template of `cloudify.nodes.vcloud.Gateway`.

**Examples**

In this example, we show a dependency on `my_network`. This is because in the example blueprint,`my_dhcp_pools` depends on `my_network` to create a subnet with the required subnet for our DCHP pool.

```yaml
  my_dhcp_pools:
    type: cloudify.nodes.vcloud.DHCPPools
    properties:
      client_config: *client_config
      resource_config:
        - ip_range: '192.178.2.2-192.178.2.100'
        - ip_range: '192.178.2.101-192.178.2.150'
    relationships:
      - type: cloudify.relationships.vcloud.dhcp_pools_contained_in_gateway
        target: my_gateway
      - type: cloudify.relationships.depends_on
        target: my_network
```


## **cloudify.nodes.vcloud.StaticRoutes**

Create and delete static routes in the gateway. As this resource is on the gateway, it also preserves the runtime properties of `cloudify.nodes.vcloud.Gateway`.

**Properties**

  * `resource_id`: Required. The name of the gateway in VCD.
  * `resource_config`: Required. A list of dicts. Each dict accepts these keys:
    - `network`: dnat or snat. Required.
      `next_hop`: The next hop in the route.
      `mtu`: The MTU
      `description`: A simple description.
      `type`: Type of route.
      `vnic`: The gateway nic interface.

**Runtime Properties**

  * `data`:
    * `gateway_address`: The gateway IP.

**Relationships**

  * `cloudify.relationships.vcloud.static_routes_contained_in_gateway`: Required relationship to a node template of `cloudify.nodes.vcloud.Gateway`.

**Examples**

In this example, we show a dependency on `my_network`. This is because in the example blueprint,`my_static_route` depends on `my_network` to create a subnet with the required subnet for our DCHP pool.

```yaml
  my_static_route:
    type: cloudify.nodes.vcloud.StaticRoutes
    properties:
      client_config: *client_config
      resource_config:
        - network: 192.178.3.0/24
          next_hop: 192.168.1.1
          description: 'Test blueprint example'
    relationships:
      - type: cloudify.relationships.vcloud.static_routes_contained_in_gateway
        target: my_gateway
      - type: cloudify.relationships.depends_on
        target: my_network
```


## **cloudify.nodes.vcloud.FirewallRules**

Create and delete firewall rules in the gateway. As this resource is on the gateway, it also preserves the runtime properties of `cloudify.nodes.vcloud.Gateway`.

**Properties**

  * `resource_id`: Required. The name of the gateway in VCD.
  * `resource_config`: Required. A dict of rules.
    * `name`: The firewall rule name.
      * `source_values`: The source value.
      * `destination_values`: The destination value.
      * `services`: The services value.

**Runtime Properties**

  * `data`:
    * `gateway_address`: The gateway IP.
  * `rules`: A dictionary of rules. Each dict accepts these keys:
    * `Rule name`: The rule ID.
      * `Id`: The rule ID.
      * `Name`: Rule name.
      * `Rule type`: Rule type.
      * `Logging enabled`: Logging enabled.
      * `Action`: Action.

**Relationships**

  * `cloudify.relationships.vcloud.firewall_rules_contained_in_gateway`: Required relationship to a node template of `cloudify.nodes.vcloud.Gateway`.

**Examples**

In this example, we show a dependency on `my_network`. This is because in the example blueprint,`my_firewall_rules` depends on `my_network` to create a subnet with the required subnet for our DCHP pool.

```yaml
  my_firewall_rules:
    type: cloudify.nodes.vcloud.FirewallRules
    properties:
      client_config: *client_config
      resource_config:
        test_rule1:
          source_values:
            - 'VLAN-102:gatewayinterface'
            - { concat: [ { get_attribute: [ my_network, resource_id ] }, ':network']}
            - '192.178.1.0:ip'
          destination_values:
            - 'VLAN-102:gatewayinterface'
            - { concat: [ { get_attribute: [ my_network2, resource_id ] }, ':network']}
            - '192.178.1.0:ip'
          services: [{'tcp': {'any': 'any'}}]
    relationships:
      - type: cloudify.relationships.vcloud.firewall_rules_contained_in_gateway
        target: my_gateway
      - type: cloudify.relationships.depends_on
        target: my_network
      - type: cloudify.relationships.depends_on
        target: my_network2
```
