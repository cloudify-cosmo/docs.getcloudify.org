---

title: Azure Plugin


weight: 100
---
{{% gsSummary %}} {{% /gsSummary %}}

The Azure plugin allows users to use Cloudify to manage cloud resources on Azure. See below for currently supported resource types.

This documentation covers the superficial usage via node types. For more information on the python code see the [python docs](https://github.com/01000101/cloudify-azure-plugin/tree/rebuild/docs). These can be generated using [Sphinx](http://www.sphinx-doc.org/en/stable/tutorial.html).

# Plugin Requirements

* Python Versions 2.7.x.
* Azure account


# Compatibility

The Azure plugin is tested against these Azure API Versions:

RESOURCES = '2016-02-01'
STORAGE = '2015-06-15'
NETWORK = '2016-03-30'
COMPUTE = '2016-03-30'


# Types

The following are [node type]({{< relref "blueprints/spec-node-types.md" >}}) definitions. Nodes describe resources in your cloud infrastructure. For more information, see [node type]({{< relref "blueprints/spec-node-types.md" >}}).

### Common Properties

All cloud resource nodes have common properties:

  * `name`
  * `location`
  * `tags`
  * `retry_after` Because Azure's API is asynchronous, this value indicates the interval between retries.

**Properties**

Every time you manage a resource with Cloudify, we create one or more clients with Azure API. You specify the configuration for these clients using the `azure_config` property. It should be a dictionary, with the following values:

**Your Azure API access credentials**

  * `subscription_id`
  * `tenant_id`
  * `client_id`
  * `client_secret`

See the `cloudify.datatypes.azure.Config` data type definition in the plugin's plugin.yaml.

## cloudify.azure.nodes.ResourceGroup

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the resource group.
  * `cloudify.interfaces.lifecycle.delete` deletes the resource group.


## cloudify.azure.nodes.storage.StorageAccount

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `resource_config` a dict with the following key:
    * `accountType` a storage account type.

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the storage account.
  * `cloudify.interfaces.lifecycle.delete` deletes the storage account.


## cloudify.azure.nodes.network.VirtualNetwork

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `resource_config` a dict with the following keys:
    * `addressSpace`:
      * `addressPrefixes`: a list of address prefixes
    * `dhcpOptions`: list of dhcp options
    * `subnets`: list of subnets

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the network.
  * `cloudify.interfaces.lifecycle.delete` deletes the network.


## cloudify.azure.nodes.network.Subnet

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `virtual_network_name` The name of the network in which you wish to create this subnet.
  * `resource_config` a dict with the following keys:
    * `addressPrefix` An address prefix to use
    * `networkSecurityGroup` The name of a security group you want to attach if one exists
    * `routeTable` The name of a route table to use if one exists.

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the subnet.
  * `cloudify.interfaces.lifecycle.delete` deletes the subnet.


## cloudify.azure.nodes.network.NetworkSecurityGroup

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `resource_config` a dict with the following key:
    * `securityRules` an optional list of rules

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the network security group.
  * `cloudify.interfaces.lifecycle.delete` deletes the network security group.


## cloudify.azure.nodes.network.NetworkSecurityRule

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `network_security_group_name` The name of the security group that you want to create this resource in.
  * `resource_config` a dict with the following keys:
      * `description` Some string to desribe the rule.
      * `protocol` Either Tcp or Udp
      * `sourcePortRange` Any integer from 1 to 65535.
      * `destinationPortRange` Any integer from 1 to 65535 (should be greater than sourcePortRange).
      * `sourceAddressPrefix` The source address prefix of the network, subnet, or IP.
      * `destinationAddressPrefix` The destination address prefix of the network, subnet, or NIC.
      * `access` Allow or Deny
      * `priority` Unique Number
      * `direction` Inbound or Outbound

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the network security group rule.
  * `cloudify.interfaces.lifecycle.delete` deletes the network security group rule.


## cloudify.azure.nodes.network.RouteTable

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `network_security_group_name` The name of the security group that you want to create this resource in.
  * `resource_config` a dict with the following key:
      * `routes` an optional list of routes

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the route table.
  * `cloudify.interfaces.lifecycle.delete` deletes the route table.


## cloudify.azure.nodes.network.Route

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `route_table_name` The name of the route table that you want to create this rule in.
  * `resource_config` a dict with the following keys:
      * `addressPrefix`The destination CIDR to which the route app
      * `nextHopType` The type of Azure hop the packet should be sent to
      * `nextHopIpAddress` Optional the IP address packets should be forwarded to

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the route rule.
  * `cloudify.interfaces.lifecycle.delete` deletes the route rule.


## cloudify.azure.nodes.network.IPConfiguration

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `resource_config` a dict with the following key:
      * `privateIPAddress`Static, private IP Address
      * `privateIPAllocationMethod` Defines how a private IP address is assigned. Options are 'Static' or 'Dynamic'.

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the route ip config.
  * `cloudify.interfaces.lifecycle.delete` deletes the route ip config.


## cloudify.azure.nodes.network.PublicIPAddress

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `resource_config` a dict with the following keys:
      * `publicIPAllocationMethod` Static or Dynamic
      * `idleTimeoutInMinutes` Specifies the timeout (in minutes) for the TCP idle connection.
      * `domainNameLabel` The concatenation of the domain name label and the regionalized DNS zone make up the fully qualified domain name associated with the public IP address.
      * `reverseFqdn` A fully qualified domain name that resolves to this public IP address.

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the public ip address.
  * `cloudify.interfaces.lifecycle.delete` deletes the public ip address.


## cloudify.azure.nodes.compute.AvailabilitySet

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `resource_config` a dict with the following keys:
      * `platformUpdateDomainCount` Specifies the number of update domains that are used
      * `platformFaultDomainCount` Specifies the number of fault domains that are used

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the Availability Set.
  * `cloudify.interfaces.lifecycle.delete` deletes the Availability Set.


## cloudify.azure.nodes.compute.VirtualMachine

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `use_public_ip` Tells the deployment to use the public IP (if available) of the resource for Cloudify Agent connections.
  * `resource_config` See: https://msdn.microsoft.com/en-us/library/azure/mt163591.aspx.
    * `hardwareProfile`
    * `storageProfile`
    * `osProfile`
  * `ip` Property specifying the IP address of the resource to use for the agent installer.
  * `os_family` Property specifying what type of operating system family Property specifying what type of operating system family

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the VM.
  * `cloudify.interfaces.lifecycle.configure` configures the VM.
    * `commands_to_execute` Input. This is the command that the CustomScriptExtension extension will execute.
    * `file_uris` The SAS URL to download the script from.
  * `cloudify.interfaces.lifecycle.delete` deletes the VM.


## cloudify.azure.nodes.compute.VirtualMachineExtension

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `virtual_machine_name` The VM that should be used.
  * `resource_config`:
    * `publisher` Extensions publisher
    * `ext_type` Type
    * `typeHandlerVersion` Type Handler Version
    * `settings` Settings accepts the file_uri and commands to execute objects.
(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the VM Extension.
  * `cloudify.interfaces.lifecycle.delete` deletes the VM Extension.


## cloudify.azure.nodes.network.LoadBalancer

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `resource_config`:
    * `frontendIPConfigurations` a Load balancer can include one or more front end IP addresses, otherwise known as a virtual IPs.
    * `backendAddressPools` these are IP addresses associated with the virtual machine Network Interface Card
    * `loadBalancingRules` a rule property maps a given front end IP and port combination to a set of back end IP addresses and port combination.
    * `inboundNatRules` NAT rules defining the inbound traffic flowing through the front end IP and distributed to the back end IP.

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the LB.
  * `cloudify.interfaces.lifecycle.delete` deletes the LB.


## cloudify.azure.nodes.network.LoadBalancer.BackendAddressPool

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `load_balancer_name` The name of the load balancer to create this pool inside.

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the LB pool.
  * `cloudify.interfaces.lifecycle.delete` deletes the LB pool.


## cloudify.azure.nodes.network.LoadBalancer.Probe

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `load_balancer_name` The name of the load balancer to create this pool inside.
  * `resource_config`
    * `protocol` IP Protocol
    * `port` Port
    * `requestPath` Request URI
    * `intervalInSeconds` Interval between probes
    * `numberofProbes` How many proves

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the LB probe.
  * `cloudify.interfaces.lifecycle.delete` deletes the LB probe.


## cloudify.azure.nodes.network.LoadBalancer.IncomingNATRule

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `load_balancer_name` The name of the load balancer to create this pool inside.
  * `resource_config`
    * `protocol` IP protocol
    * `frontendPort` Inbound port
    * `backendPort` Outbound port

(See #common-properties)

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` creates the NAT Rule.
  * `cloudify.interfaces.lifecycle.delete` deletes the NAT Rule.


## cloudify.azure.nodes.network.LoadBalancer.Rule

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which you wish to create this resource.
  * `load_balancer_name` The name of the load balancer to create this pool inside.
  * `resource_config`
    * `protocol` IP Port
    * `frontendPort` Inbound port
    * `backendPort` Outbound port
    * `enableFloatingIP` Allow floating IP
    * `idleTimeoutInMinutes` How long to wait
    * `loadDistribution` size of load to distribute

(See #common-properties)

**Example**

This example shows adding additional parameters, and explicitly defining the azure_config.

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

  * `cloudify.interfaces.lifecycle.create` creates the LB rule.
  * `cloudify.interfaces.lifecycle.delete` deletes the LB rule.


# Relationships

See [relationships]({{< relref "blueprints/spec-relationships.md" >}}).

The following plugin relationship operations are defined in the Azure plugin:

 * `cloudify.azure.relationships.contained_in_resource_group` Sets a dependency between the resource and the resource group that contains it.
 * `cloudify.azure.relationships.contained_in_virtual_network` Sets a dependency between the resource and the virtual network that contains it.
 * `cloudify.azure.relationships.contained_in_network_security_group` Sets a dependency between the resource and the network security group that contains it.
 * `cloudify.azure.relationships.contained_in_route_table` Sets a dependency between the resource and the route table that contains it.
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
 * `cloudify.azure.relationships.connected_to_lb_be_pool` Sets a dependency between the resource and a LB pool.
 * `cloudify.azure.relationships.connected_to_lb_probe` Sets a dependency between the resource and a LB probe.
 * `cloudify.azure.relationships.vmx_contained_in_vm` Sets a dependency between a VM extension and a VM.
 * `cloudify.azure.relationships.nic_connected_to_lb_be_pool` Sets a dependency between a NIC and a LB pool.

# Types Common Behaviors

# Using Existing Resources

It is possible to use existing resources on Azure - whether these have been created by a different Cloudify deployment or not via Cloudify at all.

All Cloudify Azure types have a property named `use_external_resource`, whose default value is `false`. When set to `true`, the plugin will apply different semantics for each of the operations executed on the relevant node's instances:

If `use_external_resource` is set to true in the blueprint, the `name` must be that resource's name in Azure.

This behavior is common to all resource types:

 * `create` If `use_external_resource` is true, the plugin will check if the resource is available in your account.
 * `delete` If `use_external_resource` is true, the plugin will check if the resource is available in your account.
