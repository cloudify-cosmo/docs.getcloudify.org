---

title: Agent Packager
category: Agents
draft: false
weight: 220

virtualenv_link: http://virtualenv.readthedocs.org/en/latest/virtualenv.html
celery_link: http://www.celeryproject.org/
plugins_common_api_link: /apis/plugins-common

---

{{% gsSummary %}} {{% /gsSummary %}}

# Overview

Cloudify's Agent is basically a [virtualenv]({{< field "virtualenv_link" >}}) with a series of modules installed in it and (optionally) a few configuration files attached.

To use Cloudify with distributions other than the [officially supported ones]({{< relref "agents/overview.md#provided-agent-packages" >}}), we're providing an [Agent-Packager tool](https://github.com/cloudify-cosmo/cloudify-agent-packager) that will assist you in creating an agent for your distribution.

This tool aims to:

- Solve the problem of compiling module requirements on different distributions, thus bridging the gap of user compiled images, unfamiliar/minor distros and so on.
- Allow users to create their own, personalized Cloudify agents with custom plugins of their choosing.
- Make the agent creation process seamless. One config file. One liner cmd.
- Allow users to override any existing mandatory (or else) modules and provide their own.

You can use Cloudify's agent-packager to create an agent on the distribution you're running so that modules that require compilation will use your distribution and compilers to do so.

{{% gsWarning title="Note" %}}
As Cloudify's code currently only supports Python 2.7.x or Python 2.6.x, you will have to run one of those to create an agent.
{{% /gsWarning %}}

{{% gsWarning title="Note" %}}
Currently, not all of Cloudify's Plugins can run on Python 2.6.x. Only basic modules and plugins are currently fitted to run on Python 2.6.x. To see whether a plugin supports your Python version, please see the documentation for the plugin you're looking to use.
{{% /gsWarning %}}

# Creation Process

During the creation process, the agent-packager performs the following:

* Creates a virtualenv using the python binary of your choice.
* Installs mandatory external modules into the virtualenv.
* Installs modules from a provided requirements.txt file.
* Installs mandatory and optional Cloudify plugins and modules into the virtualenv.
* Installs the `cloudify-agent` module into the virtualenv.
* Installs any additional user chosen Cloudify plugins and Python modules into the virtualenv.
* Validates that all specified modules were installed.
* Generates an `included_plugins.py` file. This will be used by the `cloudify-agent` module to automatically load all plugins specified in the file.
* Creates a tar file containing the virtualenv.


{{% gsNote title="Note" %}}
The tool will create a tar file to be used in Cloudify's linux based environments. For other environments, a different type of agent might be required.
{{% /gsNote %}}

# Installation

{{< gsHighlight  bash  >}}
pip install cloudify-agent-packager
{{< /gsHighlight >}}

For development purposes:

{{< gsHighlight  bash  >}}
pip install https://github.com/cloudify-cosmo/cloudify-agent-packager/archive/master.tar.gz
{{< /gsHighlight >}}


# Usage

IMPORTANT NOTES:

- You must use this tool on the specific version of the distribution you're intending for your agent to run in as it might require compilation.
- You must have the desired version of python installed on your chosen image.
- You must have the `tar` binary in your distribution (just run `which tar` to verify that you have tar installed).

## Using from the CLI

{{< gsHighlight  bash  >}}
cfy-ap -h

Script to run Cloudify's Agent Packager via command line

Usage:
    cfy-ap [--config=<path> --force --dryrun --no-validation -v]
    cfy-ap --version

Options:
    -h --help                   Show this screen
    -c --config=<path>          Path to config yaml (defaults to config.yaml)
    -f --force                  Forces deletion and creation of venv and tar file.
    -d --dryrun                 Prints out the modules to be installed without actually installing them.
    -n --no-validation          Does not validate that all modules were installed correctly.
    -v --verbose                verbose level logging
    --version                   Display current version
{{< /gsHighlight >}}

example:

{{< gsHighlight  bash  >}}
cfy-ap -f -c my_config.yaml -v
{{< /gsHighlight >}}

## Using from python

To use this from python, do the following:

{{< gsHighlight  python  >}}
import agent_packager.packager as cfyap

config = {}  # dict containing the configuration as given in the yaml file.

cfyap.create(config=config,
             config_file=None,
             force=False,
             dryrun=False,
             no_validate=False,
             verbose=True)
{{< /gsHighlight >}}

{{% gsNote title="Note" %}}
Using the tool from Python allows you to pass the configuration dictionary directly to the creation method which allows for automating the agent creation process.
{{% /gsNote %}}

## The cloudify-agent module

See [here]({{< relref "agents/overview.md" >}}).

## Using your agent

After creating the agent you can do one of the following to use your newly created agent:

### Using your agent on a per-node basis

You can define the paths to the agent tar file in the blueprint on a per-node basis.
See the cloudify-agent [documentation]({{< relref "agents/overview.md" >}}) for more information.

### Install agents in the manager during bootstrap

You can provide urls for agents you'd like to provide during manager bootstrap.


# Configuring the Tool

## The YAML config file

{{< gsWarning title="Note" >}}
It is very important that all modules under `core_modules`, `core_plugins` and `additional_plugins` are written with their real module names(!) while replacing dashes with underscores (e.g. the fabric plugin under additional plugins must be called `cloudify_fabric_plugin`.)

If not done so, `cloudify-agent` will not be able to recognize the plugin and load it.
{{< /gsNote >}}

Here's an example configuration file.

{{< gsHighlight  yaml  >}}
distribution: Ubuntu
release: trusty
python_path: '/usr/bin/python'
requirements_file: path/to/my/requirements/file.txt
cloudify_agent_version: master
cloudify_agent_module: http://github.com/cloudify-cosmo/cloudify-agent/archive/master.tar.gz
core_modules:
    cloudify_plugins_common: http://github.com/cloudify-cosmo/cloudify-plugins-common/archive/master.tar.gz
    cloudify_rest_client: http://github.com/cloudify-cosmo/cloudify-rest-client/archive/master.tar.gz
core_plugins:
    cloudify_script_plugin: http://github.com/cloudify-cosmo/cloudify-script-plugin/archive/master.tar.gz
    cloudify_diamond_plugin: http://github.com/cloudify-cosmo/cloudify-diamond-plugin/archive/master.tar.gz
additional_modules:
    - pyyaml==3.10
additional_plugins:
    cloudify_fabric_plugin: http://github.com/cloudify-cosmo/cloudify-fabric-plugin/archive/master.tar.gz
output_tar: Ubuntu-trusty-agent.tar.gz
keep_virtualenv: true
{{< /gsHighlight >}}

### Config YAML Explained

{{% gsNote title="Note" %}}
The `distribution` and `release` variables are case sensitive and must correspond with the output generated when running:

{{< gsHighlight  bash  >}}
python -c "import platform; print platform.dist()"
# e.g. ('Ubuntu', '14.04', 'trusty')
{{< /gsHighlight >}}

Beginning with Cloudify 3.2, they will not be case sensitive.
{{% /gsNote %}}

- `distribution` - Which distribution is the agent intended for. If this is omitted, the tool will try to retrieve the distribution by itself. The distribution is then used to name the virtualenv (if not explicitly specified in `venv`) and to name the output file (if not explicitly specified in `output_tar`).
- `release` - Which release (e.g. precise, trusty) of the `distribution` is the agent intended for. If this is omitted, the tool will try to retrieve the release by itself. The release is then used to name the virtualenv (if not explicitly specified in `venv`) and to name the output file (if not explicitly specified in `output_tar').
- `python_path` - Allows you to set the python binary to be used when creating `venv`. (Defaults to `/usr/bin/python`).
- `requirements_file` - a path to a requirements.txt file containing modules you want installed in the agent.
- `cloudify_agent_version` - States which version of the `cloudify-agent` module to install (Is not required if `cloudify_agent_module` is specified). Note that this can be used to create an agent for a specific Cloudify version.
- `cloudify_agent_module` - States the url from which the `cloudify-agent` module should be installed. (Will ignore `cloudify_agent_version` if specified).
- `core_modules` - a `dict` of core modules to install into the virtualenv. (If omitted or with a value of `false`, the module will be installed as a part of the `cloudify-agent` dependencies.) See below for a list of current core modules.
- `core_plugins` - a `dict` of core plugins to install into the virtualenv. (If omitted or with a value of `false`, the module will be installed as a part of the `cloudify-agent` dependencies.) See below for a list of current core plugins. If `exclude` is set (per module), it will not be installed. Set `exclude` with extra care!
- `additional_modules` - a `list` of additional modules to install into the virtualenv. This is where you can add any additional modules that are not Cloudify plugins.
- `additional_plugins` - a `list` of additional Cloudify plugins to install into the virtualenv.
- `output_tar` - Path to the tar file you'd like to create.
- `keep_virtualenv` - Whether to keep the virtualenv after creating the tar file or not. Defaults to false.


{{< gsNote title="Note" >}}
All modules and plugins aside from `additional_modules` and modules inside the `requirements_file` will be validated. In the future, a more robust implementation of the validation process will be added.
{{< /gsNote >}}


# Agent Modules

Each agent contains a set of Python packages.
These modules can be either simple python libraries or they can be plugins.

## Core External Modules:

These are modules not developed by Cloudify that are used by the agent.

- [Celery]({{< field "celery_link" >}}) (Mandatory)

## Core Modules:

These modules are developed by Cloudify and provide core functionality for the agent - thus, the default agents provided with Cloudify come with these pre-installed.

- [Cloudify REST Client]({{< relref "apis/rest-client-python.md" >}}) (Mandatory)
- [Cloudify Plugins Common]({{< field "plugins_common_api_link" >}}) (Mandatory)

## Core Plugins:

These plugins are developed by Cloudify and provide core functionality for the agent - thus, the default agents provided with Cloudify come with these pre-installed.

- [Cloudify Script Plugin]({{< relref "plugins/script.md" >}}) (Optional)
- [Cloudify Diamond Plugin]({{< relref "plugins/diamond.md" >}}) (Optional)

The Cloudify Manager actually also runs an instance of an agent, this is called the `cloudify_management_agent`.
This agent is responsible for starting all other agents, and thus requires the following plugin.

- [Cloudify Agent]({{< relref "agents/overview.md" >}})

{{% gsNote title="Note" %}}
Note that if you want to use the [ZeroMQ](https://github.com/zeromq/pyzmq) proxy in
the script plugin you'll have to explicitly configure it in the `additional_modules`
section as shown above.
{{% /gsNote %}}
