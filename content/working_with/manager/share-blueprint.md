---
title: Sharing a Blueprint
category: Manager Intro
draft: false
weight: 800
aliases: /manager/share-blueprint/
---

# About
For enabling a fully shareable blueprint or a resource this two abilities were added: [importing a catalog
blueprint]({{< relref "/developer/blueprints/spec-imports.md#importing-catalog-blueprints" >}}) and adding a [namespace]({{< relref "/developer/blueprints/spec-imports.md#namespace" >}}) context to any import available resource. With those two it is possible to share any common blueprint
definitions, from a simple data types definitions through an architecture common pattern (like creating an openstack VM with
all of its requirements) and up to entire micro-services that are found across in several services.   

# Namespace
The namespace context is added to all the DSL elements that may be referenced, allowing the blueprint to safely be
imported and used in other blueprints, without fear of name collisions.
This contributes a great deal for common blueprint patterns that now can be imported several times under different
namespaces and be used with no unwanted duplications across deployments. **Notice:** {{< param product_name >}} basic types definition can not receive namespace.

# Catalog Blueprint   
With the ability to import a catalog blueprint, blueprints are now truly shareable building blocks that can be used across
deployments ranging from sharing a basic definition blueprint to sharing DBs, Message brokers blueprints building block and
even sharing entire micro-services blueprints as integral pieces. Which will reduce blueprint duplication across deployments
and will allow for a better way of consuming shareable building blocks.      

# Example

In an Openstack cloud environment, a very basic building block could be a blueprint which creates a VM on open stack.

Basic Openstack VM blueprint with a single port opened:

{{< highlight  yaml >}}

tosca_definitions_version: cloudify_dsl_1_3

imports:
  - http://www.getcloudify.org/spec/cloudify/5.0.0/types.yaml
  - plugin:cloudify-openstack-plugin

inputs:
  port:
    description: open port
    default: 8080
  agent_user:
    description: User name used when SSH-ing into the started machine
  image:
    description: Openstack image name or id to use for the new server
  flavor:
    description: Openstack flavor name or id to use for the new server
  network_name:
    description: Openstack network name the new server will be connected to
  floating_network_id:
    description: The id of the network to use for allocating a floating ip
  key_pair_name:
    description: Openstack key pair name of the key to associate with the new server
  private_key_path:
    description: |
      Path to the private key which will be used for connecting to the server
      on the manager or machine running CLI if running in local mode.

node_templates:
  virtual_ip:
    type: cloudify.openstack.nodes.FloatingIP
    properties:
      floatingip:
        floating_network_id: { get_input: floating_network_id }

  security_group:
    type: cloudify.openstack.nodes.SecurityGroup
    properties:
      rules:
        - port: { get_input: port }
          remote_ip_prefix: 0.0.0.0/0
        - port: 22
          remote_ip_prefix: 0.0.0.0/0

  keypair:
    type: cloudify.openstack.nodes.KeyPair
    properties:
      use_external_resource: true
      resource_id: { get_input: key_pair_name }
      private_key_path: { get_input: private_key_path }

  vm:
    type: cloudify.openstack.nodes.Server
    properties:
      agent_config:
        user: { get_input: agent_user }
        key: { get_property: [ keypair, private_key_path ] }
      image: { get_input: image }
      flavor: { get_input: flavor }
      management_network_name: { get_input: network_name }
    relationships:
      - type: cloudify.openstack.server_connected_to_keypair
        target: keypair
      - type: cloudify.openstack.server_connected_to_floating_ip
        target: virtual_ip
      - type: cloudify.openstack.server_connected_to_security_group
        target: security_group
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            args:
              security_groups: [{ get_attribute: [ security_group, external_name ]}]
{{< /highlight >}}


An application deployed on Openstack using the openstack VM blueprint:

{{< highlight  yaml >}}

tosca_definitions_version: cloudify_dsl_1_3

imports:
  - openstack_infra--blueprint:openstack_vm

node_templates:
  http_web_server:
    type: openstack_infra--cloudify.nodes.WebServer
    properties:
      port: { get_input: openstack_infra--port }
    relationships:
      - type: openstack_infra--cloudify.relationships.contained_in
        target: openstack_infra--vm
    interfaces:
      cloudify.interfaces.lifecycle:
        configure: scripts/configure.sh
        start: scripts/start.sh
        stop: scripts/stop.sh

outputs:
  http_endpoint:
    description: Web server external endpoint
    value: { concat: ['http://', { get_attribute: [openstack_infra--virtual_ip, floating_ip_address] },
                      ':', { get_property: [http_web_server, openstack_infra--port] }] }
{{< /highlight >}}

And if "hello world" is useful micro service in another service, which need an "hello-world" service in port 8080 and
one in port 9090. That blueprint will look like this:

{{< highlight  yaml >}}

tosca_definitions_version: cloudify_dsl_1_3

imports:
  - port_8080--hello.yaml
  - port_9090--hello.yaml

{{< /highlight >}}

Thanks to those two abilities it's very easy to use shareable building block and distribute them across deployments and
across projects.
