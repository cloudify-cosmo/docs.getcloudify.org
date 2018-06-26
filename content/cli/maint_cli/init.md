---
layout: bt_wiki
title: init
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/init/
---

The `cfy init` command is used to initialize a working Cloudify directory.

Before you can use `cfy`, you must initialize a working directory for it, in which relevant functional information will be stored.

#### Usage 
`cfy init [OPTIONS] [BLUEPRINT_PATH]`

Initialize a Cloudify environment.

This is required to perform many actions and should be the first action
performed after installing Cloudify.

{{% note title="Note" %}}
Running `cfy intall` or `cfy use` initializes an
environment automatically.
{{% /note %}}

Providing a `BLUEPRINT_PATH` also initializes a blueprint to work on.

After initialization, the CLI's configuration can be found under
~/.cloudify/config.yaml. 

#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.
* `-b, --blueprint-id TEXT` - The unique identifier for the blueprint
* `-n, --blueprint-filename TEXT` -  The name of the archive's main blueprint
                                 file. This is only relevant if uploading an
                                 archive.
* `-r, --reset-config` - 
						Reset the working environment. This allows to reset configuration.
* `-i, --inputs TEXT` - Inputs for the deployment (Can be provided as wildcard
                        based paths (*.yaml, /my_inputs/, etc..) to YAML files,
                        a JSON string or as key1=value1;key2=value2). This
                        argument can be used multiple times.
* `--install-plugins` - Install the necessary plugins for the specified blueprint.
* `--hard` -            Hard reset the configuration, including coloring and
                        loggers.
* `--enable-colors` -   Enable colors in logger. (Use `--hard` when
                                 working with an initialized environment.)
                                 [default: False]


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy init
...

Initializing profile local...
Initialization completed successfully

...
{{< /highlight >}}