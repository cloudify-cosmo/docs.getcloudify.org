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
For more information, and possible keyword arguments, see: [EC2:import_key_pair](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.import_key_pair)

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
    * `cloudify.nodes.aws.iam.InstanceProfile`: Associate with a instance profile.

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
## **cloudify.nodes.aws.cloudwatch.Alarm**
## **cloudify.nodes.aws.cloudwatch.Event**
## **cloudify.nodes.aws.cloudwatch.Rule**
## **cloudify.nodes.aws.cloudwatch.Target**
## **cloudify.nodes.aws.dynamodb.Table**
## **cloudify.nodes.aws.ECS.Cluster**
## **cloudify.nodes.aws.ECS.Service**
## **cloudify.nodes.aws.ECS.TaskDefinition**
## **cloudify.nodes.aws.efs.FileSystem**
## **cloudify.nodes.aws.efs.FileSystemTags**
## **cloudify.nodes.aws.efs.MountTarget**
## **cloudify.nodes.aws.elb.Classic.HealthCheck**
## **cloudify.nodes.aws.elb.Classic.Listener**
## **cloudify.nodes.aws.elb.Classic.LoadBalancer**
## **cloudify.nodes.aws.elb.Classic.Policy**
## **cloudify.nodes.aws.elb.Classic.Policy.Stickiness**
## **cloudify.nodes.aws.elb.Listener**
## **cloudify.nodes.aws.elb.LoadBalancer**
## **cloudify.nodes.aws.elb.Rule**
## **cloudify.nodes.aws.elb.TargetGroup**
## **cloudify.nodes.aws.iam.AccessKey**
## **cloudify.nodes.aws.iam.Group**
## **cloudify.nodes.aws.iam.InstanceProfile**
## **cloudify.nodes.aws.iam.LoginProfile**
## **cloudify.nodes.aws.iam.Policy**
## **cloudify.nodes.aws.iam.Role**
## **cloudify.nodes.aws.iam.RolePolicy**
## **cloudify.nodes.aws.iam.User**
## **cloudify.nodes.aws.kms.Alias**
## **cloudify.nodes.aws.kms.CustomerMasterKey**
## **cloudify.nodes.aws.kms.Grant**
## **cloudify.nodes.aws.lambda.Function**
## **cloudify.nodes.aws.lambda.Invoke**
## **cloudify.nodes.aws.lambda.Permission**
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