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

The Cloudify agent is basically a [virtualenv]({{< field "virtualenv_link" >}}) in which a series of modules are installed and (optionally) to which a some configuration files are attached.

To use Cloudify with distributions other than the [officially supported ones]({{< relref "agents/overview.md#provided-agent-packages" >}}), an [Agent Packager tool](https://github.com/cloudify-cosmo/cloudify-agent-packager) is provided to assist you to create agents for your distributions.

The purpose of the tool is to:

* Address the issues related to compiling module requirements on different distributions, by bridging the gap between user-compiled images, unfamiliar/minor distributions, and so on.
* Enable you to create your own Cloudify agents with your custom plugins.
* Make the agent creation process seamless in terms of there being a single configuration file and a single-line command.
* Enable you to override existing mandatory (and other) modules, by providing your own.

You can use the Cloudify agent packager to create an agent on the distribution on which you are running, that uses your distribution and compilers for modules that require compilation.

{{% gsNote title="Notes" %}}

* You must use Python 2.7.x or Python 2.6.x to create an agent.
* Not all Cloudify plugins can run on Python 2.6.x. Only basic modules and plugins currently run on Python 2.6.x. To determine whether a plugin supports your Python version, refer to the documentation for the plugin you plan to use.

{{% /gsNote %}}

# Creation Process

During the creation process, the agent-packager performs the following actions:

* Creates a virtualenv using your selected Python binary.
* Installs mandatory external modules into the virtualenv.
* Installs modules from a provided requirements.txt file.
* Installs mandatory and optional Cloudify plugins and modules into the virtualenv.
* Installs the `cloudify-agent` module into the virtualenv.
* Installs any additional user-selected Cloudify plugins and Python modules into the virtualenv.
* Validates that all specified modules are installed.
* Generates an `included_plugins.py` file. The file is used by the `cloudify-agent` module to automatically load all plugins specified in the file.
* Creates a TAR file containing the virtualenv.


{{% gsNote title="Note" %}}
The tool creates a TAR file for use in Cloudify Linux-based environments. For other environments, a different type of agent might be required.
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

- You must use this tool on the specific version of the distribution on which you intend your agent to run, as it might require compilation.
- You must have the required version of Python installed on your selected image.
- You must have the `tar` binary in your distribution (run `which tar` to verify that you have TAR installed).

## Creating the Agent Packager from the CLI

To create the agent packager from the CLI, do the following:

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
    -d --dryrun                 Lists the modules to be installed without actually installing them.
    -n --no-validation          Does not validate that all modules were installed correctly.
    -v --verbose                Verbose level logging
    --version                   Displays current version
{{< /gsHighlight >}}

example:

{{< gsHighlight  bash  >}}
cfy-ap -f -c my_config.yaml -v
{{< /gsHighlight >}}

## Creating the Agent Packager from Python

To create the agent packager from Python, do the following:

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
Using the tool from Python enables you to pass the configuration dictionary directly to the creation method, which enables automation of the agent creation process.
{{% /gsNote %}}

## The cloudify-agent Module

See [here]({{< relref "agents/overview.md" >}}).

## Using the Agent

After creating the agent you can do one of the following:

### Use the Agent on a Per-Node Basis

You can define the paths to the agent TAR file in a blueprint on a per-node basis.
See the [cloudify-agent documentation]({{< relref "agents/overview.md" >}}) for more information.

### Install Agents in Cloudify Manager during Bootstrap

You can provide URLs for agents that you want to provide during Cloudify Manager bootstrap.


# Configuring the Tool

## The YAML Configuration File

{{< gsNote title="Note" >}}
It is important that all modules under `core_modules`, `core_plugins` and `additional_plugins` are written using their actual module names and that dashes are replaced with underscores (for example, the fabric plugin under additional plugins must be called `cloudify_fabric_plugin`.)

If this protocol is not followed, `cloudify-agent` cannot recognize and load the plugin.
{{< /gsNote >}}

Following is an example configuration file.

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

### Explanation of the Configuration YAML File

{{% gsNote title="Note" %}}
The `distribution` and `release` variables must correspond with the output generated when running:

```
python -c "import platform; print platform.dist()"
# e.g. ('Ubuntu', '14.04', 'trusty')
```

{{% /gsNote %}}

- `distribution` - The distribution for which the agent is intended. If this is omitted, the tool attempts to retrieve the distribution by itself. The distribution is then used to name the virtualenv (unless explicitly specified in `venv`) and to name the output file (unless explicitly specified in `output_tar`).
- `release` - The release (e.g. precise, trusty) of the `distribution` for which the agent is intended. If this is omitted, the tool will attempt to retrieve the release by itself. The release is then used to name the virtualenv (unless explicitly specified in `venv`) and to name the output file (if unless specified in `output_tar').
- `python_path` - Enables you to set the Python binary to be used when creating `venv`. (Defaults to `/usr/bin/python`).
- `requirements_file` - Path to the requirements.txt file that contains the modules you want to be installed in the agent.
- `cloudify_agent_version` - Specifies the version of the `cloudify-agent` module to install (Not required if `cloudify_agent_module` is specified). Note that this can be used to create an agent for a specific Cloudify version.
- `cloudify_agent_module` - Specifies the URL from which the `cloudify-agent` module is to be installed. (Ignores `cloudify_agent_version`, if specified).
- `core_modules` - A `dict` of core modules to install into the virtualenv. (If omitted or with a value of `false`, the module is installed as a part of the `cloudify-agent` dependencies.) See a list of current core modules below.
- `core_plugins` - A `dict` of core plugins to install into the virtualenv. (If omitted or with a value of `false`, the module is installed as a part of the `cloudify-agent` dependencies.) See a list of core plugins below. If `exclude` is set (per module), it is not installed. Set `exclude` with extra care.
- `additional_modules` - A `list` of additional modules to install into the virtualenv. You can add any additional modules that are not Cloudify plugins here.
- `additional_plugins` - A `list` of additional Cloudify plugins to install into the virtualenv.
- `output_tar` - Path to the TAR file you want to create.
- `keep_virtualenv` - Specifies whether to keep the virtualenv after creating the TAR file. Default is `false`.


{{< gsNote title="Note" >}}
All modules and plugins, with the exception of `additional_modules` and modules inside the `requirements_file`, are validated. 
{{< /gsNote >}}


# Agent Modules

Each agent contains a set of Python packages.
These modules can be either simple Python libraries, or plugins.

## Core External Modules:

These are modules, which are not developed by Cloudify, that are used by the agent.

- [Celery]({{< field "celery_link" >}}) (Mandatory)

## Core Modules

These modules are developed by Cloudify and provide core functionality for the agent. The default agents provided with Cloudify come with these modules pre-installed.

- [Cloudify REST Client]({{< relref "apis/rest-client-python.md" >}}) (Mandatory)
- [Cloudify Plugins Common]({{< field "plugins_common_api_link" >}}) (Mandatory)

## Core Plugins

These plugins are developed by Cloudify and provide core functionality for the agent. The default agents provided with Cloudify come with these modules pre-installed.

- [Cloudify Script Plugin]({{< relref "plugins/script.md" >}}) (Optional)
- [Cloudify Diamond Plugin]({{< relref "plugins/diamond.md" >}}) (Optional)

The Cloudify Manager also runs an instance of an agent, which is called the `cloudify_management_agent`.
This agent is responsible for starting all other agents, and therefore requires the following plugin.

- [Cloudify Agent]({{< relref "agents/overview.md" >}})

{{% gsNote title="Note" %}}
To use the [ZeroMQ](https://github.com/zeromq/pyzmq) proxy in
the script plugin, you must explicitly configure it in the `additional_modules`
section, as shown above.
{{% /gsNote %}}
