---
layout: bt_wiki
title: upgrade
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 240
---

The `cfy upgrade` command is used to upgrade a manager to later version of Cloudify.

See [manager upgrade]({{< relref "manager/upgrade.md" >}}) for more information.

Usage: `cfy upgrade [OPTIONS] BLUEPRINT_PATH`

Upgrade a manager to a newer version

Note that you must supply a simple-manager-blueprint to perform the
upgrade and provide it with the relevant inputs.

`BLUEPRINT_PATH` is the path of the manager blueprint to use for upgrade.

#### Optional flags

*  `-i, --inputs TEXT` - 
						Inputs for the deployment (Can be provided
                        as wildcard based paths (*.yaml,
                        /my_inputs/, etc..) to YAML files, a JSON
                        string or as key1=value1;key2=value2). This
                        argument can be used multiple times
*  `--validate-only` - 	Only perform resource creation validation
                        without actually bootstrapping
*  `--skip-validations` - 
						Bootstrap without validating resource
                        creation prior to bootstrapping the manager
*  `--install-plugins` - 
						Install the necessary plugins for the given
                        blueprint
*  `--task-retries INTEGER` - 
						How many times should a task be retried in
                        case of failure [default: 0]
*  `--task-retry-interval INTEGER` - 
						How many times should a task be retried in
                        case of failure [default: 1]
*  `--task-thread-pool-size INTEGER` - 
                      	The size of the thread pool to execute tasks
                      	in [default: 1]