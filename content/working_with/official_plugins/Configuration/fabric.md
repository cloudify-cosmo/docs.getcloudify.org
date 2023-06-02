---
title: Fabric (SSH) Plugin
category: Official Plugins
draft: false
abstract: "Fabric plugin description and configuration"
description: You can use the Fabric plugin to map operations to SSH commands or Fabric tasks that are included in your blueprint.
weight: 100
aliases:
  - /plugins/fabric/
  - /developer/official_plugins/fabric/

repo_link: https://github.com/cloudify-cosmo/cloudify-fabric-plugin
yaml_link: http://www.getcloudify.org/spec/fabric-plugin/1.3/plugin.yaml
fabric_link: http://docs.fabfile.org
---


You can use the [Fabric]({{< field "fabric_link" >}}) plugin to map operations to SSH commands or Fabric tasks that are included in your blueprint.

The plugin provides an agentless method for running operations on destination hosts. The source code for this plugin is found in [github]({{< field "repo_link" >}}).

{{% note title="Note" %}}
You can specify a custom directory to use as temporary storage for executable files that you do not want to have stored in the `temp dir` directory. Provide an environment variable for the directory that is exported when the plugin runs.
{{% /note %}}

{{% note title="Note" %}}
Recently, fabric plugin 2.0.4 was released, it uses fabric 2.5.0.
On every section, notes were added regarding using the new version of fabric.
If there are no notes, the usage is same on both versions.
{{% /note %}}


# Plugin Requirements(1.X):

* Python versions:
  * 2.7.x
* If access to the Context Proxy (`ctx`) is required within an invoked script, the remote host must have Python's `argparse` installed.

{{% note title="Notes" %}}
* Because the Fabric plugin is used for remote execution, the fact that it doesn't support versions of Python other than 2.7.x is not significant.
* While `argparse` is usually provided out-of-the-box with Python 2.7.x, that is not the case for Python 2.6.x.
* The requirement for `argparse` will be dropped in a future version of the plugin.
{{% /note %}}


# Execution Methods

There are four modes for working with this plugin.

* Executing a list of `commands`.
* Executing a Fabric task from a `tasks_file` that is included in the blueprint's directory.
* Executing a Fabric task by specifying its path in the current Python environment.
* Executing a `script` by specifying the script's path or URL.


# Running Commands
In the following code, the `run_commands` plugin task is used and a list of commands is specified to be executed on the agent host.

{{< highlight  yaml  >}}
imports:
    - {{< field "yaml_link" >}}

node_templates:
  example_node:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
          start:
            implementation: fabric.fabric_plugin.tasks.run_commands
            inputs:
              commands:
                - echo "source ~/myfile" >> ~/.bashrc
                - apt-get install -y python-dev git
                - pip install my_module
{{< /highlight >}}




# Running Tasks

In the following code, the tasks file path relative to the blueprint's directory is specified, together with the task's name in that file and (optional) task properties that will be used when the task is called.

{{< highlight  yaml  >}}
imports:
    - {{< field "yaml_link" >}}

node_templates:
  example_node:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: fabric.fabric_plugin.tasks.run_task
          inputs:
            tasks_file: my_tasks/tasks.py
            task_name: install_nginx
            task_properties:
              important_prop1: very_important
              important_prop2: 300
{{< /highlight >}}



**Examples**

***Fabric 1.X:***

{{< highlight  python  >}}
#my_tasks/tasks.py
from fabric.api import run, put
from cloudify import ctx

def install_nginx(important_prop1, important_prop2):
    ctx.logger.info('Installing nginx. Some important props:'
                    ' prop1: {0}, prop2: {1}'
                    .format(important_prop1, important_prop2))
    run('sudo apt-get install nginx')


def configure_nginx(config_file_path):
    # configure the webserver to run with our premade configuration file.
    conf_file = ctx.download_resource(config_file_path)
    put(conf_file, '/etc/nginx/conf.d/')


def start_nginx(ctx):
    run('sudo service nginx restart')
{{< /highlight >}}

{{% note title="Note" %}}
On fabric 2.X, the tasks should have the connection as first argument and a @task decorator.Moreover, the imports are different(import fabric2).
{{% /note %}}

***Fabric 2.X:***

{{< highlight  python  >}}
#my_tasks/tasks.py
from fabric2 import task
from cloudify import ctx

@task
def install_nginx(connection, important_prop1, important_prop2):
    ctx.logger.info('Installing nginx. Some important props:'
                    ' prop1: {0}, prop2: {1}'
                    .format(important_prop1, important_prop2))
    connection.run('sudo apt-get install nginx')

@task
def configure_nginx(connection, config_file_path):
    # configure the webserver to run with our premade configuration file.
    conf_file = ctx.download_resource(config_file_path)
    connection.put(conf_file, '/etc/nginx/conf.d/')

@task
def start_nginx(connection, ctx):
    connection.run('sudo service nginx restart')
{{< /highlight >}}


# Running Module Tasks
This example is similar to the previous one, with the exception that, if the Fabric task that you want to execute is already installed in the Python environment in which the operation will run, you can specify the Python path to the function.

{{< highlight  yaml  >}}
imports:
    - {{< field "yaml_link" >}}

node_templates:
  example_node:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: fabric.fabric_plugin.tasks.run_module_task
          inputs:
            task_mapping: some_package.some_module.install_nginx
            task_properties:
              important_prop1: very_important
              important_prop2: 300
{{< /highlight >}}


# Running Scripts

The Fabric plugin can execute scripts remotely and provides access to the `ctx` API for interacting with {{< param product_name >}} in the same manner as with the [script plugin]({{< relref "working_with/official_plugins/Configuration/script.md" >}}).

**Example:**

{{< highlight  yaml  >}}
node_templates:
  example_node:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: fabric.fabric_plugin.tasks.run_script
          inputs:
            # Path to the script relative to the blueprint directory
            script_path: scripts/start.sh
            MY_ENV_VAR: some-value
{{< /highlight >}}

{{% note title="Note" %}}
The `ctx` object can be used in Python scripts executed by the Fabric plugin in the same way it is used in the Script plugin, with a few minor differences. See [ctx for the Fabric Plugin](#ctx-for-the-fabric-plugin) for more information.
{{% /note %}}


## Operation Inputs

Operation inputs passed to the `run_script` task are available as environment variables in the script's execution environment.
Complex data structures such as dictionaries and lists are JSON-encoded when exported as environment variables.

{{% note title="Note" %}}
`fabric_env`, `script_path`, `use_sudo`, `hide_output` and `process` are reserved operation inputs used by the `run_script` task. Therefore, they are not available as environment variables.
{{% /note %}}


Both 2.x & 1.x fabric plugins support the same operation inputs mentioned above. However, the following operation inputs are special cases:

- `fabric_env`
- `hide_output`

The reason for that, because fabric 2.x plugin is using different fabric version and API from the one used by fabric 1.x plugin.

***fabric_env***

fabric 2.x plugin accept two forms of `fabric_env` values:

- `fabric 2.x` (original values of fabric_env supported by fabric 2.x plugin)
- `fabric 1.x` (backward compatible with fabric 1.x plugin)

***Fabric 2.x***

The `fabric_env` supported values of fabric 2.x input are the following:

 - `host`: __String__. The hostname (or IP address) of connection.
 - `user`: __String__. The login user for the remote connection.
 - `port`: __String__. The remote port. Default: 22
 - `connect_timeout`: __Integer__: Time out for connection. Default is 10
 - `connect_kwargs`: __Dict__. Configurations related to ssh connection.
     - `pkey`: __String__: Private key to use for authentication.
     - `key_filename`: __String__: Private key file name.
     - `password`: __String__: Used for password authentication.
     - `allow_agent`: __Boolean__: Connecting to the SSH agent. Default: False
     - `look_for_keys`: __Boolean__: Searching for discoverable private key files in ``~/.ssh/``. Default: True
     - `compress`: __Boolean__: Control compression. Default: False
     - `gss_auth`: __Boolean__: Whether to use GSS-API authentication. Default: False
     - `gss_kex`: __Boolean__: Perform GSS-API Key Exchange and user authentication. Default: False
     - `gss_deleg_creds`: __Boolean__: Delegate GSS-API client credentials or not. Default: True
     - `gss_host`: __String__: The targets name in the kerberos database. Default: host
     - `banner_timeout`: __Float__: An optional timeout (in seconds) to wait for the SSH banner to be presented.
     - `auth_timeout`: __Float__: An optional timeout (in seconds) to wait for an authentication response.
     - `gss_trust_dns`: __Boolean__: Indicates whether or not the DNS is trusted to securely canonicalize the name of the host being connected to. Default: True
     - `passphrase`: __String__: Used for decrypting private keys.
     - `disabled_algorithms`: __Dict__: An optional dict passed directly to `.Transport`.
 - `run`: __Dict__. Configuration related to invoked commands.
     - `asynchronous`: __Boolean__: Whether to enable asynchronous behavior for invoking commands. Default: False
     - `disown`: __Boolean__: When set to `True`, returns immediately like ``asynchronous=True``, but does not perform any background work related to that subprocess (it is completely ignored). Default: False
     - `dry`: __Boolean__: Echo commands instead of running. Default: False
     - `echo`: __Boolean__: Controls whether `.run` prints the command string to local stdout. Default: False
     - `encoding`: __String__: The string encoding used by the local shell environment. Default: interpreter-local default text encoding.
     - `env`: __Dict__. The shell environment used for execution
     - `fallback`: __Boolean__: Controls auto-fallback behavior re: problems offering a pty when
     - `pty`: __Boolean__: A boolean describing whether the subprocess was invoked with a pty `pty=True`. Default: True.
     - `replace_env`: __Boolean__: When `True`, causes the subprocess to receive the dictionary given to `env` as its entire shell environment, instead of updating a copy of `os.environ`. Default: False.
     - `shell`: __String__: The shell binary used for execution. Default: `/bin/bash` on Unix, `COMSPEC` or `cmd.exe` on Windows.
     - `warn`: __Boolean__: Whether to warn and continue, instead of raising UnexpectedExit , when the executed command exits with a nonzero status. Default: False
 - `sudo`: __Dict__. Configuration required to invoke commands with `sudo`.
    - `password`: __String__: The password for run sudo. Default: Get the value from connect_kwargs['password']
    - `user`: __String__:  The user for run sudo. Default: Get the value from connect_kwargs['password']
    - `prompt`: __String__: The pattern for password prompt. Default. "[sudo] password: "
 - `timeouts`: __Dict__. Timeout configurations
     - `connect`: __Integer__: Time out for connection. Default is 10
     - `command`: __Integer__ Time out for command execution.
 - `forward_agent`: __Boolean__. Whether to attempt forwarding of your local SSH authentication agent to the remote end. Default: False
 - `gateway`: __String__. The hostname (or IP address) of jump host to make connection from.
 - `inline_ssh_env`: __Boolean__. Whether to send environment variables "inline" as prefixes in front of command strings (`export VARNAME=value && mycommand here`). Default: False
 - `load_ssh_configs`: __Boolean__. Whether to automatically seek out SSH config files. When False, no automatic loading occurs. Default: False.
 - `ssh_config_path`: __String__. SSH config file path.

***Fabric 1.x***

The following values of `fabric_env` in fabric 1.x plugin backward compatible with fabric 2.x plugin:

 - `host_string`: __String__. The hostname (or IP address) of connection.
 - `user`: __String__. The login user for the remote connection.
 - `port`: __String__. The remote port. Default: 22
 - `password`: __String__: Used for password authentication.
 - `key_filename`: __String__: Private key file name.
 - `key`: __String__: Private key to use for authentication.
 - `always_use_pty`:__Boolean__: A boolean describing whether the subprocess was invoked with a pty `always_use_pty=True`. Default: True.
 - `gateway`: __String__. The hostname (or IP address) of jump host to make connection from.
 - `forward_agent`: Whether to attempt forwarding of your local SSH authentication agent to the remote end. Default: False
 - `no_agent`: __Boolean__: Connecting to the SSH agent. Default: True
 - `ssh_config_path`: __String__. SSH config file path.
 - `sudo_password`: __String__: The password for run sudo. Default: Get the value from 'password'
 - `sudo_prompt`: __String__: The pattern for password prompt. Default. "[sudo] password: "
 - `timeout`: __Integer__: Time out for connection. Default is 10.
 - `command_timeout`: __Integer__ Time out for command execution.
 - `use_ssh_config`: __Boolean__. Whether to automatically seek out SSH config files. When False, no automatic loading occurs. Default: False.
 - `warn_only`: __Boolean__: Whether to warn and continue, instead of raising UnexpectedExit , when the executed command exits with a nonzero status. Default: False

***hide_output***

fabric 2.x plugin accept two forms of `hide_output` values:

- `fabric 2.x` (original values of hide_output supported by fabric 2.x plugin)
- `fabric 1.x` (backward compatible with fabric 1.x plugin)

***Fabric 2.x***

The `hide_output` supported values of fabric 2.x input are the following:

- `stdout/out`: Hide the stdout from appear in the logs.
- `stderr/err`: Hide the stderr from appear in the logs.
- `both`: Hide both of them.
- `None`: Do not hide anything. Default

By default, hide_output is turned off.

***Fabric 1.x***

Fabric 1.x plugin supports range of values of `hide_output` that does not support by Fabric 2.x plugin. However, Fabric 2.x plugin do a translation to make it work with fabric 2.x plugin.

The translation happened as the following:

- `status` ---> `stdout`
- `aborts` ---> `stdout`
- `warnings` ---> `stdout`
- `running` ---> `stdout`
- `user` ---> `stdout`
- `everything` ---> ['stdout', 'stderr']

{{% note title="Note" %}}
`hide_output` for fabric 2.x are only supported for `run_script` & `run_commands`
{{% /note %}}

## Process Configuration

The `run_script` task accepts a `process` input that enables the process that runs the script to be configured:

* `cwd` - The working directory to use when running the script.
* `args` - List of arguments to pass to the script.
* `command_prefix` - The command prefix to use when running the script. This is not necessary if the script contains the `#!` line.
* `env` - Dictionary of environment variables to be incorporated into the script's process.

Example:

{{< highlight  yaml  >}}
node_templates:
  example_node:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: fabric.fabric_plugin.tasks.run_script
          inputs:
            script_path: scripts/start.sh
            # Optional
            process:
              # Optional
              cwd: /home/ubuntu
              # Optional
              command_prefix:
              # Optional
              args: [--arg1, --arg2, arg3]
              # Optional
              env:
                MY_VAR_1: my_value_1
                MY_VAR_2: my_value_2
{{< /highlight >}}


# Executing Commands or Scripts with sudo Privileges

The `run_commands` and `run_script` execution methods both accept a `use_sudo` input (which defaults to `false`). When `true`, the commands or script are executed using `sudo`.
For fabric 1.X ,this enables, for instance, the use of the `sudo_prefix` Fabric env property to run an alternative implementation of `sudo`. See additional sudo-related configuration that you can apply to your Fabric env [here]({{< field "fabric_link" >}}/en/1.8/usage/output_controls.html).
Following is an example that uses `use_sudo` and `sudo_prefix`:

{{< highlight  yaml  >}}
imports:
    - {{< field "yaml_link" >}}

node_templates:
  example_node:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
          create:
            implementation: fabric.fabric_plugin.tasks.run_commands
            inputs:
              commands:
                - apt-get install -y python-dev git
                - echo 'config' > /etc/my_config
              # if `use_sudo` is omitted, it defaults to `false`
              use_sudo: true
              fabric_env:
                host_string: 10.10.1.10
                user: some_username
                password: some_password
                sudo_prefix: 'mysudo -c'
{{< /highlight >}}

{{% note title="Note" %}}
On fabric 2.X  there is no global env dictionary like on fabric 1.X, so sudo_prefix cant be passed.
For more information about the fabric_env in version 2.X see [SSH Configuration](#ssh-configuration).
{{% /note %}}


# Hiding Output(1.X version only)

Fabric generates output of its command execution. You can hide some of that output, for example to make your execution logs more readable, or to ignore irrelevant data. To hide output, use the `hide_output` input with any of the four execution methods. The `hide_output` input is a list of `groups` of outputs to hide as specified [here]({{< field "fabric_link" >}}/en/1.8/usage/output_controls.html).

An example that uses `hide_output`:

{{< highlight  yaml  >}}
imports:
    - {{< field "yaml_link" >}}

node_templates:
  example_node:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: fabric.fabric_plugin.tasks.run_script
          inputs:
            # Path to the script relative to the blueprint directory
            script_path: scripts/start.sh
            MY_ENV_VAR: some-value
            # If omitted, nothing will be hidden
            hide_output:
              - running
              - warnings
{{< /highlight >}}


# Exception Handling (2.X version only)

Fabric might generate an exception if there is a problem with the execution. By default, all of the exceptions are considered recoverable but you can control that with a provided list of error codes to change that to be non-recoverable. The `non_recoverable_error_exit_codes` input is a list of `exit_codes`.

An example that uses `non_recoverable_error_exit_codes`:

{{< highlight  yaml  >}}
imports:
    - plugin:cloudify-fabric-plugin

node_templates:
  example_node:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: fabric.fabric_plugin.tasks.run_commands
          inputs:
            commands: [df /mdf]
            non_recoverable_error_exit_codes:
              - 1
              - 2
            fabric_env:
              host_string: 192.168.10.13
              user: some_username
              key_filename: /path/to/key/file            
{{< /highlight >}}


# SSH Configuration

## version 1.X:

The Fabric plugin extracts the correct host IP address based on the node's host. You can set these and additional SSH configuration by passing `fabric_env` to operation inputs. This applies to `run_commands`, `run_task` and `run_module_task`. The `fabric_env` input is passed as-is to the underlying [Fabric]({{< field "fabric_link" >}}/en/1.8/usage/env.html) library. Check their documentation for additional details.


Following is an example that uses `fabric_env`:

{{< highlight  yaml  >}}
imports:
    - {{< field "yaml_link" >}}

node_templates:
  example_node:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: fabric.fabric_plugin.tasks.run_commands
          inputs:
            commands: [touch ~/my_file]
            fabric_env:
              host_string: 192.168.10.13
              user: some_username
              key_filename: /path/to/key/file
{{< /highlight >}}

## version 2.X:

On fabric 2.X there is no global env dictionary, instead [Connection](https://docs.fabfile.org/en/2.5/api/connection.html) is being used.
On this version of the plugin, `fabric_env` dictionary is actually the arguments to set the Connection object.

Example:

{{< highlight  yaml  >}}
imports:
    - plugin:cloudify-fabric-plugin

node_templates:
  example_node:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: fabric.fabric_plugin.tasks.run_commands
          inputs:
            commands: [touch ~/my_file]
            fabric_env:
              host: 192.168.10.13
              user: some_username
              key_filename: /path/to/key/file
{{< /highlight >}}

Note that `password` can be passed too, the fabric plugin will pack the password/key into connect_kwargs.  
Also, for users which used 1.X  fabric plugin, `host_string` will be treated as `host`.
If `key` is received(which not exists on fabric2), the fabric plugin will load the key into `connect_kwargs['pkey']`.

{{% note title="Note" %}}
As on version 1.X, the Fabric plugin extracts the correct host IP address based on the node's host if one of the above not set.
{{% /note %}}


{{% tip title="Tip" %}}
Using a tasks file instead of a list of commands enables you to use python code to execute commands. In addition, you will be able to use the `ctx` object to perform actions based on contextual data.

Using a list of commands might be a good solution for very simple cases in which you do not want to maintain a tasks file.

{{% /tip %}}

{{% warning title="Warning" %}}
using `~` in the file path of `key_filename` is not supported!
{{% /warning %}}

# ctx for the Fabric Plugin

{{< param product_name >}} supports using `ctx` in Python scripts executed by the fabric plugin on remote machines. Most of the functionality is similar to how the script plugin exposes the `ctx` object.

## Executing ctx Commands

Until now, to use the Fabric plugin to execute Python scripts you had to use `ctx` commands in the following way.

{{< highlight  python  >}}
os.system('ctx logger info Hello!')
{{< /highlight >}}

Now, you can do one of two things to achieve the same result:

{{< highlight  python  >}}
from cloudify import ctx

ctx.logger.info("Hello!")
{{< /highlight >}}

or

{{< highlight  python  >}}
from cloudify import ctx

ctx('logger info Hello!')
{{< /highlight >}}

The first example shows native `ctx` usage that can be used to perform most of the trivial actions you can perform using the script plugin. For example, using the logger; retrieving runtime properties and setting them for node instances; setting the source/target node instances runtime properties in relationship operations; retrieving node properties; downloading blueprint resources; aborting operations, and so on.

The second example demonstrates that you can still use `ctx` to execute commands as if you are running it from a bash script.

The most notable difference is that, to get all properties for a node or runtime properties for a node instance, you have to run the following:

{{< highlight  python  >}}
from cloudify import ctx

my_node_properties = ctx.node.properties.get_all()
my_instance_runtime_properties = ctx.instance.runtime_properties.get_all()
{{< /highlight >}}

This is also true for `source` and `target` node properties and node instance runtime properties.
