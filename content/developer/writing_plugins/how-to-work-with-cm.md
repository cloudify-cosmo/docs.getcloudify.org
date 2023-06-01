---
title: Integrating Configuration Management Tools
category: Writing Plugins
draft: false
weight: 3000
aliases: /plugins/how-to-work-with-cm/
---

_Note: Checkout the new [Ansible plugin]({{< relref "working_with/official_plugins/Configuration/ansible.md" >}})._

It is common to rely on a configuration management tool to deploy and configure part or all of your deployments, such as Salt, Chef, or Puppet.

There is no single appropriate way to integrate {{< param product_name >}} with a CM. You will want to take advantage of specific features of your own CM, meaning that a one-size-fits-all plugin is impossible. For example, you might use a standalone executions model, while others use a service model such as Puppet Server.

{{< param product_name >}} enables you to orchestrate your repeated actions as they relate to your preferred CM, via the Script plugin or Fabric plugin. For example, if you have an existing Puppet server that operates on the server-agent model, you can use a relationship to add the private IP of the VM to the main manifest, as shown below.

```
relationships:
  cloudify.relationships.compute_managed_by_puppet:
    derived_from: cloudify.relationships.depends_on
    target_interfaces:
      cloudify.interfaces.relationship_lifecycle:
        establish:
          implementation: fabric.fabric_plugin.tasks.run_task
          inputs:
            tasks_file:
              default: script.py
            task_name:
              # this is a python function that opens the main manifest file
              # and adds the vm to the appropriate group
              default: add_vm_to_manifest
            fabric_env: *puppet_server_fabric_env
        unlink:
          implementation: fabric.fabric_plugin.tasks.run_script
          inputs:
            tasks_file:
              default: script.py
            task_name:
              # this is a python function that opens the main manifest file
              # and removes the vm from the appropriate group
              default: remove_vm_from_manifest
            fabric_env: *puppet_server_fabric_env

node_templates:
  puppet_server:
    type: cloudify.nodes.Compute
    properties:
      agent_config:
        install_method: none
      ip: 192.168.122.2

  new_vm:
    type: cloudify.nodes.Compute
    relationships:
      - type: cloudify.relationships.compute_managed_by_puppet
        target:  puppet_server
```

Another approach is to use the CM's standalone command from the Script plugin, as follows.

```
  new_vm:
    type: cloudify.nodes.Compute

  new_application:
    type: cloudify.nodes.Application
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: fabric.fabric_plugin.tasks.run_commands
          inputs:
            commands:
              - puppet apply ~/path/to/puppet/module/manifest
	        fabric_env: *puppet_server_fabric_env

```

You can use the following examples to explore further.

https://github.com/cloudify-examples/puppet-server-agent-blueprint<br>
https://github.com/cloudify-examples/puppet-application-blueprint<br>
