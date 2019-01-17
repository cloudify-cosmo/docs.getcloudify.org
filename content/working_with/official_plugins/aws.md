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

The AWS plugin enables you to manage AWS resources with Cloudify.

## Authentication with AWS

Each node template, has a `client_config` property which stores your account credentials. Use an intrinsic function to assign these to the values of secrets]({{< relref "working_with/manager/using-secrets.md" >}}) in your manager.

```yaml
  my_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_secret: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
```

## Common Operations

This section requires an understanding of Cloudify's install and uninstall [built-in workflows]({{< relref "working_with/workflows/built-in-workflows.md" >}}).

AWS Plugin node types have these common operations, except where noted:

**Operations**

  * `cloudify.interfaces.lifecycle.create`:
    * `description`: The `resource_config` from **properties** is stored in the `resource_config` runtime property.
    * `inputs`:
      * `aws_resource_id`: Override the ID of the resource.
      * `runtime_properties`: Override the current runtime properties.
      * `force_operation`: Forces the current operation to be executed regardless of `use_external_resource`.
      * `resource_config`: Override the resource config.
  * `cloudify.interfaces.lifecycle.configure`
    * `description`: Execute the API action associated with creation, see resource mapping information.
    * `inputs`:
      * `aws_resource_id`: Override the ID of the resource.
      * `runtime_properties`: Override the current runtime properties.
      * `force_operation`: Forces the current operation to be executed regardless of `use_external_resource`.
      * `resource_config`: Override the resource config.
  * `cloudify.interfaces.lifecycle.delete`
    * `description`: Execute the API method action with deletion, see resource mapping information.
    * `inputs`:
      * `aws_resource_id`: Override the ID of the resource.
      * `runtime_properties`: Override the current runtime properties.
      * `force_operation`: Forces the current operation to be executed regardless of `use_external_resource`.
      * `resource_config`: Override the resource config.

## Common Properties

AWS Plugin node types have these common properties, except where noted:

**Properties**

  * `client_config`: A dictionary that contains values to be passed to the connection client.
  * `resource_config`: A dictionary with required and common parameters to the resource's create or put call. The `kwargs` key accepts any supported AWS API method arguments. This call usually happens in the `cloudify.interfaces.lifecycle.configure` operation.
  * `use_external_resource`: Boolean. The default value is `false`. Set to `true` if the resource already exists.
  * `resource_id`: The ID of an existing resource in AWS. Required if `use_external_resource` is `true`.

# Node Types

Each node type refers to a resource in AWS.

## **cloudify.nodes.aws.ec2.CustomerGateway**

This node type refers to an AWS Customer Gateway

For more information, and possible keyword arguments, see: [EC2:create_customer_gateway](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.create_customer_gateway)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateCustomerGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateCustomerGateway.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteCustomerGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteCustomerGateway.html) action.


**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.ElasticIP`: Fills the PublicIp parameter with the address of the connected IP.

### Customer Gateway Examples

**Create Customer Gateway**

Specify a relationship to an Elastic IP.

```yaml
  customer_gateway:
    type: cloudify.nodes.aws.ec2.customer_gateway
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
    - type: cloudify.relationships.depends_on
      target: eip

  nat_gateway_ip:
    type: cloudify.nodes.aws.ec2.ElasticIP
    properties:
      Domain: vpc
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }

```

## **cloudify.nodes.aws.ec2.DHCPOptions**

This node type refers to a DHCP Option Set.

For more information, and possible keyword arguments, see: [EC2:create_dhcp_options](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_dhcp_options)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateDhcpOptions](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateDhcpOptions.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteDhcpOptions](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteDhcpOptions.html) action.


**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Vpc`: Inserts the VPC parameter to the resource config creating the DHCP Option Set in that VPC.

### DHCP Option Set Examples

**Create DHCP Option Set**

```yaml
  dhcp:
    type: cloudify.nodes.aws.ec2.DHCPOptions
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
    - type: cloudify.relationships.depends_on
      target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'

```

## **cloudify.nodes.aws.ec2.EBSAttachment**

This node type refers to a EBS Attachment.

For more information, and possible keyword arguments, see: [EC2:attach_volume](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.attach_volume)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [AttachVolume](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AttachVolume.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DetachVolume](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DetachVolume.html) action.

### EBS Attachment Example

See EBS examples.

## **cloudify.nodes.aws.ec2.EBSVolume**

This node type refers to an AWS EBS Volume.

**Resource Config**

  * `AvailabilityZone`: String. The availability zone to create the volume in.
  * `Size` Integer. In Gigabytes.

For more information, and possible keyword arguments, see: [EC2:create_volume](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_volume)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateVolume](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateVolume.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [DeleteVolume](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteVolume.html) action.

### EBS Volume Examples

**Create a Volume and Connect to a VM**

```yaml
  vm:
    type: cloudify.nodes.aws.ec2.Instances
    properties:
      resource_config:
        ImageId: { get_input: ami }
        InstanceType: { get_input: instance_type }
        kwargs:
          SubnetId: { get_input: subnet_id }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }

  volume:
    type: cloudify.nodes.aws.ec2.EBSVolume
    properties:
      resource_config:
        AvailabilityZone: { get_input: availability_zone }
        Size: 6
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }

  volume_attachment:
    type: cloudify.nodes.aws.ec2.EBSAttachment
    properties:
      resource_config:
        kwargs:
          Device: { get_input: ebs_volume_attachment_device }
          InstanceId: { get_attribute: [ vm, aws_resource_id ] }
          VolumeId: { get_attribute: [ volume, aws_resource_id ] }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.depends_on
        target: volume
      - type: cloudify.relationships.depends_on
        target: vm
```

## **cloudify.nodes.aws.ec2.Instances**

This node type refers to an AWS Instance

**Resource Config**

  * `MinCount`: Integer. Do not change the default. Increment instances via default instances capability.
  * `MaxCount`: Integer. Do not change the default. Increment instances via default instances capability.
  * `ImageId`: String. Not required. The AMI.
  * `InstanceType`: String. Not required. The instance type.
  * `LaunchTemplate`: Not required. A dictionary with the following keys:
    * `LaunchTemplateId`: Not required.
    * `LaunchTemplateName`: Not required.
    * `Version`: Not required.

For more information, and possible keyword arguments, see: [EC2:run_instances](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.run_instances)

**Properties**

  * `use_ipv6_ip`: Set `ip` runtime property to IPv6 address if available.
  * `use_public_ip`: Set `ip` runtime property to a public ip if available.
  * `use_password`: Use a password for agent communication.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [RunInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html) action.
  * `cloudify.interfaces.lifecycle.start`: Assigns IP properties and waits for the instance to be in a started state.
  * `cloudify.interfaces.lifecycle.stop`: Executes the [StopInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_StopInstances.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [DeleteInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_TerminateInstances.html) action.
  * `cloudify.interfaces.lifecycle.modify_instance_attribute`: Executes the [ModifyInstanceAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceAttribute.html) action.


**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.SecurityGroup`: Connect to a certain Security group.
    * `cloudify.nodes.aws.ec2.Subnet`: Create with in a certain subnet.
    * `cloudify.nodes.aws.ec2.Interface`: Create with an ENI in your account. If multiple ENIs are connected and device indices are not provided, they will be generated according to the relationship order.
    * `cloudify.nodes.aws.ec2.Keypair`: Create with a key pair in your account.

### Instance Examples

**Connecting a VM to a subnet**

Specify a relationship to a subnet and the Instance will be created in that subnet.

```yaml
  host:
    type: cloudify.nodes.aws.ec2.Instances
    properties:
      agent_config:
        user: { get_input: username }
        key: { get_secret: private_key_content }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        ImageId: { get_input: ami }
        InstanceType: { get_input: instance_type }
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet
  subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      resource_config:
        CidrBlock: 10.0.0.0/16
        AvailabilityZone: us-west-1b
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
    - type: cloudify.relationships.depends_on
      target: vpc
```

**Connecting a VM to a ENI**

Specify a relationship to an ENI and the Instance will be connected to that ENI.

```yaml
  host:
    type: cloudify.nodes.aws.ec2.Instances
    properties:
      agent_config:
        user: { get_input: agent_user }
        key: { get_secret: agent_key_private }
      resource_config:
        ImageId: ami-012345678
        InstanceType: m3.medium
        kwargs:
          BlockDeviceMappings:
          - DeviceName: '/dev/sda1'
            Ebs:
              DeleteOnTermination: True
          Placement:
            AvailabilityZone: us-west-1b
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.depends_on
        target: eni

  eni:
    type: cloudify.nodes.aws.ec2.Interface
    properties:
      resource_config:
        kwargs:
          Description: My NIC.
          SubnetId: us-west-1b
          Groups:
          - { get_input: security_group_id }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
    - type: cloudify.relationships.depends_on
      target: subnet
```

**Connecting a VM to a security group**

Specify a relationship to a security and the Instance will be created in that group.

```yaml
  host:
    type: cloudify.nodes.aws.ec2.Instances
    properties:
      agent_config:
        user: { get_input: agent_user }
        key: { get_secret: agent_key_private }
      resource_config:
        ImageId: ami-012345678
        InstanceType: m3.medium
        kwargs:
          BlockDeviceMappings:
          - DeviceName: '/dev/sda1'
            Ebs:
              DeleteOnTermination: True
          Placement:
            AvailabilityZone: us-west-1b
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: us-west-1

  my_security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      resource_config:
        kwargs:
          GroupName: MyGroup
          Description: My Grroup.
          VpcId: vpc-012345678
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
    - type: cloudify.relationships.depends_on
      target: vpc
```

## **cloudify.nodes.aws.ec2.VPC**

This node type refers to an AWS VPC

**Resource Config**

  * `CidrBlock`: String. The IPv4 network range for the VPC, in CIDR notation. For example, 10.0.0.0/16.

For more information, and possible keyword arguments, see: [EC2:create_vpc](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_vpc)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateVpc](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateVpc.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [DeleteVpc](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteVpc.html) action.

### VPC Example

```yaml
  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: MyVPC
```

## **cloudify.nodes.aws.ec2.InternetGateway**

This node type refers to an AWS Internet Gateway.

For more information, and possible keyword arguments, see: [EC2:create_internet_gateway](create_internet_gateway](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_internet_gateway).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateInternetGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateInternetGateway.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [DeleteInternetGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteInternetGateway.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Vpc`: Create in a certain VPC.

### Internet Gateway Example

```yaml
  internet_gateway:
    type: cloudify.nodes.aws.ec2.InternetGateway
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      Tags:
        - Key: Name
          Value: MyInternetGateway
    relationships:
    - type: cloudify.relationships.connected_to
      target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: MyVPC
```

## **cloudify.nodes.aws.ec2.Image**

Identify an existing AMI by providing filters.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [DescribeImages](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImages.html).

### Image Examples

**Connecting a VM to a subnet**

Create an instance with an image identified from filters.

```yaml
  cloudify_manager_ami:
    type: cloudify.nodes.aws.ec2.Image
    properties:
      resource_config:
        kwargs:
          Filters:
            - Name: image-id
              Values:
                - ami-0120b2cc79038bf90
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }

  cloudify_manager:
    type: cloudify.nodes.aws.ec2.Instances
    properties:
      agent_config:
        install_method: none
      resource_config:
        ImageId: { get_attribute: [ cloudify_manager_ami, aws_resource_id ] }
        InstanceType: { get_input: instance_type }
        kwargs: { get_input: subnet_id }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.depends_on
        target: cloudify_manager_ami
```

## **cloudify.nodes.aws.ec2.Subnet**

This node type refers to an AWS Subnet

**Resource Config**

  * `AvailabilityZone`: String. The Availability Zone for the subnet
  * `CidrBlock`: String. The IPv4 network range for the subnet, in CIDR notation. For example, 10.0.0.0/24.
  * `VpcId`: String. The ID of the VPC.

For more information, and possible keyword arguments, see: [EC2:create_subnet](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_subnet)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateSubnet](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateSubnet.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [DeleteSubnet](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteSubnet.html) action.


**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Vpc`: Create in a certain VPC.

### Example Subnet

```yaml
subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      resource_config:
        CidrBlock: 10.0.0.0/24
        AvailabilityZone: { concat: [ { get_property: [ vpc, client_config, region_name ] }, 'a' ] }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_property: [ vpc, client_config, region_name ] }
      Tags:
        - Key: Name
          Value: MySubnet
    relationships:
    - type: cloudify.relationships.depends_on
      target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: MyVPC
```

## **cloudify.nodes.aws.ec2.SecurityGroupRuleIngress**

This node type refers to an ingress rule.

**Resource Config**

  * `IpPermissions`: List. A list of IP Permissions.

For more information, and possible keyword arguments, see: [EC2:authorize_security_group_ingress](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.authorize_security_group_ingress)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [AuthorizeSecurityGroupIngress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AuthorizeSecurityGroupIngress.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [RevokeSecurityGroupIngress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RevokeSecurityGroupIngress.html) action.

**Relationships**

  * `cloudify.relationships.contained_in`:
    * `cloudify.nodes.aws.ec2.SecurityGroup`: The group to create the rule on.
  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.SecurityGroup`: Make sure that the target group already exists.

### Security Group Rule Examples

See the Security Group Examples.

## **cloudify.nodes.aws.ec2.SecurityGroupRuleEgress**

This node type refers to an ingress rule.

**Resource Config**

  * `IpPermissions`: List. A list of IP Permissions.

For more information, and possible keyword arguments, see: [EC2:authorize_security_group_egress](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.authorize_security_group_egress)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [AuthorizeSecurityGroupEgress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AuthorizeSecurityGroupEgress.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [RevokeSecurityGroupEgress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RevokeSecurityGroupEgress.html) action.

**Relationships**

  * `cloudify.relationships.contained_in`:
    * `cloudify.nodes.aws.ec2.SecurityGroup`: The group to create the rule on.
  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.SecurityGroup`: Make sure that the target group already exists.

### Security Group Rule Examples

See the Security Group Examples.

## **cloudify.nodes.aws.ec2.SecurityGroup**

This node type refers to an AWS Security Group

**Resource Config**

  * `Description`: String. Some arbitrary description.
  * `GroupName`: String. A name for the group.
  * `VpcId`: String. The ID of the VPC to create the group in. Alternately use a relationship. 

For more information, and possible keyword arguments, see: [EC2:create_security_group](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_security_group)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateSecurityGroup](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateSecurityGroup.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [DeleteSecurityGroup](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteSecurityGroup.html) action.

**Relationships**

  * `cloudify.relationships.contained_in`:
    * `cloudify.nodes.aws.ec2.Vpc`: Create in a certain VPC.

### Security Group Examples

**Create a simple security group**

```yaml
  my_security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      resource_config:
        GroupName: MyGroup
        Description: The group for my instances.
        VpcId: { get_input: vpc }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
```

**Create two security groups with strict rules**

This example demonstrates a scenario where SSH in only allowed in one direction from `my_security_group1` to `my_security_group2`.

```yaml
  my_security_group1:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      resource_config:
        GroupName: MyGroup
        Description: The group for my instances.
        VpcId: { get_input: vpc }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }

  my_security_group2:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      resource_config:
        GroupName: MyGroup
        Description: The group for my instances.
        VpcId: { get_input: vpc }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }

  ingress_rules:
    type: cloudify.nodes.aws.ec2.SecurityGroupRuleIngress
    properties:
      resource_config:
        IpPermissions:
          - IpProtocol: tcp
            FromPort: 22
            ToPort: 22
            UserIdGroupPairs:
              - { GroupId: { get_attribute: [ my_security_group1, aws_resource_id ] } }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
    - type: cloudify.relationships.contained_in
      target: my_security_group2
    - type: cloudify.relationships.depends_on
      target: my_security_group1

  egress_rules:
    type: cloudify.nodes.aws.ec2.SecurityGroupRuleEgress
    properties:
      resource_config:
        IpPermissions:
          - FromPort: 22
            ToPort: 22
            IpProtocol: tcp
            UserIdGroupPairs:
            - GroupId: { get_attribute: [ my_security_group2, aws_resource_id ] }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
    - type: cloudify.relationships.contained_in
      target: my_security_group1
    - type: cloudify.relationships.depends_on
      target: my_security_group2
```

## **cloudify.nodes.aws.ec2.ElasticIP**

This node type refers to an AWS Elastic IP.

**Resource Config**

  * `Domain`: String. Default is vpc.

For more information, and possible keyword arguments, see: [EC2:allocate_address](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.allocate_address)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [AllocateAddress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AllocateAddress.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [AssociateAddress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AssociateAddress.html) action.
  * `cloudify.interfaces.lifecycle.stop`: Executes the [DisassociateAddress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DisassociateAddress.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [ReleaseAddress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ReleaseAddress.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Interface`: Connect to a certain ENI.

### Elastic IP Examples

**Connecting a VM to a nic and an IP**

Create an IP and have it attached to a VM and a NIC.

```yaml
  vm:
    type: cloudify.nodes.aws.ec2.Instances
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        ImageId: { get_input: ami }
        InstanceType: { get_input: instance_type }
    relationships:
      - type: cloudify.relationships.depends_on
        target: ip
      - type: cloudify.relationships.depends_on
        target: nic

  ip:
    type: cloudify.nodes.aws.ec2.ElasticIP
    properties:
      Domain: vpc
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.depends_on
        target: nic

  nic:
    type: cloudify.nodes.aws.ec2.Interface
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Description: IP-VM-NIC Example.
          SubnetId: { get_input: subnet_id }
          Groups:
            - { get_input: security_group_id }

```

## **cloudify.nodes.aws.ec2.Interface**

This node type refers to an AWS ENI.

For more information, and possible keyword arguments, see: [EC2:create_network_interface](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_network_interface).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateNetworkInterface](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNetworkInterface.html) action. It will also execute a [ModifyNetworkInterfaceAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyNetworkInterfaceAttribute.html) action if the key `modify_network_interface_attribute_args` is provided in the inputs to the operation.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [DeleteNetworkInterface](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteNetworkInterface.html) action.
  * `cloudify.interfaces.lifecycle.modify_network_interface_attribute`: Executes the [ModifyNetworkInterfaceAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceAttribute.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Subnet`: Connect to a certain Subnet.
    * `cloudify.nodes.aws.ec2.SecurityGroup`: Connect to a certain Security group.

### Interface Examples

**Create an ENI and set SourceDestCheck to false**

Specify a relationship to a subnet and the Instance will be created in that subnet.

```yaml
  my_eni:
    type: cloudify.nodes.aws.ec2.Interface
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Description: MyENI.
          SubnetId: { get_input: subnet_id }
          Groups:
            - { get_input: security_group_id }
    interfaces:
      cloudify.interfaces.lifecycle:
        configure:
          inputs:
            modify_network_interface_attribute_args:
              SourceDestCheck:
                Value: false
```

**Create an ENI in a subnet and security group via relationship**

```yaml
  my_eni:
    type: cloudify.nodes.aws.ec2.Interface
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Description: MyENI.
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet
      - type: cloudify.relationships.depends_on
        target: security_group
```


## **cloudify.nodes.aws.ec2.Keypair**


This node type refers to an AWS Keypair

**Resource Config**

  * `KeyName`: String. The name of the key pair. The node instance ID will be used if this is empty.
  * `PublicKeyMaterial`: String. If PublicKeyMaterial is provided, the import_key_pair operation is executed instead of create_key_pair.

For more information, and possible keyword arguments, see: [EC2:create_key_pair](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_key_pair)

**Properties**

  * `log_create_response`: Boolean. Opt-in to storing the create API request. Not recommended, will log private key material.
  * `store_in_runtime_properties`: Boolean. Opt-in to save the KeyPair KeyMaterial in the node-instance runtime-properties. Not recommended.
  * `create_secret`: Boolean. Opt-in to save the KeyPair KeyMaterial in the secret store. Only available in Cloudify Manager.
  * `secret_name`: String. The name of the secret if `create_secret` is `true`.
  * `update_existing_secret`: String. If `secret_name` already exists, overwrite the value.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateKeyPair](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateKeyPair.html) action or the [ImportKeyPair](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ImportKeyPair.html) action. If `store_in_runtime_properties` is `true`, it will store the KeyMaterial along with all the other values from the API response in the `create_response` runtime property. If `create_secret` is provided, it will create a secret with the name `secret_name`. If `secret_name` is not provided it will use the `KeyName` parameter. If `update_existing_secret` is `false` and the secret already exists, the operation will fail.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [DeleteKeyPair](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteKeyPair.html) action.
  
### Keypair Examples

**Create a Keypair and save to a secret**

```yaml
  my_key:
    type: cloudify.nodes.aws.ec2.Keypair
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      log_create_response: false
      store_in_runtime_properties: false
      create_secret: true
      secret_name: agent_key_private
      update_existing_secret: true
```

## **cloudify.nodes.aws.ec2.NATGateway**
## **cloudify.nodes.aws.ec2.NetworkACL**
## **cloudify.nodes.aws.ec2.NetworkAclEntry**
## **cloudify.nodes.aws.ec2.Route**
## **cloudify.nodes.aws.ec2.RouteTable**
## **cloudify.nodes.aws.ec2.SecurityGroup**
## **cloudify.nodes.aws.ec2.SecurityGroupRuleEgress**
## **cloudify.nodes.aws.ec2.Tags**
## **cloudify.nodes.aws.ec2.VpcPeering**
## **cloudify.nodes.aws.ec2.VpcPeeringRejectRequest**
## **cloudify.nodes.aws.ec2.VpcPeeringRequest**
## **cloudify.nodes.aws.ec2.VPNConnection**
## **cloudify.nodes.aws.ec2.VPNConnectionRoute**
## **cloudify.nodes.aws.ec2.VPNGateway**
## **cloudify.nodes.aws.autoscaling.Group**


This node type refers to an AWS AutoScaling Group

For more information, and possible keyword arguments, see: [Autoscaling:create_autoscaling_group](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/autoscaling.html#AutoScaling.Client.create_auto_scaling_group).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateAutoScalingGroup](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_CreateAutoScalingGroup.html) action.
  * `cloudify.interfaces.lifecycle.stop`: Stops all instances associated with auto scaling group before removing them [UpdateAutoScalingGroup] (https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_UpdateAutoScalingGroup.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteAutoScalingGroup](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_DeleteAutoScalingGroup.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Subnet`: Connect to a certain Subnet.
    * `cloudify.nodes.aws.autoscaling.LaunchConfiguration`: Connect it to LaunchConfiguration.

### AutoScaling Group Examples

**Create a AutoScaling in a subnet via relationship**

```yaml
  my_autoscaling_group:
    type: cloudify.nodes.aws.autoscaling.Group
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          AutoScalingGroupName: autoscaling_group
          MinSize: 1
          MaxSize: 1
          DesiredCapacity: 1
          DefaultCooldown: 20
          AvailabilityZones:
            - { get_property: [ subnet, resource_config, kwargs, AvailabilityZone ] }
          VPCZoneIdentifier: { concat: [ { get_attribute: [ subnet, aws_resource_id ] }  ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: launch_configuration
      - type: cloudify.relationships.depends_on
        target: subnet
    interfaces:
      cloudify.interfaces.lifecycle:
        delete:
          implementation: aws.cloudify_aws.autoscaling.resources.autoscaling_group.delete
          inputs:
            resource_config:
              ForceDelete: true
              
  launch_configuration:
    type: cloudify.nodes.aws.autoscaling.LaunchConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          ImageId: ami-037a92bf1efdb11a2
          InstanceType: t2.large
          LaunchConfigurationName: container_instance
          IamInstanceProfile: { get_attribute: [ instance_profile, aws_resource_arn ] }
          KeyName: { get_property: [ key, resource_config,  KeyName] }
          AssociatePublicIpAddress: True
          SecurityGroups:
            - { get_attribute: [ securitygroup, aws_resource_id ] }
          BlockDeviceMappings:
            - DeviceName: /dev/sdh
              Ebs:
                VolumeSize: 22
                VolumeType: standard
    relationships:
      - type: cloudify.relationships.depends_on
        target: securitygroup
      - type: cloudify.relationships.depends_on
        target: instance_profile
      - type: cloudify.relationships.depends_on
        target: key

  key:
    type: cloudify.nodes.aws.ec2.Keypair
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        KeyName: test-key
      store_in_runtime_properties: true

  securitygroup:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          GroupName: SecurityGroup
          Description: Example Security Group
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  instance_profile:
    type: cloudify.nodes.aws.iam.InstanceProfile
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: cfy_instance_profile
      resource_config:
        kwargs:
          InstanceProfileName: cfy_instance_profile
          Path: '/cfy_instance_profile/'
    relationships:
      - type: cloudify.relationships.depends_on
        target: iam_role

  iam_role:
    type: cloudify.nodes.aws.iam.Role
    properties:
      resource_id: instance_iam_role
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Path: !!str /instance-role/
          AssumeRolePolicyDocument:
            Version: !!str 2012-10-17
            Statement:
            - Effect: Allow
              Principal:
                Service: !!str ec2.amazonaws.com
              Action: !!str sts:AssumeRole
    relationships:
      - type: cloudify.relationships.aws.iam.role.connected_to
        target: policy_access

  policy_access:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      resource_id: instance_access_policy
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Description: >-
            Grants access for ECS agent to Amazon ECS API
          Path: !!str /ecs-instance-access/
          PolicyDocument:
            Version: !!str 2012-10-17
            Statement:
              - Effect: Allow
                Action:
                  - !!str ecs:CreateCluster
                  - !!str ecs:DeregisterContainerInstance
                  - !!str ecs:DiscoverPollEndpoint
                  - !!str ecs:Poll
                  - !!str ecs:RegisterContainerInstance
                  - !!str ecs:StartTelemetrySession
                  - !!str ecs:UpdateContainerInstancesState
                  - !!str ecs:Submit*
                  - !!str ecr:GetAuthorizationToken
                  - !!str ecr:BatchCheckLayerAvailability
                  - !!str ecr:GetDownloadUrlForLayer
                  - !!str ecr:BatchGetImage
                  - !!str logs:CreateLogStream
                  - !!str logs:PutLogEvents
                Resource: '*'

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: VPC

```


## **cloudify.nodes.aws.autoscaling.LaunchConfiguration**


This node type refers to an AWS Launch Configuration

For more information, and possible keyword arguments, see: [LaunchConfiguration:create_launch_configuration](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/autoscaling.html#AutoScaling.Client.create_launch_configuration).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateLaunchConfiguration](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_CreateLaunchConfiguration.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteLaunchConfiguration](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_DeleteLaunchConfiguration.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Keypair`: Associate with a certain key.
    * `cloudify.nodes.aws.ec2.SecurityGroup`: Connect to a certain security group.
    * `cloudify.nodes.aws.iam.InstanceProfile`: Associate with an instance profile.
    * `cloudify.nodes.aws.ec2.Instances`: Associate with ec2 instance

### LaunchConfiguration Examples

**Create a Launch Configuration connect it to security group and associate it with key and instance profile via relationship**

```yaml
  my_launch_configuration:
    type: cloudify.nodes.aws.autoscaling.LaunchConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          LaunchConfigurationName: test_lauchconfiguration_name
    relationships:
      - type: cloudify.relationships.depends_on
        target: instance

  instance:
    type: cloudify.nodes.aws.ec2.Instances
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      agent_config:
        install_method: none
      resource_config:
        MaxCount: 1
        MinCount: 1
        ImageId: { get_attribute: [ ubuntu_trusty_ami, aws_resource_id ] }
        InstanceType: t2.large
    relationships:
    - type: cloudify.relationships.depends_on
      target: subnet
    - type: cloudify.relationships.depends_on
      target: ubuntu_trusty_ami

  ubuntu_trusty_ami:
    type: cloudify.nodes.aws.ec2.Image
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Filters:
          - Name: name
            Values:
            - 'ubuntu/images/hvm-ssd/ubuntu-trusty-14.04-amd64-server-20170727'
          - Name: owner-id
            Values:
            - '099720109477'

  
  subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: { get_input: public_subnet_cidr }
        AvailabilityZone: { get_input: availability_zone }
    relationships:
    - type: cloudify.relationships.depends_on
      target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: { get_input: vpc_cidr }   
```

```yaml
  my_launch_configuration:
    type: cloudify.nodes.aws.autoscaling.LaunchConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          ImageId: ami-037a92bf1efdb11a2
          InstanceType: t2.large
          LaunchConfigurationName: container_instance
          IamInstanceProfile: { get_attribute: [ instance_profile, aws_resource_arn ] }
          KeyName: { get_property: [ key, resource_config,  KeyName] }
          AssociatePublicIpAddress: True
          SecurityGroups:
            - { get_attribute: [ securitygroup, aws_resource_id ] }
          BlockDeviceMappings:
            - DeviceName: /dev/sdh
              Ebs:
                VolumeSize: 22
                VolumeType: standard
    relationships:
      - type: cloudify.relationships.depends_on
        target: securitygroup
      - type: cloudify.relationships.depends_on
        target: instance_profile
      - type: cloudify.relationships.depends_on
        target: key

  key:
    type: cloudify.nodes.aws.ec2.Keypair
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        KeyName: test-key
      store_in_runtime_properties: true

  securitygroup:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          GroupName: SecurityGroup
          Description: Example Security Group
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  instance_profile:
    type: cloudify.nodes.aws.iam.InstanceProfile
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: cfy_instance_profile
      resource_config:
        kwargs:
          InstanceProfileName: cfy_instance_profile
          Path: '/cfy_instance_profile/'
    relationships:
      - type: cloudify.relationships.depends_on
        target: iam_role

  iam_role:
    type: cloudify.nodes.aws.iam.Role
    properties:
      resource_id: instance_iam_role
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Path: !!str /instance-role/
          AssumeRolePolicyDocument:
            Version: !!str 2012-10-17
            Statement:
            - Effect: Allow
              Principal:
                Service: !!str ec2.amazonaws.com
              Action: !!str sts:AssumeRole
    relationships:
      - type: cloudify.relationships.aws.iam.role.connected_to
        target: policy_access

  policy_access:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      resource_id: instance_access_policy
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Description: >-
            Grants access for ECS agent to Amazon ECS API
          Path: !!str /instance-access/
          PolicyDocument:
            Version: !!str 2012-10-17
            Statement:
              - Effect: Allow
                Action:
                  - !!str ecs:CreateCluster
                  - !!str ecs:DeregisterContainerInstance
                  - !!str ecs:DiscoverPollEndpoint
                  - !!str ecs:Poll
                  - !!str ecs:RegisterContainerInstance
                  - !!str ecs:StartTelemetrySession
                  - !!str ecs:UpdateContainerInstancesState
                  - !!str ecs:Submit*
                  - !!str ecr:GetAuthorizationToken
                  - !!str ecr:BatchCheckLayerAvailability
                  - !!str ecr:GetDownloadUrlForLayer
                  - !!str ecr:BatchGetImage
                  - !!str logs:CreateLogStream
                  - !!str logs:PutLogEvents
                Resource: '*'

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: VPC
```


## **cloudify.nodes.aws.autoscaling.LifecycleHook**


This node type refers to an AWS Lifecycle Hook

For more information, and possible keyword arguments, see: [LifecycleHook:put_lifecycle_hook](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/autoscaling.html#AutoScaling.Client.put_lifecycle_hook).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PutLifecycleHook](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_PutLifecycleHook.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteLifecycleHook](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_DeleteLifecycleHook.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.autoscaling.Group`: Connect to auto scaling group.

### LifecycleHook Examples

**Create a Lifecycle Hook and add it to auto scaling group via relationship**

```yaml
  my_lifecycle_hook:
    type: cloudify.nodes.aws.autoscaling.LifecycleHook
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          LifecycleHookName: lifecycle_hook_name
          LifecycleTransition: autoscaling:EC2_INSTANCE_LAUNCHING
    relationships:
      - type: cloudify.relationships.depends_on
        target: autoscaling_group

  autoscaling_group:
    type: cloudify.nodes.aws.autoscaling.Group
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: autoscaling_group
      resource_config:
        kwargs:
          AutoScalingGroupName: autoscaling_group
          MinSize: 2
          MaxSize: 4
          DesiredCapacity: 2
          DefaultCooldown: 20
          AvailabilityZones:
            - { concat: [ { get_input: aws_region_name }, 'a' ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: launch_configuration
    interfaces:
      cloudify.interfaces.lifecycle:
        delete:
          implementation: aws.cloudify_aws.autoscaling.resources.autoscaling_group.delete
          inputs:
            resource_config:
              ForceDelete: true

  launch_configuration:
    type: cloudify.nodes.aws.autoscaling.LaunchConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          ImageId: ami-e1496384
          InstanceType: t2.micro
          LaunchConfigurationName: launch_configuration
```
## **cloudify.nodes.aws.autoscaling.NotificationConfiguration**


This node type refers to an AWS Auto Scaling Notification Configuration

For more information, and possible keyword arguments, see: [NotificationConfiguration:put_notification_configuration](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/autoscaling.html#AutoScaling.Client.put_notification_configuration).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PutNotificationConfiguration](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_PutNotificationConfiguration.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteNotificationConfiguration](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_DeleteNotificationConfiguration.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.autoscaling.Group`: Connect to auto scaling group.
    * `cloudify.nodes.aws.SNS.Topic`: Connect to sns topic.

### NotificationConfiguration Examples

**Create a Notification Configuration add it to auto scaling group and associate it with sns topic via relationship**

```yaml
  my_notification_configuration:
    type: cloudify.nodes.aws.autoscaling.NotificationConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          NotificationTypes:
            - autoscaling:TEST_NOTIFICATION
    relationships:
      - type: cloudify.relationships.depends_on
        target: autoscaling_group
      - type: cloudify.relationships.depends_on
        target: topic

  topic:
    type: cloudify.nodes.aws.SNS.Topic
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Name: topic

  autoscaling_group:
    type: cloudify.nodes.aws.autoscaling.Group
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          AutoScalingGroupName: pmcfy_as
          MinSize: 1
          MaxSize: 1
          DefaultCooldown: 300
          AvailabilityZones:
          - { concat: [ { get_input: aws_region_name }, 'a' ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: launch_configuration
    interfaces:
      cloudify.interfaces.lifecycle:
        delete:
          implementation: aws.cloudify_aws.autoscaling.resources.autoscaling_group.delete
          inputs:
            resource_config:
              ForceDelete: true

  launch_configuration:
    type: cloudify.nodes.aws.autoscaling.LaunchConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          ImageId: ami-e1496384
          InstanceType: t2.micro
          LaunchConfigurationName: launch_configuration

```
## **cloudify.nodes.aws.autoscaling.Policy**


This node type refers to an AWS Auto Scaling Policy

For more information, and possible keyword arguments, see: [Policy:put_scaling_policy](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/autoscaling.html#AutoScaling.Client.put_scaling_policy).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PutScalingPolicy](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_PutScalingPolicy.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeletePolicy](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_DeletePolicy.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.autoscaling.Group`: Connect to auto scaling group.

### AutoScaling Policy Examples

**Create a Launch Configuration and add it to auto scaling group via relationship**

```yaml
  my_autoscaling_policy:
    type: cloudify.nodes.aws.autoscaling.Policy
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          PolicyName: my_autoscaling_policy
          PolicyType: SimpleScaling
          AdjustmentType: ChangeInCapacity
          ScalingAdjustment: 1
    relationships:
      - type: cloudify.relationships.depends_on
        target: autoscaling_group

  autoscaling_group:
    type: cloudify.nodes.aws.autoscaling.Group
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: autoscaling_group
      resource_config:
        kwargs:
          AutoScalingGroupName: autoscaling_group
          MinSize: 2
          MaxSize: 4
          DesiredCapacity: 2
          DefaultCooldown: 20
          AvailabilityZones:
            - { concat: [ { get_input: aws_region_name }, 'a' ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: launch_configuration
    interfaces:
      cloudify.interfaces.lifecycle:
        delete:
          implementation: aws.cloudify_aws.autoscaling.resources.autoscaling_group.delete
          inputs:
            resource_config:
              ForceDelete: true

  launch_configuration:
    type: cloudify.nodes.aws.autoscaling.LaunchConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          ImageId: { get_input: launch_configuration_ami }
          InstanceType: { get_input: launch_configuration_instance_type }
          LaunchConfigurationName: pmcfy_lc

```
## **cloudify.nodes.aws.CloudFormation.Stack**


This node type refers to an AWS CloudFormation

For more information, and possible keyword arguments, see: [CloudFormation:create_stack](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cloudformation.html#CloudFormation.Client.create_stack).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateStack](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_CreateStack.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [DescribeStacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStacks.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteStack](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DeleteStack.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Keypair`: Associate with a certain key.
    * `cloudify.nodes.aws.ec2.SecurityGroup`: Connect to a certain security group.
    * `cloudify.nodes.aws.rds.ParameterGroup`: Associate with a certain key.
    * `cloudify.nodes.aws.rds.SubnetGroup`: Associate with a certain key.

### CloudFormation Examples

```yaml
  my_ec2_cloudformation:
    type: cloudify.nodes.aws.CloudFormation.Stack
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          StackName: EC2Instance
          Parameters:
          - ParameterKey: KeyName
            ParameterValue: { get_input: key_name }
          - ParameterKey: PrimaryIPAddress
            ParameterValue: '172.30.0.10'
          - ParameterKey: SecondaryIPAddress
            ParameterValue: '172.30.0.11'
          - ParameterKey: SubnetId
            ParameterValue: { get_attribute: [ public_subnet, aws_resource_id ] }
          - ParameterKey: VpcId
            ParameterValue: { get_attribute: [ vpc, aws_resource_id ] }
          TemplateURL: https://s3-ap-northeast-1.amazonaws.com/ecosystem-tests-no-delete/VPC_EC2_Instance_With_Multiple_Static_IPAddresses.yaml.txt
    relationships:
      - type: cloudify.relationships.depends_on
        target: key_pair

  key_pair:
    type: cloudify.nodes.aws.ec2.Keypair
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        KeyName: { get_input: key_name }
      store_in_runtime_properties: true
```

```yaml
  my_rds_cloudformation:
    type: cloudify.nodes.aws.CloudFormation.Stack
    properties:
      resource_id: cfn-test
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs: {}
    interfaces:
      cloudify.interfaces.lifecycle:
        configure:
          implementation: aws.cloudify_aws.cloudformation.resources.stack.create
          inputs:
            resource_config:
              StackName: cfn-test
              TemplateBody:
                AWSTemplateFormatVersion: "2010-09-09"
                Description: A sample template
                Outputs:
                  MyDBEndpointAddress:
                    Description: The RDS Instance address.
                    Value:
                      Fn::GetAtt: [MyDB, Endpoint.Address]
                  MyDBEndpointPort:
                    Description: The RDS Instance port.
                    Value:
                      Fn::GetAtt: [MyDB, Endpoint.Port]
                Resources:
                  MyDB:
                    Type: "AWS::RDS::DBInstance"
                    Properties:
                      AllocatedStorage: "100"
                      DBInstanceClass: { get_input: rds_db_instance_class }
                      Engine: "MySQL"
                      EngineVersion: "5.5"
                      Iops: "1000"
                      MasterUsername: MyUser
                      MasterUserPassword: MyPassword
                      VPCSecurityGroups:
                       - { get_attribute: [ rds_security_group, aws_resource_id ] }
                      DBParameterGroupName: { get_property: [ rds_parameter_group, resource_id ] }
                      DBSubnetGroupName: { get_property: [ rds_subnet_group, resource_id ] }
                    DeletionPolicy: "Snapshot"
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_security_group
      - type: cloudify.relationships.depends_on
        target: rds_parameter_group
      - type: cloudify.relationships.depends_on
        target: rds_subnet_group

  rds_security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: security_group
        Description: Security Group Example.
        VpcId:  { get_attribute: [ rds_vpc, aws_resource_id ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  rds_parameter_group:
    type: cloudify.nodes.aws.rds.ParameterGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-param-group
      resource_config:
        kwargs:
          DBParameterGroupFamily: mysql5.5
          Description: MySQL5.5 Parameter Group for Dev
    interfaces:
      cloudify.interfaces.lifecycle:
        configure:
          inputs:
            resource_config:
              Parameters:
                - ParameterName: time_zone
                  ParameterValue: US/Eastern
                  ApplyMethod: immediate
                - ParameterName: lc_time_names
                  ParameterValue: en_US
                  ApplyMethod: immediate

  rds_subnet_group:
    type: cloudify.nodes.aws.rds.SubnetGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-db-subnet-group
      resource_config:
        kwargs:
          DBSubnetGroupDescription: MySQL5.5 Subnet Group for Dev
    relationships:
      - type: cloudify.relationships.aws.rds.subnet_group.connected_to
        target: rds_subnet_1
      - type: cloudify.relationships.aws.rds.subnet_group.connected_to
        target: rds_subnet_2

  rds_subnet_1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: 10.10.3.0/24
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c'] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  rds_subnet_2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: 10.10.2.0/24
        AvailabilityZone: { get_input: availability_zone }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  security_group_rules:
    type: cloudify.nodes.aws.ec2.SecurityGroupRuleIngress
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        IpPermissions:
         - IpProtocol: "-1"
           FromPort: -1
           ToPort: -1
           IpRanges:
            - CidrIp: 0.0.0.0/0
           UserIdGroupPairs: [  { GroupId: { get_attribute: [ rds_security_group, aws_resource_id ] } } ]
    relationships:
      - type: cloudify.relationships.contained_in
        target: rds_security_group

  rds_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: 10.10.0.0/16
```

## **cloudify.nodes.aws.cloudwatch.Alarm**

This node type refers to an AWS CloudWatch Alarm

For more information, and possible keyword arguments, see: [CloudWatch Alarm:put_metric_alarm](http://boto3.readthedocs.io/en/latest/reference/services/cloudwatch.html#CloudWatch.Client.put_metric_alarm).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PutMetricAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteAlarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DeleteAlarms.html) action.

### CloudFormation Alarm Examples

```yaml
  my_alarm:
    type: cloudify.nodes.aws.cloudwatch.Alarm
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: { concat: [ {get_input: aws_region_name }, 'cwa' ] }
      resource_config:
        kwargs:
          AlarmName: cwa
          ActionsEnabled: true
          AlarmActions:
            - { concat: [ 'arn:aws:automate:', { get_input: aws_region_name }, ':ec2:terminate'] }
          ComparisonOperator: 'LessThanThreshold'
          Statistic: Minimum
          MetricName: CPUUtilization
          Namespace: AWS/EC2
          Period: 60
          EvaluationPeriods: 5
          Threshold: 60
```

## **cloudify.nodes.aws.cloudwatch.Event**

This node type refers to an AWS CloudWatch Event

For more information, and possible keyword arguments, see: [CloudWatch Event:put_events](http://boto3.readthedocs.io/en/latest/reference/services/events.html#CloudWatchEvents.Client.put_events).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PutEvents](https://docs.aws.amazon.com/AmazonCloudWatchEvents/latest/APIReference/API_PutEvents.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.cloudwatch.Target`: Associate with target to invoke when an event matches.

### CloudFormation Event Examples

```yaml
  my_event:
    type: cloudify.nodes.aws.cloudwatch.Event
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Entries:
            - Source: autoscaling.amazonaws.com
              Resources:
               - { concat: [ 'arn:aws:automate:', { get_input: aws_region_name }, ':ec2:terminate'] }
              DetailType: Cloudwatch Event Demo
              Detail: |
                {
                  "instance-id": "i-12345678",
                  "state": "terminated"
                }
    relationships:
      - type: cloudify.relationships.depends_on
        target: cloudwatch_target

  cloudwatch_target:
    type: cloudify.nodes.aws.cloudwatch.Target
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Targets:
            - Id : topic1
              Arn: { get_attribute: [ topic1, aws_resource_arn ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: cloudwatch_rule
      - type: cloudify.relationships.depends_on
        target: topic

  cloudwatch_rule:
    type: cloudify.nodes.aws.cloudwatch.Rule
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Name: test-cloudwatch1
          ScheduleExpression: "rate(5 minutes)"
          EventPattern: |
            {
              "detail-type": [
                "AWS API Call via CloudTrail"
              ],
              "detail": {
                "eventSource": [
                  "autoscaling.amazonaws.com"
                ]
              }
            }
          State: 'ENABLED'

  topic:
    type: cloudify.nodes.aws.SNS.Topic
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs: {}
```

## **cloudify.nodes.aws.cloudwatch.Rule**

This node type refers to an AWS CloudWatch Rule

**Resource Config**

For more information, and possible keyword arguments, see: [CloudWatch Rule:put_rule](http://boto3.readthedocs.io/en/latest/reference/services/events.html#CloudWatchEvents.Client.put_rule)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PutRule](https://docs.aws.amazon.com/AmazonCloudWatchEvents/latest/APIReference/API_PutRule.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteRule](https://docs.aws.amazon.com/AmazonCloudWatchEvents/latest/APIReference/API_DeleteRule.html) action.

### CloudFormation Rule Examples

```yaml
  my_cloudwatch_rule:
    type: cloudify.nodes.aws.cloudwatch.Rule
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Name: test-cloudwatch1
          ScheduleExpression: "rate(5 minutes)"
          EventPattern: |
            {
              "detail-type": [
                "AWS API Call via CloudTrail"
              ],
              "detail": {
                "eventSource": [
                  "autoscaling.amazonaws.com"
                ]
              }
            }
          State: 'ENABLED'

```
## **cloudify.nodes.aws.cloudwatch.Target**

This node type refers to an AWS CloudWatch Target

**Resource Config**

For more information, and possible keyword arguments, see: [CloudWatch Target:put_targets](http://boto3.readthedocs.io/en/latest/reference/services/events.html#CloudWatchEvents.Client.put_targets)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PutTargets](https://docs.aws.amazon.com/AmazonCloudWatchEvents/latest/APIReference/API_PutTargets.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [RemoveTargets](https://docs.aws.amazon.com/AmazonCloudWatchEvents/latest/APIReference/API_RemoveTargets.html) action.
  
**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.cloudwatch.Rule`:  Associate target with rule.
    * `cloudify.nodes.aws.SNS.Topic`: It could be any AWS target resources such as Topic, Lambda, etc..
    
### CloudFormation Target Examples

```yaml
  my_cloudwatch_target:
    type: cloudify.nodes.aws.cloudwatch.Target
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Targets:
            - Id : topic
              Arn: { get_attribute: [ topic1, aws_resource_arn ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: cloudwatch_rule
      - type: cloudify.relationships.depends_on
        target: topic

  cloudwatch_rule:
    type: cloudify.nodes.aws.cloudwatch.Rule
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Name: test-cloudwatch
          ScheduleExpression: "rate(5 minutes)"
          EventPattern: |
            {
              "detail-type": [
                "AWS API Call via CloudTrail"
              ],
              "detail": {
                "eventSource": [
                  "autoscaling.amazonaws.com"
                ]
              }
            }
          State: 'ENABLED'

  topic:
    type: cloudify.nodes.aws.SNS.Topic
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs: {}

```
## **cloudify.nodes.aws.dynamodb.Table**

This node type refers to an AWS DynamoDB Table

**Resource Config**
  
  * `TableName`: String. The name of the table to create.
  * `AttributeDefinitions`: List. An array of attributes that describe the key schema (dict) for the table and indexes. Keys are AttributeName, AttributeType.
  * `KeySchema`: List. Specifies the attributes that make up the primary key for a table or an index. The attributes in KeySchema must also be defined in the AttributeDefinitions array. For more information, see Data Model in the Amazon DynamoDB Developer Guide .
  * `LocalSecondaryIndexes`: List. One or more local secondary indexes (the maximum is five) to be created on the table. Each index is scoped to a given partition key value. There is a 10 GB size limit per partition key value; otherwise, the size of a local secondary index is unconstrained.
  * `GlobalSecondaryIndexes`: List. One or more global secondary indexes (the maximum is five) to be created on the table.
  * `BillingMode`: String. Controls how you are charged for read and write throughput and how you manage capacity. This setting can be changed later. Either 'PROVISIONED' or 'PAY_PER_REQUEST'.
  * `ProvisionedThroughput`: Map. Represents the provisioned throughput settings for a specified table or index. The settings can be modified using the UpdateTable operation.
  * `StreamSpecification`: Map. The settings for DynamoDB Streams on the table.
  * `SSESpecification`: Map. Represents the settings used to enable server-side encryption.

For more information, and possible keyword arguments, see: [DynamoDB:create_table](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.create_table)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateTable](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteTable](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteTable.html) action.
    
### DynamoDB Table Examples

```yaml
  my_dynamodb_table:
    type: cloudify.nodes.aws.dynamodb.Table
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        TableName: !!str abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.0123456789
        AttributeDefinitions:
          - AttributeName: RandomKeyUUID
            AttributeType: S
        KeySchema:
          - AttributeName: RandomKeyUUID
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 5
          WriteCapacityUnits: 5
```

## **cloudify.nodes.aws.ecs.Cluster**

This node type refers to an AWS ECS Cluster

**Resource Config**

For more information, and possible keyword arguments, see: [ECS Cluster:create_cluster](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ecs.html#ECS.Client.create_cluster)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateCluster](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CreateCluster.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteCluster](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DeleteCluster.html) action.
    
### ECS Cluster Examples

```yaml
  ecs_cluster:
    type: cloudify.nodes.aws.ecs.Cluster
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          clusterName: { get_input: ecs_cluster_name }
```

## **cloudify.nodes.aws.ecs.Service**

This node type refers to an AWS ECS Service

**Resource Config**

For more information, and possible keyword arguments, see: [ECS Service:create_service](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ecs.html#ECS.Client.create_service)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateService](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CreateService.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteService](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DeleteService.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ecs.Cluster`:  Associate service with cluster.
    * `cloudify.nodes.aws.ecs.TaskDefinition`:  Associate service with task definition.
    * `cloudify.nodes.aws.iam.Role`: Associate service with iam role
    * `cloudify.nodes.aws.elb.TargetGroup`: Associate service with load balancer target group

    
### ECS Service Examples

```yaml
  my_ecs_service:
    type: cloudify.nodes.aws.ecs.Service
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.depends_on
        target: ecs_cluster
      - type: cloudify.relationships.depends_on
        target: forward_target_group
      - type: cloudify.relationships.depends_on
        target: task_definition
      - type: cloudify.relationships.depends_on
        target: ecs_service_iam_role
    interfaces:
      cloudify.interfaces.lifecycle:
        configure:
          inputs:
            resource_config:
              serviceName: 'service_name'
              taskDefinition: { get_property: [ task_definition, resource_config, kwargs, family ] }
              desiredCount: 1
              role: { get_attribute: [ ecs_service_iam_role, aws_resource_arn ] }
              loadBalancers:
              - targetGroupArn: { get_attribute: [ forward_target_group, aws_resource_arn ] }
                containerName: { get_input: container_name }
                containerPort: { get_input: container_port }

  ecs_cluster:
    type: cloudify.nodes.aws.ecs.Cluster
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          clusterName: { get_input: ecs_cluster_name }

  task_definition:
    type: cloudify.nodes.aws.ecs.TaskDefinition
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          family: 'task_definition_1'
          containerDefinitions: [
            {
              "name": "wordpress",
              "links": [
                "mysql"
              ],
              "image": "wordpress",
              "essential": true,
              "portMappings": [
                {
                  "containerPort": 80,
                  "hostPort": 80
                }
              ],
              "memory": 500,
              "cpu": 10
            }, {
              "environment": [
                {
                  "name": "MYSQL_ROOT_PASSWORD",
                  "value": "password"
                }
              ],
              "name": "mysql",
              "image": "mysql",
              "cpu": 10,
              "memory": 500,
              "essential": true
            }]
    relationships:
      - type: cloudify.relationships.depends_on
        target: ecs_cluster

  forward_target_group:
    type: cloudify.nodes.aws.elb.TargetGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Name: test-elb-target-group
          Protocol: HTTP
          Port: 80
          HealthCheckProtocol: HTTP
          HealthCheckPort: '80'
          HealthCheckPath: '/wp-admin'
          HealthCheckIntervalSeconds: 30
          HealthCheckTimeoutSeconds: 20
          HealthyThresholdCount: 7
          UnhealthyThresholdCount: 7
          Matcher:
            HttpCode: '404'
          Attributes:
            - Key: stickiness.enabled
              Value: 'true'
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  ecs_service_iam_role:
    type: cloudify.nodes.aws.iam.Role
    properties:
      resource_id: ecs_service_iam_role
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Path: !!str /ecs-service-role/
          AssumeRolePolicyDocument:
            Version: !!str 2012-10-17
            Statement:
            - Effect: Allow
              Principal:
                Service: !!str ecs.amazonaws.com
              Action: !!str sts:AssumeRole
    relationships:
      - type: cloudify.relationships.aws.iam.role.connected_to
        target: ecs_service_access

  ecs_service_access:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      resource_id: ecs_service_access_policy
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Description: >-
            Grants access for ECS service to the Amazon EC2 and Elastic Load Balancing APIs
          Path: !!str /ecs-service-access/
          PolicyDocument:
            Version: !!str 2012-10-17
            Statement:
              - Effect: Allow
                Action:
                  - !!str ec2:AuthorizeSecurityGroupIngress
                  - !!str ec2:Describe*
                  - !!str elasticloadbalancing:DeregisterInstancesFromLoadBalancer
                  - !!str elasticloadbalancing:DeregisterTargets
                  - !!str elasticloadbalancing:Describe*
                  - !!str elasticloadbalancing:RegisterInstancesWithLoadBalancer
                  - !!str elasticloadbalancing:RegisterTargets
                Resource: '*'

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: VPC
```

## **cloudify.nodes.aws.ecs.TaskDefinition**

This node type refers to an AWS ECS Task Definition

**Resource Config**

For more information, and possible keyword arguments, see: [ECS TaskDefinition:register_task_definition](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ecs.html#ECS.Client.register_task_definition)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [RegisterTaskDefinition](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RegisterTaskDefinition.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeregisterTaskDefinition](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DeregisterTaskDefinition.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ecs.Cluster`:  Associate task definition with cluster.

### ECS Task Definition Examples

```yaml
  my_task_definition:
    type: cloudify.nodes.aws.ecs.TaskDefinition
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          family: 'task_definition_1'
          containerDefinitions: [
            {
              "name": "wordpress",
              "links": [
                "mysql"
              ],
              "image": "wordpress",
              "essential": true,
              "portMappings": [
                {
                  "containerPort": 80,
                  "hostPort": 80
                }
              ],
              "memory": 500,
              "cpu": 10
            }, {
              "environment": [
                {
                  "name": "MYSQL_ROOT_PASSWORD",
                  "value": "password"
                }
              ],
              "name": "mysql",
              "image": "mysql",
              "cpu": 10,
              "memory": 500,
              "essential": true
            }]
    relationships:
      - type: cloudify.relationships.depends_on
        target: ecs_cluster

  ecs_cluster:
    type: cloudify.nodes.aws.ecs.Cluster
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          clusterName: { get_input: ecs_cluster_name }
```

## **cloudify.nodes.aws.efs.FileSystem**

This node type refers to an AWS EFS File System

**Resource Config**

For more information, and possible keyword arguments, see: [EFS FileSystem:create_file_system](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/efs.html#EFS.Client.create_file_system)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateFileSystem](https://docs.aws.amazon.com/efs/latest/ug/API_CreateFileSystem.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteFileSystem](https://docs.aws.amazon.com/efs/latest/ug/API_DeleteFileSystem.html) action.

### EFS File System Examples

```yaml
   my_file_system:
    type: cloudify.nodes.aws.efs.FileSystem
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config: {}
```

## **cloudify.nodes.aws.efs.FileSystemTags**

This node type refers to an AWS EFS File System Tags

**Resource Config**

For more information, and possible keyword arguments, see: [EFS FileSystemTags:create_tags](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/efs.html#EFS.Client.create_tags)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateTags](https://docs.aws.amazon.com/efs/latest/ug/API_CreateTags.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteTags](https://docs.aws.amazon.com/efs/latest/ug/API_DeleteTags.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.efs.FileSystem`:  Associate tags with file system.

### EFS File System Tags Examples

```yaml
  my_file_system_tags:
    type: cloudify.nodes.aws.efs.FileSystemTags
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Tags:
          - Key: Name
            Value: file_system_tags
    relationships:
    - type: cloudify.relationships.depends_on
      target: file_system

  file_system:
    type: cloudify.nodes.aws.efs.FileSystem
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config: {}
```

## **cloudify.nodes.aws.efs.MountTarget**

This node type refers to an AWS EFS Mount Target

**Resource Config**

For more information, and possible keyword arguments, see: [EFS MountTarget:create_mount_target](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/efs.html#EFS.Client.create_mount_target)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateMountTarget](https://docs.aws.amazon.com/efs/latest/ug/API_CreateMountTarget.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteMountTarget](https://docs.aws.amazon.com/efs/latest/ug/API_DeleteMountTarget.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.efs.FileSystem`:  Associate mount target with file system.
    * `cloudify.nodes.aws.ec2.Subnet`:  Associate mount target with subnet.
    * `cloudify.nodes.aws.ec2.SecurityGroup`:  Associate mount target with security group.

### EFS Mount Target Examples

```yaml
  my_mount_target:
    type: cloudify.nodes.aws.efs.MountTarget
    properties:
      resource_config: {}
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
    - type: cloudify.relationships.depends_on
      target: security_group
    - type: cloudify.relationships.depends_on
      target: subnet
    - type: cloudify.relationships.depends_on
      target: file_system


  file_system:
    type: cloudify.nodes.aws.efs.FileSystem
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config: {}

  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          GroupName: security_group1
          Description: efs security group
          VpcId:  { get_attribute: [ vpc, aws_resource_id ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          CidrBlock: 172.30.0.0/24
          AvailabilityZone: { get_input: availability_zone }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          CidrBlock: 172.30.0.0/16
```

## **cloudify.nodes.aws.elb.Classic.HealthCheck**

This node type refers to an AWS Health Check For Classic Load Balancer

**Resource Config**

For more information, and possible keyword arguments, see: [ELB Classic HealthCheck:configure_health_check](http://boto3.readthedocs.io/en/latest/reference/services/elb.html#ElasticLoadBalancing.Client.configure_health_check)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [ConfigureHealthCheck](https://docs.aws.amazon.com/elasticloadbalancing/2012-06-01/APIReference/API_ConfigureHealthCheck.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.elb.Classic.LoadBalancer`:  Configure health check for classic load balancer.

### Classic ELB Health Check Examples

```yaml
  my_classic_health_check:
    type: cloudify.nodes.aws.elb.Classic.HealthCheck
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        HealthCheck:
          Target: HTTP:80/
          Interval: 15
          Timeout: 5
          UnhealthyThreshold: 2
          HealthyThreshold: 5
    relationships:
      - type: cloudify.relationships.depends_on
        target: classic_elb

  classic_elb:
    type: cloudify.nodes.aws.elb.Classic.LoadBalancer
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        LoadBalancerName: myclassicelb
        Listeners: { get_property: [ classic_elb_listener, resource_config, Listeners ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet1
      - type: cloudify.relationships.depends_on
        target: subnet2
      - type: cloudify.relationships.depends_on
        target: security_group

  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: SecurityGroup1
        Description: Example Security Group 1
      Tags:
        - Key: Name
          Value: MyGroup
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.1.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'a' ] }
      Tags:
      - Key: Name
        Value: MySubnet1
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.2.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c' ] }
      Tags:
        - Key: Name
          Value: MySubnet2
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: MyVPC
```

## **cloudify.nodes.aws.elb.Classic.Listener**

This node type refers to an AWS Listener For Classic Load Balancer

**Resource Config**
  
  * `LoadBalancerName`: String. The name of the load balancer.
  * `Listeners`: List. The listeners required to configure load balancer.

For more information, and possible keyword arguments, see: [ELB Classic Listener:create_load_balancer_listeners](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/elb.html#ElasticLoadBalancing.Client.create_load_balancer_listeners)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateLoadBalancerListeners](https://docs.aws.amazon.com/elasticloadbalancing/2012-06-01/APIReference/API_CreateLoadBalancerListeners.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteLoadBalancerListeners](https://docs.aws.amazon.com/elasticloadbalancing/2012-06-01/APIReference/API_DeleteLoadBalancerListeners.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.elb.Classic.LoadBalancer`:  Configure listener for classic load balancer.

### Classic ELB Listeners Examples

```yaml
  my_classic_elb_listener:
    type: cloudify.nodes.aws.elb.Classic.Listener
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Listeners:
        - Protocol: HTTP
          LoadBalancerPort: 80
          InstancePort: 8080
    relationships:
      - type: cloudify.relationships.depends_on
        target: classic_elb
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: aws.cloudify_aws.elb.resources.classic.load_balancer.start
          inputs:
            resource_config:
              LoadBalancerAttributes:
                CrossZoneLoadBalancing:
                  Enabled: true
                ConnectionSettings:
                  IdleTimeout: 120

  classic_elb:
    type: cloudify.nodes.aws.elb.Classic.LoadBalancer
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        LoadBalancerName: myclassicelb
        Listeners: { get_property: [ classic_elb_listener, resource_config, Listeners ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet1
      - type: cloudify.relationships.depends_on
        target: subnet2
      - type: cloudify.relationships.depends_on
        target: security_group

  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: SecurityGroup1
        Description: Example Security Group 1
      Tags:
        - Key: Name
          Value: MyGroup
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.1.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'a' ] }
      Tags:
      - Key: Name
        Value: MySubnet1
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.2.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c' ] }
      Tags:
        - Key: Name
          Value: MySubnet2
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: MyVPC
```

## **cloudify.nodes.aws.elb.Classic.LoadBalancer**

This node type refers to an AWS Classic Load Balancer

**Resource Config**
  
  * `LoadBalancerName`: String. The name of the load balancer.
  * `Listeners`: List. The listeners required to configure load balancer.

For more information, and possible keyword arguments, see: [ELB Classic:create_load_balancer](http://boto3.readthedocs.io/en/latest/reference/services/elb.html#ElasticLoadBalancing.Client.create_load_balancer)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateLoadBalancer](https://docs.aws.amazon.com/elasticloadbalancing/2012-06-01/APIReference/API_CreateLoadBalancer.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [ModifyLoadBalancerAttributes](https://docs.aws.amazon.com/elasticloadbalancing/2012-06-01/APIReference/API_ModifyLoadBalancerAttributes.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteLoadBalancer](https://docs.aws.amazon.com/elasticloadbalancing/2012-06-01/APIReference/API_DeleteLoadBalancer.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.SecurityGroup`:  Associate one or more security groups with load balancer.
    * `cloudify.nodes.aws.ec2.Subnet`:  Associate one or more subnets with load balancer.

### Classic ELB Examples

```yaml
  classic_elb:
    type: cloudify.nodes.aws.elb.Classic.LoadBalancer
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        LoadBalancerName: myclassicelb
        Listeners: { get_property: [ classic_elb_listener, resource_config, Listeners ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet1
      - type: cloudify.relationships.depends_on
        target: subnet2
      - type: cloudify.relationships.depends_on
        target: security_group

  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: SecurityGroup1
        Description: Example Security Group 1
      Tags:
        - Key: Name
          Value: MyGroup
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.1.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'a' ] }
      Tags:
      - Key: Name
        Value: MySubnet1
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.2.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c' ] }
      Tags:
        - Key: Name
          Value: MySubnet2
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: MyVPC
```

## **cloudify.nodes.aws.elb.Classic.Policy**

This node type refers to an AWS Policy For Classic Load Balancer

**Resource Config**
  
  * `LoadBalancerName`: String. The name of the load balancer.
  * `PolicyName`: String. The name of the load balancer policy to be created. This name must be unique within the set of policies for this load balancer.
  * `PolicyTypeName`: String. The name of the base policy type. To get the list of policy types, use DescribeLoadBalancerPolicyTypes.

For more information, and possible keyword arguments, see: [ELB Classic Policy:create_load_balancer_policy](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/elb.html#ElasticLoadBalancing.Client.create_load_balancer_policy)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateLoadBalancerPolicy](https://docs.aws.amazon.com/elasticloadbalancing/2012-06-01/APIReference/API_CreateLoadBalancerPolicy.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteLoadBalancerPolicy](https://docs.aws.amazon.com/elasticloadbalancing/2012-06-01/APIReference/API_DeleteLoadBalancerPolicy.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.elb.Classic.LoadBalancer`:  Configure policy for classic load balancer.

### Classic ELB Policy Examples

```yaml
  my_classic_policy:
    type: cloudify.nodes.aws.elb.Classic.Policy
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        PolicyName: myclassicpolicy
        PolicyTypeName: ProxyProtocolPolicyType
        kwargs:
          PolicyAttributes:
            - AttributeName: ProxyProtocol
              AttributeValue: 'true'
    relationships:
      - type: cloudify.relationships.depends_on
        target: classic_elb

  classic_elb:
    type: cloudify.nodes.aws.elb.Classic.LoadBalancer
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        LoadBalancerName: myclassicelb
        Listeners: { get_property: [ classic_elb_listener, resource_config, Listeners ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet1
      - type: cloudify.relationships.depends_on
        target: subnet2
      - type: cloudify.relationships.depends_on
        target: security_group

  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: SecurityGroup1
        Description: Example Security Group 1
      Tags:
        - Key: Name
          Value: MyGroup
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.1.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'a' ] }
      Tags:
      - Key: Name
        Value: MySubnet1
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.2.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c' ] }
      Tags:
        - Key: Name
          Value: MySubnet2
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: MyVPC
```

## **cloudify.nodes.aws.elb.Classic.Policy.Stickiness**

This node type refers to an AWS Policy Stickiness For Classic Load Balancer

**Resource Config**
  
  * `LoadBalancerName`: String. The name of the load balancer.
  * `PolicyName`: String. The name of the load balancer policy to be created. This name must be unique within the set of policies for this load balancer.
  * `CookieExpirationPeriod`: Integer. The time period, in seconds, after which the cookie should be considered stale.

For more information, and possible keyword arguments, see: [ELB Classic PolicyStickiness:create_lb_cookie_stickiness_policy](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/elb.html#ElasticLoadBalancing.Client.create_lb_cookie_stickiness_policy)

**Operations**

  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateLBCookieStickinessPolicy](https://docs.aws.amazon.com/elasticloadbalancing/2012-06-01/APIReference/API_CreateLBCookieStickinessPolicy.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [SetLoadBalancerPoliciesOfListener](https://docs.aws.amazon.com/elasticloadbalancing/2012-06-01/APIReference/API_SetLoadBalancerPoliciesOfListener.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.elb.Classic.LoadBalancer`:  Configure policy stickiness for classic load balancer.

### Classic ELB Policy Stickiness Examples

```yaml
  my_classic_stickiness_policy:
    type: cloudify.nodes.aws.elb.Classic.Policy.Stickiness
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        PolicyName: myclassicstickinesspolicy
        CookieExpirationPeriod: 3600
    relationships:
      - type: cloudify.relationships.depends_on
        target: classic_elb

  classic_elb:
    type: cloudify.nodes.aws.elb.Classic.LoadBalancer
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        LoadBalancerName: myclassicelb
        Listeners: { get_property: [ classic_elb_listener, resource_config, Listeners ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet1
      - type: cloudify.relationships.depends_on
        target: subnet2
      - type: cloudify.relationships.depends_on
        target: security_group

  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: SecurityGroup1
        Description: Example Security Group 1
      Tags:
        - Key: Name
          Value: MyGroup
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.1.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'a' ] }
      Tags:
      - Key: Name
        Value: MySubnet1
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.2.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c' ] }
      Tags:
        - Key: Name
          Value: MySubnet2
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: MyVPC
```

## **cloudify.nodes.aws.elb.Listener**

This node type refers to an AWS ELB V2 Listener

**Resource Config**
  
  * `Protocol`: String. The protocol for connections from clients to the load balancer. For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocol is TCP.
  * `Port`: Integer. The port on which the load balancer is listening.
  * `DefaultActions`: List. The actions for the default rule.

For more information, and possible keyword arguments, see: [ELB V2 Listener:create_listener](http://boto3.readthedocs.io/en/latest/reference/services/elbv2.html#ElasticLoadBalancingv2.Client.create_listener)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateListener](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateListener.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteListener](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DeleteListener.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.elb.LoadBalancer`:  Associate listener with load balancer (Application | NetWork).
    * `cloudify.nodes.aws.elb.TargetGroup`:  Associate listener with target group.

### Classic ELB Policy Examples

```yaml
  my_http_listener:
    type: cloudify.nodes.aws.elb.Listener
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Protocol: HTTP
        Port: 8080
        DefaultActions:
          - Type: redirect
            RedirectConfig:
              Protocol: HTTP
              Port: '8080'
              Host: www.example.com
              Path: /
              StatusCode: HTTP_301
    relationships:
      - type: cloudify.relationships.depends_on
        target: elb
      - type: cloudify.relationships.depends_on
        target: forward_target_group

  elb:
    type: cloudify.nodes.aws.elb.LoadBalancer
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Name: test-elb
        kwargs:
          Attributes:
            - Key: idle_timeout.timeout_seconds
              Value: '120'
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet1
      - type: cloudify.relationships.depends_on
        target: subnet2
      - type: cloudify.relationships.depends_on
        target: security_group

  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
          CidrBlock: '10.0.1.0/24'
          AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c' ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
          CidrBlock: '10.0.2.0/24'
          AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'a' ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'        
```

## **cloudify.nodes.aws.elb.LoadBalancer**

This node type refers to an AWS ELB V2 (Application | NetWork)

**Resource Config**
  
  * `Name`: String. The name of the load balancer.

For more information, and possible keyword arguments, see: [ELB V2:create_load_balancer](http://boto3.readthedocs.io/en/latest/reference/services/elbv2.html#ElasticLoadBalancingv2.Client.create_load_balancer)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateLoadBalancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateLoadBalancer.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [ModifyLoadBalancerAttributes](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_ModifyLoadBalancerAttributes.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteLoadBalancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DeleteLoadBalancer.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.SecurityGroup`:  Associate one or more security groups with load balancer.
    * `cloudify.nodes.aws.ec2.Subnet`:  Associate one or more subnets with load balancer.

### Classic ELB Examples

```yaml
  my_elb:
    type: cloudify.nodes.aws.elb.LoadBalancer
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Name: test-elb
        kwargs:
          Attributes:
            - Key: idle_timeout.timeout_seconds
              Value: '120'
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet1
      - type: cloudify.relationships.depends_on
        target: subnet2
      - type: cloudify.relationships.depends_on
        target: security_group


  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
          CidrBlock: '10.0.1.0/24'
          AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c' ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
          CidrBlock: '10.0.2.0/24'
          AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'a' ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'        
```

## **cloudify.nodes.aws.elb.Rule**

This node type refers to an AWS ELB V2 Rule

**Resource Config**
  
  * `Conditions`: List. The conditions. Each condition specifies a field name and a single value.
  * `Priority`: Integer. The rule priority. A listener can't have multiple rules with the same priority.
  * `Actions`: List. The actions. Each rule must include exactly one of the following types of actions - forward, fixed-response, or redirect.

For more information, and possible keyword arguments, see: [ELB V2 Rule:create_rule](http://boto3.readthedocs.io/en/latest/reference/services/elbv2.html#ElasticLoadBalancingv2.Client.create_rule)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateRule](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateRule.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteRule](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DeleteRule.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.elb.Listener`:  Associate rule with listener.
    * `cloudify.nodes.aws.elb.TargetGroup`:  Associate rule with target group.

### Classic ELB Rule Examples

```yaml
  my_forward_rule:
    type: cloudify.nodes.aws.elb.Rule
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Priority: 101
        Conditions:
          - Field: 'host-header'
            Values:
              - example.com
        Actions:
          - Type: forward
            TargetGroupArn: { get_attribute: [ forward_target_group, aws_resource_arn ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: http_listener
      - type: cloudify.relationships.depends_on
        target: forward_target_group
    interfaces:
      cloudify.interfaces.lifecycle:
        configure:
          implementation: aws.cloudify_aws.elb.resources.rule.create
          inputs:
            resource_config:
              Priority: 101
              Conditions:
                - Field: 'host-header'
                  Values:
                    - example.com
              Actions:
                - Type: forward
                  TargetGroupArn: { get_attribute: [ forward_target_group, aws_resource_arn ] }
  
  http_listener:
    type: cloudify.nodes.aws.elb.Listener
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Protocol: HTTP
        Port: 8080
        DefaultActions:
          - Type: redirect
            RedirectConfig:
              Protocol: HTTP
              Port: '8080'
              Host: www.example.com
              Path: /
              StatusCode: HTTP_301
    relationships:
      - type: cloudify.relationships.depends_on
        target: elb
      - type: cloudify.relationships.depends_on
        target: forward_target_group

  forward_target_group:
    type: cloudify.nodes.aws.elb.TargetGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Name: test-elb-target-group
        Protocol: HTTP
        Port: 8080
        HealthCheckProtocol: HTTP
        HealthCheckPort: '80'
        kwargs:
          HealthCheckIntervalSeconds: 30
          HealthCheckTimeoutSeconds: 5
          UnhealthyThresholdCount: 3
          Matcher:
            HttpCode: '404'
          Attributes:
            - Key: stickiness.enabled
              Value: 'true'
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  elb:
    type: cloudify.nodes.aws.elb.LoadBalancer
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Name: test-elb
        kwargs:
          Attributes:
            - Key: idle_timeout.timeout_seconds
              Value: '120'
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet1
      - type: cloudify.relationships.depends_on
        target: subnet2
      - type: cloudify.relationships.depends_on
        target: security_group

  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: SecurityGroup1
        Description: Example Security Group 1
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
          CidrBlock: '10.0.1.0/24'
          AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c' ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
          CidrBlock: '10.0.2.0/24'
          AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'a' ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
       
```

## **cloudify.nodes.aws.elb.TargetGroup**

This node type refers to an AWS ELB V2 Target Group

**Resource Config**
  
  * `Name`: String. The name of the target group.
  * `Protocol`: String. The protocol to use for routing traffic to the targets.
  * `Actions`: String. The port on which the targets receive traffic.
  * `HealthCheckProtocol`: String. The protocol the load balancer uses when performing health checks on targets.
  * `HealthCheckPort`: String. The port the load balancer uses when performing health checks on targets.

For more information, and possible keyword arguments, see: [ELB V2 TargetGroup:create_target_group](http://boto3.readthedocs.io/en/latest/reference/services/elbv2.html#ElasticLoadBalancingv2.Client.create_target_group)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateTargetGroup](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateTargetGroup.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [ModifyTargetGroupAttributes](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_ModifyTargetGroupAttributes.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteTargetGroup](https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_DeleteTargetGroup.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Vpc`:  Associate target group with vpc.

### Classic ELB Target Group Examples

```yaml
  my_forward_target_group:
    type: cloudify.nodes.aws.elb.TargetGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Name: test-elb-target-group
        Protocol: HTTP
        Port: 8080
        HealthCheckProtocol: HTTP
        HealthCheckPort: '80'
        kwargs:
          HealthCheckIntervalSeconds: 30
          HealthCheckTimeoutSeconds: 5
          UnhealthyThresholdCount: 3
          Matcher:
            HttpCode: '404'
          Attributes:
            - Key: stickiness.enabled
              Value: 'true'
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
       
```
## **cloudify.nodes.aws.iam.AccessKey**

This node type refers to an AWS IAM Access Key

**Resource Config**

For more information, and possible keyword arguments, see: [IAM AccessKey:create_access_key](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_access_key)

**Operations**

  * `cloudify.interfaces.lifecycle.configure`: Store `resource_config` in runtime properties.

**Relationships**

  * `cloudify.relationships.aws.iam.access_key.connected_to`:
    * `cloudify.nodes.aws.iam.User`:  Associate access key with user.

### IAM Access Key Examples

```yaml
  my_iam_user_api_access:
    type: cloudify.nodes.aws.iam.AccessKey
    relationships:
      - type: cloudify.relationships.aws.iam.access_key.connected_to
        target: iam_user
        
  iam_user:
    type: cloudify.nodes.aws.iam.User
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        UserName: !!str CloudifyUser=,.@-Test
        Path: !!str /!"#$%&'()*+,-.0123456789:;<=>?@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{|}~/
    relationships:
      - type: cloudify.relationships.aws.iam.user.connected_to
        target: iam_group
      - type: cloudify.relationships.aws.iam.user.connected_to
        target: iam_policy_vpc_access

  iam_group:
    type: cloudify.nodes.aws.iam.Group
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: !!str pmcfy_CloudifyGroup
        Path: !!str /!"#$%&'()*+,-.0123456789:;<=>?@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{|}~/
    relationships:
      - type: cloudify.relationships.aws.iam.group.connected_to
        target: iam_policy_vpc_access

  iam_policy_vpc_access:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        PolicyName: pmcfy_vpcpolicy
        Description: >-
          Grants access to EC2 network components
        Path: !!str /service-role/
        PolicyDocument:
          Version: !!str 2012-10-17
          Statement:
            - Effect: Allow
              Action:
                - !!str ec2:CreateNetworkInterface
                - !!str ec2:DeleteNetworkInterface
                - !!str ec2:DescribeNetworkInterfaces
              Resource: '*'
      
```
## **cloudify.nodes.aws.iam.Group**

This node type refers to an AWS IAM Group

**Resource Config**
  
  * `Path`: String. The path to the group. For more information about paths, see IAM Identifiers in the IAM User Guide.
  * `GroupName`: String. The name of the group to create. Do not include the path in this value.
  
For more information, and possible keyword arguments, see: [IAM Group:create_group](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_group)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Executes the [CreateGroup](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateGroup.html) action.  
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteGroup](https://docs.aws.amazon.com/IAM/latest/APIReference/API_DeleteGroup.html) action. 

**Relationships**

  * `cloudify.relationships.aws.iam.group.connected_to`:
    * `cloudify.nodes.aws.iam.User`:  Associate the created group with user.
    * `cloudify.nodes.aws.iam.Policy`:  Associate the created group with policy.

### IAM Group Examples

```yaml
  iam_group:
    type: cloudify.nodes.aws.iam.Group
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: !!str pmcfy_CloudifyGroup
        Path: !!str /!"#$%&'()*+,-.0123456789:;<=>?@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{|}~/
    relationships:
      - type: cloudify.relationships.aws.iam.group.connected_to
        target: iam_policy_vpc_access

  iam_policy_vpc_access:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        PolicyName: pmcfy_vpcpolicy
        Description: >-
          Grants access to EC2 network components
        Path: !!str /service-role/
        PolicyDocument:
          Version: !!str 2012-10-17
          Statement:
            - Effect: Allow
              Action:
                - !!str ec2:CreateNetworkInterface
                - !!str ec2:DeleteNetworkInterface
                - !!str ec2:DescribeNetworkInterfaces
              Resource: '*'
      
```
## **cloudify.nodes.aws.iam.InstanceProfile**

This node type refers to an AWS IAM Instance Profile

**Resource Config**
  
  * `InstanceProfileName`: String. The name of the instance profile to create.
  * `Path`: String. The path to the instance profile.
  
For more information, and possible keyword arguments, see: [IAM InstanceProfile:create_instance_profile](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_instance_profile)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Executes the [CreateInstanceProfile](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateInstanceProfile.html) action.  
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteInstanceProfile](https://docs.aws.amazon.com/IAM/latest/APIReference/API_DeleteInstanceProfile.html) action. 

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.iam.Role`:  Associate the instance profile with certain role.

### IAM Instance Profile Examples

```yaml
  iam_user_instance_profile:
    type: cloudify.nodes.aws.iam.InstanceProfile
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name 
      resource_config:
        InstanceProfileName: pmcfy_iam_user_instance_profile
        Path: '/pmcfy_iam_user_instance_profile/'
    relationships:
      - type: cloudify.relationships.depends_on
        target: iam_role

  iam_role:
    type: cloudify.nodes.aws.iam.Role
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name 
      resource_config:
        RoleName: pmcfy_lambdarole
        Path: !!str /service-role/
        AssumeRolePolicyDocument:
          Version: !!str 2012-10-17
          Statement:
          - Effect: Allow
            Principal:
              Service: !!str lambda.amazonaws.com
            Action: !!str sts:AssumeRole
```

## **cloudify.nodes.aws.iam.LoginProfile**

This node type refers to an AWS IAM Login Profile

**Resource Config**
  
  * `UserName`: String. The name of the IAM user that the new key will belong to.
  * `Password`: String. The new password for the user.
  * `PasswordResetRequired`: Boolean. Specifies whether the user is required to set a new password on next sign-in.
  
For more information, and possible keyword arguments, see: [IAM LoginProfile:create_login_profile](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_login_profile)

**Operations**
  * `cloudify.interfaces.lifecycle.configure`: Store `resource_config` in runtime properties.  

**Relationships**

  * `cloudify.relationships.aws.iam.login_profile.connected_to`:
    * `cloudify.nodes.aws.iam.User`:  Create login profile for certain user.

### IAM Login Profile Examples

```yaml
  iam_login_profile:
    type: cloudify.nodes.aws.iam.LoginProfile
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name 
      resource_config:
        UserName: !!str PMCfy=,.@-User
        Password: !!str Cl0ud1fy2017
    relationships:
      - type: cloudify.relationships.aws.iam.login_profile.connected_to
        target: iam_user

  iam_user:
    type: cloudify.nodes.aws.iam.User
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name 
      resource_config:
        UserName: !!str CloudifyUser=,.@-Test
        Path: !!str /!"#$%&'()*+,-.0123456789:;<=>?@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{|}~/
```
## **cloudify.nodes.aws.iam.Policy**

This node type refers to an AWS IAM Policy

**Resource Config**
  
  * `PolicyName`: String. The friendly name of the policy.
  * `Path`: String. The path to the policy.
  * `PolicyDocument`: String. The policy document.
  * `Description`: String. A friendly description of the policy.
  
For more information, and possible keyword arguments, see: [IAM Policy:create_policy](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_policy)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Executes the [CreatePolicy](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreatePolicy.html) action.  
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeletePolicy](https://docs.aws.amazon.com/IAM/latest/APIReference/API_DeletePolicy.html) action.
 
### IAM Policy Examples

```yaml
  iam_policy:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name 
      resource_config:
        PolicyName: pmcfy_vpcpolicy
        Description: >-
          Grants access to EC2 network components
        Path: !!str /service-role/
        PolicyDocument:
          Version: !!str 2012-10-17
          Statement:
            - Effect: Allow
              Action:
                - !!str ec2:CreateNetworkInterface
                - !!str ec2:DeleteNetworkInterface
                - !!str ec2:DescribeNetworkInterfaces
              Resource: '*'
```
  
## **cloudify.nodes.aws.iam.Role**

This node type refers to an AWS IAM Role

**Resource Config**
  
  * `AssumeRolePolicyDocument`: String. The trust relationship policy document that grants an entity permission to assume the role.
  * `RoleName`: String. The name of the role to create.
  * `Path`: String. The path to the role.
  
For more information, and possible keyword arguments, see: [IAM Role:create_role](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_role)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Executes the [CreateRole](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateRole.html) action.  
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteRole](https://docs.aws.amazon.com/IAM/latest/APIReference/API_DeleteRole.html) action.

**Relationships**

  * `cloudify.relationships.aws.iam.role.connected_to`:
    * `cloudify.nodes.aws.iam.Policy`:  Associate role with certain policy.

### IAM Role Examples

```yaml
  iam_role:
    type: cloudify.nodes.aws.iam.Role
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name 
      resource_config:
        RoleName: pmcfy_lambdarole
        Path: !!str /service-role/
        AssumeRolePolicyDocument:
          Version: !!str 2012-10-17
          Statement:
          - Effect: Allow
            Principal:
              Service: !!str lambda.amazonaws.com
            Action: !!str sts:AssumeRole
    relationships:
      - type: cloudify.relationships.aws.iam.role.connected_to
        target: iam_policy_vpc_access
      - type: cloudify.relationships.aws.iam.role.connected_to
        target: iam_policy_cloudwatch_access
     
  iam_policy_vpc_access:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name 
      resource_config:
        PolicyName: pmcfy_vpcpolicy
        Description: >-
          Grants access to EC2 network components
        Path: !!str /service-role/
        PolicyDocument:
          Version: !!str 2012-10-17
          Statement:
            - Effect: Allow
              Action:
                - !!str ec2:CreateNetworkInterface
                - !!str ec2:DeleteNetworkInterface
                - !!str ec2:DescribeNetworkInterfaces
              Resource: '*'


  iam_policy_cloudwatch_access:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name 
      resource_config:
        PolicyName: pmcfy_iampolicy
        Description: >-
          Grants access to CloudWatch logs
        Path: !!str /service-role/
        PolicyDocument:
          Version: !!str 2012-10-17
          Statement:
            - Effect: Allow
              Action: !!str logs:CreateLogGroup
              Resource: '*'
            - Effect: Allow
              Action:
                - !!str logs:CreateLogStream
                - !!str logs:PutLogEvents
              Resource:
                - { get_input: aws_cloudwatch_log_arn }

```

## **cloudify.nodes.aws.iam.RolePolicy**

This node type refers to an AWS IAM Role Policy

**Resource Config**
  
  * `RoleName`: String. The name of the role to associate the policy with. Required if no relationship to a Role was provided.
  * `PolicyName`: String. The name of the policy document.
  * `PolicyDocument`: String. The policy document.
  
For more information, and possible keyword arguments, see: [IAM RolePolicy:put_role_policy](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.put_role_policy)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Executes the [PutRolePolicy](https://docs.aws.amazon.com/IAM/latest/APIReference/API_PutRolePolicy.html) action.  
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteRolePolicy](https://docs.aws.amazon.com/IAM/latest/APIReference/API_DeleteRolePolicy.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.iam.Role`:  Associate policy with certain role.

### IAM Role Policy Examples

```yaml
  iam_role_policy:
    type: cloudify.nodes.aws.iam.RolePolicy
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name 
      resource_config:
        PolicyName: pmcfy_iam_role_policy
        PolicyDocument:
          {
            "Version": "2012-10-17",
            "Statement": {
              "Effect": "Allow",
              "Resource": "*",
              "Action": "sts:AssumeRole"
            }
          }
    relationships:
      - type: cloudify.relationships.depends_on
        target: iam_role

  iam_role:
    type: cloudify.nodes.aws.iam.Role
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name 
      resource_config:
        RoleName: pmcfy_lambdarole
        Path: !!str /service-role/
        AssumeRolePolicyDocument:
          Version: !!str 2012-10-17
          Statement:
          - Effect: Allow
            Principal:
              Service: !!str lambda.amazonaws.com
            Action: !!str sts:AssumeRole
```

## **cloudify.nodes.aws.iam.User**

This node type refers to an AWS IAM User

**Resource Config**
  
  * `UserName`: String. The name of the IAM user that the new key will belong to.
  * `Path`: String. The path to the user. For more information about paths, see IAM Identifiers in the IAM User Guide.
  * `PermissionsBoundary`: String. The ARN of the policy that is used to set the permissions boundary for the user.
  * `Tags`: List. A list of tags that you want to attach to the newly created user. Each tag consists of a key name and an associated value. For more information about tagging, see Tagging IAM Identities in the IAM User Guide.
  
For more information, and possible keyword arguments, see: [IAM User:create_user](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_user)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Executes the [CreateUser](https://docs.aws.amazon.com/IAM/latest/APIReference/API_CreateUser.html) action.  
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteUser](https://docs.aws.amazon.com/IAM/latest/APIReference/API_DeleteUser.html) action.

**Relationships**

  * `cloudify.relationships.aws.iam.user.connected_to`:
    * `cloudify.nodes.aws.iam.Group`:  Associate user with certain group.
    * `cloudify.nodes.aws.iam.Policy`:  Associate user with certain certain policy.
    * `cloudify.nodes.aws.iam.LoginProfile`:  Create login profile for user.
    * `cloudify.nodes.aws.iam.AccessKey`:  Create access key for user.

### IAM User Examples

```yaml
  iam_user:
    type: cloudify.nodes.aws.iam.User
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        UserName: !!str CloudifyUser=,.@-Test
        Path: !!str /!"#$%&'()*+,-.0123456789:;<=>?@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{|}~/
    relationships:
      - type: cloudify.relationships.aws.iam.user.connected_to
        target: iam_group
      - type: cloudify.relationships.aws.iam.user.connected_to
        target: iam_policy_vpc_access

 iam_group:
    type: cloudify.nodes.aws.iam.Group
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: !!str pmcfy_CloudifyGroup
        Path: !!str /!"#$%&'()*+,-.0123456789:;<=>?@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{|}~/
    relationships:
      - type: cloudify.relationships.aws.iam.group.connected_to
        target: iam_policy_vpc_access

  iam_policy_vpc_access:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        PolicyName: pmcfy_vpcpolicy
        Description: >-
          Grants access to EC2 network components
        Path: !!str /service-role/
        PolicyDocument:
          Version: !!str 2012-10-17
          Statement:
            - Effect: Allow
              Action:
                - !!str ec2:CreateNetworkInterface
                - !!str ec2:DeleteNetworkInterface
                - !!str ec2:DescribeNetworkInterfaces
              Resource: '*'
```

## **cloudify.nodes.aws.kms.Alias**

This node type refers to an AWS KMS Alias

**Resource Config**
    
For more information, and possible keyword arguments, see: [KMS Alias:create_alias](http://boto3.readthedocs.io/en/latest/reference/services/kms.html#KMS.Client.create_alias)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateAlias](https://docs.aws.amazon.com/kms/latest/APIReference/API_CreateAlias.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteAlias](https://docs.aws.amazon.com/kms/latest/APIReference/API_DeleteAlias.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.kms.CustomerMasterKey`:  Associate alias with certain key.

### KMS Alias Examples

```yaml
  my_alias:
    type: cloudify.nodes.aws.kms.Alias
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          AliasName: alias/test_key
    relationships:
      - type: cloudify.relationships.depends_on
        target: cmk

  cmk:
    type: cloudify.nodes.aws.kms.CustomerMasterKey
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Description: An example CMK.
          Tags:
          - TagKey: Cloudify
            TagValue: Example
```

## **cloudify.nodes.aws.kms.CustomerMasterKey**

This node type refers to an AWS KMS Customer Master Key

**Resource Config**
    
For more information, and possible keyword arguments, see: [KMS CustomerMasterKey:create_key](http://boto3.readthedocs.io/en/latest/reference/services/kms.html#KMS.Client.create_key)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateKey](https://docs.aws.amazon.com/kms/latest/APIReference/API_CreateKey.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [EnableKey](https://docs.aws.amazon.com/kms/latest/APIReference/API_EnableKey.html) action.
  * `cloudify.interfaces.lifecycle.stop`: Executes the [DisableKey](https://docs.aws.amazon.com/kms/latest/APIReference/API_DisableKey.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [ScheduleKeyDeletion](https://docs.aws.amazon.com/kms/latest/APIReference/API_ScheduleKeyDeletion.html) action.

### KMS Customer Master Key Examples 

```yaml
  my_cmk:
    type: cloudify.nodes.aws.kms.CustomerMasterKey
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Description: An example CMK.
          Tags:
          - TagKey: Cloudify
            TagValue: Example
```

## **cloudify.nodes.aws.kms.Grant**

This node type refers to an AWS KMS Grant

**Resource Config**
    
For more information, and possible keyword arguments, see: [KMS Grant:create_grant](http://boto3.readthedocs.io/en/latest/reference/services/kms.html#KMS.Client.create_grant)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateGrant](https://docs.aws.amazon.com/kms/latest/APIReference/API_CreateGrant.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [RevokeGrant](https://docs.aws.amazon.com/kms/latest/APIReference/API_RevokeGrant.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.kms.CustomerMasterKey`:  Associate grant with certain key.

### KMS Grant Examples

```yaml
  my_grant:
    type: cloudify.nodes.aws.kms.Grant
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Name: TestGrant
          GranteePrincipal: { get_input: iam_arn }
          Operations: [Encrypt, Decrypt]
    relationships:
      - type: cloudify.relationships.depends_on
        target: cmk

  cmk:
    type: cloudify.nodes.aws.kms.CustomerMasterKey
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Description: An example CMK.
          Tags:
          - TagKey: Cloudify
            TagValue: Example
```

## **cloudify.nodes.aws.lambda.Function**

This node type refers to an AWS Lambda Function

**Resource Config**
  
  * `FunctionName`: String. The name of the Lambda function.
  * `Runtime`: String. The runtime version for the function.
  * `Handler`: String. The name of the method within your code that Lambda calls to execute your function.
  * `Code`: String. The code for the function.
  
For more information, and possible keyword arguments, see: [Lambda Function:create_function](http://boto3.readthedocs.io/en/latest/reference/services/lambda.html#Lambda.Client.create_function)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Executes the [CreateFunction](https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html) action.  
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteFunction](https://docs.aws.amazon.com/lambda/latest/dg/API_DeleteFunction.html) action.

**Relationships**

  * `cloudify.relationships.connected_to`:
    * `cloudify.nodes.aws.ec2.Subnet`:  Associate function with one or more subnets.
    * `cloudify.nodes.aws.ec2.SecurityGroup`:  Associate function with one or more security group.
    * `cloudify.nodes.aws.iam.Role`:  Associate function with iam role.

### Lambda Function Examples

```yaml
  my_lambda_function:
    type: cloudify.nodes.aws.lambda.Function
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        FunctionName: myLambdaFunction
        Runtime: python2.7
        Handler: main.lambda_handler
        Code:
          ZipFile: function/main.zip
        kwargs:
          MemorySize: 128
    relationships:
      - type: cloudify.relationships.connected_to
        target: subnet_1
      - type: cloudify.relationships.connected_to
        target: subnet_2
      - type: cloudify.relationships.connected_to
        target: security_group
      - type: cloudify.relationships.connected_to
        target: iam_role_lambda_function

  subnet_1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c' ] }
      Tags:
        - Key: Name
          Value: Subnet1
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet_2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.1.0/24'
        AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'c' ] }
      Tags:
        - Key: Name
          Value: Subnet2
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        GroupName: Lambda Security Group
        Description: Lambda Feature Demo Test Group
      Tags:
        - Key: Name
          Value: MyGroup
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  security_group_rules:
    type: cloudify.nodes.aws.ec2.SecurityGroupRuleIngress
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        IpPermissions:
         - IpProtocol: "-1"
           FromPort: -1
           ToPort: -1
           IpRanges:
            - CidrIp: 0.0.0.0/0
           UserIdGroupPairs: [  { GroupId: { get_attribute: [ security_group, aws_resource_id ] } } ]
    relationships:
      - type: cloudify.relationships.contained_in
        target: security_group
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: aws.cloudify_aws.ec2.resources.securitygroup.authorize_ingress_rules
          inputs:
            resource_config:
              IpPermissions:
               - IpProtocol: "-1"
                 FromPort: -1
                 ToPort: -1
                 IpRanges:
                  - CidrIp: 0.0.0.0/0
                 UserIdGroupPairs: [  { GroupId: { get_attribute: [ security_group, aws_resource_id ] } } ]
        stop:
          implementation: aws.cloudify_aws.ec2.resources.securitygroup.revoke_ingress_rules
          inputs:
            resource_config:
              IpPermissions:
               - IpProtocol: "-1"
                 FromPort: -1
                 ToPort: -1
                 IpRanges:
                  - CidrIp: 0.0.0.0/0
                 UserIdGroupPairs: [  { GroupId: { get_attribute: [ security_group, aws_resource_id ] } } ]

  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
      Tags:
        - Key: Name
          Value: VPC
```

## **cloudify.nodes.aws.lambda.Invoke**

This node type refers to an AWS Lambda Invoke

**Resource Config**
   
For more information, and possible keyword arguments, see: [Lambda Invoke:invoke](http://boto3.readthedocs.io/en/latest/reference/services/lambda.html#Lambda.Client.invoke)

**Operations**
  * `cloudify.interfaces.lifecycle.configure`: Store `resource_config` in runtime properties. 

**Relationships**

  * `cloudify.relationships.aws.lambda.invoke.connected_to`:
    * `cloudify.nodes.aws.lambda.Function`: Invoke associated lambda function.

### Lambda Invoke Examples

```yaml
  my_lambda_function_invocation:
    type: cloudify.nodes.aws.lambda.Invoke
    relationships:
      - type: cloudify.relationships.aws.lambda.invoke.connected_to
        target: lambda_function

  lambda_function:
    type: cloudify.nodes.aws.lambda.Function
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        FunctionName: myLambdaFunction
        Runtime: python2.7
        Handler: main.lambda_handler
        Code:
          ZipFile: function/main.zip
        kwargs:
          MemorySize: 128
```

## **cloudify.nodes.aws.lambda.Permission**

This node type refers to an AWS Lambda Permission

**Resource Config**
  
  * `FunctionName`: String. The name of the Lambda function. Required. May also be provided from a relationship to a cloudify.nodes.aws.lambda.Function.
  * `StatementId`: String. A unique statement identifier.
  * `Action`: String. The AWS Lambda action you want to allow in this statement.
  * `Principal`: String. The principal who is getting this permission.
  
For more information, and possible keyword arguments, see: [Lambda Permission:add_permission](http://boto3.readthedocs.io/en/latest/reference/services/lambda.html#Lambda.Client.add_permission)

**Operations**
  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties. 
  * `cloudify.interfaces.lifecycle.configure`: Executes the [AddPermission](https://docs.aws.amazon.com/lambda/latest/dg/API_AddPermission.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [RemovePermission](https://docs.aws.amazon.com/lambda/latest/dg/API_RemovePermission.html) action.

**Relationships**

  * `cloudify.relationships.aws.lambda.permission.connected_to`:
    * `cloudify.nodes.aws.lambda.Function`: Update `resource_config` runtime properties for permission node instance by adding `FunctionName` 

### Lambda Permission Examples

```yaml
  my_lambda_function_permission:
    type: cloudify.nodes.aws.lambda.Permission
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        FunctionName: { get_attribute: [ lambda_function, aws_resource_arn ] }
        StatementId: apigateway-id-2
        Action: !!str lambda:*
        Principal: !!str apigateway.amazonaws.com
    relationships:
      - type: cloudify.relationships.aws.lambda.permission.connected_to
        target: lambda_function

  lambda_function:
    type: cloudify.nodes.aws.lambda.Function
    properties:
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        FunctionName: myLambdaFunction
        Runtime: python2.7
        Handler: main.lambda_handler
        Code:
          ZipFile: function/main.zip
        kwargs:
          MemorySize: 128
```

## **cloudify.nodes.aws.rds.Instance**
## **cloudify.nodes.aws.rds.InstanceReadReplica**
## **cloudify.nodes.aws.rds.Option**
## **cloudify.nodes.aws.rds.OptionGroup**
## **cloudify.nodes.aws.rds.Parameter**
## **cloudify.nodes.aws.rds.ParameterGroup**
## **cloudify.nodes.aws.rds.SubnetGroup**

## **cloudify.nodes.aws.route53.HostedZone**
## **cloudify.nodes.aws.route53.RecordSet**
## **cloudify.nodes.aws.s3.Bucket**
## **cloudify.nodes.aws.s3.BucketLifecycleConfiguration**
## **cloudify.nodes.aws.s3.BucketPolicy**
## **cloudify.nodes.aws.s3.BucketTagging**
## **cloudify.nodes.aws.SNS.Subscription**
## **cloudify.nodes.aws.SNS.Topic**
## **cloudify.nodes.aws.SQS.Queue**