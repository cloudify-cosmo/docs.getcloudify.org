---
uid: plugins section
title: Plugins
category: Blueprints
draft: false
weight: 900
aliases: /blueprints/spec-plugins/

openstack_plugin_link: https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.3.zip
openstack_plugin_yaml_link: http://www.getcloudify.org/spec/openstack-plugin/1.3/plugin.yaml
---

By declaring `plugins` you can install Python modules and use the installed or preinstalled modules to perform different operations. You can also specify where a specific plugin's operations will be executed.

# Declaration

The `plugins` section is a dictionary in which each item in the dictionary represents a plugin to use in the blueprint.

{{< highlight  yaml >}}
plugins:
  plugin1:
    ...
  plugin2:
    ...
{{< /highlight >}}


# Schema

| Keyname                | Required    | Type       | Description                                                                                                                                                                                                                                                                                         |
|------------------------|-------------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| executor               | yes         | string     | Where to execute the plugin's operations. Valid Values: `central_deployment_agent`, `host_agent`. See [Plugin Executor](#executor)                                                                                                                                                                  |
| source                 | conditional | string     | From where to retrieve the plugin. May be either a path relative to the `plugins` directory inside the blueprint's root directory, or a URL. If `install` is `false`, `source` is redundant. If `install` is true, `source` (or `package_name`) is mandatory. See [Source Plugins](#source-plugins) |
| install_arguments      | no          | string     | Optional arguments passed to the 'pip install' command created for the plugin installation.                                                                                                                                                                                                         |
| install                | no          | boolean    | Whether to install the plugin, as it might already be installed as part of the agent. Defaults to `true`. (Supported since: cloudify_dsl_1_1)                                                                                                                                                       |
| package_name           | conditional | string     | Managed plugin package name. See [Managed Plugins](#managed-plugins). (Supported since: cloudify_dsl_1_2) If `install` is `false`, `package_name` is redundant. If `install` is true, `package_name` (or `source`) is mandatory.                                                                    |
| package_version        | no          | string     | Managed plugin package version. See [Managed Plugins](#managed-plugins). (Supported since: cloudify_dsl_1_2)                                                                                                                                                                                        |
| supported_platform     | no          | string     | Managed plugin supported platform (e.g. `linux_x86_64`). See [Managed Plugins](#managed-plugins). (Supported since: cloudify_dsl_1_2)                                                                                                                                                               |
| distribution           | no          | string     | Managed plugin distribution. See [Managed Plugins](#managed-plugins). (Supported since: cloudify_dsl_1_2)                                                                                                                                                                                           |
| distribution_version   | no          | string     | Managed plugin distribution version. See [Managed Plugins](#managed-plugins). (Supported since: cloudify_dsl_1_2)                                                                                                                                                                                   |
| distribution_release   | no          | string     | Managed plugin distribution release. See [Managed Plugins](#managed-plugins). (Supported since: cloudify_dsl_1_2)                                                                                                                                                                                   |
| properties_description | no          | string     | An optional description for the plugin's properties. (Supported since: cloudify_dsl_1_5)                                                                                                                                                                                                            |
| properties             | no          | dictionary | A dictionary of [plugin's properties](#property-schema). (Supported since: cloudify_dsl_1_5)                                                                                                                                                                                                        |

<br>

## Installation Configuration

When a plugin definition is configured with `install: true` (which is the default), `source` or `package_name` must be specified as well.
If `package_name` is specified, the Manager is queried for a matching managed plugin. If one is found, it is installed.
If `package_name` is not specified, or no matching managed plugin is found, `source` is used.
If no managed plugin is found and `source` is not defined, plugin installation fails.

## Source Plugins
`source` specifies where the plugin to be installed is located. May be:

* A URL to an archive of the plugin to be installed.
* The name of a directory containing the plugin, which is expected to be inside the blueprint's `plugins` directory.
* The `source` method should only be used when developing plugins and the `skip-plugins-validation` flag should be passed at deployment time.

## Managed Plugins

`package_name` specifies the name of the managed plugin to be installed. `package_version`, `supported_platfrom`, `distribution`, `distribution_version` and `distribution_release`
may be used to explicitly specify the managed plugin to be installed. Otherwise, an implicit resolution mechanism is utilized that fetches the latest matching managed plugin.

Learn more about using the {{< param product_name >}} plugin API [here]({{< relref "working_with/official_plugins/_index.md" >}})

## Executor

`executor` specifies where the plugin should be installed and where operations using this plugin are to be executed. Valid values are `central_deployment_agent`,
in which case the plugin is installed on the central deployment agent, and `host_agent`, in which case the plugin is installed on the compute node that contains
the node that maps an operation to the plugin. To override the `executor` configuration on a per-operation basis, see [operation executor]({{< relref "developer/blueprints/spec-interfaces.md#overriding-the-executor" >}}).

## Property Schema

| Keyname        | Required | Type   | Description                                                         |
|----------------|----------|--------|---------------------------------------------------------------------|
| type           | no       | string | The required data type of credential's property.                    |
| description    | no       | string | An optional description for the property.                           |
| display_label  | no       | string | Used in UI instead of the property's name to describe the property. |

# Examples

## Source Plugin - External

The following is an example of a plugin definition that would be installed via a URL.

{{< highlight  yaml >}}
plugins:
  openstack:
    executor: central_deployment_agent
    source: {{< field "openstack_plugin_link" >}}

node_templates:
  vm:
    type: openstack.nodes.Server
    interfaces:
      my_interface:
        create: openstack.nove_plugin.server.create
{{< /highlight >}}

## Source Plugin - Packaged With Blueprint

The following is an example of a plugin definition that is pre-bundled with the blueprint, under its `plugins` directory.

{{< highlight  yaml >}}
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
{{< /highlight >}}

## Non-Installed Plugin

The following is an example of a plugin definition so that the plugin is not installed. This might be used when a custom agent package, created using the [agent-packager]({{< relref "cloudify_manager/agents/packager.md" >}}), already includes this plugin, meaning that no installation is necessary.


{{< highlight  yaml >}}
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
{{< /highlight >}}

## Managed Plugin

The following is an example of a plugin definition for a plugin to be installed via the managed plugins mechanism.

{{< highlight  yaml >}}
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
{{< /highlight >}}

## Install Arguments

The following is an example of a plugin definition for a plugin to be installed with specific install arguments.

{{< highlight  yaml >}}
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
{{< /highlight >}}

## Plugin Properties

{{< highlight  yaml >}}

tosca_definitions_version: cloudify_dsl_1_5

plugins:
  plugin_with_properties:
    executor: central_deployment_agent
    source: http://www.example.com/path/to/plugin.tar.gz
    properties_description: |
      Description regarding the credentials and
      the link to AWS documentation how to generate
      or the link to cloudify documentation on
      different types of authentication methods
    properties:
      aws_access_key_id:
        type: string
        description: This is a AWS Access Key ID
        display_label: AWS Access Key ID
      aws_secret_access_key:
        type: string
        description: This is a AWS Secret Access Key
        display_label: AWS Secret Access Key
      aws_region:
        type: string
        display_label: AWS Region
{{< /highlight >}}
