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
{{% gsSummary %}} {{% /gsSummary %}}


# Description

The [Fabric]({{< field "fabric_link" >}}) plugin can be used to map operations to ssh commands or Fabric tasks that are included in your blueprint.

The plugin provides an agent-less method for running operations on destination hosts. The source code for this plugin can be found at [github]({{< field "repo_link" >}}).


# Plugin Requirements:

* Python versions:
  * 2.7.x


{{% gsNote title="Note" %}}
As the fabric plugin is used for remote execution, the fact that it doesn't support versions of Python other than 2.7.x doesn't really mean much.
{{% /gsNote %}}


## Execution Methods

There are 4 modes for working with this plugin.

* Executing a list of `commands`.
* Executing a Fabric task from a `tasks_file` included in the blueprint's directory.
* Executing a Fabric task by specifying its path in the current python environment.
* Executing a script by specifying the script's path or URL.

# Running commands

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

Here, we use the `run_commands` plugin task and specify a list of commands to execute on the agent host.


# Running tasks

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

Here, we specify the tasks file path relative to the blueprint's directory, the task's name in that file and (optional) task properties
that will be used when actually calling the task.

an example of a tasks file would be:

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

# Running module tasks

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

This example is very similar to the previous one with the following difference. If the fabric task you want to execute is already installed in the python environment in which the operation will run, you can
specify the python path to this function.


# Running scripts

The fabric plugin can execute scripts remotely and provides access to the `ctx` API for interacting with Cloudify in the same manner as the [script plugin]({{< relref "plugins/script.md" >}}) does.

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
            # Path to the script relative to the blueprint directory
            script_path: scripts/start.sh
            MY_ENV_VAR: some-value
{{< /gsHighlight >}}

{{% gsNote title="Note" %}}
The fabric plugin doesn't support evaluating Python scripts as the script plugin does and therefore the `ctx` object cannot be used in Python scripts as the script plugin allows.
Accessing the `ctx` API should be done by calling the `ctx` process. For example: ```os.system('ctx logger info "hello"')```.
{{% /gsNote %}}


## Operation Inputs

Operation inputs passed to the `run_script` task will be available as environment variables in the script's execution environment.
Complex data structures such as dictionaries and lists will be JSON encoded when exported as environment variables.

{{% gsNote title="Note" %}}
`fabric_env`, `script_path` and `process` are reserved operation inputs used by the `run_script` task and therefore won't be available as environment variables.
{{% /gsNote %}}


## Process Configuration

The `run_script` task accepts a `process` input which allows configuring the process which runs the script:

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


# SSH configuration
The fabric plugin will extract the correct host IP address based on the node's host. It will also use the username and key file path if they were set globally during the bootstrap process. However, it is possible to override these values and additional SSH configuration by passing `fabric_env` to operation inputs. This applies to `run_commands`, `run_task` and `run_module_task`. The `fabric_env` input is passed as is to the underlying [Fabric]({{< field "fabric_link" >}}/en/latest/usage/env.html) library, so check their documentation for additional details.


An example that uses `fabric_env`:

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
Using a tasks file instead of a list of commands will allow you to use python code to execute commands. In addition, you would be able to use the `ctx` object to perform actions based on contextual data.

Using a list of commands might be a good solution for very simple cases in which you wouldn't want to maintain a tasks file.

{{% /gsTip %}}
