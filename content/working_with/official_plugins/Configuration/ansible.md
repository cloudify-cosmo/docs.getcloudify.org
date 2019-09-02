---
layout: bt_wiki
title: Ansible Plugin
category: Official Plugins
draft: false
weight: 100
aliases:
    - /plugins/ansible/
    - /developer/official_plugins/ansible/
---

The Ansible plugin enables you to configure Cloudify resources with Ansible and provides an agentless method for executing operations on remote hosts.

## Playbook Run Operation

Running Playbook can be done using one of the following options:

 1. Use `ansible.cloudify_ansible.tasks.run` directly which is similar tothe Script Plugin and the Fabric Plugin, which allows user to modify existing node types to perform one or more of their lifecycle operations using the Ansible plugin and any additiona inputs that you provide.
 
 2. Use `cloudify.nodes.ansible.Executor` node type which runs `ansible.cloudify_ansible.tasks.run` in start operation. 
     
**Operations**

  * `ansible.cloudify_ansible.tasks.run`
    * `description`: Execute the equivalent of `ansible-playbook` on the Ansible Playbook provided in the `site_yaml_path` input.
    * `inputs`:
      * `playbook_path`: A path to your `site.yaml` or `main.yaml` in your Ansible Playbook
      * `site_yaml_path`: DEPRECATED. A path to your `site.yaml` or `main.yaml` in your Ansible Playbook.
      * `sources`: Your Inventory sources. Either YAML or a path to a file. If not provided the inventory will be take from the `sources` runtime property.
      * `run_data`: Variable values.
      * `options_config`: Command-line options, such as `tags` or `skip_tags`.
      * `ansible_env_vars`: A dictionary of environment variables to set.
      * `debug_level`: Debug level.
      * `additional_args`: Additional args that you want to use, for example, '-c local'.
      * `save_playbook`: Save playbook after action.
      * `remerge_sources`: Update sources on target node.
      * `ansible_become`: A boolean value, `true` or `false` whether to assume the user privileges.
       

In addition, you can provide additional key-word args parameters to the AnsiblePlaybookFromFile class, such as `options_config`.

## Node Types

## **cloudify.nodes.ansible.Executor**

This node type used in order to run ansible playbook

**Properties**

  * `playbook_path`: A path to your `site.yaml` or `main.yaml` in your Ansible Playbook
  * `site_yaml_path`: DEPRECATED. A path to your `site.yaml` or `main.yaml` in your Ansible Playbook.
  * `sources`: Your Inventory sources. Either YAML or a path to a file. If not provided the inventory will be take from the `sources` runtime property.
  * `run_data`: Variable values.
  * `options_config`: Command-line options, such as `tags` or `skip_tags`.
  * `ansible_env_vars`: A dictionary of environment variables to set.
  * `debug_level`: Debug level.
  * `additional_args`: Additional args that you want to use, for example, '-c local'.
  * `save_playbook`: Save playbook after action.
  * `remerge_sources`: Update sources on target node.
  * `ansible_become`: A boolean value, `true` or `false` whether to assume the user privileges.


**Operations**

  * `cloudify.interfaces.lifecycle.start`: Run `ansible.cloudify_ansible.tasks.run` operation
  * `cloudify.interfaces.lifecycle.delete`: Run `ansible.cloudify_ansible.tasks.cleanup` operation

**Relationships**

  * `cloudify.ansible.relationships.connected_to_host`:
    * Any node template derived from `cloudify.nodes.Compute`.

### Executor Examples

```yaml
 ansible_playbook:
    type: cloudify.nodes.ansible.Executor
    properties:
      playbook_path: { get_input: site_yaml_relative_path }
    relationships:
      - type: cloudify.ansible.relationships.connected_to_host
        target: web
        source_interfaces:
          cloudify.interfaces.relationship_lifecycle:
            preconfigure:
              inputs:
                group_name: webservers
                hostname: web
                host_config:
                  ansible_host: { get_input: webserver_vm_ip }
                  ansible_user: { get_property: [ webserver_vm, agent_config, user ] }
                  ansible_ssh_private_key_file: { get_property: [ webserver_vm, agent_config, key ] }
                  ansible_become: true
      - type: cloudify.ansible.relationships.connected_to_host
        target: db
        source_interfaces:
          cloudify.interfaces.relationship_lifecycle:
            preconfigure:
              inputs:
                group_name: dbservers
                hostname: db
                host_config:
                  ansible_host: { get_input: dbserver_vm_ip }
                  ansible_user: { get_property: [ dbserver_vm, agent_config, user ] }
                  ansible_ssh_private_key_file: { get_property: [ dbserver_vm, agent_config, key ] }
                  ansible_become: true

  webserver_vm:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_input: webserver_vm_ip }
      agent_config:
        install_method: none
        key: { get_input: web_private_key }
        user: { get_input: username }

  dbserver_vm:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_input: dbserver_vm_ip }
      agent_config:
        install_method: none
        key: { get_input: db_private_key }
        user: { get_input: username }

```

## **cloudify.nodes.ansible.Playbook**

This node type holds configuration for the Ansible Playbook and effective with
 `cloudify.ansible.relationships.run_on_host` relationship

**Properties**

  Same node properties of `cloudify.nodes.ansible.Executor`

**Operations**

  * `cloudify.interfaces.lifecycle.configure`: Run `ansible.cloudify_ansible.tasks.set_playbook_config` operation

**Relationships**

  * `cloudify.ansible.relationships.run_on_host`:
    * Any node template derived from `cloudify.nodes.Compute`.

Note:

    - cloudify.ansible.relationships.run_on_host: Uses establish operation to run ansible playbook in each host
    - cloudify.ansible.relationships.connected_to_host: Uses preconfigure operation in order to get sources from host and then to be used later on by the `Executor`
     

### Playbook Examples

```yaml
  ansible_playbook:
    type: cloudify.nodes.ansible.Playbook
    properties:
      playbook_path: { get_input: site_yaml_relative_path }
    relationships:
      - type: cloudify.ansible.relationships.run_on_host
        target: dbserver_vm
        source_interfaces:
          cloudify.interfaces.relationship_lifecycle:
            establish:
              inputs:
                sources:
                  dbservers:
                    hosts:
                      db:
                        ansible_host: { get_input: dbserver_vm_ip }
                        ansible_user: { get_input: username }
                        ansible_ssh_private_key_file: { get_property: [ dbserver_vm, agent_config, key ] }
                        ansible_become: True
                        ansible_ssh_common_args: -o StrictHostKeyChecking=no
      - type: cloudify.ansible.relationships.run_on_host
        target: webserver_vm
        source_interfaces:
          cloudify.interfaces.relationship_lifecycle:
            establish:
              inputs:
                sources:
                  webservers:
                    hosts:
                      web:
                        ansible_host: { get_property: [ webserver_vm, ip ] }
                        ansible_user: { get_input: username }
                        ansible_ssh_private_key_file: { get_property: [ webserver_vm, agent_config, key ] }
                        ansible_become: True
                        ansible_ssh_common_args: -o StrictHostKeyChecking=no
                options_config:
                  extra_vars:
                    db_config:
                      host: { get_input: dbserver_vm_ip }
                      dbuser: foouser
                      dbpassword: abc

  webserver_vm:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_input: webserver_vm_ip }
      agent_config:
        install_method: none
        key: { get_input: web_private_key }
        user: { get_input: username }

  dbserver_vm:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_input: dbserver_vm_ip }
      agent_config:
        install_method: none
        key: { get_input: db_private_key }
        user: { get_input: username }
```

`Note:` In the above example, each of the operation `cloudify.ansible.relationships.run_on_host` will run `ansible-playbook`    

## Inventory Sources

** There are also two methods for generating the sources parameter automatically, see [using compute nodes](#using-compute-nodes) and [Relationships](#using-relationships).**

For all inventory sources, we require these parameters:

  * `ansible_host`: The hostname or IP address of the host to SSH into.
  * `ansible_user`: The username to SSH with.
  * `ansible_ssh_private_key_file`: The private key file to SSH with.

In addition, we handle these parameters if provided (and highly recommend them):

  * `ansible_become`: A boolean value, `true` or `false` whether to assume the user privileges.
  * `ansible_ssh_common_args`: Additional arguments to the SSH command like, we suggest, `'-o StrictHostKeyChecking=no'`.

For more information on the sources format in YAML, see [Ansible Inventory YAML](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#hosts-and-groups).


## Using Compute Nodes

If your operation is mapped on the lifecycle operation of a node template derived from `cloudify.nodes.Compute`, we will attempt to generate the `sources` parameter from the node properties.

### Example Compute Node

Provision some component on a VM.

```yaml
  compute_and_component:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_input: ip }
      agent_config:
        install_method: none
        key: { get_input: private_key_path }
        user: { get_input: username }
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: ansible.cloudify_ansible.tasks.run
          inputs:
            site_yaml_path: resources/component/site.yaml
```


## Using Relationships

Use the `cloudify.ansible.relationships.connected_to_host` relationship defined in the plugin to populate the sources parameter, if the target node is derived from `cloudify.nodes.Compute`.

### Example Relationship Usage

```yaml
  component:
    type: cloudify.nodes.Root
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: ansible.cloudify_ansible.tasks.run
          inputs:
            site_yaml_path: resources/component/site.yaml
            sources: { get_attribute: [ SELF, sources ] }
    relationships:
      - type: cloudify.ansible.relationships.connected_to_host
        target: compute

  compute:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_input: ip }
      agent_config:
        install_method: none
        key: { get_input: private_key_path }
        user: { get_input: username }
```


## More Examples

Basic usage with no special node or relationship type behavior.

```yaml
  my_node:
    type: cloudify.nodes.Root
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: ansible.cloudify_ansible.tasks.run
          inputs:
            site_yaml_path: resources/my_ansible_playbook/site.yaml
            sources:
              webservers:
                hosts:
                  web:
                    ansible_host: { get_input: ip }
                    ansible_user: { get_input: username }
                    ansible_ssh_private_key_file: { get_input: private_key_path }
                    ansible_become: true
                    ansible_ssh_common_args: '-o StrictHostKeyChecking=no'
```

Passing `run_data` at runtime:

```yaml
  component:
    type: cloudify.nodes.Root
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: ansible.cloudify_ansible.tasks.run
          inputs:
            site_yaml_path: resources/my_ansible_playbook/site.yaml
            sources:
              foo_group:
                hosts:
                  foo_host:
                    ansible_host: { get_input: ip }
                    ansible_user: { get_input: username }
                    ansible_ssh_private_key_file: { get_input: private_key_path }
                    ansible_become: true
                    ansible_ssh_common_args: '-o StrictHostKeyChecking=no'
            run_data:
              foo: bar
```
