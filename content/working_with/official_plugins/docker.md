---
layout: bt_wiki
title: Docker Plugin
category: Official Plugins
draft: false
abstract: "Docker plugin description and configuration"
weight: 100
aliases: /plugins/docker/

yaml_link: http://getcloudify.org/spec/docker-plugin/1.2/plugin.yaml
fabric_link: http://getcloudify.org/guide/3.2/plugin-fabric.html
plugin_version: 1.3.2
---

{{% warning %}}

Docker Plugin is no longer officially supported and is only maintained by community members.

{{% /warning %}}


# Plugin Requirements:

* Python versions:
  * 2.7.x

{{% note title="Notes on Docker installation" %}}
  * The Docker plugin does not install Docker on your host. You must either use a host with Docker already installed, or install Dit.
  * As part of the Docker installation, make sure that the user agent (such as Ubuntu), is added to the docker group.
{{% /note %}}

# Compatibility

The Docker plugin uses Docker-Py version 1.2.3.

# Types

## cloudify.docker.Container

**Derived From:** cloudify.nodes.Root

**Properties:**

  * `image` *Required*.
  * `name` *Required*.
  * `use_external_resource` a boolean for specifying whether to create the resource or use an existing one.

**Mapped Operations:**

  * `cloudify.interfaces.lifecycle.create` creates the container.
    * **Inputs:**
      * `params` Any parameters exposed by the Docker Py library to the `create_container` operation.
  * `cloudify.interfaces.lifecycle.start` starts the container.
    * **Inputs:**
      * `params` Any parameters exposed by the Docker Py library to the start operation.
      * `processes_to_wait_for` A list of processes to wait for before finishing the start operation.
      * `retry_interval` Before the start operation finishes, Cloudify confirms that the container is started. Specifies the number of seconds between checking. Defaults to 1.
 * `cloudify.interfaces.lifecycle.stop` stops the container.
    * **Inputs:**
      * `params` Any parameters exposed by the Docker Py library to the stop operation.
      * `retry_interval` Before the stop operation finishes, Cloudify confirms that the container is stopped. Specifies the number of seconds between checking. Defaults to 10.
  * `cloudify.interfaces.lifecycle.delete` deletes the container.
    * **Inputs:**
      * `params` Any parameters exposed by the Docker Py library to the remove_container operation.
      * `retry_interval` Before the delete operation finishes, Cloudify confirms that the container is removed. Specifies the number of seconds between checking. Defaults to 10.

**Attributes:**

  * `container_id` The ID of the container in the Docker Server.
  * `ports` The ports as shown in the container inspect output.
  * `network_settings` The `network_settings` dictionary in the inspect output.
  * `image_id` The ID of the pulled or imported repository/tag.

{{< highlight  yaml  >}}

  vm_with_docker:
    derived_from: cloudify.openstack.nodes.Server
    properties:
      cloudify_agent:
        default:
          user: { get_input: agent_user }
          home_dir: /home/ubuntu
      server:
        default:
          image: { get_input: image }
          flavor: { get_input: flavor }
          userdata: |
            #!/bin/bash
            sudo service ssh stop
            curl -o install.sh -sSL https://get.docker.com/
            sudo sh install.sh
            sudo groupadd docker
            sudo gpasswd -a ubuntu docker
            sudo service docker restart
            sudo service ssh start

{{< /highlight >}}


# Blueprints

## An example node specification

{{< highlight  yaml  >}}

  some_container:
    type: cloudify.docker.Container
    properties:
      name: some_name
      image:
        repository: dockeruser/dockerrepo
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: docker.docker_plugin.tasks.create_container
          inputs:
            params:
              ports:
                - 8080
              stdin_open: true
              tty: true
              command: /bin/sleep 20
        start:
          implementation: docker.docker_plugin.tasks.start
          inputs:
            params:
              port_bindings:
                8080: 8080

{{< /highlight >}}

## Container Properties

The properties are: `name`, `image`.

### name:

The `name` property is the name of the container.

### image:

The `image` property is a dictionary. It must have the `repository` key or the `src` key, or both. It may additionally have the `tag` key.

* If `src` is provided, it must point to a file or URL from where the image's tarball is imported.
  * If `repository` is also provided, then its value will be used as the name of the repository once the image is downloaded.
  * Otherwise, the plugin will name the repository after the Cloudify instance ID.
* Otherwise, `repository` must be provided, and must contain the name of the Docker image to pull.

If you pull an image from a Docker hub, `repository` is required. If you are importing an image, you leave it blank. The plugin will name the
repository by the Cloudify instance ID.

For more information on importing images, see [docker import command](https://docs.docker.com/reference/commandline/cli/#import).
For more information on pulling images, see [docker pull command](https://docs.docker.com/reference/commandline/cli/#pull).

Following is an example of importing from an URL.

{{< highlight  yaml  >}}

  cloudify_manager:
    type: cloudify.docker.Container
    properties:
      name: cloudify-manager
      image:
        src: http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.2.0/m6-RELEASE/cloudify-docker_3.2.0-m6-b176.tar
        tag: 3.2.0

{{< /highlight >}}

### Defining Parameters

Because this plugin is based on the Docker-Py python library, you can pass the parameters as inputs to the supported functions.

## Create

Maps to the `create_container` function. You can add any of the parameters available to the `create_container` function in Docker-Py

{{< highlight  yaml  >}}

  create:
    implementation: docker.docker_plugin.tasks.create_container
    inputs:
      params:
        ports:
          - 27017
          - 28017
        stdin_open: true
        tty: true
        command: mongod --rest --httpinterface --smallfiles

{{< /highlight >}}

## Start

Maps to the start function. You can add any of the parameters available to the start function in Docker-Py.

{{< highlight  yaml  >}}

  start:
    implementation: docker.docker_plugin.tasks.start
    inputs:
      params:
        port_bindings:
          27017: 27017
          28017: 28017

{{< /highlight >}}

## Stop

Maps to the stop function. You can add any of the parameters available to the stop function in Docker-Py.

{{< highlight  yaml  >}}

  stop:
    implementation: docker.docker_plugin.tasks.stop
    inputs:
      params:
        timeout: 30

{{< /highlight >}}

## remove_container

Maps to the `remove_container` function. You can add any of the parameters available to the `remove_container` function in Docker-Py.

{{< highlight  yaml  >}}

  delete:
    implementation: docker.docker_plugin.tasks.remove_container
    inputs:
      params:
        force: true

{{< /highlight >}}


Many of the options exposed in the Docker-Py Python Docker API are available through the Cloudify Docker Plugin. That documentation can supplement this feature, see [docker python client](https://github.com/docker/docker-py).

For additional descriptions of parameters, see the [docker command line documentation](https://docs.docker.com/reference/commandline/cli/).


## Using the Plugin

The plugin is designed to follow the Docker Py Docker Python API library, not the Docker CLI. Because of this, it differs from the Docker CLI in certain respects. For example, `docker run` is split into `create` and `start`.

Following are the operations that this plugin currently supports.

### Create Task

* Creates a container that can be started.

* In this case, the plugin pulls images from the Docker Hub Registry, a private registry, or it may import an image from a tarball.

* This operation adds the `container_id` to the instance `runtime_properties`.


### Start Task

* This starts the container.

* It also logs containers' network settings with IPs, ports, and high-level information.

* You can pass a list of process names that you want to make sure are running on the container before the start operation succeeds:

{{< highlight  yaml  >}}

  start:
    implementation: docker.docker_plugin.tasks.start
    inputs:
      params:
        port_bindings:
          27017: 27017
          28017: 28017
        processes_to_wait_for:
          - /bin/sh

{{< /highlight >}}


### Stop Task

* Stops the container.


### Delete Task

* Deletes the container and its `runtime_properties`.

# Complete Example

For a complete working example, refer to the [cloudify-nodecellar-docker-example](https://github.com/cloudify-cosmo/cloudify-nodecellar-docker-example).
