---
layout: bt_wiki
title: init
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 90
---

The `cfy init` command is used to initialize a working Cloudify directory.

Before being able to use `cfy`, you must initialize a working directory for it where relevant funcional information will be kept.

Usage: `cfy init [OPTIONS] [BLUEPRINT_PATH]`

Initialize a Cloudify environment.

This is required to perform many actions and should be the first action
performed after installing Cloudify.

Note: Running `cfy bootstrap`, `cfy intall` or `cfy use` will initialize a
environment automatically.

Providing a `BLUEPRINT_PATH` will also initialize a blueprint to work on.

After initialization, the CLI's configuration can be found under
~/.cloudify/config.yaml. For more information refer to the docs at
http://docs.getcloudify.org

#### Optional flags

* `-r, --reset-config` - 
						Reset the working environment. This allows to reset configuration and is required before bootstrapping an additional manager.
* `-i, --inputs TEXT` - Inputs for the deployment (Can be provided as wildcard
                        based paths (*.yaml, /my_inputs/, etc..) to YAML files,
                        a JSON string or as key1=value1;key2=value2). This
                        argument can be used multiple times
* `--install-plugins` - Install the necessary plugins for the given blueprint
* `--hard` -            Hard reset the configuration, including coloring and
                        loggers


&nbsp;
#### Example

```markdown
$ cfy init
...

Initializing profile local...
Initialization completed successfully

...
```