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

Usage: `cfy recover [options] -s SNAPSHOT_PATH -f`

Recover the manager using the provided snapshot.

#### Required flags

*  `-s, --snapshot-path SNAPSHOT_PATH` - The local path to the snapshot you would like to use for the restoration process.
*  `-f, --force` -          Force recovery. This flag is mandatory

#### Optional flags

*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure (default: 5)
*  `--task-thread-pool-size=TASK_THREAD_POOL_SIZE` -
                        The size of the thread pool to execute tasks in
                        (default: 1)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` -
                        How many seconds to wait before each task is retried
                        (default: 30)

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy recover -f -s first_snapshot.zip
...

Recovering manager...
2016-06-29 08:58:56 CFY <manager> Starting 'heal' workflow execution
2016-06-29 08:58:56 LOG <manager> INFO: Starting 'heal' workflow on manager_configuration_ad180, Diagnosis: Not provided
2016-06-29 08:58:56 CFY <manager> [webui_ef68c] Stopping node
.
.
.
2016-06-29 08:59:16 LOG <manager> [elasticsearch_8d1cf.stop] INFO: Stopping systemd service elasticsearch...
2016-06-29 08:59:16 CFY <manager> [elasticsearch_8d1cf.stop] Task succeeded 'fabric_plugin.tasks.run_script'
2016-06-29 08:59:17 CFY <manager> [rabbitmq_023a2] Deleting node
2016-06-29 08:59:17 CFY <manager> [python_runtime_5fdfd] Deleting node
.
.
.
2016-06-29 09:11:06 CFY <manager> 'heal' workflow execution succeeded
[52.31.106.71] put: /home/ubuntu/.ssh/cloudify-agent-kp.pem -> /root/.ssh/agent_key.pem
Uploading snapshot 'first_snapshot.zip' to management server 52.31.106.71 as restored-snapshot
Restoring snapshot 'restored-snapshot'...
Successfully restored snapshot restored-snapshot
Manager recovered successfully

...
{{< /gsHighlight >}}
