---
layout: bt_wiki
title: rollback
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 180
---

The `cfy rollback` command is used to rollback a manager to the previous version of Cloudify.

{{% gsNote title="Note" %}}
You can only rollback to the version of Cloudify installed before the last `cfy upgrade`.
{{% /gsNote %}}

See [manager upgrade]({{< relref "manager/upgrade.md" >}}) for more information.


Usage: `cfy rollback [OPTIONS] BLUEPRINT_PATH`

Rollback a manager to its previous version

Note that you can only rollback to the last version you upgraded from.

`BLUEPRINT_PATH` is the path of the manager blueprint to use for rollback.

#### Optional flags

*  `-i, --inputs TEXT` - 
						Inputs for the deployment (Can be provided
                        as wildcard based paths (*.yaml,
                        /my_inputs/, etc..) to YAML files, a JSON
                        string or as key1=value1;key2=value2). This
                        argument can be used multiple times
*  `--install-plugins` - 
						Install the necessary plugins for the given blueprint
*  `--task-retries INTEGER` - 
						How many times should a task be retried in
                        case of failure [default: 0]
*  `--task-retry-interval INTEGER` - 
						How many times should a task be retried in
                        case of failure [default: 1]
*  `--task-thread-pool-size INTEGER` - 
						The size of the thread pool to execute tasks
                        in [default: 1]