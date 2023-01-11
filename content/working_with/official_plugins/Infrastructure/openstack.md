---
title: OpenStack Plugin
category: Official Plugins
description: The OpenStack plugin enables you to use an OpenStack-based cloud infrastructure for deploying services and applications
draft: false
abstract:
weight: 170
aliases:
  - /plugins/openstack/
  - /developer/official_plugins/openstack/
---

__Note: This documentation refers to {{< param product_name >}} Openstack Plugin v2.X, the old version of the Openstack Plugin. For documentation on the new version, see [Openstack Plugin v3]({{< relref "working_with/official_plugins/Infrastructure/openstackv3.md" >}}).__

The OpenStack plugin enables you to use an OpenStack-based cloud infrastructure for deploying services and applications.
For more information about OpenStack, see [https://www.openstack.org/](https://www.openstack.org/).


# Plugin Requirements

* Python versions:
  * 2.7.x
* If the plugin is installed from source, the following system dependencies are required:
  * `gcc`
  * `gcc-c++`
  * `python-devel`

# Compatibility
{{< param product_name >}} OpenStack v2 plugin uses the OpenStack API and is compatible with the following OpenStack releases:

* **Train**
* **Stein**
* **Rocky**
* **Queens**
* **Pike**
* **Ocata**
* **Newton**
* **Mitaka**
* **Liberty**
* **Kilo**
* **Juno**, **Icehouse** previously supported, not currently tested.


The OpenStack plugin uses various OpenStack client packages. The versions used in the OpenStack plugin are as follows:

  * [Nova client](https://github.com/openstack/python-novaclient) - 2.26.0
  * [Neutron client](https://github.com/openstack/python-neutronclient) - 2.6.0
  * [Cinder client](https://github.com/openstack/python-cinderclient) - 1.2.2
  * [Keystone client](https://github.com/openstack/python-keystoneclient) - 1.6.0

# OpenStack Configuration

The OpenStack plugin requires credentials and endpoint setup information in order to authenticate and interact with OpenStack.

## Providing Credentials as Secrets

 It is recommended that you store your credentials as [secrets]({{< relref "working_with/manager/using-secrets.md" >}}). You can do this using the [CLI]({{< relref "cli/orch_cli/secrets.md" >}}).
 Secrets can then be accessed inside your blueprints, as follows:

 {{< highlight  yaml  >}}
 external_network:
    type: cloudify.openstack.nodes.Network
    properties:
      openstack_config:
        username: { get_secret: keystone_username }
        password: { get_secret: keystone_password }
        tenant_name: { get_secret: keystone_tenant_name }
        auth_url: { get_secret: keystone_url }
        region: { get_secret: region }
 {{< /highlight >}}   

## Providing Credentials as Environment Variables that are not Stored as Secrets

The OpenStack client suite (Nova, Neutron and so on) will always look for your OpenStack credentials and endpoint setup information in the following order. These values take precedence because this is the default behavior of the client library. It is not recommended that these are included.

  1. Environment variables for each of the configuration parameters.
  2. JSON file at `/etc/cloudify/openstack_config.json` or at a path specified by the value of an environment variable named `OPENSTACK_CONFIG_PATH`

On the other hand, the plugin gathers credentials from the following sources, in the following order. This is the supported approach.
{{% warning title="Caution" %}}
Each source could partially or completely override values gathered from previous ones.
{{% /warning %}}

  1. Values specified in the `openstack_config` property for the node whose operation is currently getting executed (in the case of relationship operations, the `openstack_config` property of either the *source* or *target* nodes will be used if available, with the *source*'s one taking precedence).
  2. Values specified in the `openstack_config` runtime property for the node instance whose operation is currently being executed (in the case of relationship operations, the `openstack_config` property of either the *source* or *target* node instances will be used if available, with the *source*'s one taking precedence).
  3. Values specified in the `openstack_config` operation input.

## Configuration Structure

The `openstack_config` property can contain the following key-value pairs.

* `username`: Username for authentication with the OpenStack Keystone service.
* `password`: Password for authentication with the OpenStack Keystone service.
* `tenant_name`: Name of the tenant to be used.
* `auth_url`: URL of the OpenStack Keystone service.
* `region`: OpenStack region to be used. This can be optional when there is only a single region.
* `insecure`, `ca_cert`: Control how SSL certificate validation is performed (see below).  
* `nova_url`: (**Deprecated** - instead, use `custom_configuration` to pass `bypass_url` directly to the Nova client.) Explicit URL for the OpenStack Nova service. This can be used to override the URL for the Nova service that is listed in the Keystone service.
* `neutron_url`: (**Deprecated** - instead, use `custom_configuration` to pass `endpoint_url` directly to the Neutron client). Explicit URL for the OpenStack Neutron service. This may be used to override the URL for the Neutron service that is listed in the Keystone service.
* `custom_configuration`: A dictionary that enables a custom configuration parameter to be overridden or directly passed to each of the OpenStack clients, by using any of the relevant keys: `keystone_client`, `nova_client`, `neutron_client` or `cinder_client`.
  * Parameters passed directly to OpenStack clients using the `custom_configuration` mechanism override other definitions . For example, any of the common OpenStack configuration parameters listed above, such as `username` and `tenant_name`.
  * Following is an example for the usage of the `custom_configuration` section in a blueprint:
{{< highlight  yaml  >}}
custom_configuration:
  nova_client:
    bypass_url: nova-endpoint-url
    nova_specific_key_1: value_1
    nova_specific_key_2: value_2
  neutron_client:
    endpoint_url: neutron-endpoint-url
  keystone_client:
    ..
  cinder_client:
    ..
{{< /highlight >}}
* `logging`: controls OpenStack libraries' logging (see below).

### SSL Certificate Validation

When connecting to OpenStack's endpoint over SSL (which is the typical case), the OpenStack client libraries, by default,
perform validation on the certificate presented by OpenStack. The validation is performed against the CA certificates'
bundle used by Python's `requests` library. That bundle is provided by the `certifi` Python library.

SSL validation is being performed (or skipped) as follows:

* If `insecure` is provided:
  * If the value is `true`: certificate validation is skipped altogether (**not recommended** for production environments)
  * Otherwise, certificate validation is performed as per the default behaviour described above.
* Otherwise, if `ca_cert` is provided, then OpenStack's certificate is validated against the CA certificate file denoted by this parameter.
* Otherwise, perform validation as per the default behaviour.

### Logging for OpenStack Libraries

The OpenStack libraries used by the OpenStack plugin perform their own logging using the standard Python `logging`
library.

It is possible to control the visibility of OpenStack API's logging on {{< param product_name >}}'s logger by using the `logging` configuration directive.

The structure of the `logging` directive is as follows:

```yaml
logging:
  use_cfy_logger: <boolean> (defaults to true)
  groups:
    nova: <level>
    neutron: <level>
    cinder: <level>
    keystone: <level>
    glance: <level>
  loggers:
    <logger-name>: <level>
    <logger-name>: <level>
    <logger-name>: <level>
    ...
```

The default `logging` directive's value is:

```yaml
logging:
  use_cfy_logger: true
  groups:
    nova: debug
    neutron: debug
    cinder: debug
    keystone: debug
    glance: debug
  loggers:
    keystoneauth.session: debug
```

If you specify a `logging` directive, its contents will be merged with the default.

If `use_cfy_logger` is `true`, then a logging handler is added to all applicable OpenStack API loggers (described below)
so log records are emitted to the {{< param product_name >}} logger *in addition* to any other handlers that may be configured.

The `groups` section is used to easily set the logging level for groups of loggers, per API. Each such group
(`nova`, `neutron`) is associated with the list of loggers that belong to the `Client` class(es) of that particular
service.

For example, setting `nova` to `info` will result in the following loggers being set to `info` level:

* `novaclient.client`
* `novaclient.v2.client`

In addition, you can set the logging level of individual loggers under the `loggers` section.

# Types

## cloudify.openstack.nodes.Server

 {{< highlight  yaml  >}}
  my-openstack-vm:
    type: cloudify.openstack.nodes.Server
    properties:
      server:
        key_name: my-openstack-key-name
        image: e26cf47c-15a2-46fb-8adf-07b8b977b32e
        flavor: 4
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Compute

**Properties:**

  * `server` Key-value server configuration as described in the [OpenStack compute create server API](http://developer.openstack.org/api-ref-compute-v2.html#compute_servers).
  * `image` The image for the server. Can receive either the ID or the name of the image. <br>*Note*: This property is currently optional for backwards-compatibility, but will be modified to become a required property in future versions (Default: `''`).
  * `flavor` The flavor for the server. Can receive either the ID or the name of the flavor. <br>*Note*: This property is currently optional for backwards-compatibility, but will be modified to become a required property in future versions (Default: `''`).
  * `management_network_name` **Deprecated** {{< param product_name >}} management network name. If the management network's name information is available in the Provider Context, the connection is made automatically and there is no need to override the property. (See the [Misc section](#misc) for more information about the OpenStack Provider Context). <br>*Note*: When using Nova-net OpenStack (see the [Nova-net Support section](#nova-net-support)), do not specify this property. Defaults to `''` (empty string).
  * `use_password` A boolean describing whether this server image supports user-password authentication. Images that do support user-password authentications should post the administrator user's password to the OpenStack metadata service (for example, via [cloudbase](http://www.cloudbase.it/cloud-init-for-windows-instances/)). The password would then be retrieved by the plugin, decrypted using the server's keypair, then saved in the server's runtime properties.  Defaults to `false`.
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the server.
    * **Inputs:**
      * `args` Key-value server configuration as described in the [OpenStack compute create server API](http://developer.openstack.org/api-ref-compute-v2.html#compute_servers).
        * **Notes:**
          * Avoid using the `nics` key. To connect the server to networks, connect the server node should be connected to network nodes and/or port nodes via relationships. These will be translated into the appropriate `nics` definitions automatically.
          * The public key that is set for the server must match the private key file that has its path set for the `cloudify_agent`'s `key` property (see cloudify.nodes.Compute's properties). The public key can be set in a number of ways:
            * By connecting the server node to a keypair node using the `cloudify.openstack.server_connected_to_keypair` relationship.
            * By setting the public key explicitly in the `key_name` key under the `server` property. See [Misc section](#misc)).
            * If the agent's keypair information is set in the provider context, the agents' keypair serves as the default public key to be used, if it was not specified otherwise. See the [Misc section](#misc) for more information about the OpenStack Provider Context.
          * If the server is to have an agent installed on it, it must use the agents security group. If the agents security group information is not set in the provider context, the group should be set using the `security_groups` key. See the [Misc section](#misc) for more information on the OpenStack provider context.
        * **Sugaring:**
          * `image_name` (**Deprecated** - Use the `image` *property* instead.) will automatically resolve the OpenStack name of an image into its matching image ID.
          * `flavor_name` (**Deprecated** - Use the `flavor` *property* instead.) will automatically resolve the OpenStack name of a flavor into its matching flavor ID.
          * the `userdata` key can receive either a string (passed as-is to Nova in the create server request), or a dictionary containing:
            * A field `type` with the value `http`
            * A field `url` with a value that is a URL to a `userdata` script/value.
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.start` Starts the server if it is not already started.
    * **Inputs:**
      * `start_retry_interval` Polling interval until the server becomes active, in seconds. (Default: `30`)
      * `private_key_path` Path to the private key that matches the server's public key. Used to decrypt the password if the `use_password` property is set to `true`. If not set, the plugin attempts to find a keypair node connected to the server and uses that. (Default: `''`).
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.stop` Stops the server if it is not already stopped.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the server and waits for termination.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See the [common validations section](#Validations). In addition, the image and flavor supplied are checked for existence.
    * **Inputs:**
      * `args` Key-value server configuration, as described in the [OpenStack compute create server API](http://docs.openstack.org/api/openstack-compute/2/content/POST_createServer__v2__tenant_id__servers_CreateServers.html). The same as the arguments' input in create operation.
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [Common Runtime Properties section](#runtime-properties).

Two additional runtime properties are available on node instances of this type after the `cloudify.interfaces.lifecycle.start` operation succeeds.

  * `networks` The server's networks' information, as retrieved from the Nova service.
  * `ip` The private IP (IP on the internal network) of the server.
  * `password` The administrator user password. This runtime property is only available if the `use_password` property is set to `true`.



## cloudify.openstack.nodes.WindowsServer

**Derived From:** [cloudify.openstack.nodes.Server](#cloudifyopenstackserver)

This type has the same properties and operations mapping as the type above it (because it derives from it). However, it overrides some of the agent and plugin installations operations mapping that is derived from the built-in cloudify.nodes.Compute type. Use this type when working with a Windows server.

In addition, the default value for the `use_password` property is overridden for this type, and is set to `true`. If you are using an image with a preset password, change the value to `false`.



## cloudify.openstack.nodes.KeyPair

 {{< highlight  yaml  >}}
  my-openstack-keypair:
    type: cloudify.openstack.nodes.KeyPair
    properties:
      keypair:
        name: my-openstack-key-name
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Root

**Properties:**

  * `private_key_path` *Required*. The path, on the machine on which the plugin is running, where the private key is to be stored. If `use_external_resource` is set to `true`, the existing private key is expected to be at this path.
  * `keypair` The key-value keypair configuration, as described in the [OpenStack network create keypair API](http://developer.openstack.org/api-ref-compute-v2-ext.html#ext-os-keypairs).
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the keypair.
    * **Inputs:**
      * `args` The key-value keypair configuration as described in the [OpenStack network create keypair API](http://developer.openstack.org/api-ref-compute-v2-ext.html#ext-os-keypairs). Defaults to `{}`.
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the keypair.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See the [Common Validations section](#Validations). Additional validations that take place:
    * Validation that the provided private key path does not exist for a new keypair resource.
    * Validation that the provided private key path does exist and includes the correct permissions and/or owner for an existing key pair resource.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).



## cloudify.openstack.nodes.Subnet

 {{< highlight  yaml  >}}
  my-openstack-subnet:
    type: cloudify.openstack.nodes.Subnet
    properties:
      subnet:
        ip_version: 4
        cidr: '192.168.121.0/24'
        enable_dhcp: False
        dns_nameservers: ['8.8.4.4', '8.8.8.8']
        allocation_pools:
        - start: 192.168.121.50
          end: 192.168.121.250
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Subnet

**Properties:**

  * `subnet` The key-value subnet configuration, as described in the [OpenStack network create subnet API](http://developer.openstack.org/api-ref-networking-v2.html#subnets).
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (Se the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the subnet.
    * **Inputs:**
      * `args` The key-value subnet configuration, as described in the [OpenStack network create subnet API](http://developer.openstack.org/api-ref-networking-v2.html#subnets).
        * **Notes:**
          * Do not use the `network_id`. Instead, connect the subnet node to a single network node via a relationship. The subnet node is then placed on that network automatically.
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the subnet.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See the [common Validations section](#Validations). In addition, the correct value of the `cidr` property is verified.
    * **Inputs:**
      * `args` The key-value subnet configuration, as described in the [OpenStack network create subnet API](http://docs.openstack.org/api/openstack-network/2.0/content/create_subnet.html). The same as the arguments input in the create operation.
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).



## cloudify.openstack.nodes.SecurityGroup

 {{< highlight  yaml  >}}
  my-openstack-security-group:
    type: cloudify.openstack.nodes.SecurityGroup
    properties:
      security_group:
        name: my-openstack-security-group
        description: My Openstack Security Group
 {{< /highlight >}}

**Derived From:** cloudify.nodes.SecurityGroup

**Properties:**

  * `security_group` The key-value security_group configuration as described in the [OpenStack network create security group API](http://developer.openstack.org/api-ref-networking-v2-ext.html#createSecGroup).
  * `rules` The key-value `security_group_rule` configuration as described in the [OpenStack network create security group rule](http://developer.openstack.org/api-ref-networking-v2.html#security_groups). Defaults to `[]`.
    * Note: Each rule is parsed with default values that take effect unless overridden. The default values are:
      * `direction`: `ingress`
      * `ethertype`: `IPv4`
      * `port_range_min`: `1`
      * `port_range_max`: `65535`
      * `protocol`: `tcp`
      * `remote_group_id`: `None`
      * `remote_ip_prefix`: `0.0.0.0/0`
    * If `remote_group_id`, `remote_group_node` or `remote_group_name` are used, `remote_ip_prefix` is replaced with value `None`

  * `disable_default_egress_rules` A flag for removing the default rules that [allow all egress traffic](https://wiki.openstack.org/wiki/Neutron/SecurityGroups#Behavior). If not set to `true`, the rules remain alongside any additional rules passed using the `rules` property. Defaults to `false`.
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the security group, together with its defined rules.
    * **Inputs:**
      * `args` The key-value `security_group` configuration as described in the [OpenStack network create security group API](http://developer.openstack.org/api-ref-networking-v2-ext.html#createSecGroup). Defaults to `{}`.
        * **Sugaring:**
          * `port` The key can be used instead of the `port_range_max` and `port_range_min` keys to limit the rule to a single port.
          * `remote_group_node` Can be used instead of `remote_group_id` to specify a remote group, by supplying this key with a value that is the name of the remote security group node. The target node must be a node with which the current security-group node has a relationship (of any type). Note that, as with the `remote_group_id` key, this value should not be provided if `remote_ip_prefix` was set.
          * `remote_group_name` Automatically resolves the OpenStack name of a security group into a `remote_group_id`. Note that, as with the `remote_group_id` key, this value should not be provided if `remote_ip_prefix` was set.
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the security group.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See [common validations section](#Validations). In addition, the *CIDR* of rules that specify one is verified to be of the correct format.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).



## cloudify.openstack.nodes.Router

 {{< highlight  yaml  >}}
  my-openstack-router:
    type: cloudify.openstack.nodes.Router
    properties:
      router:
        name: my-openstack-router
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Router

**Properties:**

  * `router` A key-value router configuration as described in the [OpenStack network create router API](http://developer.openstack.org/api-ref-networking-v2.html#layer3).
  * `external_network` An external network name or ID. If specified, the router uses this external network as a gateway. Defaults to `''` (empty string).
  * `default_to_managers_external_network` A boolean that determines whether to use the {{< param cfy_manager_name >}}'s external network if no other external network was set (whether by a relationship, by the `external_network` property, or by the nested `external_gateway_info` key in the `router` property). This is only relevant if the Manager's external network appears in the [Provider-context](#misc). Defaults to `true`.
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Notes:**

  * There are several ways to connect a router to an external network:
    * The most direct way is to use the `external_network` property, which enables you to provide either the name or ID of the external network to which to connect.
    * Another option which may be preferred, especially if there's already a node representing the external network in the blueprint, is to connect the router to the external network using a relationship.
    * You can pass the external network ID via the standard Neutron API by using the nested `network_id` key under the `external_gateway_info` key of the `router` property. This overrides a value specified under the `external_network` property.
    * If none of the above is set, and the external-network used by the {{< param cfy_manager_name >}} is available in the [Provider-context](#misc), it may be automatically used as the gateway for the router, depending on the value of the `default_to_managers_external_network` property.
  * Do not provide an external network by both an ID/name *and* by relationship as this causes an error.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` creates the router
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
      * `args` The key-value router configuration as described in the [OpenStack network create router API](http://developer.openstack.org/api-ref-networking-v2.html#layer3). Defaults to `{}`.
        * **Notes:**
          * There are several ways to connect a router to an external network:
            * The most direct way is to use the `external_network` property, which enables you to provide either the name or ID of the external network to which to connect.
            * Another option which may be preferred, especially if there is already a node representing the external network in the blueprint, is to connect the router to the external network using a relationship.
            * You can pass the external network ID via the standard Neutron API by using the nested `network_id` key under the `external_gateway_info` key of the `router` property. This overrides the value specified under the `external_network` property.
            * If none of the above is provided, and the external-network used by the {{< param cfy_manager_name >}} is available in the [Provider-context](#misc), it can be automatically used as the gateway for the router, depending on the value of the `default_to_managers_external_network` property.

          * Do not provide an external network by both an ID/name *and* by relationship as this causes an error.
  * `cloudify.interfaces.lifecycle.delete` Deletes the router
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See [common validations section](#Validations).
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).



## cloudify.openstack.nodes.Port

 {{< highlight  yaml  >}}
  my-openstack-port:
    type: cloudify.openstack.nodes.Port
    properties:
      port:
        allowed_address_pairs: [{'ip_address': '192.168.121.0/24'}]
        security_groups:
        - '12a49669-e590-45ac-9c7e-97652b7502f4'
        - '391bbfc3-8bde-41d7-92c7-ac83b74e6464'
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Root

**Properties:**

  * `port` The key-value port configuration as described in the [OpenStack network create port API](http://developer.openstack.org/api-ref-networking-v2.html#ports).
  * `fixed_ip` Can be used to request a specific fixed IP for the port. If the IP is unavailable (either because it is already taken or does not belong to a subnet the port is on) an error is generated. Defaults to `''`.
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` see the [OpenStack Configuration](#openstack-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` creates the port
    * **Inputs:**
      * `args` The key-value port configuration as described in the [OpenStack network create port API](http://developer.openstack.org/api-ref-networking-v2.html#ports). Defaults to `{}`.
        * **Notes:**
          * Do not use the `network_id` key. Instead, connect the port node to a *single* network node via a relationship. It will then be placed on that network automatically.
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the port.
    * **Inputs:**
      * `openstack_config` see the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` see [common validations section](#Validations).
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).

In addition, the port's fixed-IP is available via the `fixed_ip_address` runtime property.



## cloudify.openstack.nodes.Network

 {{< highlight  yaml  >}}
  my-openstack-network:
    type: cloudify.openstack.nodes.Network
    properties:
      network:
        name: 'my-openstack-network'
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Network

**Properties:**

  * `network` The key-value network configuration as described in the [OpenStack network create network API](http://developer.openstack.org/api-ref-networking-v2.html#networks).
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` creates the network
    * **Inputs:**
      * `args` The key-value network configuration as described in the [OpenStack network create network API](http://developer.openstack.org/api-ref-networking-v2.html#networks). Defaults to `{}`.
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See [common validations section](#Validations).
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).



## cloudify.openstack.nodes.FloatingIP

 {{< highlight  yaml  >}}
  my-openstack-floating-ip:
    type: cloudify.openstack.nodes.FloatingIP
    properties:
      floatingip:
        floating_network_name: my-external-openstack-network
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Root

**Properties:**

  * `floatingip` The key-value floating IP configuration as described in the [OpenStack network create floating ip API](http://developer.openstack.org/api-ref-networking-v2.html#layer3).
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The IP or ID of an existing floating IP when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the floating IP.
    * **Inputs:**
      * `args` The key-value floating IP configuration as described in the [OpenStack network create floating ip API](http://developer.openstack.org/api-ref-networking-v2.html#layer3). Defaults to `{}`.
        * **Notes:**
          * A `floating_ip_address` key can be passed in order to use an existing allocated floating IP. The value is the existing floating IP address.
        * **Sugaring:**
          * `floating_network_name` Automatically resolves the OpenStack name of a network into the `floating_network_id`.
          * `ip` The equivalent of the `floating_ip_address` key.
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the floating IP
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See [common validations section](#Validations).
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).

Note that the actual IP is available via the `floating_ip_address` runtime-property.


## cloudify.openstack.nodes.Volume

 {{< highlight  yaml  >}}
  my-openstack-volume:
    type: cloudify.openstack.nodes.Volume
    properties:
      volume:
        size: 60
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Volume

**Properties:**

  * `volume` The key-value volume configuration as described in the [OpenStack Cinder create volume API](http://developer.openstack.org/api-ref-blockstorage-v1.html#volumes-v1).
  * `device_name` The device name to which this volume will be attached. Default value is *auto*, which means OpenStack will auto-assign a device. Note that if you do explicitly set a value, the value might not be the actual device name that is assigned. Sometimes, the requested device will not be available and OpenStack will assign it to a different device. For this reason, it is recommended that you use *auto*.
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the volume.
    * **Inputs:**
      * `args` The key-value volume configuration as described in the [OpenStack Cinder create volume API](http://developer.openstack.org/api-ref-blockstorage-v1.html#volumes-v1).
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the volume.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See [common validations section](#Validations).
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).


## cloudify.openstack.nodes.ServerGroup

 {{< highlight  yaml  >}}
  my-openstack-server-group:
    type: cloudify.openstack.nodes.ServerGroup
    properties:
      server_group:
        policies:
        - anti-affinity
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Root

**Properties:**

  * `server_group` The key-value server_group configuration as described in the [OpenStack Nova create Server Group API](https://developer.openstack.org/api-ref/compute/#create-server-group). (**Deprecated** - Use the `args` input in create operation instead.)
  * `policy` The policy. Not required.
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration). (**Deprecated** - Use the `openstack_config` input in all the operations instead.)

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the volume.
    * **Inputs:**
      * `args` The key-value server group configuration as described in the [OpenStack Nova create Server Group API](https://developer.openstack.org/api-ref/compute/#create-server-group).
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the server group.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See [common validations section](#Validations).
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).


## cloudify.openstack.nodes.Project

 {{< highlight  yaml  >}}
  my-openstack-project:
    type: cloudify.openstack.nodes.Project
    properties:
      project:
        name: my-openstack-project
        description: My new project.
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Root

**Properties:**

  * `project` The key-value project configuration as described in the [OpenStack Identity create Project API](https://developer.openstack.org/api-ref/identity/v3/#create-project). (**Deprecated** - Use the `args` input in create operation instead.)
  * `policy` The policy. Not required.
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration). (**Deprecated** - Use the `openstack_config` input in all the operations instead.)

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the volume.
    * **Inputs:**
      * `args` The key-value project configuration as described in the [OpenStack Identity create Project API](https://developer.openstack.org/api-ref/identity/v3/#create-project).
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the project.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See [common validations section](#Validations).
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).


## cloudify.openstack.nodes.Image

 {{< highlight  yaml  >}}
  my-openstack-image:
     properties:
       image:
         name: my-openstack-image
         container_format: “bare”
         disk_format: “qcow2"
 {{< /highlight >}}

**Derived From:** cloudify.nodes.Root

**Properties:**

  * `image` The key-value project configuration as described in the [OpenStack Glace create Image API](https://developer.openstack.org/api-ref/image/v2/#create-an-image). (**Deprecated** - Use the `args` input in create operation instead.)
  * `policy` The policy. Not required.
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration). (**Deprecated** - Use the `openstack_config` input in all the operations instead.)

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the volume.
    * **Inputs:**
      * `args` The key-value image configuration as described in the [OpenStack Glace create Image API](https://developer.openstack.org/api-ref/image/v2/#create-an-image).
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the image.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See [common validations section](#Validations).
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).


## cloudify.openstack.nova_net.nodes.FloatingIP

{{% note title="Note" %}}
This is a Nova-net specific type. See more in the [Nova-net Support section](#nova-net-support).
{{% /note %}}

**Derived From:** cloudify.nodes.VirtualIP

**Properties:**

  * `floatingip` The key-value floating IP configuration as described in the [OpenStack Nova create floating ip API](http://developer.openstack.org/api-ref-compute-v2-ext.html#ext-os-floating-ips).
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The IP or ID of an existing floating IP when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the floating IP.
    * **Inputs:**
      * `args` The key-value floating IP configuration as described in the [OpenStack Nova create floating ip API](http://developer.openstack.org/api-ref-compute-v2-ext.html#ext-os-floating-ips).
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete` Deletes the floating IP.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See [common validations section](#Validations).
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).

Note that the actual IP is available via the `floating_ip_address` runtime-property.


## cloudify.openstack.nova_net.nodes.SecurityGroup

{{% note title="Note" %}}
This is a Nova-net specific type. See more in the [Nova-net Support section](#nova-net-support).
{{% /note %}}

**Derived From:** cloudify.nodes.SecurityGroup

**Properties:**

  * `description` **Required**. The description for the security-group.
  * `security_group` The key-value `security_group` configuration as described in the [OpenStack Nova create security group API](http://developer.openstack.org/api-ref-compute-v2-ext.html#ext-os-security-groups).
  * `rules` The key-value security group rule configuration as described in the [OpenStack Nova security group API](http://developer.openstack.org/api-ref-compute-v2-ext.html#ext-os-security-group-default-rules). Defaults to `[]`.
    * Note: Each rule is parsed with default values, which take effect unless overridden. The default values are:
      * `from_port`: `1`
      * `to_port`: `65535`
      * `ip_protocol`: `tcp`
      * `cidr`: `0.0.0.0/0`
  * `use_external_resource` A boolean for setting whether to create the resource or use an existing one. See the [Using Existing Resources section](#using-existing-resources). Defaults to `false`.
  * `resource_id` The name to assign to the new resource, or the name or ID of an existing resource when the `use_external_resource` property is set to `true`. (See the [Using Existing Resources section](#using-existing-resources)). Defaults to `''` (empty string).
  * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` Creates the security group, together with its defined rules.
    * **Inputs:**
      * `args` The key-value `security_group` configuration as described in the [OpenStack Nova create security group API](http://developer.openstack.org/api-ref-compute-v2-ext.html#ext-os-security-groups). Defaults to `{}`.
        * **Notes:**
          * This property supports the same sugaring described for the equivalent property in the [Neutron security-group type](#cloudifyopenstacknodessecuritygroup).
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.lifecycle.delete`: Deletes the security group.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.validation.creation` See [common validations section](#Validations). In addition, the *CIDR* of rules which specify one is verified to be of the correct format.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

**Attributes:**

See the [common Runtime Properties section](#runtime-properties).


# Relationships

{{% note title="Information" %}}
Not all relationships have built-in types. For example, some types might simply be connected using standard {{< param product_name >}} relationships such as `cloudify.relationships.connected_to`.

Some relationships take effect in non-relationship operations. For example, a subnet that is connected to a network is connected on the subnet's creation (in the `cloudify.interfaces.lifecycle.create` operation) and not in a `cloudify.interfaces.relationship_lifecycle.establish` operation. This occurs whenever the connection information is required at resource creation.
{{% /note %}}


## cloudify.openstack.port_connected_to_security_group

**Description:** A relationship for a port to a security group.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.establish` Sets the security group on the port.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).


## cloudify.openstack.subnet_connected_to_router

**Description:** A relationship for connecting a subnet to a router.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.establish` Connects the subnet to the router.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.relationship_lifecycle.unlink` Disconnects the subnet from the router.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).


## cloudify.openstack.server_connected_to_floating_ip

**Description:** A relationship for associating a floating IP with a server.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.establish` Associates the floating IP with the server.
    * **Inputs:**
      * `fixed_ip` A specific fixed IP of the server to be associated with the floating IP. If omitted, a fixed-IP (or "port") is selected by OpenStack (Default: `''`).
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.relationship_lifecycle.unlink` Disassociates the floating IP from the server.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).


## cloudify.openstack.server_connected_to_security_group

**Description:** A relationship for setting a security group on a server.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.establish` Sets the security group on the server.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.relationship_lifecycle.unlink` Disassociates the security group from the server.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).


## cloudify.openstack.volume_attached_to_server

**Description:** A relationship for attaching a volume to a server.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.establish` Attaches the volume to the server.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.relationship_lifecycle.unlink` Detaches the volume from the server.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).


## cloudify.openstack.server_connected_to_port

**Description:** A relationship for connecting a server to a port. The server uses this relationship to automatically connect to the port upon server creation.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.unlink` Detaches the volume from the server.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).

## cloudify.openstack.port_connected_to_subnet

**Description:** A relationship for connecting a port to a subnet. This is useful when a network has multiple subnets, and a port must belong to a specific subnet on that network. The port then receives an IP from that specific subnet.

Note that when using this relationship in combination with the port type's property `fixed_ip`, the IP must be on the CIDR of the subnet connected to the port.

*Note*: This relationship has no operations associated with it. The port uses this relationship to automatically connect to the subnet upon port creation.


## cloudify.openstack.port_connected_to_floating_ip

**Description:** A relationship for associating a floating IP with a port. If that port is later connected to a server, the server is accessible via the floating IP.

**Mapped Operations:**

  * `cloudify.interfaces.relationship_lifecycle.establish` Associates the floating IP with the port.
    * **Inputs:**
      * `openstack_config` see the [OpenStack Configuration](#openstack-configuration).
  * `cloudify.interfaces.relationship_lifecycle.unlink` Disassociates the floating IP from the port.
    * **Inputs:**
      * `openstack_config` See the [OpenStack Configuration](#openstack-configuration).


# Common Behaviors of Types

## Validations

All types provide the same base functionality for the `cloudify.interfaces.validation.creation` interface operation:

  * If it is a new resource (`use_external_resource` is set to `false`), the basic validation verifies that there is sufficient quota to allocate a new resource of the specified type.

  * When [using an existing resource](#using-existing-resources), the validation verfies that the resource exists.


## Runtime Properties

Node instances of any of the types defined in this plugin are set with the following runtime properties during the `cloudify.interfaces.lifecycle.create` operation:

  * `external_id` The OpenStack ID of the resource
  * `external_type` The OpenStack type of the resource
  * `external_name` The OpenStack name of the resource

The only exceptions are the two *floating IP* types. Because `floating-ip` objects on OpenStack do not have a name, the `external_name` runtime property is replaced with the `floating_ip_address` name, which holds the object's actual IP address.


## Default Resource Naming Convention

When creating a new resource (i.e. `use_external_resource` is set to `false`), its name on OpenStack is the value of its `resource_id` property. However, if this value is not provided, the name defaults to the following schema:

`<openstack-resource-type>_<deployment-id>_<node-instance-id>`

For example, if a server node is defined as follows:

{{< highlight  yaml  >}}
node_templates:
  myserver:
    type: cloudify.openstack.nodes.Server
    ...
{{< /highlight >}}

Without setting the `resource_id` property, the server's name on OpenStack will be `server_my-deployment_myserver_XXXXX` (where the _XXXXX_ is the autogenerated part of the node instance's ID).




# Using Existing Resources

You can use existing resources on OpenStack, regardless of whether they were created by a different {{< param product_name >}} deployment or not via {{< param product_name >}} at all.

All {{< param product_name >}} OpenStack types have a property called `use_external_resource`, which has a default value of `false`. When set to `true`, the plugin applies different semantics for each of the operations executed on the relevant node's instances. Specifically, in the case of the `cloudify.interfaces.lifecycle.create` operation, rather than creating a new resource on OpenStack of the specified type, the plugin behaves as follows:

1. Attempts to locate an existing resource on OpenStack for which the name (or IP, in the case of one of the *floating-ip* types) is the value specified for the `resource_id` property. If more than one is found, an error is generated.

2. If no resource is found, the plugin uses the value of the `resource_id` property to look for the resource by ID. If a resource is still not found, an error is generated.

3. If a single resource is found, the plugin uses that resource and sets the node instance with the appropriate runtime properties, according to the resource's data.


The semantics of other operations are also affected, as follows:

* The `cloudify.interfaces.lifecycle.start` operation, where applicable, only validates that the resource has started, and generates an error if it has not.

* The `cloudify.interfaces.lifecycle.stop` operation, where applicable, does not have any effect.

* The `cloudify.interfaces.lifecycle.delete` operation does not delete the resource from OpenStack, but clears the runtime properties from the node instance.

* The `cloudify.interfaces.validation.creation` operation verifies that a resource with the specified name or ID exists, or prints a list of all available resources of the specific type.

* The `cloudify.interfaces.relationship_lifecycle.establish` operation behaves as normal if the related node is not set with `use_external_resource` as `true`. However, if both nodes have the property set to `true`, the operation only attempts to verify that they are also "connected" on OpenStack. ("Connected" in this case also refers to a `security-group` imposed on a server, a floating IP associated with a server, and so on.)


## Notes

* As mentioned in the [Relationships section](#relationships), some relationships take effect in non-relationship operations. When `use_external_resource` is set to `true`, the existence of such connections is validated as well.

* Using an existing resource is only logical for single-instance nodes.




# Nova-net Support

The OpenStack plugin includes support for Nova-net mode, meaning an OpenStack installation that does not have the Networking API (Neutron service).

In such an environment, there is only a single preconfigured private network that all servers make use of automatically. There are no subnets, networks, routers or ports. Since these resource types do not exist, the plugin's equivalent types are not valid for use in such an environment.

However, there are some resource types for which the API is available via both the Nova and the Neutron services. They had originally been on the Nova service and were later moved and received extended implementation in the Neutron service. They were also retained for backward compatibility in the Nova service.

For these resource types the OpenStack plugin defines two separate types. One type is in the plugin's standard types namespace (`cloudify.openstack.nodes.XXX`) that uses the newer, extended API via the Neutron service. The other type is in a special namespace (`cloudify.openstack.nova_net.nodes.XXX`) that uses the older API via the Nova service. You might therefore notice two separate types defined for [Floating](#cloudifyopenstacknodesfloatingip) [IP](#cloudifyopenstacknovanetnodesfloatingip), and for [Security](#cloudifyopenstacknodessecuritygroup) [Group](#cloudifyopenstacknovanetnodessecuritygroup).


To summarize, ensure that when working in a Nova-net OpenStack environment, Neutron types are not used. These include all types in which the resources' APIs are natively available only via the Network API, and the types that are in the `cloudify.openstack.nova_net.Nodes` namespace.

Conversely, when using an OpenStack environment that supports Neutron, it is recommended that you use the Neutron-versions of the relevant types (meaning that you avoid any types defined under the `cloudify.openstack.nova_net.Nodes` namespace), as they offer more advanced capabilities. However, it's important to mention that this is not required, and using the Nova-versions of some types in a Neutron-enabled environment is possible and will work as well.



# Examples

## Example I: Using plugin types and creating relationships

This example demonstrates how to use most of the types in this plugin, and how to create the relationships between them. It creates a server with a security group set on it and a floating IP associated to it, on a subnet in a network.

The following is an excerpt from the blueprint's `blueprint`.`node_templates` section:

{{< highlight  yaml  >}}
my_floating_ip:
  type: cloudify.openstack.nodes.FloatingIP
  interfaces:
    cloudify.interfaces.lifecycle:
      create:
        inputs:
          args:
            floating_network_name: Ext-Net


my_network:
  type: cloudify.openstack.nodes.Network
  properties:
    resource_id: my_network_openstack_name


my_subnet:
  type: cloudify.openstack.nodes.Subnet
  properties:
    resource_id: my_subnet_openstack_name
  interfaces:
    cloudify.interfaces.lifecycle:
      create:
        inputs:
          args:
            cidr: 1.2.3.0/24
            ip_version: 4
    cloudify.interfaces.validation:
      creation:
        inputs:
          args:
            cidr: 1.2.3.0/24
            ip_version: 4
  relationships:
    - target: my_network
      type: cloudify.relationships.contained_in


my_security_group:
  type: cloudify.openstack.nodes.SecurityGroup
  properties:
    resource_id: my_security_group_openstack_name
    rules:
      - remote_ip_prefix: 0.0.0.0/0
        port: 8080


my_server:
  type: cloudify.openstack.nodes.Server
  properties:
    resource_id: my_server_openstack_name
  interfaces:
    cloudify.interfaces.lifecycle:
      create:
        inputs:
          args:
            image: 8672f4c6-e33d-46f5-b6d8-ebbeba12fa02
            flavor: 101
    cloudify.interfaces.validation:
      creation:
        inputs:
          args:
            image: 8672f4c6-e33d-46f5-b6d8-ebbeba12fa02
            flavor: 101
  relationships:
    - target: my_network
      type: cloudify.relationships.connected_to
    - target: my_subnet
      type: cloudify.relationships.depends_on
    - target: my_floating_ip
      type: cloudify.openstack.server_connected_to_floating_ip
    - target: my_security_group
      type: cloudify.openstack.server_connected_to_security_group
{{< /highlight >}}

**Node by Node Explanation**

1. Creates a floating IP with the node name `my_floating_ip`, and the `Ext-Net` floating_network_name. (This value represents the name of the external network).

2. Creates a network with the node name `my_network`, and the `my_network_openstack_name` name on OpenStack.

3. Creates a subnet with the node name `my_subnet`, and the `my_subnet_openstack_name` name on OpenStack. The subnet's address range is defined as 1.2.3.0 - 1.2.3.255 using the `cidr` parameter, and the subnet's IP version is set to version 4. The subnet will be set on the `my_network_openstack_name` network because of the relationship to the `my_network` node.

4. Creates a security_group with the node name `my_security_group`, and the  `my_security_group_openstack_Name` name on OpenStack. The security group is set with a single rule, that allows all traffic (Because the address range `0.0.0.0/0` is used) to port `8080`. (The default direction is *ingress*).

5. Creates a server with the node name `my_server`, and the `my_server_openstack_name` name on OpenStack. The server is set with an image and flavor IDs. The server is set with multiple relationships:
  - A relationship to the `my_network` node. Through this relationship, the server is automatically placed on the `my_network_openstack_name` network.
  - A relationship to the `my_subnet` node. This relationship is strictly for ensuring the order of creation is correct because the server requires the `my_subnet_openstack_name` subnet to exist before it can be created on it.
  - A relationship to the `my_floating_ip` node. This designated relationship type is responsible for associating the server with the floating IP represented by the `my_floating_ip` node.
  - A relationship with the `my_security_group` node. This relationship is responsible for setting the server up with the security group that is represented by the `my_security_group` node.

## Example II: Using the router and port types

This example demonstrates how to use the `router` and `port` types, and some of the relationships that were not included in example I. It creates a server connected to a port, in which the port is set on a subnet in a network and has a security group set on it. Finally, it shows how this subnet connects to a router and from there to the external network.

Following is an excerpt from the blueprint's `blueprint`.`node_templates` section:

{{< highlight  yaml  >}}
my_network:
  type: cloudify.openstack.nodes.Network
  properties:
    resource_id: my_network_openstack_name


my_security_group:
  type: cloudify.openstack.nodes.SecurityGroup
  properties:
    resource_id: my_security_group_openstack_name
    rules:
      - remote_ip_prefix: 0.0.0.0/0
        port: 8080


my_subnet:
  type: cloudify.openstack.nodes.Subnet
  properties:
    resource_id: my_subnet_openstack_name
  interfaces:
    cloudify.interfaces.lifecycle:
      create:
        inputs:
          args:
            cidr: 1.2.3.0/24
            ip_version: 4
    cloudify.interfaces.validation:
      creation:
        inputs:
          args:
            cidr: 1.2.3.0/24
            ip_version: 4
  relationships:
    - target: my_network
      type: cloudify.relationships.contained_in
    - target: my_router
      type: cloudify.openstack.subnet_connected_to_router


my_port:
  type: cloudify.openstack.nodes.Port
  properties:
    resource_id: my_port_openstack_name
  relationships:
    - target: my_network
      type: cloudify.relationships.connected_to
    - target: my_subnet
      type: cloudify.openstack.port_connected_to_subnet
    - target: my_security_group
      type: cloudify.openstack.port_connected_to_security_group


my_router:
  type: cloudify.openstack.nodes.Router
  properties:
    resource_id: my_router_openstack_Name


my_server:
  type: cloudify.openstack.nodes.Server
  properties:
    cloudify_agent:
      user: ubuntu
  interfaces:
    cloudify.interfaces.lifecycle:
      create:
        inputs:
          args:
            image: 8672f4c6-e33d-46f5-b6d8-ebbeba12fa02
            flavor: 101
    cloudify.interfaces.validation:
      creation:
        inputs:
          args:
            image: 8672f4c6-e33d-46f5-b6d8-ebbeba12fa02
            flavor: 101
  relationships:
    - target: my_port
      type: cloudify.openstack.server_connected_to_port
{{< /highlight >}}

**Node by Node Explanation**

1. Creates a network. See example I for more information.

2. Creates a security group. See example I for more information.

3. Creates a subnet. This is similar to that in example I, but in this example the subnet has an additional relationship set towards a router.

4. Creates a port, with the node name `my_port`, and the name `my_port_openstack_name` on OpenStack. The port is set with multiple relationships:
  - A relationship to the `my_network` node. Through this relationship, the port will be automatically placed on the `my_network_openstack_name` network.
  - A relationship to the `my_subnet` node. This relationship is strictly for ensuring the correct order of creation, becaue the port requires that the `my_subnet_openstack_name` subnet exists before it can be created on it.
  - A relationship to the `my_security_group` node. This designated relationship type manages the setting of the `my_security_group_openstack_name` security group on the port.

5. Creates a router, with the node name `my_router` and the `my_router_openstack_name` name on OpenStack. The router will automatically have an interface in the external network.

6. Creates a server, with the node name `my_server`, and the *the node's ID* name (because no `name` parameter was supplied under the `server` property) on OpenStack.<br>
The server is set with an image and flavor IDs. It also overrides the `cloudify_agent` property of its parent type, to set the username that will be used to connect to the server for installing the {{< param product_name >}} agent on it. Finally, it is set with a relationship to the `my_port` node. This designated relationship type manages connecting the server to `my_port_openstack_name`.

## Example III: Using the volume type

This example demonstrates how to use the `volume` type, and the `volume_attached_to_server` relationship.

Following is an excerpt from the blueprint's `blueprint`.`node_templates` section.

{{< highlight  yaml  >}}
my_server:
  type: cloudify.openstack.nodes.Server
  properties:
    cloudify_agent:
      user: ubuntu
  interfaces:
    cloudify.interfaces.lifecycle:
      create:
        inputs:
          args:
            image: 8672f4c6-e33d-46f5-b6d8-ebbeba12fa02
            flavor: 101
    cloudify.interfaces.validation:
      creation:
        inputs:
          args:
            image: 8672f4c6-e33d-46f5-b6d8-ebbeba12fa02
            flavor: 101

my_volume:
  type: cloudify.openstack.nodes.Volume
  properties:
    resource_id: my_openstack_volume_name
    device_name: /dev/vdb
  interfaces:
    cloudify.interfaces.lifecycle:
      create:
        inputs:
          args:
            size: 1
  relationships:
    - target: my_server
      type: cloudify.openstack.volume_attached_to_server
{{< /highlight >}}

**Node by Node Explanation**

1. Creates a server, with name `my_server`, and with name on OpenStack *the node's ID* (since no `name` parameter was supplied under the `server` property). The server is set with an image and flavor IDs.
2. Creates a volume. It is set with a relationship to the `my_server` node: This designated relationship type will take care of attaching the volume to OpenStack server node.

## Example IV: Using Windows server with a Cloudify agent

This example demonstrates how to use a Windows server on which a {{< param product_name >}} agent is deployed.

Following is an excerpt from the blueprint's `blueprint`.`node_templates` section:

{{< highlight  yaml  >}}
my_keypair:
  type: cloudify.openstack.nodes.KeyPair
  properties:
    private_key_path: /tmp/windows-test.pem

my_server:
  type: cloudify.openstack.nodes.WindowsServer
  relationships:
    - type: cloudify.openstack.server_connected_to_keypair
      target: keypair
  interfaces:
    cloudify.interfaces.lifecycle:
      create:
        inputs:
          args:
            server:
              image: 8672f4c6-e33d-46f5-b6d8-ebbeba12fa02
              flavor: 101
              name: my-server
              userdata: |
                #ps1_sysnative
                winrm quickconfig -q
                winrm set winrm/config/winrs '@{MaxMemoryPerShellMB="300"}'
                winrm set winrm/config '@{MaxTimeoutms="1800000"}'
                winrm set winrm/config/service '@{AllowUnencrypted="true"}'
                winrm set winrm/config/service/auth '@{Basic="true"}'
                &netsh advfirewall firewall add rule name="WinRM 5985" protocol=TCP dir=in localport=5985 action=allow
                &netsh advfirewall firewall add rule name="WinRM 5986" protocol=TCP dir=in localport=5986 action=allow

                msiexec /i https://www.python.org/ftp/python/2.7.6/python-2.7.6.msi TARGETDIR=C:\Python27 ALLUSERS=1 /qn
    cloudify.interfaces.validation:
      creation:
        inputs:
          args:
            server:
              image: 8672f4c6-e33d-46f5-b6d8-ebbeba12fa02
              flavor: 101
              name: my-server
              userdata: |
                #ps1_sysnative
                winrm quickconfig -q
                winrm set winrm/config/winrs '@{MaxMemoryPerShellMB="300"}'
                winrm set winrm/config '@{MaxTimeoutms="1800000"}'
                winrm set winrm/config/service '@{AllowUnencrypted="true"}'
                winrm set winrm/config/service/auth '@{Basic="true"}'
                &netsh advfirewall firewall add rule name="WinRM 5985" protocol=TCP dir=in localport=5985 action=allow
                &netsh advfirewall firewall add rule name="WinRM 5986" protocol=TCP dir=in localport=5986 action=allow

                msiexec /i https://www.python.org/ftp/python/2.7.6/python-2.7.6.msi TARGETDIR=C:\Python27 ALLUSERS=1 /qn
    cloudify.interfaces.worker_installer:
      install:
        inputs:
          cloudify_agent:
            user: Admin
            password: { get_attribute: [SELF, password] }
{{< /highlight >}}

Node by Node Explanation

1. Creates a keypair. The private key is saved under `/tmp/windows-test.pem`.
2. Creates a Windows server.
  * It is set with a relationship to the `my_keypair` node, which makes the server use the it as a public key for authentication, and also makes it use this public key to encrypt the password before posting it to the OpenStack metadata service.
  * The worker-installer interface operations are supplied with values for the user and password for the `cloudify_agent` input. The password uses the [get_attribute]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-attribute" >}}) feature to retrieve the decrypted password from the Server's runtime properties. (Note that in this example, only the `install` operation was supplied with this input, but all of the worker installer operations and the plugin installer operations should be supplied with it).
  * Custom userdata is defined that configures WinRM and installs Python on the machine (Windows Server 2012 in this example) after it is up. This is required for the {{< param product_name >}} agent to be installed on the machine.

# Tips

* It is highly recommended that you **ensure that OpenStack names are unique** (for a given type). While OpenStack allows same name objects, having identical names for objects of the same type might lead to ambiguities and errors.

* To set up DNS servers for OpenStack servers (whether {{< param cfy_manager_name >}} or application VMs), you can use the OpenStack `dns_nameservers` parameter for the [Subnet type](#cloudifyopenstacknodessubnet), meaning that you can pass the parameter directly to Neutron by using the `args` input of the operations in Subnet node, e.g.:
{{< highlight  yaml  >}}
my_subnet_node:
  interfaces:
    cloudify.interfaces.lifecycle:
      create:
        inputs:
          args:
            dns_nameservers: [1.2.3.4]
    cloudify.interfaces.validation:
      creation:
        inputs:
          args:
            dns_nameservers: [1.2.3.4]
{{< /highlight >}}
  This will set up `1.2.3.4` as the DNS server for all servers on this subnet.

* Public keys, unlike the rest of the OpenStack resources, are user-based rather than tenant-based. When errors indicate a missing keypair, ensure that you are using the correct user rather than tenant.

* ICMP rules appear on Horizon (OpenStack GUI) as ones defined using `type` and `code` fields, rather than a port range. However, in the actual Neutron (and Nova, in case of Nova-net security groups) service, these fields are represented using the standard port range fields (i.e., `type` and `code` correspond to `port_range_min` and `port_range_max` (respectively) on Neutron security groups, and to `from_port` and `to_port` (respectively) on Nova-net security groups).
  * For example, to set a security group rule that enables *ping* from anywhere, the following setting may be declared in the blueprint:
    * `protocol`: `icmp`
    * `port_range_min`: `0` (type)
    * `port_range_max`: `0` (code)
    * `remote_ip_prefix`: `0.0.0.0/0`

* To use OpenStack Neutron's ML2 extensions, use the `args` input for the Network's `create` operation. For example, the [provider network](http://developer.openstack.org/api-ref-networking-v2-ext.html#createProviderNetwork) may be set in the following way:

{{< highlight  yaml  >}}
my_network:
  type: cloudify.openstack.nodes.Network
  ...
  interfaces:
    cloudify.interfaces.lifecycle:
      create:
        inputs:
          args:
            # Note that for this parameter to work, OpenStack must be configured to use Neutron's ML2 extensions
            provider:network_type: vxlan
{{< /highlight >}}

* Ordering NICs in the OpenStack plugin can be done in the 1.4 version of the OpenStack plugin by simply stating the relationships to the various networks (or ports) in the required order, e.g.:
{{< highlight  yaml  >}}
node_templates:
  server:
    type: cloudify.openstack.nodes.Server
    relationships:
      - target: network1
        type: cloudify.relationships.connected_to
      - target: network2
        type: cloudify.relationships.connected_to

  network1:
    type: cloudify.openstack.nodes.Network
    properties:
      resource_id: network1

  network2:
    type: cloudify.openstack.nodes.Network
    properties:
      resource_id: network2
{{< /highlight >}}
  In the example above, network1 is connected to a NIC preceding the one network2 will. However, these will not be eth0/eth1, but rather eth1/eth2 because by default, the management network will be prepended to the networks list (meaning it will be assigned to eth0).
  To avoid this prepending, explicitly declare a relationship to the management network, where the network is represented in the blueprint by an existing resource (using the `use_external_resource` property).
  This will cause the management network to adhere the NICs ordering as the rest of them.
  Example:
{{< highlight  yaml  >}}
node_templates:
  server:
    type: cloudify.openstack.nodes.Server
    properties:
      management_network_name: network2
    relationships:
      - target: network1
        type: cloudify.relationships.connected_to
      - target: network2
        type: cloudify.relationships.connected_to
      - target: network3
        type: cloudify.relationships.connected_to

  network1:
    type: cloudify.openstack.nodes.Network
    properties:
      resource_id: network1

  network2:
    type: cloudify.openstack.nodes.Network
    properties:
      use_external_resource: true
      resource_id: network2

  network3:
    type: cloudify.openstack.nodes.Network
    properties:
      use_external_resource: true
      resource_id: network3
{{< /highlight >}}
  In this example, "network2" represents the management network, however it will be connected to eth1, whereas "network1" will take eth0, and "network3" (which also already existed) will be connected to eth2.
  {{% note title="Information" %}}
  The server's property `management_network_name: network2` is not mandatory for this to work, it has been added to make the example clear. However, the management network can also be inferred from the provider context (which is what happens when this property is not explicitly set). If the provider context was to have `network2` set as the management network, the example would have worked just the same with this property omitted.
  {{% /note %}}

# Misc

* The plugin's operations are each *transactional* (and therefore also can be retried on failure), but not *idempotent*. Attempting to execute the same operation twice is likely to fail.
