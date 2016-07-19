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


Usage: `cfy upgrade [options] -p BLUEPRINT_PATH`

Upgrade a manager to a new version.

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the desired simple manager blueprint

#### Optional flags

*  `--task-thread-pool-size=TASK_THREAD_POOL_SIZE` -
                        The size of the thread pool to execute tasks in
                        (default: 1)
*  `--install-plugins` -    Install the necessary plugins for the given blueprint
*  `--validate-only` -     Validate without actually performing the upgrade -
                        process
*  `--skip-validations` -   Upgrade the manager without validating resources -
*  `-i, --inputs=INPUTS` - The required inputs for running the upgrade process
*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure (default: 5)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` -
                        How many seconds to wait before each task is retried
                        (default: 30)
