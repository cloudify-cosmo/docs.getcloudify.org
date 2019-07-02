---
layout: bt_wiki
title: Terminal Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the [utilities plugin]({{< relref "working_with/official_plugins/Configuration/utilities/_index.md" >}}).
{{% /note %}}

The terminal plugin provides support for running a sequence of commands and storing the results from to runtime properties.  The plugin is intended for use with hardware devices with limited shell support and IoT devices. For machines with a full ssh implementation - consider to use [fabric plugin]({{< relref "working_with/official_plugins/Configuration/fabric.md" >}}).

The plugin supports:

  * communication by ssh connection
  * ssh connections with disabled agent on server side

The code base can support overwrite connection from properties by inputs for workflow execution. Therefore, we can support cases where we receive an IP, or some other connection parameters, after creation of nodes. This functionality is used when we create a server in the same blueprint.


### Examples:

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

**Example 2: Cisco ios devices**

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

**Example 3: General template for commands as separate file**

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

**Example 4: Fortinet devices**

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

**Example 5: Full format with all possible fields and properties**

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
