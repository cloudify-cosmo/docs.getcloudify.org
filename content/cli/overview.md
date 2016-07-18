---
layout: bt_wiki
title: Overview
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 1
---

Cloudify's Command-Line Interface is the default method for interacting with Cloudify and managing your applications. It allows you to execute workflows on your local machine as well as interact with a running [Cloudify Manager]({{< relref "manager/getting-started.md" >}}) (to ssh into a running Manager, upload blueprints, delete them, create deployments, execute workflows, retrieve events and more).

If you haven't already [installed Cloudify]({{< relref "installation/from-packages.md" >}}), now would be a good time to do so.

# Usage

The interface can be accessed by running the `cfy` command in your terminal. `cfy -h` will get you started:

{{< gsHighlight  markdown  >}}
$ cfy -h
usage: cfy [-h] [--version]                       ...

Cloudify's Command Line Interface

optional arguments:
  -h, --help            show this help message and exit
  --version             show version information and exit

Commands:
                       
    logs                Handle the Manager's logs
    maintenance-mode    Handle the Manager's maintenance-mode
    snapshots           Handle snapshots on the Manager
    executions          Handle workflow executions
    agents              Handle a deployment's agents
    plugins             Handle plugins on the Manager
    recover             Recover the Manager
    use                 Control a specific Manager
    upgrade             Upgrade the Manager to a new version
    teardown            Teardown the Manager
    deployments         Handle deployments on the Manager
    init                Initialize a working environment in the current
                        working directory
    nodes               Handle a deployment's nodes
    local               Handle local environments
    events              Handle events
    status              Show the Manager's status
    rollback            Rollback the Manager upgrade
    ssh                 SSH to the Manager's host
    groups              Handle deployment groups
    workflows           Handle deployment workflows
    blueprints          Handle blueprints on the Manager
    bootstrap           Bootstrap a Manager
    node-instances      Handle node-instances
    dev                 Execute fabric tasks on the Manager
    install             Install an application via the Manager
    uninstall           Uninstall an existing application installed via a
                        Manager

...
{{< /gsHighlight >}}

Note that some features (such as viewing metric graphs and application topologies) are only available via the Web UI if running Cloudify manager.


# Verbose Output

The ``-v/--verbose`` flag is available for all commands. It sets the command verbosity level. At the moment, there are 4 verbosity levels:

* Running a command without the verbose flag. (This is obviously the default).
* Running a command with ``-v`` will print tracebacks where relevant, in addition to the normal output.
* Running a command with ``-vv`` will, in addition, show ``DEBUG`` log statements of local/remote execution events.
* Running a command with ``-vvv`` will, in addition, set all loggers declared in the `config_file <https://github.com/cloudify-cosmo/cloudify-cli/blob/3.4/cloudify_cli/resources/config.yaml>` to debug mode.

{{% gsNote title="Note" %}}
``--debug`` is equivalent to ``-vvv``
{{% /gsNote %}}


# Inputs and Parameters

All commands that accept inputs or paramaters (e.g. `cfy executions start` or `cfy deployments create`) expect the value to represent a dictionary. Valid formats are:

 * A path to the YAML file
 * A path to a directory containing one or more YAML files
 * A wildcard based path to one or more YAML files
 * A string formatted as JSON
 * A string formatted as "key1=value1;key2=value2"

{{% gsNote title="Note" %}}
Using the `key=value` method, you cannot currently pass non-string values
{{% /gsNote %}}


# Configuration

A directory named `.cloudify` is created in the directory where `cfy` was initialized (e.g. by `cfy init` or `cfy use`). 

This directory contains a file named `config.yaml` which may be customized according to user preferences. What follows is details 
regarding the different configurable parameters.

## Colored Output

Enable colored output of different `cfy` commands:

```
colors: true
```

The default value is `false`.

## Logging

Specify the path of the log file `cfy` writes to:

```
logging:
  filename: /some/custom/path/to/a.log
```

The default value is `$TMPDIR/cloudify-$USERNAME/cloudify.log`.

Configure specific python logger levels:

```
logging:
  loggers:
    cloudify.rest_client.http: debug
    some.external.package: debug
```

The default sets `cloudify.cli.main` and `cloudify.rest_client.http` loggers' logging level to `info`.

{{% gsNote title="Note" %}}
The `.cloudify` directory may contain other files and directories that are used internally by `cfy`, those are not addressed in this section.
{{% /gsNote %}}
