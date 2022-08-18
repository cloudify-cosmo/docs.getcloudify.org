---
title: Terminal Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the **utilities plugin**.
{{% /note %}}


## Description
The terminal plugin provides support for running a sequence of commands and store the results to runtime properties.  The plugin is intended for use with hardware devices with limited shell support and IoT devices. For machines with a full ssh implementation - consider to use [fabric plugin]({{< relref "working_with/official_plugins/Configuration/fabric.md" >}}).

The plugin supports:

  * communication by ssh connection
  * ssh connections with disabled agent on server side

The code base can support overwrite connection from properties by inputs for workflow execution. Therefore, we can support cases where we receive an IP, or some other connection parameters, after creation of nodes. This functionality is used when we create a server in the same blueprint.

## Node types:

### cloudify.terminal.raw
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})


This is node type that describes the terminal.


**Properties:**

  * `terminal_auth` - a dictionary that represent the terminal credentials.

    *type:* cloudify.datatypes.terminal_auth

    **cloudify.datatypes.terminal_auth properties:**
      * `user` - user for instance.
      * `password` - optional, ssh password.
      * `ip` - optional, ip for device or list of ip's if have failback ip's.
      * `key_content` - optional, ssh user key
      * `port` - optional, ssh port,  by default 22
      * `store_logs` - optional, save communication logs in a different file , by default False.
      * `promt_check` - optional, list of prompts accepted from device, by default [].
      * `warnings` - optional, list of possible warnings without new line, by default [].
      * `errors` -  optional, list of possible errors without new line, by default [].
      * `criticals` - optional, list of possible criticals without new line, by default [].
      * `exit_command` - optional, command for close connection, default 'exit'.
      * `smart_device` - optional, use shell extension, by default False.

## Use Examples:

**Example 1: General template for simple list of commands**

```yaml
  node_impl:
    type: cloudify.terminal.raw
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            terminal_auth:
              user: <user for instance>
              password: <optional, password for instance>
              ip: <optional, ip for device or list of ip's if have failback ip's>
              key_content: <optional, ssh key content for instance>
              port: <optional, by default 22>
              errors: <list strings that must raise error if contained in output>
              store_logs: <True |default:False store logs in separete file>
            calls:
              - action: <command for run>
                save_to: <field name for save to runtime properties, optional>
```

**Example 2: General template for simple list of commands called by relationship**

```yaml
relationships:
  cloudify.terminal.raw:
    derived_from: cloudify.relationships.depends_on
    target_interfaces:
      cloudify.interfaces.relationship_lifecycle:
        establish:
          implementation: terminal.cloudify_terminal.tasks.run
          inputs:
            terminal_auth:
              default:
                user: <user for instance>
                password: <optional, password for instance>
                ip: <optional, ip for device or list of ip's if have failback ip's>
                key_content: <optional, ssh key content for instance>
                port: <optional, by default 22>
                errors: <list strings that must raise error if contained in output>
                store_logs: <True |default:False store logs in separete file>
            calls:
              default:
              - action: <command for run>
                save_to: <field name for save to runtime properties, optional>

node_templates:

  fake_node:
    type: cloudify.nodes.Root
    relationships:
      - type: cloudify.terminal.raw
        target: vm_host

  vm_host:
    type: cloudify.terminal.raw
    properties:
      terminal_auth:
        user: <user for instance>
        password: <optional, password for instance>
        ip: <optional, ip for device or list of ip's if have failback ip's>
        key_content: <optional, ssh key content for instance>
        port: <optional, by default 22>
        errors: <list strings that must raise error if contained in output>
        store_logs: <True |default:False store logs in separete file>
```

**Example 3: Cisco ios devices**

```yaml
  ios_impl:
    type: cloudify.terminal.raw
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          inputs:
            terminal_auth:
              user: { get_input: terminal_user } # get user from input
              password: { get_input: terminal_password } # get password from input
              ip: { get_input: terminal_ip } # get ip from input
              key_content: { get_input: terminal_key_content } # get key from input
              port: { get_input: terminal_port } # get port from inputs
              errors:
                - "% " # Any errors have new line '%' with one space in line
            calls:
              - action: show ip http server all # dump all configs for http server
              - action: show ip domain # run show ip for domain command
                save_to: domain # will be saved to ctx.instance.runtime_properties['domain']
```

**Example 4: General template for commands as separate file**

```yaml
  node_impl:
    type: cloudify.terminal.raw
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          inputs:
            terminal_auth:
              user: <user for instance>
              password: <optional, password for instance>
              ip: <optional, instance ip, plugin can get such ip from parent node>
              key_content: <optional, ssh key content for instance>
              port: <optional, by default 22>
              errors: <list strings that must raise error if contained in output>
              promt_check: <optional, list of prompt's>
            calls:
              - template: <template file name>
                params: <optional, list of parameters for your template>
                responses: <optional, list for possible question that required action from user with answers>
              - action: <command in same session>
```

**Example 5: Fortinet devices**

```
  forti_impl:
    type: cloudify.terminal.raw
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          inputs:
            terminal_auth: &terminal_auth
              user: { get_input: terminal_user } # get user from input
              password: { get_input: terminal_password } # get password from input
              ip: { get_input: terminal_ip } # get ip from input
              key_content: { get_input: terminal_key_content } # get key from input
              port: { get_input: terminal_port } # get port from inputs
              promt_check:
                - '#' # as promp use '#'
                - '$' # and also can be '$'
              errors:
                - "Command fail." # error possibly contain "Command fail."
            calls:
              - template: fortigate.txt # file name in same directory as blueprint
                params:
                  system: config system interface # replace {{system}} to 'config system interface'
                responses: # list of responses
                  - question: Do you want to continue? (y/n) # if plugin see 'Do you want to continue? (y/n)'
                    answer: y # plugin will response 'y'
                    newline: false # send new line after response
              - action: aaa # same as previous
```

**Example 6: Full format with all possible fields and properties**

```
  node_impl:
    type: cloudify.terminal.raw
    properties:
      terminal_auth:
        user: <user for instance>
        password: <optional, password for instance>
        ip: <optional, instance ip, plugin can get such ip from parent node>
        key_content: <optional, ssh key content for instance>
        port: <optional, by default 22>
        errors: <list strings that must raise error if contained in output>
        promt_check: <optional, list of prompt's>
        exit_command: <optional, command for run if connection alive after all commands, by default: exit>
    interfaces:
      cloudify.interfaces.lifecycle:
        start: # can be create/configure/start/stop/delete
          inputs:
            terminal_auth: <optional, overwrite values from properties>
              user: <user for instance>
              password: <optional, password for instance>
              ip: <optional, instance ip, plugin can get such ip from parent node>
              key_content: <optional, ssh key content for instance>
              port: <optional, by default 22>
              errors: <list strings that must raise error if contained in output>
              promt_check: <optional, list of prompt's>
            calls:
              - action: <optional, command for run>
                template: <optional, template file name, used only if action is empty>
                params: <optional, list of params for your template>
                responses: <optional, list for possible question that required action from user with answers>
                  - question: <sequence on chars that required some response>
                    answer: <response from plugin>
                    newline: <optional, send new line after response, by default false>
                errors: <optional, list strings that must raise error if contained in output, will overwrite values from terminal_auth>
                promt_check: <optional, list of prompt's, will overwrite values from terminal_auth>

```
**Example 7: Use terminal as hooks**

```yaml
hooks:
- event_type: workflow_succeeded
  implementation: cloudify-utilities-plugin.cloudify_terminal.tasks.run_as_workflow
  inputs:
    logger_file: /tmp/hooks_log.log
    terminal_auth:
      user: centos
      password: passw0rd
      ip: localhost
      port: 22
      smart_device: true
      promt_check:
        - '#'
        - '$'
    calls:
      - action: hostname
        save_to: domain
      - action: uname -a
        save_to: uname

  description: A hook for workflow_succeeded
```


## Examples

* [Cisco](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_terminal/cisco.yaml) - show currently assigned ip's.
* [Cisco](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_terminal/cisco_flash_list.yaml) - list flash contents.
* [Fortigate](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_terminal/fortigate.yaml) - run config commands and unknown command("aaa").
* [SSH to VM](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_terminal/linux-ssh.yaml) - Simple ssh to linux vm with
  `run hostname` and by relationship call `run uptime`.
