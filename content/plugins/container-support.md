---
layout: bt_wiki
title: A Guide To Cloudify Docker Container Support
category: Plugins
draft: false
weight: 10100
---
## Overview

Cloudify supports integrations with Docker and Docker-based container managers, including Docker, Docker Swarm, Docker Compose, Kubernetes, and Apache Mesos.  Cloudify can both manage container infrastructure, and/or orchestrate the services that run on container platforms. When orchestrating container orchestrators (such as Kubernetes, Docker Swarm, and Mesos), Cloudify provides infrastructure management capabilities such as installation, auto healing and scaling. When orchestrating services on these platforms, Cloudify integrates seamlessly with native descriptors to not only support container cluster service deployment, but also to enable orchestrations that encompass systems beyond the edges of the container cluster.

{{% gsNote title="Note" %}}
Docker container support is being incubated as an official plugin. If you are using this content, ask for support.
{{% /gsNote %}}

### Infrastructure Orchestration

Cloudify can be used to create, heal, scale, and tear down container clusters. This capability is key in providing a scalable and highly-available infrastructure on which container managers can run.  

![diagram of infrastructure orchestration]({{< img "plugins/infrastructure-orch.png" >}})

Cloudify can also orchestrate related infrastructure on bare metal, virtualized, and cloud platforms. This can include networking and storage infrastructure, both virtual and physical.

### Service Orchestration

Independently from the orchestration of infrastructure, Cloudify provides the ability to orchestrate heterogenous services across platforms. By leveraging the strength of TOSCA modeling, Cloudify can manage the instantiation and configuration of service chains, regardless of the target platform. This ranges from containerized, to virtualized, to "bare metal" OS, to physical hardware.

![diagram of services orchestration]({{< img "plugins/services-orch.png" >}})

## Docker Plugin

The [Docker plugin](https://github.com/cloudify-cosmo/cloudify-docker-plugin) is a Cloudify plugin that defines a single type: `cloudify.docker.Container`. The plugin is compatible with Docker 1.0 (API version 1.12) and relies on the [docker-py](https://github.com/docker/docker-py) library. The plugin executes on a computer host that has Docker pre-installed.  

### Types

#### cloudify.docker.Container

##### Properties:

* `image` A dictionary describing a docker image. To import an image from a tarball
          use the `src` key. The value is an absolute path or URL. If pulling
          an image from docker hub, do not use `src`. The key is a repository. The value is that
          repository name. You may additionally specify the tag, if no tag is specified,
          the latest is assumed.
* `name` The name of the Docker container. This is also the host name in the Docker
          host config file.
* `use_external_resource` A boolean indicating whether the container already exists.

##### Interfaces:

The `cloudify.interfaces.lifecycle` interface is implemented, and supports the following function parameters:

* `create` inputs:
 * `params` A dictionary of parameters permitted by docker-py to the
                `create_container` function.
* `start` inputs:
 * `params` A dictionary of parameters permitted by docker-py to the
                `start` function.
 * `processes_to_wait_for` A list of processes to be verified as active on the container
                before completing the start operation. If all processes are inactive,
                the function is retried.
 * `retry_interval` Before finishing, `start` checks to see that all processes
                on the container are ready. This is the interval between
                checks.
* `stop` inputs:
 * `params` A dictionary of parameters permitted by docker-py to the
                `stop` function.
 * `retry_interval` If `Exited` is not in the container status, the plugin retries. This is
                the number of seconds between retries.
* `delete` inputs:
 * `params` A dictionary of parameters permitted by docker-py to the
                `remove_container` function.

## Docker Swarm Blueprint

The [Docker Swarm blueprint](https://github.com/cloudify-examples/docker-swarm-blueprint) creates and manages a Docker Swarm cluster on Openstack. There are three blueprints, with slightly different use cases:

* swarm-local-blueprint.yaml : A cfy local blueprint that orchestrates setup and teardown of a cluster without a Cloudify Manager.
* swarm-openstack-blueprint.yaml : An Openstack blueprint that orchestrates setup and teardown of a cluster with a Cloudify Manager.
* swarm-scale-blueprint.yaml : An Openstack blueprint that orchestrates setup, teardown, autohealing, and autoscaling of a cluster.

### Prerequisites

These blueprints have only been tested against an Ubuntu 14.04 image with 2GB of RAM. The image used must be pre-installed with Docker 1.12. Any image used must have password-less SSH, and password-less `sudo` with `requiretty false` or commented out in `sudoers`. An Openstack cloud environment is also required. The blueprints were tested on Openstack Kilo.

### Usage

#### swarm-local-blueprint.yaml

##### Overview

The `swarm-local` blueprint is intended to be run using the [cfy local](http://docs.getcloudify.org/3.4.1/cli/local/) CLI command. As such, no Cloudify Manager is necessary. The blueprint starts a two-node Swarm cluster and related networking infrastructure in Openstack.

##### Inputs

* `image` The Openstack image ID.  This image is used for both master and worker nodes.  This image must be prepared with Docker 1.12, and support password-less SSH, password-less `sudo`, and password-less `sudo` over SSH.  Only Ubuntu 14.04 images have been tested.
* `flavor` The Openstack flavor ID. This flavor is used for both master and worker nodes.  2 GB RAM flavors and 20 GB disk are adequate. Flavor size varies, based on application needs.
* `ssh_user` This blueprint uses the [Fabric plugin](http://docs.getcloudify.org/3.4.1/plugins/fabric/) and therefore requires SSH credentials.
* `ssh_keyname` The Openstack SSH key to attach to the compute nodes (both master and worker).
* `ssh_keyfile` This blueprint uses the [Fabric plugin](http://docs.getcloudify.org/3.4.1/plugins/fabric/) and therefore requires SSH credentials.

##### Other Configuration

The blueprint contains a `dsl_definitions` block to specify the Openstack credentials:  
* `username` The Openstack user name.
* `password` The Openstack password.
* `tenant_name` The Openstack tenant.
* `auth_url` The Openstack Keystone URL.

#### swarm-openstack-blueprint.yaml

##### Overview

The [swarm-openstack-blueprint.yaml](https://github.com/cloudify-examples/docker-swarm-blueprint/blob/master/swarm-openstack-blueprint.yaml) is a Cloudify Manager-hosted blueprint that starts a Swarm cluster and related networking infrastucture.

##### Inputs
* `image` The Openstack image ID.  This image is used for both master and worker nodes. This image must be prepared with Docker 1.12, and support password-less SSH, password-less `sudo`, and password-less `sudo` over SSH. Only Ubuntu 14.04 images have been tested.
* `flavor` The Openstack flavor ID.  This flavor is used for both master and worker nodes.  2 GB RAM flavors and 20 GB disk are adequate. Flavor size  varies, based on application needs.
* `ssh_user` This blueprint uses the [Fabric plugin](http://docs.getcloudify.org/3.4.1/plugins/fabric/) and therefore requires SSH credentials.
* `agent_user` The user for the image.

##### Outputs
* `swarm-info` which is a dictionary with two keys:
 * `manager_ip` The public IP address allocated to the Swarm manager.
 * `manager_port` The port the manager listens on.

#### swarm-scale-blueprint.yaml

##### Overview
The [swarm-scale-blueprint.yaml](https://github.com/cloudify-examples/docker-swarm-blueprint/blob/master/swarm-openstack-blueprint.yaml) is a Cloudify Manager-hosted blueprint that starts a Swarm cluster and related networking infrastucture. It installs metrics collectors on worker nodes, and defines scaling and healing groups for cluster high availability.

##### Inputs
* `image` The Openstack image ID.  This image is used for both master and worker nodes. This image must be prepared with Docker 1.12, and support password-less SSH, password-less `sudo`, and password-less `sudo` over SSH.  Only Ubuntu 14.04 images have been tested.
* `flavor` The Openstack flavor ID. This flavor is used for both master and worker nodes. 2 GB RAM flavors and 20 GB disk are adequate. Flavor size varies, based on application needs.
* `ssh_user` This blueprint uses the [Fabric plugin](http://docs.getcloudify.org/3.4.1/plugins/fabric/) and therefore requires SSH credentials.
* `agent_user` The user for the image.

##### Outputs
* `swarm-info` which is a dictionary with two keys:
 * `manager_ip` The public IP address allocated to the Swarm manager.
 * `manager_port` The port the manager listens on.

## Docker Swarm Plugin

The [Docker Swarm Plugin](https://github.com/cloudify-examples/cloudify-swarm-plugin) provides support for deploying services onto [Docker Swarm](https://docs.docker.com/engine/swarm/swarm-tutorial/) clusters, and support for [Docker Compose](https://docs.docker.com/compose/overview/).

### Types

#### cloudify.swarm.Manager
##### Overview
A type that represents a Swarm manager that is not managed by Cloudify. If a Cloudify-managed manager is used, the [Cloudify proxy plugin](https://github.com/cloudify-examples/cloudify-proxy-plugin) should be used instead.
##### Properties
* `ip` The IPV4 address of the Swarm manager.
* `port` The port on which the manager REST API is listening (default 2375).
* `ssh_user` An SSH user for operations that require SSH (Docker Compose).
* `ssh_keyfile` An SSH private key for operations that require SSH (Docker Compose).

#### cloudify.swarm.Microservice
##### Overview
The `cloudify.swarm.Microservice` type represents a Docker Swarm service. It can be configured to use TOSCA-style properties or point to an external Swarm yaml descriptor. Note that the source project includes an example of usage.

##### Properties
* `compose_file` The path to a Docker compose descriptor file. If set, all other properties are ignored.
* All other properties are translated into the Docker REST [service create ](https://docs.docker.com/v1.12/engine/reference/api/docker_remote_api_v1.24#create-a-service) API call.  Properties in the blueprint are encoded with underscores between words (e.g. `log_driver`) and converted internally to the REST API body as camel case (e.g. `LogDriver`). See comments in the [plugin.yaml](https://github.com/cloudify-examples/cloudify-swarm-plugin/blob/master/plugin.yaml) for an extensive example.

##### Relationships

* `cloudify.swarm.relationships.microservice_contained_in_manager` This relationship connects a Microservice to a manager. The implementation enables the target to be either a `cloudify.swarm.Manager` type or a `cloudify.nodes.DeploymentProxy` type.

## Kubernetes Cluster Blueprint

The [Kubernetes Cluster Blueprint](https://github.com/cloudify-examples/kubernetes-cluster-blueprint) creates and manages a [Kubernetes](https://kubernetes.io/docs/) cluster on Openstack and Amazon EC2. It uses the [containerized version of Kubernetes](https://kubernetes.io/docs/getting-started-guides/docker-multinode) to create the cluster. It also installs the Kubernetes dashboard and the `kubectl` utility on the master. By default, the blueprint is configured to install on AWS. To switch to Openstack, edit the [blueprint file](https://github.com/cloudify-examples/simple-kubernetes-blueprint) and comment out the line `- imports/aws/blueprint.yaml`, and the line belows it.

### Inputs (Common)
* `your_kubernetes_version` The version of Kubernetes to use (default 1.2.1).
* `your_etcd_version` The version of Etcd to use (default 2.2.1.).
* `your_flannel_version` The version of Flannel to use (default 0.5.5).
* `flannel_interface` The interface to bind Flannel to (default eth0).
* `flannel_ipmasq_flag` Whether Flannel should use IP Masquerading (default true).

### Inputs (AWS)
* `aws_access_key_id` The AWS access key.
* `aws_secret_access_key` The AWS secret key.
* `ec2_region_name` The EC2 region name (default us-east-1).
* `ec2_region_endpoint` The EC2 region (default ec2.us-east-1.amazonaws.com).

### Inputs (Openstack)
* `keystone_username` The Openstack user name.
* `keystone_password` The Openstack password.
* `keystone_tenant_name` The Openstack tenant.
* `keystone_url` The Openstack authentication URL.
* `region` The Openstack region (optional).
* `nova_url` The Openstack Nova compute API URL (optional).
* `neutron_url` The Openstack Neutron network API URL (optional).
* `openstack_management_network_name` The Cloudify management network name (optional).

### Outputs

#### AWS
* A single output `Kubernetes_Dashboard` with a dictionary value with a single key `url`. The URL uses the allocated floating IP to point to the Kubernetes dashboard.

#### Openstack
* A single output `kubernetes_info` with a dictionary value with a single key `url`. The URL uses the allocated floating IP to point to the Kubernetes dashboard.

### Other Configuration

To tweak the scaling behavior, the groups are defined in the individual cloud-pecific imports for [AWS](https://github.com/cloudify-examples/kubernetes-cluster-blueprint/blob/master/imports/aws/blueprint.yaml) and [Openstack](https://github.com/cloudify-examples/kubernetes-cluster-blueprint/blob/master/imports/openstack/blueprint.yaml).  Both sub-blueprints refer to a custom scaling policy [type](https://github.com/cloudify-examples/kubernetes-cluster-blueprint/blob/master/imports/scale.yaml).  The type definition documents how the scaling parameters can be tweaked for required effects.  The heal group uses the built-in [host failure policy](http://docs.getcloudify.org/3.4.1/manager_policies/built-in-policies/), which is triggered by named metrics expiring (60 seconds).

## Kubernetes Plugin

The [Kubernetes Plugin](https://github.com/cloudify-examples/cloudify-kubernetes-plugin) provides support for deploying services on [Kubernetes](https://kubernetes.io/docs/) clusters.

### Types

#### cloudify.kubernetes.Master

deprecated

#### cloudify.kubernetes.Node

deprecated

#### cloudify.kubernetes.MicroService
The `cloudify.kubernetes.MicroService` type deploys and removes Kubernetes services to/from a Kubernetes cluster. It provides options for specifying service configuration with TOSCA properties, and embedded or external native Kubernetes service descriptors.

##### Properties (non-native definition)
* `name` The service name.
* `image` The image name.
* `port` The service listening port.
* `target_port`	The container port (default port).
* `protocol` TCP/UDP (default TCP).
* `replicas` The number of replicas (default 1).
* `run_overrides` JSON overrides for kubectl "run".
* `expose_overrides` JSON overrides for kubectl "expose".

##### Properties (embedded native)
* `config` A dictionary in which the children can be a native Kubernetes descriptor YAML.

##### Properties (external native)

* `config_files` A dictionary with keys.
 * `file` A Kubernetes descriptor file (e.g. pod.yaml).
 * `overrides` A list of substitutions to perform on the pod.yaml file (see _Override Syntax_ below).

### Override Syntax
When configuring using external files, the files require no change for use with Cloudify, but they can be modified by means of "overrides" that can insert blueprint values dynamically. The target file is parsed into a Python datastructure (dictionary of dictionaries and lists). 

To understand how the substitutions work, consider the following pod.yaml snippet:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: nodecellar
spec:
  replicas: 2

```
If, for some reason, you need to change the number of replicas to (for example) 3, the "overrides" line in the blueprint would appear as follows:

`['spec']['replicas']=3`

Internally, the plugin simply evaluates this statement on the parsed data structure.  After all substitutions are completed, a new `pod.yaml` is written to perform the actual deployment on the master node via `kubectl`. The value type of the substitution line is a string, meaning that standard intrinsics like `concat` and `get_property` can be used to insert properties from elsewhere into blueprints.

#### Special Substitution Syntax
Sometimes it is required to inject runtime properties or information from the Cloudify context. To enable this, the plugin implements a special syntax.

##### Runtime Properties @{}
To insert runtime properties as values of substitutions, use the `@{}` syntax. It requires two arguments, a node name and a property name.  For example, to inject a dynamically discovered port from another node, you could use something like `[some][path]=@{target_node,discovered_port}`.

##### Cloudify Context %{}
To insert values from the Cloudify [context](http://cloudify-plugins-common.readthedocs.io/en/3.3/context.html), use the `%{}` syntax. It requires a single argument, a path in the Cloudify node context object. For example, to insert the node ID of the service, you could use something like `[some][path]=${node.id}`. This is equivalent to evaluating `ctx.node.id` in plugin code.

## Mesos Blueprint

The [Mesos blueprint](https://github.com/cloudify-examples/mesos-blueprint) creates and manages [Mesos](http://mesos.apache.org/) clusters on Openstack.  It is a Cloudify Manager-hosted blueprint that starts a Mesos cluster and related networking infrastructure. It installs metrics collectors on slave nodes, and defines scaling and healing groups for cluster high availability.

### Image Preparation

The Mesos blueprint includes a secondary blueprint to aid in the creation of Cloudify-compatible images on Openstack. The image preparation blueprint is located in the `util` directory. In the `util/imports/openstack/blueprint.yaml`, specify the inputs and Openstack configuration. When you are finished, run the `create_image.sh` script. When that is complete, save a snapshot of the created image and use it as a base image for the Mesos blueprint. For more details, see [the README](https://github.com/cloudify-examples/mesos-blueprint/blob/master/README.md).

### Mesos Blueprint Operation

#### Inputs
* `image` The Openstack image ID.  Ideally this image is created by the `Image Creation` process described previously. If not, the image must be an Ubuntu 14.04 OS, prepared to allow password-less SSH, password-less `sudo`, password-less `sudo` over SSH, and have Docker and Mesos installed. You can also run the [image creation script](https://github.com/cloudify-examples/mesos-blueprint/blob/master/util/scripts/ubuntu14.sh) manually to prepare the image.
* `flavor` The Openstack flavor ID. This flavor is used for all instances. 2 GB RAM flavors and 20 GB disk are adequate. Flavor size varies, based on application needs.
* `agent_user` The user for the image. Should be `ubuntu`.

#### Outputs
* `mesos_ip` The public IP of the master server.
* `mesos_ui` The URL of the Mesos dashboard.