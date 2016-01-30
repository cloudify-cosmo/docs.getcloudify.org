---
layout: bt_wiki
title: Script Plugin
category: Plugins
draft: false
abstract: "Cloudify script plugin description and configuration"
weight: 1100

types_yaml_link: http://www.getcloudify.org/spec/cloudify/3.2/types.yaml
repo_link: https://github.com/cloudify-cosmo/cloudify-script-plugin
client_reference_link: https://github.com/cloudify-cosmo/cloudify-plugins-common/blob/3.2/cloudify/proxy/client.py
hello_world_example_link: https://github.com/cloudify-cosmo/cloudify-hello-world-example
---
{{% gsSummary %}} {{% /gsSummary %}}


# Description

The script plugin can be used to map node life cycle operations and workflows to scripts that are included in your blueprint. Scripts can be written in python, bash, ruby, you name it

The script plugin comes pre-installed with the default agent packages and is defined in `types.yaml`.
The source code can be found at [{{< field "repo_link" >}}]({{< field "repo_link" >}})


# Plugin Requirements:

* Python Versions:
  * 2.6.x
  * 2.7.x


# Usage

Following are usage examples demonstrating different configuration options.

##  Basic Usage

`blueprint.yaml`
{{< gsHighlight  yaml  >}}
imports:
  - {{< field "types_yaml_link" >}}

node_templates:
  example_web_server:
    # The web server type is only used for this example. The type used
    # could be any valid cloudify type.
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start: scripts/start.sh
{{< /gsHighlight >}}

`scripts/start.sh`
{{< gsHighlight  bash  >}}
#! /bin/bash -e
ctx logger info "Hello to this world"
{{< /gsHighlight >}}

Let's walk through this example and explain what's going on.


First, notice how the `cloudify.interface.lifecycle.start` operation is mapped directly to a script. When an operation is mapped, if the mapping points to a resource that is included in the blueprint directory, it is considered to be a script and the script plugin is used. So in fact, the above mapping is equivalent to:
{{< gsHighlight  yaml  >}}
interfaces:
  cloudify.interfaces.lifecycle:
    start:
      implementation: script.script_runner.tasks.run
      inputs:
        script_path: scripts/start.sh
{{< /gsHighlight >}}


Now lets go through the short example script.


The first line
{{< gsHighlight  bash  >}}
#! /bin/bash -e
{{< /gsHighlight >}}

will make this script run with `bin/bash`, but we could just as well write the script in `ruby` for example and point to `/bin/ruby`.

{{% gsNote title="Note" %}}
There is another way to tell the script plugin how to execute the script which is detailed later in this guide. It could be useful for running scripts in windows, for example.
{{% /gsNote %}}

The second line
{{< gsHighlight  bash  >}}
ctx logger info "Hello to this world"
{{< /gsHighlight >}}

demonstrates how scripts can access the operation context. This line is equivalent to writing
{{< gsHighlight  python  >}}
ctx.logger.info('Hello to this world')
{{< /gsHighlight >}}

within a python plugin operation.

A more detailed description on accessing the operation context is provided later in this guide.

## Process configuration

The following example shows how you could configure the working directory the script is executed in, pass arguments to the script and update environment variables of the script process.

`blueprint.yaml`
{{< gsHighlight  yaml  >}}
imports:
  - {{< field "types_yaml_link" >}}

node_templates:
  example_web_server:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: scripts/start.sh
          inputs:
            process:
              # this directory should already exist
              cwd: /tmp/workdir
              args: [arg1_value, arg2_value]
              env:
                MY_ENV_VARIABLE: MY_ENV_VARIABLE_VALUE
{{< /gsHighlight >}}

{{% gsNote title="Note" %}}
The recommended way for setting environment variables is by using operation inputs as described in the [Operation Inputs](plugin-script.html#operation-inputs) section.
{{% /gsNote %}}

`scripts/start.sh`
{{< gsHighlight  bash  >}}
#! /bin/bash -e

# will log "current working directory is: /tmp/workdir"
ctx logger info "current working directory is: ${PWD}"

# will log "first arg is: arg1_value"
ctx logger info "first arg is: $1"

# will log "my env variable is: MY_ENV_VARIABLE_VALUE"
ctx logger info "my env variable is: ${MY_ENV_VARIABLE}"

{{< /gsHighlight >}}

## Python scripts

Python scripts get special treatment in the script plugin. If the script path ends with a `.py` extension, it gets evaluated within the plugin operation. This provides a simple way to access to full plugin API without having to write a full blown plugin.

### Example

`blueprint.yaml`
{{< gsHighlight  yaml  >}}
imports:
  - {{< field "types_yaml_link" >}}

node_templates:
  example_web_server:
    type: cloudify.nodes.WebServer
    properties:
      port: 8080
    interfaces:
      cloudify.interfaces.lifecycle:
        start: scripts/start.py
{{< /gsHighlight >}}

`scripts/start.py`
{{< gsHighlight  python  >}}
from cloudify import ctx

ctx.logger.info('Just logging the web server port: {0}'
                .format(ctx.node.properties['port']))
{{< /gsHighlight >}}

### Operation Inputs
You can import `ctx_parameters` from `cloudify.state` to access operation inputs in a python script.

Assuming a `port` operation input was passed, you can access it like this:

{{< gsHighlight  python  >}}
from cloudify import ctx
from cloudify.state import ctx_parameters as inputs

ctx.logger.info('The port operation input is : {0}'
                .format(inputs['port']))
{{< /gsHighlight >}}



### Eval Python

If you a want a script to get evaluated as python and it does not have a `.py` extension, you can specify this explicity with the `eval_python` process configuration.

{{< gsHighlight  yaml  >}}
interfaces:
  cloudify.interfaces.lifecycle:
    start:
      implementation: script/my_python_script
      inputs:
        process:
          eval_python: true
{{< /gsHighlight >}}

If on the other hand a script does have a `.py` extension and you want it to get executed in an external process, simply pass `false` to the `eval_python` process configuration. Do note however, that accessing the operation context in this case will be done through the [context proxy](#context-proxy) as with any other none python script.

## Command Prefix

In some cases, you do not want to use `#!` to specify how to execute the script (or cannot, in case you are running the script on windows). In this case, you can use the `command_prefix` process configuration as follows

`blueprint.yaml`
{{< gsHighlight  yaml  >}}
imports:
  - {{< field "types_yaml_link" >}}

node_templates:
  example_web_server:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: scripts/start.rb
          inputs:
            process:
              command_prefix: /opt/ruby/bin/ruby
{{< /gsHighlight >}}

This will execute `start.rb` with the ruby binary in `/opt/ruby/bin/ruby`

Another use case for this would be to run a powershell script on windows. This can be achieved like this:

`blueprint.yaml`
{{< gsHighlight  yaml  >}}
imports:
  - {{< field "types_yaml_link" >}}

node_templates:
  example_web_server:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: scripts/start.ps1
          inputs:
            process:
              command_prefix: powershell
{{< /gsHighlight >}}

This will execute the script using the `powershell` binary.


## Hello World Example
For a more complete usage example, check out our [Hello World]({{< field "hello_world_example_link" >}}) example.


# Operation Inputs

The script plugin supports passing node template operation inputs as environment variables which will be available in the script's execution environment.
Complex data structures such as dictionaries and lists will be JSON encoded when exported as environment variables.

In the following example, the `port` input set for the `start` operation will be available as a `port` environment variable within the `start.sh` script:

`blueprint.yaml`
{{< gsHighlight  yaml  >}}
imports:
  - {{< field "types_yaml_link" >}}

node_templates:
  example_web_server:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: scripts/start.sh
          # start operation inputs
          inputs:
            port: 8080
{{< /gsHighlight >}}

`scripts/start.sh`
{{< gsHighlight  sh  >}}
echo "Starting web server..."
nohup python -m SimpleHTTPServer ${port} > /dev/null 2>&1 &
{{< /gsHighlight >}}


{{% gsNote title="Note" %}}
* Since `process` and `script_path` are script-plugin reserved operation inputs, these won't be available as environment variables in the script's execution environment.
* Inputs are not set for Python scripts running by evaluating Python code. More information about Python scripts evaluation can be found in [Process configuration options](plugin-script.html#process-configuration-options).
{{% /gsNote %}}



# Process configuration options
* `cwd` Set the working directory for the script.
* `env` Update environment variables of the script process.
* `args` Arguments to pass to the scripts.
* `command_prefix` Prefix to add before the script path. This could be used instead of `#!`.
* `eval_python` Boolean denoting whether the script should be evaluated as python code or executed as an external process.
* `ctx_proxy_type` The [context proxy](#context-proxy-protocol) type. (none, unix, tcp or http).


# Workflow scripts
You can use the script plugin to execute workflow scripts.

Say you want to add a custom workflow that runs a custom operation on each node. First we will write a simple blueprint with 2 nodes:

`blueprint.yaml`
{{< gsHighlight  yaml  >}}
imports:
  - {{< field "types_yaml_link" >}}

node_templates:
  node1:
    type: cloudify.nodes.Root
    interfaces:
      custom:
        touch: scripts/touch.py
  node2:
    type: cloudify.nodes.Root
    interfaces:
      custom:
        touch: scripts/touch.py

workflows:
  touch_all:
    mapping: workflows/touch_all.py
    parameters:
      touched_value:
        description: the value to touch the instance with
{{< /gsHighlight >}}

Next, let's write the `touch.py` script. Notice that this script ends with a `.py` extension so it will get evaluated as python code.

`scripts/touch.py`
{{< gsHighlight  python  >}}
from cloudify import ctx
from cloudify.state import ctx_parameters as p

ctx.instance.runtime_properties['touched'] = p.touched_value
{{< /gsHighlight >}}

This script will update the `touched` runtime property of the current node instance with an expected property `touched_value` that will be injected by the workflow executing this operation.


Finally, let's write the actual workflow.

`workflows/touch_all.py`
{{< gsHighlight  python  >}}
from cloudify.workflows import ctx
from cloudify.workflows import parameters as p

for node in ctx.nodes:
    for instance in node.instances:
        instance.execute_operation('custom.touch', kwargs={
            'touched_value': p.touched_value
        })
{{< /gsHighlight >}}


Now we can execute this workflow
{{< gsHighlight  bash  >}}
cfy executions start -w touch_all -d my_deployment --parameters '{"touched_value": "my_value"}'
{{< /gsHighlight >}}

After which, all the node instances will have their `touched` runtime property set to `my_value`.

{{% gsNote title="Note" %}}
Workflow scripts are always evaluated as python code. At the moment it is not possible writing workflow scripts in other languages.
{{% /gsNote %}}

# Context Proxy

In the previous examples, `ctx` was referenced from within the scripts several times. This mechanism provides means for accessing the `ctx` object the way it is usually accessed when [writing plugins](plugins-authoring.html).

What follows is a description of how calls to the `ctx` executable, translate to the `ctx` object access.

## Attribute access
{{< gsHighlight  bash  >}}
#! /bin/bash
ctx bootstrap-context cloudify-agent agent-key-path
{{< /gsHighlight >}}
Translates to
{{< gsHighlight  python  >}}
ctx.bootstrap_context.cloudify_agent.agent_key_path
{{< /gsHighlight >}}

Another thing to note in this example is that `-` in attributes (as an argument) will be replaced with `_`.

## Simple method invocation
{{< gsHighlight  bash  >}}
#! /bin/bash
ctx logger info "Some logging"
{{< /gsHighlight >}}
Translates to
{{< gsHighlight  python  >}}
ctx.logger.info('Some logging')
{{< /gsHighlight >}}

In this example, a `logger` attribute is searched on the `ctx` object. Once found, an `info` attribute is searched on the `logger` result. Once found, it discovers that `info` is callable so it invokes it with the remaining arguments.

## Method invocation with kwargs
{{< gsHighlight  bash  >}}
#! /bin/bash
ctx download-resource images/hello.png '@{"target_path": "/tmp/hello.png"}'
{{< /gsHighlight >}}
Translates to
{{< gsHighlight  python  >}}
ctx.download_resource('images/hello.png', **{'target_path': '/tmp/hello.png'})
{{< /gsHighlight >}}

In this example, notice how the last argument starts with `@`. This will be further explained later on but for now, suffice to say this means the argument will be parsed as json.

Now that we know that the last argument is a dict, as the above demonstrates, if the last argument of a method invocation is a dict, it will be treated as `kwargs` to the method invocation.

## Dict access
{{< gsHighlight  bash  >}}
#! /bin/bash
# read access
ctx node properties application_name
ctx target instance runtime-properties username
ctx instance runtime-properties endpoint.port
ctx instance runtime-properties endpoint.urls[2]

# write access
ctx instance runtime-properties my_property my_value
ctx instance runtime-properties my_properties.my_nested_property nested_value
{{< /gsHighlight >}}
Translates to
{{< gsHighlight  python  >}}
ctx.node.properties['application_name']
ctx.target.instance.runtime_properties['username']
ctx.instance.runtime_properties['endpoint']['port']
ctx.instance.runtime_properties['endpoint']['urls'][2]

ctx.instance.runtime_properties['my_property'] = 'my_value'
ctx.instance.runtime_properties['my_properties']['my_nested_property'] = 'nested_value'
{{< /gsHighlight >}}

Once a dict attribute is discovered during the attribute search the following logic applies:

* If there is a single argument left, the call is considered to be a read access and the key path is calculated
  as the above demonstrates.
* If there are 2 arguments left, the call is considered to be a write access and the key path is set to the value
  of the second argument left. If a dict does not exist in the intermediate path, it is created on the fly.

## Non string arguments
Sometimes you want to pass arguments that are not strings - for example setting a runtime property to a number. In this case, you can prefix an argument with `@` and it will be json parsed before being evaluated.

{{< gsHighlight  bash  >}}
#! /bin/bash
ctx instance runtime-properties number_of_clients @14
{{< /gsHighlight >}}
Translates to
{{< gsHighlight  python  >}}
ctx.instance.runtime_properties['number_of_clients'] = 14  # instead of = '14'
{{< /gsHighlight >}}

## Returning a value
If you want the operation to return a value you can use `ctx returns some_value`.
This invocation will set `some_value` on the current `ctx` and the script plugin will return this value when the script terminates.

It should be noted that this call will not make the script terminate, but it is probably best practice to make this call at the end of the script.

## Command line optional arguments of `ctx`
These following flags should appear before the positional arguments.

* `-t, --timeout=TIMEOUT` Request timeout in seconds (Default: `5`)
* `-j, --json-output` Outputs the call result as valid json instead of its string value (Default: `False`)
* `--json-arg-prefix=PREFIX` Prefix for arguments that should be processed as json (Default: `@`)
* `--socket-url=SOCKET_URL` The ctx socket url (Default: the environment variable `CTX_SOCKET_URL`). Normally the environment variable `CTX_SOCKET_URL` will be injected by the script plugin so this option should probably only be used in conjunction with `ctx-server` during script debugging.

# Debugging scripts

TODO

# Context Proxy Protocol

When you call the `ctx` executable you are actually invoking a CLI client that comes pre-installed with the plugin.
Under the hood, when the script plugin executes your script, it also starts a ctx proxy server that delegates calls to the actual `ctx` object instance.

Before the script plugins starts the proxy server it checks the following:

* If ZeroMQ is installed (which applies if using the default agent packages)
  - If running on linux, a unix domain socket is used as the transport layer
  - If running on windows, a tcp socket is used as the transport layer
* If ZeroMQ is not installed an http based transport layer is used

This behavior can be overridden by setting `proxy_ctx_type` of the process configuration to be one of `unix`, `tcp`, `http` or `none`. If `none` is set, no proxy server will be started.

The `ctx` CLI client implements a simple protocol on top of the above transport layers that can be implemented in other languages to provide a more streamlined access to the context.

When the script plugin executes the script, it updates the script process with the `CTX_SOCKET_URL` environment variable.

* If a unix domain socket based proxy was started, its value will look like: `ipc:///tmp/ctx-f3j22f.socket`
* If a tcp socket based proxy was started, its value will look like: `tcp://127.0.0.1:53213`
* If an http socket based proxy was started, its value will look like: `http://localhost:35321`

The first two are valid ZeroMQ socket URLs and should be passed as is to the ZeroMQ client. The last one is the HTTP endpoint that should be used when making REST calls.

If a ZeroMQ client is implemented, it should start a `request` based socket (as the proxy server starts the matching `response` socket)

If an HTTP client is implemented, it should make `POST` requests to the socket URL endpoint.

In all the protocols, the format of the request body is a json with this structure:
{{< gsHighlight  json  >}}
{
    "args": [...]
}
{{< /gsHighlight >}}
Where args is the list of arguments. So, for example, the arguments for `ctx.properties['port']` will be `["properties", "port"]`

The format of the response body is a json with the following structure.

In case of a successful execution:
{{< gsHighlight  json  >}}
{
   "type": "result",
   "payload": RESULT_BODY
}
{{< /gsHighlight >}}
In case of a failed execution:
{{< gsHighlight  json  >}}
{
   "type": "error",
   "payload": {
      "type": ERROR_TYPE,
      "message": ERROR_MESSAGE,
      "traceback": ERROR_TRACEBACK
   }
}
{{< /gsHighlight >}}

You can look at the [CLI implementation]({{< field "client_reference_link" >}}) for reference.

# Troubleshooting

### nohup
When you use `nohup` in your scripts, don't forget to redirect the output and stderr to `/dev/null`
and to run the operation in the background using `&`.
For example:
{{< gsHighlight  bash  >}}
nohup python -m SimpleHTTPServer > /dev/null 2>&1 &
{{< /gsHighlight >}}

### File not found error
Different linux distributions use different default interpreters. Thus one might use bash, while the other uses sh. Hence while bash will noramlly return an informative message in regards to the shebang line, the sh message might look something like this:
{{< gsHighlight  bash  >}}
/bin/sh: 1: <tmp_path>/...<script_name>: not found
{{< /gsHighlight >}}
This basically means that the specified path in the shebang line is invalid (might be a syntax error or the path specified doesn't lead anywhere).
