---
layout: bt_wiki
title: Openstack Plugin
category: Official Plugins
draft: false
weight: 100
aliases:
    - /plugins/openstack/
    - /developer/official_plugins/openstack/
---

The Openstack plugin enables you to manage Openstack resources with Cloudify.

## Authentication with Openstack

Each node template, has a `client_config` property which stores your account credentials. Use an intrinsic function to assign these to the values of secrets]({{< relref "working_with/manager/using-secrets.md" >}}) in your manager.

```yaml
  example-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: example-network
```

## Common Properties

AWS Plugin node types have these common properties, except where noted:

**Properties**

  * `client_config`: A dictionary that contains values to be passed to the connection client.
  * `resource_config`: A dictionary with required and common parameters to the resource's create or put call. The `kwargs` key accepts any supported Openstack API method arguments.
  * `use_external_resource`: Boolean. The default value is `false`. Set to `true` if the resource already exists.
  * `resource_id`: The ID of an existing resource in AWS. Required if `use_external_resource` is `true`.

# Node Types

Each node type refers to a resource in Openstack.

## **cloudify.nodes.openstack.Flavor**

This node type refers to an flavor.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. A description of the flavor.
  * `ram`: _Integer_. _Not required_. The amount of RAM a flavor has, in MiB.
  * `disk`: _String_. _Not required_. The size of the root disk that will be created in GiB. If 0 the root disk will be set to exactly the size of the image used. to deploy the instance. However, in this case filter scheduler cannot select the compute host based on the virtual image size. Therefore, 0 should only be used for volume booted instances or for testing purposes.
  * `vcpus`: _Integer_. _Not required_. The number of virtual CPUs that will be allocated to the server.
 
For more information, and possible keyword arguments, see: [create_flavor](https://developer.openstack.org/api-ref/compute/#create-flavor).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_flavor](https://developer.openstack.org/api-ref/compute/#create-flavor).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_flavor](https://developer.openstack.org/api-ref/compute/#delete-flavor).

### Host Aggregate

```yaml
  example-flavor:
    type: cloudify.nodes.openstack.Flavor
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: example-flavor
        ram: 4024
        disk: 8
        vcpus: 2
```

## **cloudify.nodes.openstack.FloatingIP**

This node type refers to an Openstack Floating IP.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `floating_network_id`: _String_. _Not required_. The ID of the network associated with the floating IP.
  * `fixed_ip_address`: _String_. _Not required_. The fixed IP address that is associated with the floating IP. If an internal port has multiple associated IP addresses, the service chooses the first IP address unless you explicitly define a fixed IP address in the fixed_ip_address parameter.
  * `floating_ip_address`: _String_. _Not required_. The floating IP address.
  * `port_id`: _String_. _Not required_. The ID of a port associated with the floating IP. To associate the floating IP with a fixed IP at creation time, you must specify the identifier of the internal port.
  * `subnet_id`: _String_. _Not required_. The subnet ID on which you want to create the floating IP.
  * `dns_domain`: _String_. _Not required_. A valid DNS domain.
  * `dns_name`: _String_. _Not required_. A valid DNS name.

For more information, and possible keyword arguments, see: [create_floating_ip](https://developer.openstack.org/api-ref/network/v2/#create-floating-ip).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_floating_ip](https://developer.openstack.org/api-ref/network/v2/#create-floating-ip).
  * `cloudify.interfaces.lifecycle.delete`: [delete_floating_ip](https://developer.openstack.org/api-ref/network/v2/#delete-floating-ip).

### Floating IP Examples

```yaml
  example-floating_ip_address:
    type: cloudify.nodes.openstack.FloatingIP
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        floating_network_id: { get_input: external_network_id }
        port_id: { get_input: port_id }
```

## **cloudify.nodes.openstack.HostAggregate**

This node type refers to a host aggregate.

**Resource Config**

  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `availability_zone`: _String_. _Not required_. The name of the host aggregate.

For more information, and possible keyword arguments, see: [create_aggregate](https://developer.openstack.org/api-ref/compute/?expanded=create-aggregate-detail).

**Properties**

  * `metadata`: Metadata key and value pairs. The maximum size for each metadata key and value pair is 255 bytes. All keys values should be provided as string.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_aggregate](https://developer.openstack.org/api-ref/compute/?expanded=create-aggregate-detail).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_aggregate](https://developer.openstack.org/api-ref/compute/#delete-aggregate).

### Host Aggregate

```yaml
  example-host-aggregate:
    type: cloudify.nodes.openstack.HostAggregate
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      metadata:
        ssd: 'True'
      resource_config: { get_input: host_aggregate_config }
```

## **cloudify.nodes.openstack.Image**

This node type refers to an image.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `container_format`: _String_. _Not required_. Format of the image container.
  * `disk_format`: _String_. _Not required_. Format of the image container.
  * `tags`: _String_. _Not required_. List of tags for this image. Each tag is a string of at most 255 chars. The maximum number of tags allowed on an image is set by the operator.

For more information, and possible keyword arguments, see: [create_image](https://developer.openstack.org/api-ref/image/v2/index.html?expanded=show-image-detail,create-image-detail#create-image).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_image](https://developer.openstack.org/api-ref/image/v2/index.html?expanded=show-image-detail,create-image-detail#create-image).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_image](https://developer.openstack.org/api-ref/image/v2/index.html?expanded=show-image-detail,create-image-detail#delete-image).

### Host Aggregate

```yaml
  example-image:
    type: cloudify.nodes.openstack.Image
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: 'openstack-image-custom'
        container_format: "bare"
        disk_format: "qcow2"
```

## **cloudify.nodes.openstack.KeyPair**

This node type refers to a Key pair.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `public_key`: _String_. _Not required_. The public ssh key to import. If you omit this value, a keypair is generated for you.

For more information, and possible keyword arguments, see: [create_keypair](https://developer.openstack.org/api-ref/compute/?expanded=create-or-import-keypair-detail).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_keypair](https://developer.openstack.org/api-ref/compute/?expanded=create-or-import-keypair-detail).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_keypair](https://developer.openstack.org/api-ref/compute/?expanded=create-or-import-keypair-detail#delete-server).

### Key pair

```yaml
  example-keypair:
    type: cloudify.nodes.openstack.KeyPair
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: id-rsa
        public_key: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC4FFmiO6pg+7jqAHAO2vCZMc5ish511RO5jJymla61+qE+hZx8ArCANRL8+xpNnrYrDnVjkWrcLkQiBNOqB3OcQKaIxNdE7g51zjPnNOpU17Y7KjNlMysn80ISFvcVhGWkyIElX6LksuU6AI4Bay0EnRto75oj69dCrCRM6H2PMns+xa/4eVFCUh+KZySBVPFPNfrQ+27nrvHWHFBMGlT9I5AqiiJrvCRbzG5u+FfOWFyKmLd3X1Aksv4lRapkfWSr/BYK32LKmIFcXMwaGgXtYmGZqqjQB6uHKksA+pqjmWUZYe8/N9F1uRvb/pD1IXeJ33o9pLKG5JhC/S2qmboR iloveu@barney
```

## **cloudify.nodes.openstack.Network**

This node type refers to an Openstack Network.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.

For more information, and possible keyword arguments, see: [create_network](https://developer.openstack.org/api-ref/network/v2/#create-network)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_network](https://developer.openstack.org/api-ref/network/v2/#create-network).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_network](https://developer.openstack.org/api-ref/network/v2/#delete-network).

### Network Example

```yaml
  example-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: example-network
```

## **cloudify.nodes.openstack.Port**

This node type refers to an Openstack Port.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `allowed_address_pairs`: _List_. _Not required._ A set of zero or more allowed address pair objects each where address pair object contains an ip_address and mac_address. While the ip_address is required, the mac_address will be taken from the port if not specified. The value of ip_address can be an IP Address or a CIDR (if supported by the underlying extension plugin). A server connected to the port can send a packet with source address which matches one of the specified allowed address pairs.
  * `device_id`: _String_. _Not required_. The ID of the device that uses this port. For example, a server instance or a logical router.
  * `device_owner`: _String_. _Not required_. The entity type that uses this port. For example, compute:nova (server instance), network:dhcp (DHCP agent) or network:router_interface (router interface).
  * `fixed_ips`: _List_. _Not required_. The IP addresses for the port. If you would like to assign multiple IP addresses for the port, specify multiple entries in this field. Each entry consists of IP address (ip_address) and the subnet ID from which the IP address is assigned (subnet_id).
      - If you specify both a subnet ID and an IP address, OpenStack Networking tries to allocate the IP address on that subnet to the port.
      - If you specify only a subnet ID, OpenStack Networking allocates an available IP from that subnet to the port.
      - If you specify only an IP address, OpenStack Networking tries to allocate the IP address if the address is a valid IP for any of the subnets on the specified network.
  * `network_id`: _String_. _Not required._ The ID of the network to which the port belongs. Must either provide this or a relationships to a network.
  * `security_groups`: _List_. _Not required._ The IDs of security groups applied to the port.


For more information, and possible keyword arguments, see: [create_port](https://developer.openstack.org/api-ref/network/v2/#create-port)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_port](https://developer.openstack.org/api-ref/network/v2/#create-port).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_port](https://developer.openstack.org/api-ref/network/v2/#delete-port).

### Port Example

```yaml
  example-server-port:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'server-port' ] }
        network_id: { get_attribute: [ example-network, id ] }
        fixed_ips:
          - subnet_id: { get_attribute: [ example-subnet, id ] }
        security_groups:
          - { get_attribute: [ example-security-group, id ] }
```

## **cloudify.nodes.openstack.Project**

This node type refers to an project.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. Description of the project.
  * `is_domain`: _Boolean_. _Not required_. Indicates whether the project also acts as a domain.
  * `domain_id`: _String_. _Not required_. The ID of the domain for the project.
  * `parent_id`: _String_. _Not required_. The ID of the parent of the project.
  * `tags`: _String_. _Not required_. A list of simple strings assigned to a project. Tags can be used to classify projects into groups.
 
For more information, and possible keyword arguments, see: [create_project](https://developer.openstack.org/api-ref/identity/v3/create-project).

**Properties**

  * `users`: _List_. _Not required._ List of users assigned to this project in the following format: `{ name: string, roles: [string] }`.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_project](https://developer.openstack.org/api-ref/identity/v3/create-project).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_project](https://developer.openstack.org/api-ref/identity/v3/delete-project).

### User Example

```yaml
  example-project:
    type: cloudify.nodes.openstack.Project
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: 'test_project'
        description: 'Testing Project'
        is_domain': True
      users:
        - name: test_user
          roles:
            - test_role_1
            - test_role_2
            - test_role_3
```

## **cloudify.nodes.openstack.RBACPolicy**

This node type refers to an Openstack RBAC Policy.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `target_tenant`: _String_. _Not required_. The ID of the tenant to which the RBAC policy will be enforced.
  * `object_type`: _String_. _Not required_. The type of the object that the RBAC policy affects. Types include qos-policy or network.
  * `object_id`: _String_. _Not required_. The ID of the object_type resource. An object_type ofnetwork returns a network ID and an object_type of qos-policy returns a QoS ID.
  * `action`: _String_. _Not required_. The maximum port number in the range that is matched by the security group rule. If the protocol is TCP, UDP, DCCP, SCTP or UDP-Lite this value must be greater than or equal to the port_range_min attribute value. If the protocol is ICMP, this value must be an ICMP type.

For more information, and possible keyword arguments, see: [create_rbac_policy](https://developer.openstack.org/api-ref/network/v2/?expanded=create-rbac-policy-detail#create-rbac-policy)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_rbac_policy](https://developer.openstack.org/api-ref/network/v2/?expanded=create-rbac-policy-detail#create-rbac-policy).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_rbac_policy](https://developer.openstack.org/api-ref/network/v2/?expanded=create-rbac-policy-detail#delete-rbac-policy).

### RBAC Policy Example

```yaml
  example-rbac-policy:
    type: cloudify.nodes.openstack.RBACPolicy
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        target_tenant: { get_input: project_id }
        action: access_as_shared
    relationships:
      - type: cloudify.relationships.openstack.rbac_policy_applied_to
        target_interfaces:
          cloudify.interfaces.relationship_lifecycle:
            unlink:
              inputs:
                disable_dhcp:
                  default: true
        target: example-network
```

## **cloudify.nodes.openstack.Router**

This node type refers to an Openstack Router.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_router](https://developer.openstack.org/api-ref/network/v2/#create-router).
  * `cloudify.interfaces.lifecycle.delete`: Executes [create_router](https://developer.openstack.org/api-ref/network/v2/#delete-router).

### Server Examples

**Create a Server connected to a certain port and to a certain keypair**

```yaml
  example-router:
    type: cloudify.nodes.openstack.Router
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: example-router
        kwargs:
          external_gateway_info:
            network_id: { get_input: external_gateway_id }
```

## **cloudify.nodes.openstack.SecurityGroup**

This node type refers to an Openstack security group.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. Resource description

For more information, and possible keyword arguments, see: [create_security_group](https://developer.openstack.org/api-ref/network/v2/#create-security-group).

**Properties**

  * `security_group_rules`: _List_. _Not required_. A list of security group rules.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_security_group](https://developer.openstack.org/api-ref/network/v2/#create-security-group).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_security_group](https://developer.openstack.org/api-ref/network/v2/#delete-security-group).

### Security Group Examples

```yaml
  example-security-group:
    type: cloudify.nodes.openstack.SecurityGroup
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: example-security-group
        description: 'A security group created by Cloudify OpenStack SDK plugin.'
      security_group_rules:
      - remote_ip_prefix: 0.0.0.0/0
        port_range_max: 22
        port_range_min: 22
        direction: ingress
        protocol: tcp
```

## **cloudify.nodes.openstack.SecurityGroupRule**

This node type refers to an Openstack Security Group Rule.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `remote_group_id`: _String_. _Not required_. The remote group UUID to associate with this security group rule. You can specify either the remote_group_id or remote_ip_prefix attribute in the request body.
  * `protocol`: _String_. _Not required_. The IP protocol of the security group rule.
  * `direction`: _String_. _Not required_. Ingress or egress, which is the direction in which the security group rule is applied.
  * `port_range_min`: _Integer_. _Not required_. The minimum port number in the range that is matched by the security group rule. If the protocol is TCP, UDP, DCCP, SCTP or UDP-Lite this value must be less than or equal to the port_range_max attribute value. If the protocol is ICMP, this value must be an ICMP type.
  * `port_range_max`: _Integer_. _Not required_. The maximum port number in the range that is matched by the security group rule. If the protocol is TCP, UDP, DCCP, SCTP or UDP-Lite this value must be greater than or equal to the port_range_min attribute value. If the protocol is ICMP, this value must be an ICMP type.
  * `security_group_id`: _String_. _Not required_. The security group ID to associate with this security group rule.
  * `remote_ip_prefix`: _String_. _Not required_. The security group ID to associate with this security group rule.The remote IP prefix that is matched by this security group rule.

For more information, and possible keyword arguments, see: [create_security_group_rule](https://developer.openstack.org/api-ref/network/v2/#create-security-group-rule).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_security_group_rule](https://developer.openstack.org/api-ref/network/v2/#create-security-group-rule).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_security_group_rule](https://developer.openstack.org/api-ref/network/v2/#delete-security-group-rule).

### Security Group Rule Examples

```yaml
  example-security-group-rule:
    type: cloudify.nodes.openstack.SecurityGroupRule
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        direction: ingress
        protocol: tcp
        port_range_max: 22
        port_range_min: 22
        security_group_id: { get_input: security_group_id }
```

## **cloudify.nodes.openstack.Server**

This node type refers to an Openstack Server.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `image_id`: _String_. _Not required_. The UUID of the image to use for your server instance. This is not required in case of boot from volume. In all other cases it is required and must be a valid UUID otherwise API will return 400.
  * `flavor_id`: _String_. _Not required_. The flavor reference, as an ID (including a UUID) or full URL, for the flavor for your server instance.
  * `availability_zone`: _String_. _Not required_. The availability zone from which to launch the server. When you provision resources, you specify from which availability zone you want your instance to be built. Typically, an admin user will use availability zones to arrange OpenStack compute hosts into logical groups. An availability zone provides a form of physical isolation and redundancy from other availability zones. For instance, if some racks in your data center are on a separate power source, you can put servers in those racks in their own availability zone. Availability zones can also help separate different classes of hardware. By segregating resources into availability zones, you can ensure that your application resources are spread across disparate machines to achieve high availability in the event of hardware or other failure. You can list the available availability zones by calling the os-availability-zone API, but you should avoid using the default availability zone when booting the instance. In general, the default availability zone is named nova. This AZ is only shown when listing the availability zones as an admin.
  * `user_data`: _String_. _Not required_. Configuration information or scripts to use upon launch. Must be Base64 encoded. Restricted to 65535 bytes.
  * `metadata`: _Dictionary_. _Not required_. Metadata key and value pairs. The maximum size of the metadata key and value is 255 bytes each.
  * `security_groups`: _List_. _Not required_. One or more security groups. Specify the name of the security group in the name attribute. If you omit this attribute, the API creates the server in the default security group. Requested security groups are not applied to pre-existing ports.
  * `networks`: _List_. _Not required_. A list of network objects. Required parameter when there are multiple networks defined for the tenant. When you do not specify the networks parameter, the server attaches to the only network created for the current tenant.
  * `key_name`: _String_. _Not required_. Openstack key pair name.

For more information, and possible keyword arguments, see: [create_server](https://developer.openstack.org/api-ref/compute/?expanded=create-server-detail)

**Properties**

  * `use_ipv6_ip`: Set `ip` runtime property to IPv6 address if available.
  * `use_public_ip`: Set `ip` runtime property to a public ip if available.
  * `use_password`: Use a password for agent communication.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_server](https://developer.openstack.org/api-ref/compute/?expanded=create-server-detail).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_server](https://developer.openstack.org/api-ref/compute/?expanded=create-server-detail).

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.openstack.Network`: Create the VM on a certain network.
    * `cloudify.nodes.openstack.KeyPair`: Create with a key pair in your account.
    * `cloudify.nodes.openstack.Port`: Create the VM with an attachment to a certain port.
    * `cloudify.nodes.openstack.ServerGroup`: Create the VM in a certain server group.
    * `cloudify.nodes.openstack.Volume`: Create the VM with an attachment to a certain volume.

### Server Examples

**Create a Server connected to a certain port and to a certain keypair**

```yaml
  example-server:
    type: cloudify.nodes.openstack.Server
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      agent_config:
        install_method: none
      resource_config:
        name: example-server
        image_id: { get_input: image_id }
        flavor_id: { get_input: flavor_id }
        key_name: { get_input: keypair_name }
    relationships:
      - type: cloudify.relationships.openstack.server_connected_to_port
        target: example-server-port
      - type: cloudify.relationships.openstack.server_connected_to_keypair
        target: example-keypair
```

## **cloudify.nodes.openstack.WindowsServer**

This node type refers to an Openstack Windows Server. It is identical to `cloudify.nodes.openstack.Server`, except the following values have been overridden:

**Properties**
  * `use_password`: Default: `true`.
  * `os_family`: Default: `windows`.
  * `agent_config`: Default: `port: 5985`
  

## **cloudify.nodes.openstack.ServerGroup**

This node type refers to an Server Group.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `policies`: _List. _Not required_. A list of exactly one policy name to associate with the server group. The current valid policy names are:
    * `anti-affinity`: Servers in this group must be scheduled to different hosts.
    * `affinity`: Servers in this group must be scheduled to the same host.
    * `soft-anti-affinity`: Servers in this group should be scheduled to different hosts if possible, but if not possible then they should still be scheduled instead of resulting in a build failure. This policy was added in microversion 2.15.
    * `soft-affinity`: Servers in this group should be scheduled to the same host if possible, but if not possible then they should still be scheduled instead of resulting in a build failure. This policy was added in microversion 2.15.

For more information, and possible keyword arguments, see: [create_server_group](https://developer.openstack.org/api-ref/compute/?expanded=create-server-detail#create-server-group).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_server_group](https://developer.openstack.org/api-ref/compute/?expanded=create-server-detail#create-server-group).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_server_group](https://developer.openstack.org/api-ref/compute/?expanded=create-server-detail#delete-server-group).

### Server Group

```yaml
  example-server-group:
    type: cloudify.nodes.openstack.ServerGroup
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: 'example-server-group'
        policy: affinity
```

## **cloudify.nodes.openstack.Subnet**

This node type refers to an Openstack Subnet.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `enable_dhcp`: _Boolean_. _Not required._ Indicates whether dhcp is enabled or disabled for the subnet. Default is true.
  * `network_id`: _String_. _Not required._ The ID of the network to which the subnet belongs. Must either provide this or a relationships to a network.
  * `dns_nameservers`: _List_. _Not required._ List of dns name servers associated with the subnet. Default is an empty list.
  * `allocation_pools`: _List_. _Not required._ Allocation pools with start and end IP addresses for this subnet. If allocation_pools are not specified, OpenStack Networking automatically allocates pools for covering all IP addresses in the CIDR, excluding the address reserved for the subnet gateway by default.
  * `host_routes`: _List_. _Not Required._ Additional routes for the subnet. A list of dictionaries with destination and nexthop parameters. Default value is an empty list.
  * `ip_version`: _String_. Not required._ The IP protocol version. The value is either 4 or 6.
  * `gateway_ip`: _String_. Not required._ Gateway IP of this subnet. If the value is null that implies no gateway is associated with the subnet. If the gateway_ip is not specified, OpenStack Networking allocates an address from the CIDR for the gateway for the subnet by default.
  * `cidr`: _String_. Not required._ The CIDR of the subnet.
  * `prefixlen`: _Integer_. Not required._ The prefix length to use for subnet allocation from a subnet pool. If not specified, the default_prefixlen value of the subnet pool will be used.
  * `ipv6_address_mode`: _String_. Not required._ The IPv6 address modes specifies mechanisms for assigning IP addresses. Value is slaac, dhcpv6-stateful, dhcpv6-stateless.
  * `ipv6_ra_mode`: _String_. Not required._ The IPv6 router advertisement specifies whether the networking service should transmit ICMPv6 packets, for a subnet. Value is slaac, dhcpv6-stateful, dhcpv6-stateless.

For more information, and possible keyword arguments, see: [create_subnet](https://developer.openstack.org/api-ref/network/v2/#create-subnet)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_subnet](https://developer.openstack.org/api-ref/network/v2/#create-subnet).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_subnet](https://developer.openstack.org/api-ref/network/v2/#delete-subnet).

### Subnet Example

```yaml
  example-subnet:
    type: cloudify.nodes.openstack.Subnet
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: example-subnet
        cidr: 10.10.10.0/24
        enable_dhcp: true
        ip_version: 4
        dns_nameservers:
          - 8.8.8.8
          - 8.8.4.4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-network
      - type: cloudify.relationships.openstack.subnet_connected_to_router
        target: example-router
```

## **cloudify.nodes.openstack.User**

This node type refers to an user.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. A description of the user.
  * `default_project_id`: _String_. _Not required_. The ID of the default project for the user.
  * `domain_id`: _String_. _Not required_. The ID of the domain of the user.
  * `enabled`: _String_. _Not required_. If the user is enabled, this value is true. If the user is disabled, this value is false.
  * `password`: _String_. _Not required_. The password for the user.
  * `email`: _String_. _Not required_. The email for the user.
 
For more information, and possible keyword arguments, see: [create_user](https://developer.openstack.org/api-ref/identity/v3/#create-user).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_user](https://developer.openstack.org/api-ref/identity/v3/#create-user).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_user](https://developer.openstack.org/api-ref/identity/v3/#delete-user).

### User Example

```yaml
  example-user:
    type: cloudify.nodes.openstack.User
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: 'test-user'
        description: 'Test User'
        default_project_id: { get_input: project_name }
        enabled: True
        password: 'test1234567890'
        email: 'test@test.com'
```

## **cloudify.nodes.openstack.Volume**

This node type refers to an Openstack Volume.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. A description of the volume.
  * `project_id`: _String_. _Not required_. The UUID of the project in a multi-tenancy cloud.
  * `size`: _Integer. _Not required_. The size of the volume, in gibibytes (GiB), for example `10` for "10 GB".
  * `availability_zone`: _String_. _Not required_. The name of the availability zone.
  * `imageRef`: _String_. _Not required_. The UUID of the image from which you want to create the volume. Required to create a bootable volume.
  * `snapshot_id`: _String_. _Not required_. To create a volume from an existing snapshot, specify the UUID of the volume snapshot. The volume is created in same availability zone and with same size as the snapshot.
  * `volume_type`: _String_. _Not required_. The volume type (either name or ID). To create an environment with multiple-storage back ends, you must specify a volume type. Block Storage volume back ends are spawned as children to cinder- volume, and they are keyed from a unique queue. They are named cinder- volume.HOST.BACKEND. For example, cinder- volume.ubuntu.lvmdriver. When a volume is created, the scheduler chooses an appropriate back end to handle the request based on the volume type. Default is None. For information about how to use volume types to create multiple-storage back ends.

For more information, and possible keyword arguments, see: [create_volume](https://developer.openstack.org/api-ref/block-storage/v2/index.html?expanded=create-volume-detail#volumes-volumes)

**Properties**

  * `device_name`: The server device to mount the VM on.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_volume](https://developer.openstack.org/api-ref/block-storage/v2/index.html?expanded=create-volume-detail#volumes-volumes).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_volume](https://developer.openstack.org/api-ref/block-storage/v2/index.html?expanded=create-volume-detail#delete-volume).

### Volume Example

**Boot Server from Volume**

```yaml
  example-volume-1:
    type: cloudify.nodes.openstack.Volume
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      device_name: 'vda'
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'volume_1' ] }
        availability_zone: 'nova'
        description: 'Example Volume Size 1'
        project_id: { get_input: project_id }
        size: 10
        imageRef: { get_input: image }

  example-volume-booted-server:
    type: cloudify.nodes.openstack.Server
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      agent_config:
        install_method: none
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'server' ] }
        key_name: { get_property: [ example-keypair, resource_config, name ] }
        flavor_id: { get_input: flavor }
        availability_zone: nova
    relationships:
      - type: cloudify.relationships.openstack.server_connected_to_keypair
        target:  example-keypair
      - type: cloudify.relationships.openstack.server_connected_to_port
        target: example-public-port
      - type: cloudify.relationships.depends_on
        target: example-volume-1
      - type: cloudify.relationships.openstack.server_connected_to_port
        target: example-private-port

```

## **cloudify.nodes.openstack.VolumeType**

This node type refers to a volume type.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. A description of the volume type.
  * `project_id`: _String_. _Not required_. The UUID of the project in a multi-tenancy cloud.
  * `extra_specs`: _Dictionary_. _Not required_. A key and value pair that contains additional specifications that are associated with the volume type Examples include capabilities, capacity, compression, and so on, depending on the storage driver in use.

For more information, and possible keyword arguments, see: [create_volume_type](https://developer.openstack.org/api-ref/block-storage/v3/index.html?expanded=create-a-volume-type-detail#volume-types-types).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_volume_type](https://developer.openstack.org/api-ref/block-storage/v3/index.html?expanded=create-a-volume-type-detail#volume-types-types.
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_volume_type](https://developer.openstack.org/api-ref/block-storage/v3/#delete-a-volume-type).

### Host Aggregate

```yaml
  example-volume-type:
    type: cloudify.nodes.openstack.VolumeType
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: 'example-volume-type'
        extra_specs:
          capabilities: 'gpu'
```
