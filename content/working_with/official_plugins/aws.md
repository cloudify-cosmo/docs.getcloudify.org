---
layout: bt_wiki
title: AWS Plugin
category: Official Plugins
draft: false
weight: 100
aliases:
  - /plugins/aws/
  - /developer/official_plugins/aws/
---

{{% warning %}}

Please migrate your blueprints to use the [AWSSDK Plugin]({{< relref "working_with/official-plugins/awssdk.md" >}}). This project is no longer actively maintained and only critical bugs will be result in new plugin releases.

{{% /warning %}}


The AWS plugin enables you to use Cloudify to manage Cloud resources on AWS. The currently supported resource types are described below.

{{% note title="Note" %}}
Some services and resources vary in availability between regions and accounts.
{{% /note %}}

For information about the library, [click here](http://boto.readthedocs.org/en/latest/index.html).

# Plugin Requirements

* Python version 2.7.x
* AWS account


# Compatibility

{{% warning %}}
This version of Cloudify is only compatible with AWS Plugin version 1.3, and later.

If you are using an older AWS plugin, use one of the following workarounds.

* Connect to your Manager machine and move the ```/etc/cloudify/aws_plugin/boto``` file to ```/root/boto```.
* In the AWS manager, change the ```aws_config_path: /etc/cloudify/aws_plugin/boto``` line to ```aws_config_path: /root/boto```.

{{% /warning %}}

The AWS plugin uses the [Boto 2.38 client](https://github.com/boto/boto).

{{% note title="Note" %}}
This version of Boto EC2 Connection supports (AWS) APIVersion = '2014-10-01'.
This version of Boto ELB Connecton supports (AWS) APIVersion = '2012-06-01'.
{{% /note %}}

# AWS Plugin Configuration

The AWS plugin requires credentials and endpoint setup information in order to authenticate and interact with AWS.

### Providing Credentials as Secrets

 It is recommended that you store your credentials as [secrets]({{< relref "working_with/manager/using-secrets.md" >}}). You can do this using the [CLI]({{< relref "cli/secrets.md" >}}).
 Secrets can then be accessed inside your blueprints, as follows:

 {{< highlight  yaml  >}}
 network:
    type: cloudify.aws.nodes.VPC
    properties:
      aws_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        ec2_region_name: { get_secret: ec2_region_name }
        ec2_region_endpoint: { get_secret: ec2_region_endpoint }
      use_external_resource: true
      resource_id: { get_secret: vpc_id }
      cidr_block: N/A
 {{< /highlight >}}  
 
 (see [Common Properties](#common-properties) for more info on the `aws_config` dictionary)

### Providing Credentials as Environment Variables that are not Stored as Secrets

If you do not use secret storage, you must provide the following credentials as environment variables:
{{< highlight  yaml  >}}
       aws_config:
        aws_access_key_id: { aws_access_key_id }
        aws_secret_access_key: { aws_secret_access_key }
        ec2_region_name: { ec2_region_name }
        ec2_region_endpoint: { ec2_region_endpoint }
      resource_id: { vpc_id }
      cidr_block: N/A
 {{< /highlight >}}  

      

# Terminology

* **VPC** - Virtual Private Cloud. For more information about VPCs, see [AWS Documentation](https://aws.amazon.com/documentation/vpc/).
* **EC2-Classic** - The original release of Amazon EC2. On this platform, instances run in a single, flat network that is shared with other customers.
* **Region** - A general geographical area, such as "Central Europe" or "East US".
* **`availability_zone`** - One of many discrete locations within a region, such as `us-west-1b`.  When specifying an `availability_zone`, you must specify a zone that is in the region to which you are connecting.


# Types

This section describes the [node type]({{< relref "developer/blueprints/spec-node-types.md" >}}) definitions. Nodes describe resources in your Cloud infrastructure. For more information, see [node type]({{< relref "developer/blueprints/spec-node-types.md" >}}).

### Common Properties

All Cloud resource nodes have common properties:

**Properties**

  * `use_external_resource` - A boolean for setting whether to create the resource or use an existing one. See the [using existing resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` - The ID of an existing resource when the `use_external_resource` property is set to `true`. (For more informaiton, see [using existing resources](#using-existing-resources) below). Defaults to `''` (empty string).
  * `aws_config` - A dictionary that contains values to be passed to the connection client. For information on values that are acceptable, see the [boto documentation](http://boto.readthedocs.org/en/latest/ref/ec2.html#boto.ec2.connection.EC2Connection).

Each time that you manage a resource with Cloudify, one or more clients are created using the AWS API. You specify the configuration for these clients using the `aws_config` property. The property must be a dictionary, with the following values:

**Your AWS API access credentials** <br>
[Click here](http://docs.aws.amazon.com/AWSSecurityCredentials/1.0/AboutAWSCredentials.html#) for more information.

  * `aws_access_key_id` (required)
  * `aws_secret_access_key` (required)

**Region information**:

  * `ec2_region_name` - The EC2 region name, such as `us-east-1`. You may also use the word `region` to refer to the same thing. (Required, except with the `cloudify.aws.nodes.ElasticLoadBalancer` node type.) 
  * `ec2_region_endpoint` - The endpoint of the EC2 service, for example ec2.us-east-1.amazonaws.com.
  * `elb_region_name` - The ELB region name. Usually has the same value as your `ec2_region_name`, though not interchangeable. (Required in the `cloudify.aws.nodes.ElasticLoadBalancer` node type.)
  * `elb_region_endpoint` - The endpoint of the ELB service, for example elasticloadbalancing.eu-central-1.amazonaws.com.

See the `cloudify.datatypes.aws.Config` data type definition in the plugin.yaml for the plugin. Note that `availability_zone` and `region` are not synonymous, and that `availability_zone` is not part of the AWS configuration.


## cloudify.aws.nodes.Instance

**Derived From:** [cloudify.nodes.Compute]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `parameters` - Key-value server configuration, as described in [AWS EC2 Classic](http://boto.readthedocs.org/en/latest/ref/ec2.html#module-boto.ec2.instance).
    * The public key that is set for the server must match the private key name in your AWS account. The public key can be set in a number of ways:
      * By connecting the instance node to a keypair node using the `cloudify.aws.relationships.instance_connected_to_keypair` relationship.
      * By setting it explicitly in the `key_name` key under the `parameters` property.
      * If the agent's keypair information is set in the provider context, the agents' keypair will serve as the default public key to be used, if it was not specified otherwise.
    * If the server is to have an agent installed on it, it should use the agents security group. You can use other security groups via:
      * `security_groups`A list of security group names.
      * `security_group_ids`A list of security group IDs.
    * To specify the `availability_zone` for your instance, you must use the `placement` key.
  * `image_id` The AMI image ID for the instance. For more information, [click here](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/finding-an-ami.html).
  * `instance_type` The instance type for the instance. For more information, [click here](http://aws.amazon.com/ec2/instance-types/).
  * `name` Enables you to provide a name for your instance. The instance is tagged with the name and appears in your AWS console.

**Example**

This example demonstrates how to add more parameters, tag an instance name, and define the `aws_config`.

{{< highlight  yaml  >}}

  my_ec2_instance:
    type: cloudify.aws.nodes.Instance
    properties:
      image_id: ami-abcd1234
      instance_type: t1.micro
      parameters:
        placement: us-east-1
      name: my_ec2_instance
      aws_config:
        aws_access_key_id: ...
        aws_secret_access_key: ...
        ec2_region_name: us-east-1
...

{{< /highlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the instance.
  * `cloudify.interfaces.lifecycle.start` Starts the instance, if it is not already started.
  * `cloudify.interfaces.lifecycle.stop` Stops the instance, if it is not already stopped.
  * `cloudify.interfaces.lifecycle.delete` Deletes the instance and waits for termination.
  * `cloudify.interfaces.validation.creation` See the [common validations section](#Validations). In additon, the plugin checks to see if the `image_id` is available to your account.

**Attributes:**

See the common [Runtime Properties section](#runtime-properties).

The `create` function also sets the `reservation_id` attribute. For information, [click here](http://boto.readthedocs.org/en/latest/ref/ec2.html#boto.ec2.instance.Reservation).

The following additional `runtime_properties` are available on node instances of this type, after the `cloudify.interfaces.lifecycle.start` operation succeeds.

  * `ip` The instance's private IP address.
  * `private_dns_name` The instance's private FQDN in Amazon.
  * `public_dns_name` The instances's public FQDN in Amazon.
  * `public_ip_address` The instance's public IP address.

**Additional**
To use the instance in a VPC, you must connect the instance to a subnet using the `cloudify.aws.relationships.instance_contained_in_subnet` relationship.

## cloudify.aws.nodes.WindowsInstance

**Derived From:** [cloudify.aws.nodes.Instance](#cloudify-aws-nodes-instance)

Use this type when working with a Windows server. It has the same properties and operations-mapping as `cloudify.aws.nodes.Instance`, but overrides some of the agent and plugin installations operations-mapping derived from the [built-in cloudify.nodes.Compute type]({{< relref "developer/blueprints/built-in-types.md" >}}).

The default value for the `use_password` property is overridden for this type, and is set to `true`.
In this case, the password of the Windows server is retrieved, decrypted and located under the `password` runtime property of this node instance.

## cloudify.aws.nodes.KeyPair

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_id` Special behavior. When using a new (non-external) security group or key pair, this becomes the resource name. See the [using existing resources](#using-existing-resources)  section.
  * `private_key_path` *Required*. The path (on the machine on which the plugin is running) to where the private key is stored. If `use_external_resource` is set to `true`, the existing private key is expected to be located at this path.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the key pair.
  * `cloudify.interfaces.lifecycle.delete` Deletes the key pair.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section. Additional validations that take place are:
    * Validation that the provided private key path does not exist for a new keypair resource.
    * Validation that the provided private key path does exist and includes the correct permissions and/or owner for an existing key pair resource.

**Attributes:**

See the common [Runtime Properties](#runtime-properties) section.


## cloudify.aws.nodes.SecurityGroup

**Derived From:** [cloudify.nodes.SecurityGroup]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_id` If this is a new resource (`use_external_resource` is false), this is the name property of the new security group.
  * `description` Description of the security group.
  * `rules` Key-value security group rule configuration, as described [here](http://boto.readthedocs.org/en/latest/ref/ec2.html#boto.ec2.securitygroup.SecurityGroup.authorize). Defaults to `[]`.
      * `ip_protocol`
      * `from_port`
      * `to_port`
      * `cidr_ip` OR `src_group_id`.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the security group, along with its defined rules.
  * `cloudify.interfaces.lifecycle.delete` Deletes the security group.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the common [Runtime Properties](#runtime-properties) section.

**Additional**

Note that, to create a security group in a VPC, you must connect the security group to the VPC using the `cloudify.aws.relationships.security_group_contained_in_vpc` relationship.


## cloudify.aws.nodes.Volume

**Derived From:** [cloudify.nodes.Volume]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `size` The size ot the volume in GB.
  * `zone` A string representing the AWS availability zone.
  * `device` The device on the instance

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates an EBS volume.
  * `cloudify.interfaces.lifecycle.start` Starts an EBS volume.
  * `cloudify.interfaces.lifecycle.delete` Deletes an EBS volume.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.
  * `cloudify.interfaces.aws.snapshot` Creates a snapshot of an EBS volume.

**Attributes:**

See the common [Runtime Properties](#runtime-properties) section.

Note that the ID of the volume in AWS is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.ElasticIP

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `domain` Not required, but if the Elastic IP must be allocated in the VPC, make `vpc` the value of this property.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the Elastic IP.
  * `cloudify.interfaces.lifecycle.delete` Deletes the Elastic IP.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the [Runtime Properties](#runtime-properties) section.

Note that the actual IP is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.ElasticLoadBalancer

**Derived From:** [cloudify.aws.nodes.ElasticLoadBalancer]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `elb_name` The name associated with the new load balancer.
  * `zones` The names of the availability zone(s) to add (list of strings).
  * `security_groups` The security groups assigned to your LoadBalancer within your VPC (list of strings). Security groups only supported with vpc.
  * `listeners` List of tuples- Each tuple contains three or four values: LoadBalancerPortNumber, InstancePortNumber, Protocol, [SSLCertificateId]. See `listeners` under `cloudify.aws.nodes.ElasticLoadBalancer` in plugin.yaml.
  * `health_checks` List of healthchecks (dicts) to use as criteria for instance health.
  * `scheme` The type of a LoadBalancer. This option is only available for LoadBalancers attached to an Amazon VPC.
  * `subnets` A list of subnet IDs in your VPC to attach to your LoadBalancer.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates an ElasticLoadBalancer.
  * `cloudify.interfaces.lifecycle.start` Starts an ElasticLoadBalancer.
  * `cloudify.interfaces.lifecycle.delete` Deletes an ElasticLoadBalancer.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the [Runtime Properties](#runtime-properties) section.

Note that the ID of the load balancer in AWS is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.VPC

**Derived From:** [cloudify.nodes.Network]({{< relref "developer/blueprints/built-in-types.md" >}})

For more info on VPC, [click here](https://aws.amazon.com/documentation/vpc/).

**Properties:**

  * `cidr_block` Set the base CIDR block for your VPC.
  * `instance_tenancy` Set this property to `dedicated` if your VPC is on dedicated hardware.  Note that Cloudify is not responsible for charges on your account for this.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a VPC.
  * `cloudify.interfaces.lifecycle.delete` Deletes a VPC.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the [Runtime Properties](#runtime-properties) section.

Note that the ID of the VPC in AWS is available via the `aws_resource_id` runtime-property.
When a VPC is created, it receives several default attachments. Cloudify assigns a runtime property for the original DHCP options set, called `default_dhcp_options_id`. Note that this is not necessarily the current DHCP options set.


## cloudify.aws.nodes.Subnet

**Derived From:** [cloudify.nodes.Subnet]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `cidr_block` Split your VPC's CIDR block between one or many subnets.
  * `availability_zone` Not required but recommended, to avoid reliance on AWS to ensure that all your resources are placed in your preferred availability zone.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a subnet.
  * `cloudify.interfaces.lifecycle.delete` Deletes a subnet.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the common [Runtime Properties](#runtime-properties) section.

Note that the ID of the subnet in AWS is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.Gateway

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

Note that this is a base type for InternetGateway, VPNGateway and CustomerGateway.
Not to be used directly.

## cloudify.aws.nodes.InternetGateway

**Derived From:** [cloudify.aws.nodes.Gateway](#cloudify-aws-nodes-gateway)

**Properties:**

  * `cidr_block` Route 0.0.0.0/0 for all internet traffic.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates an internet gateway.
  * `cloudify.interfaces.lifecycle.delete` Deletes an internet gateway.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the common [Runtime Properties](#runtime-properties) section.

Note that the ID of the internet gateway in AWS is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.VPNGateway

**Derived From:** [cloudify.aws.nodes.Gateway](#cloudify-aws-nodes-gateway)

**Properties:**

  * `availability_zone` Not required but recommended, to avoid reliance on AWS to ensure that all your resources are placed in your preferred availability zone.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a VPN gateway.
  * `cloudify.interfaces.lifecycle.delete` Deletes a VPN gateway.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the common [Runtime Properties section](#runtime-properties) section.

Note that the ID of the VPN gateway in AWS is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.CustomerGateway

**Derived From:** [cloudify.aws.nodes.Gateway](#cloudify-aws-nodes-gateway)

**Properties:**

  * `type` Type of tunnel. Default is `ipsec.1`.
  * `ip_address` Your VPN endpoint IP.
  * `bgp_asn` Your ISP's autonomous system number.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a customer gateway.
  * `cloudify.interfaces.lifecycle.delete` Deletes a customer gateway.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the common [Runtime Properties](#runtime-properties) section.

Note that the ID of the customer gateway in AWS is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.ACL

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `acl_network_entries` A list of of network ACL entries. See the `cloudify.datatypes.aws.NetworkAclEntry` in the plugin.yaml data definitions section for its structure.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a network ACL.
  * `cloudify.interfaces.lifecycle.delete` Deletes a network ACL.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the common [Runtime Properties](#runtime-properties) section.

Note that the ID of `network_acl` in AWS is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.DHCPOptions

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `domain_name` The domain name that you associate with your DCHP.
  * `domain_name_servers` A list of existing domain name servers' IP addresses.
  * `ntp_servers` A list of existing NTP servers' IP addresses.
  * `netbios_name_servers` A list of existing NetBIOS servers' IP addresses.
  * `netbios_node_type` The type of Net BIOS.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a DHCP options set.
  * `cloudify.interfaces.lifecycle.delete` Deletes a DHCP options set.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the common [Runtime Properties](#runtime-properties) section.

Note that the ID of the DHCP option set in AWS is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.RouteTable

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a route table.
  * `cloudify.interfaces.lifecycle.delete` Deletes a route table.
  * `cloudify.interfaces.validation.creation` See the [common validations](#Validations) section.

**Attributes:**

See the common [Runtime Properties](#runtime-properties) section.

Note that the ID of the `route_table` in AWS is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.Interface

**Derived From:** [cloudify.nodes.Port]({{< relref "developer/blueprints/built-in-types.md" >}})

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates a network interface.
  * `cloudify.interfaces.lifecycle.start` Starts a network interface.
  * `cloudify.interfaces.lifecycle.delete` Deletes a network interface.

**Attributes:**

See the common [Runtime Properties](#runtime-properties) section.

Note that the ID of the `network_interface` in AWS is available via the `aws_resource_id` runtime-property.


## cloudify.aws.nodes.SecurityGroupRule

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `rule` A list of security group rule properties. See `cloudify.datatypes.aws.SecurityGroupRule` in the plugin.yaml data definitions section for its structure.


## cloudify.aws.nodes.SecurityGroupRule.Multi

**Derived From:** [cloudify.aws.nodes.SecurityGroupRule](#cloudify-aws-nodes-securitygrouprule)

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates circular dependency of security groups.
  * `cloudify.interfaces.lifecycle.delete` Deletes circular dependency of security groups.

**Additional**

Note that, to create a security group circular dependency, you must connect the security group rule multi to the security group it is contained in using the `cloudify.aws.relationships.rule_contained_in_security_group` relationship
and to the security group it depends on using the `cloudify.aws.relationships.rule_depends_on_security_group`.


# Relationships

See the [relationships]({{< relref "developer/blueprints/spec-relationships.md" >}}) section.

The following plugin relationship operations are defined in the AWS plugin:

 * `cloudify.aws.relationships.instance_connected_to_elastic_ip` Connects an instance to an Elastic IP. The source is the instance and the target is the Elastic IP.

* `cloudify.aws.relationships.instance_connected_to_keypair` The `run_instances` operation checks if there are any relationships that define a relationship between the instance and a key pair. If so, that key pair is the keypair for that instance. The operation inserts the key's name property in the `key_name` parameter in the `run_instances` function.

* `cloudify.aws.relationships.instance_connected_to_security_group` The `run_instances` operation checks if there are any relationships that define a relationship between the instance and a security group. If so, that security group's ID is included in the list of security groups in the `security_group_ids` parameter in the `run_instances` function.

* `cloudify.aws.relationships.instance_contained_in_subnet` The `run_instances` operation checks if there are any relationships to a subnet and creates the instance in that subnet. Otherwise, the instance is in the EC2 Classic VPC.

* `cloudify.aws.relationships.instance_connected_to_load_balancer` Registers an EC2 instance with an Elastic load balancer.

* `cloudify.aws.relationships.security_group_contained_in_vpc` A security group is created in EC2 classic unless it has this relationship. It is then created in the target VPC.

* `cloudify.aws.relationships.volume_connected_to_instance` Attaches an EBS volume to an instance.

* `cloudify.aws.relationships.subnet_contained_in_vpc` Required so that, when a subnet is created, the plugin can identify in which VPC to create the subnet.

* `cloudify.aws.relationships.routetable_contained_in_vpc` Required so that, when a route table is created, the plugin can identify in which VPC to create the route table. A route table can be created in only one VPC for its entire lifecycle.

* `cloudify.aws.relationships.routetable_associated_with_subnet` A route table can be associated with no more than one subnet at a time.

* `cloudify.aws.relationships.route_table_to_gateway` Adds multiple routes to route tables. You can add them as arguments to the `create` operation of the route table. For gateways, this is abstracted into a relationship. This adds a route to the source route table to the destination gateway. The gateway must have a `cidr_block` node property.

* `cloudify.aws.relationships.gateway_connected_to_vpc` Attaches either a VPN gateway or an internet Gateway to a VPC.

* `cloudify.aws.relationships.network_acl_contained_in_vpc` Required for network ACLs. A network ACL must be contained in a VPC so that the plugin can identify where to put it.

* `cloudify.aws.relationships.network_acl_associated_with_subnet` Associates a network ACL with a specific subnet.

* `cloudify.aws.relationships.route_table_of_source_vpc_connected_to_target_peer_vpc` Creates a VPC peering connection. A VPC peering connection is a connection between two VPCs. It requires a route table with which to associate the routes. This adds routes to the source route table and to the target VPC route table. You also require a `cloudify.relationships.depends_on` relationship to the target VPC's route table, if you have a `node_template` to create one.

* `cloudify.aws.relationships.dhcp_options_associated_with_vpc` Indicates which VPC with which to associate a DHCP options set.

* `cloudify.aws.relationships.customer_gateway_connected_to_vpn_gateway` Represents a VPC connection between a customer gateway and a VPN gateway.

* `cloudify.aws.relationships.instance_connected_to_eni` Connects an instance to a NetworkInterface. The source is the instance and the target is the network interface.

* `cloudify.aws.relationships.rule_depends_on_security_group` Indicates which SecurityGroupRule depends on which SecurityGroup.

* `cloudify.aws.relationships.rule_contained_in_security_group` Represents which SecurityGroupRule is contained in which SecurityGroup.


# Types Common Behaviors


## Validations

All types provide the same base functionality for the `cloudify.interfaces.validation.creation` interface operation:

  * If it is a new resource (`use_external_resource` is set to `false`), the basic validation verifies that the resource does not exist.

  * When [using an existing resource](#using-existing-resources), the validation verifies that the resource does exist.



## Runtime Properties

See the [runtime properties](http://cloudify-plugins-common.readthedocs.org/en/3.3/context.html?highlight=runtime#cloudify.context.NodeInstanceContext.runtime_properties) section.

Node instances of any of the types defined in this plugin are set with the following runtime properties during the `cloudify.interfaces.lifecycle.create` operation:

  * `aws_resource_id` AWS ID of the resource.


## Default Resource Naming Convention

If `use_external_resource` is set to `true` in the blueprint, the `resource_id` must be that resource's ID in AWS, unless the resource type is a key pair, in which case the value is the key's name.


# Using Existing Resources

You can use existing resources on AWS, regardless of whether they have been created by a different Cloudify deployment or outside of Cloudify.

All Cloudify AWS types have a property named `use_external_resource`, for which the default value is `false`. When set to `true`, the plugin applies different semantics for each of the operations executed on the relevant node's instances:

The following behavior is common to all resource types:

 * `create` If `use_external_resource` is `true`, the AWS plugin checks if the resource is available in your account. If the resource is unavailable, the operation  fails. If it is available, the plugin assigns the `aws_resource_id` to the `runtime_properties` instance .
 * `delete` If `use_external_resource` is `true`, the AWS plugin checks if the resource is available in your account. If the resource is unavailable, the operation  fails. If it is available, it unassigns the `runtime_properties` instance.

The following behaviors are unique:

 * `aws.ec2.instance.start` If `use_external_resource` is `true`, the `runtime_properties` for `public_ip_address`, etc, are set and the function exits.
 * `aws.ec2.instance.stop` If `use_external_resource` is `true`, the `runtime_properties` for `public_ip_address`, etc, are cleared, and the function exits.
 * `cloudify.aws.relationships.instance_connected_to_elastic_ip` If the `use_external_resource` value of both the instance and the `elasticip` are external, the function sets the relationship properties. If either are not external, the function fails.
 * `cloudify.aws.relationships.instance_connected_to_security_group` If the `use_external_resource` value of both the instance and the security groups are external, the function sets the relationship properties. If either are not external, the function fails.
 * `cloudify.aws.relationships.route_table_of_source_vpc_connected_to_target_peer_vpc` Runs regardless of whether the source or target node is external.


# Account Information

The plugin requires access to your `aws_access_key_id` and `aws_secret_access_key` in order to operate. Read about your [AWS Boto configuration](http://boto.readthedocs.org/en/latest/boto_config_tut.html) here.


# Tips

* It is highly recommended that you ensure that AWS names are unique. Many operations will fail if you have existing resources with identical names.
* When packaging blueprints for use with a Manager, the Manager adds the following configurations, which you can  override in your blueprint:
  * `aws_config`
  * `agent_keypair`
  * `agent_security_group`

