---
layout: bt_wiki
title: recover
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 170
---

{{% gsNote title="Warning" %}}
`cfy recover` currently works only on openstack! The command will run the `heal` workflow to recover the manager.
{{% /gsNote %}}


The `cfy recover` command is used to recover a manager to a previous state using a manager snapshot.

Usage: `cfy recover [options] -s SNAPSHOT_PATH`

Recover the manager using the provided snapshot.

#### Required flags

*  `-s, --snapshot-path SNAPSHOT_PATH` - The local path to the snapshot you would like to use for the restoration process.

#### Optional flags

*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure (default: 5)
*  `-f, --force` -          Force recovery. This flag is mandatory
*  `--task-thread-pool-size=TASK_THREAD_POOL_SIZE` -
                        The size of the thread pool to execute tasks in
                        (default: 1)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` -
                        How many seconds to wait before each task is retried
                        (default: 30)
