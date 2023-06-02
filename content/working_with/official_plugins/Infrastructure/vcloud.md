---
title: vCloud Plugin
category: Official Plugins
description: The vCloud Plugin 2 enables you to use a vCloud-based infrastructure for deploying services and applications
draft: false
abstract: vCloud plugin description and configuration
weight: 140
aliases:
    - /plugins/vcloud/
    - /developer/official_plugins/vcloud/
---

The vCloud Plugin 2 enables you to use a vCloud-based infrastructure for deploying services and applications.


# Plugin Requirements

* {{< param cfy_manager_name >}} 5.1 or greater.
* (Python version 3.6.)
* vCloud Directory 29.0 or greater.
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

* `username` - The vCloud account username.
* `password` - The vCloud account password.
* `url` - The vCloud URL.
* `org` - The organization name. Required only for the `ondemand` and `subscription` service types.
* `instance` - The instance UUID. Required only for the `ondemand` service type.
* `vdc` - The virtual datacenter name.
* `service` - The vCloud service name.
* `service_type` - The service type. Can be `subscription`, `ondemand`, `vcd` or `private`. `Private` is an alias for `vcd` and both types can be used with a private vCloud environment without any difference. Defaults to `subscription`.
* `api_version` - The vCloud Air version. For `Subscription`, defaults to `5.6`. For `OnDemand`, defaults to `5.7`.
* `region` - The region name. Applies to `OnDemand`.
* `org_url` - The organization URL. Required only for `private` service type.
* `edge_gateway` - The Edge gateway name.
* `ssl_verify` A boolean flag for disabling the SSL certificate check. Only applicable for a `private` cloud service with self-signed certificates. Defaults to `True`

## Common Properties

The vCloud Plugin node types have these common properties, except where noted:

**Properties**

  * `client_config`: A dictionary that contains values to be passed to the connection handler. The following keys are accepted:
    * client config parameters: ['uri', 'api_version', 'verify_ssl_certs', 'log_file', 'log_requests', 'log_headers', 'log_bodies']
    * credentials parameters: ['user', 'password', 'org']
  * `resource_config`: A dictionary with required and common parameters to the resource's create or put call.
  * `use_external_resource`: Boolean. The default value is `false`. Set to `true` if the resource already exists.
  * `resource_id`: The name of an existing resource in vCloud. Required if `use_external_resource` is `true`. If not set, this will default to the node instance ID.

## Common Runtime Properties

The vCloud Plugin stores runtime properties reflecting important data about the resource in VCD. These are the common properties:

**Runtime Properties**

  * `resource_id`: The name of the existing resource. If the `resource_id` was provided as a node property, then this will be the same value. (Except for virtual machines, for more information, please see cloudify.nodes.vcloud.VM below.) Otherwise, this is the node instance ID of the given node instance.
  * `data`: Please see the runtime property section of each resource for specific keys.
  * `tasks`: Stores information about tasks that have been executed on the node instance.

# Node Types

Each node type refers to a resource in vCloud.


## **cloudify.nodes.vcloud.Gateway**

Allows {{< param product_name >}} to verify that a given gateway exists, to store the gateway's properties in runtime properties, and to allow other resources to interact with it.

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
      `auto_config_dns`: Auto configuration of DNS Default.
      `default_gateway`: The default gateway ip.
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
      `mtu`: The MTU.
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


## **cloudify.nodes.vcloud.IsolatedVDCNetwork**

Create and delete an isolated network.

**Properties**

  * `resource_id`: Required. The name of the network in VCD.
  * `resource_config`: Required. A dict of rules.
      * `network_name`: Not required. The `resource_id` property will provide this value, which defaults to node instance ID.
      * `network_cidr`: Required. The subnet CIDR.
      * `description`: Not required. A description.
      * `primary_dns_ip`: Not required. IP address of primary DNS server.
      * `secondary_dns_ip`: Not required. IP address of secondary DNS Server.
      * `dns_suffix`: Not required.DNS suffix.
      * `ip_range_start`: Not required. Start address of the IP ranges used for static pool allocation in the network.
      * `ip_range_end`: Not required. End address of the IP ranges used for static pool allocation in the network.
      * `is_dhcp_enabled`: Not required.True, if DHCP service is enabled on the new network.
      * `default_lease_time`: Not required. Default lease in seconds for DHCP addresses.
      * `max_lease_time`: Not required. Max lease in seconds for DHCP addresses.
      * `dhcp_ip_range_start`: Not required. Start address of the IP range used for DHCP addresses.
      * `dhcp_ip_range_end`: Not required. End address of the IP range used for DHCP addresses.
      * `is_shared`: Not required. True, if the network is shared with other vdc(s) in the organization, else False.

**Runtime Properties**

  * `data`:
    * `allocated_ips`: A list of currently allocated IPs (as of the last operation on this resource - the list may be empty even though later IPs were allocated.)
    * `resource`:
      * `href`: The VCD href for the resource.
      * `id`: The ID of the resource (not the same as the name/resource_id).
  

**Relationships**

  * `cloudify.relationships.vcloud.network_connected_to_gateway`: Required relationship to a node template of `cloudify.nodes.vcloud.Gateway`.

**Examples**

```yaml
  my_isolated_network:
    type: cloudify.nodes.vcloud.IsolatedVDCNetwork
    properties:
      client_config: *client_config
      resource_config:
        network_cidr: 192.178.3.1/24
        description: test isolated network
        primary_dns_ip: 8.8.8.4
        secondary_dns_ip: 8.8.8.8
        default_lease_time: 300
        max_lease_time: 900
    relationships:
      - type: cloudify.relationships.vcloud.network_connected_to_gateway
        target: my_gateway
```


## **cloudify.nodes.vcloud.RoutedVDCNetwork**

Create and delete a routed network.

**Properties**

  * `resource_id`: Required. The name of the network in VCD.
  * `resource_config`: Required. A dict of rules.

      * `network_name`: Not required. The `resource_id` property will provide this value, which defaults to node instance ID.
      * `gateway_name`: name of an existing edge Gateway appliance that will manage the virtual network.
      * `network_cidr`: CIDR in the format of 10.2.2.1/20.
      * `description`: Not required. description of the new network.
      * `primary_dns_ip`: Not required. IP address of primary DNS server.
      * `secondary_dns_ip`: Not required. IP address of secondary DNS Server.
      * `dns_suffix`: Not required. DNS suffix.
      * `ip_range_start`: Not required. start address of the IP ranges used for static pool allocation in the network.
      * `ip_range_end`: Not required. end address of the IP ranges used for static pool allocation in the network.
      * `is_shared`: Not required. True, if the network is shared with other vdc(s) in the organization, else False.
      * `guest_vlan_allowed`: Not required. True if Network allows guest VLAN tagging
      * `sub_interface`: Not required. True if Network is connected to an Edge Gateway subinterface.
      * `distributed_interface`: Not required. True if Network is connected to a distributed logical router.
      * `retain_net_info_across_deployments`: Not required. Specifies whether the network resources such as IP/MAC of router will be retained across deployments. Default is false.

**Runtime Properties**

  * `data`:
    * `allocated_ips`: A list of currently allocated IPs (as of the last operation on this resource - the list may be empty even though later IPs were allocated.)
    * `resource`:
      * `href`: The VCD href for the resource.
      * `id`: The ID of the resource (not the same as the name/resource_id).

**Relationships**

  * `cloudify.relationships.vcloud.network_connected_to_gateway`: Required relationship to a node template of `cloudify.nodes.vcloud.Gateway`.

**Examples**

```yaml
  my_network:
    type: cloudify.nodes.vcloud.RoutedVDCNetwork
    properties:
      client_config: *client_config
      resource_config:
        gateway_name: { get_attribute: [ my_gateway, resource_id ] }
        network_cidr: 192.178.1.1/24
        description: test routed network
        primary_dns_ip: 8.8.8.4
        secondary_dns_ip: 8.8.8.8
        ip_range_start: 192.178.1.2
        ip_range_end: 192.178.1.254
    relationships:
      - type: cloudify.relationships.vcloud.network_connected_to_gateway
        target: my_gateway
```


## **cloudify.nodes.vcloud.VApp**

Creates an internal object representing a vApp. (It does not actually create. This occurs during the first VM initialization.) However, this node template does perform destructive actions: shudown, power off, undeploy, delete on vApps.

**Properties**

  * `resource_id`: Required. The name of the vApp in VCD.
  * `resource_config`: Required. A dict of rules.
        * `name`: Not required. The `resource_id` property will provide this value, which defaults to node instance ID.
        * `description`: Not required. Description of the new vApp.
        * `network`: Not required. Ideally use a relationships of type `cloudify.relationships.vcloud.vapp_connected_to_network` to a node template. Name of the org vdc network that the vApp will connect to.
        * `fence_mode`: Network fence mode. Acceptable values are BRIDGED and NAT_ROUTED.
        * `accept_all_eulas`: The value `true` confirms acceptance of all EULAs for the vApp template.

**Runtime Properties**

  * `data`:
    * `lease`: The lease time.
    * `catalog_items`: Items in the vApp catalog.

**Relationships**

  * `cloudify.relationships.vcloud.vapp_connected_to_network`: Required relationship to a node template of `cloudify.nodes.vcloud.RoutedVDCNetwork` or `cloudify.nodes.vcloud.IsolatedVDCNetwork`.

**Examples**

```yaml
  my_vapp:
    type: cloudify.nodes.vcloud.VApp
    properties:
      client_config: *client_config
      resource_config:
        description: test description
        fence_mode: natRouted
        accept_all_eulas: true
    relationships:
      - type: cloudify.relationships.vcloud.vapp_connected_to_network
        target: my_network

```


## **cloudify.nodes.vcloud.VM**

Initializes vApp and creates/starts/stops/deletes VMs.

**Properties**

  * `resource_id`: Required. The name of the VM in VCD.
  * `resource_config`: Required. A dict of rules.
    * `name`: Ideally use the relationship `cloudify.relationships.vcloud.vm_contained_in_vapp` instead of providing the name of the vApp.
    * `catalog`: Required. Name of the catalog.
    * `template`: Required. Name of the vApp template.
    * `description`: Not required. Description of the new vApp.
    * `network`: Ideally use the relationship `cloudify.relationships.vcloud.vm_connected_to_network` instead of providing the name of a vdc network. When provided, connects the vm to the network.
    * `fence_mode`: Not required, fence mode. Possible values are pyvcloud.vcd.client.FenceMode.BRIDGED.value and pyvcloud.vcd.client.FenceMode.NAT_ROUTED.value.
    * `ip_allocation_mode`: Not required, ip allocation mode. Acceptable values are `pool`, `dhcp` and `manual`.
    * `deploy`: Not required, f True deploy the vApp after instantiation.
    * `power_on`: Not required, if True, power on the vApp after instantiation.
    * `accept_all_eulas`: Not required, `true`, confirms acceptance of all EULAs in a vApp template.
    * `memory`: Not required, size of memory of the first vm.
    * `cpu`: Not required, number of cpus in the first vm.
    * `disk_size`: Not required, size of the first disk of the first vm.
    * `password`: Not required, admin password of the guest os on the first vm.
    * `cust_script`: Not required, guest customization to run on the vm.
    * `vm_name`: Ideally not provided. This will default to `resource_id` or the node instance ID. When provided, sets the name of the vm.
    * `ip_address`: Not required, when provided, sets the ip_address of the vm.
    * `hostname`: Not required, when provided, sets the hostname of the guest OS.
    * `storage_profile`: Not required. 
    * `network_adapter_type`: Not required. One of the values VMXNET, VMXNET2, VMXNET3, E1000, E1000E, VLANCE.

**Runtime Properties**

  * `data`:
    * `vapp`: The name of the vApp. This is used by the plugin.
    * `cpus`: CPUs.
    * `memory`: Memory.
    * `nics`: A list of nics.

**Relationships**

  * `cloudify.relationships.vcloud.vm_connected_to_network`: Instead of providing `network` parameter in the `resource_config`, provide this relationship to any node template of type `cloudify.nodes.vcloud.RoutedVDCNetwork` or `cloudify.nodes.vcloud.IsolatedVDCNetwork`.
  * `cloudify.relationships.vcloud.vm_contained_in_vapp`: Required. Target should be a node template of node type `cloudify.nodes.vcloud.VApp`.
  * `cloudify.relationships.vcloud.vm_connected_to_disk`: Attach an independent disk to the VM by using this relationship with a target node template of type `cloudify.nodes.vcloud.Disk`.
  * `cloudify.relationships.vcloud.vm_connected_to_media`: Upload a media object (ISO) of by using this relationship with a target node template of node type `cloudify.nodes.vcloud.Media`.
  * `cloudify.relationships.vcloud.vm_connected_to_nic`: Attach a NIC to the VM by using this relationship with a target node template of type `cloudify.nodes.vcloud.NIC`.

**Examples**

```yaml
  test_vm:
    type: cloudify.nodes.vcloud.VM
    properties:
      client_config: *client_config
      resource_config:
        catalog: { get_input: catalog }
        template: { get_input: template }
        description: 'test description'
        fence_mode: 'bridged'
        ip_allocation_mode: 'manual'
        deploy: false
        power_on: false
        accept_all_eulas: true
        password: 'test_password'
        hostname: 'testvm'
        ip_address: '192.178.1.2'
      agent_config:
        install_method: none
    relationships:
      - type: cloudify.relationships.vcloud.vm_connected_to_network
        target: test_routed_network
      - type: cloudify.relationships.vcloud.vm_contained_in_vapp
        target: test_vapp
      - type: cloudify.relationships.vcloud.vm_connected_to_disk
        target: test_disk
      - type: cloudify.relationships.vcloud.vm_connected_to_media
        target: test_media
      - type: cloudify.relationships.vcloud.vm_connected_to_nic
        target: test_nic
```

## **cloudify.nodes.vcloud.NIC**

Creates and Deletes NICs. Connects the NIC network to the vapp.

**Properties**

  * `resource_id`: Required. The name of the NIC in VCD.
  * `resource_config`: Required. A dict of rules.
      * `adapter_type`: nic adapter type. One of NetworkAdapterType values.
      * `is_primary`: True, if its a primary nic of the VM.
      * `is_connected`: True, if the nic has to be connected.
      * `network_name`: Ideally use the relationship `cloudify.relationships.vcloud.nic_connected_to_network` instead of providing the name of a vdc network. When provided, connects the vm to the network.
      * `ip_address_mode`: One of DHCP|POOL|MANUAL|NONE.
      * `ip_address`: to be set an ip in case of MANUAL mode.

**Runtime Properties**

  **Same as `cloudify.nodes.vcloud.VM`**

**Relationships**

  * `cloudify.relationships.vcloud.nic_connected_to_network`: Specify which network to create the NIC on.

**Examples**

```yaml
  my_nic:
    type: cloudify.nodes.vcloud.NIC
    properties:
      client_config: *client_config
      resource_config:
        adapter_type: 'VMXNET3'
        is_primary: false
        is_connected: false
        ip_address_mode: 'MANUAL'
        ip_address: '192.178.2.2'
    relationships:
      - type: cloudify.relationships.vcloud.nic_connected_to_network
        target: my_network
      - type: cloudify.relationships.depends_on
        target: my_dchp_pool # To ensure we create the NIC after the required DHCP pool exists.
```

## **cloudify.nodes.vcloud.Media**


**Properties**

  * `resource_id`: Required. The name of the VM in VCD.
  * `resource_config`: Required. A dict of rules.
      * `catalog_name`: name of the catalog where the media file will be uploaded.
      * `file_name`: Not needed. It will be generated from the `resource_id` or the node instance ID, if not provided.
      * `item_name`: Not needed. It will be generated from the `resource_id` or the node instance ID, if not provided.
  * `iso`: A dictionary describing the data to store in the ISO.
    * `vol_ident`
    * `sys_ident`
    * `files`: A dictionary of paths to put in the ISO. The dictionary key is the file path, the key-value is the context.

**Examples**

```yaml
  my_media:
    type: cloudify.nodes.vcloud.Media
    properties:
      client_config: *client_config
      resource_config:
        catalog_name: { get_input: catalog }
      iso:
        vol_ident: cidata
        sys_ident: ''
        files:
          ISO/FOLDER/content.json: test content
```


## **cloudify.nodes.vcloud.Disk**


**Properties**

  * `resource_id`: Required. The name of the VM in VCD.
  * `resource_config`: Required. A dict of rules.
      * `name`: Preferable to use the `resource_id` or to let it default to the node instance ID.
      * `size`: size of the new disk in bytes.
      * `bus_type`: bus type of the new disk.
      * `bus_sub_type`: bus subtype of the new disk.
      * `description`: description of the new disk.
      * `storage_profile_name`: name of an existing storage profile to be used by the new disk.
      * `iops`: iops requirement of the new disk.

**Examples**

```yaml
  my_disk:
    type: cloudify.nodes.vcloud.Disk
    properties:
      client_config: *client_config
      resource_config:
        size: 2097152
        description: test disk
```


# Relationships types

Relationships express a dependency and may perform some operation or be used by internal code.


## **cloudify.relationships.vcloud.network_connected_to_gateway**

Ensures that the network is created in the targeted gateway.


## **cloudify.relationships.vcloud.firewall_rules_contained_in_gateway**

Creates the firewall rules. Deletes the firewall rules.


## **cloudify.relationships.vcloud.static_routes_contained_in_gateway**

Creates the static routes. Deletes the static routes.


## **cloudify.relationships.vcloud.dhcp_pools_contained_in_gateway**

Creates the DHCP pools. Deletes the DHCP pools.


## **cloudify.relationships.vcloud.nat_rules_contained_in_gateway**

Creates the NAT rules. Deletes the NAT rules.


## **cloudify.relationships.vcloud.vm_connected_to_network**

Ensures that the VM is created in the targeted network.


## **cloudify.relationships.vcloud.vapp_connected_to_network**

Ensures that the vApp is created in the targeted network.


## **cloudify.relationships.vcloud.vm_contained_in_vapp**

Ensures that the VM is created in the targeted vApp.


## **cloudify.relationships.vcloud.vm_connected_to_disk**

Attaches the VM to the targeted disk. Detaches the VM from the targeted disk.


## **cloudify.relationships.vcloud.vm_connected_to_media**

Attaches the VM to the targeted ISO. Detaches the VM from the targeted ISO.


## **cloudify.relationships.vcloud.vm_connected_to_nic**

Connects the network targeted in `cloudify.relationships.vcloud.nic_connected_to_network` to the VM's vApp.
Attaches the VM to the targeted NIC.
Disconnects the network targeted in `cloudify.relationships.vcloud.nic_connected_to_network` from the VM's vApp.
Detaches the VM from the targeted NIC.


## **cloudify.relationships.vcloud.nic_connected_to_network**

Ensures that the NIC is created in the targeted network.
