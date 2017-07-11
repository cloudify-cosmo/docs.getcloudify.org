---
layout: bt_wiki
title: Writing Your Own Plugin
category: Plugins
draft: false
weight: 10000

plugin_link: https://github.com/cloudify-cosmo/cloudify-python-plugin
template_link: https://github.com/cloudify-cosmo/cloudify-plugin-template
blueprint_guide_link: getting-started-write-blueprint.html
plugins_common_link: https://github.com/cloudify-cosmo/cloudify-plugins-common
plugins_common_ref_link: reference-plugins-common.html
openstack_plugin_link: https://github.com/cloudify-cosmo/cloudify-openstack-plugin/blob/1.2/nova_plugin/server.py#L379
plugins_common_docs_link: http://cloudify-plugins-common.readthedocs.org/
terminology_link: reference-terminology.html
dsl_inputs_link: dsl-spec-inputs.html
local_workflows_api_link: http://cloudify-cli.readthedocs.org/en/latest/commands.html#local
mock_ctx_link: http://cloudify-plugins-common.readthedocs.org/en/latest/mocks.html#cloudify.mocks.MockCloudifyContext
---
{{% gsSummary %}}{{% /gsSummary %}}

To illustrate how to write a plugin, this topic demonstrates how to create a plugin that is used to start a simple HTTP Web server using Python.


## Creating A Plugin Project

Cloudify plugin projects are standard Python projects.

Each Cloudify plugin requires `cloudify-plugins-common` as a dependency, because it contains the necessary APIs for interacting with Cloudify.

`cloudify-plugins-common` documentation is located [here]({{< field "plugins_common_docs_link" >}}).

{{% gsTip title="Tip" %}}
You can use the [Plugin Template](#the-plugin-template) to setup the repository for your plugin.
{{% /gsTip %}}

## Setting up the setup.py File for the Plugin

For example:

{{< gsHighlight  python >}}
from setuptools import setup

setup(
    name='python-http-webserver-plugin',
    version='1.0',
    author='Cloudify',
    packages=['python_webserver'],
    install_requires=['cloudify-plugins-common>=3.3'],
)
{{< /gsHighlight >}}



## Writing Plugin Operations

Plugin operations are standard Python methods that are decorated with Cloudify's `operation` decorator, so that Cloudify can identify them as plugin operations.

For the purpose of demonstrating how to create a plugin, creation of the `start` and `stop` operations for a Python HTTP webserver plugin are described.

The start operation will create an `index.html` file and then start a webserver using the following shell command: `python -m SimpleHTTPServer` which starts an HTTP server listening on port 8000.

The start & stop operations are placed in a `tasks.py` module in the `python_webserver` package in the project.

In the following example, the Cloudify logger, which is accessible using the `ctx.logger` object, is used.


### python_webserver/tasks.py
{{< gsHighlight  python >}}
import os

# import the ctx object
from cloudify import ctx

# import the operation decorator
from cloudify.decorators import operation

@operation
def start(**kwargs):
    with open('/tmp/index.html', 'w') as f:
        f.write('<p>Hello Cloudify!</p>')

    command = 'cd /tmp; nohup python -m SimpleHTTPServer > /dev/null 2>&1' \
              ' & echo $! > /tmp/python-webserver.pid'

    # use the ctx.logger object to send a formatted log with context
    # to the Manager. The displayed message is only part of the
    # log sent. A lot of context is supplied with the object.
    ctx.logger.info('Starting HTTP server using: {0}'.format(command))
    os.system(command)


# multiple operations that can be referred to afterwards
# in the blueprint are defined
@operation
def stop(**kwargs):
    try:
        with open('/tmp/python-webserver.pid', 'r') as f:
            pid = f.read().strip()
        ctx.logger.info('Stopping HTTP server [pid={0}]'.format(pid))
        os.system('kill -9 {0}'.format(pid))
    except IOError:
        ctx.logger.info('HTTP server is not running!')
{{< /gsHighlight >}}


## Retrieving Node Properties

During the previous step, an HTTP webserver, which is now listening on port 8000, was started.
If the port was specified in the blueprint, to use that port, the `ctx` object that represents the context of the invocation exposes the node's properties, if the plugin's operation was invoked in the context of a node.

The port property can be retrieved using the following code:
{{< gsHighlight  python >}}
webserver_port = ctx.node.properties['port']
{{< /gsHighlight >}}

The updated start operation looks as follows:

{{< gsHighlight  python >}}
from cloudify import ctx

@operation
def start(**kwargs):
    # retrieve the port from the node's properties
    webserver_port = ctx.node.properties['port']

    with open('/tmp/index.html', 'w') as f:
        f.write('<p>Hello Cloudify!</p>')

    # use the port that was withdrawn previously when running the Web server
    command = 'cd /tmp; nohup python -m SimpleHTTPServer {0} > /dev/null 2>&1' \
              ' & echo $! > /tmp/python-webserver.pid'.format(webserver_port)

    ctx.logger.info('Starting HTTP server using: {0}'.format(command))
    os.system(command)
{{< /gsHighlight >}}

## Updating & Retrieving Runtime Properties

Runtime properties are properties that are set during runtime and are relevant to node instances.
In the example, instead of having the Webserver root set to `/tmp` a temporary folder is created and its path is stored as a runtime property so that the stop operation reads it when stopping the Webserver.

{{< gsHighlight  python >}}
import os
import tempfile

from cloudify import ctx
from cloudify.decorators import operation


@operation
def start(**kwargs):
    webserver_root = tempfile.mkdtemp()
    # a property, which is set during runtime, is added to the runtime
    # properties of that specific node instance
    ctx.instance.runtime_properties['webserver_root'] = webserver_root

    webserver_port = ctx.node.properties['port']

    with open(os.path.join(webserver_root, 'index.html'), 'w') as f:
        f.write('<p>Hello Cloudify!</p>')

    command = 'cd {0}; nohup python -m SimpleHTTPServer {1} > /dev/null 2>&1' \
              ' & echo $! > python-webserver.pid'.format(webserver_root, webserver_port)

    ctx.logger.info('Starting HTTP server using: {0}'.format(command))
    os.system(command)


@operation
def stop(**kwargs):
    # setting this runtime property enabled properties to be referred to that
    # are set during runtime from a different time in the node instance's lifecycle
    webserver_root = ctx.instance.runtime_properties['webserver_root']
    try:
        with open(os.path.join(webserver_root, 'python-webserver.pid'), 'r') as f:
            pid = f.read().strip()
        ctx.logger.info('Stopping HTTP server [pid={0}]'.format(pid))
        os.system('kill -9 {0}'.format(pid))
    except IOError:
        ctx.logger.info('HTTP server is not running!')
{{< /gsHighlight >}}

Runtime properties are saved in Cloudify storage after the plugin's operation invocation is complete. (For which the `@operation` decorator is responsible).

Where it is important to immediately save runtime properties to Cloudify storage, call the `ctx.update` method.

For example:

{{< gsHighlight  python >}}
ctx.instance.runtime_properties['prop1'] = 'This should be updated immediately!'
ctx.instance.update()
{{< /gsHighlight >}}

## Asynchronous Operations

In many situations, such as creating resources in a Cloud environment, an operation might be waiting for an asynchronous activity to end (for example, waitng for a VM to start). Instead of implementing a wait-for mechanism in the operation that will wait until the asynchronous activity is over (which blocks the user who executed the operation from executing other operations in the meantime), operations can request to be retried after a specific time and to check whether the asynchronous activity is finished.

### Requesting A Retry

{{< gsHighlight  python >}}
from cloudify import ctx
from cloudify.decorators import operation
from cloudify import exceptions

@operation
def start(**kwargs):
    # start is executed for the first time, start the resource
    if ctx.operation.retry_number == 0:
        iaas.start_vm()

        # It will take some time until the VM will be running..
        # Request a retry after 30 seconds
        return ctx.operation.retry(message='Waiting for the VM to start..',
                                   retry_after=30)

    # This is a retried operation, check if the resource is running
    # and if not, request another retry
    if iaas.get_vm_state(...) != 'running':

        # Request a retry after 5 seconds
        return ctx.operation.retry(message='Still waiting for the VM to start..',
                                   retry_after=5)

    # Resource is up and running
    ctx.logger.info('VM started successfully!')
{{< /gsHighlight >}}

{{% gsTip title="Tip" %}}
`ctx.operation.max_retries` can be configured in the Cloudify Manager blueprint. Additional information is located in the [Workflows ]({{< relref "workflows/error-handling.md" >}}) section.
{{% /gsTip %}}


## Handling Errors

The Cloudify workflows framework distinguishes between two types of error:

- Recoverable errors - Cloudify workflows will retry operations that generated such errors, where all Python errors are treated as recoverable errors.
- Non-recoverable errors - Errors that should not be retried and the workflow determines how to handle them.

In the current start operation, there is no verification that the Webserver was actually started and is listening on the specified port.

In this step, a `verify_server_is_up` method is implemented that generates a non-recoverable error if the server was not started within a reasonable period of time:

{{< gsHighlight  python >}}
import os
import tempfile
import urllib2
import time

from cloudify import ctx
from cloudify.decorators import operation
# import the NonRecoverableError class
from cloudify.exceptions import NonRecoverableError


def verify_server_is_up(port):
    for attempt in range(15):
        try:
            response = urllib2.urlopen("http://localhost:{0}".format(port))
            response.read()
            break
        except BaseException:
            time.sleep(1)
    else:
        raise NonRecoverableError("Failed to start HTTP webserver")


@operation
def start(**kwargs):
    webserver_root = tempfile.mkdtemp()
    ctx.instance.runtime_properties['webserver_root'] = webserver_root

    webserver_port = ctx.node.properties['port']

    with open(os.path.join(webserver_root, 'index.html'), 'w') as f:
        f.write('<p>Hello Cloudify!</p>')

    command = 'cd {0}; nohup python -m SimpleHTTPServer {1} > /dev/null 2>&1' \
              ' & echo $! > python-webserver.pid'.format(webserver_root, webserver_port)

    ctx.logger.info('Starting HTTP server using: {0}'.format(command))
    os.system(command)

    # verify
    verify_server_is_up(webserver_port)
{{< /gsHighlight >}}

### Error Details

When an operation fails due to an exception being generated (intentionally or unintentionally), the exception details are stored in the
task_failed/task_reschduled events.

In some cases, you might want to explicitly raise a ``NonRecoverableError`` (for example) in response to some other exception that was raised
in your operation code. That is quite simple to achieve as shown in the previous example. However, if you also want to preserve the original
exception details in addition to the exception you raised, you can use the `causes` keyword argument when raising a `RecoverableError`
or `NonRecoverableError`. This is demonstrated in the following example (which is based on the previous example).

{{< gsHighlight  python >}}
import urllib2
import time
import sys

from cloudify.utils import exception_to_error_cause
from cloudify.exceptions import NonRecoverableError


def verify_server_is_up(port):
    for attempt in range(15):
        try:
            response = urllib2.urlopen("http://localhost:{0}".format(port))
            response.read()
            break
        except BaseException:
            _, last_ex, last_tb = sys.exc_info()
            time.sleep(1)
    else:
        raise NonRecoverableError(
            "Failed to start HTTP webserver",
            causes=[exception_to_error_cause(last_ex, last_tb)])
{{< /gsHighlight >}}


## Plugin Metadata

Several attributes under `ctx.plugin` can be used to access details about the plugin involved in the current operation.

* `ctx.plugin.name` Returns the plugin name, as defined in the application blueprint that imported the involved plugin.
* `ctx.plugin.package_name` and `ctx.plugin.package_version` Return the package name and package version, as defined in the application blueprint
  that imported the involved plugin.
* `ctx.plugin.prefix` Returns the prefix in which the plugin is installed. For local workflows, `ctx.plugin.prefix` is equivalent to `sys.prefix`.
  For remote workflows, if the plugin is installed in the agent package, `ctx.plugin.prefix` is equivalent to `sys.prefix`. Otherwise,
  it returns the prefix in which the plugin is installed. This will be a subdirectory under `VIRTUALENV/plugins`.
* `ctx.plugin.workdir` Returns a work directory that is unique for the current (`deployment_id`, `plugin`) pair. This directory can be used in cases
  in whcih a plugin must write files to the file system to be read later. (Note that this directory is not be migated during Manager migration,
  so should not be considered persistent, but rather a convenient workspace).


## Testing Your Plugin

In most cases, the recommendation is to test your plugin's logic using local workflows, and only then run them as part of a Cloudify deployment. We have supplied you with a nice and tidy
decorator to do just that. The cloudify-plugins-common's test_utils package enables you to do that. It is intuitive to use, but an example is provided below:

{{< gsHighlight  python >}}
from cloudify.test_utils import workflow_test

@workflow_test(
                blueprint_path,
                copy_plugin_yaml,
                resources_to_copy,
                temp_dir_prefix,
                init_args,
                inputs,
                input_func_args,
                input_func_kwargs
                )
def test_my_task(self, cfy_local):
    pass
{{< /gsHighlight >}}

#### Workflow Test Arguments

- `blueprint_path` - A path to the blueprint to run, this blueprint file is copied to a temporary
 test directory. **This is the only mandatory input.**
- `copy_plugin_yaml` - For use in testing a plugin you created. If you specify this argument as True,
The decorator tries to traverse up the directory tree from the test file to find plugin.yaml. If the file is
found, it is copied to the root of the temporary test directory (together with the blueprint file). Therefore, importing the
plugin.yaml of the current file should be implemented as if both the blueprint and the plugin.yaml are in the same folder.
- `resources_to_copy` - This argument enables you to pass a list of:
    - File paths that would be copied to the root temporary test dir.
    - A tuple of the format of (`source_path`, `destination_path`), where the `destination_path` is relative to
    the root of the temporary test directory (the entire directory structure would be managed by the decorator).
- `temp_dir_prefix` - If you have a special request for the temporary test directory prefix, supply it here.
- `init_args` - If you have any specific arguments to be pass to the `local.init()` method, pass them through here.
- `inputs` - A syntactic sugar for the `init_args`['inputs'] field.
- `input_func_args` - To pass a function name to the inputs, use this argument to specify the arguments to the function.
- `input_func_kwargs` - To pass a function name to the inputs, use this argument to specify the kwargs to the function.

The decorator sets up the environment for the test, and injects the environment as the first argument to the function.
For example, if it is called `cfy_local`. You could run executions via `cfy_local.execute('install')`, or access storage via `cfy_local.storage`.

#### Passing Inputs
Passing inputs is not confined to static inputs:

- You might want to pass a function name to the inputs argument, the function would be called and the returned value would
    be set as the inputs for the init. This is practical when using the same function for several decorator uses,
     while changing the inputs it receives. Note: iY need to handle the injected arguments and kwargs. For example:
        {{< gsHighlight  python >}}
        from cloudify.test_utils import workflow_test

        def set_inputs(*args, **kwargs):
            inputs = {}
            ...
            return inputs

        @workflow_test(some_blue_print_path, inputs=set_inputs)
        def test_my_task(self, cfy_local)
            pass
        {{< /gsHighlight >}}

- Another option is to pass a path to a method belonging to the test method's class. The reason for this, instead of just passing the method name, is that the method does not actually exist at the time that the decorator expression is evaluated, so using the method's name enables you to gain access to such methods. For example:
            {{< gsHighlight  python >}}
            from cloudify.test_utils import workflow_test

            class MyClass:

                def set_inputs():
                    inputs = {}
                    ...
                    return inputs

                @workflow_test(some_blue_print_path, inputs='set_inputs')
                def test_my_task(self, cfy_local)
                    pass
            {{< /gsHighlight >}}

#### Context Manager

The decorator functionality also exists as a context manager. However, the following features will not work:

- Copy_plugin_yaml or passing any relative path in resources_to_copy.
- Passing a path to a function.

### Unit Testing

To unit test a specific function that needs a `ctx` object, you can use [`cloudify.mocks.MockCloudifyContext`]({{< field "mock_ctx_link" >}}) which is provided by `cloudify-plugins-common`.

#### Example: Using `MockCloudifyContext`

Assuming the plugin code is located in `my_plugin.py`:

{{< gsHighlight  python >}}
from cloudify import ctx

@operation
def my_operation(**kwargs):
    prop1 = ctx.node.properties['node_property_1']
    ctx.logger.info('node_property_1={0}'.format(prop1))
{{< /gsHighlight >}}

Then use the following code to call the `my_operation` operation using a mock context object:

{{< gsHighlight  python >}}
from cloudify.mocks import MockCloudifyContext
from cloudify.state import current_ctx
import my_plugin

props = {'node_property_1': 'value_1'}

mock_ctx = MockCloudifyContext(node_id='test_node_id',
                               node_name='test_node_name',
                               properties=props)

try:
    current_ctx.set(mock_ctx)
    my_plugin.my_operation()
finally:
    current_ctx.clear()
{{< /gsHighlight >}}

(Note: `MockCloudifyContext` accepts various additional parameters. Check the [documentation]({{< field "mock_ctx_link" >}}) for more information).


Now that the plugin is created, you need to incorporate it in your blueprint. For more information, see the [Plugins]({{< relref "blueprints/spec-plugins.md" >}}) specification.

## Supplementary Inforomation

### The Context Object

The `ctx` context object contains contextual parameters that are mirrored from the blueprint, alongside additional functionality:

#### Properties Context Objects

* `ctx.instance.id` - The unique ID of the node's instance.
* `ctx.node.properties` - The properties of the node as declared under the `properties` dictionary.
* `ctx.instance.runtime_properties` - The properties that are assigned to a **node's instance** at runtime. These properties are either populated by the plugin itself (for instance, an automatically generated port that the plugin exposes when it's run), or are generated prior to the invocation of the plugin (for instance, the ip of the machine the plugin is running on).

#### Utility Context Objects

* `ctx.logger` - A Cloudify-specific logging mechanism to send logs back to the Cloudify Manager environment.
* `ctx.download_resource` - Downloads a specified resource.
* `ctx.download_resource_and_render` - Downloads a specified resource and renders it according to an optional variables dictionary. The context itself is automatically injected, and available as `ctx`. A resource with the following content:
 {{< gsHighlight  "yaml" >}}
    deployment_id: {{ctx.deployment.id}}
    test: {{hello}}
 {{< /gsHighlight >}}

    and `{'hello': 'world'}` as a `template_variables` dictionary, is downloaded as a resource with the following content:

    {{< gsHighlight  "yaml" >}}
    deployment_id: <current_deployment_id>
    test: world
    {{< /gsHighlight >}}

* `ctx.get_resource` - Reads a resource's data.
* `ctx.get_resource_and_render` - Reads a resource's data and renders it according to an optional variables dictionary. The context itself is automatically injected, and available as `ctx`.
   See example at ctx.download_resource_and_render.
* `ctx.instance.update` - Updates the node's runtime properties. This is automatically called each time an operation ends, meaning that it is only useful in the context of a single operation.

### Cloud Plugins

The lifecycle `start` operation should store the following runtime properties for the `Compute` node instance:

- `ip` - The IP address of the VM to be accessed by Cloudify Manager.
- `networks` - A dictionary containing network names as keys and list of IP addresses as values.

See the Cloudify [OpenStack plugin]({{< relref "plugins/openstack.md" >}}) for reference.


