---
title: vSphere Plugin
category: Official Plugins
description: The vSphere plugin enables you to use a vSphere-based infrastructure for deploying services and applications
draft: false
weight: 130
aliases:
    - /plugins/vsphere/
    - /developer/official_plugins/vsphere/

plugin_link: http://getcloudify.org.s3.amazonaws.com/spec/vSphere-plugin/2.0/plugin.yaml
---


The vSphere plugin enables you to use a vSphere-based infrastructure for deploying services and applications.

# Plugin Requirements

* Python versions:
    * 2.7.x
* Permissions on vCenter:
    * To create and tear down virtual machines and storage:
        * On the datacenter:
            * Datastore/Allocate Space
            * Network/Assign Network
            * Virtual Machine/Configuration/Add or remove device
            * Virtual Machine/Configuration/Change CPU count
            * Virtual Machine/Configuration/Memory
            * Virtual Machine/Interaction/Power On
            * Virtual Machine/Inventory/Create from existing
        * On the specific resource pool:
            * Full permissions recommended
        * On the template(s) to be used
            * Virtual Machine/Provisioning/Customize
            * Virtual Machine/Provisioning/Deploy template
    * To create and tear down port groups:
        * On the datacenter:
            * Host/Configuration/Network configuration
    * To create and tear down distributed port groups:
        * On the datacenter:
            * dvPort group/Create
            * dvPort group/Delete

## vSphere Environment

* You require a working vSphere environment. The plugin was tested with vSphere infrastructure versions 6.0 and 6.5.

# vSphere Plugin Configuration
The vSphere plugin requires credentials and endpoint setup information in order to authenticate and interact with vSphere.

## Accessing Secrets

 It is recommended that you store your credentials as [secrets]({{< relref "working_with/manager/using-secrets.md" >}}). You can do this using the [CLI]({{< relref "cli/orch_cli/secrets.md" >}}).
 Secrets can then be accessed inside your blueprints, as follows:

 {{< highlight  yaml  >}}
 external_network:
    type: cloudify.vsphere.nodes.Network
    properties:

      connection_config:
        username: { get_secret: vsphere_username }
        password: { get_secret: vcenter_password }
        host: { get_secret: vcenter_hostname_or_ip }
        datacenter_name: { get_secret: datacenter_name }
 {{< /highlight >}}

## Providing Credentials as Environment Variables that are not Stored as Secrets
If you do not use secret storage, you must provide the following credentials as environment variables:

{{< highlight  yaml  >}}
       connection_config:
        username: { vsphere_username }
        password: { vcenter_password }
        host: { vcenter_hostname_or_ip }
        datacenter_name: { datacenter_name }
 {{< /highlight >}}

## SSH Keys
* You need SSH keys to be generated for both the Manager and the application VM's. If you are using the default key locations in the inputs, you can create them using the following commands:

{{< highlight  bash  >}}
ssh-keygen -b2048 -N "" -q -f ~/.ssh/cloudify-manager-kp.pem
ssh-keygen -b2048 -N "" -q -f ~/.ssh/cloudify-agent-kp.pem
{{< /highlight >}}

## OS Templates

* You need two OS templates for your preferred operating systems (e.g. Ubuntu Trusty) within the vSphere datastores, one for {{< param cfy_manager_name >}} and one for the application VMs. The application VM template must accept the {{< param product_name >}} agent public key for its root user. The {{< param cfy_manager_name >}} template must accept the {{< param cfy_manager_name >}} public key. Note that you can use same template for both the Manager and the application VMs. In that case, the shared template must accept both public keys.
* Both templates must have SSH activated and open on the firewall.
* Both templates must have VMWare tools installed. Instructions for this can be found on the [VMWare site](http://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=2075048). Please note, however, that the instructions on this site provide incorrect tools for importing keys (it should be using `rpm --import <key>` rather than the apt-key equivalent). After following the instructions, run `chkconfig vmtoolsd on`.
* It is also necessary to install the deployPkg plugin on the VM, according to the [VMWare documentation](http://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=2075048).
* The template must not have any network interfaces.


# Types

{{% tip title="Tip" %}}
Each type has a `connection_config` property. It can be used to pass parameters for authentication.
{{% /tip %}}


## cloudify.nodes.vsphere.Server

**Derived From:** cloudify.nodes.Compute

**Interfaces**

  * `cloudify.interfaces.host`:
    * `get_state`:
      * `minimum_wait_time`: Sets the minimum time in seconds that Cloudify will wait before pulling the state info.
should be used when the os requires extra time to complete configuration and all the reported information to become available from vSphere.

  * `cloudify.interfaces.snapshot`:
    * `create`:
      * `snapshot_name`: Sets the snapshot name when we create one.
      * `snapshot_incremental`: should be true.
      * `with_memory`: it can be either true/false.
    * `apply`:
      * `snapshot_name`: Sets the snapshot name that we want to apply to the server.
      * `snapshot_incremental`: should be true.
    * `delete`:
      * `snapshot_name`: Sets the snapshot name that we want to delete from server snapshots.
      * `snapshot_incremental`: should be true.

**Note** when creating snapshot if with_memory is set to false which is the default value it will cause the VM to be shutdown.


**Properties:**

* `use_existing_resource` - Indicate that the VM has already been created you want to begin using it. Should be used together with the `server:name` property. _Note: {{< param cfy_manager_name >}} will not delete or perform any other lifecycle operations aside from monitoring and agent installation if configured._
* `server` - The key-value server configuration.
    * `name` - The server name. Note that this MUST NOT contain any characters other than A-Z, a-z, 0-9, hyphens (-), and underscores (_). Underscores are converted to hyphens. It must not be entirely composed of digits (0-9). The name will have a unique suffix appended to it, enabling multiple instances for one node. If the name parameter is not specified, the node name from the blueprint is used, with the same restrictions applying.
    * `template` - The virtual machine template from which the server is spawned. For more information, see the [Misc section - Virtual machine template](#virtual-machine-template).
    * `cpus` - The number of CPUs.
    * `memory` - The amount of RAM, in MB.
    * `clone_vm` - The name of virtual machines that you want to clone -don't use it with template as it will have precedence-
    * `disk_provision_type` - Disk provisioning type if we are using datastore that is not vSan it can be one of these values [thickLazyZeroed, thickEagerZeroed, thin]

* `networking` - The key-value server networking configuration.
    * `domain` - The DNS suffix to use on this server.
    * `dns_servers` - The list of DNS servers.
    * `connect_networks` - The list of existing networks to which the server is connected, described as key-value objects. The network(s) must be described as:
        * `name` - The name of the port group or distributed port group on vSphere.
        * `management` - Signifies if the network is a management network (`false` by default). Only one connected network can be management. This network has its IP address listed under the `ip` runtime property, but will not otherwise have any impact on how this interface is configured.
        * `external` - Signifies if the network is an external network (`false` by default). Only one connected network can be external. This network is the first network that is attached to the server and has its IP address listed under the `public_ip` runtime property, but does not otherwise have any impact on how this interface is configured.
        * `switch_distributed` - Signifies if the network is connected to a distributed switch (`false` by default).
        * `use_dhcp` - Use DHCP to obtain an IP address (`true` by default).
        * `network` - The network cidr (for example, 10.0.0.0/24). It is used by the plugin only when `use_dhcp` is `false`.
        * `gateway` - The network gateway IP address. It is used by the plugin only when `use_dhcp` is `false`.
        * `ip` - The server IP address. It is used by the plugin only when `use_dhcp` is `false`.

* `connection_config` - The key-value vSphere environment configuration.
    * `username` - The vSphere username.
    * `password` - The user password.
    * `host` - The vCenter host name or IP address.
    * `port` - The vCenter port for SDK (`443` by default).
    * `datacenter_name` - The datacenter name.
    * `resource_pool_name` - The name of a resource pool. If you do not need to use a resource pool, this must be set to `Resources`, as this is the base resource pool on vSphere.
    * `auto_placement` - Signifies whether to use vSphere's auto-placement instead of the plugin's. Must be `true` if you are using clusters. (`false` by default).

**Runtime Properties:**

* `name` - The nme of the server on vSphere and in the OS.
* `ip` - The management IP address of the server (as determined by finding the IP of whichever network is set as `management`), or the IP of the first attached network on the server if no management interface is set. This is `null/None` if there are no attached networks.
* `public_ip` - The external IP address of the server (as determined by finding the IP of whichever network is set as `external`), or `None`if there is no network set as `external`.
* `vSphere_server_id` - The internal ID of the server on vSphere (e.g. vm-1234).
* `networks` - The list of key-value details of the attached networks.
    * `distributed` - Whether this is a distributed network.
    * `name` - The name of this network.
    * `mac` - The MAC address of the NIC on this network.
    * `ip` The IP address assigned to the NIC on this network, or `None` if there is no IP address.

__NOTE: {{< param product_name >}} VSphere Plugin versions before 2.18.7 created the server during the start operation. 2.18.7 introduced the create operation. Usage of the start operation for Server creation will be disabled in a future version.__

## cloudify.nodes.vsphere.WindowsServer

**Derived From:** cloudify.nodes.Compute

**Properties:**

* `windows_password` - The password to set for the administrator account on the Windows system. If this is not supplied, the value under `properties.agent_config.password` is used. If neither are supplied, an error is raised when running install workflows.

* `windows_timezone` - The timezone to which to set the Windows system. It defaults to `90` (GMT without daylight savings (approximately UTC)). To specify this, it must be set to an [appropriate integer value](https://msdn.microsoft.com/en-us/library/ms912391%28v=winembedded.11%29.aspx)

* `windows_organization` - The organization name to set on the Windows system. It defaults to `Organization`.

* `custom_sysprep` - A custom sysprep answers file to use for full customization of Windows. Note that this should be verified to work beforehand, as any errors will only appear on Windows and will not be visible to the plugin. Note also that any scripts, etc, that attempt to work on the VM after the custom sysprep must be tolerant of multiple retries, because the plugin does not detect when the custom sysprep has finished, so provides the server as soon as the IP addresses are assigned (which will be before customization is complete).

* `server` The key-value server configuration.
    * `name` server name. Note that this MUST NOT contain any characters other than A-Z, a-z, 0-9, hyphens (-), and underscores (_, which will be converted to hyphens). It must not be entirely composed of digits (0-9). It is truncated at 8 characters to permit a unique identifier suffix, enabling multiple instances for one node. If the name parameter is not specified, the node name from the blueprint is used, with the same restrictions applying.
    * `template` - The virtual machine template from which the server is spawned. For more information, see the [Misc section - Virtual machine template](#virtual-machine-template).
    * `cpus` - The number of CPUs.
    * `memory` - The amount of RAM, in MB.

* `networking` - The key-value server networking configuration.
    * `domain` - The DNS suffix to use on this server.
    * `dns_servers` - The list of DNS servers.
    * `connect_networks` - The list of existing networks to which the server will be connected, described as `key-value` objects. The network(s) must be described as:
        * `name` - The name of the port group or distributed port group on vSphere.
        * `management` - Signifies if the network is a management network (`false` by default). Only one connected network can be `management`. This network has its IP address listed under the `ip` runtime property, but will not otherwise have any impact on how this interface is configured.
        * `external` - Signifies if the network is an external network (`false` by default). Only one connected network can be external. This network is the first network that is attached to the server and has its IP address listed under the `public_ip` runtime property, but does not otherwise have any impact on how this interface is configured.
        * `switch_distributed` - Signifies if the network is connected to a distributed switch (`false` by default).
        * `use_dhcp` - Use DHCP to obtain an IP address (`true` by default).
        * `network` - The network cidr (for example, 10.0.0.0/24). It is used by the plugin only when `use_dhcp` is `false`.
        * `gateway` - The network gateway IP address. It is used by the plugin only when `use_dhcp` is `false`.
        * `ip` - The server IP address. It is used by the plugin only when `use_dhcp` is `false`.

* `connection_config` - The key-value vSphere environment configuration.
    * `username` - The vSphere username.
    * `password` - The  user password.
    * `host` - The vCenter host name or IP address.
    * `port` - The vCenter port for SDK (`443` by default).
    * `datacenter_name` - The datacenter name.
    * `resource_pool_name` - The name of a resource pool. If you do not need to use a resource pool, this must be set to `Resources`, as this is the base resource pool on vSphere.
    * `auto_placement` - Signifies whether to use vSphere's auto-placement instead of the plugin's. Must be `true` if you are using clusters. (false by default).

**Runtime Properties:**

* `name` - The name of the server on vSphere and in the OS.
* `ip` - The Management IP address of the server (as determined by finding the IP address of whichever network is set as `management`).
* `public_ip` - The external IP address of the server (as determined by finding the IP of whichever network is set as `external`).
* `vSphere_server_id` - The internal ID of the server on vSphere (e.g. vm-1234).
* `networks` - The list of `key-value` details of the attached networks.
    * `distributed` - Whether this is a distributed network.
    * `name` - The name of this network.
    * `mac` - The MAC address of the NIC on this network.
    * `ip` - The IP address assigned to the NIC on this network, or `None` if there is no IP address.

## cloudify.nodes.vsphere.Network

**Derived From:** cloudify.nodes.Network

**Properties:**

* `network` - The key-value network configuration.
    * `name` - The network name.
    * `vlan_id` - The vLAN identifier that will be assigned to the network.
    * `vSwitch_name` - The vSwitch name to which the network will be connected
* `connection_config` - The `key-value` vSphere environment configuration. Same as for `cloudify.nodes.vsphere.Server` type.

**Runtime Properties:**

* `network_name` - The name of the network on vSphere.
* `switch_distributed` `True` if this is a distributed port group, `False` otherwise.

## cloudify.nodes.vsphere.Storage

**Derived From:** cloudify.nodes.Volume

**Properties:**

* `storage` - The key-value storage disk configuration.
    * `storage_size` - The disk size in GB.
* `connection_config` - The `key-value` vSphere environment configuration. Same as for `cloudify.nodes.vsphere.Server` type.

**Runtime Properties:**

* `attached_vm_id` - The internal ID of the attached server on vSphere (e.g. vm-1234).
* `attached_vm_name` - The name of the attached server on vSphere and in the OS.
* `datastore_file_name` - The datastore and filename on that datastore of this virtual disk. e.g. "[Datastore-1] myserver-a12b3/myserver-a12b3_1.vmdk".
* `scsi_id` - The SCSI ID, in the form `bus_id:unit_id, e.g. "0:1"`


## cloudify.nodes.vsphere.OvfDeployment

**Derived From:** cloudify.nodes.Root

**Properties:**

* `target` - The key-value install-target configuration.
    * `resource_pool` - The resource pool name.
    * `host` - The name of the target host on which the virtual machine or virtual appliance will run. Optional. If unset, the server will automatically select a target host from the resource pool.
    * `folder` - The name of of the vCenter folder that should contain the virtual machine or virtual appliance. The folder must be virtual machine folder. Optional. If unset, the server will choose the datacenter default folder.
* `ovf_name` - The Ovf Deployment name -would be the deployed vm name as well-.
* `ovf_source` - The Ovf/Ova source it be local file or remote URL.
* `datastore_name` - The Datastore name to use when deploying the Ovf.
* `disk_provisioning` - The Disk provisioning type could be one of these values [ monolithicSparse,monolithicFlat,twoGbMaxExtentSparse,twoGbMaxExtentFlat,thin,thick,sparse,flat,seSparse ] , defaults to thin if not specified.
* `network_mappings` - Specification of the target network to use for ovf:NetworkSection in the OVF descriptor. [key:value] list.
* `memory` - The amount of RAM, in MB.
* `cpus` - The cpus count.
* `disk_size` - The disk size in GBs.
* `cdrom_image` - the cdrom image path.
* `connection_config` - The `key-value` vSphere environment configuration. Same as for `cloudify.nodes.vsphere.Server` type.


## cloudify.nodes.vsphere.PCIDevice

**Derived From:** cloudify.nodes.Root

**Properties:**

* `device_name` - The PCI Passthrough device name.
* `turn_off_vm` - [true/false] control if we turn off the machine to attach PCI device.
* `connection_config` - The `key-value` vSphere environment configuration. Same as for `cloudify.nodes.vsphere.Server` type.


## cloudify.nodes.vsphere.USBDevice

**Derived From:** cloudify.nodes.Root

**Properties:**

* `device_name` - The host usb device name.
* `controller_type` - usb controller type associated with USB it can be [usb2/usb3] defaults to usb3.
* `connection_config` - The `key-value` vSphere environment configuration. Same as for `cloudify.nodes.vsphere.Server` type.


## cloudify.nodes.vsphere.SerialPort

**Derived From:** cloudify.nodes.Root

**Properties:**

* `device_name` - The PCI Passthrough device name it would be in this format [/dev/char/serial/uartX].
* `turn_off_vm` - [true/false] control if we turn off the machine to attach PCI device.
* `connection_config` - The `key-value` vSphere environment configuration. Same as for `cloudify.nodes.vsphere.Server` type.


# Examples

## Example I

{{< highlight  yaml  >}}
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
            vSwitch_name: vSwitch0
            switch_distributed: false

example_storage:
    type: cloudify.vsphere.nodes.Storage
    properties:
        storage:
            storage_size: 1
    relationships:
        - target: example_server
          type: cloudify.vsphere.storage_connected_to_server
{{< /highlight >}}

**Node by Node Explanation**

1. Creates a server. In the server, the `networking` property domain name is specified as `example.com`. In addition, the DNS server `8.8.8.8`, and three existing networks to which to connect `example_management_network`, `example_external_network` and `example_network` are specified. In the `server` property, the server name as is specified as `example_server`, and the vm template name as `example_server_template`. The number of CPUs is specified as `1`, and the RAM as `512 MB`.

2. Creates a network. The network name is specified as `example_network`, the network vLAN ID as `101`, and an existing vSwitch name to connect to as `example_vSwitch`.

3. Creates a virtual hard disk. The required storage size is specified as `1 GB` and this storage is added to the `example_server` vm.


## Example 2

This example will deploy ova to vSphere environment and customize cpu,memory and disk size.

{{< highlight  yaml  >}}
node_templates:
  ova_deployment:
    type: cloudify.nodes.vsphere.OvfDeployment
    properties:
      use_external_resource: false
      connection_config: *connection_config
      ovf_name: {get_input: ovf_name} #this would be the VM name after the deployment.
      ovf_source: {get_input: ovf_source} #source can be URL/Local Ovf file on the manager.
      datastore_name: {get_input: datastore_name}
      disk_provisioning: thin
      network_mappings:
        - key: VM Network
          value: vlan-1710 # network-name on vSphere environment
      cpus: { get_input: cpus }
      memory: { get_input: memory }
      disk_size: 100 # this is the size of disk in GB
      cdrom_image: { get_attribute: [ cloud_init_image, storage_image ] } # this would be the path to cloud_init_image inside the datastore.

{{< /highlight >}}


## Example 3

This example will create a service on vSphere environment and attach usb, serial-port and PCI-Passthrough.

{{< highlight  yaml  >}}
node_templates:
  vm:
    type: cloudify.nodes.vsphere.Server
    properties:
      use_external_resource: false
      connection_config: *connection_config
      agent_config:
        install_method: none
      wait_ip: true
      server:
        name: { get_input: vm_name }
        clone_vm: { get_input: clone_vm }
        cpus: { get_input: cpus }
        memory: { get_input: memory }
      networking:
        connect_networks:
          - name: { get_input: external_network }
            switch_distributed: { get_input: external_network_distributed }
            management: false
            use_dhcp: true

  usb_device:
    type: cloudify.nodes.vsphere.USBDevice
    properties:
      connection_config: *connection_config
      device_name: 'Emtec USB DISK 3.0'
    relationships:
      - target: vm
        type: cloudify.relationships.vsphere.usb_connected_to_server

  serial_port:
    type: cloudify.nodes.vsphere.SerialPort
    properties:
      connection_config: *connection_config
      turn_off_vm: true
      device_name: '/dev/char/serial/uart0'
    relationships:
      - target: usb_device
        type: cloudify.relationships.depends_on
      - target: vm
        type: cloudify.relationships.vsphere.serial_connected_to_server

  pci_device:
    type: cloudify.nodes.vsphere.PCIDevice
    properties:
      connection_config: *connection_config
      turn_off_vm: true
      device_name: 'NetXtreme BCM5720 Gigabit Ethernet'
    relationships:
      - target: serial_port
        type: cloudify.relationships.depends_on
      - target: vm
        type: cloudify.relationships.vsphere.pci_connected_to_server

{{< /highlight >}}
