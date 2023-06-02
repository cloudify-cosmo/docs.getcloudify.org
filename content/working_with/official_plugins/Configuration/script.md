---
title: Script Plugin
category: Official Plugins
draft: false
abstract: "Script plugin description and configuration"
description: "The Script plugin can be used to map node life-cycle operations and workflows to scripts that are included in your blueprint. Scripts can be written in Python, bash, ruby, and so on."
weight: 100
aliases:
  - /plugins/script/
  - /developer/official_plugins/script/

types_yaml_link: http://www.getcloudify.org/spec/cloudify/5.0.0/types.yaml
repo_link: https://github.com/cloudify-cosmo/cloudify-common
client_reference_link: https://github.com/cloudify-cosmo/cloudify-common/blob/5.0.0/cloudify/proxy/client.py
hello_world_example_link: https://github.com/cloudify-cosmo/cloudify-hello-world-example
---

The Script plugin can be used to map node life-cycle operations and workflows to scripts that are included in your blueprint. Scripts can be written in Python, bash, ruby, and so on.

The Script plugin is pre-installed with the default agent packages and is defined in `types.yaml`.
The source code can be found at [{{< field "repo_link" >}}]({{< field "repo_link" >}})

{{% note title="Note" %}}
You can specify a custom directory to use as temporary storage for executable files that you do not want to have stored in the `temp dir` directory. Provide an environment variable for the directory that is exported when the script runs.
{{% /note %}}


# Plugin Requirements:

* Python versions:
  * 2.6.x
  * 2.7.x

# Usage

Following are usage examples that demonstrate different configuration options.

##  Basic Usage

`blueprint.yaml`
{{< highlight  yaml  >}}
imports:
  - {{< field "types_yaml_link" >}}

node_templates:
  example_web_server:
    # The web server type is only used for this example. The type used
    # could be any valid {{< param product_name >}} type.
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start: scripts/start.sh
{{< /highlight >}}

`scripts/start.sh`
{{< highlight  bash  >}}
#! /bin/bash -e
ctx logger info "Hello to this world"
{{< /highlight >}}

**Description**

Notice that the `cloudify.interface.lifecycle.start` operation is mapped directly to a script. When an operation is mapped, if the mapping points to a resource that is included in the blueprint directory, it is considered to be a script and the Script plugin is used. This means that the above mapping is equivalent to:
{{< highlight  yaml  >}}
interfaces:
  cloudify.interfaces.lifecycle:
    start:
      implementation: script.script_runner.tasks.run
      inputs:
        script_path: scripts/start.sh
{{< /highlight >}}

**Short Example Script Description**

The first line
{{< highlight  bash  >}}
#! /bin/bash -e
{{< /highlight >}}

makes the script run with `/bin/bash`. Had the script been written using `ruby`, for example, it would point to `/bin/ruby`.

{{% note title="Note" %}}
There is another way to tell the script plugin how to execute the script that could be useful for running scripts in Windows (for example), which is detailed later in this topic.
{{% /note %}}

The second line
{{< highlight  bash  >}}
ctx logger info "Hello to this world"
{{< /highlight >}}

demonstrates how scripts can access the operation context. The line is equivalent to writing
{{< highlight  python  >}}
ctx.logger.info('Hello to this world')
{{< /highlight >}}

within a python plugin operation.

A more detailed description about accessing the operation context is provided later in this topic.

## Process Configuration

The following example demostrates how you can configure the working directory in which the script is executed, pass arguments to the script and update environment variables of the script process.

`blueprint.yaml`
{{< highlight  yaml  >}}
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
{{< /highlight >}}

{{% note title="Note" %}}
The recommended way for setting environment variables is by using operation inputs, as described in the [Operation Inputs](#operation-inputs) section.
{{% /note %}}

`scripts/start.sh`
{{< highlight  bash  >}}
#! /bin/bash -e

# will log "current working directory is: /tmp/workdir"
ctx logger info "current working directory is: ${PWD}"

# will log "first arg is: arg1_value"
ctx logger info "first arg is: $1"

# will log "my env variable is: MY_ENV_VARIABLE_VALUE"
ctx logger info "my env variable is: ${MY_ENV_VARIABLE}"

{{< /highlight >}}

## Script Location

The script location may be any of the following:

* **A relative path**. In this case, the script is assumed to be included with the blueprint, and the path is relative to the blueprint's root directory.
* **An absolute path**. In this case, the script must exist in that exact location, on the same machine in which the script operation runs.
* **A URL** (this includes `file://` URL's). In this case, the script must be accessible through that URL from the same machine in which the script operation runs.

## Python Scripts

Python scripts receive specific treatment in the Script plugin. If the script path ends with a `.py` extension, it is evaluated within the plugin operation. This provides a simple way to access the full plugin API ,without having to write an entire plugin.

### Example

`blueprint.yaml`
{{< highlight  yaml  >}}
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
{{< /highlight >}}

`scripts/start.py`
{{< highlight  python  >}}
from cloudify import ctx

ctx.logger.info('Just logging the web server port: {0}'
                .format(ctx.node.properties['port']))
{{< /highlight >}}

### Operation Inputs
You can import `ctx_parameters` from `cloudify.state`, to access operation inputs in a Python script.

Assuming a `port` operation input was passed, you can access it as follows:

{{< highlight  python  >}}
from cloudify import ctx
from cloudify.state import ctx_parameters as inputs

ctx.logger.info('The port operation input is : {0}'
                .format(inputs['port']))
{{< /highlight >}}



### Eval Python

To evaluate a script as Python that does not have a `.py` extension, you can explicity specify this requirement using the `eval_python` process configuration.

{{< highlight  yaml  >}}
interfaces:
  cloudify.interfaces.lifecycle:
    start:
      implementation: script/my_python_script
      inputs:
        process:
          eval_python: true
{{< /highlight >}}

If a script does have a `.py` extension and you want it to be executed in an external process, pass `false` to the `eval_python` process configuration. Note that accessing the operation context in this case processed via the [context proxy](#context-proxy), as with any other none Python script.

## Command Prefix

In some cases, you might not want to use `#!` to specify how to execute the script (or cannot, in the event that you are running the script on Windows). In this case, you can use the `command_prefix` process configuration as follows

`blueprint.yaml`
{{< highlight  yaml  >}}
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
{{< /highlight >}}

This executes `start.rb` with the ruby binary in `/opt/ruby/bin/ruby`.

### Windows PowerShell scripts

Windows PowerShell scripts receive specific treatment in the Script plugin. If the script path ends with a `.ps1` extension, it is automatically executed as if `command_prefix` was already set to `powershell`
This can be achieved as follows:

`blueprint.yaml`
{{< highlight  yaml  >}}
imports:
  - {{< field "types_yaml_link" >}}

node_templates:
  example_web_server:
    type: cloudify.nodes.WebServer
    interfaces:
      cloudify.interfaces.lifecycle:
        start: scripts/start.ps1
{{< /highlight >}}

This executes `start.ps1` using the PowerShell console application in the script's execution environment.

#### Running PowerShell in 64-bit mode

The Windows agent runs as a 32-bit service. If PowerShell scripts are invoked, they will be invoked in a 32-bit
PowerShell process.

In order to run PowerShell in 64-bit mode, you will have to add the `command_prefix` input as follows:

```yaml
implementation: scripts/start.ps1
inputs:
  process:
    command_prefix: C:\Windows\sysnative\WindowsPowerShell\v1.0\PowerShell.exe
```

(`sysnative` will be automatically resolved to the 32-bit Windows system libraries when used in a 32-bit process)

## Hello World Example
For a more complete usage example, see the [Hello World]({{< field "hello_world_example_link" >}}) example.


# Operation Inputs

The Script plugin supports passing node template operation inputs as environment variables that are available in the script's execution environment.
Complex data structures such as dictionaries and lists will be JSON-encoded when exported as environment variables.

In the following example, the `port` input set for the `start` operation will be available as a `port` environment variable within the `start.sh` script:

`blueprint.yaml`
{{< highlight  yaml  >}}
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
{{< /highlight >}}

`scripts/start.sh`
{{< highlight  sh  >}}
echo "Starting web server..."
nohup python -m SimpleHTTPServer ${port} > /dev/null 2>&1 &
{{< /highlight >}}


{{% note title="Note" %}}
* Since `process` and `script_path` are script-plugin reserved operation inputs, they are not available as environment variables in the script's execution environment.
* Inputs are not set for Python scripts that are run by evaluating Python code. More information about Python script evaluation is described in [Process Configuration Options](#process-configuration-options).
{{% /note %}}



# Process Configuration Options

| Option | Value Type | Description
|--------|------------|-----------------------------------------------------------
| `cwd`  | string     | Sets the current working directory for the script process.
| `env`  | dictionary | Adds environment variables to the script process.
| `args` | list       | Command-line arguments to pass to the script (as `$1`, `$2` etc. on Linux, or `%1`, `%2` etc. on Windows).
| `command_prefix` | string | A prefix to add before the script's path. This can be used to specify an interpreter, as well as instead of a shebang line (such as `#!/bin/bash`) on Linux.
| `log_stdout` | boolean | If `true` (the default), the script's standard output stream is automatically logged to {{< param product_name >}}'s logger.
| `log_stderr` | boolean | If `true` (the default), the script's standard error stream is automatically logged to {{< param product_name >}}'s logger.
| `stderr_to_stdout` | boolean | If `true`, then the script's standard error stream is redirected to the output stream. The default is `false`.
| `eval_python` | boolean | Denoting whether the script should be evaluated as Python code in-line (`true`), or executed as an external process (`false`).
| `ctx_proxy_type` | string | The [context proxy](#context-proxy-protocol) type (`none`, `unix`, `tcp` or `http`).


# Workflow Scripts
You can use the Script plugin to execute workflow scripts.

For example, to add a custom workflow that runs a custom operation on each node, write a simple blueprint with two nodes, as follows:

`blueprint.yaml`
{{< highlight  yaml  >}}
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
{{< /highlight >}}

You could then write a `touch.py` script. Note that this script ends with a `.py` extension, so it will be evaluated as Python code.

`scripts/touch.py`
{{< highlight  python  >}}
from cloudify import ctx
from cloudify.state import ctx_parameters as p

ctx.instance.runtime_properties['touched'] = p.touched_value
{{< /highlight >}}

The script will update the `touched` runtime property of the current node instance with an expected `touched_value` property that will be injected by the workflow executing the operation.


Then you can write the actual workflow.

`workflows/touch_all.py`
{{< highlight  python  >}}
from cloudify.workflows import ctx
from cloudify.workflows import parameters as p

for node in ctx.nodes:
    for instance in node.instances:
        instance.execute_operation('custom.touch', kwargs={
            'touched_value': p.touched_value
        })
{{< /highlight >}}


Having written the workflow, you can now execute it:
{{< highlight  bash  >}}
cfy executions start -w touch_all -d my_deployment --parameters '{"touched_value": "my_value"}'
{{< /highlight >}}

All the node instances now have their `touched` runtime property set to `my_value`.

{{% note title="Note" %}}
Workflow scripts are always evaluated as Python code. You cannot write workflow scripts in other languages.
{{% /note %}}

# Context Proxy

In the previous examples, `ctx` was referenced several times from within the scripts. This mechanism provides the means for accessing the `ctx` object in the manner in which it is usually accessed when [writing plugins]({{< relref "developer/writing_plugins/creating-your-own-plugin.md" >}}).

Following is a description of how calls to the `ctx` executable, translate to the `ctx` object access.

## Attribute access
{{< highlight  bash  >}}
#! /bin/bash
ctx bootstrap-context cloudify-agent agent-key-path
{{< /highlight >}}
Translates to
{{< highlight  python  >}}
ctx.bootstrap_context.cloudify_agent.agent_key_path
{{< /highlight >}}

In addition, note in this example that `-` in attributes (as an argument) is replaced with `_`.

## Simple Method Invocation
{{< highlight  bash  >}}
#! /bin/bash
ctx logger info "Some logging"
{{< /highlight >}}
Translates to
{{< highlight  python  >}}
ctx.logger.info('Some logging')
{{< /highlight >}}

In the immediately above example, a `logger` attribute is searched on the `ctx` object. After being found, an `info` attribute is searched on the `logger` result. After that is found, it discovers that `info` is callable, so it invokes it with the remaining arguments.

## Method Invocation with kwargs
{{< highlight  bash  >}}
#! /bin/bash
ctx download-resource images/hello.png '@{"target_path": "/tmp/hello.png"}'
{{< /highlight >}}
Translates to
{{< highlight  python  >}}
ctx.download_resource('images/hello.png', **{'target_path': '/tmp/hello.png'})
{{< /highlight >}}

In the above example, note that the final argument starts with `@`. This is further explained later in this topic. For now, this means that the argument will be parsed as json.

Note that the last argument is a dictionary, as the above demonstrates. If the last argument of a method invocation is a dictionary, it is treated as `kwargs` to the method invocation.

## Dictionary Access
{{< highlight  bash  >}}
#! /bin/bash
# read access
ctx node properties application_name
ctx target instance runtime-properties username
ctx instance runtime-properties endpoint.port
ctx instance runtime-properties endpoint.urls[2]

# write access
ctx instance runtime-properties my_property my_value
ctx instance runtime-properties my_properties.my_nested_property nested_value
{{< /highlight >}}
Translates to
{{< highlight  python  >}}
ctx.node.properties['application_name']
ctx.target.instance.runtime_properties['username']
ctx.instance.runtime_properties['endpoint']['port']
ctx.instance.runtime_properties['endpoint']['urls'][2]

ctx.instance.runtime_properties['my_property'] = 'my_value'
ctx.instance.runtime_properties['my_properties']['my_nested_property'] = 'nested_value'
{{< /highlight >}}

Once a dictionary attribute is discovered during the attribute search, the following logic applies:

* If there is a single argument remaining, the call is determined to be read access and the key path is calculated
  as the above demonstrates.
* If there are two remaining arguments, the call is determined to be write access and the key path is set to the value
  of the second remaining argument. If a dictionary does not exist in the intermediate path, it is created on-the-fly.

## Non-String Arguments
To pass arguments that are not strings, for example when setting a runtime property to a number, you can prefix the argument with `@` so that it is json-parsed before being evaluated.

{{< highlight  bash  >}}
#! /bin/bash
ctx instance runtime-properties number_of_clients @14
{{< /highlight >}}
Translates to
{{< highlight  python  >}}
ctx.instance.runtime_properties['number_of_clients'] = 14  # instead of = '14'
{{< /highlight >}}

## Returning a Value
You can use `ctx returns some_value` to have the operation to return a value.
This invocation sets `some_value` on the current `ctx`, and the Script plugin returns the value when the script terminates.

Note that this call does not make the script terminate, however it is best practice to make this call at the end of the script.

## Command-Line Optional Arguments of ctx
The following flags must appear before the positional arguments.

* `-t, --timeout=TIMEOUT` - The request timeout in seconds (Default: `5`)
* `-j, --json-output`- Outputs the call result as valid json instead of its string value (Default: `False`)
* `--json-arg-prefix=PREFIX` - The prefix for arguments to be processed as json (Default: `@`)
* `--socket-url=SOCKET_URL` - The ctx socket URL (Default: the environment variable `CTX_SOCKET_URL`). Normally the environment variable `CTX_SOCKET_URL` is injected by the Script plugin. Therefore, it is recommended that this is only be used in conjunction with `ctx-server` during script debugging.

# Context Proxy Protocol

To call the `ctx` executable, you invoke the CLI client that is pre-installed with the plugin.
When the Script plugin executes your script, it also starts a ctx proxy server that delegates calls to the actual `ctx` object instance.

Before the Script plugin starts the proxy server, it checks the following:

* Whether ZeroMQ is installed (which applies if the default agent packages are being used).
  - If running on Linux, whether a Unix domain socket is used as the transport layer.
  - If running on Windows, whether a TCP socket is used as the transport layer.
* If ZeroMQ is not installed, whether an HTTP-based transport layer is used.

This behavior can be overridden by setting `proxy_ctx_type` of the process configuration to be one of `unix`, `tcp`, `http` or `none`. If `none` is set, no proxy server will be started.

The `ctx` CLI client implements a simple protocol on top of the above transport layers that can be implemented in other languages to provide a more streamlined access to the context.

When the Script plugin executes the script, it updates the script process with the `CTX_SOCKET_URL` environment variable.

* If a Unix domain socket-based proxy was started, its value will look like: `ipc:///tmp/ctx-f3j22f.socket`
* If a TCP socket-based proxy was started, its value will look like: `tcp://127.0.0.1:53213`
* If an HTTP socket-based proxy was started, its value will look like: `http://localhost:35321`

The first two are valid ZeroMQ socket URLs and should be passed as is to the ZeroMQ client. The last one is the HTTP endpoint that should be used when making REST calls.

If a ZeroMQ client is implemented, it should start a `request`-based socket (as the proxy server starts the matching `response` socket).

If an HTTP client is implemented, it should make `POST` requests to the socket URL endpoint.

In all the protocols, the format of the request body is a json with the following structure:
{{< highlight  json  >}}
{
    "args": [...]
}
{{< /highlight >}}
Where `args` is the list of arguments. So, for example, the arguments for `ctx.properties['port']` is `["properties", "port"]`

The format of the response body is a json with the following structure.

In the case of a successful execution:
{{< highlight  json  >}}
{
   "type": "result",
   "payload": RESULT_BODY
}
{{< /highlight >}}
In the case of a failed execution:
{{< highlight  json  >}}
{
   "type": "error",
   "payload": {
      "type": ERROR_TYPE,
      "message": ERROR_MESSAGE,
      "traceback": ERROR_TRACEBACK
   }
}
{{< /highlight >}}

See the [CLI implementation]({{< field "client_reference_link" >}}) for reference.

# Troubleshooting

### nohup
When you use `nohup` in your scripts, you must redirect the output and stderr to `/dev/null`
and to run the operation in the background using `&`.
For example:
{{< highlight  bash  >}}
nohup python -m SimpleHTTPServer > /dev/null 2>&1 &
{{< /highlight >}}

### File Not Found Error
Different Linux distributions use different default interpreters. One might use bash, while the other uses sh. While bash will normally return an informative message in regards to the shebang line, the sh message might look something like this:
{{< highlight  bash  >}}
/bin/sh: 1: <tmp_path>/...<script_name>: not found
{{< /highlight >}}
This basically means that the specified path in the shebang line is invalid (which could be due to a syntax error or because the specified path does not lead anywhere).
