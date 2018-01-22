---
layout: bt_wiki
title: Fabric (SSH) Plugin
category: Plugins
draft: false
abstract: "Cloudify Fabric plugin description and configuration"
weight: 1200

repo_link: https://github.com/cloudify-cosmo/cloudify-fabric-plugin
yaml_link: http://www.getcloudify.org/spec/fabric-plugin/1.3/plugin.yaml
fabric_link: http://docs.fabfile.org
---


You can use the [Fabric]({{< field "fabric_link" >}}) plugin to map operations to SSH commands or Fabric tasks that are included in your blueprint.

The plugin provides an agentless method for running operations on destination hosts. The source code for this plugin is found in [github]({{< field "repo_link" >}}).

{{% gsNote title="Note" %}}
You can specify a custom directory to use as temporary storage for executable files that you do not want to have stored in the `temp dir` directory. Provide an environment variable for the directory that is exported when the plugin runs.
{{% /gsNote %}}



# Plugin Requirements:

* Python versions:
  * 2.7.x
* If access to the Context Proxy (`ctx`) is required within an invoked script, the remote host must have Python's `argparse` installed.

{{% gsNote title="Notes" %}}
* Because the Fabric plugin is used for remote execution, the fact that it doesn't support versions of Python other than 2.7.x is not significant.
* While `argparse` is usually provided out-of-the-box with Python 2.7.x, that is not the case for Python 2.6.x.
* The requirement for `argparse` will be dropped in a future version of the plugin.
{{% /gsNote %}}


# Execution Methods

There are four modes for working with this plugin.

* Executing a list of `commands`.
* Executing a Fabric task from a `tasks_file` that is included in the blueprint's directory.
* Executing a Fabric task by specifying its path in the current Python environment.
* Executing a `script` by specifying the script's path or URL.


# Running Commands
In the following code, the `run_commands` plugin task is used and a list of commands is specified to be executed on the agent host.

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}




# Running Tasks

In the following code, the tasks file path relative to the blueprint's directory is specified, together with the task's name in that file and (optional) task properties that will be used when the task is called.

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}



**Example**

{{< gsHighlight  python  >}}
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
{{< /gsHighlight >}}

# Running Module Tasks
This example is similar to the previous one, with the exception that, if the Fabric task that you want to execute is already installed in the Python environment in which the operation will run, you can specify the Python path to the function.

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}




# Running Scripts

The Fabric plugin can execute scripts remotely and provides access to the `ctx` API for interacting with Cloudify in the same manner as with the [script plugin]({{< relref "plugins/script.md" >}}).

**Example:**

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}

{{% gsNote title="Note" %}}
The `ctx` object can be used in Python scripts executed by the Fabric plugin in the same way it is used in the Script plugin, with a few minor differences. See [ctx for the Fabric Plugin](#ctx-for-the-fabric-plugin) for more information.
{{% /gsNote %}}


## Operation Inputs

Operation inputs passed to the `run_script` task are available as environment variables in the script's execution environment.
Complex data structures such as dictionaries and lists are JSON-encoded when exported as environment variables.

{{% gsNote title="Note" %}}
`fabric_env`, `script_path`, `use_sudo`, `hide_output` and `process` are reserved operation inputs used by the `run_script` task. Therefore, they are not available as environment variables.
{{% /gsNote %}}


## Process Configuration

The `run_script` task accepts a `process` input that enables the process that runs the script to be configured:

* `cwd` - The working directory to use when running the script.
* `args` - List of arguments to pass to the script.
* `command_prefix` - The command prefix to use when running the script. This is not necessary if the script contains the `#!` line.
* `env` - Dictionary of environment variables to be incorporated into the script's process.

Example:

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}


# Executing Commands or Scripts with sudo Privileges

The `run_commands` and `run_script` execution methods both accept a `use_sudo` input (which defaults to `false`). When `true`, the commands or script are executed using `sudo`. This enables, for instance, the use of the `sudo_prefix` Fabric env property to run an alternative implementation of `sudo`. See additional sudo-related configuration that you can apply to your Fabric env [here]({{< field "fabric_link" >}}/en/1.8/usage/output_controls.html).

Following is an example that uses `use_sudo` and `sudo_prefix`:

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}


# Hiding Output

Fabric generates output of its command execution. You can hide some of that output, for example to make your execution logs more readable, or to ignore irrelevant data. To hide output, use the `hide_output` input with any of the four execution methods. The `hide_output` input is a list of `groups` of outputs to hide as specified [here]({{< field "fabric_link" >}}/en/1.8/usage/output_controls.html).
 
An example that uses `hide_output`:

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}
 

# SSH Configuration

The Fabric plugin extracts the correct host IP address based on the node's host. You can set these and additional SSH configuration by passing `fabric_env` to operation inputs. This applies to `run_commands`, `run_task` and `run_module_task`. The `fabric_env` input is passed as-is to the underlying [Fabric]({{< field "fabric_link" >}}/en/1.8/usage/env.html) library. Check their documentation for additional details.


Following is an example that uses `fabric_env`:

{{< gsHighlight  yaml  >}}
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
{{< /gsHighlight >}}

{{% gsTip title="Tip" %}}
Using a tasks file instead of a list of commands enables you to use python code to execute commands. In addition, you will be able to use the `ctx` object to perform actions based on contextual data.

Using a list of commands might be a good solution for very simple cases in which you do not't want to maintain a tasks file.

{{% /gsTip %}}


# ctx for the Fabric Plugin

Starting with Cloudify 3.4 and fabric-plugin 1.4, Cloudify now supports using `ctx` in Python scripts executed by the fabric plugin on remote machines. Most of the functionality is similiar to how the script plugin exposes the `ctx` object.

## Executing ctx Commands

Until now, to use the Fabric plugin to execute Python scripts you had to use `ctx` commands in the following way.

{{< gsHighlight  python  >}}
os.system('ctx logger info Hello!')
{{< /gsHighlight >}}

Now, you can do one of two things to achieve the same result:

{{< gsHighlight  python  >}}
from cloudify import ctx

ctx.logger.info("Hello!")
{{< /gsHighlight >}}

or 

{{< gsHighlight  python  >}}
from cloudify import ctx

ctx('logger info Hello!')
{{< /gsHighlight >}}

The first example shows native `ctx` usage that can be used to perform most of the trivial actions you can perform using the script plugin. For example, using the logger; retrieving runtime properties and setting them for node instances; setting the source/target node instances runtime properties in relationship operations; retrieving node properties; downloading blueprint resources; aborting operations, and so on. 

The second example demonstrates that you can still use `ctx` to execute commands as if you are running it from a bash script.

The most notable difference is that, to get all properties for a node or runtime properties for a node instance, you have to run the following:

{{< gsHighlight  python  >}}
from cloudify import ctx

my_node_properties = ctx.node.properties.get_all()
my_instance_runtime_properties = ctx.instance.runtime_properties.get_all()
{{< /gsHighlight >}}

This is also true for `source` and `target` node properties and node instance runtime properties.
