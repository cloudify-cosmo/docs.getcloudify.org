---
layout: bt_wiki
title: Built-in Node Types
category: Blueprints
draft: false
weight: 550

---

# Abstract Types
The following `node_types` are basic types from which concrete types with specific plugin implementations are derived.

* `cloudify.nodes.Root` - The base type for all built-in types. declares the following interfaces:

  - `cloudify.interfaces.lifecycle`: An interface for standard life cycle operations (e.g. create, start, stop, etc.). Operations of this interface are called from the [built-in](workflows-built-in.html) [*install*](workflows-built-in.html#the-install-worklow) and [*uninstall*](workflows-built-in.html#the-uninstall-worklow) workflows.
  - `cloudify.interfaces.validation`: An interface for pre-creation and pre-deletion validation operations. These may be called by using the [*execute_operation*](workflows-built-in.html#the-execute-operation-worklow) built-in workflow or by a [custom workflow](workflows-authoring.html). The Cloudify CLI calls these operations before the bootstrap and teardown of the Cloudify manager.
  - `cloudify.interfaces.monitoring_agent`: An interface for monitoring agent. Operations of this interface are called from the [built-in](workflows-built-in.html) [*install*](workflows-built-in.html#the-install-worklow) and [*uninstall*](workflows-built-in.html#the-uninstall-worklow) workflows.
  - `cloudify.interfaces.monitoring`: An interface for monitoring configuration. Operations of this interface are called from the [built-in](workflows-built-in.html) [*install*](workflows-built-in.html#the-install-worklow) and [*uninstall*](workflows-built-in.html#the-uninstall-worklow) workflows.

* `cloudify.nodes.Tier` - A marker for a future scale group

* `cloudify.nodes.Compute` - A compute resource either a virtual or a physical host


* `cloudify.nodes.Container` - A logical partition in a host such as [linux container](http://en.wikipedia.org/wiki/LXC) or [docker](https://www.docker.io/)

* `cloudify.nodes.Network` - A virtual network

* `clouydify.nodes.Subnet` - A virtual segment of IP addresses in a network

* `cloudify.nodes.Router` - A virtual layer 3 router

* `cloudify.nodes.Port` - An entry in a virtual subnet. Can be used in some clouds to secure a static private IP

* `cloudify.nodes.VirtualIP` - A virtual IP implemented as [NAT](http://en.wikipedia.org/wiki/Network_address_translation) or in another manner

* `cloudify.nodes.SecurityGroup` - A cloud security group (VM network access rules)

* `cloudify.nodes.LoadBalancer` - A virtualized Load Balancer

* `cloudify.nodes.Volume` - A persistent block storage volume

* `cloudify.nodes.FileSystem` - A Writable File System. This type must be used in conjunction with a `cloudify.nodes.Volume` type and a `cloudify.nodes.Compute` type.
    * relationships: The conjunction stated above is expressed by specifying two mandatory relationships for the file system.
        * `cloudify.relationships.file_system_depends_on_volume` - Used to format and partition the file system on top of the volume. It creates a single partition occupying the entire capacity of the volume.
        * `cloudify.relationships.file_system_contained_in_compute` - Used to mount and unmount the file system from the server.
    * properties:
        * `use_external_resource` - Enables the use of already formatted volumes. In this case, the formatting part will be skipped, and just a mount point will be created. Defaults to False. (Boolean)
        * `partition_type` - The partition type. Defaults to 83 which is a Linux Native Partition. (Integer)
        * `fs_type` - The type of the File System. Supported types are: `ext2`, `ext3`, `ext4`, `fat`, `ntfs`, `swap`
        * `fs_mount_path` - The path of the mount point.
    * Example Usage:
        {{< gsHighlight  yaml >}}
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
        {{< /gsHighlight >}}


* `cloudify.nodes.ObjectStorage` - A BLOB storage segment

* `cloudify.nodes.SoftwareComponent` - A base type for all middleware level types

* `cloudify.nodes.WebServer` - A web server
    * properties:
        * `port` - the webserver port

* `cloudify.nodes.ApplicationServer` - An application server

* `cloudify.nodes.DBMS` - a Database

* `cloudify.nodes.MessageBugServer` - a message bus server

* `cloudify.nodes.ApplicationModule` - a base type for any application module or artifact
