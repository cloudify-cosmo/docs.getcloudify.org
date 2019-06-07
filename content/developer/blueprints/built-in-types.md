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
