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

Usage: `cfy init [options]`

Initialize a working Cloudify directory. This will create a `.cloudify` directory in the cwd where contextual information on the currently running manager and some CLI related configuration will be kept

After initializing a working directory, several CLI related configuration options can be found under `.cloudify/config.yaml`.

For instance, if you want to activate output coloring, you can change `colors` in `.cloudify/config.yaml` from `false` to `true`.

#### Optional flags

* `-r, --reset-config` - Reset the working environment. This allows to reset configuration and is required before bootstrapping an additional manager.


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy init
...

Initialization completed successfully

...
{{< /gsHighlight >}}