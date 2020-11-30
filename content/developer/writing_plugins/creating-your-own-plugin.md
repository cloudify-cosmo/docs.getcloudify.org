---
layout: bt_wiki
title: Writing Your Own Plugin
category: Writing Plugins
draft: false
weight: 10000
aliases: /plugins/creating-your-own-plugin/

plugin_link: https://github.com/cloudify-cosmo/cloudify-python-plugin
template_link: https://github.com/cloudify-cosmo/cloudify-plugin-template
blueprint_guide_link: getting-started-write-blueprint.html
plugins_common_link: https://github.com/cloudify-cosmo/cloudify-common
plugins_common_ref_link: reference-plugins-common.html
openstack_plugin_link: https://github.com/cloudify-cosmo/cloudify-openstack-plugin/blob/1.2/nova_plugin/server.py#L379
plugins_common_docs_link: http://cloudify-plugins-common.readthedocs.org/
terminology_link: reference-terminology.html
dsl_inputs_link: dsl-spec-inputs.html
local_workflows_api_link: http://cloudify-cli.readthedocs.org/en/latest/commands.html#local
mock_ctx_link: http://cloudify-plugins-common.readthedocs.org/en/latest/mocks.html#cloudify.mocks.MockCloudifyContext
---


# Preliminary

You should consider the following scenarios before creating a new plugin:

### My use case consists of basic REST requests or Terminal commands

We offer generic plugins, such as the [Fabric]({{< relref "working_with/official_plugins/Configuration/fabric" >}}) and [REST]({{< relref "working_with/official_plugins/Utilities/rest" >}}) plugins that enable you to orchestrate fairly generic operations without a custom plugin.

#### Fabric Example

Let's say that you need to perform some basic setup via a script, such as updating an HAProxy configuration.

Example HAProxy configuration Python script:

```python
import uuid
from cloudify import ctx
from fabric.api import put, run, sudo
CONFIG_PATH = '/etc/haproxy/haproxy.cfg'
NEW_CONFIG_PATH = 'resources/haproxy.cfg'
def configure():
    ctx.logger.info('Configuring HAProxy')
    haproxy_config = ctx.download_resource(NEW_CONFIG_PATH)
    tmpfile = '/tmp/haproxy_{0}.cfg'.format(uuid.uuid4())
    put(haproxy_config, tmpfile)
    ctx.logger.info('Validating the given HAProxy configuration file')
    run('/usr/sbin/haproxy -f {0} -c'.format(tmpfile))
    ctx.logger.info('Copying the configuration file to {0}'
                    .format(CONFIG_PATH))
    sudo('mv {0} {1}'.format(tmpfile, CONFIG_PATH))
    ctx.logger.info('Restarting HAProxy service')
    sudo('service haproxy restart')
    ctx.logger.info('HAProxy was configured successfully')
```

You can execute this on your host by packaging it with the following blueprint:

```yaml
tosca_definitions_version: cloudify_dsl_1_3
imports:
  - http://cloudify.co/spec/cloudify/5.0.0/types.yaml
  - plugin:cloudify-fabric-plugin
inputs:
  ip:
    type: string
  user:
    type: string
node_templates:
  haproxy_configuration:
    type: cloudify.nodes.Root
    interfaces:
      cloudify.interfaces.lifecycle:
        configure:
          implementation: fabric.fabric_plugin.tasks.run_task
          inputs:
            tasks_file: scripts/haproxy.py
            task_name: configure
            fabric_env:
              host_string: { get_input: ip }
              user: { get_input: user }
              key: { get_secret: agent_key_private }
```

Notice the following details:

  * `configure`: This is the Install Workflow operation that will execute this task. For more information, see [Built-in Workflow]({{< relref "working_with/workflows/built-in-workflows.md#the-install-workflow" >}}).
  * `implementation`: This is the operation defined in the Fabric Plugin for running a task.
  * `tasks_file`: This is the name of the file in your blueprint archive containing the task.
  * `task_name`: This is the name of the function in the `task_file`.
  * `fabric_env`: Define everything from connection details to environment variables.

Another option that you might consider using if your target device has custom terminal restrictions is the [Terminal plugin]({{< relref "working_with/official_plugins/Configuration/fabric" >}}).

#### REST Example

Let's say that you need to perform a basic POST operation. You can use the [REST]({{< relref "working_with/official_plugins/Utilities/rest" >}}) plugin to define the request, or series of requests, that you need to perform.

First define the requests as a YAML list in a `template.yaml` file:

```yaml
rest_calls:
  - path: /fauxapi/v1/?action=config_patch
    method: POST
    headers:
      Content-type: application/json
      fauxapi-auth: '{{ fauxapi_auth }}'
    raw_payload: resources/config.json
    payload_format: raw
    response_format: json
    recoverable_codes: [400]
    response_expectation:
      - ['message', 'ok']
```

Notice the following:

  * `path` is the REST path.
  * `method` is the REST method.
  * You can define the headers your endpoint requires.
  * You can pass a file, or Jinja2 template as the `raw_payload`.
  * You can define your expected API resource, `response_expectation`, as well as codes where we should perform as retry operation, `recoverable_codes`.

Example `config.json`:

    {
      "system": {
        "dnsserver": [
          "8.8.8.8",
          "8.8.4.4"
        ],
        "hostname": "newhostname"
      }
    }


Then you can package these file with a blueprint.

```yaml
tosca_definitions_version: cloudify_dsl_1_3
imports:
  - http://cloudify.co/spec/cloudify/5.0.0/types.yaml
  - plugin:cloudify-utilities-plugin
inputs:
  api_endpoint:
    description: >
      REST API endpoint of the pfSense instance
  api_key:
    description: >
      The api key for the REST service
  api_secret:
    description: >
      The api secret for the REST service
  token:
    description: >
      Your token.
node_templates:
  config_patch:
    type: cloudify.rest.Requests
    properties:
      hosts: [{ get_input: api_endpoint }]
      port: 443
      ssl: true
      verify: false
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          inputs:
            template_file: templates/template.yaml
            params:
              fauxapi_auth: { get_input: token }
```

### An existing plugin has most of functionality I need, but I require additional operations

{{< param product_name >}} node types are extensible.

Let's say that you want to create Kubernetes resources, only in addition to creating them, you need to perform additional operations that the existing plugin does not support. For example, create a new Docker container image.

The Kubernetes plugin allows you to create and delete a Kubernetes resource that you have defined in a file:

```yaml

  my-kube-deployment:
    type: cloudify.kubernetes.resources.FileDefinedResource
    properties:
      file: resources/deployment.yaml
    ## These are the operations performed by this node type.
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: kubernetes.cloudify_kubernetes.tasks.file_resource_create
        delete:
          implementation: kubernetes.cloudify_kubernetes.tasks.file_resource_delete
```

You can derive a new custom type and add additional scripts for building the docker image to a blueprint that you can reuse in your {{< param product_name >}} deployments.

Blueprint:

```yaml
tosca_definitions_version: cloudify_dsl_1_3
imports:
  - http://cloudify.co/spec/cloudify/5.0.0/types.yaml
  - plugins:cloudify-kubernetes-plugin
node_types:
  cloudify.CustomKubernetes.Sequence:
    derived_from:
      cloudify.interfaces.lifecycle:
        create:
          implementation: path/to/build/script.sh
          executor: central_deployment_agent
        start:
          implementation: kubernetes.cloudify_kubernetes.tasks.file_resource_create
        delete:
          implementation: kubernetes.cloudify_kubernetes.tasks.file_resource_delete
```

Notice the following details:
   * Now a script will be executed on the manager triggering a build during the `create` step.
   * The Kubernetes resource creation will now occur in the `start` operation instead of the `create` operation.

Now you can upload this blueprint and script to your {{< param cfy_manager_name >}}, as a name like "awesome-new-type".

    cfy blueprints upload awesome-new-type/blueprint.yaml -b awesome-new-type

Now you can reuse this blueprint in other blueprints:

```yaml
tosca_definitions_version: cloudify_dsl_1_3
imports:
  - http://cloudify.co/spec/cloudify/5.0.0/types.yaml
  - custom--blueprint:awesome-new-type
node_templates:
  my-kube-deployment:
    type: custom--cloudify.CustomKubernetes.Sequence
    properties:
      file: resources/deployment.yaml
```

Notice the following details:

  * We are importing the uploaded blueprint `awesome-new-type` with the `custom` namespace.
  * We are using the `cloudify.CustomKubernetes.Sequence` under the namespace `custom`. The full type name is now `custom--cloudify.CustomKubernetes.Sequence`.


# Introduction

Now that we have explored alternatives to creating a new plugin, let's talk about how to create a new plugin.

To illustrate how to write a plugin, this topic demonstrates how to create a plugin that is used to start a simple HTTP Web server using Python.

## Creating A Plugin Project

{{< param product_name >}} plugin projects are standard Python projects.

Each {{< param product_name >}} plugin requires `cloudify-common` as a dependency, because it contains the necessary APIs for interacting with {{< param product_name >}}.

`cloudify-common` documentation is located [here]({{< field "plugins_common_docs_link" >}}).

{{% tip title="Tip" %}}
You can use the [Plugin Template]({{< field "template_link" >}}) to setup the repository for your plugin.
{{% /tip %}}

## Setting Up the `setup.py` File for the Plugin

For example:

{{< highlight  python >}}
from setuptools import setup

setup(
    name='python-http-webserver-plugin',
    version='1.0',
    author='Cloudify',
    packages=['python_webserver'],
    install_requires=['cloudify-common>=5.0.0'],
)
{{< /highlight >}}

{{% tip title="Best Practice" %}}
With the exception of `cloudify-common`, it is strongly recommended that all third-party dependencies
(specified in the `install_requires` parameter) are version-pinned, rather than using a version range.
That will guarantee that the plugin is always set up using the very same dependencies, thus avoiding
cases of plugin code breaking due to incompatible upstream changes.

Alternatively, you could provide version ranges for dependencies, and pin them down during the Wagon
creation process. Refer to the "Creating Wagons" document for more information.
{{% /tip %}}

## Writing Plugin Operations

Plugin operations are standard Python methods.

For the purpose of demonstrating how to create a plugin, creation of the `start` and `stop` operations for a Python HTTP webserver plugin are described.

The start operation will create an `index.html` file and then start a webserver using the following shell command: `python -m SimpleHTTPServer` which starts an HTTP server listening on port 8000.

The start & stop operations are placed in a `tasks.py` module in the `python_webserver` package in the project.

In the following example, the {{< param product_name >}} logger, which is accessible using the `ctx.logger` object, is used.


### python_webserver/tasks.py
{{< highlight  python >}}
import os

from cloudify.decorators import operation

@operation
def start(ctx, **kwargs):
    with open('/tmp/index.html', 'w') as f:
        f.write('<p>Hello Cloudify!</p>')

    command = 'cd /tmp; nohup python -m SimpleHTTPServer > /dev/null 2>&1' \
              ' & echo $! > /tmp/python-webserver.pid'

    # use the ctx.logger object to send a formatted log with context
    # to the Manager. The displayed message is only part of the
    # log sent. A lot of context is supplied with the object.
    ctx.logger.info('Starting HTTP server using: {0}'.format(command))
    os.system(command)


@operation
def stop(ctx, **kwargs):
    try:
        with open('/tmp/python-webserver.pid', 'r') as f:
            pid = f.read().strip()
        ctx.logger.info('Stopping HTTP server [pid={0}]'.format(pid))
        os.system('kill -9 {0}'.format(pid))
    except IOError:
        ctx.logger.info('HTTP server is not running!')
{{< /highlight >}}

### Making operations resumable

If a workflow is interrupted (due to a Manager failure, eg. a power loss, or a task failure, or user cancel request) and then resumed, agent operations will not be interrupted - the Manager will continue waiting for them to finish. Therefore, nothing needs to be done for agent operations to make them resumable after a manager failure.
Management worker operations however will be retried, provided they are declared resumable. This declaration is done using the `operation` decorator: `@operation(resumable=True)`.

For a management worker operation to be safe for retrying, it must be made idempotent. There is no generic way to write resumable management worker operations, however useful guidelines include:
- use runtime properties to store intermittent state
- keep operation functions short and doing one thing only
- make sure runtime properties writes are persisted to storage using `ctx.instance.update()`
- avoid keeping state in memory without backing it to persistent storage
- before doing OS-level operations, check if they have already been done

*Example of resumable operations*
{{< highlight  python >}}
@operation(resumable=True)
def operation(ctx):
    # increase only if we haven't already increased the value
    if not ctx.instance.runtime_properties.get('value_written'):
        ctx.instance.runtime_properties['value'] += 1
        ctx.instance.runtime_properties['value_written'] True
        ctx.instance.update()

    # avoid calling the external command if a previous run of this operation
    # have already done so
    if not ctx.instance.runtime_properties.get('data'):
        ctx.instance.runtime_properties['data'] = subprocess.check_output(
            ['external_command'])
        ctx.instance.update()

    # file write - idempotent operation
    with open('/tmp/hello.txt', 'w') as f:
        f.write(ctx.instance.runtime_properties.get('data'))


# compare this to the following operation which cannot be safely resumed
@operation
def operation_nonresumable(ctx):
    # non-guarded increment - if the operation restarts after this, the value
    # would have been increased twice
    ctx.instance.runtime_properties['value'] += 1
    ctx.instance.update()

    # if this function was retried, the external command would run again
    ctx.instance.runtime_properties['data'] = subprocess.check_output(
            ['external_command'])

    # opening with 'a' - append is not idempotent - it might have already
    # been written by a previous run
    with open('/tmp/hello.txt', 'a') as f:
        f.write(ctx.instance.runtime_properties.get('data'))
{{< /highlight >}}


## Retrieving Node Properties

During the previous step, an HTTP webserver, which is now listening on port 8000, was started.
If the port was specified in the blueprint, to use that port, the `ctx` object that represents the context of the invocation exposes the node's properties, if the plugin's operation was invoked in the context of a node.

The port property can be retrieved using the following code:
{{< highlight  python >}}
webserver_port = ctx.node.properties['port']
{{< /highlight >}}

The updated start operation looks as follows:

{{< highlight  python >}}
@operation
def start(ctx, **kwargs):
    # retrieve the port from the node's properties
    webserver_port = ctx.node.properties['port']

    with open('/tmp/index.html', 'w') as f:
        f.write('<p>Hello Cloudify!</p>')

    # use the port that was withdrawn previously when running the Web server
    command = 'cd /tmp; nohup python -m SimpleHTTPServer {0} > /dev/null 2>&1' \
              ' & echo $! > /tmp/python-webserver.pid'.format(webserver_port)

    ctx.logger.info('Starting HTTP server using: {0}'.format(command))
    os.system(command)
{{< /highlight >}}

## Updating and Retrieving Runtime Properties

Runtime properties are properties that are set during runtime and are relevant to node instances.
In the example, instead of having the Webserver root set to `/tmp` a temporary folder is created and its path is stored as a runtime property so that the stop operation reads it when stopping the Webserver.

{{< highlight  python >}}
import os
import tempfile

from cloudify.decorators import operation

@operation
def start(ctx, **kwargs):
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
def stop(ctx, **kwargs):
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
{{< /highlight >}}

Runtime properties are saved in {{< param product_name >}} storage after the plugin's operation invocation is complete.

Where it is important to immediately save runtime properties to {{< param product_name >}} storage, call the `ctx.update` method.

For example:

{{< highlight  python >}}
ctx.instance.runtime_properties['prop1'] = 'This should be updated immediately!'
ctx.instance.update()
{{< /highlight >}}

## Asynchronous Operations

In many situations, such as creating resources in a cloud environment, an operation might be waiting for an asynchronous activity to end (for example, waiting for a VM to start).
Instead of implementing a wait-for mechanism in the operation that will wait until the asynchronous activity is over (which blocks the worker process that executes the operation
from executing other operations in the meantime), operations can request to be retried after a specific length time to check whether the asynchronous activity
has finished.

### Requesting A Retry

{{< highlight  python >}}
from cloudify.decorators import operation
from cloudify import exceptions

@operation
def start(ctx, **kwargs):
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
{{< /highlight >}}

{{% tip title="Tip" %}}
`ctx.operation.max_retries` can be configured in the {{< param product_name >}} blueprint. Additional information is located in the [Workflows ]({{< relref "working_with/workflows/error-handling.md" >}}) section.
{{% /tip %}}


## Handling Errors

The {{< param product_name >}} workflows framework distinguishes between two types of error:

- Recoverable errors - {{< param product_name >}} workflows will retry operations that generated such errors, where all Python errors are treated as recoverable errors.
- Non-recoverable errors - Errors that should not be retried and the workflow determines how to handle them.

In the current start operation, there is no verification that the Webserver was actually started and is listening on the specified port.

In this step, a `verify_server_is_up` method is implemented that generates a non-recoverable error if the server was not started within a reasonable period of time:

{{< highlight  python >}}
import os
import tempfile
import urllib2
import time


# import the NonRecoverableError class
from cloudify.exceptions import NonRecoverableError
from cloudify.decorators import operation


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
def start(ctx, **kwargs):
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
{{< /highlight >}}

### Error Details

In some cases, you might want to explicitly raise a {{< param product_name >}} error in response to some other exception that was raised
in your operation code. That is simple to achieve as shown in the previous example. However, if you also want to preserve the original
exception details in addition to the exception you raised, you can use the `causes` keyword argument when raising a `RecoverableError`
or `NonRecoverableError`. This is demonstrated in the following example (which is based on the previous example).

{{< highlight  python >}}
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
{{< /highlight >}}


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

In most cases, the recommendation is to test your plugin's logic using local workflows, and only then run them as part of a {{< param product_name >}} deployment. We have supplied you with a nice and tidy
decorator to do just that. The `cloudify-common`'s `test_utils` package enables you to do that. It is intuitive to use, and an example is provided below:

{{< highlight  python >}}
from cloudify.test_utils import workflow_test

@workflow_test(blueprint_path,
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
{{< /highlight >}}

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
        {{< highlight  python >}}
        from cloudify.test_utils import workflow_test

        def set_inputs(*args, **kwargs):
            inputs = {}
            ...
            return inputs

        @workflow_test(some_blue_print_path, inputs=set_inputs)
        def test_my_task(self, cfy_local)
            pass
        {{< /highlight >}}

- Another option is to pass a path to a method belonging to the test method's class. The reason for this, instead of just passing the method name, is that the method does not actually exist at the time that the decorator expression is evaluated, so using the method's name enables you to gain access to such methods. For example:
            {{< highlight  python >}}
            from cloudify.test_utils import workflow_test

            class MyClass:

                def set_inputs():
                    inputs = {}
                    ...
                    return inputs

                @workflow_test(some_blue_print_path, inputs='set_inputs')
                def test_my_task(self, cfy_local)
                    pass
            {{< /highlight >}}

#### Context Manager

The decorator functionality also exists as a context manager. However, the following features will not work:

- `copy_plugin_yaml` or passing any relative path in `resources_to_copy`.
- Passing a path to a function.

### Unit Testing

To unit test a specific function that needs a `ctx` object, you can use [`cloudify.mocks.MockCloudifyContext`]({{< field "mock_ctx_link" >}}) which is provided by `cloudify-common`.

#### Example: Using `MockCloudifyContext`

Assuming the plugin code is located in `my_plugin.py`:

{{< highlight  python >}}
from cloudify.decorators import operation

@operation
def my_operation(ctx, **kwargs):
    prop1 = ctx.node.properties['node_property_1']
    ctx.logger.info('node_property_1={0}'.format(prop1))
{{< /highlight >}}

Then use the following code to call the `my_operation` operation using a mock context object:

{{< highlight  python >}}
from cloudify.mocks import MockCloudifyContext
import my_plugin

props = {'node_property_1': 'value_1'}

mock_ctx = MockCloudifyContext(node_id='test_node_id',
                               node_name='test_node_name',
                               properties=props)

my_plugin.my_operation(mock_ctx)
{{< /highlight >}}

(Note: `MockCloudifyContext` accepts various additional parameters. Check the [documentation]({{< field "mock_ctx_link" >}}) for more information).

#### Example: Using `MockCloudifyContext` as a `threadlocal`

Certain plugins, written for older versions of Cloudify, rely on the `ctx` object being available as a Python
`threadlocal`. For example:

{{< highlight  python >}}
from cloudify import ctx
from cloudify.decorators import operation

@operation
def my_operation(**kwargs):
    prop1 = ctx.node.properties['node_property_1']
    ctx.logger.info('node_property_1={0}'.format(prop1))
{{< /highlight >}}

In such cases, you can use the following code to test:

{{< highlight  python >}}
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
{{< /highlight >}}

Now that the plugin is created, you need to incorporate it in your blueprint. For more information, see the [Plugins]({{< relref "developer/blueprints/spec-plugins.md" >}}) specification.

## Best Practices

### Overall Structure

#### Interface First

The most important part of designing a plugin, is designing its TOSCA "view". Even the most comprehensible plugin is almost entirely useless if users
can't make proper use of it within blueprints. Therefore, the first and foremost item to focus on should be the node types that are involved. The rationale:

* Node types are the mechanisms by which blueprints developers use the plugin.
* Users may not be software developers, therefore simplicity is key.
* Separation of interface from implementation provides the ability to change the implementation without the user having to worry about adjusting their blueprints.

#### Layered Approach

We propose the following layered approach for designing and implementing a {{< param product_name >}} plugin:

* Layer 1 (topmost): {{< param product_name >}} integration
* Layer 2: Context-independent code
* Layer 3 (optional): Third-party SDK

##### The Third-Party SDK Layer

This layer only applies for cases in which there exists a third-party Python-based API to the system we're interacting with. Examples:
* The OpenStack plugin (using the official OpenStack API libraries for Python)
* The AWS-SDK plugin (using `boto3`)
* The GCP plugin (using the official Python-based GCP API)

This layer is not a part of the plugin's codebase; instead, it is declared as a set of dependencies in the plugin's
`setup.py` file.

##### The Context-Independent Layer

Here comes the implementation of the plugin's functionality, optionally using third-party SDK's. The most important design principle here is
context independence, which means that the code makes no assumptions about the context in which it is being run. As a consequence:

* No {{< param product_name >}}-related code should be used in here
* Runtime dependencies should be provided to the code, rather than being looked-up or assumed

The rationale behind this principle is that we want to be able to use this code from anywhere, not only within a {{< param product_name >}} operation or workflow, thus:

* Making writing unit tests significantly easier.
* Shielding the majority of the plugin's code from changes in how the orchestrator interacts with plugins.

This layer should be designed with reuse and extensibility in mind.

##### The {{< param product_name >}} Integration Layer

This should be the simplest layer in the plugin. A good indication of a well-designed plugin is how small this layer is: the more "responsibility" included
in this layer, the more likely it is that the design of the context-independent layer could be improved.

In this layer, ideally, we would only have the {{< param product_name >}} operation functions, doing minimum amount of work and delegating to the lower layer
for processing, and then properly handling return values as well as exceptions.

### Referring to `ctx`

The `ctx` object is available to operations in two methods:

* As a `threadlocal` that can be imported as a global element (`from cloudify import ctx`)
* As a keyword argument called `ctx`

In previous versions of {{< param product_name >}}, developers were instructed to follow the `threadlocal` approach:

{{< highlight  python >}}
from cloudify import ctx
from cloudify.decorators import operation

...

@operation
def my_operation(input1, input2, **kwargs):
  ctx.logger.info('Hello')
{{< /highlight >}}

While this approach is straightforward when it comes to developing operations, it is cumbersome when considering writing unit tests.
That's because the `ctx` object needs to be placed as a `threadlocal` on the current thread and cleaned-up afterwards. In general,
code using `threadlocal` variables is generally harder, rather than easier, to call.

The preferred approach is to avoid importing `ctx` altogether and instead provide `ctx` as a keyword argument:

{{< highlight  python >}}
@operation
def my_operation(ctx, input1, input2, **kwargs):
  ctx.logger.info('Hello')
{{< /highlight >}}

### Downloading Resources using `ctx.download_resource`

The `download_resource` function may optionally receive a `target_path` argument. If it is not specified, the resource is downloaded into a new
temporary directory, by preserving the original resource's base name.

For example, the following code:

{{< highlight  python >}}
ctx.download_resource('resources/hello.html')
{{< /highlight >}}

— will result in a random directory created inside the operating system's temporary directory, and the file `hello.html`
downloaded into it (for example: `/tmp/tmp123456/hello.html`).

In that case, it is important to remember to not only delete the temporary resource once you're done with it, but to also delete its
parent directory (`/tmp/tmp123456` in the example above).

A preferred approach is to provide the `target_path` argument, and properly dispose of the resource when it's not needed anymore. For example:

{{< highlight  python >}}
import tempfile
import os

...
...

with tempfile.NamedTemporaryFile(delete=False) as f:
  f.close()
  ctx.download_resource('resources/hello.html', target_path=f.name)
  ...
  ...

os.remove(f.name)
{{< /highlight >}}

## Supplementary Information

### The Context Object

The `ctx` context object contains contextual parameters that are mirrored from the blueprint, alongside additional functionality:

#### Properties Context Objects

* `ctx.instance.id` - The unique ID of the node's instance.
* `ctx.node.properties` - The properties of the node as declared under the `properties` dictionary.
* `ctx.instance.runtime_properties` - The properties that are assigned to a **node's instance** at runtime. These properties are either populated by the plugin itself (for instance, an automatically generated port that the plugin exposes when it's run), or are generated prior to the invocation of the plugin (for instance, the ip of the machine the plugin is running on).

#### Utility Context Objects

* `ctx.logger` - A {{< param product_name >}}-specific logging mechanism to send logs back to the {{< param cfy_manager_name >}} environment.
* `ctx.download_resource` - Downloads a specified resource.
* `ctx.download_resource_and_render` - Downloads a specified resource and renders it according to an optional variables dictionary. The context itself is automatically injected, and available as `ctx`. A resource with the following content:
 {{< highlight  "yaml" >}}
    deployment_id: {{ctx.deployment.id}}
    test: {{hello}}
 {{< /highlight >}}

    and `{'hello': 'world'}` as a `template_variables` dictionary, is downloaded as a resource with the following content:

    {{< highlight  "yaml" >}}
    deployment_id: <current_deployment_id>
    test: world
    {{< /highlight >}}

* `ctx.get_resource` - Reads a resource's data.
* `ctx.get_resource_and_render` - Reads a resource's data and renders it according to an optional variables dictionary. The context itself is automatically injected, and available as `ctx`.
   See example at ctx.download_resource_and_render.
* `ctx.instance.update` - Updates the node's runtime properties. This is automatically called each time an operation ends, meaning that it is only useful in the context of a single operation.

#### Logging

Depending on your requirements, you may wish to have Python loggers have their logs emitted to the {{< param product_name >}} Context
logger (`ctx.logger`). This is especially useful if your plugin uses third-party libraries, which in turn perform
their own logging into standard Python loggers, and you would like to have logs from those third-party libraries
echoed to the {{< param product_name >}} Context logger.

To achieve this, you can use the `CloudifyCtxLoggingHandler` class:

{{< highlight  python >}}
from cloudify.logs import CloudifyCtxLoggingHandler

...
...

@operation
def my_operation(ctx, **kwargs):
    logger = ... # get a logger somehow
    logger.addHandler(CloudifyCtxLoggingHandler(ctx))

    ...

    logger.info("This will be printed to the {{< param product_name >}} Context logger in INFO level")
{{< /highlight >}}

### Cloud Plugins

The lifecycle `start` operation should store the following runtime properties for the `cloudify.nodes.Compute` node instance:

- `ip` - The IP address of the VM to be accessed by {{< param cfy_manager_name >}}.
- `networks` - A dictionary containing network names as keys and list of IP addresses as values.

See the [OpenStack plugin]({{< relref "working_with/official_plugins/Infrastructure/openstack.md" >}}) for reference.


### Updating plugins in a collection of deployments

If you'd like to perform an update for all the deployment of some blueprint,
and update only their plugins, you can perform a _plugins update_. You can find
more information on the CLI command [here](/cli/orch_cli/plugins/#update).
