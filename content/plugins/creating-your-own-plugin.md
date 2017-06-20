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

In this tutorial we will create a plugin whose purpose is to start a simple HTTP web server using Python.


# Creating A Plugin Project

Cloudify plugin projects are actually standard Python projects.

Each Cloudify plugin should have `cloudify-plugins-common` as a dependency as it contains the necessary API's for interacting with Cloudify.

`cloudify-plugins-common` documentation can be found [here]({{< field "plugins_common_docs_link" >}}).

{{% gsTip title="Tip" %}}
You can use the [Plugin Template](#the-plugin-template) to setup the repo for your plugin.
{{% /gsTip %}}

# Setting up the setup.py file for your plugin

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



# Writing Plugin Operations

Plugin operations are standard Python methods which are decorated with Cloudify's `operation` decorator so that Cloudify can identify them as plugin operations.

For our Python HTTP webserver plugin, we'll create two operations: start & stop.

The start operation will create an `index.html` file and then start a webserver using the following shell command: `python -m SimpleHTTPServer` which starts an HTTP server listening on port 8000.

We'll put the start & stop operations in a `tasks.py` module within the `python_webserver` package in our project.

In the following example, we'll use Cloudify's logger which is accessible using the `ctx.logger` object.


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

    # we can use the ctx.logger object to send a formatted log with context
    # to the manager. The message shown here will only be a part of the
    # log sent. A lot of context is supplied with the object.
    ctx.logger.info('Starting HTTP server using: {0}'.format(command))
    os.system(command)


# we're defining multiple operations to which we can refer to afterwards
# in our blueprint
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


# Getting Node Properties

During the previous step, we started an HTTP webserver which is now listening on port 8000.
What if the port was specified in our blueprint and we'd like to use that port?

Not a problem, the `ctx` object which represents the context of the invocation exposes the node's properties if the plugin's operation was invoked in the context of a node.

We can get the port property using the following code:
{{< gsHighlight  python >}}
webserver_port = ctx.node.properties['port']
{{< /gsHighlight >}}

The updated start operation looks like this:

{{< gsHighlight  python >}}
from cloudify import ctx

@operation
def start(**kwargs):
    # retrieve the port from the node's properties
    webserver_port = ctx.node.properties['port']

    with open('/tmp/index.html', 'w') as f:
        f.write('<p>Hello Cloudify!</p>')

    # use the port we withdrew previously when running the web server
    command = 'cd /tmp; nohup python -m SimpleHTTPServer {0} > /dev/null 2>&1' \
              ' & echo $! > /tmp/python-webserver.pid'.format(webserver_port)

    ctx.logger.info('Starting HTTP server using: {0}'.format(command))
    os.system(command)
{{< /gsHighlight >}}

# Updating & Retrieving Runtime Properties

Runtime properties are properties which are set during runtime and are relevant to node instances.
In our example, instead of having the webserver root set to `/tmp` we'll create a temporary folder and store its path as a runtime property so that the stop operation reads it when stopping the webserver.

{{< gsHighlight  python >}}
import os
import tempfile

from cloudify import ctx
from cloudify.decorators import operation


@operation
def start(**kwargs):
    webserver_root = tempfile.mkdtemp()
    # we're adding a property which is set during runtime to the runtime
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
    # setting this runtime property allowed us to refer to properties which
    # are set during runtime from different time in the node instance's lifecycle
    webserver_root = ctx.instance.runtime_properties['webserver_root']
    try:
        with open(os.path.join(webserver_root, 'python-webserver.pid'), 'r') as f:
            pid = f.read().strip()
        ctx.logger.info('Stopping HTTP server [pid={0}]'.format(pid))
        os.system('kill -9 {0}'.format(pid))
    except IOError:
        ctx.logger.info('HTTP server is not running!')
{{< /gsHighlight >}}

Runtime properties are saved in Cloudify's storage once the plugin's operation invocation is complete (The `@operation` decorator is responsible for that).

In any case where it is important to immediately save runtime properties to Cloudify's storage the `ctx.update` method should be called.

For example:

{{< gsHighlight  python >}}
ctx.instance.runtime_properties['prop1'] = 'This should be updated immediately!'
ctx.instance.update()
{{< /gsHighlight >}}

# Asynchronous Operations

In many cases, such as creating resources in a Cloud environment, an operation may be waiting for an asynchronous activity to end (e.g. wait for VM to start). Instead of implementing a wait-for mechanism in the operation which will wait until the asynchronous activity is over (which blocks the worker who executed the operation from executing other operations in the mean time), operations can request to be retried after some time and check whether the asynchronous activity is over.

## Requesting A Retry

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
`ctx.operation.max_retries` can be configured in Cloudify's manager blueprint. More information can be found in the [Workflows ]({{< relref "workflows/error-handling.md" >}}) section.
{{% /gsTip %}}


# Error Handling

Cloudify's workflows framework distinguishes between two kinds of errors:

- Recoverable errors - Cloudify's workflows will retry operations which raised such errors where all Python errors are treated as recoverable errors.
- Non-recoverable errors - Errors which should not be retried and it's up to the workflow to decide how to handle them.

In our current start operation, we don't verify that the webserver was actually started and listening on the specified port.

In this step we'll implement a `verify_server_is_up` method which will raise a non-recoverable error if the server was not started in a reasonable period of time:

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

## Error Details

When an operation fails due to some exception being thrown (intentionally or unintentionally), the exception details are stored in the
task_failed/task_reschduled events.

In some cases, you may want to explicitly raise a ``NonRecoverableError`` (for example) in response to some other exception that was raised
in your operation code. That is quite simple to achieve as shown in the previous example. However, what if you also want to preserve the original
exception details in addition to the exception raised by you? In that case you can use the `causes` keyword argument when raising a `RecoverableError`
or `NonRecoverableError`. This is shown in the following example (based on the previous example).

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


# Plugin Metadata

Several attributes under `ctx.plugin` can be used to access details about the plugin involved in the current operation.

* `ctx.plugin.name` returns the plugin name as defined in the application blueprint that imported the involved plugin.
* `ctx.plugin.package_name` and `ctx.plugin.package_version` return the package name and package version as defined in the application blueprint
  that imported the involved plugin.
* `ctx.plugin.prefix` returns the prefix in which the plugin is installed. For local workflows, `ctx.plugin.prefix` is equivalent to `sys.prefix`.
  For remote workflows, if the plugin is installed in the agent package, `ctx.plugin.prefix` is equivalent to `sys.prefix`. Otherwise,
  it will return the prefix in which the plugin is installed. This will be some subdirectory under `VIRTUALENV/plugins`.
* `ctx.plugin.workdir` returns a work directory that is unique for the current (deployment_id, plugin) pair. This directory can be used in cases
  where a plugin needs to write files to the file system to be read later on. (Note that this directory will not be migated during manager migration,
  so this directory should not be considered persistent but rather a convenient workspace).


# Testing Your Plugin

In most cases, the recommendation is to test your plugin's logic using local workflows and only then, run them as part of a Cloudify deployment. We have supplied you with a nice and tidy
decorator to do just that. It is provided by the cloudify-plugins-common's test_utils package, and it's very intuitive to use, But just in case let's look at an example:

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

### Now lets break down the arguments:
- blueprint_path - A path to the blueprint to run, this blueprint file would be copied to a temporary
 test directory. **This is the only mandatory input.**
- copy_plugin_yaml - Sometimes you'd want to test a plugin you wrote. If you specify this argument as True,
The decorator will try to traverse up the directory tree from the test file and find plugin.yaml. If the file was indeed
found it will be copied to the root of the temporary test directory (together with the blueprint file). Thus importing the
plugin.yaml of the current file should be done as if both the blueprint and the plugin.yaml are in the same folder.
- resources_to_copy - This argument enables you to pass a list of:
    - File paths that would be copied to the root temporary test dir.
    - A tuple of the format of (source_path, destination_path), where the destination_path is relative to
    the root of the temporary test dir (the entire dir structure would be taken care of by the decorator).
- temp_dir_prefix - If you have any special request for the temporary test dir prefix, you should supply it here.
- init_args - If you have any specific args to be pass to the local.init() method, pass them through here.
- inputs - A syntactic sugar for the init_args['inputs'] field.
- input_func_args - if you pass a function name into the inputs, you can use this arg to specify the args to the function.
- input_func_kwargs - if you pass a function name into the inputs, you can use this arg to specify the kwargs to the function.

The decorator sets up the environment for the test, and injects this environment as the first argument to the function.
Suppose it's called `cfy_local`. You could run executions via `cfy_local.execute('install')`, or access storage via `cfy_local.storage`.

#### Passing inputs:
Passing inputs isn't confined to static ones:

- You might want to pass a function name to the inputs arg, this function would be called, and the returned value would
    be set as the inputs for the init. This is practical when trying to use the same function over several decorator uses,
     while changing the inputs it receives. Note: it is up to you to handle the injected args and kwargs. e.g.:
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

- Another handy option is passing a path to a method belonging to the test method's class.
You might ask "But why not just use the first options, just passing the method name?",
Well the main reason for that is that the method doesn't actually exists when the decorator expression is evaluated,
But using the method's name enables you to gain access to such methods . e.g.:
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
### Context manager
The decorator functionality exists as a context manager as well. However, a few features will not work:

- Copy_plugin_yaml or passing any relative path in resources_to_copy.
- Passing a path to a function.

## Unit Testing

If you want to unit test a specific function that needs a `ctx` object, you can use [`cloudify.mocks.MockCloudifyContext`]({{< field "mock_ctx_link" >}}) which is provided by `cloudify-plugins-common`.

### Example: Using `MockCloudifyContext`

Assume your plugin code is located in `my_plugin.py`:

{{< gsHighlight  python >}}
from cloudify import ctx

@operation
def my_operation(**kwargs):
    prop1 = ctx.node.properties['node_property_1']
    ctx.logger.info('node_property_1={0}'.format(prop1))
{{< /gsHighlight >}}

Then you can use the following code to call the `my_operation` operation using a mock context object:

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

(Note: `MockCloudifyContext` accepts various additional parameters. Check the [documentation]({{< field "mock_ctx_link" >}}) for more information.)

# The end (Sort of)

That's it! You just wrote your first plugin! All you need now is to incorporate it within your blueprint.
For additional info see the [Plugins]({{< relref "blueprints/spec-plugins.md" >}}) specification.

# Additional Info

## The Context Object

The `ctx` context object contains contextual parameters mirrored from the blueprint along-side additional functionality:

### Properties context objects

* `ctx.instance.id` - The unique ID of the node's instance.
* `ctx.node.properties` - The properties of the node as declared under the `properties` dict.
* `ctx.instance.runtime_properties` - The properties that are assigned to a **node's instance** at runtime. These properties are either populated by the plugin itself (for instance, an automatically generated port that the plugin exposes when it's run), or are generated prior to the invocation of the plugin (for instance, the ip of the machine the plugin is running on).

### Utility context objects

* `ctx.logger` - a Cloudify specific logging mechanism which you can use to send logs back to the Cloudify manager environment.
* `ctx.download_resource` - Downloads a given resource.
* `ctx.download_resource_and_render` - Downloads a given resource and renders it according to an optional variables dictionary. The context itself is automatically injected, and available as `ctx`. A resource with this content:
 {{< gsHighlight  "yaml" >}}
    deployment_id: {{ctx.deployment.id}}
    test: {{hello}}
 {{< /gsHighlight >}}

    and `{'hello': 'world'}` as a `template_variables` dictionary, will be downloaded as a resource with this content:

    {{< gsHighlight  "yaml" >}}
    deployment_id: <current_deployment_id>
    test: world
    {{< /gsHighlight >}}

* `ctx.get_resource` - Reads a resource's data.
* `ctx.get_resource_and_render` - Reads a resource's data and renders it according to an optional variables dictionary. The context itself is automatically injected, and available as `ctx`.
   See example at ctx.download_resource_and_render.
* `ctx.instance.update` - Updates the node's runtime properties. This is automatically called each time an operation ends, thus it is only useful in the context of a single operation.

## Cloud Plugins

The lifecycle `start` operation should store the following runtime properties for the `Compute` node instance:

- `ip` - The VM's ip address reachable by Cloudify's manager.
- `networks` - A dictionary containing network names as keys and list of ip addresses as values.

See Cloudify's [OpenStack plugin]({{< relref "plugins/openstack.md" >}}) for reference.
