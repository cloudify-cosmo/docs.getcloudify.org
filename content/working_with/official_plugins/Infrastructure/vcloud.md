---
layout: bt_wiki
title: vCloud Air Plugin
category: Official Plugins
draft: false
abstract: Cloudify vCloud Air plugin description and configuration
weight: 100
aliases:
    - /plugins/vcloud/
    - /developer/official_plugins/vcloud/
---

The vCloud Air plugin enables you to use a vCloudAir-based infrastructure for deploying services and applications.


# Plugin Requirements

* Python version 2.7.x

# Compatibility

* Plugin uses Vmware vCloud python package Rel16 (7/2016) for [vCloud Air API](https://pubs.vmware.com/vca/topic/com.vmware.ICbase/Welcome/welcome.html)
* Plugin is not compatible with [vCloud Director API](https://docs.vmware.com/en/vCloud-Director/index.html), which is only supported API in Vmware python package Rel19 (12/2017) onwards

# vCloud Air Configuration

The vCloud Air plugin requires credentials in order to authenticate and interact with vCloud Air.

The information is gathered by the plugin from the following sources. Each source might partially or completely override values gathered from the previous ones.

  * JSON file at `~/vcloud_config.json` or at a path specified by the value of an environment variable named `VCLOUD_CONFIG_PATH`.
  * Values specified in the `vcloud_config` property for the node thats operation is currently being executed. (In the case of relationship operations, the `vcloud_config` property of either the *source* or *target* nodes are used if available, with the *source* node's property taking precedence).

The structure of the JSON file in the first bullet, and of the `vcloud_config` property in the second bullet, is as follows:

{{< highlight  json  >}}
{
    "username": "",
    "password": "",
    "url": "",
    "org": "",
    "vdc": "",
    "service": "",
    "service_type": "",
    "api_version": "",
    "instance": "",
    "org_url": "",
    "ssl_verify": ""
}
{{< /highlight >}}

* `username` - The vCloud Air account username.
* `password` - The vCloud Air account password.
* `url` - The vCloud Air URL.
* `org` - The organization name. Required only for the `ondemand` and `subscription` service types.
* `instance` - The instance UUID. Required only for the `ondemand` service type.
* `vdc` - The virtual datacenter name.
* `service` - The vCloud Air service name.
* `service_type` - The service type. Can be `subscription`, `ondemand`, `vcd` or `private`. `Private` is an alias for `vcd` and both types can be used with a private vCloud environment without any difference. Defaults to `subscription`.
* `api_version` - The vCloud Air API version. For `Subscription`, defaults to `5.6`. For `OnDemand`, defaults to `5.7`.
* `region` - The region name. Applies to `OnDemand`.
* `org_url` - The organization URL. Required only for `private` service type.
* `edge_gateway` - The Edge gateway name.
* `ssl_verify` A boolean flag for disabling the SSL certificate check. Only applicable for a `private` cloud service with self-signed certificates. Defaults to `True`


# Misc

## vApp template
The template requires a VM with root disk with OS, SSH server and VMware Tools installed.

The template must not have any networks connected.


# Types

{{% tip title="Tip" %}}
Each type has a `vcloud_config` property. It can be used to pass parameters for authentication.
{{% /tip %}}


## cloudify.vcloud.nodes.Server

**Derived From:** cloudify.nodes.Compute

**Properties:**

* `server` - The key-value server configuration.
    * `name` - The server name.
    * `template` - The vApp template from which the server is spawned. For more information, see the [Misc section - vApp template](#vapp-template).
    * `catalog` - The vApp templates catalog.
    * `guest_customization` - The guest customization section, including:
        * `public_keys` - The public keys to be injected. A list of key-value configurations.
              * `key` - The public SSH key.
              * `user` - The user name.
        * `computer_name` - The VM hostname.
        * `admin_password` - The root password.
        * `pre_script` - A pre-customization script.
        * `post_script` - A pPost-customization script.
        * `script_executor` - The script executor. The default is `/bin/bash`.
    * `hardware` - The key-value hardware customization section, including:
        * `cpu` - The VM CPU count.
        * `memory` - The VM memory size, in MB.
* `management_network` - The management network name.
* `vcloud_config` See the [vCloud Configuration](#vcloud-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` - Creates the vApp.
  * `cloudify.interfaces.lifecycle.start` - Starts the vApp, if it is not already started.
  * `cloudify.interfaces.lifecycle.stop` - Stops the vApp, if it is not already stopped.
  * `cloudify.interfaces.lifecycle.delete` - Deletes the vApp and waits for termination.
  * `cloudify.interfaces.lifecycle.creation_validation` - Validates the server node parameters before creation.

**Attributes:**

  * `vcloud_vapp_name` - The name of the created vApp.

Two additional runtime-properties are available on node instances of this type, after the `cloudify.interfaces.host.get_state` operation succeeds:

  * `networks` - The server networks information.
  * `ip` - The private IP address (IP on the internal network) of the server.


## cloudify.vcloud.nodes.Network

**Derived From:** cloudify.nodes.Network

**Properties:**

* `network` - The key-value network configuration.
    * `edge_gateway` - The Edge gateway name.
    * `name` - The network name.
    * `static_range` - The static IP allocation pool range.
    * `netmask` - The network netmask.
    * `gateway_ip` - The network gateway.
    * `dns` - The list of DNS IP addresses.
    * `dns_suffix` - The DNS suffix.
    * `dhcp` - The DHCP settings.
        * `dhcp_range` - The DHCP pool range.
        * `default_lease` - The default lease in seconds.
        * `max_lease` - The maximum lease, in seconds.
* `use_external_resource` A boolean for setting whether to create the resource or use an existing one. Defaults to `false`.
* `resource_id` - The name to give to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. Defaults to `''` (empty string).
* `vcloud_config` See the [vCloud Configuration](#vcloud-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the network.
  * `cloudify.interfaces.lifecycle.delete` Deletes the network.
  * `cloudify.interfaces.lifecycle.creation_validation` Validates network node parameters before creation.

**Attributes:**

  * `vcloud_network_name` Network name.


## cloudify.vcloud.nodes.Port

**Derived From:** cloudify.nodes.Port

**Properties:**

* `port` - The key-value server network port configuration.
    * `network` - The network name.
    * `ip_allocation_mode` - The IP allocation mode. Can be `dhcp`, `pool` or `manual`'.
    * `ip_address` - The IP address if the IP allocation mode is `manual`.
    * `mac_address` - The interface MAC address.
    * `primary_interface` - Specifies whether the interface is the primary interface (`true` or `false`).
* `vcloud_config` See the [vCloud Configuration](#vcloud-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.creation_validation` Validates port node parameters.


## cloudify.vcloud.nodes.FloatingIP

**Derived From:** cloudify.nodes.VirtualIP

**Properties:**

* `floatingip` - The key-value floating IP configuration.
    * `edge_gateway` - The vCloud gateway name.
    * `public_ip` - The public IP address. If not specified, the public IP is allocated from the pool of free public IPs.
* `vcloud_config` See the [vCloud Configuration](#vcloud-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.creation_validation` Validates the floating IP node parameters.

**Attributes:**

  * `public_ip` Public IP address.


## cloudify.vcloud.nodes.PublicNAT

**Derived From:** cloudify.nodes.VirtualIP

**Properties:**

* `nat` - The key-value NAT configuration.
    * `edge_gateway` - The vCloud gateway name.
    * `public_ip` - The public IP. If not specified, the public IP is allocated from the pool of free public IPs.
* `rules` - The key-value NAT rules configuration.
    * `protocol` - The network protocol. Can be `tcp`, `udp` or `any`. Applies only for `DNAT`.
    * `original_port` - The original port. Applies only for `DNAT`.
    * `translated_port` - The translated port. Applies only for `DNAT`.
    * `type` - The list of NAT types. Can be `SNAT`, `DNAT` or both.
* `use_external_resource` A boolean for setting whether to create the resource or use an existing one. Defaults to `false`.
* `vcloud_config` See the [vCloud Configuration](#vcloud-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.creation_validation` validates PublicNAT node parameters

**Attributes:**

  * `public_ip` - The public IP address.


## cloudify.vcloud.nodes.KeyPair

**Derived From:** cloudify.nodes.Root

**Properties:**

* `private_key_path` - The path to the private SSH key file.
* `public_key` - The key-value public key configuration:
    * `key` - The SSH public key.
    * `user` - The user name.
* `private_key` - The key-value private key configuration.
    * `create_file` Whether to save the file. Use with `auto_generate: true`.
* `auto_generate` - Use to auto-generate the key.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.creation_validation` Validates key-pair node parameters.


## cloudify.vcloud.nodes.SecurityGroup

**Derived From:** cloudify.nodes.SecurityGroup

**Properties:**

* `security_group` - The key-value SecurityGroup configuration.
    * `edge_gateway` - The vCloud gateway name.
* `rules` - The security group rules. A list of key-value configurations.
    * `protocol` `tcp`, `udp`, `icmp` or `any`.
    * `source` - The source of traffic on which to apply the firewall. Can be `internal`, `external`, `host`, `any`, the IP address or `IP range`.
    * `source_port` - The port number or `any`.
    * `destination` - The destination of traffic on which to apply the firewall rule. Can be `internal`, `external`, `host`, `any`, the IP address or IP range.
    * `destination_port` - The port number or `any`.
    * `action` `allow` or `deny`.
    * `log_traffic` - Used to capture traffic. `true` or `false`.'
    * `description` - The rule description.
* `vcloud_config` See the [vCloud Configuration](#vcloud-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.creation_validation` Validates SecurityGroup node parameters.


# Relationships

## cloudify.vcloud.server_connected_to_floating_ip

**Description:** A relationship for associating the FloatingIP node with the Server node.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.establish` - Associates the floating IP with the server.
  * `cloudify.interfaces.relationship_lifecycle.unlink` - Disassociates the floating IP from the server.

## cloudify.vcloud.server_connected_to_port

**Description:** A relationship for connecting the server to a port.
**Note:** This relationship has no operations associated with it. The server uses this relationship to connect to the port upon server creation.

## cloudify.vcloud.port_connected_to_network

**Description:** A relationship for connecting a port to the network.
**Note:** This relationship has no operations associated with it.

## cloudify.vcloud.server_connected_to_network

**Description:** A relationship for connecting the server to the network.
**Note:** This relationship has no operations associated with it. The server uses this relationship to connect to the network upon server creation. It uses DHCP for IP allocation.

## cloudify.vcloud.server_connected_to_public_nat

**Description:** A relationship for associating the PublicNAT and the server.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.establish` - Associates PublicNAT with the server.
  * `cloudify.interfaces.relationship_lifecycle.unlink` - Disassociates PublicNAT from the server.

## cloudify.vcloud.server_connected_to_security_group
**Description:** A relationship for associating a SecurityGroup and server.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.establish` - Associates a SecurityGroup with a server.
  * `cloudify.interfaces.relationship_lifecycle.unlink` - Disassociates a SecurityGroup from a server.

## cloudify.vcloud.net_connected_to_public_nat
**Description:** A relationship for associating a PublicNAT and the network.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.establish` - Associates a PublicNAT with the network.
  * `cloudify.interfaces.relationship_lifecycle.unlink` - Disassociates a PublicNAT from the network.


# Examples

## Example I: Using Plugin Types

This example demonstrates how to use some of the types of this plugin.

Following is an excerpt from the blueprint's `blueprint`.`node_templates` section:

{{< highlight  yaml  >}}
example_server:
    type: cloudify.vcloud.nodes.Server
    properties:
        server:
            name: example-server
            catalog: example-catalog
            template: example-vapp-template
            hardware:
                cpu: 2
                memory: 4096
            guest_customization:
                public_keys:
                    - key: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCi64cS8ZLXP9xgzscr+m7bKBDdnhTxXaarJ8hIVgG5C7FHkF1Yj9Za+JIMqGjlwsOugFt09ZTvR1kQcIXdZQhs5HWhnG8UY7RkuUwO4FOFpL2VtMAleP/ZNXSZIGwwy4Sm/wtYOo8V5GPrJNbQnVtsW2NJNt6mB1geJzlshbl9wpshHlFSOz6jV2L8k2kOq32nt/Wa3qpDk20IbKnO9wJYWHVzvyJ4bTOyHowStAABFEj8O7XmoQp8jdUuTj+qAOgCROTAQh93XbS3PJjaQYBhxLOOreYYeqjKG/8IUlFxtRdUn7MLS6Rd15AP2HnjhjKad2KqnOuFZqiTLBu+CGWf
                      user: ubuntu
                computer_name: { get_input: manager_server_name }
        management_network: existing-network
        vcloud_config: { get_property: [vcloud_configuration, vcloud_config] }
    relationships:
        - target: example_port
          type: cloudify.vcloud.server_connected_to_port
        - target: example_port2
          type: cloudify.vcloud.server_connected_to_port
        - target: manager_floating_ip
          type: cloudify.vcloud.server_connected_to_floating_ip

manager_floating_ip:
    type: cloudify.vcloud.nodes.FloatingIP
    properties:
        floatingip:
            edge_gateway: M000000000-1111
            public_ip: 24.44.244.44
        vcloud_config: { get_property: [vcloud_configuration, vcloud_config] }

example_port:
    type: cloudify.vcloud.nodes.Port
    properties:
        port:
            network: existing-network
            ip_allocation_mode: dhcp
            primary_interface: true
        vcloud_config: { get_property: [vcloud_configuration, vcloud_config] }
    relationships:
        - target: example_network
          type: cloudify.vcloud.port_connected_to_network

example_network:
    type: cloudify.vcloud.nodes.Network
    properties:
        use_external_resource: true
        resource_id: existing-network
        vcloud_config: { get_property: [vcloud_configuration, vcloud_config] }

example_port2:
    type: cloudify.vcloud.nodes.Port
    properties:
        port:
            network: new-network
            ip_allocation_mode: manual
            ip_address: 10.10.0.2
            mac_address: 00:50:56:01:01:49
            primary_interface: false
        vcloud_config: { get_property: [vcloud_configuration, vcloud_config] }
    relationships:
        - target: example_network2
          type: cloudify.vcloud.port_connected_to_network

example_network2:
    type: cloudify.vcloud.nodes.Network
    properties:
        network:
            edge_gateway: M000000000-1111
            name: new-network
            static_range: 10.10.0.2-10.10.0.64
            netmask: 255.255.255.0
            gateway_ip: 10.10.0.1/24
            dns: ['10.0.0.1', '8.8.8.8']
            dns_suffix: test
            dhcp:
                dhcp_range: 10.0.0.65-10.0.0.254
                default_lease: 3600
                max_lease: 7200
        vcloud_config: { get_property: [vcloud_configuration, vcloud_config] }

vcloud_configuration:
    type: vcloud_configuration
    properties:
        vcloud_config:
            username: user
            password: pw
            url: https://vchs.vmware.com
            service_type: subscription
            service: M000000000-1111
            vdc: M000000000-1111
            org: M000000000-1111
{{< /highlight >}}
