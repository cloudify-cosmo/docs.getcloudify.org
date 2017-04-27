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


# Installing Cloudify Manager 4.0

## Prerequisites

This section requires that you have installed the Cloudify 4.0 CLI on your workstation. See [instructions](http://docs.getcloudify.org/4.0.0/installation/installation-overview/).

The following user stories are fully explained:

* I want to use a pre-baked Cloudify 4.0 manager image. [See pre-baked image](#about-the-pre-baked-image-option).
* I need to create the environment (networks, VMs) on which I will install Cloudify. [See management environment installation](#management-environment-installation).
* I have a VM on which I want to install Cloudify Manager. See [Bootstrap](#bootstrap).
* I have Cloudify Manager 4.0 and I want to configure it. See [Manager Configuration](#manager-configuration)
* I have a blueprint for a previous version of Cloudify and I want to use it with Cloudify Manager 4.0. See [Bootstrap](#using-a-pre-version-4-0-blueprint-with-cloudify-manager-4-0).


## About the Pre-baked Image Option

Cloudify Manager is distributed as a pre-baked image in the following image formats and marketplaces:

* [QCow2](http://getcloudify.org/downloads/get_cloudify.html)
* [VMDK](http://getcloudify.org/downloads/get_cloudify.html)
* [AWS Marketplace](http://getcloudify.org/downloads/get_cloudify.html)
* [Azure Marketplace](http://getcloudify.org/downloads/get_cloudify.html)

Pre-baked images are useful for users who do not have advanced security requirements or environment restrictions. They are also the fastest installation method.

{{% gsNote title="Notes" %}}

* If you are going to create your management environment using our example blueprints, you can use the pre-baked images. There are special instructions in the installation steps for each Cloud.
* If you want to use pre-baked images, but have restrictions that prevent you from using one of ours, you can build your own images using the [cloudify-image-bakery](https://github.com/cloudify-cosmo/cloudify-image-bakery).

{{% /gsNote %}}


## Management Environment Installation

It's assumed that you have existing Cloud infrastructure that you want to manage with Cloudify, including a specific network/VPC/etc. If we guessed correctly, skip to (#bootstrap).

If that assumption is false, we have several example infrastructure blueprints that you can use to deploy your Cloudify Manager. To use these examples, first download and extract the example repository:

```shell
$ curl -L https://github.com/cloudify-examples/aws-azure-openstack-blueprint/archive/4.0.tar.gz | tar xv
```

### AWS Infrastructure Installation

Prepare your AWS inputs file.

```shell
$ cp aws-azure-openstack-blueprint-4.0/inputs/aws.yaml.example inputs.yaml
```

Uncomment and provide values for the following fields:

* aws_access_key_id: ''
* aws_secret_access_key: ''

If you do not have these credentials, follow [these instructions](http://stackoverflow.com/questions/21440709/how-do-i-get-aws-access-key-id-for-amazon) or talk to your administrator.

All other fields are optional. Most frequently you will want to change the region. In that case, you will also need to update the *Region Overrides* section in the example.

{{% gsNote title="Note" %}}
To use a pre-baked image, set the value of the ```example_aws_virtual_machine_image_id``` input to the AMI of the pre-baked Cloudify Manager 4.0 image.<br>
The current versions for each region are documented on [our website](http://getcloudify.org/downloads/get_cloudify.html).
{{% /gsNote %}}
 

Now, install the AWS infrastructure:

```shell
$ cfy install aws-azure-openstack-blueprint-4.0/aws/blueprint.yaml -i inputs.yaml --task-retries=15 --task-retry-interval=15```
Initializing local profile ...
Initialization completed successfully
Initializing blueprint...
Initialized blueprint.yaml
If you make changes to the blueprint, run `cfy init blueprint.yaml` again to apply them
2019-12-31 00:00:00.000  CFY <local> Starting 'install' workflow execution
```
To obtain information about a resource, you can run:

```shell
$ cfy node-instances example_aws_elastic_ip
[
...
   "id": "example_aws_elastic_ip_q0qu0b",
   "name": "example_aws_elastic_ip",
...
   "runtime_properties": {
...
     "aws_resource_id": "XX.XXX.XX.X",
...
]
```

The value of the ```example_aws_elastic_ip``` is the IP that you will use to install your Cloudify Manager in the bootstrap phase. You can also get this value from ```cfy deployments outputs```.


### Azure Infrastructure Installation

To prepare for this installation, verify that you have a key pair. If you do not, generate them with these [instructions](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

Copy the public key material that you generated:

```shell
$ cat ~/.ssh/id_rsa.pub # copy this to clipboard.
```

Prepare your Azure inputs file.

```shell
$ cp aws-azure-openstack-blueprint-4.0/inputs/azure.yaml.example inputs.yaml
```

Uncomment and provide values for the following fields:

* subscription_id
* tenant_id
* client_id
* client_secret
* example_azure_virtual_machine_public_key_data

If you do not have these credentials, follow these [instructions](https://docs.microsoft.com/en-us/rest/api/#client-registration) or talk to your administrator.

All other fields are optional.

{{% gsNote title="Note" %}}
If you want to use a pre-baked image, set the value of the example_azure_virtual_machine_resource_config input to the following:

```
XYXYXYXYXYXYXYXYXYXYXYXXYXYXYXYXYXYXYXYXYXYXYXXYXYX
XYXYXYXYXYXYXYXYXYXYXYXXYXYXYXYXYXYXYXYXYXYXYXXYXYX
XYXYXYXYXYXYXYXYXYXYXYXXYXYXYXYXYXYXYXYXYXYXYXXYXYX
XYXYXYXYXYXYXYXYXYXYXYXXYXYXYXYXYXYXYXYXYXYXYXXYXYX
```
{{% /gsNote %}}
 


Now, install the Azure infrastructure:

```shell
$ cfy install aws-azure-openstack-blueprint-4.0/azure/blueprint.yaml -i inputs.yaml --task-retries=15 --task-retry-interval=15```
Initializing local profile ...
Initialization completed successfully
Initializing blueprint...
Initialized blueprint.yaml
If you make changes to the blueprint, run `cfy init blueprint.yaml` again to apply them
2019-12-31 00:00:00.000  CFY <local> Starting 'install' workflow execution
```

To obtain information about a resource, you can run:

```shell
$ cfy node-instances example_azure_virtual_machine

[
...
  {
...
    "name": "example_azure_virtual_machine",
...
    "runtime_properties": {
...
      "ip": "10.10.1.4",
...
      "public_ip": "XX.XXX.XX.XX"
    },
    "state": "started",
    "version": 9
  }
...
]
```

The value of the ```example_azure_virtual_machine public_ip``` runtime property is the IP that you will use to install your Cloudify Manager in the bootstrap phase. You can also get this value from ```cfy deployments outputs```.


### Openstack Infrastructure Installation

Prepare your Openstack inputs file.

```shell
$ cp aws-azure-openstack-blueprint-4.0/inputs/openstack.yaml.example inputs.yaml
```

Uncomment and provide values for the following fields:

* keystone_username
* keystone_password
* keystone_tenant_name
* keystone_url
* region
* example_openstack_virtual_machine_image_id
* example_openstack_virtual_machine_flavor_id

If you do not have these credentials, follow these instructions [keystone v2](https://docs.openstack.org/developer/python-keystoneclient/using-api-v2.html) or [keystone v3]([https://docs.openstack.org/developer/python-keystoneclient/using-api-v3.html) or talk to your administrator.

{{% gsNote title="Note" %}}
To use a pre-baked image, set the value of the ```example_openstack_virtual_machine_image_id`` input to the ``image_id`` of the pre-baked Cloudify Manager 4.0 image.<br>If you do not have one in your Openstack account, download an image from [our website](http://getcloudify.org/downloads/get_cloudify.html), then upload it to your openstack via the [Horizon UI](https://docs.openstack.org/user-guide/dashboard-manage-images.html) or via [Glance](https://docs.openstack.org/cli-reference/glance.html).
{{% /gsNote %}}


Now, install the Openstack infrastructure:

```shell
$ cfy install aws-azure-openstack-blueprint-4.0/openstack/blueprint.yaml -i inputs.yaml --task-retries=15 --task-retry-interval=15```
Initializing local profile ...
Initialization completed successfully
Initializing blueprint...
Initialized blueprint.yaml
If you make changes to the blueprint, run `cfy init blueprint.yaml` again to apply them
2019-12-31 00:00:00.000  CFY <local> Starting 'install' workflow execution
```

To obtain information about a resource, you can run:

```shell
$ cfy node-instances example_openstack_floating_ip
[
...
  {
...
    "name": "example_openstack_floating_ip",
...
    "runtime_properties": {
      "floating_ip_address": "XXX.XX.XXX.XX"
    },
...
  }
...
]

```

The value of the ```example_openstack_floating_ip floating_ip_address``` runtime property is the IP that you will use to install your Cloudify Manager in the bootstrap phase. You can also get this value from ```cfy deployments outputs```.


## Bootstrap

If you have a clean Centos or RHEL VM on which you want to install Cloudify Manager 4.0, you need to bootstrap. If you used a pre-baked image to install your manager, skip to [Manager Configuration](#manager-configuration).

First, log into the VM, install the Cloudify RPM, and copy your Cloudify Manager 4.0 inputs file to your local directory.

```shell
[cloudify@cloudify ~]$ sudo rpm -i http://repository.cloudifysource.org/cloudify/4.0.0/rc1-release/cloudify-4.0.0~rc1.el6.x86_64.rpm
You're about to install Cloudify!
Thank you for installing Cloudify!
[cloudify@cloudify ~]$ cp /opt/cfy/cloudify-manager-blueprints/simple-manager-blueprint-inputs.yaml inputs.yaml
```

Uncomment and provide values for the following fields:

* public_ip - It is recommended that you use the IP with which you SSHed, or you could use localhost.
* private_ip - This should be the IP of the interface, such as eth0 or eth1, that you want Cloudify Manager to listen on.
* ssh_key_filename - To generate a new one, it's recommended to follow these [instructions](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).
* ssh_user - This is the SSH user that you want Cloudify to use during bootstrap. Usually this will be Centos, although it depends on the VM you are using. For example, in this instance the user is "cloudify".

All other fields are optional and depend on your system requirements.

Now, you will bootstrap:

```shell
[cloudify@cloudify ~]$ cfy bootstrap /opt/cfy/cloudify-manager-blueprints/simple-manager-blueprint.yaml -i inputs.yaml
Initializing profile temp-AAAAAA...
Initialization completed successfully
Executing bootstrap validation...
Initializing blueprint...
....
2017-04-03 11:19:40.715  CFY <manager> 'execute_operation' workflow execution succeeded
Bootstrap complete
Manager is up at [public_ip]
##################################################
Manager password is [manager_password]
##################################################
```

At the end of the bootstrap process the admin ```default_tenant``` username is printed. Use it in the next step.

## Manager Configuration

There are a few recommended steps for configuring Cloudify Manager.

### Create Profiles and Tenants.

First, you create a profile using the Cloudify CLI:

```shell
$ cfy profiles use [public_ip] --profile-name [alias] -s [ssh_user] -k [ssh_key_filename] -u admin -p [manager_password] -t default_tenant
Attempting to connect...
Initializing profile azure...
Initialization completed successfully
Using manager [public_ip] with port 80
```

Now, you create any tenants that you require, and switch to the tenant for further configuration:

```shell
$ cfy tenants create demo
Tenant `demo` created
$ cfy profiles use [public_ip] --profile-name [alias-demo] -u admin -p [manager_password] -t demo
Attempting to connect...
Initializing profile azure...
Initialization completed successfully
Using manager [public_ip] with port 80
```

### Add Your Secrets

Secrets are shared with tenants.

#### AWS

```shell
$ cfy secrets create aws_access_key_id -s AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Secret `aws_access_key_id` created
$ cfy secrets create aws_secret_access_key -s AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Secret `aws_secret_access_key` created
```

#### Azure

```shell
$ cfy secrets create subscription_id -s AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Secret `subscription_id` created
$ cfy secrets create tenant_id -s AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Secret `tenant_id` created
$ cfy secrets create client_id -s AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Secret `client_id` created
$ cfy secrets create client_secret -s AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Secret `client_secret` created
```


#### Openstack

```shell
$ cfy secrets create keystone_username -s AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Secret `keystone_username` created
$ cfy secrets create keystone_password -s AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Secret `keystone_password` created
$ cfy secrets create keystone_tenant_name -s AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Secret `keystone_tenant_name` created
$ cfy secrets create keystone_url -s AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Secret `keystone_url` created
```

### Upload Plugins to Cloudify Manager:

{{% gsNote title="Note" %}}
You need to download the plugin packages from [our website](http://getcloudify.org/downloads/plugin-packages.html)
{{% /gsNote %}}

**Example:**

```shell
$ curl -O http://repository.cloudifysource.org/cloudify/wagons/cloudify-diamond-plugin/1.3.5/cloudify_diamond_plugin-1.3.5-py27-none-linux_x86_64-centos-Core.wgn
$ curl -O http://repository.cloudifysource.org/cloudify/wagons/cloudify-diamond-plugin/1.3.5/cloudify_diamond_plugin-1.3.5-py27-none-linux_x86_64-Ubuntu-trusty.wgn
$ curl -O http://repository.cloudifysource.org/cloudify/wagons/cloudify-openstack-plugin/2.0.1/cloudify_openstack_plugin-2.0.1-py27-none-linux_x86_64-centos-Core.wgn
$ curl -O http://repository.cloudifysource.org/cloudify/wagons/cloudify-aws-plugin/1.4.4/cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn
$ cfy plugins upload cloudify_diamond_plugin-1.3.5-py27-none-linux_x86_64-centos-Core.wgn
$ cfy plugins upload cloudify_diamond_plugin-1.3.5-py27-none-linux_x86_64-Ubuntu-trusty.wgn
$ cfy plugins upload cloudify_openstack_plugin-2.0.1-py27-none-linux_x86_64-centos-Core.wgn
$ cfy plugins upload cloudify_aws_plugin-1.4.4-py27-none-linux_x86_64-centos-Core.wgn
```

#### Using a Pre-version 4.0 Blueprint with Cloudify Manager 4.0 

_We will support a method for configuring Cloudify Manager to support blueprints writing for Cloudify <4.0._