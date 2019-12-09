---
layout: bt_wiki
title: Ansible Plugin
category: Official Plugins
draft: false
weight: 100
aliases: ["/plugins/ansible/", "/developer/official_plugins/ansible/", "/working_with/official_plugins/Configuration/ansible/"]
---

The Ansible plugin enables you to configure Cloudify resources with Ansible and provides an agentless method for executing operations on remote hosts.

## Playbook Run Operation

Similar to the Script Plugin and the Fabric Plugin, there is no one node type associated with the Ansible plugin. Instead, you modify existing node types to perform one or more of their lifecycle operations using the Ansible plugin and any additiona inputs that you provide.

**Operations**

  * `ansible.cloudify_ansible.tasks.run`
    * `description`: Execute the equivalent of `ansible-playbook` on the Ansible Playbook provided in the `site_yaml_path` input.
    * `inputs`:
      * `site_yaml_path`: A path to your `site.yaml` or `main.yaml` in your Ansible Playbook.
      * `sources`: Your Inventory sources. Either YAML or a path to a file. If not provided the inventory will be take from the `sources` runtime property.
      * `run_data`: Variable values.
      * `options_config`: Command-line options, such as `tags` or `skip_tags`.

In addition, you can provide additional key-word args parameters to the AnsiblePlaybookFromFile class, such as `options_config`.


## Inventory Sources

** There are also two methods for generating the sources parameter automatically, see [using compute nodes](#using-compute-nodes) and [Relationships](#using-relationships).

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
