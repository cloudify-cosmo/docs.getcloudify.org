---
layout: bt_wiki
title: AWSSDK Plugin
category: Official Plugins
draft: false
weight: 100
---
The AWSSDK plugin enables you to use Cloudify to manage Cloud resources on AWS. The currently supported resource types are described below.

## AWS Authentication

Each node template, has a `client_config` property which stores your account credentials. Use an intrinsic function to assign these to the values of secrets]({{< relref "using_cloudify/manager/using-secrets.md" >}}) in your manager.

 {{< highlight  yaml  >}}
  my_vpc:
    type: cloudify.nodes.aws.ec2.Vpc
    properties:
      client_config:
        aws_access_key_id: { get_secret: aws_access_key_id }
        aws_secret_access_key: { get_secret: aws_secret_access_key }
        region_name: { get_secret: aws_region_name }
      resource_config:
        CidrBlock: '10.0.0.0/16'
 {{< /highlight >}}  

## Node Type Lifecycle Operations

The AWSSDK plugin maps Cloudify plugin node type lifecycle operations to AWSSDK API calls.

Most node types follow the following lifecycle:
    interfaces:
      cloudify.interfaces.lifecycle:
        start:

  * `cloudify.interfaces.lifecycle.create`: In principle, this operation does little more than store properties.
  * `cloudify.interfaces.lifecycle.configure`: This operation will usually call an AWS SDK `create` or `put` method. See type definition for more information.
  * `cloudify.interfaces.lifecycle.start`: This operation is not always used. In principle, if a resource needs "starting", this method calls the appropriate SDK method.
  * `cloudify.interfaces.lifecycle.stop`: This operation is not always used. In principle, if a resource needs "stopping", this method calls the appropriate SDK method.
  * `cloudify.interfaces.lifecycle.delete`: This operation will usually call an AWS SDK `delete` method. See type definition for more information.

## Common Properties

All AWSSDK Plugin nodes types these properties in common:

**Properties**

  * `client_config`: A dictionary that contains values to be passed to the connection client.
  * `use_external_resource`: Use a resource that is already in your account, or create a new one. Default is to create a new one, i.e. "false".
  * `resource_id`: If the `use_external_resource` property is set to "true", then the ID of the resource to use.
  * `resource_config`: A dictionary that contains the AWSSDK API method arguments that will be called during the `cloudify.interfaces.lifecycle.configure` operation.

# Node Types


### **cloudify.nodes.aws.iam.User**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [IAM:create_user](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_user).

### **cloudify.nodes.aws.s3.BucketTagging**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [S3:put_bucket_tagging](http://boto3.readthedocs.io/en/latest/reference/services/s3.html#S3.Client.put_bucket_tagging).

### **cloudify.nodes.aws.ec2.Interface**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_network_interface](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_network_interface).

### **cloudify.nodes.aws.ec2.Vpc**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_vpc](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_vpc).

### **cloudify.nodes.aws.efs.FileSystemTags**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EFS:create_tags](http://boto3.readthedocs.io/en/latest/reference/services/efs.html#EFS.Client.create_tags).

### **cloudify.nodes.aws.rds.OptionGroup**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [RDS:create_option_group](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.create_option_group).

### **cloudify.nodes.aws.cloudwatch.Alarm**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [CloudWatch:put_metric_alarm](http://boto3.readthedocs.io/en/latest/reference/services/cloudwatch.html#CloudWatch.Client.put_metric_alarm).

### **cloudify.nodes.aws.iam.InstanceProfile**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [IAM:create_instance_profile](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_instance_profile).

### **cloudify.nodes.aws.elb.Classic.HealthCheck**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ElasticLoadBalancing:configure_health_check](http://boto3.readthedocs.io/en/latest/reference/services/elb.html#ElasticLoadBalancing.Client.configure_health_check).

### **cloudify.nodes.aws.iam.Policy**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [IAM:create_policy](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_policy).

### **cloudify.nodes.aws.elb.LoadBalancer**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ElasticLoadBalancingv2:create_load_balancer](http://boto3.readthedocs.io/en/latest/reference/services/elbv2.html#ElasticLoadBalancingv2.Client.create_load_balancer).

### **cloudify.nodes.aws.rds.Parameter**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [RDS:modify_db_parameter_group](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.modify_db_parameter_group).

### **cloudify.nodes.aws.iam.Role**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [IAM:create_role](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_role).

### **cloudify.nodes.aws.autoscaling.Policy**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [AutoScaling:put_scaling_policy](http://boto3.readthedocs.io/en/latest/reference/services/autoscaling.html#AutoScaling.Client.put_scaling_policy).

### **cloudify.nodes.aws.ec2.VpcPeeringRejectRequest**
    Derived from node type: cloudify.nodes.aws.ec2.VpcPeeringRequest.
    AWS SDK method: [:]().

### **cloudify.nodes.aws.ec2.RouteTable**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_route_table](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_route_table).

### **cloudify.nodes.aws.ECS.Cluster**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ECS:create_cluster](http://boto3.readthedocs.io/en/latest/reference/services/ecs.html#ECS.Client.create_cluster).

### **cloudify.nodes.aws.autoscaling.Group**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [AutoScaling:create_auto_scaling_group](http://boto3.readthedocs.io/en/latest/reference/services/autoscaling.html#AutoScaling.Client.create_auto_scaling_group).

### **cloudify.nodes.aws.iam.RolePolicy**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [IAM:put_role_policy](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.put_role_policy).

### **cloudify.nodes.aws.rds.Instance**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [RDS:create_db_instance](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.create_db_instance).

### **cloudify.nodes.aws.iam.LoginProfile**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [IAM:create_login_profile](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_login_profile).

### **cloudify.nodes.aws.ec2.ElasticIP**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:allocate_address](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.allocate_address).

### **cloudify.nodes.aws.ec2.Subnet**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_subnet](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_subnet).

### **cloudify.nodes.aws.cloudwatch.Event**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [CloudWatchEvents:put_events](http://boto3.readthedocs.io/en/latest/reference/services/events.html#CloudWatchEvents.Client.put_events).

### **cloudify.nodes.aws.ec2.EBSVolume**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_volume](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_volume).

### **cloudify.nodes.aws.dynamodb.Table**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [DynamoDB:create_table](http://boto3.readthedocs.io/en/latest/reference/services/dynamodb.html#DynamoDB.Client.create_table).

### **cloudify.nodes.aws.s3.BucketLifecycleConfiguration**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [S3:put_bucket_lifecycle](http://boto3.readthedocs.io/en/latest/reference/services/s3.html#S3.Client.put_bucket_lifecycle).

### **cloudify.nodes.aws.efs.FileSystem**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EFS:create_file_system](http://boto3.readthedocs.io/en/latest/reference/services/efs.html#EFS.Client.create_file_system).

### **cloudify.nodes.aws.s3.BucketPolicy**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [S3:put_bucket_policy](http://boto3.readthedocs.io/en/latest/reference/services/s3.html#S3.Client.put_bucket_policy).

### **cloudify.nodes.aws.ec2.VPNConnectionRoute**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_vpn_connection_route](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_vpn_connection_route).

### **cloudify.nodes.aws.SQS.Queue**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [SQS:create_queue](http://boto3.readthedocs.io/en/latest/reference/services/sqs.html#SQS.Client.create_queue).

### **cloudify.nodes.aws.SNS.Subscription**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [SNS:get_subscription_attributes](http://boto3.readthedocs.io/en/latest/reference/services/sns.html#SNS.Client.get_subscription_attributes).

### **cloudify.nodes.aws.ec2.VPNGateway**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_vpn_gateway](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_vpn_gateway).

### **cloudify.nodes.aws.ec2.VPNConnection**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_vpn_connection](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_vpn_connection).

### **cloudify.nodes.aws.ec2.Instances**
    Derived from node type: cloudify.nodes.Compute.
    AWS SDK method: [EC2:run_instances](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.run_instances).

### **cloudify.nodes.aws.ec2.VpcPeeringRequest**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:reject_vpc_peering_connection](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.accept_vpc_peering_connection, http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.reject_vpc_peering_connection
).

### **cloudify.nodes.aws.lambda.Function**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [Lambda:create_function](http://boto3.readthedocs.io/en/latest/reference/services/lambda.html#Lambda.Client.create_function).

### **cloudify.nodes.aws.elb.Classic.Policy.Stickiness**
    Derived from node type: cloudify.nodes.aws.elb.Classic.Policy.
    AWS SDK method: [:]().

### **cloudify.nodes.aws.lambda.Invoke**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [Lambda:invoke](http://boto3.readthedocs.io/en/latest/reference/services/lambda.html#Lambda.Client.invoke).

### **cloudify.nodes.aws.rds.InstanceReadReplica**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [RDS:create_db_instance_read_replica](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.create_db_instance_read_replica).

### **cloudify.nodes.aws.ec2.NetworkACL**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_network_acl](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_network_acl).

### **cloudify.nodes.aws.ec2.SecurityGroupRuleEgress**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:authorize_security_group_egress](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.authorize_security_group_egress)

### **cloudify.nodes.aws.ec2.Route**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_route](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_route).

### **cloudify.nodes.aws.elb.Listener**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ElasticLoadBalancingv2:create_listener](http://boto3.readthedocs.io/en/latest/reference/services/elbv2.html#ElasticLoadBalancingv2.Client.create_listener).

### **cloudify.nodes.aws.rds.Option**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [RDS:modify_option_group](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.modify_option_group).

### **cloudify.nodes.aws.ec2.Image**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_image](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_image).

### **cloudify.nodes.aws.elb.Classic.LoadBalancer**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ElasticLoadBalancing:create_load_balancer](http://boto3.readthedocs.io/en/latest/reference/services/elb.html#ElasticLoadBalancing.Client.create_load_balancer).

### **cloudify.nodes.aws.ec2.EBSAttachment**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:attach_volume](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.attach_volume).

### **cloudify.nodes.aws.route53.HostedZone**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [Route53:create_hosted_zone](http://boto3.readthedocs.io/en/latest/reference/services/route53.html#Route53.Client.create_hosted_zone).

### **cloudify.nodes.aws.ec2.NetworkAclEntry**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_network_acl_entry](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_network_acl_entry).

### **cloudify.nodes.aws.lambda.Permission**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [Lambda:add_permission](http://boto3.readthedocs.io/en/latest/reference/services/lambda.html#Lambda.Client.add_permission).

### **cloudify.nodes.aws.cloudwatch.Rule**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [CloudWatchEvents:put_rule](http://boto3.readthedocs.io/en/latest/reference/services/events.html#CloudWatchEvents.Client.put_rule).

### **cloudify.nodes.aws.rds.ParameterGroup**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [RDS:create_db_parameter_group](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.create_db_parameter_group).

### **cloudify.nodes.aws.SNS.Topic**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [SNS:create_topic](http://boto3.readthedocs.io/en/latest/reference/services/sns.html#SNS.Client.create_topic).

### **cloudify.nodes.aws.CloudFormation.Stack**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [CloudFormation:create_stack](http://boto3.readthedocs.io/en/latest/reference/services/cloudformation.html#CloudFormation.Client.create_stack).

### **cloudify.nodes.aws.ec2.VpcPeering**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_vpc_peering_connection](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_vpc_peering_connection).

### **cloudify.nodes.aws.iam.Group**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [IAM:create_group](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_group).

### **cloudify.nodes.aws.ec2.CustomerGateway**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_customer_gateway](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_customer_gateway).

### **cloudify.nodes.aws.ec2.SecurityGroup**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_security_group](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_security_group).

### **cloudify.nodes.aws.s3.Bucket**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [S3:create_bucket](http://boto3.readthedocs.io/en/latest/reference/services/s3.html#S3.Client.create_bucket).

### **cloudify.nodes.aws.ECS.Service**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ECS:create_service](http://boto3.readthedocs.io/en/latest/reference/services/ecs.html#ECS.Client.create_service).

### **cloudify.nodes.aws.elb.Classic.Listener**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ElasticLoadBalancing:create_load_balancer_listeners](http://boto3.readthedocs.io/en/latest/reference/services/elb.html#ElasticLoadBalancing.Client.create_load_balancer_listeners).

### **cloudify.nodes.aws.kms.Grant**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [KMS:create_grant](http://boto3.readthedocs.io/en/latest/reference/services/kms.html#KMS.Client.create_grant).

### **cloudify.nodes.aws.autoscaling.LifecycleHook**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [AutoScaling:put_lifecycle_hook](http://boto3.readthedocs.io/en/latest/reference/services/autoscaling.html#AutoScaling.Client.put_lifecycle_hook).

### **cloudify.nodes.aws.route53.RecordSet**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [Route53:change_resource_record_sets](http://boto3.readthedocs.io/en/latest/reference/services/route53.html#Route53.Client.change_resource_record_sets).

### **cloudify.nodes.aws.autoscaling.LaunchConfiguration**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [AutoScaling:create_launch_configuration](http://boto3.readthedocs.io/en/latest/reference/services/autoscaling.html#AutoScaling.Client.create_launch_configuration).

### **cloudify.nodes.aws.elb.Rule**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ElasticLoadBalancingv2:create_rule](http://boto3.readthedocs.io/en/latest/reference/services/elbv2.html#ElasticLoadBalancingv2.Client.create_rule).

### **cloudify.nodes.aws.ec2.Keypair**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_key_pair](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_key_pair).

### **cloudify.nodes.aws.iam.AccessKey**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [IAM:create_access_key](http://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_access_key).

### **cloudify.nodes.aws.cloudwatch.Target**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [CloudWatchEvents:put_targets](http://boto3.readthedocs.io/en/latest/reference/services/events.html#CloudWatchEvents.Client.put_targets).

### **cloudify.nodes.aws.efs.MountTarget**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EFS:create_mount_target](http://boto3.readthedocs.io/en/latest/reference/services/efs.html#EFS.Client.create_mount_target).

### **cloudify.nodes.aws.autoscaling.NotificationConfiguration**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [AutoScaling:put_notification_configuration](http://boto3.readthedocs.io/en/latest/reference/services/autoscaling.html#AutoScaling.Client.put_notification_configuration).

### **cloudify.nodes.aws.kms.CustomerMasterKey**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [KMS:create_key](http://boto3.readthedocs.io/en/latest/reference/services/kms.html#KMS.Client.create_key).

### **cloudify.nodes.aws.rds.SubnetGroup**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [RDS:create_db_subnet_group](http://boto3.readthedocs.io/en/latest/reference/services/rds.html#RDS.Client.create_db_subnet_group).

### **cloudify.nodes.aws.ec2.Tags**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_tags](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_tags).

### **cloudify.nodes.aws.ec2.DHCPOptions**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_dhcp_options](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_dhcp_options).

### **cloudify.nodes.aws.ec2.SecurityGroupRuleIngress**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:authorize_security_group_ingress](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.authorize_security_group_ingress)

### **cloudify.nodes.aws.ec2.InternetGateway**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_internet_gateway](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_internet_gateway).

### **cloudify.nodes.aws.elb.Classic.Policy**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ElasticLoadBalancing:create_load_balancer_policy](http://boto3.readthedocs.io/en/latest/reference/services/elb.html#ElasticLoadBalancing.Client.create_load_balancer_policy).

### **cloudify.nodes.aws.ec2.NATGateway**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [EC2:create_nat_gateway](http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.create_nat_gateway).

### **cloudify.nodes.aws.kms.Alias**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [KMS:create_alias](http://boto3.readthedocs.io/en/latest/reference/services/kms.html#KMS.Client.create_alias).

### **cloudify.nodes.aws.elb.TargetGroup**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ElasticLoadBalancingv2:create_target_group](http://boto3.readthedocs.io/en/latest/reference/services/elbv2.html#ElasticLoadBalancingv2.Client.create_target_group).

### **cloudify.nodes.aws.ECS.TaskDefinition**
    Derived from node type: cloudify.nodes.Root.
    AWS SDK method: [ECS:register_task_definition](http://boto3.readthedocs.io/en/latest/reference/services/ecs.html#ECS.Client.register_task_definition).
