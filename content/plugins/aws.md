---
layout: bt_wiki
title: AWS Plugin
category: Plugins
draft: false
weight: 100
---
{{% gsSummary %}} {{% /gsSummary %}}

The AWS plugin allows users to use Cloudify to manage cloud resources on AWS. See below for currently supported resource types.

Be aware that some services and resources vary in availability between regions and accounts.

For more information about the library, please refer [here](http://boto.readthedocs.org/en/latest/index.html).

# Plugin Requirements

* Python Versions 2.7.x.
* AWS account


# Compatibility

{{% gsWarning %}}
This version of Cloudify is only compatible with AWS Plugin version 1.3 or later

If you need to use an older AWS Plugin, you can work around this issue in two ways:

* connect to your manager machine and move the file ```/etc/cloudify/aws_plugin/boto``` to ```/root/boto```

or

* In the AWS manager, change this line ```aws_config_path: /etc/cloudify/aws_plugin/boto``` to ```aws_config_path: /root/boto```

{{% /gsWarning %}}

The AWS plugin uses the [Boto 2.38 client](https://github.com/boto/boto).

{{% gsNote title="Note" %}}
This version of Boto EC2 Connection supports (AWS) APIVersion = '2014-10-01'.
{{% /gsNote %}}


# Terminology

* Region refers to a general geographical area, such as "Central Europe" or "East US".
* `availability_zone` refers to one of many isolated locations within a region, such as `us-west-1b`.  When specifying an `availability_zone`, you must specify one that is in the region you are connecting to.


# Types

The following are [node type]({{< relref "blueprints/spec-node-types.md" >}}) definitions. Nodes describe resources in your cloud infrastructure. For more information, see [node type]({{< relref "blueprints/spec-node-types.md" >}}).

### Common Properties

All cloud resource nodes have common properties:

**Properties**

  * `use_external_resource` a boolean for setting whether to create the resource or use an existing one. See the [using existing resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The ID of an existing resource when the `use_external_resource` property is set to `true` (see the [using existing resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `aws_config` a dictionary that contains values you would like to pass to the connection client. For information on values that are accepted, please see [boto documentation](http://boto.readthedocs.org/en/latest/ref/ec2.html#boto.ec2.connection.EC2Connection)

Every time you manage a resource with Cloudify, we create one or more clients with AWS API. You specify the configuration for these clients using the `aws_config` property. It should be a dictionary, with the following values:

**Your AWS API access credentials** [Read more](http://docs.aws.amazon.com/AWSSecurityCredentials/1.0/AboutAWSCredentials.html#).

  * `aws_access_key_id` (required)
  * `aws_secret_access_key` (required)

**Region information**:

  * `ec2_region_name` (required, except with the `cloudify.aws.nodes.ElasticLoadBalancer` node type.) This is the EC2 region name, such as 'us-east-1'. You may also use the word 'region' to refer to the same thing.
  * `ec2_region_endpoint`, the endpoint of the EC2 service, such as ec2.us-east-1.amazonaws.com.

See the `cloudify.datatypes.aws.Config` data type definition in the plugin's plugin.yaml. Note that `availability_zone` and `region` are not synonymous, and that `availability_zone` is not part of the AWS configuration.


## cloudify.aws.nodes.Instance

**Derived From:** [cloudify.nodes.Compute]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `parameters` key-value server configuration as described in [AWS EC2 Classic](http://boto.readthedocs.org/en/latest/ref/ec2.html#module-boto.ec2.instance).
    * The public key which is set for the server needs to match the private key name in your AWS account. The public key may be set in a number of ways:
      * By connecting the instance node to a keypair node using the `cloudify.aws.relationships.instance_connected_to_keypair` relationship.
      * By setting it explicitly in the `key_name` key under the `parameters` property.
      * If the agent's keypair information is set in the provider context, the agents' keypair will serve as the default public key to be used if it was not specified otherwise.
    * If the server is to have an agent installed on it, it should use the agents security group. If you are using a manager bootstrapped with the standard aws-manager-blueprint, there is a provider context dictionary on the manager that provides this value to the plugin. You can also use other security groups by:
      * `security_groups`: list of security group names.
      * `security_group_ids`: a list of security group IDs.
    * If you want to specify the `availability_zone` for your instance, you must use the `placement` key.
  * `image_id` The AMI image id for the instance. For more information, please refer [here](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/finding-an-ami.html).
  * `instance_type` The instance type for the instance. For more information, please refer [here](http://aws.amazon.com/ec2/instance-types/).

**Example**

This example includes shows adding additional parameters, tagging an instance name, and explicitly defining the aws_config.

{{< gsHighlight  yaml  >}}

  my_ec2_instance:
    type: cloudify.aws.nodes.Instance
    properties:
      image_id: ami-abcd1234
      instance_type: t1.micro
      name: my_ec2_instance
      aws_config:
        aws_access_key_id: ...
        aws_secret_access_key: ...
        ec2_region_name: us-east-1
...

{{< /gsHighlight >}}

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` creates the instance.
  * `cloudify.interfaces.lifecycle.start` starts the instance, if it's not already started.
  * `cloudify.interfaces.lifecycle.stop` stops the instance, if it's not already stopped.
  * `cloudify.interfaces.lifecycle.delete` deletes the instance and waits for termination.
  * `cloudify.interfaces.validation.creation` see [common validations section](#Validations). Additionally, the plugin checks to see if the image_id is available to your account.

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).

The create function also sets `reservation_id` attribute. For information, see [here](http://boto.readthedocs.org/en/latest/ref/ec2.html#boto.ec2.instance.Reservation)

Four additional `runtime_properties` are available on node instances of this type once the `cloudify.interfaces.lifecycle.start` operation succeeds:

  * `ip` the instance's private IP.
  * `private_dns_name` the instance's private FQDN in Amazon.
  * `public_dns_name` the instances's public FQDN in Amazon.
  * `public_ip_address` the instance's public IP address.

**Additional**
If you want to use the instance in VPC, then you need to connect this to a Subnet using the `cloudify.aws.relationships.instance_contained_in_subnet` relationship.


## cloudify.aws.nodes.KeyPair

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_id` Special behavior: when using a new (not external) security group or key pair, this will become the resource name. See [using existing resources section](#using-existing-resources).
  * `private_key_path` *Required*. The path (on the machine the plugin is running on) where the private key should be stored. If `use_external_resource` is set to `true`, the existing private key is expected to be at this path.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` creates the keypair.
  * `cloudify.interfaces.lifecycle.delete` deletes the keypair.
  * `cloudify.interfaces.validation.creation` see [common validations section](#Validations). Additional validations which take place:
    * validation for the private key path supplied not to exist if it's a new keypair resource.
    * validation for the private key path supplied to exist and have the correct permissions and/or owner if it's an existing keypair resource.

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).


## cloudify.aws.nodes.SecurityGroup

**Derived From:** [cloudify.nodes.SecurityGroup]({{< relref "blueprints/built-in-types.md" >}})

**Properties:**

  * `resource_id` if this is a new resource (`use_external_resource` is false), then this will be the name property of the new security group.
  * `description` a description of the security group.
  * `rules` key-value security group rule configuration as described [here](http://boto.readthedocs.org/en/latest/ref/ec2.html#boto.ec2.securitygroup.SecurityGroup.authorize). Defaults to `[]`.
      * `ip_protocol`
      * `from_port`
      * `to_port`
      * `cidr_ip` OR `src_group_id`.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` creates the security group, along with its defined rules.
  * `cloudify.interfaces.lifecycle.delete` deletes the security group.
  * `cloudify.interfaces.validation.creation` see [common validations section](#Validations).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).

**Additional**

Note that if you want to create a security group in a VPC, you need to connect it to a VPC using the `cloudify.aws.relationships.security_group_contained_in_vpc` relationship.


## cloudify.aws.nodes.ElasticIP

**Derived From:** [cloudify.nodes.Root]({{< relref "blueprints/built-in-types.md" >}})

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` creates the elastic IP
  * `cloudify.interfaces.lifecycle.delete` deletes the elastic IP
  * `cloudify.interfaces.validation.creation` see [common validations section](#Validations).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).

Note that the actual IP is available via the `aws_resource_id` runtime-property.


# Relationships

See [relationships]({{< relref "blueprints/spec-relationships.md" >}}).

The following plugin relationship operations are defined in the AWS plugin:

 * `cloudify.aws.relationships.instance_connected_to_elastic_ip` This connects an Instance to an Elastic IP. The source is the instance and the target is the Elastic IP.

* `cloudify.aws.relationships.instance_connected_to_keypair` The `run_instances` operation looks to see if there are any relationships that define a relationship between the instance and a keypair. If so, that keypair will be the keypair for that instance. It inserts the key's name property in the 'key_name' parameter in the `run_instances` function.

* `cloudify.aws.relationships.instance_connected_to_security_group` The `run_instances` operation looks to see if there are any relationships that define a relationship between the instance and a security group. If so, that security group's ID will be the included in the list of security groups in the 'security_group_ids' parameter in the `run_instances` function.


# Types Common Behaviors


## Validations

All types offer the same base functionality for the `cloudify.interfaces.validation.creation` interface operation:

  * If it's a new resource (`use_external_resource` is set to `false`), the basic validation is to verify that the resource doesn't actually exist.

  * When [using an existing resource](#using-existing-resources), the validation ensures that the resource does exist.



## Runtime Properties

See section on [runtime properties](http://cloudify-plugins-common.readthedocs.org/en/3.3/context.html?highlight=runtime#cloudify.context.NodeInstanceContext.runtime_properties)

Node instances of any of the types defined in this plugin get set with the following runtime properties during the `cloudify.interfaces.lifecycle.create` operation:

  * `aws_resource_id` the AWS ID of the resource



## Default Resource Naming Convention

If `use_external_resource` is set to true in the blueprint, the `resource_id` must be that resource's ID in AWS, unless the resource type is a keypair, in which case the value is the key's name.



# Using Existing Resources

It is possible to use existing resources on AWS - whether these have been created by a different Cloudify deployment or not via Cloudify at all.

All Cloudify AWS types have a property named `use_external_resource`, whose default value is `false`. When set to `true`, the plugin will apply different semantics for each of the operations executed on the relevant node's instances:

This behavior is common to all resource types:

 * `create` If `use_external_resource` is true, the AWS plugin will check if the resource is available in your account. If no such resource is available, the operation will fail, if it is available, it will assign the `aws_resource_id` to the instance `runtime_properties`.
 * `delete` If `use_external_resource` is true, the AWS plugin will check if the resource is available in your account. If no such resource is available, the operation will fail, if it is available, it will unassign the instance `runtime_properties`.

The following behaviors are unique:

 * `aws.ec2.instance.start` If `use_external_resource` is true, the `runtime_properties` for `public_ip_address`, etc, are set, and the function exits.
 * `aws.ec2.instance.stop` If `use_external_resource` is true, the `runtime_properties` for `public_ip_address`, etc, are unset, and the function exits.
 * `cloudify.aws.relationships.instance_connected_to_elastic_ip` Here, both the instance's and the `elasticip`'s `use_external_resource` value are relevant. If both are external the function sets the relationship properties. If either are not external the function fails.
 * `cloudify.aws.relationships.instance_connected_to_security_group` Here, both the instance's and the security groups's `use_external_resource` value are relevant. If both are external the function sets the relationship properties. If either are not external the function fails.


# Account Information

The plugin needs access to your `aws_access_key_id` and `aws_secret_access_key` in order to operate. Please read about your AWS Boto configuration [here](http://boto.readthedocs.org/en/latest/boto_config_tut.html).


# Tips

* It is highly recommended to ensure that AWS names are unique. Many operations will fail if you have existing resources with identical names..
* When packaging blueprints for use with a manager the manager will add the following configurations (you can still override them in your blueprint):
  * `aws_config`
  * `agent_keypair`
  * `agent_security_group`
