---
title: AWS Plugin
category: Official Plugins
description: The AWS plugin enables you to manage AWS resources
draft: false
weight: 100
aliases:
    - /plugins/aws/
    - /developer/official_plugins/aws/
---

The AWS plugin enables you to manage AWS resources with {{< param product_name >}}.

## Authentication with AWS

Each node template, has a `client_config` property which stores your account credentials. Use an intrinsic function to assign these to the values of [secrets]({{< relref "working_with/manager/using-secrets.md" >}}) in your manager.

```yaml
  my_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        aws_session_token: { get_secret: aws_session_token }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
```

The `client_config` essential values are `aws_access_key_id` and `aws_access_key_id`. It also accepts `aws_session_token` and `api_version`.
Furthermore, the `client_config` property accepts an argument `additional_config`, where you can configure the AWS API retry number and mode for situations when AWS may throttle requests from your session:

```yaml
  my_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
        additional_config:
          retries:
            max_attempts: 10
            mode: adaptive
      resource_config:
        CidrBlock: '10.0.0.0/16'
```

For information on AWS Throttling, see [here](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/throttling.html).

The valid values for retries `mode` are ['adaptive', 'standard', 'legacy']. For documentation on configuring retries in boto3, please see [here](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/retries.html#defining-a-retry-configuration-in-a-config-object-for-your-boto3-client).

## Common Operations

This section requires an understanding of {{< param product_name >}}'s install and uninstall [built-in workflows]({{< relref "working_with/workflows/built-in-workflows.md" >}}).

AWS Plugin node types have these common operations, except where noted:

**Operations**

  * `cloudify.interfaces.validation.check_status`: Cloudify 6.3 introduces the validation interface. For each AWS resource, the plugin determines whether the resource is in a usable state or not.
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
  * `cloudify_tagging`: Boolean. The default value is `false`. Set to `true` in order to automaticly add a Name & CreatedBy tags to EC2, EKS, ELB nodes.

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
        region_name: { get_input: aws_region_name }

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

## **cloudify.nodes.aws.ec2.SpotInstances**

This node type permits a user to manage spot instances.

**Resource Config**

  * `kwargs`: Any of the key value pairs specified in [request_spot_instances](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.request_spot_instances).

For information on possible keyword arguments, see: [EC2:request_spot_instances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RequestSpotInstances.html)

**Operations**

  * `cloudify.interfaces.lifecycle.precreate`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.create`: Executes the [request_spot_instances](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.cancel_spot_instance_requests).
  * `cloudify.interfaces.lifecycle.configure`: Waits for the request to be pending or filled.
  * `cloudify.interfaces.lifecycle.stop`: Deletes all instances created by spot instances.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteInstances](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.cancel_spot_instance_requests) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.SecurityGroup`: Connect to a certain Security group.
    * `cloudify.nodes.aws.ec2.Subnet`: Create with in a certain subnet.
    * `cloudify.nodes.aws.ec2.Interface`: Create with an ENI in your account. If multiple ENIs are connected and device indices are not provided, they will be generated according to the relationship order.

### Spot Instance Examples

**Create spot instances that are connected to a subnet**

```yaml

  vm:
    type: cloudify.nodes.aws.ec2.SpotInstances
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      agent_config:
        install_method: none
        user: { get_input: agent_user }
        key: { get_attribute: [agent_key, private_key_export] }
      resource_config:
        kwargs:
          LaunchSpecification:
            ImageId: { get_attribute: [ ami, aws_resource_id ] }
            InstanceType: { get_input: instance_type }
            UserData: { get_attribute: [ cloud_init, cloud_config ] }
    relationships:
    - type: cloudify.relationships.depends_on
      target: ami
    - type: cloudify.relationships.depends_on
      target: cloud_init
    - type: cloudify.relationships.depends_on
      target: subnet

  subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: 10.0.0.0/16
        AvailabilityZone: us-west-1b
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

This node type refers to an AWS AMI Image.

**Resource Config**

  * `Name`: String. The name of the AMI Image to create.
  * `InstanceId`: String. The ID of the EC2 instance from which the AMI Image will be created.
  * `kwargs`: Filters for searching an existing AMI Image, the Filters can contain the `name` & `owner-id` .

For more information, and possible keyword arguments, see: [EC2:create_image](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.create_image) & [EC2:describe_images](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.describe_images)

**Operations**

  * `cloudify.interfaces.lifecycle.create`:
    - If `use_external_resource` is False then an AMI Image will be searched.
    - Only these keys are accepted:
      - `ImageIds`: A list of image IDs that can be passed to describe_images filter. Not required and not that useful. If you are looking for an image ID, and already have it, then you probably don't need this function in the first place.
      - `Owners`: A list of AWS account numbers to include in the describe_images filter. Not required, but a very good way to limit the scope of the search. This can also be provided in `Filters`. See example.
      - `ExecutableUsers`: Scopes the images by users with explicit launch permissions. Specify an AWS account ID, self (the sender of the request), or all (public AMIs). Not required.
      - `Filters`: Additional filters, most usefully, image `name` and `owner-id`. See example
  * `cloudify.interfaces.lifecycle.configure`:
    - If `use_external_resource` is True then an AMI Image will be created using the `resource_config`.
  * `cloudify.interfaces.lifecycle.delete`:
    - If `use_external_resource` is True then an AMI Image will be created using the `resource_config`.

### Image Examples

**Creates VM from image**

Creates an instance with an image identified from filters.

```yaml
  cloudify_manager_ami:
    type: cloudify.nodes.aws.ec2.Image
    properties:
      resource_config:
        kwargs:
          Filters:
            - Name: name
              Values:
              - { get_input: ami_name_filter }
            - Name: owner-id
              Values:
              - { get_input: ami_owner_filter }
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
**Creates a AMI image from instance**

Creates an image from an existing instance, using the input to identify the instance.

```yaml
  cloudify_manager_ami:
    type: cloudify.nodes.aws.ec2.Image
    properties:
      use_external_resource: false
      resource_config:
        InstanceId: {get_input: instance_id}
        Name: { get_input: ami_image_name }
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
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

**Creates a simple security group**

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

**Properties**

  * `use_unassociated_addresses`: Sometimes an IP has already been allocated, but is not assigned to a NIC. In order to work with limited quota, set this to true.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [AllocateAddress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AllocateAddress.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [AssociateAddress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AssociateAddress.html) action.
  * `cloudify.interfaces.lifecycle.stop`: Executes the [DisassociateAddress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DisassociateAddress.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [ReleaseAddress](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ReleaseAddress.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Interface`: Connect to a certain ENI.

### Elastic IP Example

**Connecting a VM to a nic and an IP**

Creates an IP and have it attached to a VM and a NIC.

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

### Interface Example

**Creates an ENI and set SourceDestCheck to false**

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

**Creates an ENI in a subnet and security group via relationship**

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

### Keypair Example

**Creates a Keypair and save to a secret**

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

**Imports a public key into AWS:**

```yaml
  imported_key:
    type: cloudify.nodes.aws.ec2.Keypair
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        KeyName: my_imported_key
        PublicKeyMaterial: |
          ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEA879BJGYlPTLIuc9/R5MYiN4yc/YiCLcdBpSdzgK9Dt0Bkfe3rSz5cPm4wmehdE7GkVFXrBJ2YHqPLuM1yx1AUxIebpwlIl9f/aUHOts9eVnVh4NztPy0iSU/Sv0b2ODQQvcy2vYcujlorscl8JjAgfWsO3W4iGEe6QwBpVomcME8IU35v5VbylM9ORQa6wvZMVrPECBvwItTY8cPWH3MGZiK/74eHbSLKA4PY3gM4GHI450Nie16yggEg2aTQfWA1rry9JYWEoHS9pJ1dnLqZU3k/8OWgqJrilwSoC5rGjgp93iu0H8T6+mEHGRQe84Nk1y5lESSWIbn6P636Bl3uQ== your@email.com
      log_create_response: false
      store_in_runtime_properties: false
```

## **cloudify.nodes.aws.ec2.NATGateway**

This node type refers to an AWS NAT Gateway .

For more information, and possible keyword arguments, see: [EC2:create_nat_gateway](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_nat_gateway).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateNatGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNatGateway.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteNatGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteNatGateway.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Subnet`: Connect to a certain subnet.
    * `cloudify.nodes.aws.ec2.ElasticIP`: Associate nat gateway with certain elastic ip.

### NAT Gateway Example

**Creates a NATGateway and place it in public subnet and associate it with elastic ip**

```yaml
  my_natgateway:
    type: cloudify.nodes.aws.ec2.NATGateway
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.depends_on
        target: subnet
      - type: cloudify.relationships.depends_on
        target: elasticip

  elasticip:
   type: cloudify.nodes.aws.ec2.ElasticIP
   properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
     resource_config:
       kwargs:
         Domain: 'vpc'

  subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          CidrBlock: '172.30.0.0/24'
          AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'd' ] }
      Tags:
        - Key: Name
          Value: Subnet
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
        kwargs:
          CidrBlock: '172.30.0.0/16'
      Tags:
        - Key: Name
          Value: VPC
```

## **cloudify.nodes.aws.ec2.NetworkACL**

This node type refers to an AWS Network ACL .

For more information, and possible keyword arguments, see: [EC2:create_network_acl](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_network_acl).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateNetworkAcl](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNetworkAcl.html) action.
  * `cloudify.interfaces.lifecycle.start`: Attach an AWS EC2 NetworkAcl to a Subnet by executing  [ReplaceNetworkAclAssociation](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ReplaceNetworkAclAssociation.html) action.
  * `cloudify.interfaces.lifecycle.stop`: De-attach an AWS EC2 NetworkAcl from a Subnet by executing [ReplaceNetworkAclAssociation](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ReplaceNetworkAclAssociation.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteNetworkAcl](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteNetworkAcl.html) action.

**Relationships**

  * `cloudify.relationships.contained_in`:
    * `cloudify.nodes.aws.ec2.Vpc`: Associate acl network to a certain vpc.
  * `cloudify.relationships.connected_to`:
    * `cloudify.nodes.aws.ec2.Subnet`: Associate acl network to a certain subnet.

### Network ACL Example

**Creates a network ACL and apply it to subnet in certain vpc**

```yaml
  my_network_acl:
    type: cloudify.nodes.aws.ec2.NetworkACL
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.contained_in
        target: vpc
      - type: cloudify.relationships.contained_in
        target: subnet

  subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          CidrBlock: '172.30.0.0/24'
          AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'd' ] }
      Tags:
        - Key: Name
          Value: Subnet
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
        kwargs:
          CidrBlock: '172.30.0.0/16'
      Tags:
        - Key: Name
          Value: VPC
```

## **cloudify.nodes.aws.ec2.NetworkAclEntry**

This node type refers to an AWS Network ACL Entry .

For more information, and possible keyword arguments, see: [EC2:create_network_acl_entry](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_network_acl_entry).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateNetworkAclEntry](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNetworkAclEntry.html) action or [ReplaceNetworkAclEntry](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ReplaceNetworkAclEntry.html) if the provided `RuleNumber` matches one of the existing rules
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteNetworkAclEntry](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteNetworkAclEntry.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.NetworkACL` : Associate acl network entry to a certain acl network.

### Network ACL Entry Example

**Creates new network ACL entry and attach it to ACL**

```yaml
  my_network_acl_entry:
    type: cloudify.nodes.aws.ec2.NetworkAclEntry
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          RuleNumber: 100
          Protocol: '-1'
          RuleAction: 'allow'
          Egress: False
          CidrBlock: '0.0.0.0/0'
    relationships:
      - type: cloudify.relationships.contained_in
        target: network_acl

  network_acl:
    type: cloudify.nodes.aws.ec2.NetworkACL
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.contained_in
        target: vpc
      - type: cloudify.relationships.contained_in
        target: subnet

  subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          CidrBlock: '172.30.0.0/24'
          AvailabilityZone: { concat: [ { get_input: aws_region_name }, 'd' ] }
      Tags:
        - Key: Name
          Value: Subnet
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
        kwargs:
          CidrBlock: '172.30.0.0/16'
      Tags:
        - Key: Name
          Value: VPC
```

## **cloudify.nodes.aws.ec2.Route**

This node type refers to an AWS Route.

For more information, and possible keyword arguments, see: [EC2:create_route](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_route).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateRoute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateRoute.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteRoute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteRoute.html) action.

**Relationships**

  * `cloudify.relationships.contained_in`:
    * `cloudify.nodes.aws.ec2.RouteTable` : Associate route to certain route table.
  * `cloudify.relationships.connected_to`:
    * `cloudify.nodes.aws.ec2.InternetGateway` : Associate route to an internet gateway.
    * `cloudify.nodes.aws.ec2.NATGateway` : Associate route to a nat gateway.
    * `cloudify.nodes.aws.ec2.VPNGateway` : Associate route to vpn gateway.

### Route Example

**Creates new route entry to allow internet access using internet gateway**

```yaml
  my_route:
    type: cloudify.nodes.aws.ec2.Route
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }}
      resource_config:
        kwargs:
          DestinationCidrBlock: '0.0.0.0/0'
    relationships:
      - type: cloudify.relationships.contained_in
        target: route_table
      - type: cloudify.relationships.connected_to
        target: internet_gateway

  internet_gateway:
    type: cloudify.nodes.aws.ec2.InternetGateway
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.connected_to
        target: vpc

  route_table:
    type: cloudify.nodes.aws.ec2.RouteTable
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.contained_in
        target: vpc
      - type: cloudify.relationships.connected_to
        target: subnet

  subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '172.32.0.0/16'
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
        CidrBlock: '172.32.0.0/16'
```

## **cloudify.nodes.aws.ec2.RouteTable**

This node type refers to an AWS Route Table.

For more information, and possible keyword arguments, see: [EC2:create_route_table](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_route_table).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateRouteTable](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateRouteTable.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [AssociateRouteTable](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AssociateRouteTable.html) action.
  * `cloudify.interfaces.lifecycle.stop`: Executes the [DisassociateRouteTable](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DisassociateRouteTable.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteRouteTable](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteRouteTable.html) action.

**Relationships**

  * `cloudify.relationships.contained_in`:
    * `cloudify.nodes.aws.ec2.Vpc` : Associate route table to certain vpc.
  * `cloudify.relationships.connected_to`:
    * `cloudify.nodes.aws.ec2.Subnet` : Associate route table to certain subnet.

### Default VPC Route Table Representation

In order to model a VPC's default Route Table (for example, for the purpose of adding route entries to it),
do the following:

1. Define a node template of the type `cloudify.nodes.aws.ec2.RouteTable`
2. Set the `use_external_resource` property to `true
3. Set the `resource_id` property to the value of the `main_route_table_id` attribute of the VPC node template
4. Define a `cloudify.relationships.contained_in` relationship between this node template to the VPC

Once the topology is installed, the `aws_resource_id` runtime property will contain the AWS ID of the VPC's
main route table.

For example:

```yaml
  vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config: *aws_client
      resource_config:
        CidrBlock: 10.0.0.0/16

  main_route_table:
    type: cloudify.nodes.aws.ec2.RouteTable
    properties:
      client_config: *aws_client
      use_external_resource: true
      resource_id: { get_attribute: [ vpc, main_route_table_id ] }
    relationships:
      - type: cloudify.relationships.contained_in
        target: vpc
```

### Route Table Example

**Creates new route table and associate it with subnet**

```yaml
  my_route_table:
    type: cloudify.nodes.aws.ec2.RouteTable
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.contained_in
        target: vpc
      - type: cloudify.relationships.connected_to
        target: subnet

  subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '172.32.0.0/16'
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
        CidrBlock: '172.32.0.0/16'
```

## **cloudify.nodes.aws.ec2.TransitGatewayRoute**

This node type refers to an AWS Transit Gateway Route.

For more information, and possible keyword arguments, see: [EC2:create_transit_gateway_route](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.create_transit_gateway_route).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateTransitGatewayRoute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateTransitGatewayRoute.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteTransitGatewayRoute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteTransitGatewayRoute.html) action.

**Relationships**

The following relationships are required:

  * `cloudify.relationships.connected_to`:
    * `cloudify.nodes.aws.ec2.TransitGatewayRouteTable` : Apply route to route table.
    * `cloudify.nodes.aws.ec2.Vpc` : Ensure that we are mapping the transit gateway to this VPC transit gateway.

### Transit Gateway Route Example

**Creates new transit gateway route entry to allow connectivity to a network sector in a transit gateway.**

```yaml
  transit_gateway_route_b:
    type: cloudify.nodes.aws.ec2.TransitGatewayRoute
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          DestinationCidrBlock: '10.11.0.0/16'
    relationships:
      - type: cloudify.relationships.depends_on
        target: transit_gateway_routetable
      - type: cloudify.relationships.depends_on
        target: vpc
```

## **cloudify.nodes.aws.ec2.TransitGatewayRouteTable**

This node type refers to an AWS Transit Gateway Route Table.

For more information, and possible keyword arguments, see: [EC2:create_transit_gateway_route_table](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.create_transit_gateway_route_table).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateTransitGatewayRouteTable](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateTransitGatewayRouteTable.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [AssociateTransitGatewayRouteTable](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AssociateTransitGatewayRouteTable.html) action.
  * `cloudify.interfaces.lifecycle.stop`: Executes the [DisassociateTransitGatewayRouteTable](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DisassociateTransitGatewayRouteTable.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteTransitGatewayRouteTable](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteTransitGatewayRouteTable.html) action.

**Relationships**

The following relationships are required:

  * `cloudify.relationships.connected_to`:
    * `cloudify.nodes.aws.ec2.TransitGateway` : Attach route table to transit gateway.
    * `cloudify.nodes.aws.ec2.Vpc` : Attach route table to transit gateway.


### Transit Gateway Route Table Example

```yaml
  transit_gateway_routetable:
    type: cloudify.nodes.aws.ec2.TransitGatewayRouteTable
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          TagSpecifications:
            - ResourceType: 'transit-gateway-route-table'
              Tags:
              - Key: Made By
                Value: Cloudify
    relationships:
      - type: cloudify.relationships.depends_on
        target: transit_gateway
      - type: cloudify.relationships.depends_on
        target: vpc
```


## **cloudify.nodes.aws.ec2.TransitGateway**

This node type refers to an AWS Transit Gateway.

For more information, and possible keyword arguments, see: [EC2:create_transit_gateway](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.create_transit_gateway).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateTransitGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateTransitGateway.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Deletes IP properties and executes the [DeleteTransitGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteTransitGateway.html) action.

**Relationships**

  * `cloudify.relationships.aws.ec2.attach_transit_gateway_to_vpc`:
    * `cloudify.nodes.aws.ec2.Vpc`: Create in a certain VPC.
  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Subnet`: Includes subnet in Transit Gateway.

### Transit Gateway Example

```yaml
  transit_gateway:
    type: cloudify.nodes.aws.ec2.TransitGateway
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Description: Test Transit Gateway
          Options:
            DefaultRouteTableAssociation: enable
            DefaultRouteTablePropagation: enable
            TransitGatewayCidrBlocks:
              - { get_input: vpc_a_cidr }
              - { get_input: vpc_b_cidr }
          TagSpecifications:
            - ResourceType: 'transit-gateway'
              Tags:
              - Key: Made By
                Value: Cloudify
    relationships:
      - type: cloudify.relationships.aws.ec2.attach_transit_gateway_to_vpc
        target: vpc_a
      - type: cloudify.relationships.aws.ec2.attach_transit_gateway_to_vpc
        target: vpc_b
      - type: cloudify.relationships.depends_on
        target: route_public_subnet_internet_gateway
      - type: cloudify.relationships.depends_on
        target: subnet_a
      - type: cloudify.relationships.depends_on
        target: subnet_b
```

## **cloudify.nodes.aws.ec2.Tags**

This node type refers to an AWS Tags.

For more information, and possible keyword arguments, see: [EC2:create_tags](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_tags).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateTags](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateTags.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteTags](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteTags.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * Any EC2 resources e.g. `cloudify.nodes.aws.ec2.Vpc` : Associate one or more tags to certain ec2 resources.

### Tags Example

**Create tags and associate them with subnet and vpc ec2 resources**

```yaml
  my_tags:
    type: cloudify.nodes.aws.ec2.Tags
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Tags:
          - Key: Blueprint
            Value: ec2-vpc-feature-demo
    relationships:
    - type: cloudify.relationships.depends_on
      target: vpc
    - type: cloudify.relationships.depends_on
      target: subnet

  subnet:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '172.32.0.0/16'
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
        CidrBlock: '172.32.0.0/16'
```

## **cloudify.nodes.aws.ec2.VpcPeering**

This node type refers to an AWS VPC Peering.

For more information, and possible keyword arguments, see: [EC2:create_vpc_peering_connection](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_vpc_peering_connection).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateVpcPeeringConnection](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateVpcPeeringConnection.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [ModifyVpcPeeringConnectionOptions](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyVpcPeeringConnectionOptions.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteTags](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteTags.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Vpc` : Connect two vpc or more that need to be peered.

### VPC Peering Example

**Creates vpc peering between two vpcs**

```yaml
  my_vpc_peering:
    type: cloudify.nodes.aws.ec2.VpcPeering
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config:
              PeerVpcId: { get_attribute: [vpc_requester, aws_resource_id] }
              VpcId: { get_attribute: [vpc_accepter, aws_resource_id] }

    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc_accepter
      - type: cloudify.relationships.depends_on
        target: vpc_requester

  vpc_accepter:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '172.32.0.0/16'

  vpc_requester:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
```    

## **cloudify.nodes.aws.ec2.VpcPeeringAcceptRequest**

This node type refers to an AWS VPC Peering Accept Request.

For more information, and possible keyword arguments, see: [EC2:accept_vpc_peering_connection](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.accept_vpc_peering_connection).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [AcceptVpcPeeringConnection](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AcceptVpcPeeringConnection.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.VpcPeering` : Accept vpc peering request.

### VPC Peering Accept Request Example

**Accepts vpc peering request**

```yaml
  my_vpc_peering_accept_request:
    type: cloudify.nodes.aws.ec2.VpcPeeringAcceptRequest
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config:
              VpcPeeringConnectionId: { get_attribute: [vpc_peering, aws_resource_id] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc_peering

  vpc_peering:
    type: cloudify.nodes.aws.ec2.VpcPeering
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config:
              PeerVpcId: { get_attribute: [vpc_requester, aws_resource_id] }
              VpcId: { get_attribute: [vpc_accepter, aws_resource_id] }

    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc_accepter
      - type: cloudify.relationships.depends_on
        target: vpc_requester

  vpc_accepter:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '172.32.0.0/16'

  vpc_requester:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
```

## **cloudify.nodes.aws.ec2.VpcPeeringRejectRequest**

This node type refers to an AWS VPC Peering Reject Request.

For more information, and possible keyword arguments, see: [EC2:reject_vpc_peering_connection](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.reject_vpc_peering_connection).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [RejectVpcPeeringConnection](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RejectVpcPeeringConnection.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.VpcPeering` : Reject vpc peering request.

### VPC Peering Reject Request Example

**Rejects vpc peering request**

```yaml
  my_vpc_peering_reject_request:
    type: cloudify.nodes.aws.ec2.VpcPeeringRejectRequest
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config:
              VpcPeeringConnectionId: { get_attribute: [vpc_peering, aws_resource_id] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc_peering

  vpc_peering:
    type: cloudify.nodes.aws.ec2.VpcPeering
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config:
              PeerVpcId: { get_attribute: [vpc_requester, aws_resource_id] }
              VpcId: { get_attribute: [vpc_accepter, aws_resource_id] }

    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc_accepter
      - type: cloudify.relationships.depends_on
        target: vpc_requester

  vpc_accepter:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '172.32.0.0/16'

  vpc_requester:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
```

## **cloudify.nodes.aws.ec2.VPNConnection**

This node type refers to an AWS VPN Connection.

For more information, and possible keyword arguments, see: [EC2:create_vpn_connection](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_vpn_connection).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateVpnConnection](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateVpnConnection.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteVpnConnection](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteVpnConnection.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.CustomerGateway` : Associate vpn connection with certain customer gateway.
    * `cloudify.nodes.aws.ec2.VPNGateway` : Associate vpn connection with certain vpn gateway.

### VPN Connection Example

**Creates VPN connection between customer gateway and virtual private gateway**

```yaml
  my_vpn_connection:
    type: cloudify.nodes.aws.ec2.VPNConnection
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config:
              CustomerGatewayId: { get_attribute: [customer_gateway, aws_resource_id] }
              Type: 'ipsec.1'
              VpnGatewayId: { get_attribute: [vpn_gateway, aws_resource_id] }
              Options:
                StaticRoutesOnly: False
    relationships:
     - type: cloudify.relationships.depends_on
       target: vpn_gateway
     - type: cloudify.relationships.depends_on
       target: customer_gateway

  vpn_gateway:
    type: cloudify.nodes.aws.ec2.VPNGateway
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Type: 'ipsec.1'
    relationships:
    - type: cloudify.relationships.connected_to
      target: vpc

  customer_gateway:
    type: cloudify.nodes.aws.ec2.CustomerGateway
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Type: 'ipsec.1'
          PublicIp: { get_input: openstack_public_ip}
          BgpAsn: 65000
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
      use_external_resource: true
      resource_id: { get_input: aws_vpc_id}
```

## **cloudify.nodes.aws.ec2.VPNConnectionRoute**

This node type refers to an AWS VPN Connection Route.

For more information, and possible keyword arguments, see: [EC2:create_vpn_connection_route](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_vpn_connection_route).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateVpnConnectionRoute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateVpnConnection.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteVpnConnectionRoute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteVpnConnectionRoute.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.VPNConnection` : Associate vpn route with certain vpn connection.

### VPN Connection Route Example

**Creates a static route associated with a VPN connection between an existing virtual private gateway and a VPN customer gateway**

```yaml
  my_vpn_connection_route:
    type: cloudify.nodes.aws.ec2.VPNConnectionRoute
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config:
              VpnConnectionId: { get_attribute: [vpn_connection, aws_resource_id] }
              DestinationCidrBlock: '172.32.0.0/16'
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpn_connection

  vpn_connection:
    type: cloudify.nodes.aws.ec2.VPNConnection
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config:
              CustomerGatewayId: { get_attribute: [customer_gateway, aws_resource_id] }
              Type: 'ipsec.1'
              VpnGatewayId: { get_attribute: [vpn_gateway, aws_resource_id] }
              Options:
                StaticRoutesOnly: True
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpn_gateway
      - type: cloudify.relationships.depends_on
        target: customer_gateway

  vpn_gateway:
    type: cloudify.nodes.aws.ec2.VPNGateway
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Type: 'ipsec.1'
    relationships:
    - type: cloudify.relationships.connected_to
      target: vpc

  customer_gateway:
    type: cloudify.nodes.aws.ec2.CustomerGateway
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Type: 'ipsec.1'
          PublicIp: { get_input: public_ip}
          BgpAsn: 65000
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
      use_external_resource: true
      resource_id: { get_input: aws_vpc_id}
```

## **cloudify.nodes.aws.ec2.VPNGateway**

This node type refers to an AWS Virtual Private Gateway.

For more information, and possible keyword arguments, see: [EC2:create_vpn_gateway](ttp://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_vpn_gateway).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateVpnGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateVpnGateway.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [AttachVpnGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AttachVpnGateway.html) action.
  * `cloudify.interfaces.lifecycle.stop`: Executes the [DetachVpnGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DetachVpnGateway.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteVpnGateway](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DeleteVpnGateway.html) action.

**Relationships**

  * `cloudify.relationships.connected_to`:
    * `cloudify.nodes.aws.ec2.Vpc` : Associate virtual private gateway with certain vpc.

### VPN Gateway Example

**Creates a virtual private gateway on the vpc side of the vpn connection**

```yaml
  my_vpn_gateway:
    type: cloudify.nodes.aws.ec2.VPNGateway
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Type: 'ipsec.1'
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
      use_external_resource: true
      resource_id: { get_input: aws_vpc_id}
```

## **cloudify.nodes.aws.autoscaling.Group**

This node type refers to an AWS AutoScaling Group

For more information, and possible keyword arguments, see: [Autoscaling:create_autoscaling_group](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/autoscaling.html#AutoScaling.Client.create_auto_scaling_group).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateAutoScalingGroup](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_CreateAutoScalingGroup.html) action.
  * `cloudify.interfaces.lifecycle.stop`: Stops all instances associated with auto scaling group before removing them [UpdateAutoScalingGroup](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_UpdateAutoScalingGroup.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteAutoScalingGroup](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_DeleteAutoScalingGroup.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Subnet`: Connect to a certain Subnet.
    * `cloudify.nodes.aws.autoscaling.LaunchConfiguration`: Connect it to LaunchConfiguration.

### AutoScaling Group Examples

**Creates a AutoScaling in a subnet via relationship**

```yaml
  my_autoscaling_group:
    type: cloudify.nodes.aws.autoscaling.Group
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        KeyName: test-key
      store_in_runtime_properties: true

  securitygroup:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

**Creates a Launch Configuration connect it to security group and associate it with key and instance profile via relationship**

```yaml
  my_launch_configuration:
    type: cloudify.nodes.aws.autoscaling.LaunchConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: { get_input: vpc_cidr }   
```

```yaml
  my_launch_configuration:
    type: cloudify.nodes.aws.autoscaling.LaunchConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        KeyName: test-key
      store_in_runtime_properties: true

  securitygroup:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### LifecycleHook Example

**Creates a lifecycle hook and add it to auto scaling group via relationship**

```yaml
  my_lifecycle_hook:
    type: cloudify.nodes.aws.autoscaling.LifecycleHook
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### NotificationConfiguration Example

**Creates a notification configuration add it to auto scaling group and associate it with sns topic via relationship**

```yaml
  my_notification_configuration:
    type: cloudify.nodes.aws.autoscaling.NotificationConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Name: topic

  autoscaling_group:
    type: cloudify.nodes.aws.autoscaling.Group
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### AutoScaling Policy Example

**Creates a launch configuration and add it to auto scaling group via relationship**

```yaml
  my_autoscaling_policy:
    type: cloudify.nodes.aws.autoscaling.Policy
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          ImageId: { get_input: launch_configuration_ami }
          InstanceType: { get_input: launch_configuration_instance_type }
          LaunchConfigurationName: pmcfy_lc

```
## **cloudify.nodes.aws.CloudFormation.Stack**

This node type refers to an AWS CloudFormation Stack.

For more information, and possible keyword arguments, see: [CloudFormation:create_stack](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cloudformation.html#CloudFormation.Client.create_stack).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateStack](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_CreateStack.html) action.
    * `inputs`:
        * `minimum_wait_time`: Sets the minimum time in seconds that Cloudify will wait for AWS to create the stack.
  * `cloudify.interfaces.lifecycle.start`: Executes the same operations as `cloudify.interfaces.lifecycle.pull`.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteStack](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DeleteStack.html) action.
    * `inputs`:
        * `minimum_wait_time`: Sets the minimum time in seconds that Cloudify will wait for AWS to delete the stack.
  * `cloudify.interfaces.lifecycle.pull`: Executes:
    * [DetectStackDrift](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DetectStackDrift.html) action.
    * [ListStackResources](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListStackResources.html) action, and store the result under `state` runtime property .
    * [DescribeStackResourceDrifts](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackResourceDrifts.html) action, and store the result under `StackResourceDrifts` runtime property.
    * [DescribeStacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStacks.html) action and store the result in runtime properties.
    * Store True/False under `is_drifted` runtime property depends on stack state.
    

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.ec2.Keypair`: Associate with a certain key.
    * `cloudify.nodes.aws.ec2.SecurityGroup`: Connect to a certain security group.
    * `cloudify.nodes.aws.rds.ParameterGroup`: Associate with a certain key.
    * `cloudify.nodes.aws.rds.SubnetGroup`: Associate with a certain key.

***Note:***

There are two methods for delivering a CloudFormation Stack.

1. TemplateURL. Provide the URL of a Template:

```
resource_config:
  kwargs:
    StackName: ExampleStack
    TemplateURL: https://...
```

1. TemplateBody. Provide the template inline.

```
              StackName: ExampleStack
              TemplateBody:
                AWSTemplateFormatVersion: "2010-09-09"
                Description: A sample template
                Outputs: ...
                Resources:
                  MyDB: ...
                  MyApp: ...
```

### Outputs

CloudFormation returns a stack's outputs as an array of dictionaries, each of which consists of
`OutputKey` and `OutputValue`:

```yaml
Outputs:
  - OutputKey: ip_address
    OutputValue: 10.0.0.1
  - OutputKey: port
    OutputValue: 3000
```

Also, the order of the outputs is not guaranteed. That makes it impossible to refer to output values
through Cloudify's intrinsic functions (such as `get_attribute`).

In order to address this, the plugin sets a runtime property by the name `outputs_items`, which is a
dictionary containing the output values. This runtime property is only set if the `Outputs` key exists
in CloudFormation's response.

Considering the example above, `outputs_items` would be set as follows:

```yaml
ip_address: 10.0.0.1
port: 3000
```

### CloudFormation Examples

**Creates a CloudFormation stack**

This example demonstrates creating stack that depends on keypair node.

```yaml
  my_ec2_cloudformation:
    type: cloudify.nodes.aws.CloudFormation.Stack
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        KeyName: { get_input: key_name }
      store_in_runtime_properties: true
```
This example demonstrates creating stack for Mysql db instance

```yaml
  my_rds_cloudformation:
    type: cloudify.nodes.aws.CloudFormation.Stack
    properties:
      resource_id: cfn-test
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### CloudWatch Alarm Example

**Creates a CloudWatch alarm**

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

### CloudWatch Event Example

**Creates an event matches the event pattern defined**

```yaml
  my_event:
    type: cloudify.nodes.aws.cloudwatch.Event
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### CloudWatch Rule Example

**Defines CloudWatch rule**

```yaml
  my_cloudwatch_rule:
    type: cloudify.nodes.aws.cloudwatch.Rule
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### CloudWatch Target Example

**Creates a target (topic) that associated with rule to be notified when triggered event matches the event pattern defined**

```yaml
  my_cloudwatch_target:
    type: cloudify.nodes.aws.cloudwatch.Target
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### DynamoDB Table Example

**Creates DynamoDB table**

```yaml
  my_dynamodb_table:
    type: cloudify.nodes.aws.dynamodb.Table
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### ECS Cluster Example

**Creates a new Amazon ECS cluster**

```yaml
  ecs_cluster:
    type: cloudify.nodes.aws.ecs.Cluster
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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


### ECS Service Example

**Creates ECS service that runs and maintains a desired number of tasks from a specified task definition**

```yaml
  my_ecs_service:
    type: cloudify.nodes.aws.ecs.Service
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          clusterName: { get_input: ecs_cluster_name }

  task_definition:
    type: cloudify.nodes.aws.ecs.TaskDefinition
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### ECS Task Definition Example

**Registers a new task definition from the supplied family and containerDefinitions**

```yaml
  my_task_definition:
    type: cloudify.nodes.aws.ecs.TaskDefinition
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### EFS File System Example

**Creates a new, empty file system**

```yaml
   my_file_system:
    type: cloudify.nodes.aws.efs.FileSystem
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### EFS File System Tags Example

**Creates or overwrites tags associated with a file system**

```yaml
  my_file_system_tags:
    type: cloudify.nodes.aws.efs.FileSystemTags
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### EFS Mount Target Example

**Creates a mount target for a file system**

```yaml
  my_mount_target:
    type: cloudify.nodes.aws.efs.MountTarget
    properties:
      resource_config: {}
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config: {}

  security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### Classic ELB Health Check Example

**Creates health check settings to use when evaluating the health state of EC2 instance**

```yaml
  my_classic_health_check:
    type: cloudify.nodes.aws.elb.Classic.HealthCheck
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### Classic ELB Listeners Example

**Creates listener for the specified load balancer**

```yaml
  my_classic_elb_listener:
    type: cloudify.nodes.aws.elb.Classic.Listener
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### Classic ELB Example

**Creates a classic load balancer**

```yaml
  classic_elb:
    type: cloudify.nodes.aws.elb.Classic.LoadBalancer
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### Classic ELB Policy Example

**Creates a policy with the specified attributes for the specified load balancer**

```yaml
  my_classic_policy:
    type: cloudify.nodes.aws.elb.Classic.Policy
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### Classic ELB Policy Stickiness Example

**Creates a stickiness policy with sticky session lifetimes controlled by the lifetime of the browser (user-agent)**

```yaml
  my_classic_stickiness_policy:
    type: cloudify.nodes.aws.elb.Classic.Policy.Stickiness
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### ELB V2 Listener Example

**Creates a listener for the specified application load balancer**

```yaml
  my_http_listener:
    type: cloudify.nodes.aws.elb.Listener
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### ELB V2 Example

**Creates an application load balancer**

```yaml
  my_elb:
    type: cloudify.nodes.aws.elb.LoadBalancer
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    relationships:
      - type: cloudify.relationships.depends_on
        target: vpc

  subnet1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

**Creates an application load balancer**

```yaml
  my_forward_rule:
    type: cloudify.nodes.aws.elb.Rule
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### ELB V2 Target Group Example

**Creates a target group**

```yaml
  my_forward_target_group:
    type: cloudify.nodes.aws.elb.TargetGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### IAM Access Key Example

**Creates a new AWS secret access key and corresponding AWS access key ID for the specified user**

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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### IAM Group Example

**Creates a new group**

```yaml
  iam_group:
    type: cloudify.nodes.aws.iam.Group
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### IAM Instance Profile Example

**Creates a new instance profile**

```yaml
  iam_user_instance_profile:
    type: cloudify.nodes.aws.iam.InstanceProfile
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
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

### IAM Login Profile Example

**Creates a password for the specified user, giving the user the ability to access AWS services through the AWS Management Console**

```yaml
  iam_login_profile:
    type: cloudify.nodes.aws.iam.LoginProfile
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
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

### IAM Policy Example

**Creates a new managed policy for your AWS account**

```yaml
  iam_policy:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### IAM Role Example

**Creates a new role for your AWS account**

```yaml
  iam_role:
    type: cloudify.nodes.aws.iam.Role
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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


  iam_policy_cloudwatch_access:
    type: cloudify.nodes.aws.iam.Policy
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
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

**Policy ARN**

  * List of ARN policies to be provided. The list needs to contain dictionaries containing a single ARN policy with the key 'PolicyArn'
     
In the following example 2 policies are added using the Policy ARNs property:

```yaml      
  policy_arns: 
    - PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
    - PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
```

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes the [PutRolePolicy](https://docs.aws.amazon.com/IAM/latest/APIReference/API_PutRolePolicy.html) action.  
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteRolePolicy](https://docs.aws.amazon.com/IAM/latest/APIReference/API_DeleteRolePolicy.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.iam.Role`:  Associate policy with certain role.

### IAM Role Policy Example

**Adds or updates an inline policy document that is embedded in the specified IAM role**

```yaml
  iam_role_policy:
    type: cloudify.nodes.aws.iam.RolePolicy
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
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

### IAM User Example

**Creates a new IAM user for AWS account**

```yaml
  iam_user:
    type: cloudify.nodes.aws.iam.User
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### KMS Alias Example

**Creates a display name for a customer managed customer master key (CMK)**

```yaml
  my_alias:
    type: cloudify.nodes.aws.kms.Alias
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### KMS Customer Master Key Example

**Creates a customer managed customer master key (CMK) in AWS account**

```yaml
  my_cmk:
    type: cloudify.nodes.aws.kms.CustomerMasterKey
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### KMS Grant Example

**Adds a grant to a customer master key (CMK)**

```yaml
  my_grant:
    type: cloudify.nodes.aws.kms.Grant
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### Lambda Function Example

**Creates a Lambda function**

```yaml
  my_lambda_function:
    type: cloudify.nodes.aws.lambda.Function
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

### Lambda Invoke Example

**Invokes a Lambda function**

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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
    * `cloudify.nodes.aws.lambda.Function`: Associate permission with certain function.

### Lambda Permission Example

**Grants an AWS service or another account permission to use a function**

```yaml
  my_lambda_function_permission:
    type: cloudify.nodes.aws.lambda.Permission
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
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

This node type refers to an AWS RDS Instance

**Resource Config**

For more information, and possible keyword arguments, see: [RDS Instance:create_db_instance](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.create_db_instance)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateDBInstance](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_CreateDBInstance.html) action.
  * `cloudify.interfaces.lifecycle.start`: Updates an AWS RDS instance runtime properties by executing the [DescribeDBInstances](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBInstances.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteDBInstance](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DeleteDBInstance.html) action.

**Relationships**

  * `cloudify.relationships.aws.rds.instance.connected_to`:
    * `cloudify.nodes.aws.rds.SubnetGroup`: Associate rds instance with certain subnet group.
    * `cloudify.nodes.aws.rds.OptionGroup`: Associate rds instance with certain option group.
    * `cloudify.nodes.aws.rds.ParameterGroup`: Associate rds instance with certain parameter group.
    * `cloudify.aws.nodes.SecurityGroup`: Associate rds instance with certain security group.
    * `cloudify.nodes.aws.iam.Role`: Associate rds instance with certain role.

### RDS Instance Example

**Creates a new DB instance**

```yaml
  my_rds_mysql_instance:
    type: cloudify.nodes.aws.rds.Instance
    properties:
      resource_id: devdbinstance
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config:
              DBInstanceClass: db.t2.small
              Engine: mysql
              EngineVersion: 5.7.16
              AvailabilityZone: us-west-1a
              StorageType: gp2
              AllocatedStorage: 10
              DBName: devdb
              MasterUsername: root
              MasterUserPassword: Password1234
    relationships:
    - type: cloudify.relationships.aws.rds.instance.connected_to
      target: rds_subnet_group
    - type: cloudify.relationships.aws.rds.instance.connected_to
      target: rds_option_group
    - type: cloudify.relationships.aws.rds.instance.connected_to
      target: rds_parameter_group
    - type: cloudify.relationships.aws.rds.instance.connected_to
      target: rds_security_group

  rds_subnet_group:
    type: cloudify.nodes.aws.rds.SubnetGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-subnet-group
      resource_config:
        kwargs:
          DBSubnetGroupDescription: MySQL5.7 Subnet Group for Dev
    relationships:
    - type: cloudify.relationships.aws.rds.subnet_group.connected_to
      target: rds_subnet_1
    - type: cloudify.relationships.aws.rds.subnet_group.connected_to
      target: rds_subnet_2

  rds_subnet_1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_subnet_1_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  rds_subnet_2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_subnet_2_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  rds_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_id }
```

## **cloudify.nodes.aws.rds.InstanceReadReplica**

This node type refers to an AWS RDS Instance Read Replica

**Resource Config**

For more information, and possible keyword arguments, see: [RDS Instance Read Replica:create_db_instance_read_replica](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.create_db_instance_read_replica)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateDBInstanceReadReplica](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_CreateDBInstanceReadReplica.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteDBInstance](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DeleteDBInstance.html) action.

**Relationships**

  * `cloudify.relationships.aws.rds.instance_read_replica.connected_to`:
    * `cloudify.nodes.aws.rds.SubnetGroup`: Associate rds instance read replica with certain subnet group.
    * `cloudify.nodes.aws.rds.OptionGroup`: Associate rds instance read replica  with certain option group.
    * `cloudify.nodes.aws.rds.Instance`: Associate rds instance read replica with certain rds instance.
    * `cloudify.nodes.aws.iam.Role`: Associate rds instance read replica  with certain role.

### RDS Instance Read Replica Example

**Creates a new DB instance that acts as a Read Replica for an existing source DB instance**

```yaml
  my_rds_mysql_read_replica:
    type: cloudify.nodes.aws.rds.InstanceReadReplica
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: devdbinstance-replica
      resource_config:
        kwargs:
          SourceDBInstanceIdentifier: { get_property: [rds_mysql_instance, resource_id] }
          DBInstanceClass: db.t2.small
          AvailabilityZone: us-west-1c
    relationships:
    - type: cloudify.relationships.aws.rds.instance_read_replica.connected_to
      target: rds_mysql_instance
    - type: cloudify.relationships.aws.rds.instance_read_replica.connected_to
      target: rds_option_group
    - type: cloudify.relationships.aws.rds.instance_read_replica.connected_to
      target: rds_parameter_group

  rds_option_group:
    type: cloudify.nodes.aws.rds.OptionGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-option-group
      resource_config:
        kwargs:
          EngineName: mysql
          MajorEngineVersion: '5.7'
          OptionGroupDescription: MySQL5.7 Option Group for Dev
    relationships:
    - type: cloudify.relationships.aws.rds.option_group.connected_to
      target: rds_option_1

  rds_option_1:
    type: cloudify.nodes.aws.rds.Option
    properties:
      resource_id: MEMCACHED
      resource_config:
        kwargs:
          Port: 21212
    relationships:
    - type: cloudify.relationships.aws.rds.option.connected_to
      target: rds_security_group

  rds_security_group:
    type: cloudify.nodes.aws.ec2.SecurityGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_security_group_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  rds_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_id }

  rds_parameter_group:
    type: cloudify.nodes.aws.rds.ParameterGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-param-group
      resource_config:
        kwargs:
          DBParameterGroupFamily: mysql5.7
          Description: MySQL5.7 Parameter Group for Dev
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

  rds_mysql_instance:
    type: cloudify.nodes.aws.rds.Instance
    properties:
      resource_id: devdbinstance
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config:
              DBInstanceClass: db.t2.small
              Engine: mysql
              EngineVersion: 5.7.16
              AvailabilityZone: us-west-1a
              StorageType: gp2
              AllocatedStorage: 10
              DBName: devdb
              MasterUsername: root
              MasterUserPassword: Password1234
    relationships:
    - type: cloudify.relationships.aws.rds.instance.connected_to
      target: rds_subnet_group
    - type: cloudify.relationships.aws.rds.instance.connected_to
      target: rds_option_group
    - type: cloudify.relationships.aws.rds.instance.connected_to
      target: rds_parameter_group
    - type: cloudify.relationships.aws.rds.instance.connected_to
      target: rds_security_group

  rds_subnet_group:
    type: cloudify.nodes.aws.rds.SubnetGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-subnet-group
      resource_config:
        kwargs:
          DBSubnetGroupDescription: MySQL5.7 Subnet Group for Dev
    relationships:
    - type: cloudify.relationships.aws.rds.subnet_group.connected_to
      target: rds_subnet_1
    - type: cloudify.relationships.aws.rds.subnet_group.connected_to
      target: rds_subnet_2

  rds_subnet_1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_subnet_1_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  rds_subnet_2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_subnet_2_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc
```

## **cloudify.nodes.aws.rds.Option**

This node type refers to an AWS RDS Option

**Resource Config**

For more information, and possible keyword arguments, see: [RDS Option:modify_option_group](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/rds.html#RDS.Client.modify_option_group)

**Operations**

  * `cloudify.interfaces.lifecycle.configure`: Store `resource_config` in runtime properties.

**Relationships**

  * `cloudify.relationships.aws.rds.option.connected_to`:
    * `cloudify.nodes.aws.rds.OptionGroup`: Associate rds option with certain option group.
    * `cloudify.nodes.aws.ec2.SecurityGroup`: Associate rds option with certain security group.

### RDS Option Example

**Creates new option to an existing option group**

```yaml
  my_rds_option:
    type: cloudify.nodes.aws.rds.Option
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: MEMCACHED
      resource_config:
        kwargs:
          Port: 21212
    relationships:
    - type: cloudify.relationships.aws.rds.option.connected_to
      target: rds_security_group

  rds_subnet_group:
    type: cloudify.nodes.aws.rds.SubnetGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-subnet-group
      resource_config:
        kwargs:
          DBSubnetGroupDescription: MySQL5.7 Subnet Group for Dev
    relationships:
    - type: cloudify.relationships.aws.rds.subnet_group.connected_to
      target: rds_subnet_1
    - type: cloudify.relationships.aws.rds.subnet_group.connected_to
      target: rds_subnet_2

  rds_subnet_1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_subnet_1_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  rds_subnet_2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_subnet_2_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

   rds_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_id }
```

## **cloudify.nodes.aws.rds.OptionGroup**

This node type refers to an AWS RDS Option Group

**Resource Config**

For more information, and possible keyword arguments, see: [RDS Option Group:create_option_group](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.create_option_group)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes the [CreateOptionGroup](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_CreateOptionGroup.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteOptionGroup](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DeleteOptionGroup.html) action.

**Relationships**

  * `cloudify.relationships.aws.rds.option_group.connected_to`:
    * `cloudify.nodes.aws.rds.Option`: Add certain rds option to option group.

### RDS Option Group Example

**Creates new option to an existing option group**

```yaml
  my_rds_option_group:
    type: cloudify.nodes.aws.rds.OptionGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-option-group
      resource_config:
        kwargs:
          EngineName: mysql
          MajorEngineVersion: '5.7'
          OptionGroupDescription: MySQL5.7 Option Group for Dev
    relationships:
    - type: cloudify.relationships.aws.rds.option_group.connected_to
      target: rds_option_1

  rds_option_1:
    type: cloudify.nodes.aws.rds.Option
    properties:
      resource_id: MEMCACHED
      resource_config:
        kwargs:
          Port: 21212
    relationships:
    - type: cloudify.relationships.aws.rds.option.connected_to
      target: rds_security_group

  rds_subnet_group:
    type: cloudify.nodes.aws.rds.SubnetGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-subnet-group
      resource_config:
        kwargs:
          DBSubnetGroupDescription: MySQL5.7 Subnet Group for Dev
    relationships:
    - type: cloudify.relationships.aws.rds.subnet_group.connected_to
      target: rds_subnet_1
    - type: cloudify.relationships.aws.rds.subnet_group.connected_to
      target: rds_subnet_2

  rds_subnet_1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_subnet_1_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  rds_subnet_2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_subnet_2_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  rds_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_id }  
```

## **cloudify.nodes.aws.rds.Parameter**

This node type refers to an AWS RDS Parameter

**Resource Config**

For more information, and possible keyword arguments, see: [RDS Parameter:modify_db_parameter_group](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.modify_db_parameter_group)

**Operations**

  * `cloudify.interfaces.lifecycle.configure`: Store `resource_config` in runtime properties.

**Relationships**

  * `cloudify.relationships.aws.rds.parameter.connected_to`:
    * `cloudify.nodes.aws.rds.ParameterGroup`: Associate rds parameter with certain parameter group.

### RDS Parameter Example

**Creates new parameter to an existing parameter group**

```yaml
  my_rds_parameter:
    type: cloudify.nodes.aws.rds.Parameter
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: binlog_cache_size
      resource_config:
        kwargs:
          ApplyMethod: immediate
    relationships:
    - type: cloudify.relationships.aws.rds.parameter.connected_to
      target: rds_parameter_group

  rds_parameter_group:
    type: cloudify.nodes.aws.rds.ParameterGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-param-group
      resource_config:
        kwargs:
          DBParameterGroupFamily: mysql5.7
          Description: MySQL5.7 Parameter Group for Dev
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
```

## **cloudify.nodes.aws.rds.ParameterGroup**

This node type refers to an AWS RDS Parameter Group

**Resource Config**

For more information, and possible keyword arguments, see: [RDS Parameter Group:create_db_parameter_group](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.create_db_parameter_group)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes the [CreateDBParameterGroup](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_CreateDBParameterGroup.html) action.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [ModifyDBParameterGroup](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_ModifyDBParameterGroup.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteDBParameterGroup](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DeleteDBParameterGroup.html) action.  

**Relationships**

  * `cloudify.relationships.aws.rds.parameter_group.connected_to`:
    * `cloudify.nodes.aws.rds.Parameter`: Add certain rds parameter to parameter group.

### RDS Parameter Group Example

**Creates a new DB parameter group**

```yaml
  my_rds_parameter_group:
    type: cloudify.nodes.aws.rds.ParameterGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-param-group
      resource_config:
        kwargs:
          DBParameterGroupFamily: mysql5.7
          Description: MySQL5.7 Parameter Group for Dev
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
    relationships:
      - type: cloudify.relationships.aws.rds.parameter_group.connected_to
        target: rds_parameter

  rds_parameter:
    type: cloudify.nodes.aws.rds.Parameter
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: binlog_cache_size
      resource_config:
        kwargs:
          ApplyMethod: immediate
```

## **cloudify.nodes.aws.rds.SubnetGroup**

This node type refers to an AWS RDS Subnet Group

**Resource Config**

For more information, and possible keyword arguments, see: [RDS Subnet Group:create_db_subnet_group](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.create_db_subnet_group)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateDBSubnetGroup](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_CreateDBSubnetGroup.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteDBSubnetGroup](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DeleteDBSubnetGroup.html) action.  

**Relationships**

  * `cloudify.relationships.aws.rds.subnet_group.connected_to`:
    * `cloudify.nodes.aws.ec2.Subnet`: Associate one or more subnets with subnet group.

### RDS Subnet Group Example

**Creates a new DB subnet group**

```yaml
  my_rds_subnet_group:
    type: cloudify.nodes.aws.rds.SubnetGroup
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: dev-rds-subnet-group
      resource_config:
        kwargs:
          DBSubnetGroupDescription: MySQL5.7 Subnet Group for Dev
    relationships:
    - type: cloudify.relationships.aws.rds.subnet_group.connected_to
      target: rds_subnet_1
    - type: cloudify.relationships.aws.rds.subnet_group.connected_to
      target: rds_subnet_2

  rds_subnet_1:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_subnet_1_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc

  rds_subnet_2:
    type: cloudify.nodes.aws.ec2.Subnet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      use_external_resource: true
      resource_id: { get_input: aws_vpc_subnet_2_id }
    relationships:
      - type: cloudify.relationships.depends_on
        target: rds_vpc
```

## **cloudify.nodes.aws.route53.HostedZone**

This node type refers to an AWS Route53 Hosted Zone

**Resource Config**

For more information, and possible keyword arguments, see: [Route53 HostedZone:create_hosted_zone](http://boto3.readthedocs.io/en/latest/reference/services/route53.html#Route53.Client.create_hosted_zone)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateHostedZone](https://docs.aws.amazon.com/Route53/latest/APIReference/API_CreateHostedZone.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteHostedZone](https://docs.aws.amazon.com/Route53/latest/APIReference/API_DeleteHostedZone.html) action.  

**Relationships**

  * `cloudify.relationships.aws.route53.hosted_zone.connected_to`:
    * `cloudify.aws.nodes.VPC`: Associate hosted zone with certain vpc.

### Route53 Hosted Zone Example

**Creates a new private hosted zone**

```yaml
  my_dns_hosted_zone:
    type: cloudify.nodes.aws.route53.HostedZone
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_id: !!str getcloudify.org
      resource_config:
        kwargs:
          HostedZoneConfig:
            Comment: !!str Cloudify-generated DNS Hosted Zone
            PrivateZone: !!bool true
          VPC:
            VPCRegion: { get_input: aws_region_name }
            VPCId: { get_attribute: [ dns_vpc, aws_resource_id ] }
    relationships:
    - type: cloudify.relationships.aws.route53.hosted_zone.connected_to
      target: dns_vpc

  dns_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: { get_input: vpc_cidr }
```

## **cloudify.nodes.aws.route53.RecordSet**

This node type refers to an AWS Route53 Record Set

**Resource Config**

For more information, and possible keyword arguments, see: [Route53 RecordSet:change_resource_record_sets](http://boto3.readthedocs.io/en/latest/reference/services/route53.html#Route53.Client.change_resource_record_sets)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes the [ChangeResourceRecordSets](https://docs.aws.amazon.com/Route53/latest/APIReference/API_ChangeResourceRecordSets.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [ChangeResourceRecordSets](https://docs.aws.amazon.com/Route53/latest/APIReference/API_ChangeResourceRecordSets.html) action.  

**Relationships**

  * `cloudify.relationships.aws.route53.record_set.connected_to`:
    * `cloudify.nodes.aws.route53.HostedZone`: Associate record set with certain hosted zone.

### Route53 Record Set Example

**Creates a resource record set**

```yaml
  my_dns_record_set:
    type: cloudify.nodes.aws.route53.RecordSet
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Action: UPSERT
          ResourceRecordSet:
            Name: { concat: ["staging.", { get_property: [dns_hosted_zone, resource_id] }] }
            Type: !!str TXT
            TTL: !!int 60
            ResourceRecords:
            - Value: '"Created using Cloudify"'
    relationships:
    - type: cloudify.relationships.aws.route53.record_set.connected_to
      target: dns_hosted_zone

  dns_hosted_zone:
    type: cloudify.nodes.aws.route53.HostedZone
    properties:
      resource_id: !!str getcloudify.org
      client_config:
        aws_access_key_id: { get_input: aws_access_key_id }
        aws_secret_access_key: { get_input: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          HostedZoneConfig:
            Comment: !!str Cloudify-generated DNS Hosted Zone
            PrivateZone: !!bool true
          VPC:
            VPCRegion: { get_input: aws_region_name }
            VPCId: { get_attribute: [ dns_vpc, aws_resource_id ] }
    relationships:
    - type: cloudify.relationships.aws.route53.hosted_zone.connected_to
      target: dns_vpc

  dns_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        CidrBlock: { get_input: vpc_cidr }
```

## **cloudify.nodes.aws.s3.Bucket**

This node type refers to an AWS S3 Bucket

**Resource Config**

  * `Bucket`: String. The bucket name.
  * `ACL`: String. The canned ACL to apply to the bucket.
  * `CreateBucketConfiguration`: Map. Specifies the region where the bucket will be created.
     * `LocationConstraint`: String.  If you don't specify a region, the bucket will be created in US Standard.

For more information, and possible keyword arguments, see: [S3 Bucket:create_bucket](http://boto3.readthedocs.io/en/latest/reference/services/s3.html#S3.Client.create_bucket)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PUT Bucket](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUT.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DELETE Bucket](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketDELETE.html) action.

### S3 Bucket Example

**creates a new bucket**

```yaml
  my_bucket:
    type: cloudify.nodes.aws.s3.Bucket
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Bucket: test-cloudify-bucket
        ACL: public-read-write
        CreateBucketConfiguration:
          LocationConstraint: { get_input: aws_region_name }
```

## **cloudify.nodes.aws.s3.BucketLifecycleConfiguration**

This node type refers to an AWS S3 Bucket Lifecycle Configuration

**Resource Config**

  * `Bucket`: String. The bucket name.
  * `LifecycleConfiguration`: Map. The lifecycle configuration.
     * `Rules`: List. A list of rules in dict format with keys Prefix, Status, etc.


For more information, and possible keyword arguments, see: [S3 BucketLifecycleConfiguration:put_bucket_lifecycle](http://boto3.readthedocs.io/en/latest/reference/services/s3.html#S3.Client.put_bucket_lifecycle)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PUT Bucket lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTlifecycle.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DELETE Bucket lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketDELETElifecycle.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.s3.Bucket`: Associate lifecycle configuration with certain bucket.

### S3 Bucket Lifecycle Configuration Example

**Creates a new lifecycle configuration for the bucket**

```yaml
  my_bucket_lifecycle_configuration:
    type: cloudify.nodes.aws.s3.BucketLifecycleConfiguration
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        LifecycleConfiguration:
          Rules:
          - ID: Standard Rule LFC
            Prefix: boto3
            Status: Disabled
            Transition:
              Days: 31
              StorageClass: STANDARD_IA
            Expiration:
              Days: 95
    relationships:
    - type: cloudify.relationships.depends_on
      target: bucket

   bucket:
    type: cloudify.nodes.aws.s3.Bucket
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Bucket: test-cloudify-bucket
        ACL: public-read-write
        CreateBucketConfiguration:
          LocationConstraint: { get_input: aws_region_name }
```

## **cloudify.nodes.aws.s3.BucketPolicy**

This node type refers to an AWS S3 Bucket Policy

**Resource Config**

  * `Bucket`: String. The bucket name.
  * `ConfirmRemoveSelfBucketAccess`: Boolean. Set this parameter to true to confirm that you want to remove your permissions to change this bucket policy in the future.
  * `Policy`: Map. The bucket policy.


For more information, and possible keyword arguments, see: [S3 BucketPolicy:put_bucket_policy](http://boto3.readthedocs.io/en/latest/reference/services/s3.html#S3.Client.put_bucket_policy)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PUT Bucket Policy](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTpolicy.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DELETE Bucket Policy](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketDELETEpolicy.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.s3.Bucket`: Associate bucket policy with certain bucket.

### S3 Bucket Policy Example

**Creates a new bucket policy for the bucket**

```yaml
  my_bucket_policy:
    type: cloudify.nodes.aws.s3.BucketPolicy
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Policy:
          Version: '2012-10-17'
          Statement:
          - Sid: EveryoneGetPlugin
            Effect: Allow
            Principal: "*"
            Action:
            - "s3:GetObject"
            Resource: { concat: [ 'arn:aws:s3:::', { get_property: [ bucket, resource_config, Bucket ] } , '/*' ] }
    relationships:
    - type: cloudify.relationships.depends_on
      target: bucket

   bucket:
    type: cloudify.nodes.aws.s3.Bucket
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Bucket: test-cloudify-bucket
        ACL: public-read-write
        CreateBucketConfiguration:
          LocationConstraint: { get_input: aws_region_name }
```

## **cloudify.nodes.aws.s3.BucketTagging**

This node type refers to an AWS S3 Bucket Tagging

**Resource Config**

  * `Bucket`: String. The bucket to tag.
  * `Tagging`: Map. The tagging set.
    * `TagSet`: List. A list of maps with a keys Key and Value.


For more information, and possible keyword arguments, see: [S3 BucketTagging:put_bucket_tagging](http://boto3.readthedocs.io/en/latest/reference/services/s3.html#S3.Client.put_bucket_tagging)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PUT Bucket Tagging](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTtagging.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DELETE Bucket Tagging](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketDELETEtagging.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.s3.Bucket`: Associate bucket tagging with certain bucket.

### S3 Bucket Tagging Example

**Creates a set of tags to an existing bucket**

```yaml
  my_bucket_tagging:
    type: cloudify.nodes.aws.s3.BucketTagging
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Tagging:
          TagSet:
          - Key: Name
            Value: aws-test-bucket-tagging
    relationships:
    - type: cloudify.relationships.depends_on
      target: bucket

   bucket:
    type: cloudify.nodes.aws.s3.Bucket
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Bucket: test-cloudify-bucket
        ACL: public-read-write
        CreateBucketConfiguration:
          LocationConstraint: { get_input: aws_region_name }
```


## **cloudify.nodes.aws.s3.BucketObject**

This node type refers to an AWS S3 Bucket Tagging

**Resource Config**

  * `Bucket`: String. The bucket name.
  * `Key`: String. Object key for which the PUT operation was initiated.
  * `ACL`: String. The canned ACL to apply to the object.

For more information, and possible keyword arguments, see: [S3 BucketObject:put_object](https://boto3.readthedocs.io/en/latest/reference/services/s3.html#S3.Client.put_object)

**Properties**

  * `source_type`: String. This property represents the source type of the object that need to be upload to the S3. the following options supported:
     - remote: Read data from remote url
     - local: Read data from local url exists with blueprint
     - bytes: Read data as sequence of bytes.These bytes should be specified inside "Body" param inside "resource_config"
  * `path`: String. This property represents the path to read file that need to be uploaded to the S3 and this param should only provided when the source_type is "local" or "remote"

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [PUT Object](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectPUT.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DELETE Object](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectDELETE.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.s3.Bucket`: Associate bucket object with certain bucket.

### S3 Bucket Object Examples

**Adds an object to a bucket**

This example demonstrates how to add new object to the bucket by reading bytes data in `Body`

```yaml
  my_bucket_object_bytes:
    type: cloudify.nodes.aws.s3.BucketObject
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      source_type: 'bytes'
      resource_config:
        ACL: 'public-read'
        Bucket: { get_property: [ bucket, resource_config, Bucket ] }
        Key: 'test-byte-data.txt'
        kwargs:
          Body: 'Test Bytes Mode'
    relationships:
    - type: cloudify.relationships.depends_on
      target: bucket

  bucket:
    type: cloudify.nodes.aws.s3.Bucket
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Bucket: test-cloudify-bucket
        ACL: public-read-write
        CreateBucketConfiguration:
          LocationConstraint: { get_input: aws_region_name }
```
This example demonstrates how to add new object to the bucket by reading local file data in `path`

```yaml
  my_bucket_object_bytes:
    type: cloudify.nodes.aws.s3.BucketObject
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      source_type: 'local'
      path: './local-s3-object.txt'
      resource_config:
        ACL: 'public-read'
        Bucket: { get_property: [ bucket, resource_config, Bucket ] }
        Key: 'local-s3-object.txt'
    relationships:
    - type: cloudify.relationships.depends_on
      target: bucket

  bucket:
    type: cloudify.nodes.aws.s3.Bucket
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Bucket: test-cloudify-bucket
        ACL: public-read-write
        CreateBucketConfiguration:
          LocationConstraint: { get_input: aws_region_name }
```

This example demonstrates how to add new object to the bucket by reading remote file url in `path`

```yaml
  my_bucket_object_bytes:
    type: cloudify.nodes.aws.s3.BucketObject
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      source_type: 'remote'
      path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      resource_config:
        ACL: 'public-read'
        Bucket: { get_property: [ bucket, resource_config, Bucket ] }
        Key: 'dummy.pdf'
    relationships:
    - type: cloudify.relationships.depends_on
      target: bucket

  bucket:
    type: cloudify.nodes.aws.s3.Bucket
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        Bucket: test-cloudify-bucket
        ACL: public-read-write
        CreateBucketConfiguration:
          LocationConstraint: { get_input: aws_region_name }
```

## **cloudify.nodes.aws.SNS.Subscription**

This node type refers to an AWS SNS Subscription

**Resource Config**

For more information, and possible keyword arguments, see: [SNS Subscription:subscribe](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sns.html#SNS.Client.subscribe)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html) action.
  * `cloudify.interfaces.lifecycle.start`: Executes the [GetSubscriptionAttributes](https://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [Unsubscribe](https://docs.aws.amazon.com/sns/latest/api/API_Unsubscribe.html) action.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.aws.SNS.Topic`: Associate subscription with certain topic.

### SNS Subscription Example

**Creates a subscription to endpoint**

```yaml
  my_subscription:
    type: cloudify.nodes.aws.SNS.Subscription
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Protocol: sqs
          Endpoint: queue
    relationships:
      - type: cloudify.relationships.depends_on
        target: topic

  topic:
    type: cloudify.nodes.aws.SNS.Topic
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Name: TestCloudifyTopic
```

## **cloudify.nodes.aws.SNS.Topic**

This node type refers to an AWS SNS Topic

**Resource Config**

For more information, and possible keyword arguments, see: [SNS Topic:create_topic](http://boto3.readthedocs.io/en/latest/reference/services/sns.html#SNS.Client.create_topic)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateTopic](https://docs.aws.amazon.com/sns/latest/api/API_CreateTopic.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteTopic](https://docs.aws.amazon.com/sns/latest/api/API_DeleteTopic.html) action.

### SNS Topic Example

**Creates a topic to which notifications can be published**

```yaml
  my_topic:
    type: cloudify.nodes.aws.SNS.Topic
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Name: TestCloudifyTopic
```
## **cloudify.nodes.aws.SQS.Queue**

This node type refers to an AWS SQS Queue

**Resource Config**

For more information, and possible keyword arguments, see: [SQS Queue:create_queue](http://boto3.readthedocs.io/en/latest/reference/services/sqs.html#SQS.Client.create_queue)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.configure`: Executes the [CreateQueue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_CreateQueue.html) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteQueue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_DeleteQueue.html) action.

### SQS Example

**Creates a new standard**

```yaml
  my_queue:
    type: cloudify.nodes.aws.SQS.Queue
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_input: aws_region_name }
      resource_config:
        kwargs:
          Attributes:
            Policy:
              {
                "Version": "2012-10-17",
                "Statement": [
                  {
                    "Sid": "Sid1",
                    "Effect": "Deny",
                    "Principal": "*",
                    "Action": [
                      "SQS:SendMessage",
                      "SQS:ReceiveMessage"
                    ],
                    "Resource": "test-queue",
                    "Condition": {
                      "DateGreaterThan" : {
                         "aws:CurrentTime" : "2013-12-15T12:00:00Z"
                      }
                    }
                  }
                ]
              }
            MessageRetentionPeriod: '86400'
            VisibilityTimeout: '180'
```
## **Known Issues**
### 1. AWS plugin clock sync issue
in some cases, even if your credentials are correct and a error like this appears:
```shell
AWS was not able to validate the provided access credentials
Causes (most recent cause last):
--------------------------------
Traceback (most recent call last):
  File "/opt/mgmtworker/env/plugins/default_tenant/cloudify-aws-plugin-2.0.0/lib/python2.7/site-packages/cloudify_aws/common/__init__.py", line 87, in make_client_call
    res = client_method(**client_method_args)
  File "/opt/mgmtworker/env/plugins/default_tenant/cloudify-aws-plugin-2.0.0/lib/python2.7/site-packages/botocore/client.py", line 357, in _api_call
    return self._make_api_call(operation_name, kwargs)
  File "/opt/mgmtworker/env/plugins/default_tenant/cloudify-aws-plugin-2.0.0/lib/python2.7/site-packages/botocore/client.py", line 661, in _make_api_call
    raise error_class(parsed_response, operation_name)
ClientError: An error occurred (AuthFailure) when calling the CreateNetworkInterface operation: AWS was not able to validate the provided access credentials
```
If the credentials are correct and no boto/aws CLI configuration files are on the filesystem, try resyncing your clock, e.g.
```shell
sudo ntpdate 1.ro.pool.ntp.org
```


## **cloudify.nodes.aws.eks.Cluster**

This node type refers to an AWS EKS Cluster

**Resource Config**

For more information, and possible keyword arguments, see: [EKS Cluster:create_cluster](http://boto3.readthedocs.io/en/latest/reference/services/eks.html#EKS.Client.create_cluster)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `kube_config` in runtime properties.  
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteCluster](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/eks.html#EKS.Client.delete_cluster) action.

**Relationships**

  * `cloudify.relationships.aws.eks.connected_to_eks_cluster`: Refreshes the access token of the kubeconfig that stored inside `kubeconf` runtime property if `store_kube_config_in_runtime` is true.
    Use this relationship on kubernetes resources which use the `kubeconf` runtime property of `cloudify.nodes.aws.eks.Cluster` in oder to authenticate.

### EKS Examples

**Creates a new EKS Cluster**

```yaml
  eks_cluster:
    type: cloudify.nodes.aws.eks.Cluster
    properties:
      resource_config:
        kwargs:
          name: { get_input: eks_cluster_name }
          version: { get_input: kubernetes_version }
          roleArn: { get_attribute: [ eks_service_iam_role, aws_resource_arn ] }
          resourcesVpcConfig:
            subnetIds:
              - { get_attribute: [ private_subnet_01, aws_resource_id ] }
              - { get_attribute: [ private_subnet_02, aws_resource_id ] }
              - { get_attribute: [ public_subnet_01, aws_resource_id ] }
              - { get_attribute: [ public_subnet_02, aws_resource_id ] }
            securityGroupIds:
              - { get_attribute: [ security_group, aws_resource_id ] }
            endpointPublicAccess: True
            endpointPrivateAccess: False
      client_config: *client_config
      store_kube_config_in_runtime: True
```

**Uses connected_to_eks_cluster Relationship**

```yaml
  new_service_account:
    type: cloudify.kubernetes.resources.ServiceAccount
    properties:
      client_config:
        configuration:
          file_content: { get_attribute: [ eks_cluster, kubeconf ] }
      definition:
        apiVersion: v1
        kind: ServiceAccount
        metadata:
          name: { get_input: service_account_name }
          namespace: { get_input: service_account_namespace }
      options:
        namespace: { get_input: service_account_namespace }
    relationships:
      - type: cloudify.relationships.aws.eks.connected_to_eks_cluster
        target: eks_cluster
```

## **cloudify.nodes.aws.eks.NodeGroup**

This node type refers to an AWS EKS NodeGroup

**Resource Config**

For more information, and possible keyword arguments, see: [Node Group:create_nodegroup](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/eks.html#EKS.Client.create_nodegroup)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: it will create nodegroup on EKS cluster.  
  * `cloudify.interfaces.lifecycle.delete`: Executes the [DeleteNodeGroup](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/eks.html#EKS.Client.delete_nodegroup) action.

### NodeGroup Example

**Creates a new EKS Cluster NodeGroup**

```yaml
  eks_node_group:
    type: cloudify.nodes.aws.eks.NodeGroup
    properties:
      resource_config:
        kwargs:
          clusterName: { get_input: eks_cluster_name }
          nodegroupName: { get_input: eks_nodegroup_name }
          scalingConfig:
            minSize: 1
            maxSize: 1
            desiredSize: 1
          diskSize: 20
          subnets:
              - { get_attribute: [ private_subnet_01, aws_resource_id ] }
              - { get_attribute: [ private_subnet_02, aws_resource_id ] }
              - { get_attribute: [ public_subnet_01, aws_resource_id ] }
              - { get_attribute: [ public_subnet_02, aws_resource_id ] }
          instanceTypes:
            - t3.medium
          amiType: AL2_x86_64
          nodeRole: { get_attribute: [ eks_nodegroup_iam_role, aws_resource_arn ] }
          remoteAccess:
            ec2SshKey: { get_input: ssh_keypair }
      client_config: *client_config
```


## **cloudify.nodes.aws.codepipeline.Pipeline**

This node type refers to an AWS Codepipeline pipeline.

**Resource Config**

For more information, and possible keyword arguments, see: [CodePipeline:create_pipeline](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/codepipeline.html#CodePipeline.Client.create_pipeline)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes [create_pipeline](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/codepipeline.html#CodePipeline.Client.create_pipeline) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_pipeline](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/codepipeline.html#CodePipeline.Client.delete_pipeline) action.
  * `aws.codepipeline.pipeline.start_pipeline_execution` Executes [start_pipeline_execution](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/codepipeline.html#CodePipeline.Client.start_pipeline_execution) action. 
### Pipeline Examples

**Creates a new pipeline.**

```yaml
  codepipeline:
    type: cloudify.nodes.aws.codepipeline.Pipeline
    properties:
      client_config: *client_config
      resource_config:
        kwargs:
          pipeline:
            name: { get_input: pipeline_name }
            roleArn: { get_input: code_pipeline_service_role }
            artifactStore:
              type: 'S3'
              location: { get_input: artifact_store_bucket_name }
            stages:
              - name: 'Source-stage'
                actions:
                  - name: 'source-action'
                    actionTypeId:
                      category: 'Source'
                      owner: 'AWS'
                      provider: 'S3'
                      version: '1'
                    outputArtifacts:
                      - name: 'My-source'
                    configuration:
                      S3Bucket: { get_input: source_code_bucket }
                      S3ObjectKey: test-app.zip
                      PollForSourceChanges: 'false'
                    region: { get_input: aws_region_name }
              - name: 'Deploy-stage'
                actions:
                  - name: 'deploy-action'
                    actionTypeId:
                      category: 'Deploy'
                      owner: 'AWS'
                      provider: 'S3'
                      version: '1'
                    inputArtifacts:
                      - name: 'My-source'
                    configuration:
                      "BucketName": { get_input: deployment_bucket_name }
                      "Extract": "true"
                    region: { get_input: aws_region_name }
            version: 1

```
**Invoke start_pipeline_execution operation:**

```
cfy exec start -d pipelinedep execute_operation -p '{"node_instance_ids": ["codepipeline_uasi97"], "operation": "aws.codepipeline.pipeline.start_pipeline_execution", "operation_kwargs": {"name": "Demopipeline"}}'
```

## **cloudify.nodes.resources.AmazonWebServices**

This resources does not represent any particular resource, but can be used to represent an AWS Account. This account can be used to discover AWS resource types.


**Properties**

  * `resource_config`:
    * `resource_types`: A list of resources to discover. For example, ['AWS::EKS::CLUSTER'].
  * `regions`: A list of regions to discover resources in, for example, ['us-east-1', 'us-east-2'].

**Workflows**

  * `discover_and_deploy`: Discover resources and deploy blueprints to interact with them from Cloudify.
    * **parameters**
      * `node_id`: The name of the deployment's cloudify.nodes.resources.AmazonWebServices node template that you wish to use to discover. Defaults to the only node in the deployment.
      * `resource_types`: Defaults to those resource_types in the node template.
      * `blueprint_id`: The blueprint ID to use to deploy the resources. For example, `existing-eks-cluster`.

## **cloudify.nodes.aws.ec2.SpotFleetRequest**

This node type refers to an AWS spot fleet request.

**Resource Config**

For more information, and possible keyword arguments, see: [EC2:request_spot_fleet](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.request_spot_fleet)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Store `resource_config` in runtime properties.
  * `cloudify.interfaces.lifecycle.configure`: Executes [create_pipeline](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.request_spot_fleet) action.
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_pipeline](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Client.cancel_spot_fleet_requests) action.


#### Spot Fleet Example

```yaml


  fleet:
    type: cloudify.nodes.aws.ec2.SpotFleetRequest
    properties:
      client_config: *client_config
      resource_config:
        kwargs:
          SpotFleetRequestConfig:
            IamFleetRole: { get_attribute: [ cfy_fleet_role, aws_resource_arn ] }
            LaunchSpecifications:
              - IamInstanceProfile:
                  Arn: { get_attribute: [ cfy_fleet_profile, aws_resource_arn ] }
                ImageId: { get_attribute: [ ami, aws_resource_id ] }
                InstanceType: { get_input: instance_type }
                KeyName: { get_input: key_name }
                Placement:
                  AvailabilityZone: { get_input: availability_zone }
                SubnetId: { get_attribute: [ subnet, aws_resource_id ] }
                SecurityGroups:
                  - GroupId: { get_attribute: [ security_group, aws_resource_id ] }
            SpotPrice: '0.04'
            TargetCapacity: 4


```
