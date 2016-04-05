---
layout: bt_wiki
title: Host-Pool Plugin
category: Plugins
draft: false
abstract: "Cloudify Host-Pool plugin description and configuration"
weight: 600
---
{{% gsSummary %}} {{% /gsSummary %}}

# Description

The plugin is an infrastrcture provisioning plugin that is used in conjunction with Cloudify's [Host-Pool Service](https://github.com/cloudify-cosmo/cloudify-host-pool-service) to use hosts from a pool of existing hosts.
When the plugin is requested to provision a host, it will make a request to the Host-Pool-Service, which will in turn look for available matching hosts inside the pool, and assign one to that request.

The same flow is executed when the plugin is requested to release that host.
The pool of available hosts will be determined at the time of the Host-Pool-Service installation, as explained below.

# Plugin Requirements

* Python Versions:
    * 2.7.x
    * 2.6.x

# Host-Pool Plugin

## cloudify.hostpool.nodes.Host

Base type for a pool host.

**Derived From:** [cloudify.nodes.Compute](reference-types.html)

**Properties:**

  * `os` such as Linux, BSD, Windows, etc.
  * `filters` a dictionary containing a list of tags.

**Mapped Operations:**

  * `cloudify.interfaces.worker_installer.install` Installs the agent.
  * `cloudify.interfaces.worker_installer.start` Starts the agent.
  * `cloudify.interfaces.worker_installer.stop` Stops the agent.
  * `cloudify.interfaces.worker_installer.uninstall` Uninstalls the agent.
  * `cloudify.interfaces.worker_installer.restart` Restarts agent.

  * `cloudify.interfaces.lifecycle.create` Handles the request of a host allocation in the host pool service.
  * `cloudify.interfaces.lifecycle.delete` Handles the deallocation of a host in the host pool service.

**Note that you must provide the service_url of the host pool service as an input to the lifecycle operations.**

**Attributes:**

  * `ip` the private ip of the host.
  * `user` the username of the host.
  * `port` the authentication port of this host.
  * `public_address` the public address of the host.
  * `password` the password of the host.
  * `key` the content of the keyfile used to login to the host.


## cloudify.hostpool.nodes.LinuxHost

**Derived From:** [cloudify.hostpool.nodes.Host]

**Properties:**

  * `os` linux.


## cloudify.hostpool.nodes.WindowsHost

**Derived From:** [cloudify.hostpool.nodes.Host]

**Properties:**

  * `os` windows.


# Host-Pool Service

The Host-Pool Service is a web service designed for managing a large pool of hosts to be used by cloudify deployments.
It allows for the use of multiple existing hosts to be allocated for a deployment. Supports defining hosts by:

  * os
  * name
  * endpoint (IP)
  * additional filters

The Host-Pool-Plugin will make calls to this service each time a new host
needs to be provisioned/terminated.

To make the installation of this service easy, we have made it available as a regular cloudify node type.

## cloudify.nodes.HostPoolService

**Derived From:** [cloudify.nodes.SoftwareComponent](reference-types.html)

**Properties:**

  * `pool` relative path to a pool configuration file. This is where you define the hosts you want to "seed" the pool with.
  * `port` the port to run the service on. Defaults to `8080`
  * `debug` enable service debug logging
  * `gunicorn_debug` enable gunicorn debug logging
  * `source` the source code of the service. Defaults to latest version.
  * `working_directory` the directory to run the service from inside the host.
  * `run_as_daemon` enable the service to run as a SysV daemon

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` creates the necessary directories and installs dependencies.
  * `cloudify.interfaces.lifecycle.configure` creates the service configuration file based on information in the properties.
  * `cloudify.interfaces.lifecycle.start` starts the service.
  * `cloudify.interfaces.lifecycle.stop` stops the service.
  * `cloudify.interfaces.lifecycle.delete` deletes the service working directory.

**Attributes:**

  * `seed_config` the initial configuration of the host pool.
  * `working_directory` the final working directory of the service
  * `endpoint` the url of the service. This URL is determined by combining the `port` property of the type, with the ip of the host the service is contained within.
  The ip is either the `ip` attribute of the containing host node, or, in case it is absent, the `ip` property of the node.
  You can effectively think of this endpoint like the cloud endpoints you are probably used to.
  * `service name` defaults to cloudify-hostpool.

{{% gsInfo title="Information" %}}
Complete definition of this type can be found [Here](https://github.com/cloudify-cosmo/cloudify-host-pool-service/blob/master/host-pool-service.yaml)

You must have a running Host-Pool Service before you can start using the Plugin
{{% /gsInfo %}}


# Examples


{{% gsCloak "Basic" %}}
The following is an example of using the host-pool-plugin node types.

{{< gsHighlight  yaml  >}}

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

{{< /gsHighlight >}}

{{% /gsCloak %}}

{{% gsCloak "Nodecellar" %}}
A full example that installs the nodecellar application using this plugin is available [Here](https://github.com/cloudify-cosmo/cloudify-nodecellar-example/blob/master/host-pool-blueprint.yaml)
{{% /gsCloak %}}