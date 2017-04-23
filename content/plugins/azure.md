---
layout: bt_wiki
title: Azure Plugin
category: Plugins
draft: false
weight: 100
---
{{% gsSummary %}} {{% /gsSummary %}}

The Azure plugin enables you to use Cloudify to manage cloud resources on Azure. See below for currently supported resource types.

This documentation covers the superficial usage via node types. For more information on the Python code see the [Python documentation](https://github.com/01000101/cloudify-azure-plugin/tree/rebuild/docs). These can be generated using [Sphinx](http://www.sphinx-doc.org/en/stable/tutorial.html).

# Plugin Requirements

* Python Versions 2.7.x.
* Azure account


# Compatibility

The Azure plugin is tested against these Azure API Versions:

RESOURCES = '2016-02-01'<br>
STORAGE = '2015-06-15'<br>
NETWORK = '2016-03-30'<br>
COMPUTE = '2016-03-30'


# Types

The following are [node type]({{< relref "blueprints/spec-node-types.md" >}}) definitions. Nodes describe resources in your cloud infrastructure. For more information, see [node types]({{< relref "blueprints/spec-node-types.md" >}}).

### Common Properties

All cloud resource nodes have common properties:

  * `name`
  * `location`
  * `tags`
  * `retry_after` Because Azure's API is asynchronous, the value indicates the interval between retries.

**Properties**

Each time that you manage a resource with Cloudify, one or more clients are created by Cloudify through the Azure API. You specify the configuration for these clients using the `azure_config` property. It should be a dictionary, with the following values:

**Your Azure API access credentials**

  * `subscription_id`
  * `tenant_id`
  * `client_id`
  * `client_secret`

See the `cloudify.datatypes.azure.Config` data type definition in the plugin's plugin.yaml.

## cloudify.azure.nodes.ResourceGroup

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding resource parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  resourcegroup:
    type: cloudify.azure.nodes.ResourceGroup
    properties:
      name: {concat:[ { get_input: resource_prefix }, rg ] }
      location: { get_input: location }
      azure_config:
        subscription_id: { get_input: subscription_id }
        tenant_id: { get_input: tenant_id }
        client_id: { get_input: client_id }
        client_secret: { get_input: client_secret }

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a resource group.
  * `cloudify.interfaces.lifecycle.delete` Deletes a resource group.


## cloudify.azure.nodes.storage.StorageAccount

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config` S dictionary with the following key:
    * `accountType` A storage account type.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding storage parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  storageaccount:
    type: cloudify.azure.nodes.storage.StorageAccount
    properties:
      name: mysa01
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      resource_config:
        accountType: Standard_LRS
      azure_config: *azure_config

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a storage account.
  * `cloudify.interfaces.lifecycle.delete` Deletes a storage account.


## cloudify.azure.nodes.network.VirtualNetwork

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config` A dictionary with the following keys:
    * `addressSpace`:
      * `addressPrefixes` A list of address prefixes.
    * `dhcpOptions` A list of DHCP options.
    * `subnets` A list of subnets.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding virtual network parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  virtual_network:
    type: cloudify.azure.nodes.network.VirtualNetwork
    properties:
      name: myvnet01
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a network.
  * `cloudify.interfaces.lifecycle.delete` Deletes a network.


## cloudify.azure.nodes.network.Subnet

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `virtual_network_name` The name of the network in which the subnet is to be created.
  * `resource_config` A dictionary with the following keys:
    * `addressPrefix` The address prefix to use.
    * `networkSecurityGroup` The name of a security group to attach, if one exists.
    * `routeTable` The name of a route table to use, if one exists.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding subnet parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  subnet:
    type: cloudify.azure.nodes.network.Subnet
    properties:
      name: mysubnet
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      resource_config:
        addressPrefix: { get_input: subnet_private_cidr }

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a subnet.
  * `cloudify.interfaces.lifecycle.delete` Deletes a subnet.


## cloudify.azure.nodes.network.NetworkSecurityGroup

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config` A dictionary with the following key:
    * `securityRules` An optional list of rules.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding security group parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  networksecuritygroup:
    type: cloudify.azure.nodes.network.NetworkSecurityGroup
    properties:
      name: mynsg
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      resource_config:
        securityRules:
        - name: nsr_ssh
          properties:
            description: SSH access
            protocol: Tcp
            sourcePortRange: '*'
            destinationPortRange: 22
            sourceAddressPrefix: '*'
            destinationAddressPrefix: '*'
            priority: 100
            access: Allow
            direction: Inbound

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a network security group.
  * `cloudify.interfaces.lifecycle.delete` Deletes a network security group.


## cloudify.azure.nodes.network.NetworkSecurityRule

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `network_security_group_name` The name of the security group in which to create the resource.
  * `resource_config` A dictionary with the following keys:
      * `description` A string to describe the rule.
      * `protocol` Either TCP or UDP.
      * `sourcePortRange` An integer between 1 and 65535.
      * `destinationPortRange` An integer between 1 and 65535 that is greater than `sourcePortRange`.
      * `sourceAddressPrefix` The source address prefix of the network, subnet, or IP.
      * `destinationAddressPrefix` The destination address prefix of the network, subnet, or NIC.
      * `access` Either `Allow` or `Deny`.
      * `priority` A unique number.
      * `direction` Either `Inbound` or `Outbound`.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding security group rule parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  network_security_rule:
    type: cloudify.azure.nodes.network.NetworkSecurityRule
    properties:
      name: mocknsr
      location: eastus
      azure_config: *azure_config
      network_security_group_name: mocknsg
      resource_config:
        description: RDP access
        protocol: Tcp
        sourcePortRange: '*'
        destinationPortRange: 3389
        sourceAddressPrefix: '*'
        destinationAddressPrefix: '*'
        priority: 100
        access: Allow
        direction: Inbound

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a network security group rule.
  * `cloudify.interfaces.lifecycle.delete` Deletes a network security group rule.


## cloudify.azure.nodes.network.RouteTable

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `network_security_group_name` The name of the security group in which to create the resource.
  * `resource_config` A dictionary with the following key:
      * `routes` An optional list of routes.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding route table parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  routetable:
    type: cloudify.azure.nodes.network.RouteTable
    properties:
      name: myrt
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a route table.
  * `cloudify.interfaces.lifecycle.delete` Deletes a route table.


## cloudify.azure.nodes.network.Route

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `route_table_name` The name of the route table tin which to create the rule.
  * `resource_config` A dictionary with the following keys:
      * `addressPrefix`The destination CIDR to which to route the app
      * `nextHopType` The type of Azure hop to which the packet is to be be sent.
      * `nextHopIpAddress` An optional IP address to which packets are to be forwarded.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding route rule parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  internetroute:
    type: cloudify.azure.nodes.network.Route
    properties:
      name: myir
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      resource_config:
        addressPrefix: 0.0.0.0/0
        nextHopType: Internet

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the route rule.
  * `cloudify.interfaces.lifecycle.delete` Deletes the route rule.


## cloudify.azure.nodes.network.IPConfiguration

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config` A dictionary with the following key:
      * `privateIPAddress`Static, private IP address
      * `privateIPAllocationMethod` Defines how a private IP address is assigned. Options are `Static` or `Dynamic`.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding route IP configuration parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  ubuntuipconfig:
    type: cloudify.azure.nodes.network.IPConfiguration
    properties:
      name: myuic
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      resource_config:
        privateIPAllocationMethod: Dynamic

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the route IP configuration.
  * `cloudify.interfaces.lifecycle.delete` Deletes the route IP configuration.


## cloudify.azure.nodes.network.PublicIPAddress

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config` A dictionary with the following keys:
      * `publicIPAllocationMethod` `Static` or `Dynamic`.
      * `idleTimeoutInMinutes` The timeout (in minutes) for the TCP idle connection.
      * `domainNameLabel` The concatenation of the domain name label and the regionalized DNS zone, resulting in the fully qualified domain name associated with the public IP address.
      * `reverseFqdn` A fully qualified domain name that resolves to this public IP address.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding public IP address parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  ubuntuipconfig:
    type: cloudify.azure.nodes.network.IPConfiguration
    properties:
      name: myuic
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      resource_config:
        privateIPAllocationMethod: Dynamic

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the public IP address.
  * `cloudify.interfaces.lifecycle.delete` Deletes the public IP address.


## cloudify.azure.nodes.compute.AvailabilitySet

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config` A dictionarey with the following keys:
      * `platformUpdateDomainCount` Specifies the number of update domains that are used.
      * `platformFaultDomainCount` Specifies the number of fault domains that are used.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding availability set parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  availabilityset:
    type: cloudify.azure.nodes.compute.AvailabilitySet
    properties:
      name: myac
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the availability set.
  * `cloudify.interfaces.lifecycle.delete` Deletes the availability set.


## cloudify.azure.nodes.compute.VirtualMachine

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `use_public_ip` Triggers the deployment to use the public IP (if available) of the resource for Cloudify Agent connections.
  * `resource_config` See: [https://msdn.microsoft.com/en-us/library/azure/mt163591.aspx](https://msdn.microsoft.com/en-us/library/azure/mt163591.aspx).
    * `hardwareProfile`
    * `storageProfile`
    * `osProfile`
  * `ip` Property specifying the IP address of the resource to use for the agent installer.
  * `os_family` Property specifying the type of operating system family. 

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding VM parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  host:
    type: cloudify.azure.nodes.compute.VirtualMachine
    properties:
      name: myhost
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      os_family: { get_input: os_family_linux }
      use_public_ip: false
      resource_config:
        hardwareProfile:
          vmSize: { get_input: standard_a2_size }
        storageProfile:
          imageReference:
            publisher: { get_input: image_publisher_centos_final }
            offer: { get_input: image_offer_centos_final }
            sku: { get_input: image_sku_centos_final }
            version: { get_input: image_version_centos_final }
        osProfile:
          computerName: { get_property: [SELF, name] }
          adminUsername: { get_input: username_centos_final }
          adminPassword: { get_input: password }
          linuxConfiguration:
            ssh:
              publicKeys:
                - path: { get_input: authorized_keys_centos }
                  keyData: { get_input: keydata }
            disablePasswordAuthentication: { get_input: public_key_auth_only }

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the VM.
  * `cloudify.interfaces.lifecycle.configure` Configures the VM.
    * `commands_to_execute` Input. The command that the `CustomScriptExtension` extension executes.
    * `file_uris` The SAS URL from which to download the script.
  * `cloudify.interfaces.lifecycle.delete` Deletes the VM.


## cloudify.azure.nodes.compute.VirtualMachineExtension

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `virtual_machine_name` The VM to use.
  * `resource_config`:
    * `publisher` Extensions publisher.
    * `ext_type` Type.
    * `typeHandlerVersion` Type handler version.
    * `settings` Accepts the file_uri and commands to execute objects.
See the [Common Properties](#common-properties) section.

**Example**

This example shows adding VM extension parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  webserver:
    type: cloudify.azure.nodes.compute.VirtualMachineExtension
    properties:
      name: vm1_webserver
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      resource_config:
        publisher: Microsoft.Powershell
        ext_type: DSC
        typeHandlerVersion: '2.8'
        settings:
          ModulesUrl: https://www.example.com/modules.zip
          ConfigurationFunction: windows-iis-webapp.ps1\CloudifyExample
          Properties:
            MachineName: { get_property: [vm1, name] }
            WebServerPort: { get_input: webserver_port }

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the VM extension.
  * `cloudify.interfaces.lifecycle.delete` Deletes the VM extension.


## cloudify.azure.nodes.network.LoadBalancer

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config`:
    * `frontendIPConfigurations` A Load balancer that can include one or more front-end IP addresses, (virtual IPs).
    * `backendAddressPools` The IP addresses associated with the virtual machine NIC.
    * `loadBalancingRules` A rule property that maps a specific front-end IP and port combination to a set of back-end IP addresses and port combination.
    * `inboundNatRules` NAT rules that define the inbound traffic flowing through the front-end IP and distributed to the back end IP.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding load balancer parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  loadbalancer:
    type: cloudify.azure.nodes.network.LoadBalancer
    properties:
      name: mylb
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
    relationships:
    - type: cloudify.azure.relationships.contained_in_resource_group
      target: resourcegroup
    - type: cloudify.azure.relationships.connected_to_ip_configuration
      target: loadbalanceripcfg

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a load balancer.
  * `cloudify.interfaces.lifecycle.delete` Deletes a load balancer.


## cloudify.azure.nodes.network.LoadBalancer.BackendAddressPool

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource
  * `load_balancer_name` The name of the load balancer within which to create the pool.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding load balancer pool parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  loadbalancerbackendpool:
    type: cloudify.azure.nodes.network.LoadBalancer.BackendAddressPool
    properties:
      name: mylb
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
    relationships:
      - type: cloudify.azure.relationships.contained_in_load_balancer
        target: loadbalancer

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a load balancer pool.
  * `cloudify.interfaces.lifecycle.delete` Deletes a load balancer pool.


## cloudify.azure.nodes.network.LoadBalancer.Probe

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `load_balancer_name` The name of the load balancer within which to create the pool.
  * `resource_config`
    * `protocol` IP Protocol.
    * `port` Port.
    * `requestPath` Request URI.
    * `intervalInSeconds` Interval between probes.
    * `numberofProbes` Number of probes.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding load balancer probe parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  loadbalancerprobe:
    type: cloudify.azure.nodes.network.LoadBalancer.Probe
    properties:
      name: lbprobe
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      resource_config:
        protocol: Http
        port: { get_input: webserver_port }
        requestPath: index.html
    relationships:
    - type: cloudify.azure.relationships.contained_in_load_balancer
      target: loadbalancer
    - type: cloudify.relationships.depends_on
      target: loadbalancerbackendpool

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a load balancer probe.
  * `cloudify.interfaces.lifecycle.delete` Deletes a load balancer probe.


## cloudify.azure.nodes.network.LoadBalancer.IncomingNATRule

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `load_balancer_name` The name of the load balancer within which to create the pool.
  * `resource_config`
    * `protocol` IP protocol.
    * `frontendPort` Inbound port.
    * `backendPort` Outbound port.

See the [Common Properties](#common-properties) section.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a NAT Rule.
  * `cloudify.interfaces.lifecycle.delete` Deletes a NAT Rule.


## cloudify.azure.nodes.network.LoadBalancer.Rule

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `load_balancer_name` The name of the load balancer within which to create the pool.
  * `resource_config`
    * `protocol` IP port.
    * `frontendPort` Inbound port.
    * `backendPort` Outbound port.
    * `enableFloatingIP` Enables a floating IP address.
    * `idleTimeoutInMinutes` How long to wait before a timeout.
    * `loadDistribution` The size of the load to distribute.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding load balancer rule parameters, and explicitly defining the azure_config.

{{< gsHighlight  yaml  >}}

  loadbalancerrule:
    type: cloudify.azure.nodes.network.LoadBalancer.Rule
    properties:
      name: mylbrule
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      resource_config:
        protocol: Tcp
        backendPort: { get_input: webserver_port }
        frontendPort: { get_input: loadbalancer_port }
    relationships:
    - type: cloudify.azure.relationships.contained_in_load_balancer
      target: loadbalancer
    - type: cloudify.azure.relationships.connected_to_ip_configuration
      target: loadbalanceripcfg
    - type: cloudify.azure.relationships.connected_to_lb_be_pool
      target: loadbalancerbackendpool
    - type: cloudify.azure.relationships.connected_to_lb_probe
      target: loadbalancerprobe

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a load balancer rule.
  * `cloudify.interfaces.lifecycle.delete` Deletes a load balancer rule.


# Relationships

See [relationships]({{< relref "blueprints/spec-relationships.md" >}}).

The following plugin relationship operations are defined in the Azure plugin:

 * `cloudify.azure.relationships.contained_in_resource_group` Sets a dependency between the resource and the resource group in which it is contained.
 * `cloudify.azure.relationships.contained_in_virtual_network` Sets a dependency between the resource and the virtual network in which it is contained.
 * `cloudify.azure.relationships.contained_in_network_security_group` Sets a dependency between the resource and the network security group in which it is contained.
 * `cloudify.azure.relationships.contained_in_route_table` Sets a dependency between the resource and the route table in which it is contained.
 * `cloudify.azure.relationships.contained_in_load_balancer` Sets a dependency between the resource and the load balancer.
 * `cloudify.azure.relationships.network_security_group_attached_to_subnet` Attaches a network security group to a subnet.
 * `cloudify.azure.relationships.route_table_attached_to_subnet` Attaches a network route table to a subnet.
 * `cloudify.azure.relationships.nic_connected_to_network_security_group` Attaches a NIC to a network security group.
 * `cloudify.azure.relationships.ip_configuration_connected_to_subnet` Sets a dependency between an IP configuration and a subnet.
 * `cloudify.azure.relationships.ip_configuration_connected_to_public_ip` Sets a dependency between an IP configuration and a public IP.
 * `cloudify.azure.relationships.connected_to_storage_account` Sets a dependency between the resource and a storage account.
 * `cloudify.azure.relationships.connected_to_availability_set` Sets a dependency between the resource and an availability set.
 * `cloudify.azure.relationships.connected_to_ip_configuration` Sets a dependency between the resource and an IP configuration.
 * `cloudify.azure.relationships.connected_to_nic` Sets a dependency between the resource and a NIC.
 * `cloudify.azure.relationships.connected_to_lb_be_pool` Sets a dependency between the resource and a load balancer pool.
 * `cloudify.azure.relationships.connected_to_lb_probe` Sets a dependency between the resource and a load balancer probe.
 * `cloudify.azure.relationships.vmx_contained_in_vm` Sets a dependency between a VM extension and a VM.
 * `cloudify.azure.relationships.nic_connected_to_lb_be_pool` Sets a dependency between a NIC and a load balancer pool.

# Types Common Behaviors

# Using Existing Resources

You can use existing resources on Azure, regardless of whether they have been created by a different Cloudify deployment or outside of Cloudify.

All Cloudify Azure types have a property named `use_external_resource`, for which the default value is `false`. When set to `true`, the plugin applies different semantics for each of the operations executed on the relevant node's instances:

If `use_external_resource` is set to `true` in the blueprint, the `name` must be that resource's name in Azure.

This behavior is common to all resource types:

 * `create` If `use_external_resource` is `true,` the plugin checks if the resource is available in your account.
 * `delete` If `use_external_resource` is `true`, the plugin checks if the resource is available in your account.
