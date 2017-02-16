---
layout: bt_wiki
title: vSphere Plugin
category: Plugins
draft: false
weight: 300

plugin_link: http://getcloudify.org.s3.amazonaws.com/spec/vsphere-plugin/2.0/plugin.yaml
---
{{% gsSummary %}} {{% /gsSummary %}}


# Description

The vSphere plugin allows users to use a vSphere based infrastructure for deploying services and applications.

# Plugin Requirements

* Python versions:
    * 2.7.x
* Permissions on vCenter:
    * To create and destroy virtual machines and storage:
        * On the datacenter (Must Propagate to children):
            * Datastore/Allocate Space
            * Network/Assign Network
            * Virtual Machine/Configuration/Add new disk
            * Virtual Machine/Configuration/Add or remove device
            * Virtual Machine/Configuration/Change CPU count
            * Virtual Machine/Configuration/Memory
            * Virtual Machine/Configuration/Remove disk
            * Virtual Machine/Interaction/Power On
            * Virtual Machine/Interaction/Power Off
            * Virtual Machine/Inventory/Create from existing
            * Virtual Machine/Inventory/Remove
        * On the specific resource pool:
            * Full permissions recommended
        * On the template(s) to be used
            * Virtual Machine/Provisioning/Customize
            * Virtual Machine/Provisioning/Deploy template
    * To create and destroy port groups:
        * On the datacenter:
            * Host/Configuration/Network configuration
    * To create and destroy distributed port groups:
        * On the datacenter:
            * dvPort group/Create
            * dvPort group/Delete


## vSphere Environment

* You will require a working vSphere environment. The plugin was tested with version 5.5.

## SSH Keys
* You will need SSH keys generated for both the manager and the application VM's. If you are using the default key locations in the inputs, these can be created with the following commands:

{{< gsHighlight  bash  >}}
ssh-keygen -b2048 -N "" -q -f ~/.ssh/cloudify-manager-kp.pem
ssh-keygen -b2048 -N "" -q -f ~/.ssh/cloudify-agent-kp.pem
{{< /gsHighlight >}}

## OS Templates

* You need two OS templates of your preferred operating systems (e.g. Ubuntu Trusty) within the vSphere datastores. One for the Cloudify manager and one for the application VMs. The application VM template should accept the Cloudify agent public key for its root user. The Cloudify manager template must accept the cloudify manager public key. Note that you can choose to use same template for both the manager and the application VMs, in that case the shared template must accept both public keys.
* Both templates must have SSH activated and open on the firewall.
* Both templates must have VMWare tools installed. Instructions for this can be found on the [VMWare site](http://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=2075048). Please note, however, that the instructions on this site give incorrect tools for importing keys (it should be using `rpm --import <key>` rather than the apt-key equivalent). After following the instructions you should also run: `chkconfig vmtoolsd on`.
* It is also necessary to install the deployPkg plugin on the VM according to [VMWare documentation](http://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=2075048)
* The template should not have any network interfaces.


## Connection Config

All node types contain a property, `connection_config` which is a key-value vSphere environment configuration. If not specified, values that were used for Cloudify bootstrap process will be used.
    * `username` vSphere username.
    * `password` user password.
    * `host` vCenter host name or IP.
    * `port` vCenter port for SDK (443 by default).
    * `datacenter_name` datacenter name.
    * `resource_pool_name` name of a resource pool. If you do not wish to use a resource pool this must be set to 'Resources' as this is the base resource pool on vSphere.
    * `auto_placement` signifies whether to use vSphere's auto-placement instead of the plugin's. Must be true if you are using clusters. (false by default).

As well as looking for config values in the node's ``connnection_config``
property, the plugin will also look in locations on the local filesystem
for a JSON file containing config values.
The values from the node's ``connection_config`` will be merged in to the
values from the JSON file, with the node's options taking precedence.

The following table shows the locations that will be checked for a config
file. The first file (in the order shown below) will be used.
(paths starting with $ are environment variables which will be expanded).

+-----------------------------------------------------+------------+
| Path                                                | deprecated |
+=====================================================+============+
| $CFY_VSPHERE_CONFIG_PATH                            |            |
+-----------------------------------------------------+------------+
| $CONNECTION_CONFIG_PATH                             | yes        |
+-----------------------------------------------------+------------+
| /etc/cloudify/vsphere_plugin/connection_config.yaml |            |
+-----------------------------------------------------+------------+
| ~/connection_config.yaml                            | yes        |
+-----------------------------------------------------+------------+
| /root/connection_config.yaml                        | yes        |
+-----------------------------------------------------+------------+


# Types


## cloudify.vsphere.nodes.Server

**Derived From:** cloudify.nodes.Compute

**Properties:**

* `server` key-value server configuration.
    * `name` server name. Note that this MUST NOT contain any characters other than A-Z, a-z, 0-9, hyphens (-), and underscores (_, which will be converted to hyphens). It must not be entirely composed of digits (0-9). It will have a unique suffix appended to it, allowing multiple instances for one node. If the name parameter is not specified, the node name from the blueprint will be used, with the same restrictions applying
    * `template` virtual machine template from which server will be spawned. For more information, see the [Misc section - Virtual machine template](#virtual-machine-template).
    * `cpus` number of CPUs.
    * `memory` amount of RAM, in MB.

* `allowed_hosts` Which ESX hosts this server is allowed to be deployed on. If not set, all hosts will be allowed.

* `allowed_clusters` Which ESX clusters this server is allowed to be deployed on. If not set, all clusters (including no cluster) will be allowed. If set, no hosts not in a cluster will be used.

* `allowed_datastores` Which ESX datastores this server is allowed to be deployed on. This may limit the available hosts. If not set, all datastores will be allowed.

* `networking` key-value server networking configuration.
    * `domain` the DNS suffix to use on this server.
    * `dns_servers` list of DNS servers.
    * `connect_networks` list of existing networks to which server will be connected, described as key-value objects. The network(s) must be described as:
        * `name` Name of port group or distributed port group on vSphere.
        * `management` signifies if it's a management network (false by default). Only one connected network can be management. This network will have its IP listed under the runtime property 'ip', but will not otherwise have any impact on the way this interface is configured.
        * `external` signifies if it's an external network (false by default). Only one connected network can be external. This network will be the first network attached to the server and will have its IP listed under the runtime property 'public_ip', but will not otherwise have any impact on the way this interface is configured.
        * `switch_distributed` signifies if network is connected to a distributed switch (false by default).
        * `use_dhcp` use DHCP to obtain an ip address (true by default).
        * `network` network cidr (for example, 10.0.0.0/24). It will be used by the plugin only when `use_dhcp` is false.
        * `gateway` network gateway ip. It will be used by the plugin only when `use_dhcp` is false.
        * `ip` server ip address. It will be used by the plugin only when `use_dhcp` is false.

* `custom_attributes` key-value pairs which will be added as customField entries on the server.
  keys which do not already exist on the platform will be created automatically.
  keys will not be removed automatically from the platform when the Server is deleted.

* `[connection_config](#Connection Config)`

**Runtime properties:**

* `name` Name of the server on vsphere and in the OS
* `ip` Management IP address of the server (as determined by finding the IP of whichever network is set as management), or the IP of the first attached network on the server (if no management interface is set). This will be null/None if there are no attached networks.
* `public_ip` External IP address of server (as determined by finding the IP of whichever network is set as external), or nothing if there is no network set as external.
* `vsphere_server_id` Internal ID of server on vsphere (e.g. vm-1234)
* `networks` list of key-value details of attached networks
    * `distributed` Whether or not this is a distributed network
    * `name` The name of this network
    * `mac` The MAC address of the NIC on this network
    * `ip` The IP address assigned to the NIC on this network, or None if there is no IP

## cloudify.vsphere.nodes.WindowsServer

**Derived From:** cloudify.nodes.Compute

**Properties:**

* `windows_password` The password to set for the administrator account on the Windows system. If this is not supplied then the value under properties.agent_config.password will be used. If neither are supplied, an error will be raised when running install workflows.

* `windows_timezone` The timezone to set the Windows system to. It will default to 90 (GMT without daylight savings (approximately UTC)). If you wish to set this it must be set to an [appropriate integer value](https://msdn.microsoft.com/en-us/library/ms912391%28v=winembedded.11%29.aspx)

* `server` key-value server configuration.
    * `name` server name. Note that this MUST NOT contain any characters other than A-Z, a-z, 0-9, hyphens (-), and underscores (_, which will be converted to hyphens). It must not be entirely composed of digits (0-9). It will be truncated at 8 characters to permit a unique identifier suffix, allowing multiple instances for one node. If the name parameter is not specified, the node name from the blueprint will be used, with the same restrictions applying
    * `template` virtual machine template from which server will be spawned. For more information, see the [Misc section - Virtual machine template](#virtual-machine-template).
    * `cpus` number of CPUs.
    * `memory` amount of RAM, in MB.

* `allowed_hosts` Which ESX hosts this server is allowed to be deployed on. If not set, all hosts will be allowed.

* `allowed_clusters` Which ESX clusters this server is allowed to be deployed on. If not set, all clusters (including no cluster) will be allowed. If set, no hosts not in a cluster will be used.

* `allowed_datastores` Which ESX datastores this server is allowed to be deployed on. This may limit the available hosts. If not set, all datastores will be allowed.

* `networking` key-value server networking configuration.
    * `dns_servers` list of DNS servers.
    * `connect_networks` list of existing networks to which server will be connected, described as key-value objects. The network(s) must be described as:
        * `name` Name of port group or distributed port group on vSphere.
        * `management` signifies if it's a management network (false by default). Only one connected network can be management. This network will have its IP listed under the runtime property 'ip', but will not otherwise have any impact on the way this interface is configured.
        * `external` signifies if it's an external network (false by default). Only one connected network can be external. This network will be the first network attached to the server and will have its IP listed under the runtime property 'public_ip', but will not otherwise have any impact on the way this interface is configured.
        * `switch_distributed` signifies if network is connected to a distributed switch (false by default).
        * `use_dhcp` use DHCP to obtain an ip address (true by default).
        * `network` network cidr (for example, 10.0.0.0/24). It will be used by the plugin only when `use_dhcp` is false.
        * `gateway` network gateway ip. It will be used by the plugin only when `use_dhcp` is false.
        * `ip` server ip address. It will be used by the plugin only when `use_dhcp` is false.

    * (`domain` not currently used for windows servers.)

* `connection_config` key-value vSphere environment configuration. If not specified, values that were used for Cloudify bootstrap process will be used.
    * `username` vSphere username.
    * `password` user password.
    * `host` vCenter host name or IP.
    * `port` vCenter port for SDK (443 by default).
    * `datacenter_name` datacenter name.
    * `resource_pool_name` name of a resource pool. If you do not with to use a resource pool this must be set to 'Resources' as this is the base resource pool on vSphere.
    * `auto_placement` signifies whether to use vSphere's auto-placement instead of the plugin's. Must be true if you are using clusters. (false by default).

**Runtime properties:**

* `name` Name of the server on vsphere and in the OS
* `ip` Management IP address of the server (as determined by finding the IP of whichever network is set as management)
* `public_ip` External IP address of server (as determined by finding the IP of whichever network is set as external)
* `vsphere_server_id` Internal ID of server on vsphere (e.g. vm-1234)
* `networks` list of key-value details of attached networks
    * `distributed` Whether or not this is a distributed network
    * `name` The name of this network
    * `mac` The MAC address of the NIC on this network
    * `ip` The IP address assigned to the NIC on this network, or None if there is no IP

## cloudify.vsphere.nodes.Network

**Derived From:** cloudify.nodes.Network

**Properties:**

* `network` key-value network configuration.
    * `name` network name
    * `vlan_id` vLAN identifier which will be assignee to the network.
    * `vswitch_name` vSwitch name to which the network will be connected
* `connection_config` key-value vSphere environment configuration. Same as for `cloudify.vsphere.server` type.

**Runtime properties:**

* `network_name` Name of the network on vsphere
* `switch_distributed` True if this is a distributed port group, False otherwise.

## cloudify.vsphere.nodes.Storage

**Derived From:** cloudify.nodes.Volume

**Properties:**

* `storage` key-value storage disk configuration.
    * `storage_size` disk size in GB.
* `connection_config` key-value vSphere environment configuration. Same as for `cloudify.vsphere.server` type.

**Runtime properties:**

* `attached_vm_id` Internal ID of attached server on vsphere (e.g. vm-1234)
* `attached_vm_name` Name of the attached server on vsphere and in the OS
* `datastore_file_name` The datastore and filename on that datastore of this virtual disk. e.g. "[Datastore-1] myserver-a12b3/myserver-a12b3_1.vmdk"
* `scsi_id` SCSI ID in the form of bus_id:unit_id, e.g. "0:1"

# Examples

## Example I

{{% gsCloak "Example I" %}}

{{< gsHighlight  yaml  >}}
example_server:
    type: cloudify.vsphere.nodes.Server
    properties:
        networking:
            domain: example.com
            dns_servers: ['8.8.8.8']
            connected_networks:
                -   name: example_management_network
                    management: true
                    switch_distributed: false
                    use_dhcp: true
                -   name: example_external_network
                    external: true
                    switch_distributed: true
                    use_dhcp: false
                    network: 10.0.0.0/24
                    gateway: 10.0.0.1
                    ip: 10.0.0.2
                -   name: example_network
                    switch_distributed: false
                    use_dhcp: true
            server:
                name: example_server
                template: example_server_template
                cpus: 1
                memory: 512
    relationships:
        - type: cloudify.relationships.depends_on
          target: example_network

example_network:
    type: cloudify.vsphere.nodes.Network
    properties:
        network:
            name: example_network
            vlan_id: 101
            vswitch_name: vSwitch0
            switch_distributed: false

example_storage:
    type: cloudify.vsphere.nodes.Storage
    properties:
        storage:
            storage_size: 1
    relationships:
        - target: example_server
          type: cloudify.vsphere.storage_connected_to_server
{{< /gsHighlight >}}

Node by node explanation:

1. Creates a server. In the server 'networking' property we specified desired domain name as 'example.com', additional DNS server 8.8.8.8, and three existing networks we want to connect to: example_management_network, example_external_network and example_network. In the 'server' property we specified server name as example_server, vm template name as example_server_template, number of cpus as 1, and RAM as 512 MB.

2. Creates a network. We specified network name as example_network, network vLAN id as 101, and an existing vSwitch name we want to connect to as example_vswitch.

3. Creates a virtual hard disk. We specified desired storage size as 1 GB and wish to add this storage to example_server vm.

{{% /gsCloak %}}
