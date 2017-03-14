---
layout: bt_wiki
title: Overview
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 1
---

The Cloudify command-line interface (CLI) is the default method for interacting with Cloudify Manager, to manage your applications. It enables you to execute workflows on your local machine, and to interact with a running [Cloudify Manager]({{< relref "manager/getting-started.md" >}}) via SSH to upload and delete Blueprints, create deployments, execute workflows, retrieve events, and more.

Working _locally_ refers to running workflows directly from the machine on which the CLI is installed. Working with an instance of Cloudify Manager refers to executing workflows directly from that Cloudify Manager instance.

When you use the CLI to control a Cloudify Manager instance, additional commands appear in the CLI that are not available for use in local mode, for example ssh-ing into a running manager, downloading its logs, creating snapshots, uploading plugins and more...

{{% gsNote title="Note" %}}
If you attempt to run a command that is not supported in local mode, an error message will be returned advising you that the command is only supported when using Cloudify Manager. To use a Cloudify Manager, you can either run [cfy bootstrap]({{< relref "cli/bootstrap.md" >}}) to bootstrap a new Cloudify Manager or [cfy use]({{< relref "cli/use.md" >}}) to use an existing one.
{{% /gsNote %}}

If you haven't already [installed Cloudify]({{< relref "installation/from-packages.md" >}}), now would be a good time to do so.

# Usage

You can access the CLI by running the `cfy` command in your terminal. Use `cfy -h` to display a list of all the available commands and their descriptions.

```markdown
$ cfy -h
Usage: cfy [OPTIONS] COMMAND [ARGS]...

  Cloudify's Command Line Interface

  Note that some commands are only available if you're using a manager. You
  can use a manager by running the `cfy use` command and providing it with
  the IP of your manager (and ssh credentials if applicable).

  To activate bash-completion. Run: `eval "$(_CFY_COMPLETE=source cfy)"`

  Cloudify's working directory resides in ~/.cloudify. To change it, set the
  variable `CFY_WORKDIR` to something else (e.g. /tmp/).

Options:
  -v, --verbose  Show verbose output. You can supply this up to three times
                 (i.e. -vvv)
  --version      Display the version and exit (if a manager is used, its
                 version will also show)
  -h, --help     Show this message and exit.

Commands:
  agents            Handle a deployment's agents
  blueprints        Handle blueprints on the manager
  bootstrap         Bootstrap a manager
  deployments       Handle deployments on the Manager
  dev               Run fabric tasks [manager only]
  events            Show events from workflow executions
  executions        Handle workflow executions
  groups            Handle deployment groups
  init              Initialize a working env
  install           Install an application blueprint [manager only]
  logs              Handle manager service logs
  maintenance-mode  Handle the manager's maintenance-mode
  node-instances    Handle a deployment's node-instances
  nodes             Handle a deployment's nodes
  plugins           Handle plugins on the manager
  profiles          Handle Cloudify CLI profiles Each profile can...
  recover           Recover a manager
  rollback          Rollback a manager to a previous version
  snapshots         Handle manager snapshots
  ssh               Connect using SSH [manager only]
  status            Show manager status [manager only]
  teardown          Teardown a manager [manager only]
  uninstall         Uninstall an application blueprint [manager only]
  upgrade           Upgrade a manager to a new version [manager only]
  use               Control a specific manager
  workflows         Handle deployment workflows

...
```

Note that some features (such as viewing metric graphs and application topologies) are only available via the Web UI if running Cloudify Manager.


# Verbose Output

The ``-v/--verbose`` flag is available for all commands. It sets the command verbosity level. There are four verbosity levels:

* Running a command without the verbose flag. (The default).
* Running a command with ``-v`` prints tracebacks where relevant, in addition to the normal output.
* Running a command with ``-vv`` in addition to the tracebacks, displays the ``DEBUG`` log statements of local/remote execution events.
* Running a command with ``-vvv`` in addition to the tracebacks and debug log statements, sets all loggers declared in the `config <https://github.com/cloudify-cosmo/cloudify-cli/blob/3.4/cloudify_cli/resources/config.yaml>`_ file to debug mode.

{{% gsNote title="Note" %}}
``--debug`` is equivalent to ``-vvv``
{{% /gsNote %}}


# Inputs and Parameters

For commands that accept inputs or parameters (for example, `cfy executions start` or `cfy deployments create`) the value must represent a dictionary. Valid formats are:

 * A path to the YAML file
 * A path to a directory containing one or more YAML files
 * A wildcard-based path to one or more YAML files
 * A string in JSON format
 * A string formatted as "key1=value1;key2=value2"

{{% gsNote title="Note" %}}
You cannot pass non-string values when using the `key=value` method.
{{% /gsNote %}}


# Configuration

By default, a `.cloudify` directory is created under ~(Home directory). You can change the location using an `env` variable (for example, `cfy init` or `cfy use`). 

The directory contains a file named `config.yaml` that you can customize according to your preferences. 

##Configurable Parameters
You can configure the parameters described in this section.

##### Colored Output

Enables colored output of different `cfy` commands:

```
colors: true
```

The default value is `false`.

##### Logging

Specifies the path of the log file that `cfy` writes to:

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
The `.cloudify` directory might also contain other files and directories that are used internally by `cfy`, which are not addressed in this section.
{{% /gsNote %}}
