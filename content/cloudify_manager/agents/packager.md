---
title: Agent Packager
category: Agents
draft: false
weight: 30
aliases: /agents/packager/

virtualenv_link: http://virtualenv.readthedocs.org/en/latest/virtualenv.html
pika_link: https://pika.readthedocs.io/en/latest/
plugins_common_api_link: /apis/plugins-common
---

The {{< param cfy_agent_name >}} is basically a [virtualenv]({{< field "virtualenv_link" >}}) in which a series of modules are installed and (optionally) to which a some configuration files are attached.

To use {{< param product_name >}} with distributions other than the [officially supported ones]({{< relref "install_maintain/agents/_index.md#provided-agent-packages" >}}), an [Agent Packager tool](https://github.com/cloudify-cosmo/cloudify-agent-packager) is provided to assist you to create agents for your distributions.

The purpose of the tool is to:

* Address the issues related to compiling module requirements on different distributions, by bridging the gap between user-compiled images, unfamiliar/ minor distributions, and so on.
* Enable you to create your own {{< param cfy_agent_name >}} with your custom plugins.
* Make the Agent creation process seamless in terms of there being a single configuration file and a single-line command.
* Enable you to override existing mandatory (and other) modules, by providing your own.

You can use the {{< param cfy_agent_name >}} packager to create an agent on the distribution on which you are running, that uses your distribution and compilers for modules that require compilation.

{{% note title="Notes" %}}

* You must use Python 2.7.x or Python 2.6.x to create an agent.
* Not all {{< param product_name >}} plugins can run on Python 2.6.x. Only basic modules and plugins currently run on Python 2.6.x. To determine whether a plugin supports your Python version, refer to the documentation for the plugin you plan to use.

{{% /note %}}

# Creation Process

During the creation process, the agent-packager performs the following actions:

* Creates a virtualenv using your selected Python binary
* Installs mandatory external modules into the virtualenv
* Installs modules from a provided requirements.txt file
* Installs mandatory and optional {{< param product_name >}} plugins and modules into the virtualenv
* Installs the `cloudify-agent` module into the virtualenv
* Installs any additional user-selected {{< param product_name >}} plugins and Python modules into the virtualenv
* Validates that all specified modules are installed
* Generates an `included_plugins.py` file. The file is used by the `cloudify-agent` module to automatically load all plugins specified in the file
* Creates a TAR file containing the virtualenv


{{% note title="Note" %}}
The tool creates a TAR file for use in {{< param product_name >}} Linux-based environments. For other environments, a different type of agent might be required.
{{% /note %}}

# Installation

{{< highlight  bash  >}}
pip install cloudify-agent-packager
{{< /highlight >}}

For development purposes:

{{< highlight  bash  >}}
pip install https://github.com/cloudify-cosmo/cloudify-agent-packager/archive/master.tar.gz
{{< /highlight >}}


# Usage

IMPORTANT NOTES:

- You must use this tool on the specific version of the distribution on which you intend your agent to run, as it might require compilation.
- You must have the required version of Python installed on your selected image.
- You must have the `tar` binary in your distribution (run `which tar` to verify that you have TAR installed).

## Creating the Agent Packager from the CLI

To create the agent packager from the CLI, do the following:

{{< highlight  bash  >}}
cfy-ap -h

Script to run the {{< param cfy_agent_name >}} Packager via command line

Usage:
    cfy-ap [--config=<path> --force --dryrun --no-validation -v]
    cfy-ap --version

Options:
    -h --help                   Show this screen
    -c --config=<path>          Path to config yaml (defaults to config.yaml)
    -f --force                  Forces deletion and creation of venv and tar file.
    -d --dryrun                 Lists the modules to be installed without actually installing them.
    -n --no-validation          Does not validate that all modules were installed correctly.
    -v --verbose                Verbose level logging
    --version                   Displays current version
{{< /highlight >}}

Example:

{{< highlight  bash  >}}
cfy-ap -f -c my_config.yaml -v
{{< /highlight >}}

## Creating the Agent Packager from Python

To create the agent packager from Python, do the following:

{{< highlight  python  >}}
import agent_packager.packager as cfyap

config = {}  # dict containing the configuration as given in the yaml file.

cfyap.create(config=config,
             config_file=None,
             force=False,
             dryrun=False,
             no_validate=False,
             verbose=True)
{{< /highlight >}}

{{% note title="Note" %}}
Using the tool from Python enables you to pass the configuration dictionary directly to the creation method, which enables automation of the Agent creation process.
{{% /note %}}

## The cloudify-agent Module

See [here]({{< relref "cloudify_manager/agents/_index.md" >}}).

## Using the Agent

After creating the Agent you can do one of the following:

### Use the Agent on a Per-Node Basis

You can define the paths to the Agent TAR file in a blueprint on a per-node basis.
See the [{{< param cfy_agent_name >}} documentation]({{< relref "cloudify_manager/agents/_index.md" >}}) for more information.

### Install Agents in {{< param cfy_manager_name >}} during Bootstrap

You can provide URLs for Agents that you want to provide during {{< param cfy_manager_name >}} bootstrap.


# Configuring the Tool

## The YAML Configuration File

{{< note title="Note" >}}
It is important that all modules under `core_modules`, `core_plugins` and `additional_plugins` are written using their actual module names and that dashes are replaced with underscores (for example, the fabric plugin under additional plugins must be called `cloudify_fabric_plugin`.)

If this protocol is not followed, `cloudify-agent` cannot recognize and load the plugin.
{{< /note >}}

Following is an example configuration file.

{{< highlight  yaml  >}}
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
additional_modules:
    - pyyaml==3.12
additional_plugins:
    cloudify_fabric_plugin: http://github.com/cloudify-cosmo/cloudify-fabric-plugin/archive/master.tar.gz
output_tar: Ubuntu-trusty-agent.tar.gz
keep_virtualenv: true
{{< /highlight >}}

### Explanation of the Configuration YAML File

{{% note title="Note" %}}
The `distribution` and `release` variables must correspond with the output generated when running:

```
python -c "import platform; print platform.dist()"
# e.g. ('Ubuntu', '14.04', 'trusty')
```

{{% /note %}}

- `distribution` - The distribution for which the Agent is intended. If this is omitted, the tool attempts to retrieve the distribution by itself. The distribution is then used to name the virtualenv (unless explicitly specified in `venv`) and to name the output file (unless explicitly specified in `output_tar`).
- `release` - The release (e.g. precise, trusty) of the `distribution` for which the Agent is intended. If this is omitted, the tool will attempt to retrieve the release by itself. The release is then used to name the virtualenv (unless explicitly specified in `venv`) and to name the output file (if unless specified in `output_tar').
- `python_path` - Enables you to set the Python binary to be used when creating `venv`. (Defaults to `/usr/bin/python`).
- `requirements_file` - Path to the requirements.txt file that contains the modules you want to be installed in the Agent.
- `cloudify_agent_version` - Specifies the version of the `cloudify-agent` module to install (Not required if `cloudify_agent_module` is specified). Note that this can be used to create an agent for a specific {{< param product_name >}} version.
- `cloudify_agent_module` - Specifies the URL from which the `cloudify-agent` module is to be installed. (Ignores `cloudify_agent_version`, if specified).
- `core_modules` - A `dict` of core modules to install into the virtualenv. (If omitted or with a value of `false`, the module is installed as a part of the `cloudify-agent` dependencies.) See a list of current core modules below.
- `core_plugins` - A `dict` of core plugins to install into the virtualenv. (If omitted or with a value of `false`, the module is installed as a part of the `cloudify-agent` dependencies.) See a list of core plugins below. If `exclude` is set (per module), it is not installed. Set `exclude` with extra care.
- `additional_modules` - A `list` of additional modules to install into the virtualenv. You can add any additional modules that are not {{< param product_name >}} plugins here.
- `additional_plugins` - A `list` of additional {{< param product_name >}} plugins to install into the virtualenv.
- `output_tar` - Path to the TAR file you want to create.
- `keep_virtualenv` - Specifies whether to keep the virtualenv after creating the TAR file. Default is `false`.


{{< note title="Note" >}}
All modules and plugins, with the exception of `additional_modules` and modules inside the `requirements_file`, are validated.
{{< /note >}}


# Agent Modules

Each Agent contains a set of Python packages.
These modules can be either simple Python libraries, or plugins.

## Core External Modules

These are modules, which are not developed by {{< param product_name >}}, that are used by the Agent.

- [Pika]({{< field "pika_link" >}}) (Mandatory)

## Core Modules

These modules are developed by {{< param product_name >}} and provide core functionality for the Agent. The default Agents provided with {{< param product_name >}} come with these modules pre-installed.

- [{{< param product_name >}} REST Client]({{< relref "developer/apis/rest-client-python.md" >}}) (Mandatory)
- [{{< param product_name >}} Plugins Common]({{< field "plugins_common_api_link" >}}) (Mandatory)

## Core Plugins

These plugins are developed by {{< param product_name >}} and provide core functionality for the Agent. The default Agents provided with {{< param product_name >}} come with these modules pre-installed.

- [{{< param product_name >}} Script Plugin]({{< relref "working_with/official_plugins/Configuration/script.md" >}}) (Optional)

The {{< param cfy_manager_name >}} also runs an instance of an Agent, which is called the `cloudify_management_agent`.
This agent is responsible for starting all other Agents, and therefore requires the following plugin.

- [{{< param cfy_agent_name >}}]({{< relref "cloudify_manager/agents/_index.md" >}})

{{% note title="Note" %}}
To use the [ZeroMQ](https://github.com/zeromq/pyzmq) proxy in
the script plugin, you must explicitly configure it in the `additional_modules`
section, as shown above.
{{% /note %}}
