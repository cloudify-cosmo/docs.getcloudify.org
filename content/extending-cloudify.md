---

layout: bt_wiki
title: Extending Cloudify
category: Tutorials
draft: true
abstract: "Explains how to develop extensions to Cloudify: Plugins, Policies, Workflows"
weight: 500

---

{{% gsSummary %}}{{% /gsSummary %}}

# adding custom types
Custom `node` & `relationship` types are needed in one of the following cases:
* User wats to add a new implementation (meaning the new type will use a new plugin)
* User wants to refine an existing type and use it with many type implementations instead of overriding a property in any type implementation (less error prone)

Adding a type is easy! you just need to import a yaml file with a map named `node_types` where each type is a key-value entry. for example:

{{< gsHighlight  YAML  >}}
node_types:
    my_type:
        derived_from: cloudify.openstack.nodes.Server
        properties:
            install_agent: false
        # omitted for brevity

{{< /gsHighlight >}}

In the above example the `cloudify.openstack.server` is refined in order to not have Cloudify install an agent on each instance.

Note: you can declare first level properties schema in a type. This will ensure that type implementation will have to include this property
for example, the `cloudify.openstack.nodes.Server` type declares the `server` property that any instance must have. this property is a map where all instance properties should be decalred by the instance (type implementation)


{{< gsHighlight  YAML  >}}
cloudify.openstack.nodes.Server:
        derived_from: cloudify.types.host
        properties:
            server: {}
            management_network_name: ''
            nova_config: {}
            neutron_config: {}
        interfaces:
            cloudify.interfaces.lifecycle:
                start: 
                    implementation: nova_plugin.server.start
                    inputs: {}
                stop: 
                    implementation: nova_plugin.server.stop
                    inputs: {}
                delete: 
                    implementation: nova_plugin.server.delete
                    inputs: {}
{{< /gsHighlight >}}


You can always contribute types to the community by submitting a pull request.

# Adding custom interfaces
You can add custom interfaces with additional hooks in order to create a new automation process. In order to use this interface, you will need a workflow that will invoke the operations and plugin(s) that will implement the operations.
you can add an interface in custom type by adding a new entry to the `interfaces` map

# Developing Plugins

## Overview

Plugins are Cloudify integration with different tools. Whenever you need a new integration, you will need to add a plugin that will implement the lifecycle interface, the relationship.lifecycle interface or other existing or custom interfaces. 

## Project Dependencies & Structure

1. Get the plugin project template
[Download the project template](https://github.com/cloudify-cosmo/cloudify-plugin-template/archive/develop.zip)

2. Unzip and rename
* Rename the `cloudify-plugin-template` to the name you would like to use for your IDE project
* Rename the `plugin` folder to the python package name you want to use
* Add additional folders for additional packages if you need them

3. Edit `setup.py`
* Replace `${PLUGIN_NAME}` with the name you want to give to the pip package
* Replace `${VERSION}` with the version you want to give to your plugin. Typically you want to set it to something lower than 1.1 until it is tested with system tests and ready for release
* Replace `${AUTHOR}` and `${AUTHOR_EMAIL}`
* Fill in content instead of `'${DESCRIPTION}'`
* Edit the packages array `packages=['plugin'],`. Replace plugin with the name of your python package(s)
* Edit the requirements sections. Put in additional requirements using their pip package names. Make sure you leave the `cloudify-plugins-common` package
{{< gsHighlight  python  >}}
install_requires=[
        # Necessary dependency for developing plugins, do not remove!
        "cloudify-plugins-common"
    ],
    test_requires=[
        "nose"
    ],
{{< /gsHighlight >}}
4. Create a virtualenv for your project
* install pip if you don't have it
Ubuntu:
{{< gsHighlight  bash  >}}
sudo apt-get install python-pip
pip install --upgrade pip
{{< /gsHighlight >}}
* install virtualenv
{{< gsHighlight  bash  >}}
pip install virtualenv
{{< /gsHighlight >}}
* create the virtualenv in a new folder
{{< gsHighlight  bash  >}}
virtualenv [path to env]
{{< /gsHighlight >}}
* activate the env
{{< gsHighlight  bash  >}}
source [path to env]/bin/activate
{{< /gsHighlight >}}
* run pip to get all the requirements
{{< gsHighlight  bash  >}}
cd [path_to_project]
pip install .
{{< /gsHighlight >}}

## Coding The Plugin
In this part of the tutorial we will code a plugin that loads python scripts and executes them.

1. Adding Operations:
* Look at tasks.py you can see the following function
{{< gsHighlight  python  >}}
@operation
def my_task(ctx, **kwargs):
    pass
{{< /gsHighlight >}}

A plugin has functions that can be invoked by the agent - the same functions you mapped to the interface in your type. These finctions are marked as operations using the `@operation` [python decorator](https://wiki.python.org/moin/PythonDecorators). In order to use this decorator and the related `context` object, we import the `operation` function from `cloudify.decorators`
{{< gsHighlight  python  >}}
from cloudify.decorators import operation
{{< /gsHighlight >}}

* Rename the `my_task` function to 

* Implement the operation
The `ctx` argument is an instance of `CloudifyContext`. This class exposes several key properties to the developer:

* `instance.id` - unique id for the currenrt node instance
* `node.name` - node name in the blueprint
* `node.properties` - the node properties as specified in the blueprint YAML files (Read only)
* `instance.runtime_properties` - runtime properties map for retrieving runtime information to the manager and share with other nodes (read only)

* `capabilities` -  dependency nodes runtime properties for example db connection string if the current node has relationship to a db

* `logger` - the logger to use (enriches log entires with relevant context and writes to RabbitMQ)
* `blueprint.id` - The blueprint id the plugin invocation belongs to.
* `deployment.id` - The deployment id the plugin invocation belongs to
* `execution_id` -  The workflow execution id the plugin invocation was requested from.
  This is a unique value which identifies a specific workflow execution.
 * `workflow_id` - The workflow id the plugin invocation was requested from.
        For example:
            'install', 'uninstall' etc...
* `task_id` - The plugin's task invocation unique id.
* `task_name` - The full task name of the invoked task.
* `task_target` - The task target (RabbitMQ queue name).
* `plugin` - The plugin name of the invoked task."
* `operation` - The node operation name which is mapped to this task invocation.
        For example: cloudify.interfaces.lifecycle.start
        
### Getting properties
Use the `properties` to get access to node:

{{< gsHighlight  python  >}}
if 'scripts' in ctx.node.properties:
    scripts = ctx.node.properties['scripts']
        
{{< /gsHighlight >}}

### Reporting Runtime Properties
Use the context as a map to write runtime properties.
In this example a property of ip is added to a host node.

{{< gsHighlight  python  >}}
ctx.instance.runtime_properties['ip'] = manager_network_ip
{{< /gsHighlight >}}

### Getting access to files
In case your blueprint included files that you need to access during plugin runtime use the following method:

{{< gsHighlight  python  >}}
sh = ctx.get_resource(scripts[operation_simple_name])
        
{{< /gsHighlight >}}

### Asynchronous Operations
In many cases, an operation is expected to do some work which takes time. In order to free the worker which executes the operation to handle other operations in the meantime, one can specify that the operation should be retried after some time and continue from the point where the asyncronous activity is over. An example for this behavior is usually relevant in `IaaS` plugins where it may take a resource some time to be available after a request for its creation has been made.


## Using Your Plugin
In order to use your plugin you need to decalre it with the types. Note that the plugin name refers to the module name and not to the project name

{{< gsHighlight  YAML  >}}
plugins:
    nova_plugin:
        derived_from: cloudify.plugins.manager_plugin
        properties:
            url: https://github.com/CloudifySource/cloudify-openstack-plugin/archive/develop.zip

{{< /gsHighlight >}}

Note that there are two types of plugins:

* `manager_plugin` - for plugins that are installed on the manager side agent
* `agent_plugin` - for plugins that will be installed on application VM agents




# Developing Agent Installer Plugin


<!--# Integrating External Monitoring Systems
## Nagios
## Statsd / Collectd 
## Ganglia
## Logstash

# Developing Custom Policies-->

# Developing Custom Workflows

