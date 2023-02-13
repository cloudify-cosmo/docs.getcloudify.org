---
title: Openstack Plugin v3
category: Official Plugins
description: The OpenStack plugin enables you to use an OpenStack-based cloud infrastructure for deploying services and applications
draft: false
weight: 160
aliases:
    - /plugins/openstack/
    - /developer/official_plugins/openstack/
---

__Note:  This documentation refers to {{< param product_name >}} Openstack Plugin v3.X, the new version of the Openstack Plugin. For documentation on the old version, see [Openstack Plugin]({{< relref "working_with/official_plugins/Infrastructure/openstack.md" >}}). Openstack Plugin v3 is not backward compatible with v2. See [Note on Openstack Plugin v2.X Compatibility](#note-on-openstack-plugin-v2-x-compatibility).

## Note on Openstack Plugin v2.X Compatibility

The Openstack Plugin v3.1.0 and above supports a compatibility mode for [v2.X]({{< relref "working_with/official_plugins/Infrastructure/openstack.md" >}}) node types and relationships. This requires importing a special `compat.yaml` in addition to the plugin yaml. Here are some examples:

**Plugin Import Notation with Compat YAML**

```yaml
tosca_definitions_version: cloudify_dsl_1_3
imports:
  - http://www.getcloudify.org/spec/cloudify/4.4/types.yaml
  - plugin:cloudify-openstack-plugin?version=3.1.0
  - https://raw.githubusercontent.com/cloudify-cosmo/cloudify-openstack-plugin/3.1.0/compat.yaml
```

**URL Import Notation with Compat YAML**

```yaml
  - http://www.getcloudify.org/spec/cloudify/4.4/types.yaml
  - http://www.getcloudify.org/spec/openstack-plugin/3.1.0/plugin.yaml
  - https://raw.githubusercontent.com/cloudify-cosmo/cloudify-openstack-plugin/3.1.0/compat.yaml
```

_Note that you must import the `compat.yaml` file in order for the compatibility to take effect.

__Note: Node Templates that include a mapping to an Openstack v2 Operation are not supported.__

## Introduction

The Openstack plugin enables you to manage Openstack resources with {{< param product_name >}}.
## OpenStack Compatibility
{{< param product_name >}} OpenStack v3 plugin is compatible with the following OpenStack releases:

* **Train** 	
* **Stein** 	
* **Rocky** 	
* **Queens**

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

Note: If `auth_url` version is `v3` then one of the following combinations must be provided under `client_config`:

  * `user_domain_id`, `project_domain_id`
  * `user_domain_name`, `project_domain_name`
  * `user_domain_id`, `project_domain_name`
  * `user_domain_name`, `project_domain_id`

## Common Properties

Openstack Plugin node types have these common properties, except where noted:

**Properties**

  * `client_config`: A dictionary that contains values to be passed to the connection client.
  * `resource_config`: A dictionary with required and common parameters to the resource's create or put call. The `kwargs` key accepts any supported Openstack API method arguments.
  * `use_external_resource`: Boolean. The default value is `false`. Set to `true` if the resource already exists.
  * `use_external_resource`: Boolean. The default value is `false`. Set to `true` if use_external_resource is `true` and the resource is missing, the resource will be created instead of failing.

## Common Runtime Properties

Node instances of any of the types defined in this plugin are set with the following runtime properties during the `cloudify.interfaces.lifecycle.create operation`:

* `id`: The OpenStack ID of the resource
* `name`: The OpenStack type of the resource
* `type`: The OpenStack name of the resource


## Common Interface Operations

Most of the node types provide the same base functionalities:

* `cloudify.interfaces.validation.creation` interface operation: The basic validation verifies that there is sufficient quota to allocate a new resource of the specified type.
* `cloudify.interfaces.operation.list` interface operation: List all available resources of the specified node type.
* `cloudify.interfaces.operation.update` interface operation: Update resource of the specified node type.

## Logging for OpenStack Libraries

The OpenStack library `openstacksdk` used by the OpenStack plugin perform its own logging using the standard Python `logging` library.

It is possible to control the visibility of OpenStack API's logging on {{< param product_name >}}'s logger by using the `logging` configuration directive.

The structure of the `logging` directive is as follows:

```yaml
logging:
  use_cfy_logger: <boolean> (defaults to true)
  groups:
    openstack: <level>
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
    openstack: debug
  loggers: {}
```

If you specify a `logging` directive, its contents will be merged with the default.

If `use_cfy_logger` is `true`, then a logging handler is added to all applicable OpenStack API loggers (described below)
so log records are emitted to the {{< param product_name >}} logger *in addition* to any other handlers that may be configured.

The `groups` section is used to easily set the logging level for groups of loggers service. right now we support one group `openstack`

For example, setting `openstack` to `info` will result in the following loggers being set to `info` level:

* `openstack`
* `openstack.config`
* `openstack.iterate_timeout`
* `openstack.fnmatch`
* `keystoneauth`

In addition, you can set the logging level of individual loggers under the `loggers` section.

# Node Types

Each node type refers to a resource in Openstack.

## **cloudify.nodes.openstack.Flavor**

This node type refers to an flavor.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Required_. This is the user-readable name in Openstack if you want to set it.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. A description of the flavor.
  * `ram`: _Integer_. _Required_. The amount of RAM a flavor has, in MiB.
  * `disk`: _String_. _Required_. The size of the root disk that will be created in GiB. If 0 the root disk will be set to exactly the size of the image used. to deploy the instance. However, in this case filter scheduler cannot select the compute host based on the virtual image size. Therefore, 0 should only be used for volume booted instances or for testing purposes.
  * `vcpus`: _Integer_. _Required_. The number of virtual CPUs that will be allocated to the server.

For more information, and possible keyword arguments, see: [create_flavor](https://developer.openstack.org/api-ref/compute/#create-flavor).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_flavor](https://developer.openstack.org/api-ref/compute/#create-flavor).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_flavor](https://developer.openstack.org/api-ref/compute/#delete-flavor).
  * `cloudify.interfaces.operations.update`:
      - Executes [update_flavors](https://developer.openstack.org/api-ref/compute/#update-flavor-description). will raise `NonRecoverableError` error because current Openstack SDK does not support flavor update operation. Will support it once the Openstack SDK adds support for it.
  * `cloudify.interfaces.operations.list`:
      - Executes [list_flavors](https://developer.openstack.org/api-ref/compute/#list-flavors-with-details).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the List Flavor API method
          - `details`: _Boolean_. _Not required_. Flag to list flavors with details. By Default it is `true`


### Flavor Examples

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

## **cloudify.nodes.openstack.HostAggregate**

This node type refers to a host aggregate.

**Resource Config**

  * `name`: _String_. _Required_. This is the user-readable name in Openstack if you want to set it.
  * `availability_zone`: _String_. _Not required_. The name of the host aggregate.

For more information, and possible keyword arguments, see: [create_aggregate](https://developer.openstack.org/api-ref/compute/#create-aggregate).

**Properties**

  * `metadata`: Metadata key and value pairs. The maximum size for each metadata key and value pair is 255 bytes. All keys values should be provided as string.
  * `hosts`: _List_. _Not required_. list of hosts IDs, which will be a members of host aggregate.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_aggregate](https://developer.openstack.org/api-ref/compute/#create-aggregate).
  * `cloudify.interfaces.lifecycle.configure`: Executes [set_metadata](https://developer.openstack.org/api-ref/compute/#create-or-update-aggregate-metadata).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_aggregate](https://developer.openstack.org/api-ref/compute/#delete-aggregate).
  * `cloudify.interfaces.operations.update`:
      - Executes [update_aggregate](https://developer.openstack.org/api-ref/compute/#update-aggregate).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update Host Aggregate API method

  * `cloudify.interfaces.operations.list`: Executes [list_aggregates](https://developer.openstack.org/api-ref/compute/#list-aggregates).
  * `cloudify.interfaces.operations.add_hosts`:
      - Executes [add_hosts](https://developer.openstack.org/api-ref/compute/#add-host).
      - Inputs:
          - `hosts`: _List_. _required_. List of hosts (strings) to add to an aggregate.
  * `cloudify.interfaces.operations.remove_hosts`:
      - Executes [remove_hosts](https://developer.openstack.org/api-ref/compute/#remove-host).
      - Inputs:
          - `hosts`: _List_. _required_. List of hosts (strings) to remove from an aggregate.

### Host Aggregate Examples

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

For more information, and possible keyword arguments, see: [create_image](https://developer.openstack.org/api-ref/image/v2/#create-image).

**Operations**

  * `cloudify.interfaces.lifecycle.create`:
      - Executes [upload_image](https://docs.openstack.org/openstacksdk/latest/user/proxies/image_v2.html).
          - Create and a new image from attributes
          - Upload image is not supported yet
  * `cloudify.interfaces.lifecycle.start`: This operation is added in order to check the status of uploading image. However, since uploading image is not supported on this version, this operation will be disabled
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_image](https://docs.openstack.org/openstacksdk/latest/user/proxies/image_v2.html).
  * `cloudify.interfaces.operations.update`:
      - Executes [update_image](https://developer.openstack.org/api-ref/image/v2/?expanded=#update-image).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update Image API method
  * `cloudify.interfaces.operations.list`:
      - Executes [list_images](https://developer.openstack.org/api-ref/image/v2/#list-images).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Image API method
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.

### Image Examples

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
  * `name`: _String_. _Required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `public_key`: _String_. _Not required_. The public ssh key to import. If you omit this value, a keypair is generated for you.

For more information, and possible keyword arguments, see: [create_keypair](https://developer.openstack.org/api-ref/compute/#create-or-import-keypair).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_keypair](https://developer.openstack.org/api-ref/compute/#create-or-import-keypair).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_keypair](https://developer.openstack.org/api-ref/compute/#delete-keypair).
  * `cloudify.interfaces.operations.list`:  Executes [list_keypairs](https://developer.openstack.org/api-ref/compute/#list-keypairs).
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.

### Key Pair Examples

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

## **cloudify.nodes.openstack.Server**

This node type refers to an Openstack Server.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Required_. This is the user-readable name in Openstack if you want to set it.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `image_id`: _String_. _Not required_. The UUID of the image to use for your server instance. This is not required in case of boot from volume. In all other cases it is required and must be a valid UUID otherwise API will return 400.
  * `flavor_id`: _String_. _Not required_. The flavor reference, as an ID (including a UUID) or full URL, for the flavor for your server instance.
  * `availability_zone`: _String_. _Not required_. The availability zone from which to launch the server. When you provision resources, you specify from which availability zone you want your instance to be built. Typically, an admin user will use availability zones to arrange OpenStack compute hosts into logical groups. An availability zone provides a form of physical isolation and redundancy from other availability zones. For instance, if some racks in your data center are on a separate power source, you can put servers in those racks in their own availability zone. Availability zones can also help separate different classes of hardware. By segregating resources into availability zones, you can ensure that your application resources are spread across disparate machines to achieve high availability in the event of hardware or other failure. You can list the available availability zones by calling the os-availability-zone API, but you should avoid using the default availability zone when booting the instance. In general, the default availability zone is named nova. This AZ is only shown when listing the availability zones as an admin.
  * `user_data`: _String_. _Not required_. Configuration information or scripts to use upon launch. Must be Base64 encoded. Restricted to 65535 bytes.
  * `metadata`: _Dictionary_. _Not required_. Metadata key and value pairs. The maximum size of the metadata key and value is 255 bytes each.
  * `security_groups`: _List_. _Not required_. One or more security groups. Specify the name of the security group in the name attribute. If you omit this attribute, the API creates the server in the default security group. Requested security groups are not applied to pre-existing ports.
  * `networks`: _List_. _Not required_. A list of network objects. Required parameter when there are multiple networks defined for the tenant. When you do not specify the networks parameter, the server attaches to the only network created for the current tenant.
  * `key_name`: _String_. _Not required_. Openstack key pair name.

For more information, and possible keyword arguments, see: [create_server](https://developer.openstack.org/api-ref/compute/#create-server)

**Properties**

  * `use_ipv6_ip`: _Boolean_. _Not required_. Default: `false`. Set `ip` runtime property to IPv6 address if available.
  * `use_public_ip`: _Boolean_. _Not required_. Default: `false`. Set `ip` runtime property to a public ip if available.
  * `use_password`: _Boolean_. _Not required_. Default: `false`. A boolean describing whether this server image supports user-password authentication.
  * `image`: _String_. _Not required_. Default: ''. The image for the server. May receive either the ID or the name of the image.
  * `flavor`: _String_. _Not required_. Default: ''. The flavor for the server. May receive either the ID or the name of the flavor.


**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_server](https://developer.openstack.org/api-ref/compute/#create-server).
  * `cloudify.interfaces.lifecycle.configure`:
      - Set server IPs as instance runtime properties
      - Save server password as instance runtime properties if `use_password` property is set to `true`
  * `cloudify.interfaces.lifecycle.reboot`:
    - Executes [reboot_server](https://developer.openstack.org/api-ref/compute/#reboot-server-reboot-action).
    - Inputs:
        `reboot_type`: The type of reboot to perform.`HARD` and `SOFT` are the current options.The default value is `SOFT`
  * `cloudify.interfaces.lifecycle.stop`: Executes [stop_server](https://developer.openstack.org/api-ref/compute/#stop-server-os-stop-action).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_server](https://developer.openstack.org/api-ref/compute/#delete-server).
  * `cloudify.interfaces.freeze.suspend`: This operation suspends a server  and changes its status to `SUSPENDED`.
  * `cloudify.interfaces.freeze.resume`: This operation resumes a suspended server and changes its status to `ACTIVE`.
  * `cloudify.interfaces.snapshot.create`:
      - This operation supports two types of backup:
          1. Backup: Executes [create_image](https://developer.openstack.org/api-ref/compute/#create-image-createimage-action).
          2. Snapshot: Executes [create_backup](https://developer.openstack.org/api-ref/compute/#create-server-back-up-createbackup-action).
      - Inputs:
          - `snapshot_name`: Backup name. Name of resulted object is something like `<object type>-<original object id>-<backup |increment>-<name>`
          - `snapshot_incremental`: Create incremental snapshots or full backup.If `snapshot_incremental`  is `true` - code will try to
             create snapshot of object otherwise code will try to create copy of VM as image
          - `snapshot_type`: The backup type, like 'daily' or 'weekly'
          - `snapshot_rotation`: How many backups to keep around

  * `cloudify.interfaces.snapshot.apply`: Restore Backups
      - Executes [rebuild_server](https://developer.openstack.org/api-ref/compute/#rebuild-server-rebuild-action)
      - Inputs:
          - `snapshot_name`: Backup name.
          - `snapshot_incremental`: Restore from incremental snapshots or full backup
  * `cloudify.interfaces.snapshot.delete`: Executes [delete_image](https://developer.openstack.org/api-ref/image/v2/#delete-image)
 * `cloudify.interfaces.operations.update`:
      - Executes [update_server](https://developer.openstack.org/api-ref/compute/#update-server).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update Server API method
  * `cloudify.interfaces.operations.list`:
      - Executes [list_servers](https://developer.openstack.org/api-ref/compute/#list-servers-detailed).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Server API method
          - `all_projects`: _Boolean_. _Not required_.Flag to list Servers from all projects By Default it is `false`
          - `details`: _Boolean_. _Not required_. Flag to list Servers with details. By Default it is `true`
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.openstack.Network`: Create the VM on a certain network.
    * `cloudify.nodes.openstack.Volume`: Create the VM with an attachment to a certain volume.
  * `cloudify.relationships.openstack.server_connected_to_keypair`:
    * `cloudify.nodes.openstack.KeyPair`: Create with a key pair in your account.
  * `cloudify.relationships.openstack.server_connected_to_server_group`:
    * `cloudify.nodes.openstack.ServerGroup`: Create the VM in a certain server group.
  * `cloudify.relationships.openstack.server_connected_to_port`:
    * `cloudify.nodes.openstack.Port`: Create the VM with an attachment to a certain port.
  * `cloudify.relationships.openstack.server_connected_to_floating_ip`:
    * `cloudify.nodes.openstack.FloatingIP`: Create the VM with an attachment to a floating ip.
  * `cloudify.relationships.openstack.server_connected_to_security_group`:
    * `cloudify.nodes.openstack.SecurityGroup`: Create the VM with an attachment to a security group.

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

**Create a Server connected to a certain port, keypair and to certain security group**

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
        name: { concat: [ { get_input: name_prefix }, 'server' ] }
        image_id: { get_input: image }
        flavor_id: { get_input: flavor }
    relationships:
      - type: cloudify.relationships.openstack.server_connected_to_security_group
        target: example-security-group
      - type: cloudify.relationships.openstack.server_connected_to_port
        target: example-port
      - type: cloudify.relationships.connected_to
        target: example-network-2
      - type: cloudify.relationships.openstack.server_connected_to_keypair
        target: example-keypair
```

**Create a Server connected to a certain port, keypair and to certain floating ip**

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
        name: { concat: [ { get_input: name_prefix }, 'server' ] }
        image_id: { get_input: image }
        flavor_id: { get_input: flavor }
    relationships:
      - type: cloudify.relationships.openstack.server_connected_to_floating_ip
        target: example-ip
      - type: cloudify.relationships.openstack.server_connected_to_port
        target: example-port
      - type: cloudify.relationships.openstack.server_connected_to_keypair
        target: example-keypair
```

## **cloudify.nodes.openstack.WindowsServer**

This node type refers to an Openstack Windows Server. It is identical to `cloudify.nodes.openstack.Server`, except the following values have been overridden:

**Properties**
  * `os_family`: Default: `windows`.
  * `agent_config`: Default: `port: 5985`

### Windows Server Examples

**Create a Server connected to a certain port and to a certain keypair**

```yaml
  example-server-node:
    type: cloudify.nodes.openstack.WindowsServer
    properties:
      use_password: true
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      agent_config:
        install_method: init_script
        user: Admin
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'server' ] }
        image_id: { get_input: image }
        flavor_id: { get_input: flavor }
    relationships:
     - type: cloudify.relationships.openstack.server_connected_to_port
       target: example-port
     - type: cloudify.relationships.openstack.server_connected_to_keypair
       target: example-keypair
```


## **cloudify.nodes.openstack.ServerGroup**

This node type refers to an Openstack Server Group.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Required_. This is the user-readable name in Openstack if you want to set it.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `policies`: _List. _Required_. A list of exactly one policy name to associate with the server group. The current valid policy names are:
    * `anti-affinity`: Servers in this group must be scheduled to different hosts.
    * `affinity`: Servers in this group must be scheduled to the same host.
    * `soft-anti-affinity`: Servers in this group should be scheduled to different hosts if possible, but if not possible then they should still be scheduled instead of resulting in a build failure. This policy was added in microversion 2.15.
    * `soft-affinity`: Servers in this group should be scheduled to the same host if possible, but if not possible then they should still be scheduled instead of resulting in a build failure. This policy was added in microversion 2.15.

For more information, and possible keyword arguments, see: [create_server_group](https://developer.openstack.org/api-ref/compute/#create-server-group).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_server_group](https://developer.openstack.org/api-ref/compute/#create-server-group).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_server_group](https://developer.openstack.org/api-ref/compute/#delete-server-group).
  * `cloudify.interfaces.operations.list`:
      - Executes [list_server_groups](https://developer.openstack.org/api-ref/compute/#list-server-groups).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Server Group API method
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.

### Server Group Examples

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
        policies:
          - affinity
```

## **cloudify.nodes.openstack.Project**

This node type refers to an project.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Required_. This is the user-readable name in Openstack if you want to set it.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. Description of the project.
  * `is_domain`: _Boolean_. _Not required_. Indicates whether the project also acts as a domain.
  * `domain_id`: _String_. _Not required_. The ID of the domain for the project.
  * `parent_id`: _String_. _Not required_. The ID of the parent of the project.
  * `tags`: _String_. _Not required_. A list of simple strings assigned to a project. Tags can be used to classify projects into groups.

For more information, and possible keyword arguments, see: [create_project](https://developer.openstack.org/api-ref/identity/v3/#create-project).

**Properties**

  * `users`: _List_. _Not required._ List of users assigned to this project in the following format: `{ name: string, roles: [string] }`.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_project](https://developer.openstack.org/api-ref/identity/v3/#create-project).
  * `cloudify.interfaces.lifecycle.start`: Executes [assign_role_to_user_on_project](https://developer.openstack.org/api-ref/identity/v3/#assign-role-to-user-on-project).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_project](https://developer.openstack.org/api-ref/identity/v3/#delete-project).
  * `cloudify.interfaces.operations.update_project`:
      - Executes [update_project](https://developer.openstack.org/api-ref/identity/v3/#update-project).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update Project API method
  * `cloudify.interfaces.operations.list`:
      - Executes [list_projects](https://developer.openstack.org/api-ref/identity/v3/#list-projects).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Project API method
  * `cloudify.interfaces.operations.get_quota`: This operation will be updated in future (The current Openstack SDK does not support retrieving quota for project).
  * `cloudify.interfaces.operations.update_quota`: This operation will be updated in future (The current Openstack SDK does not support updating quota for project).          
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.


### Project Examples

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

## **cloudify.nodes.openstack.User**

This node type refers to an user.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it, or the name of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `default_project_id`: _String_. _Not required_. The ID of the default project for the user.
  * `domain_id`: _String_. _Not required_. The ID of the domain of the user.
  * `enabled`: _String_. _Not required_. If the user is enabled, this value is true. If the user is disabled, this value is false.
  * `password`: _String_. _Not required_. The password for the user.
  * `email`: _String_. _Not required_. The email for the user.

For more information, and possible keyword arguments, see: [create_user](https://developer.openstack.org/api-ref/identity/v3/#create-user).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_user](https://developer.openstack.org/api-ref/identity/v3/#create-user).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_user](https://developer.openstack.org/api-ref/identity/v3/#delete-user).
  * `cloudify.interfaces.operations.update`:
      - Executes [update_user](https://developer.openstack.org/api-ref/identity/v3/#update-user).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update User API method
  * `cloudify.interfaces.operations.list`:
      - Executes [list_users](https://developer.openstack.org/api-ref/identity/v3/#list-users).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List User API method


### User Examples

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
        default_project_id: { get_input: project_name }
        enabled: True
        password: 'test1234567890'
        email: 'test@test.com'
```

## **cloudify.nodes.openstack.FloatingIP**

This node type refers to an Openstack Floating IP.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `floating_network_id`: _String_. _Required_. The ID of the network associated with the floating IP.
  * `floating_network_name`: _String_. _Not required_. The Name of the network associated with the floating IP.
  * `fixed_ip_address`: _String_. _Not required_. The fixed IP address that is associated with the floating IP. If an internal port has multiple associated IP addresses, the service chooses the first IP address unless you explicitly define a fixed IP address in the fixed_ip_address parameter.
  * `floating_ip_address`: _String_. _Not required_. The floating IP address.
  * `port_id`: _String_. _Not required_. The ID of a port associated with the floating IP. To associate the floating IP with a fixed IP at creation time, you must specify the identifier of the internal port.
  * `subnet_id`: _String_. _Not required_. The subnet ID on which you want to create the floating IP.
  * `dns_domain`: _String_. _Not required_. A valid DNS domain.
  * `dns_name`: _String_. _Not required_. A valid DNS name.

For more information, and possible keyword arguments, see: [create_floating_ip](https://developer.openstack.org/api-ref/network/v2/#create-floating-ip).

**Properties**

  * `allow_reallocation`: _Boolean_. _Not required_. Applicable only when
  use_external_resource is true If true, then allow using this floating IP
  even if it has already been allocated to another instance. If false, and
  the floating IP is already allocated (that is, it is in 'ACTIVE' state), a
  recoverable error is raised. By Default it is `false`

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_floating_ip](https://developer.openstack.org/api-ref/network/v2/#create-floating-ip).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_floating_ip](https://developer.openstack.org/api-ref/network/v2/#delete-floating-ip).
  * `cloudify.interfaces.operations.update`:
      - Executes [update_floating_ip](https://developer.openstack.org/api-ref/network/v2/#update-floating-ip).
      - Inputs:
          - `args`: _Dictionary_. _required_. Additional key-word arguments accepted by the update Floating IP API method
  * `cloudify.interfaces.operations.list`:
      - Executes [list_floating_ips](https://developer.openstack.org/api-ref/network/v2/#list-floating-ips).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Floating IP API method

  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.openstack.Network`: Connect to a external network.
    * `cloudify.nodes.openstack.Port`: Connect to a certain port.
    * `cloudify.nodes.openstack.Subnet`: Connect to a certain subnet.


### Floating IP Examples

```yaml
  example-ip:
    type: cloudify.nodes.openstack.FloatingIP
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network
      - type: cloudify.relationships.connected_to
        target: example-server-port
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

  example-external-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      use_external_resource: true
      resource_config:
        id: { get_input: external_network_id }
        kwargs:
          routing:
            external: true

  example-router:
    type: cloudify.nodes.openstack.Router
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'router' ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

  example-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'network' ] }

  example-subnet:
    type: cloudify.nodes.openstack.Subnet
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'subnet' ] }
        cidr: { get_input: example_subnet_cidr }
        enable_dhcp: true
        ip_version: 4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-network
      - type: cloudify.relationships.openstack.subnet_connected_to_router
        target: example-router
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

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
        name: { concat: [ { get_input: name_prefix }, 'security_group' ] }
        description: 'A security group created by Cloudify OpenStack SDK plugin.'

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
        security_group_id: { get_attribute: [ example-security-group, id ] }
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-security-group
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

  example-server-port:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'server-port' ] }
        network_id: { get_attribute: [ example-network, id ] }
        fixed_ips:
          - subnet_id: { get_attribute: [ example-subnet, id ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-subnet
      - type: cloudify.relationships.connected_to
        target: example-security-group
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }
```

```yaml
  example-ip:
    type: cloudify.nodes.openstack.FloatingIP
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        floating_network_name: { get_input: external_network_name }
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }
```

```yaml
  example-ip:
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
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-server-port
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

  example-external-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      use_external_resource: true
      resource_config:
        id: { get_input: external_network_id }
        kwargs:
          routing:
            external: true

  example-router:
    type: cloudify.nodes.openstack.Router
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'router' ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

  example-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'network' ] }

  example-subnet:
    type: cloudify.nodes.openstack.Subnet
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'subnet' ] }
        cidr: { get_input: example_subnet_cidr }
        enable_dhcp: true
        ip_version: 4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-network
      - type: cloudify.relationships.openstack.subnet_connected_to_router
        target: example-router
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

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
        name: { concat: [ { get_input: name_prefix }, 'security_group' ] }
        description: 'A security group created by Cloudify OpenStack SDK plugin.'

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
        security_group_id: { get_attribute: [ example-security-group, id ] }
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-security-group
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

  example-server-port:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_input: auth_url }
        username: { get_input: username }
        password: { get_input: password }
        region_name: { get_input: region_name }
        project_name: { get_input: project_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'server-port' ] }
        network_id: { get_attribute: [ example-network, id ] }
        fixed_ips:
          - subnet_id: { get_attribute: [ example-subnet, id ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-subnet
      - type: cloudify.relationships.connected_to
        target: example-security-group
```

## **cloudify.nodes.openstack.Network**

This node type refers to an Openstack Network.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `admin_state_up`: _String_. _Not required_. The administrative state of the network, which is up (true) or down (false).

For more information, and possible keyword arguments, see: [create_network](https://developer.openstack.org/api-ref/network/v2/#create-network)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_network](https://developer.openstack.org/api-ref/network/v2/#create-network).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_network](https://developer.openstack.org/api-ref/network/v2/#delete-network).
  * `cloudify.interfaces.operations.update`:
      - Executes [update_network](https://developer.openstack.org/api-ref/network/v2/#update-network).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update Network API method
  * `cloudify.interfaces.operations.list`:
      - Executes [list_networks](https://developer.openstack.org/api-ref/network/v2/#list-networks).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Network API method
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.

### Network Examples

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
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `allowed_address_pairs`: _List_. _Not required._ A set of zero or more allowed address pair objects each where address pair object contains an ip_address and mac_address. While the ip_address is required, the mac_address will be taken from the port if not specified. The value of ip_address can be an IP Address or a CIDR (if supported by the underlying extension plugin). A server connected to the port can send a packet with source address which matches one of the specified allowed address pairs.
  * `device_id`: _String_. _Not required_. The ID of the device that uses this port. For example, a server instance or a logical router.
  * `device_owner`: _String_. _Not required_. The entity type that uses this port. For example, compute:nova (server instance), network:dhcp (DHCP agent) or network:router_interface (router interface).
  * `fixed_ips`: _List_. _Not required_. The IP addresses for the port. If you would like to assign multiple IP addresses for the port, specify multiple entries in this field. Each entry consists of IP address (ip_address) and the subnet ID from which the IP address is assigned (subnet_id).
      - If you specify both a subnet ID and an IP address, OpenStack Networking tries to allocate the IP address on that subnet to the port.
      - If you specify only a subnet ID, OpenStack Networking allocates an available IP from that subnet to the port.
      - If you specify only an IP address, OpenStack Networking tries to allocate the IP address if the address is a valid IP for any of the subnets on the specified network.
  * `network_id`: _String_. _Required_. The ID of the network to which the port belongs. Must either provide this or a relationships to a network.
  * `security_groups`: _List_. _Not required._ The IDs of security groups applied to the port. Must either provide this or a relationships to a network.

**Properties**
  * `fixed_ip`: _String_. _Not required_. Used to request a specific fixed IP for the port


For more information, and possible keyword arguments, see: [create_port](https://developer.openstack.org/api-ref/network/v2/#create-port)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_port](https://developer.openstack.org/api-ref/network/v2/#create-port).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_port](https://developer.openstack.org/api-ref/network/v2/#delete-port).
  * `cloudify.interfaces.operations.update`:
      - Executes [update_port](https://developer.openstack.org/api-ref/network/v2/#update-port).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update Port API method
  * `cloudify.interfaces.operations.list`:
      - Executes [list_ports](https://developer.openstack.org/api-ref/network/v2/#list-ports).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Port API method
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.openstack.Network`: Connect to a network.
  * `cloudify.relationships.openstack.port_connected_to_subnet`:
    * `cloudify.nodes.openstack.Subnet`: Connect to a certain subnet.
  * `cloudify.relationships.openstack.port_connected_to_security_group`:
    * `cloudify.nodes.openstack.SecurityGroup`: Connect to a certain security group.
  * `cloudify.relationships.openstack.port_connected_to_router`:
    * `cloudify.nodes.openstack.Router`: Connect to a certain router.
  * `cloudify.relationships.openstack.port_connected_to_floating_ip`:
    * `cloudify.nodes.openstack.FloatingIP`: Connect to a certain floating ip.
  * `cloudify.relationships.openstack.port_connected_to_server`:
    * `cloudify.nodes.openstack.Server`: Connect to a certain server.

### Port Examples

**Create simple port node**

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

**Create a port connected to certain network, subnet and to security group**

```yaml
  example-port:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        fixed_ips:
          - ip_address: { get_input: fixed_ip }
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-private-network
      - type: cloudify.relationships.openstack.port_connected_to_subnet
        target: example-private-subnet
      - type: cloudify.relationships.openstack.port_connected_to_security_group
        target: example-security-group

  example-security-group:
    type: cloudify.nodes.openstack.SecurityGroup
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'security-group' ] }
        description: My Test Security Group

  example-private-subnet:
    type: cloudify.nodes.openstack.Subnet
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      use_external_resource: true
      resource_config:
        id: { get_input: subnet_id }
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-private-network

  example-private-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      use_external_resource: true
      resource_config:
        id: { get_input: network_id }
```

**Create a port connected to certain network, subnet, security group and to certain floating ip**

```yaml

  example-port:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'port' ] }
        fixed_ips:
          - subnet_id: { get_attribute: [ example-subnet-1, id ] }
    relationships:
       - type: cloudify.relationships.connected_to
         target: example-security-group
       - type: cloudify.relationships.connected_to
         target: example-network
       - type: cloudify.relationships.connected_to
         target: example-subnet
       - type: cloudify.relationships.openstack.port_connected_to_floating_ip
         target: example-ip

 example-security-group:
    type: cloudify.nodes.openstack.SecurityGroup
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      security_group_rules:
        - remote_ip_prefix: 0.0.0.0/0
          port_range_max: 80
          port_range_min: 80
          direction: ingress
          protocol: tcp

        - remote_ip_prefix: 0.0.0.0/0
          port_range_max: 80
          port_range_min: 80
          direction: egress
          protocol: tcp

        - remote_ip_prefix: 0.0.0.0/0
          port_range_min: 53333
          port_range_max: 53333
          protocol: tcp
          direction: ingress

        - remote_ip_prefix: 0.0.0.0/0
          port_range_min: 53333
          port_range_max: 53333
          protocol: tcp
          direction: egress

        - remote_ip_prefix: 0.0.0.0/0
          port_range_max: 22
          port_range_min: 22
          direction: ingress
          protocol: tcp

        - remote_ip_prefix: 0.0.0.0/0
          port_range_max: 22
          port_range_min: 22
          direction: egress
          protocol: tcp
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'security-group' ] }
        description: 'A security group created by Cloudify OpenStack SDK plugin.'


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
        name: { concat: [ { get_input: name_prefix }, 'network' ] }

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
        name: { concat: [ { get_input: name_prefix }, 'subnet' ] }
        cidr: { get_input: example_subnet_cidr }
        enable_dhcp: true
        ip_version: 4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-network
      - type: cloudify.relationships.openstack.subnet_connected_to_router
        target: example-router

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
        name: { concat: [ { get_input: name_prefix }, 'router' ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network

  example-external-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      use_external_resource: true
      resource_config:
        id: { get_input: external_network_id }

  example-ip:
    type: cloudify.nodes.openstack.FloatingIP
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network
```

**Create a port connected to external server**

```yaml

  example-port:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'port' ] }
        fixed_ips:
          - subnet_id: { get_attribute: [ example-subnet-1, id ] }
    relationships:
       - type: cloudify.relationships.connected_to
         target: example-security-group
       - type: cloudify.relationships.connected_to
         target: example-network
       - type: cloudify.relationships.connected_to
         target: example-subnet
       - type: cloudify.relationships.openstack.port_connected_to_floating_ip
         target: example-ip

 example-security-group:
    type: cloudify.nodes.openstack.SecurityGroup
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      security_group_rules:
        - remote_ip_prefix: 0.0.0.0/0
          port_range_max: 80
          port_range_min: 80
          direction: ingress
          protocol: tcp

        - remote_ip_prefix: 0.0.0.0/0
          port_range_max: 80
          port_range_min: 80
          direction: egress
          protocol: tcp

        - remote_ip_prefix: 0.0.0.0/0
          port_range_min: 53333
          port_range_max: 53333
          protocol: tcp
          direction: ingress

        - remote_ip_prefix: 0.0.0.0/0
          port_range_min: 53333
          port_range_max: 53333
          protocol: tcp
          direction: egress

        - remote_ip_prefix: 0.0.0.0/0
          port_range_max: 22
          port_range_min: 22
          direction: ingress
          protocol: tcp

        - remote_ip_prefix: 0.0.0.0/0
          port_range_max: 22
          port_range_min: 22
          direction: egress
          protocol: tcp
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'security-group' ] }
        description: 'A security group created by {{< param product_name >}} OpenStack SDK plugin.'


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
        name: { concat: [ { get_input: name_prefix }, 'network' ] }

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
        name: { concat: [ { get_input: name_prefix }, 'subnet' ] }
        cidr: { get_input: example_subnet_cidr }
        enable_dhcp: true
        ip_version: 4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-network
      - type: cloudify.relationships.openstack.subnet_connected_to_router
        target: example-router

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
        name: { concat: [ { get_input: name_prefix }, 'router' ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network

  example-external-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      use_external_resource: true
      resource_config:
        id: { get_input: external_network_id }

  example-ip:
    type: cloudify.nodes.openstack.FloatingIP
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network

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
      use_external_resource: true
      resource_config:
       id: { get_input: server_id}
```

**Create dual ports (ipv4 & ipv6) connected to server**

```yaml
node_templates:

  router:
    type: cloudify.nodes.openstack.Router
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      use_external_resource: true
      resource_config:
        id: { get_input: router_name }

  network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { get_input: dual_network_name }

  ipv4_subnet:
    type: cloudify.nodes.openstack.Subnet
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        ip_version: 4
        cidr: { get_input: ipv4_subnet_cidr }
        dns_nameservers: { get_input: ipv4_nameservers }
        allocation_pools: { get_input: ipv4_allocation_pools }
    relationships:
    - type: cloudify.relationships.contained_in
      target: network
    - type: cloudify.relationships.openstack.subnet_connected_to_router
      target: router

  ipv6_subnet:
    type: cloudify.nodes.openstack.Subnet
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        ip_version: 6
        cidr: { get_input: ipv6_subnet_cidr }
        dns_nameservers: { get_input: ipv6_nameservers }
        allocation_pools: { get_input: ipv6_allocation_pools }
        ipv6_address_mode: { get_input: ipv6_address_mode }
        ipv6_ra_mode: { get_input: ipv6_ra_mode }
    relationships:
    - type: cloudify.relationships.openstack.subnet_connected_to_router
      target: router
    - type: cloudify.relationships.contained_in
      target: network

  cloudify_security_group:
    type: cloudify.nodes.openstack.SecurityGroup
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      security_group_rules:
        - remote_ip_prefix: 0.0.0.0/0
          port_range_min: null
          port_range_max: null
          protocol: icmp
          direction: ingress

        - remote_ip_prefix: 0.0.0.0/0
          port_range_min: null
          port_range_max: null
          protocol: icmp
          direction: egress

        - remote_ip_prefix: ::/0
          port_range_min: null
          port_range_max: null
          ethertype: IPv6
          protocol: icmp
          direction: ingress

        - remote_ip_prefix: ::/0
          port_range_min: null
          port_range_max: null
          ethertype: IPv6
          protocol: icmp
          direction: egress

        - remote_ip_prefix: 0.0.0.0/0
          port_range_min: 22
          port_range_max: 22
          protocol: tcp
          direction: ingress

        - remote_ip_prefix: 0.0.0.0/0
          port_range_min: 22
          port_range_max: 22
          protocol: tcp
          direction: egress

        - remote_ip_prefix: ::/0
          port_range_min: 22
          port_range_max: 22
          ethertype: IPv6
          protocol: tcp
          direction: ingress

        - remote_ip_prefix: ::/0
          port_range_min: 22
          port_range_max: 22
          ethertype: IPv6
          protocol: tcp
          direction: egress

  dual_port:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
    relationships:
    - type: cloudify.relationships.contained_in
      target: network
    - type: cloudify.relationships.depends_on
      target: ipv4_subnet
    - type: cloudify.relationships.depends_on
      target: ipv6_subnet
    - type: cloudify.relationships.openstack.port_connected_to_security_group
      target: cloudify_security_group

  dual_port2:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
    relationships:
    - type: cloudify.relationships.contained_in
      target: network
    - type: cloudify.relationships.depends_on
      target: ipv4_subnet
    - type: cloudify.relationships.depends_on
      target: ipv6_subnet
    - type: cloudify.relationships.openstack.port_connected_to_security_group
      target: cloudify_security_group

  host:
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
        name: host_1
        key_name: { get_input: key_name }
        image_id: { get_input: centos_image }
        flavor_id: { get_input: flavor }
    relationships:
    - type: cloudify.relationships.openstack.server_connected_to_port
      target: dual_port

  host_2:
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
        name: host_2
        key_name: { get_input: key_name }
        image_id: { get_input: centos_image }
        flavor_id: { get_input: flavor }
    relationships:
    - type: cloudify.relationships.openstack.server_connected_to_port
      target: dual_port2


outputs:
  # Ipv4 & ipv6 also available from server instance
  ipv4-from-server-1:
    value: { get_attribute: [ host, ipv4_address ] }
  ipv6-from-server-1:
    value: { get_attribute: [ host, ipv6_address ] }
  ipv4-from-server-2:
    value: { get_attribute: [ host_2, ipv4_address ] }
  ipv6-from-server-2:
    value: { get_attribute: [ host_2, ipv6_address ] }

  # Ipv4 & ipv6 also available from port instance
  ipv4-from-dual-port:
    value: { get_attribute: [ dual_port, ipv4_address ] }
  ipv6-from-dual-port:
    value: { get_attribute: [ dual_port, ipv6_address ] }
  ipv4-from-dual-port-2:
    value: { get_attribute: [ dual_port2, ipv4_address ] }
  ipv6-from-dual-port-2:
    value: { get_attribute: [ dual_port2, ipv6_address ] }

```

## **cloudify.nodes.openstack.RBACPolicy**

This node type refers to an Openstack RBAC Policy.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `target_tenant`: _String_. _Required_. The ID of the tenant to which the RBAC policy will be enforced.
  * `object_type`: _String_. _Required_. The type of the object that the RBAC policy affects. Types include qos-policy or network.
  * `object_id`: _String_. _Required_. The ID of the object_type resource. An object_type of network returns a network ID and an object_type of qos-policy returns a QoS ID.
  * `action`: _String_. _Required_. Action for the RBAC policy which is access_as_external or access_as_shared.

For more information, and possible keyword arguments, see: [create_rbac_policy](https://developer.openstack.org/api-ref/network/v2/#create-rbac-policy)

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_rbac_policy](https://developer.openstack.org/api-ref/network/v2/#create-rbac-policy).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_rbac_policy](https://developer.openstack.org/api-ref/network/v2/#delete-rbac-policy).
  * `cloudify.interfaces.operations.update`:
      - Executes [update_rbac_policy](https://developer.openstack.org/api-ref/network/v2/#update-rbac-policy).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update RBAC policy API method
  * `cloudify.interfaces.operations.list`:
      - Executes [list_rbac_policies](https://developer.openstack.org/api-ref/network/v2/#list-rbac-policies).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List RBAC policy API method

  * `cloudify.interfaces.operations.find_and_delete`:
      - This operation find certain RBAC policy and delete it.
        This operation could be helpful to delete RBACPolicy object which is automatically created during network creation by Openstack
      - Inputs:
          - `args`: _Dictionary_. _Not required_. Key-word arguments used to override RBAC resource config
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.

**Relationships**

  * `cloudify.relationships.openstack.rbac_policy_applied_to`:
    * `cloudify.nodes.openstack.Network`: Apply RBAC policy to certain network.

### RBAC Policy Example

**Create RBAC policy and apply it to certain network**

**Note: If there are some subnets connected to network with enabled DHCP, then `disable_dhcp` must be provided in order to disable it before delete RBAC policy**

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

  example-external-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      use_external_resource: true
      resource_config:
        id: { get_input: external_network_id }

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
        name: { concat: [ { get_input: name_prefix }, 'router' ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

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
        name: { concat: [ { get_input: name_prefix }, 'network' ] }

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
        name: { concat: [ { get_input: name_prefix }, 'subnet' ] }
        cidr: { get_input: example_subnet_cidr }
        enable_dhcp: true
        ip_version: 4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-network
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

  example-security-group:
    type: cloudify.nodes.openstack.SecurityGroup
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'security_group' ] }
        description: 'A security group created by {{< param product_name >}} OpenStack SDK plugin.'

  example-security-group-rule:
    type: cloudify.nodes.openstack.SecurityGroupRule
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        direction: ingress
        protocol: tcp
        port_range_max: 22
        port_range_min: 22
        security_group_id: { get_attribute: [ example-security-group, id ] }
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-security-group
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }

  example-port:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'port' ] }
        network_id: { get_attribute: [ example-network, id ] }
        fixed_ips:
          - subnet_id: { get_attribute: [ example-subnet, id ] }
            ip_address: { get_input: example_fixed_ip }
        device_id: { get_attribute: [ example-router, id ] }
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-subnet
      - type: cloudify.relationships.connected_to
        target: example-router
      - type: cloudify.relationships.connected_to
        target: example-security-group
    # This is only run on local mode. For use with a manager, it can be commented out.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            resource_config: { get_property: [ SELF, resource_config ] }
```

**Delete RBACPolicy object which is automatically created during network creation by Openstack**

```yaml

  example-external-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        id: { get_input: external_network_id }
        kwargs:
          "router:external": true

  example-rbac-policy-removal:
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        target_tenant: '*'
        action: access_as_external
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: openstack.openstack_plugin.resources.network.rbac_policy.find_and_delete
          inputs:
            args: {}
        delete:
          implementation: ~
    relationships:
      - type: cloudify.relationships.openstack.rbac_policy_applied_to
        target: example-external-network

  example-rbac-policy:
    type: cloudify.nodes.openstack.RBACPolicy
    properties:
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
        target: example-external-network

  example-subnet:
    type: cloudify.nodes.openstack.Subnet
    properties:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'subnet' ] }
        cidr: { get_input: example_subnet_cidr }
        enable_dhcp: true
        ip_version: 4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-external-network
```

## **cloudify.nodes.openstack.Router**

This node type refers to an Openstack Router.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.

**Properties**
  * `external_network`: _String_. _Not required_. An external network name or ID. If given, the router will use this external network as a gateway


**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_router](https://developer.openstack.org/api-ref/network/v2/#create-router).
  * `cloudify.interfaces.lifecycle.delete`: Executes [create_router](https://developer.openstack.org/api-ref/network/v2/#delete-router).
  * `cloudify.interfaces.lifecycle.start`:
      - Add static routes to router table by executing [update_router](https://developer.openstack.org/api-ref/network/v2/#update-router).
      - Inputs:
          - `routes`: _List_. _required_. List of routes accepted by the update Router API method
  * `cloudify.interfaces.lifecycle.stop`: Remove static routes from router table by executing [update_router](https://developer.openstack.org/api-ref/network/v2/#update-router).
  * `cloudify.interfaces.operations.update`:
      - Executes [update_router](https://developer.openstack.org/api-ref/network/v2/#update-router).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update Router API method
  * `cloudify.interfaces.operations.list`:
      - Executes [list_routers](https://developer.openstack.org/api-ref/network/v2/#list-routers).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Router API method
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.


**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.openstack.Network`: Connect router to a certain network.

### Router Examples

**Create a Router connected to a certain external network**

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
        name: { concat: [ { get_input: name_prefix }, 'router' ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network
```

**Add static routes to the Router connected to a certain external network**

```yaml
  example-external-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      use_external_resource: true
      resource_config:
        id: { get_input: external_network_id }

  example-routes:
    type: cloudify.nodes.openstack.Router
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      use_external_resource: true
      resource_config:
        id: { get_attribute: [ example-router, id ] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: example-subnet-1
      - type: cloudify.relationships.depends_on
        target: example-subnet-2
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          inputs:
            routes:
              - destination: 10.10.4.0/24
                nexthop: 192.168.123.123

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
        name: { concat: [ { get_input: name_prefix }, 'router' ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network

  example-network-1:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'network_1' ] }

  example-network-2:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'network_2' ] }

  example-subnet-1:
    type: cloudify.nodes.openstack.Subnet
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'subnet_1' ] }
        cidr: { get_input: example_subnet_1_cidr }
        enable_dhcp: true
        ip_version: 4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-network-1
      - type: cloudify.relationships.openstack.subnet_connected_to_router
        target: example-router

  example-subnet-2:
    type: cloudify.nodes.openstack.Subnet
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'subnet_2' ] }
        cidr: { get_input: example_subnet_2_cidr }
        enable_dhcp: true
        ip_version: 4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-network-2
      - type: cloudify.relationships.openstack.subnet_connected_to_router
        target: example-router
```

## **cloudify.nodes.openstack.SecurityGroup**

This node type refers to an Openstack security group.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. Rquired_. This is the user-readable name in Openstack if you want to set it.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. Resource description

For more information, and possible keyword arguments, see: [create_security_group](https://developer.openstack.org/api-ref/network/v2/#create-security-group).

**Properties**

  * `security_group_rules`: _List_. _Not required_. A list of security group rules.
  * `disable_default_egress_rules`: _Boolean_. _Not required_. A flag for removing the default rules. If not set to `true`, these rules will remain, and exist alongside any additional rules passed using the `security_group_rules` property.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_security_group](https://developer.openstack.org/api-ref/network/v2/#create-security-group).
  * `cloudify.interfaces.lifecycle.configure`:
      - Executes [delete_security_group_rule](https://developer.openstack.org/api-ref/network/v2/#delete-security-group-rule) in order to remove the default rules when `disable_default_egress_rules` is enabled
      - Executes [create_security_group_rule](https://developer.openstack.org/api-ref/network/v2/#create-security-group-rule) in order to add rules when `security_group_rules` is provided
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_security_group](https://developer.openstack.org/api-ref/network/v2/#delete-security-group).
  * `cloudify.interfaces.operations.update`:
      - Executes [update_security_group](https://developer.openstack.org/api-ref/network/v2/#update-security-group).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update Security Group API method
  * `cloudify.interfaces.operations.list`:
      - Executes [list_security_groups](https://developer.openstack.org/api-ref/network/v2/#list-security-groups).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Security Group API method
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.

### Security Group Examples

**Create a Security Group with rules**

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

**Create a Security Group with rules and clean default created rules**

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
      disable_default_egress_rules: true
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
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `remote_group_id`: _String_. _Not required_. The remote group UUID to associate with this security group rule. You can specify either the remote_group_id or remote_ip_prefix attribute in the request body.
  * `protocol`: _String_. _Not required_. The IP protocol of the security group rule.
  * `direction`: _String_. _Not required_. Ingress or egress, which is the direction in which the security group rule is applied.
  * `port_range_min`: _Integer_. _Not required_. The minimum port number in the range that is matched by the security group rule. If the protocol is TCP, UDP, DCCP, SCTP or UDP-Lite this value must be less than or equal to the port_range_max attribute value. If the protocol is ICMP, this value must be an ICMP type.
  * `port_range_max`: _Integer_. _Not required_. The maximum port number in the range that is matched by the security group rule. If the protocol is TCP, UDP, DCCP, SCTP or UDP-Lite this value must be greater than or equal to the port_range_min attribute value. If the protocol is ICMP, this value must be an ICMP type.
  * `security_group_id`: _String_. Required_. The security group ID to associate with this security group rule.
  * `remote_ip_prefix`: _String_. _Not required_. The security group ID to associate with this security group rule.The remote IP prefix that is matched by this security group rule.

For more information, and possible keyword arguments, see: [create_security_group_rule](https://developer.openstack.org/api-ref/network/v2/#create-security-group-rule).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_security_group_rule](https://developer.openstack.org/api-ref/network/v2/#create-security-group-rule).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_security_group_rule](https://developer.openstack.org/api-ref/network/v2/#delete-security-group-rule).
  * `cloudify.interfaces.operations.list`:
      - Executes [list_security_group_rules](https://developer.openstack.org/api-ref/network/v2/#list-security-group-rules).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Security Group Rule API method
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.


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
  * `cloudify.interfaces.operations.update`:
      - Executes [update_subnet](https://developer.openstack.org/api-ref/network/v2/#update-subnet).
      - Inputs:
          - `args`: _Dictionary_. _required_. Key-word arguments accepted by the update Subnet API method

  * `cloudify.interfaces.operations.list`:
      - Executes [list_subnets](https://developer.openstack.org/api-ref/network/v2/#list-subnets).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Subnet API method
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.


**Relationships**

  * `cloudify.relationships.contained_in`:
    * `cloudify.nodes.openstack.Network`: Connect subnet to a certain network.
  * `cloudify.relationships.openstack.subnet_connected_to_router`:
    * `cloudify.nodes.openstack.Router`: Connect subnet to a certain router.

### Subnet Examples

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

## **cloudify.nodes.openstack.Volume**

This node type refers to an Openstack Volume.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Not required_. This is the user-readable name in Openstack if you want to set it.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. A description of the volume.
  * `project_id`: _String_. _Not required_. The UUID of the project in a multi-tenancy cloud.
  * `size`: _Integer. _Not required_. The size of the volume, in gibibytes (GiB), for example `10` for "10 GB".
  * `availability_zone`: _String_. _Not required_. The name of the availability zone.
  * `imageRef`: _String_. _Not required_. The UUID of the image from which you want to create the volume. Required to create a bootable volume.
  * `snapshot_id`: _String_. _Not required_. To create a volume from an existing snapshot, specify the UUID of the volume snapshot. The volume is created in same availability zone and with same size as the snapshot.
  * `volume_type`: _String_. _Not required_. The volume type (either name or ID). To create an environment with multiple-storage back ends, you must specify a volume type. Block Storage volume back ends are spawned as children to cinder- volume, and they are keyed from a unique queue. They are named cinder- volume.HOST.BACKEND. For example, cinder- volume.ubuntu.lvmdriver. When a volume is created, the scheduler chooses an appropriate back end to handle the request based on the volume type. Default is None. For information about how to use volume types to create multiple-storage back ends.

For more information, and possible keyword arguments, see: [create_volume](https://developer.openstack.org/api-ref/block-storage/v2/#create-volume)

**Properties**

  * `device_name`: The server device to mount the VM on.

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_volume](https://developer.openstack.org/api-ref/block-storage/v2/#create-volume).
  * `cloudify.interfaces.lifecycle.start`: Executes [get_volume](https://developer.openstack.org/api-ref/block-storage/v2/#show-volume-details) in order to check if the volume ready to use or not.
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_volume](https://developer.openstack.org/api-ref/block-storage/v2/#delete-volume).
  * `cloudify.interfaces.snapshot.create`:
      - This operation supports two types of backup:
          1. Backup: Executes [create_backup](https://developer.openstack.org/api-ref/block-storage/v2/#create-backup).
          2. Snapshot: Executes [create_snapshot](https://developer.openstack.org/api-ref/block-storage/v2/#create-snapshot).
      - Inputs:
          - `snapshot_name`: Backup name. Name of resulted object is something like `<object type>-<original object id>-<backup |increment>-<name>`
          - `snapshot_incremental`: Create incremental snapshots or full backup.If `snapshot_incremental`  is `true` - code will try to
             create snapshot of object otherwise code will try to create copy of VM as image
          - `snapshot_type`: The backup type, like 'daily' or 'weekly'

  * `cloudify.interfaces.snapshot.apply`: Restore only supports `Backup` type. `Snapshot` type is not supported
      - Executes [restore_backup](https://developer.openstack.org/api-ref/block-storage/v2/#restore-backup)
      - Inputs:
          - `snapshot_name`: Backup name.
          - `snapshot_incremental`: Restore from incremental snapshots or full backup
  * `cloudify.interfaces.snapshot.delete`:
      - This operation supports delete two types of backup:
          1. Backup: Executes [delete_backup](https://developer.openstack.org/api-ref/block-storage/v2/#delete-backup).
          2. Snapshot: Executes [delete_snapshot](https://developer.openstack.org/api-ref/block-storage/v2/?expanded=delete-snapshot-detail#delete-snapshot).
      - Inputs:
          - `snapshot_name`: Backup name.
          - `snapshot_incremental`: Restore from incremental snapshots or full backup
  * `cloudify.interfaces.operations.list`:
      - Executes [list_volumes](https://developer.openstack.org/api-ref/block-storage/v2/#list-volumes).
      - Inputs:
          - `query`: _Dictionary_. _Not required_. Key-word arguments accepted by the List Volume API method
  * `cloudify.interfaces.validation.creation`: This operation verifies that there is sufficient quota to allocate a new resource of the specified type.

**Relationships**

  * `cloudify.relationships.depends_on`:
    * `cloudify.nodes.openstack.Image`: Create volume from certain image.
  * `cloudify.relationships.openstack.volume_attached_to_server`:
    * `cloudify.nodes.openstack.Server`: Attach volume to a certain server.

### Volume Examples

**Attach volumes to certain server**

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
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'volume_1' ] }
        description: 'Example Volume Size 1'
        project_id: { get_input: project_id }
        size: { get_input: volume1_size }
    relationships:
      - type: cloudify.relationships.openstack.volume_attached_to_server
        target: example-server

  example-volume-2:
    type: cloudify.nodes.openstack.Volume
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'volume_2' ] }
        description: 'Example Volume Size 2'
        project_id: { get_input: project_id }
        size: { get_input: volume2_size }
    relationships:
      - type: cloudify.relationships.openstack.volume_attached_to_server
        target: example-server

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
        name: { concat: [ { get_input: name_prefix }, 'server' ] }
        image_id: { get_input: image }
        flavor_id: { get_input: flavor }
        availability_zone: nova
    relationships:
      - type: cloudify.relationships.openstack.server_connected_to_keypair
        target:  example-keypair
      - type: cloudify.relationships.openstack.server_connected_to_port
        target: example-public-port

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
        name: { concat: [ { get_input: name_prefix }, 'keypair' ] }

  example-public-port:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'public_port' ] }
        fixed_ips:
          - subnet_id: { get_attribute: [ example-public-subnet, id ] }
    relationships:
       - type: cloudify.relationships.contained_in
         target: example-public-network
       - type: cloudify.relationships.depends_on
         target: example-public-subnet
       - type: cloudify.relationships.connected_to
         target: example-security-group
       - type: cloudify.relationships.openstack.port_connected_to_floating_ip
         target: example-floating-ip-address

  example-public-subnet:
    type: cloudify.nodes.openstack.Subnet
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'public_subnet' ] }
        cidr: { get_input: example_public_subnet_cidr }
        ip_version: 4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-public-network
      - type: cloudify.relationships.openstack.subnet_connected_to_router
        target: example-router

  example-public-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'public_network' ] }

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
        name: { concat: [ { get_input: name_prefix }, 'router' ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network

  example-external-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      use_external_resource: true
      resource_config:
        id: { get_input: external_network_id }

  example-security-group:
    type: cloudify.nodes.openstack.SecurityGroup
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      security_group_rules: { get_input: security_group_rules }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'security_group' ] }
        description: 'A security group for openstack boot volume'

  example-floating-ip-address:
    type: cloudify.nodes.openstack.FloatingIP
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network
```

**Boot Server from Volume**

```yaml
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
        flavor_id: { get_input: flavor }
        availability_zone: nova
    relationships:
      - type: cloudify.relationships.openstack.server_connected_to_keypair
        target:  example-keypair
      - type: cloudify.relationships.openstack.server_connected_to_port
        target: example-public-port
      - type: cloudify.relationships.depends_on
        target: example-volume

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
        name: { concat: [ { get_input: name_prefix }, 'keypair' ] }

   example-public-port:
    type: cloudify.nodes.openstack.Port
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'public_port' ] }
        fixed_ips:
          - subnet_id: { get_attribute: [ example-public-subnet, id ] }
    relationships:
       - type: cloudify.relationships.contained_in
         target: example-public-network
       - type: cloudify.relationships.depends_on
         target: example-public-subnet
       - type: cloudify.relationships.connected_to
         target: example-security-group
       - type: cloudify.relationships.openstack.port_connected_to_floating_ip
         target: example-floating-ip-address

  example-volume:
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
        size: { get_input: volume1_size }
        imageRef: { get_input: image }

  example-public-subnet:
    type: cloudify.nodes.openstack.Subnet
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'public_subnet' ] }
        cidr: { get_input: example_public_subnet_cidr }
        ip_version: 4
    relationships:
      - type: cloudify.relationships.contained_in
        target: example-public-network
      - type: cloudify.relationships.openstack.subnet_connected_to_router
        target: example-router

  example-public-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'public_network' ] }

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
        name: { concat: [ { get_input: name_prefix }, 'router' ] }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network

  example-external-network:
    type: cloudify.nodes.openstack.Network
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      use_external_resource: true
      resource_config:
        id: { get_input: external_network_id }

  example-security-group:
    type: cloudify.nodes.openstack.SecurityGroup
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
      security_group_rules: { get_input: security_group_rules }
      resource_config:
        name: { concat: [ { get_input: name_prefix }, 'security_group' ] }
        description: 'A security group for openstack boot volume'

  example-floating-ip-address:
    type: cloudify.nodes.openstack.FloatingIP
    properties:
      client_config:
        auth_url: { get_secret: auth_url }
        username: { get_secret: username }
        password: { get_secret: password }
        project_name: { get_secret: project_name }
        region_name: { get_input:  region_name }
    relationships:
      - type: cloudify.relationships.connected_to
        target: example-external-network
```

## **cloudify.nodes.openstack.VolumeType**

This node type refers to a volume type.

**Resource Config**

  * `id`: _String_. _Not required_. This is the Openstack ID of an existing resource if _use_external_resource_ is set to _true_.
  * `name`: _String_. _Required_. This is the user-readable name in Openstack if you want to set it.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. A description of the volume type.
  * `project_id`: _String_. _Not required_. The UUID of the project in a multi-tenancy cloud.
  * `extra_specs`: _Dictionary_. _Not required_. A key and value pair that contains additional specifications that are associated with the volume type Examples include capabilities, capacity, compression, and so on, depending on the storage driver in use.

For more information, and possible keyword arguments, see: [create_volume_type](https://developer.openstack.org/api-ref/block-storage/v3/index.html?expanded=create-a-volume-type-detail#volume-types-types).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_volume_type](https://developer.openstack.org/api-ref/block-storage/v3/index.html?expanded=create-a-volume-type-detail#volume-types-types)
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_volume_type](https://developer.openstack.org/api-ref/block-storage/v3/#delete-a-volume-type).

### Volume Type Examples

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


## **cloudify.nodes.openstack.Zone**

This node type refers to Designate Zone.

**Resource Config**

  * `name`: _String_. _Required_. DNS Name for the zone.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `type`: _String_. _Not required_. Type of zone. PRIMARY is controlled by Designate, SECONDARY zones are slaved from another DNS Server -Defaults to PRIMARY-.
  * `description`: _String_. _Not required_. Description for this zone.
  * `ttl`: _Integer_. _Not required_. TTL (Time to Live) for the zone.
  * `email`: _String_. _Required_. e-mail for the zone. Used in SOA records for the zone.
  * `masters`: _String_. _Not required_. Mandatory for secondary zones. The servers to slave from to get DNS information.
  * `attributes`: _Dictionary_. _Not required_. Key:Value pairs of information about this zone, and the pool the user would like to place the zone in. This information can be used by the scheduler to place zones on the correct pool.

For more information, and possible keyword arguments, see: [create_zone](https://docs.openstack.org/api-ref/dns/?expanded=create-zone-detail).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_zone](https://docs.openstack.org/api-ref/dns/?expanded=create-zone).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_zone](https://docs.openstack.org/api-ref/dns/?expanded=delete-zone).


### Zone Examples

```yaml
  example-zone:
    type: cloudify.nodes.openstack.Zone
    properties:
      client_config: *openstack_config
      resource_config:
        name: "my_zone.com."
        description: "Testing Designate Zone"
        ttl: 7200
        email: test@my_zone.com
        type: PRIMARY
```


## **cloudify.nodes.openstack.RecordSet**

This node type refers to Designate Zone RecordSet.

**Resource Config**

  * `name`: _String_. _Required_. DNS Name for the recordset.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `type`: _String_. _Required_. They RRTYPE of the recordset.
  * `description`: _String_. _Not required_. Description for this RecordSet.
  * `ttl`: _Integer_. _Not required_. TTL (Time to Live) for the recordset.
  * `zone_id`: _String_. _Required_. ID for the zone.
  * `records`: _List_. _Required_. A list of data for this recordset. Each item will be a separate record in Designate These items should conform to the DNS spec for the record type - e.g. A records must be IPv4 addresses, CNAME records must be a hostname.

For more information, and possible keyword arguments, see: [create_recordset](https://docs.openstack.org/api-ref/dns/?expanded=create-recordset-detail).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_recordset](https://docs.openstack.org/api-ref/dns/?expanded=create-recordset).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_recordset](https://docs.openstack.org/api-ref/dns/?expanded=delete-recordset).


### RecordSet Examples

```yaml
  example-recordset:
    type: cloudify.nodes.openstack.RecordSet
    properties:
      client_config: *openstack_config
      resource_config:
        name: "www.my_zone.com."
        description: "Testing Designate Zone ReordSet"
        ttl: 3200
        zone_id: { get_input: example-zone-id}
        type: A
        records:
          - 192.168.1.1
          - 192.168.2.1
```


## **cloudify.nodes.openstack.SharedFileSystem**

This node type refers to Manila File Share.

**Resource Config**

  * `name`: _String_. _Required_. The share name.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. Description for this share.
  * `size`: _Integer_. _Required_. The share size in GB.
  * `share_proto`: _String_. Share file system type, for example `nfs`.
  * `share_type`: _String_. The share type name. If you omit this parameter, the default share type is used. To view the default share type set by the administrator, issue a list default share types request. You cannot specify both the share_type and volume_type parameters.
  * `share_network`: _String_. The network share. Prefer to use the `cloudify.relationships.openstack.share_connected_to_network_share` relationship instead.

For more information, and possible keyword arguments, see: [create_share](https://docs.openstack.org/api-ref/shared-file-system/?expanded=create-share-detail).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_share](https://docs.openstack.org/api-ref/shared-file-system/?expanded=create-share).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_share](https://docs.openstack.org/api-ref/shared-file-system/?expanded=delete-share).

**Relationships**

  * `cloudify.relationships.openstack.share_connected_to_network_share`: Create the share in a particular network share.
  * `cloudify.relationships.openstack.share_connected_to_server`: Permit a server to access a share.
  * `cloudify.relationships.openstack.share_connected_to_subnet`: Create a share in a particular subnet and permit the subnet to expose the share.

### Share Examples

```yaml
  share:
    type: cloudify.nodes.openstack.SharedFileSystem
    properties:
      client_config:
        <<: *openstack_config
        <<: *compute_config
      resource_config:
        size: 1
        share_proto: nfs
    relationships:
      - type: cloudify.relationships.openstack.share_connected_to_network_share
        target: share_network
```


## **cloudify.nodes.openstack.NetworkShare**

This node type refers to Manila Network Share.

**Resource Config**

  * `name`: _String_. _Required_. The share name.
  * `kwargs`: _Dictionary_. _Not required_. Additional key-word arguments accepted by the API method, if not exposed in the _resource_config_ by name.
  * `description`: _String_. _Not required_. Description for this share.
  * `neutron_net_id`: _String_. Prefer to use `cloudify.relationships.openstack.network_share_connected_to_network` to fill this parameter instead of providing a static value here.
  * `neutron_subnet_id`: _String_. Prefer to use `cloudify.relationships.openstack.network_share_connected_to_subnet` to fill this parameter instead of providing a static value here.
  * `availability_zone`: _String_. Provide the availability zone.

For more information, and possible keyword arguments, see: [create_network_share](https://docs.openstack.org/api-ref/shared-file-system/?expanded=create-share-network-detail).

**Operations**

  * `cloudify.interfaces.lifecycle.create`: Executes [create_network_share](https://docs.openstack.org/api-ref/shared-file-system/#create-share-network).
  * `cloudify.interfaces.lifecycle.delete`: Executes [delete_network_share](https://docs.openstack.org/api-ref/shared-file-system/#delete-share-network).

**Relationships**

  * `cloudify.relationships.openstack.network_share_connected_to_network`: Create a network share in a particular network.
  * `cloudify.relationships.openstack.network_share_connected_to_subnet`: Create a network share in a particular subnet.

### Network Share Examples

```yaml
  share_network:
    type: cloudify.nodes.openstack.NetworkShare
    properties:
      client_config:
        <<: *openstack_config
        <<: *compute_config
    relationships:
      - type: cloudify.relationships.openstack.network_share_connected_to_network
        target: network
      - type: cloudify.relationships.openstack.network_share_connected_to_subnet
        target: subnet
```
