---
title: Azure Plugin
category: Official Plugins
description: The Azure plugin enables you to manage cloud resources on Azure
draft: false
weight: 110
aliases:
  - /plugins/azure/
  - /developer/official_plugins/azure/
---

The Azure plugin enables you to use {{< param product_name >}} to manage cloud resources on Azure. See below for currently supported resource types.


## Plugin Requirements

* Python Versions 2.7.x.
* Azure account.


## Compatibility

The Azure plugin has two methods for interacting with Azure services: legacy and SDK based.

The legacy library is tested against these Azure API Versions:

RESOURCES = '2017-05-10'<br>
STORAGE = '2015-06-15'<br>
NETWORK = '2016-03-30'<br>
COMPUTE = '2016-03-30'

The SDK-based method is dependent on the SDK library versions. (See the setup.py for current versions.) Currently only ARM resource template node templates use this method.


## Authentication

Each Azure resource node template must include a property `azure_config` for authentication. This consists of a `tenant_id`, `client_id`, `client_secret` or `client_assertion`, and `subscription_id`. These can be provided via secrets for better security coverage.

Plugin `1.8.0` introduced support for certificate-based authentication. Provide `subscription_id`, `tenant_id`, `client_id` and `client_assertion`. For more information see overview of [client_assertion authentication](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols-oauth-client-creds#second-case-access-token-request-with-a-certificate) and [how to create an AD client certificate](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-certificate-credentials).

Authentication with Azure services requires a Service Principal. See [this documentation](https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest) from Microsoft on creating a Service Principal.

  - `client_id` is the Service Principal `appId`.
  - `client_secret` is the Service Principal `password`.
  - `tenant_id` is the Service Principal `tenant`.


### Providing Credentials as Secrets

 It is recommended that you store your credentials as [secrets]({{< relref "working_with/manager/using-secrets.md" >}}). You can do this using the [CLI]({{< relref "cli/orch_cli/secrets.md" >}}).
 Secrets can then be accessed inside your blueprints, as follows:

 {{< highlight  yaml  >}}
 resource_group:
    type: cloudify.azure.nodes.ResourceGroup
    properties:
      name: my_resource_group
      location: { get_secret: location }
      azure_config:
        subscription_id: { get_secret: subscription_id }
        tenant_id: { get_secret: tenant_id }
        client_id: { get_secret: client_id }
        client_secret: { get_secret: client_secret }
 {{< /highlight >}}   


### Azure Stack

{{< param product_name >}} Azure Plugin version 1.6.0 introduced support for Azure Stack.

To configure your client, add the appropriate values for your endpoint keys, such as `endpoint_resource`, `endpoints_resource_manager`, `endpoint_verify`, and `endpoints_active_directory`.

Make sure to specify the appropriate `api_version` of the Azure resource that is currently supported in your Azure stack.

Example:

 {{< highlight  yaml  >}}
 resource_group:
    type: cloudify.azure.nodes.ResourceGroup
    properties:
      api_version: 2017-05-10
      name: my_resource_group
      location: { get_secret: location }
      azure_config:
        subscription_id: { get_secret: subscription_id }
        tenant_id: { get_secret: tenant_id }
        client_id: { get_secret: client_id }
        client_secret: { get_secret: client_secret }
        endpoint_resource: https://management.core.windows.net/
        endpoints_resource_manager: https://management.azure.com
        endpoint_verify: True
        endpoints_active_directory: https://login.microsoftonline.com
 {{< /highlight >}}   


## Types

The following are [node type]({{< relref "developer/blueprints/spec-node-types.md" >}}) definitions. Nodes describe resources in your cloud infrastructure. For more information, see [node types]({{< relref "developer/blueprints/spec-node-types.md" >}}).

### Common Properties

All cloud resource nodes have common properties:

  * `name`
  * `location`
  * `tags`
  * `retry_after` Because Azure's API is asynchronous, the value indicates the interval between retries.

**Properties**

Each time that you manage a resource with {{< param product_name >}}, one or more clients are created by {{< param product_name >}} through the Azure API. You specify the configuration for these clients using the `azure_config` property. It should be a dictionary, with the following values:

**Your Azure API access credentials**

  * `subscription_id`
  * `tenant_id`
  * `client_id`
  * `client_secret`

See the `cloudify.datatypes.azure.Config` data type definition in the plugin's plugin.yaml.

### cloudify.nodes.azure.CustomTypes

Manage Azure resources that do not have a plugin implementation.

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

See the [Common Properties](#common-properties) section.

  * `resource_config` A dictionary with the following keys:
    * `custom_resource_module`: The path to a Python module from which you wish to import an Azure client.
    * `custom_resource_class_name`: The name of the Azure client, which is at the custom_resource_module import location.
    * `custom_resource_object_name`: The name of the resource managed from `custom_resource_class_name`.
    * `create_fn_name`: The name of the function used for creating the resource on the `custom_resource_object_name`.
    * `update_fn_name`: The name of the function used for updating the resource on the `custom_resource_object_name`.
    * `delete_fn_name`: The name of the function used for deleting the resource on the `custom_resource_object_name`.
    * `get_fn_name`: The name of the function used for getting the resource on the `custom_resource_object_name`.
    * `get_params`: The parameters used for getting the resource via get_fn_name.
  * `operation_config` The path to a blueprint resource containing an Azure Resource Template.
    * `create`: The parameters to send to create_fn_name.
    * `update`: The parameters to send to update_fn_name.
    * `delete`: The parameters to send to delete_fn_name.

**Runtime Properties:**

  * `resource` The result of get/create Azure deployment operation.
  * `create_result` The result of the create_fn_name.
  * `__RESOURCE_CREATED` If the resource has been created or not.
  * `update_result` The result of update_fn_name.
  * `__RESOURCE_DELETED` If the resource has been deleted or not.
  * `delete_result` The result of the delete_fn_name.

**Example**

This example shows a very basic usage for creating a resource group.

{{< highlight  yaml  >}}
  resource_group:
    type: cloudify.nodes.azure.CustomTypes
    properties:
      api_version: '2017-05-10'
      location: eastus
      client_config: *azure_config
      resource_config:
        custom_resource_module: azure.mgmt.resource
        custom_resource_class_name: ResourceManagementClient
        custom_resource_object_name: resource_groups
        create_fn_name: create_or_update
        update_fn_name: create_or_update
        delete_fn_name: delete
        get_params: &resource_group_params
          resource_group_name:  mynewresourcegroup
      operation_config:
        create:
          <<: *resource_group_params
          parameters:
            location: { get_property: [ SELF, location ] }
        delete: *resource_group_params
{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the resource.
  * `cloudify.interfaces.lifecycle.start` Updates the resource.
  * `cloudify.interfaces.lifecycle.delete` Deletes the resource.

### cloudify.azure.Deployment

Deploy an Azure ARM Template.

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

See the [Common Properties](#common-properties) section.

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `template_file` The path to a blueprint resource containing an Azure Resource Template.
  * `template` The content of an Azure Resource Template.
  * `params` Parameters to provide to the Azure Resource Template.

**Runtime Properties:**

  * `resource_id` The id of the Azure deployment.
  * `resource` The result of get/create Azure deployment operation.
  * `template` Content of the template that the Azure deployment was created with.
  * `outputs` Azure deployment outputs.
  * `state` The state of the Azure deployment. I.e, a list of resources id's created by the Azure deployment and exist in Azure.
  * `is_drifted` Boolean that indicates whether one or more of the resources created by the Azure deployment was deleted.

**Example**

This example shows adding resource parameters, and explicitly defining the azure_config.

{{< highlight  yaml  >}}

  deployment:
    type: cloudify.azure.Deployment
    properties:
      name: azure-python-deployment-sample
      location: { get_input: location }
      azure_config: *azure_config
      params:
        sshKeyData: { get_input: public_key }
        vmName: { get_input: vm_name }
        dnsLabelPrefix: { get_input: vm_dns_name }
      template_file: template.json

{{< /highlight >}}

{{< highlight  yaml  >}}

  deployment:
    type: cloudify.azure.Deployment
    properties:
      name: azure-python-deployment-sample
      location: { get_input: location }
      azure_config: *azure_config
      params:
        sshKeyData: { get_input: public_key }
        vmName: { get_input: vm_name }
        dnsLabelPrefix: { get_input: vm_dns_name }
      # The following template has been truncated.
      template: {
          "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {...},
          "variables": {...},
          "resources": [...]
      }

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a resource group.
  * `cloudify.interfaces.lifecycle.start` Pulls the state of the Azure deployment.Update `state` and `is_drifted` runtime properties.
  * `cloudify.interfaces.lifecycle.delete` Deletes a resource group.
  * `cloudify.interfaces.lifecycle.pull` Pulls the state of the Azure deployment.Update `state` and `is_drifted` runtime properties.
 

### cloudify.azure.nodes.ResourceGroup

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding resource parameters, and explicitly defining the azure_config.

{{< highlight  yaml  >}}

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

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a resource group.
  * `cloudify.interfaces.lifecycle.delete` Deletes a resource group.


### cloudify.azure.nodes.storage.StorageAccount

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config` S dictionary with the following key:
    * `accountType` A storage account type.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding storage parameters, and explicitly defining the azure_config.

{{< highlight  yaml  >}}

  storageaccount:
    type: cloudify.azure.nodes.storage.StorageAccount
    properties:
      name: mysa01
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      resource_config:
        accountType: Standard_LRS
      azure_config: *azure_config

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a storage account.
  * `cloudify.interfaces.lifecycle.delete` Deletes a storage account.


### cloudify.azure.nodes.network.VirtualNetwork

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

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

{{< highlight  yaml  >}}

  virtual_network:
    type: cloudify.azure.nodes.network.VirtualNetwork
    properties:
      name: myvnet01
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a network.
  * `cloudify.interfaces.lifecycle.delete` Deletes a network.


### cloudify.azure.nodes.network.Subnet

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

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

{{< highlight  yaml  >}}

  subnet:
    type: cloudify.azure.nodes.network.Subnet
    properties:
      name: mysubnet
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      resource_config:
        addressPrefix: { get_input: subnet_private_cidr }

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a subnet.
  * `cloudify.interfaces.lifecycle.delete` Deletes a subnet.


### cloudify.azure.nodes.network.NetworkSecurityGroup

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config` A dictionary with the following key:
    * `securityRules` An optional list of rules.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding security group parameters, and explicitly defining the azure_config.

{{< highlight  yaml  >}}

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

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a network security group.
  * `cloudify.interfaces.lifecycle.delete` Deletes a network security group.


### cloudify.azure.nodes.network.NetworkSecurityRule

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

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

{{< highlight  yaml  >}}

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

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a network security group rule.
  * `cloudify.interfaces.lifecycle.delete` Deletes a network security group rule.


### cloudify.azure.nodes.network.RouteTable

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `network_security_group_name` The name of the security group in which to create the resource.
  * `resource_config` A dictionary with the following key:
      * `routes` An optional list of routes.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding route table parameters, and explicitly defining the azure_config.

{{< highlight  yaml  >}}

  routetable:
    type: cloudify.azure.nodes.network.RouteTable
    properties:
      name: myrt
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a route table.
  * `cloudify.interfaces.lifecycle.delete` Deletes a route table.


### cloudify.azure.nodes.network.Route

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

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

{{< highlight  yaml  >}}

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

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the route rule.
  * `cloudify.interfaces.lifecycle.delete` Deletes the route rule.


### cloudify.azure.nodes.network.IPConfiguration

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config` A dictionary with the following key:
      * `privateIPAddress`Static, private IP address
      * `privateIPAllocationMethod` Defines how a private IP address is assigned. Options are `Static` or `Dynamic`.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding route IP configuration parameters, and explicitly defining the azure_config.

{{< highlight  yaml  >}}

  ubuntuipconfig:
    type: cloudify.azure.nodes.network.IPConfiguration
    properties:
      name: myuic
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      resource_config:
        privateIPAllocationMethod: Dynamic

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the route IP configuration.
  * `cloudify.interfaces.lifecycle.delete` Deletes the route IP configuration.


### cloudify.azure.nodes.network.PublicIPAddress

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

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

{{< highlight  yaml  >}}

  ubuntuipconfig:
    type: cloudify.azure.nodes.network.IPConfiguration
    properties:
      name: myuic
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config
      resource_config:
        privateIPAllocationMethod: Dynamic

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the public IP address.
  * `cloudify.interfaces.lifecycle.delete` Deletes the public IP address.


### cloudify.azure.nodes.compute.AvailabilitySet

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `resource_config` A dictionarey with the following keys:
      * `platformUpdateDomainCount` Specifies the number of update domains that are used.
      * `platformFaultDomainCount` Specifies the number of fault domains that are used.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding availability set parameters, and explicitly defining the azure_config.

{{< highlight  yaml  >}}

  availabilityset:
    type: cloudify.azure.nodes.compute.AvailabilitySet
    properties:
      name: myac
      location: { get_input: location }
      retry_after: { get_input: retry_after }
      azure_config: *azure_config

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the availability set.
  * `cloudify.interfaces.lifecycle.delete` Deletes the availability set.


### cloudify.azure.nodes.compute.VirtualMachine

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource.
  * `use_public_ip` Triggers the deployment to use the public IP (if available) of the resource for {{< param product_name >}} Agent connections.
  * `resource_config` See: [https://msdn.microsoft.com/en-us/library/azure/mt163591.aspx](https://msdn.microsoft.com/en-us/library/azure/mt163591.aspx). You can override these values via the `args` input to the create operation.
    * `hardwareProfile`
    * `storageProfile`
    * `osProfile`
  * `ip` Property specifying the IP address of the resource to use for the agent installer.
  * `os_family` Property specifying the type of operating system family.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding VM parameters, and explicitly defining the azure_config.

{{< highlight  yaml  >}}

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

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the VM. The `args` input overrides members of the `resource_config` node property.
  * `cloudify.interfaces.lifecycle.configure` Compares the user VM config inputs with the state of the VM in Azure and update the VM if needed(useful when using `use_external_resource`). 
  * `cloudify.interfaces.lifecycle.start` Configures the VM.
    * `commands_to_execute` Input. The command that the `CustomScriptExtension` extension executes.
    * `file_uris` The SAS URL from which to download the script.
  * `cloudify.interfaces.lifecycle.delete` Deletes the VM.


### cloudify.azure.nodes.compute.VirtualMachineExtension

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

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

{{< highlight  yaml  >}}

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

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the VM extension.
  * `cloudify.interfaces.lifecycle.delete` Deletes the VM extension.


### cloudify.azure.nodes.network.LoadBalancer

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

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

{{< highlight  yaml  >}}

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

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a load balancer.
  * `cloudify.interfaces.lifecycle.delete` Deletes a load balancer.


### cloudify.azure.nodes.network.LoadBalancer.BackendAddressPool

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group_name` The name of the resource group in which to create the resource
  * `load_balancer_name` The name of the load balancer within which to create the pool.

See the [Common Properties](#common-properties) section.

**Example**

This example shows adding load balancer pool parameters, and explicitly defining the azure_config.

{{< highlight  yaml  >}}

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

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a load balancer pool.
  * `cloudify.interfaces.lifecycle.delete` Deletes a load balancer pool.


### cloudify.azure.nodes.network.LoadBalancer.Probe

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

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

{{< highlight  yaml  >}}

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

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a load balancer probe.
  * `cloudify.interfaces.lifecycle.delete` Deletes a load balancer probe.


### cloudify.azure.nodes.network.LoadBalancer.IncomingNATRule

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

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


### cloudify.azure.nodes.network.LoadBalancer.Rule

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

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

{{< highlight  yaml  >}}

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

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a load balancer rule.
  * `cloudify.interfaces.lifecycle.delete` Deletes a load balancer rule.


### cloudify.azure.nodes.compute.ManagedCluster

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_group` The name of the resource group in which to create the resource.
  * `name` The name of the AKS cluster
  * `resource_config` See: [https://docs.microsoft.com/en-us/rest/api/aks/managedclusters/createorupdate](https://docs.microsoft.com/en-us/rest/api/aks/managedclusters/createorupdate) , A dictionary with the following keys :
      * `location` azure region to create the cluster.
      * `tags` A dict of key value to add to the cluster.
      * `kubernetes_version` kubernetes version to be used in the cluster setup.
      * `dns_prefix` dns prefix to be used.
      * `agent_pool_profiles` a list of agent pool profiles .
      * `linux_profile` linux profile username, publicKeys.
      * `network_profile` used to define loadbalancer,outbound,IPs .
      * `windows_profile` windows profile with user name and password.
      * `service_principal_profile` dict to define service service_principal_profile [client_id, secret].
      * `addon_profiles` dict to define addons to be added to the cluster setup.
      * `enable_rbac` boolean to specify whether to enable Kubernetes Role-Based Access Control.
  * `store_kube_config_in_runtime` Property to store kubernetes config in a runtime property to be used later.

See the [Common Properties](#common-properties) section.

**Example**

This example shows creating AKS Cluster, and explicitly defining the azure_config.

{{< highlight  yaml  >}}

  resource_group:
  type: cloudify.azure.nodes.ResourceGroup
  properties:
    name: { get_input: resource_group_name }
    location: { get_input: location }
    azure_config: *azure_config

  managed_cluster:
    type: cloudify.azure.nodes.compute.ManagedCluster
    properties:
      resource_group: { get_input: resource_group_name }
      name: { get_input: managed_cluster_name }
      resource_config:
        location: { get_input: location }
        tags:
          Name: "AKS_Test"
          tier: "Testing"
        kubernetes_version: "" # keep default
        dns_prefix: "akstest"
        agent_pool_profiles:
          - name: "nodepool1"
            count: 3
            vmSize: "Standard_DS1_v2"
            osType: "Linux"
            type: "VirtualMachineScaleSets"
            availabilityZones:
              - "1"
              - "2"
              - "3"
            enableNodePublicIP: true
        linux_profile:
          adminUsername: "azureuser"
          ssh:
            publicKeys:
              - keyData : { get_input: public_key }
        network_profile:
          loadBalancerSku: "standard"
          outboundType: "loadBalancer"
          loadBalancerProfile:
            managedOutboundIPs:
              count: 2
        windows_profile:
          adminUsername: "azureuser"
          adminPassword: "az#1234"
        service_principal_profile:
          clientId: { get_input: client_id }
          secret: { get_input: client_secret }
        addon_profiles: {}
        enable_rbac: true
      azure_config: *azure_config
      store_kube_config_in_runtime: true
    relationships:
    - type: cloudify.azure.relationships.contained_in_resource_group
      target: resource_group

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the Cluster.
  * `cloudify.interfaces.lifecycle.configure` Saves kubeconfig in runtime properties if `store_kube_config_in_runtime` set.
  * `cloudify.interfaces.lifecycle.delete` Deletes the Cluster.


### cloudify.azure.nodes.resources.Azure

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

A node used with the discovery feature to discover types of resources for usage in other "existing resource" deployments.

**Properties:**

  * `resource_config`: A dictionary with the following keys:
      * `resource_types`: a list of resource types to support, for example: `[Microsoft.ContainerService/ManagedClusters]`.
  * `locations` A list of regions to look for resources. Default is [], which represents all regions.

See the [Common Properties](#common-properties) section.

**Example**

{{< highlight  yaml  >}}

  azure_account:
    type: cloudify.azure.nodes.resources.Azure
    properties:
      client_config: *azure_config

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Initialize the account type.
  * `cloudify.interfaces.lifecycle.delete` Deinitialize the account type.

**Workflows**

Execute the `discover_and_deploy` workflow from an "Account" deployment to identify resources of the desired types and to deploy "existing resource" deployments.

## Relationships

See [relationships]({{< relref "developer/blueprints/spec-relationships.md" >}}).

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
 * `cloudify.azure.relationships.connected_to_ip_configuration` Sets a dependency between the resource and an IP configuration, except for NICs. (see cloudify.azure.relationships.nic_connected_to_ip_configuration)
 * `cloudify.azure.relationships.nic_connected_to_ip_configuration` Sets a dependency between a `cloudify.azure.nodes.network.NetworkInterfaceCard` resource type to a `cloudify.azure.nodes.network.IPConfiguration` resource type.
 * `cloudify.azure.relationships.connected_to_nic` Sets a dependency between the resource and a NIC.
 * `cloudify.azure.relationships.connected_to_lb_be_pool` Sets a dependency between the resource and a load balancer pool.
 * `cloudify.azure.relationships.connected_to_lb_probe` Sets a dependency between the resource and a load balancer probe.
 * `cloudify.azure.relationships.vmx_contained_in_vm` Sets a dependency between a VM extension and a VM.
 * `cloudify.azure.relationships.nic_connected_to_lb_be_pool` Sets a dependency between a NIC and a load balancer pool.

## Using Existing Resources

You can use existing resources on Azure, regardless of whether they have been created by a different {{< param product_name >}} deployment or outside of {{< param product_name >}}.

All {{< param product_name >}} Azure types have these properties that determine the behaviour:

* `use_external_resource` - Indicate whether the resource exists or if Cloudify should create the resource.
* `create_if_missing` - If use_external_resource is true, and the resource does not exist, create it.
* `use_if_exists`- If use_external_resource is false, but the resource does exist, use it.

If `use_external_resource` is set to `true` in the blueprint, the `name` must be that resource's name in Azure.