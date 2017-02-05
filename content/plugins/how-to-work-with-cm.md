Integrating Cloudify with a Configuration Management Tools

Most operations users today rely on a configuration management tool to deploy and configure part or all of their deployments, such as Salt, Ansible, Chef, and Puppet.

There is no single appropriate way to integrate Cloudify with a CM.

Every user takes advantage of different features of their CM that makes a one-size-fits-all plugin impossible. For example, some users use a standalone executions model such as Ansible ad-hoc commands for their CM, while others use a service model such as Puppet Server.

Therefore, we suggest that you use Cloudify to orchestrate your repeated actions as they relate to the CM you use via the Script Plugin or Fabric Plugin.

For example, if you have an existing Puppet Server that operates on the Server-Agent model, you can use a relationship to add the VM private IP to the main manifest:

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

Another approach would be to use the CM's standalone command from the script plugin:

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

We have provided a number of examples to explore further:

https://github.com/cloudify-examples/puppet-server-agent-blueprint
https://github.com/cloudify-examples/puppet-application-blueprint
https://github.com/cloudify-examples/ansible-blueprint
https://github.com/cloudify-examples/windows-ansible-blueprint
...add chef example and salt examples (which we don't have)

