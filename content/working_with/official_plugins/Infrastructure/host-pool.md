---
title: Host-Pool Plugin
category: Official Plugins
description: The Host-Pool plugin is an infrastrcture-provisioning plugin that is used in conjunction with the Cloudify Host-Pool Service to use hosts from a pool of existing hosts
draft: false
abstract: "Cloudify Host-Pool plugin description and configuration"
weight: 180
aliases:
  - /plugins/host-pool/
  - /developer/official_plugins/host-pool/
---

The Host-Pool plugin is an infrastrcture-provisioning plugin that is used in conjunction with the {{< param product_name >}} [Host-Pool Service](https://github.com/cloudify-cosmo/cloudify-host-pool-service) to use hosts from a pool of existing hosts.
When the plugin is requested to provision a host, it makes a request to the host-pool service which, in turn, looks for available matching hosts inside the pool, and assigns one to that request.

The same flow is executed when the plugin is requested to release that host.
The pool of available hosts is determined at the time of the host-pool service installation, as explained in this topic.

# Plugin Requirements

* Python Versions:
    * 2.7.x
    * 2.6.x

# Host-Pool Plugin

## cloudify.hostpool.nodes.Host

The base type for a pool host.

**Derived From:** [cloudify.nodes.Compute]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `os` - The operating system, such as Linux, BSD, Windows, and so on.
  * `filters` - A dictionary containing a list of tags.

**Mapped Operations:**

  * `cloudify.interfaces.worker_installer.install` - Installs the agent.
  * `cloudify.interfaces.worker_installer.start` - Starts the agent.
  * `cloudify.interfaces.worker_installer.stop` - Stops the agent.
  * `cloudify.interfaces.worker_installer.uninstall` - Uninstalls the agent.
  * `cloudify.interfaces.worker_installer.restart` - Restarts the agent.

  * `cloudify.interfaces.lifecycle.create` - Handles the request of a host allocation in the host pool service.
  * `cloudify.interfaces.lifecycle.delete` -  Handles the deallocation of a host in the host pool service.

**Note that you must provide the `service_url` of the host pool service as an input to the lifecycle operations.**

**Attributes:**

  * `ip` - The private IP address of the host.
  * `user` - The username of the host.
  * `port` - The authentication port of the host.
  * `public_address` - The public address of the host.
  * `password` - The password of the host.
  * `key` - The content of the keyfile used to login to the host.


## cloudify.hostpool.nodes.LinuxHost

**Derived From:** [cloudify.hostpool.nodes.Host]

**Properties:**

  * `os` - The Linux operating system. (This is an implementation detail. Do not override it.)


## cloudify.hostpool.nodes.WindowsHost

**Derived From:** [cloudify.hostpool.nodes.Host]

**Properties:**

  * `os` - The Windows operating system. (This is an implementation detail. Do not override it.)


# Host-Pool Service

The Host-Pool service is a Web service that is designed to manage a large pool of hosts for use by {{< param product_name >}} deployments.
It enables the use of multiple existing hosts to be allocated for a deployment. It supports defining hosts by:

  * os
  * name
  * endpoint (IP)
  * additional filters

The Host-Pool plugin makes calls to this service every time that a new host
must to be provisioned/terminated.

To simplify the installation of this service, it is provided as a regular {{< param product_name >}} node type.

## cloudify.nodes.HostPoolService

**Derived From:** [cloudify.nodes.SoftwareComponent]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

  * `pool` - The relative path to a pool configuration file. This is where you define the hosts you want to "seed" the pool with.
  * `port` - The port to run the service on. Defaults to `8080`.
  * `debug` - Enables service debug logging.
  * `gunicorn_debug` - Enables gunicorn debug logging.
  * `source` - The source code of the service. Defaults to latest version.
  * `working_directory`The directory to run the service from inside the host.
  * `run_as_daemon` - Enables the service to run as a SysV daemon.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` - Creates the required directories and installs dependencies.
  * `cloudify.interfaces.lifecycle.configure` - Creates the service configuration, file based on information in the properties.
  * `cloudify.interfaces.lifecycle.start` - Starts the service.
  * `cloudify.interfaces.lifecycle.stop` - Stops the service.
  * `cloudify.interfaces.lifecycle.delete` - Deletes the service working directory.

**Attributes:**

  * `seed_config` - The initial configuration of the host pool.
  * `working_directory` - The final working directory of the service.
  * `endpoint` - The URL of the service. The URL is determined by combining the `port` property of the type, with the IP address of the host that the service is contained within.
  The IP address is either the `ip` attribute of the containing host node, or, in the case that it is absent, the `ip` property of the node. This endpoint is similar to the cloud endpoints withj which you are probably familiar.
  * `service name` - The service name. Defaults to `cloudify-hostpool`.

{{% note title="Information" %}}
Complete definition of this type is described [here](https://github.com/cloudify-cosmo/cloudify-host-pool-service/blob/master/host-pool-service.yaml).

You must have a running Host-Pool service before you can start using the plugin.
{{% /note %}}


# Examples

The following is an example of using the host-pool-plugin node types.

{{< highlight  yaml  >}}

tosca_definitions_version: cloudify_dsl_1_2

imports:
  - http://www.getcloudify.org/spec/cloudify/3.3.1/types.yaml
  - https://raw.githubusercontent.com/cloudify-cosmo/cloudify-host-pool-plugin/1.4/plugin.yaml

inputs:
  hostpool_svc_endpoint:
    type: string
    description: |
      Endpoint for the host-pool REST service
    default: http://192.168.1.100:8080

node_templates:
  host_from_pool:
    type: cloudify.hostpool.nodes.LinuxHost
    properties:
      filters:
        tags:
        - redhat
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            service_url: { get_input: hostpool_svc_endpoint }
        delete:
          inputs:
            service_url: { get_input: hostpool_svc_endpoint }

{{< /highlight >}}

A full example that installs the nodecellar application using this plugin is available [here](https://github.com/cloudify-cosmo/cloudify-nodecellar-example/blob/master/host-pool-blueprint.yaml).
