---
layout: bt_wiki
title: Built-in Node Types
category: Blueprints
draft: false
weight: 550
aliases: /blueprints/built-in-types/
---

# Abstract Types

The following `node_types` are basic types from which concrete types with specific plugin implementations are derived.

* `cloudify.nodes.Root` - The base type for all built-in types. Declares the following interfaces:

  - `cloudify.interfaces.lifecycle`: An interface for standard life cycle operations (e.g. create, start, stop, etc.). Operations of this interface are called from the [built-in]({{< relref "working_with/workflows/built-in-workflows.md" >}}) [*install*]({{< relref "working_with/workflows/built-in-workflows.md#the-install-workflow" >}}) and [*uninstall*]({{< relref "working_with/workflows/built-in-workflows.md#the-uninstall-workflow" >}}) workflows.
  - `cloudify.interfaces.validation`: An interface for pre-creation and pre-deletion validation operations. These can be called by using the [*execute_operation*]({{< relref "working_with/workflows/built-in-workflows.md#the-execute-operation-workflow" >}}) built-in workflow or by a [custom workflow]({{< relref "working_with/workflows/creating-your-own-workflow.md" >}}).
  - `cloudify.interfaces.monitoring`: An interface for monitoring configuration. Operations of this interface are called from the [built-in]({{< relref "working_with/workflows/built-in-workflows.md" >}}) [*install*]({{< relref "working_with/workflows/built-in-workflows.md#the-install-workflow" >}}) and [*uninstall*]({{< relref "working_with/workflows/built-in-workflows.md#the-uninstall-workflow" >}}) workflows.

* `cloudify.nodes.Tier` - A marker for a future scale group.

* `cloudify.nodes.Compute` - A compute resource. Either a virtual or a physical host.


* `cloudify.nodes.Container` - A logical partition in a host such as [Linux container](http://en.wikipedia.org/wiki/LXC) or [Docker](https://www.docker.io/).

* `cloudify.nodes.Network` - A virtual network.

* `clouydify.nodes.Subnet` - A virtual segment of an IP addresses in a network.

* `cloudify.nodes.Router` - A virtual layer 3 router.

* `cloudify.nodes.Port` - An entry in a virtual subnet. Can be used in some Clouds to secure a static private IP.

* `cloudify.nodes.VirtualIP` - A virtual IP implemented as [NAT](http://en.wikipedia.org/wiki/Network_address_translation), or in another manner.

* `cloudify.nodes.SecurityGroup` - A Cloud security group. (VM network access rules)

* `cloudify.nodes.LoadBalancer` - A virtualized load balancer.

* `cloudify.nodes.Volume` - A persistent block storage volume.

* `cloudify.nodes.FileSystem` - A writable file system. This type must be used in conjunction with a `cloudify.nodes.Volume` type and a `cloudify.nodes.Compute` type.
    * relationships: The conjunction stated above is expressed by specifying two mandatory relationships for the file system.
        * `cloudify.relationships.file_system_depends_on_volume` - Used to format and partition the file system on top of the volume. It creates a single partition occupying the entire capacity of the volume.
        * `cloudify.relationships.file_system_contained_in_compute` - Used to mount and unmount the file system from the server.
    * properties:
        * `use_external_resource` - Enables the use of already formatted volumes. In this case, the formatting part is skipped, and only a mount point id created. Defaults to False. (Boolean)
        * `partition_type` - The partition type. Defaults to 83 which is a Linux native partition. (Integer)
        * `fs_type` - The type of the File System. Supported types are: `ext2`, `ext3`, `ext4`, `fat`, `ntfs`, `swap`
        * `fs_mount_path` - The path of the mount point.
    * Example Usage:
        {{< highlight  yaml >}}
          volume_fs:
            type: cloudify.nodes.FileSystem
            properties:
              fs_type: ext4
              fs_mount_path: /mount-path
            relationships:
              - type: cloudify.relationships.file_system_depends_on_volume
                target: volume
              - type: cloudify.relationships.file_system_contained_in_compute
                target: vm
        {{< /highlight >}}


* `cloudify.nodes.ObjectStorage` - A BLOB storage segment.

* `cloudify.nodes.SoftwareComponent` - A base type for all middleware level types.

* `cloudify.nodes.WebServer` - A Web server.
    * properties:
        * `port` - The Webserver port.

* `cloudify.nodes.ApplicationServer` - An application server.

* `cloudify.nodes.DBMS` - A database.

* `cloudify.nodes.MessageBugServer` - A message BUS server.

* `cloudify.nodes.ApplicationModule` - A base type for any application module or artifact.

* `cloudify.nodes.Component` - A base type that represents a connection to a separate deployment unit, which is a part from an application architecture and deployment lifecycle. 
    * properties:
        * `resource_config`:
            * `blueprint`:
                * `external_resource`: Optional, reuse already existed blueprint, by default `False`
                * `id`: This is the blueprint ID that the Component's node is connected to.
                * `blueprint_archive`: blueprint source (ignored, if `external_resource` == `True`)
                * `main_file_name`: The application blueprint filename. If the blueprint consists many imported files this is the main blueprint.
            * `deployment`:
                * `id`: This is the deployment ID that the Component's node is connected to.
                * `inputs`: Optional, The inputs to the deployment.
                * `logs`: This is a flag for logs and events redirect from the deployment, by default true.
                * `auto_inc_suffix`: Optional, will add a suffix to the given deployment ID in the form of an auto incremented index. 
            * `executions_start_args`: Optional, params for executions.
        * `client`: Cloudify HTTP client configuration, if empty the current Cloudify manager client will be used.
            * `host`: Host of Cloudify's manager machine.
            * `port`: Port of REST API service on Cloudify's management machine.
            * `protocol`: Protocol of REST API service on management machine, defaults to http.
            * `api_version`: Version of Cloudify REST API service.
            * `headers`: Headers to be added to HTTP requests.
            * `query_params`: Query parameters to be added to the HTTP request.
            * `cert`: Path on the Cloudify manager to a copy of the other Cloudify manager's certificate.
            * `trust_all`: If False, the server's certificate (self-signed or not) will be verified.
            * `username`: Cloudify user username.
            * `password`: Cloudify user password.
            * `token`: Cloudify user token.
            * `tenant`: Cloudify user accessible tenant name.
        * `plugins`: Optional, dictionary of plugins to upload,
                     which each plugin is in format of:
                        plugin-name:
                          wagon_path: Url for plugin wagon file,
                          plugin_yaml_path: Url for plugin yaml file
        * `secrets`: Optional, dictionary of secrets to set before deploying Components,
                     which each secret is in format of:
                        secret-name: value

* `cloudify.nodes.SharedResource` - A base type that represents a connection to a separate deployed unit of a resource (shared DB service, filesystem, etc), which is consumed and required by the deployment. 
    * properties:
      * `resource_config`:
        * `deployment`:
            * `id`: This is the deployment ID that the SharedResource's node is connected to.
      * `client`: Cloudify HTTP client configuration, if empty the current Cloudify manager client will be used.
        * `host`: Host of Cloudify's manager machine.
        * `port`: Port of REST API service on Cloudify's management machine.
        * `protocol`: Protocol of REST API service on management machine, defaults to http.
        * `api_version`: Version of Cloudify REST API service.
        * `headers`: Headers to be added to HTTP requests.
        * `query_params`: Query parameters to be added to the HTTP request.
        * `cert`: Path on the Cloudify manager to a copy of the other Cloudify manager's certificate.
        * `trust_all`: If False, the server's certificate (self-signed or not) will be verified.
        * `username`: Cloudify user username.
        * `password`: Cloudify user password.
        * `token`: Cloudify user token.
        * `tenant`: Cloudify user accessible tenant name.