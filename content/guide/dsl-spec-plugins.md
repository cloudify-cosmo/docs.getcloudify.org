---
layout: bt_wiki
uid: plugins section
title: Plugins
category: Blueprints DSL
publish: true
abstract: "Specifying plugins to use with the blueprint"
pageord: 300

openstack_plugin_link: https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.3.zip
openstack_plugin_yaml_link: http://www.getcloudify.org/spec/openstack-plugin/1.3/plugin.yaml
terminology_link: reference-terminology.html
agent_packager_link: agents-packager.html
plugin_authoring_link: plugins-authoring.html
---
{{% gsSummary %}}
By declaring plugins we can install python modules and use the installed or preinstalled modules to perform different operations. We can also decide where a specific plugin's operations will be executed.
{{% /gsSummary %}}

# Plugins Declaration

The `plugins` section is a dictionary where each item in the dictionary represents a plugin to use in the [blueprint]({{page.terminology_link}}#blueprint).

{{< gsHighlight  yaml >}}
plugins:
  plugin1:
    ...
  plugin2:
    ...
{{< /gsHighlight >}}

## Plugin Definition

Keyname              |   Required  | Type        | Description
-----------          | --------    | ----        | -----------
executor             | yes         | string      | Where to execute the plugin's operations. Valid Values: `central_deployment_agent`, `host_agent`. See [Plugin Executor](#executor)
source               | conditional | string      | Where to retrieve the plugin from. Could be either a path relative to the `plugins` dir inside the blueprint's root dir or a url. If `install` is `false`, `source` is redundant. If `install` is true, `source` (or `pacakge_name`) is mandatory. See [Source Plugins](#source-plugins)
install_arguments    | no          | string      | Optional arguments passed to the 'pip install' command created for the plugin installation
install              | no          | boolean     | Whether to install the plugin or not as it might already be installed as part of the agent. Defaults to `true`. (Supported since: [cloudify_dsl_1_1](dsl-spec-versioning.html))
package_name         | conditional | string      | Managed plugin package name. See [Managed Plugins](#managed-plugins). (Supported since: [cloudify_dsl_1_2](dsl-spec-versioning.html)) If `install` is `false`, `pacakge_name` is redundant. If `install` is true, `package_name` (or `source`) is mandatory.
package_version      | no          | string      | Managed plugin pacakge version. See [Managed Plugins](#managed-plugins). (Supported since: [cloudify_dsl_1_2](dsl-spec-versioning.html))
supported_platform   | no          | string      | Managed plugin supported platform (e.g. `linux_x86_64`). See [Managed Plugins](#managed-plugins). (Supported since: [cloudify_dsl_1_2](dsl-spec-versioning.html))
distribution         | no          | string      | Managed plugin distribution. See [Managed Plugins](#managed-plugins). (Supported since: [cloudify_dsl_1_2](dsl-spec-versioning.html))
distribution_version | no          | string      | Managed plugin distribution version. See [Managed Plugins](#managed-plugins). (Supported since: [cloudify_dsl_1_2](dsl-spec-versioning.html))
distribution_release | no          | string      | Managed plugin distribution release. See [Managed Plugins](#managed-plugins). (Supported since: [cloudify_dsl_1_2](dsl-spec-versioning.html))

<br>

# Installation Configuration

When a plugin definition is configured with `install: true` (which is the default), `source` or `package_name` must be specified as well.
If `pacakge_name` is specified, the manager is queried for a matching managed plugin. If one is found, it will be installed.
If `package_name` is not specified or no matching managed plugin is found, `source` is used.
If no managed plugin is found and `source` is not defined, plugin installation will fail.

## Source Plugins
`source` specifies where the plugin to be installed is located. Can be:

* A URL to an archive of the plugin to be installed.
* A name of a directory containing the plugin which is expected to be inside the blueprint's `plugins` directory.

## Managed Plugins

`package_name` specifies the name of the managed plugin to be installed. `package_version`, `supported_platfrom`, `distribution`, `distribution_version` and `distribution_release`
may be used to explicity specify the managed plugin to install. Otherwise, an implicit resolution mechanism is employed that will fetch the latest macthing managed plugin, if one exists.

TBD - When managed plugins documentation is done, link to it from here and vice versa.

# Executor

`executor` specifies where the plugin should be installed and in turn, where operations using this plugin should be executed. Valid values are `central_deployment_agent`
in which case the plugin will be installed on the central deployment agent and `host_agent` in which case the plugin will be installed on the compute node that containes
the node that maps an operation to this plugin. To override the `executor` configuration on a per operation basis, see [operation executor](dsl-spec-interfaces.html#overriding-the-executor).


# Examples

## Source Plugin - External

An example for a plugin definition that should be installed via a URL.

{{< gsHighlight  yaml >}}
plugins:
  openstack:
    executor: central_deployment_agent
    source: {{page.openstack_plugin_link}}

node_templates:
  vm:
    type: openstack.nodes.Server
    interfaces:
      my_interface:
        create: openstack.nove_plugin.server.create
{{< /gsHighlight >}}

## Source Plugin - Packaged With Blueprint

An example for a plugin definition that comes pre-bunlded with the blueprint under its `plugins` directory.

{{< gsHighlight  yaml >}}
plugins:
  my_blueprint_plugin:
    executor: central_deployment_agent
    # name of directory containing the plugin inside the blueprint 'plugins' directory
    source: my-blueprint-plugin

node_templates:
  app:
    type: cloudify.nodes.Application
    interfaces:
      my_interface:
        delete: my_blueprint_plugin.blueprint_plugin_package.tasks.delete
{{< /gsHighlight >}}

## Non-Installed Plugin

An example for a plugin definition that should not be installed. This is used, for example, when a custom agent package, created using the [agent-packager]({{page.agent_packager_link}}), already includes this plugin so no installation is necessary.


{{< gsHighlight  yaml >}}
plugins:
  my_plugin:
    executor: central_deployment_agent
    install: false

node_templates:
  app:
    type: cloudify.nodes.Application
    interfaces:
      my_interface:
        configure: my_plugin.my_plugin_package.operations.configure
{{< /gsHighlight >}}

## Managed Plugin

An example for a plugin definition that should be installed via the managed plugins mechanism.

{{< gsHighlight  yaml >}}
plugins:
  some_managed_plugin:
    executor: host_agent
    package_name: some-managed-plugin

node_templates:
  app:
    type: cloudify.nodes.Application
    interfaces:
      my_interface:
        start: some_managed_plugin.my_managed_plugin_package.operations.start
{{< /gsHighlight >}}

## Install Arguments

An example for a plugin definition that should be installed with specific install arguments.

{{< gsHighlight  yaml >}}
plugins:
  plugin_with_args:
    executor: central_deployment_agn
    source: http://www.example.com/path/to/plugin.tar.gz
    # pip install will be called with these arguments appended
    # with the plugin directory as the current working directory.
    install_arguments: -r requirements.txt

node_templates:
  app:
    type: cloudify.nodes.Application
    interfaces:
      my_interface:
        start: plugin_with_args.withargs_plugin_package.operations.start
{{< /gsHighlight >}}
