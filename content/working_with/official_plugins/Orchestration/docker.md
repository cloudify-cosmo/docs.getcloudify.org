---
title: Docker Plugin
category: Official Plugins
description: The plugin enables you to work with Docker images and containers
draft: false
weight: 100
aliases:
    - /plugins/docker/
    - /developer/official_plugins/docker/
---

The Docker plugin enables you to interact with docker machine through API integration and that will enable you to:

  1. Install docker on a machine.
  1. Build Images.
  1. Create containers from images.
  1. Create mapping volumes to containers.
  1. Run Ansible playbooks inside containers.
  1. Run Terraform modules inside containers.

# Requirements

You must already have docker installed either on your {{< param cfy_manager_name >}} or on another machine but with access allowed on port 2375.

# Node Types

## **cloudify.nodes.docker.images**

This node type will be used to list all images on the docker machine.

**Properties**

  * `client_config`: a property that contains the following properties:
    * `docker_host`: the docker host IP.
    * `docker_rest_port`: the docker API port by default it will be 2375.


### Example

In the following example we list docker images:

```yaml
  inputs:
    docker_host:
      description: >
        Docker Host IP.
      type: string
      default: '127.0.0.1'
    docker_rest_port:
      type: string
      default: 2375

  dsl_definitions:
    docker_config: &docker_config
      docker_host: { get_input: docker_host }
      docker_rest_port: { get_input: docker_rest_port }

  node_templates:
    docker_images:
      type: cloudify.nodes.docker.images
      properties:
        client_config: *docker_config
```


## **cloudify.nodes.docker.containers**

This node type will be used to list all containers on the docker machine.

**Properties**

  * `client_config`: a property that contains the following properties:
    * `docker_host`: the docker host IP.
    * `docker_rest_port`: the docker API port by default it will be 2375.

### Example

In the following example we list docker containers:

```yaml
  inputs:
    docker_host:
      description: >
        Docker Host IP.
      type: string
      default: '127.0.0.1'
    docker_rest_port:
      type: string
      default: 2375

  dsl_definitions:
    docker_config: &docker_config
      docker_host: { get_input: docker_host }
      docker_rest_port: { get_input: docker_rest_port }

  node_templates:
    docker_containers:
      type: cloudify.nodes.docker.containers
      properties:
        client_config: *docker_config
```

## **cloudify.nodes.docker.host**

This node type will be used to setup a docker machine.

**Properties**

  * `docker_machine`: a property that contains the following properties:
    * `docker_ip`: the machine that docker will be installed on.
    * `docker_user`: the user to be used to connect to that machine.
    * `docker_key`: the private key to use in order to connect to that machine.
  * `resource_config`: a property that contains the following properties:
    * `install_url`: a link to download the bash script to install docker
    * `install_script`: the commands that you need to execute to install docker

### Example

In the following example we will install a docker on a machine:

```yaml
  inputs:
    docker_ip:
      description: >
        Docker Host IP.
      type: string
      default: '127.0.0.1'
    docker_user:
      type: string
      default: ubuntu
    docker_key:
      type: string
      default: {get_secret: docker_private_key }

  dsl_definitions:
    docker_machine_config: &docker_machine_config
      docker_ip: { get_input: docker_ip }
      docker_user: { get_input: docker_user }
      docker_key: { get_input: docker_key }

  node_templates:
    docker_installation:
      type: cloudify.nodes.docker.host
      properties:
        docker_machine: *docker_machine_config
        resource_config:
          install_url: https://get.docker.com
          install_script: |
            usermod -aG docker $USER
            if [ -f /etc/redhat-release ]; then
              sed -i '/ExecStart/s/usr\/bin\/dockerd/usr\/bin\/dockerd --mtu=1450/' /lib/systemd/system/docker.service
              sed -i '/ExecStart/ s/$/ -H=tcp:\/\/0.0.0.0:2375 --dns 8.8.8.8 --bip 172.99.0.1\/16/' /lib/systemd/system/docker.service
              systemctl daemon-reload
              systemctl restart docker.service
            fi

            if [ -f /etc/lsb-release ]; then
              echo "DOCKER_OPTS=\"--mtu=1450 --dns 8.8.8.8 --dns 8.8.4.4 -H=tcp://0.0.0.0:2375 --bip 172.99.0.1/16\"" >> /etc/default/docker
              service docker restart

            fi
```

## **cloudify.nodes.docker.host_details**

This node type will be used to get the host info for a docker machine.

**Properties**

  * `client_config`: a property that contains the following properties:
    * `docker_host`: the docker host IP.
    * `docker_rest_port`: the docker API port by default it will be 2375.

### Example

In the following example we list docker containers:

```yaml
  inputs:
    docker_host:
      description: >
        Docker Host IP.
      type: string
      default: '127.0.0.1'
    docker_rest_port:
      type: string
      default: 2375

  dsl_definitions:
    docker_config: &docker_config
      docker_host: { get_input: docker_host }
      docker_rest_port: { get_input: docker_rest_port }

  node_templates:
    docker_host_details:
      type: cloudify.nodes.docker.host_details
      properties:
        client_config: *docker_config
```

## **cloudify.nodes.docker.image**

This node type will be used to build docker image on docker machine.

**Properties**

  * `client_config`: a property that contains the following properties:
    * `docker_host`: the docker host IP.
    * `docker_rest_port`: the docker API port by default it will be 2375.
  * `resource_config`: a property that contains the following properties:
    * `image_content`: could be the image content as text or link to image
    * `tag`: the image tag in which to reference when needed

### Example

In the following example we list docker containers:

```yaml
  inputs:
    docker_host:
      description: >
        Docker Host IP.
      type: string
      default: '127.0.0.1'
    docker_rest_port:
      type: string
      default: 2375

    centos_version:
      description: Centos version to prepare image for
      type: string
      default: "7"

    image_tag:
      description: Tag for the image to build
      type: string
      default: "centos:"

  dsl_definitions:
    docker_config: &docker_config
      docker_host: { get_input: docker_host }
      docker_rest_port: { get_input: docker_rest_port }

  node_templates:
    docker_centos_image:
      type: cloudify.nodes.docker.image
      properties:
        client_config: *docker_config
        resource_config:
          image_content:
            concat:
              - |
                FROM amd64/centos:7
                MAINTAINER Cosmo (hello@cloudify.co)
                RUN yum install -y openssh-server openssh-clients
          tag:
            concat:
              - { get_input: image_tag }
              - { get_input: centos_version }
```

## **cloudify.nodes.docker.container**

This node type will be used to create a continer given the built images on the docker machine.

**Properties**

  * `client_config`: a property that contains the following properties:
    * `docker_host`: the docker host IP.
    * `docker_rest_port`: the docker API port by default it will be 2375.
  * `resource_config`: a property that contains the following properties:
    * `image_tag`: the image tag that you have on your docker machine.
    * `container_args`: a dict of properties that can be passed to create container you can check them out from there https://tinyurl.com/v8url54

### Example

In the following example we list docker containers:

```yaml
  inputs:
    docker_host:
      description: >
        Docker Host IP.
      type: string
      default: '127.0.0.1'
    docker_rest_port:
      type: string
      default: 2375


  dsl_definitions:
    docker_config: &docker_config
      docker_host: { get_input: docker_host }
      docker_rest_port: { get_input: docker_rest_port }

  node_templates:
    docker_centos_container:
      type: cloudify.nodes.docker.container
      properties:
        client_config: *docker_config
        resource_config:
        image_tag: "centos:7"
        container_args:
          command: ls
```

**NOTE** here we have a special case implemenation in case we want to handle anything on the stop we could pass stop_command
for example in case of terraform we could send the destroy command when stop interface is called

```yaml
  docker_terraform_container:
    type: cloudify.nodes.docker.container
    properties:
      client_config: *docker_config
      resource_config:
        image_tag:
          concat:
            - { get_input: image_tag }
            - { get_input: terraform_version }
        container_args:
          command: { get_attribute: [docker_terraform_container_files, terraform_container_command_arg] }
          stdin_open: True
          working_dir: { get_attribute: [docker_terraform_container_files, storage_dir] }
          environment:
            AWS_ACCESS_KEY_ID: { get_input: aws_access_key_id }
            AWS_SECRET_ACCESS_KEY: { get_input: aws_secret_access_key }
            AWS_DEFAULT_REGION: { get_input: aws_region_name }
          volumes:
            - { get_input: container_volume }
          volumes_mapping:
            - { get_attribute: [docker_terraform_container_files, destination] }
    relationships:
      - type: cloudify.relationships.depends_on
        target: docker_terraform_image
      - type: cloudify.relationships.depends_on
        target: docker_terraform_container_files
    interfaces:
      cloudify.interfaces.lifecycle:
        stop:
          implementation: docker.cloudify_docker.tasks.stop_container
          inputs:
            stop_command:
              concat:
                - 'terraform destroy -auto-approve -no-color -var-file '
                - { get_attribute: [docker_terraform_container_files, variables_file] }
                - ' '
                - { get_attribute: [docker_terraform_container_files, storage_dir] }

```

## **cloudify.nodes.docker.container_files**

This node type will be used to handle the mapping of directory to docker container volume.

**Properties**

  * `resource_config`: a property that contains the following properties:
    * `docker_machine`: a property that contains the following properties:
      * `docker_ip`: the machine that docker will be installed on.
      * `docker_user`: the user to be used to connect to that machine.
      * `docker_key`: the private key to use in order to connect to that machine.
      * `container_volume`: the volume mapping to the container.
    * `source`: the source of the files that will be fetched to be mapped to the container later.
    * `destination`: the location to extract the source files into and then be used to be mapped to the container -In case left empty a temp directory will be created for you-.
    * `extra_files`: list of extra files that you may want to add to the destination before the mapping.
    * `ansible_sources`: special case for ansible sources.
    * `terraform_sources`: special case for terraform sources.

### Example

In the following example we preare a container volume mapping from a link to a zip file containing files:

```yaml
  inputs:
    docker_ip:
      description: >
        Docker Host IP.
      type: string
      default: '127.0.0.1'
    docker_user:
      type: string
      default: ubuntu
    docker_key:
      type: string
      default: {get_secret: docker_private_key }

  docker_centos_container_files:
    type: cloudify.nodes.docker.container_files
    properties:
      resource_config:
        docker_machine:
          docker_ip: { get_input: docker_ip }
          docker_user: { get_input: docker_user }
          docker_key: { get_input: docker_key }
        source: https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip
        destination: ""
```

## **cloudify.nodes.docker.ansible_playbook**

This node type will be used to build ansible docker container on docker machine given the same properties structure as in our ansible plugin.

**Properties**

  * `playbook_config`: same properties as in Playbook node type inside our ansible plugin.
  * `docker_machine`: a property that contains the following properties:
    * `docker_ip`: the machine that docker will be installed on.
    * `docker_user`: the user to be used to connect to that machine.
    * `docker_key`: the private key to use in order to connect to that machine.
    * `container_volume`: the volume mapping to the container.

### Example

See our [cloudify_community/blueprint-examples/docker/ansible]https://github.com/cloudify-community/blueprint-examples/tree/master/docker/ansible  


## **cloudify.nodes.docker.terraform_module**

This node type will be used to build terraform docker container on docker machine given the same properties structure as in our terraform plugin.

**Properties**

  * `terraform_plugins`: a list of plugins to install to terraform container.
  * `resource_config`: same properties as in terraform.RootModule node type inside our terraform plugin.
  * `docker_machine`: a property that contains the following properties:
    * `docker_ip`: the machine that docker will be installed on.
    * `docker_user`: the user to be used to connect to that machine.
    * `docker_key`: the private key to use in order to connect to that machine.
    * `container_volume`: the volume mapping to the container.

### Example

See our [cloudify_community/blueprint-examples/docker/terraform]https://github.com/cloudify-community/blueprint-examples/tree/master/docker/terraform  
