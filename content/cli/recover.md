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

Usage: `cfy recover [OPTIONS] SNAPSHOT_PATH`

Recover a manager to a previous state

`SNAPSHOT_PATH` is the path of the snapshot to use for recovery.

#### Optional flags

*  `-f, --force` -    	This is mandatory for performing the recovery
*  `--task-retries INTEGER` -
                        How many times should a task be retried in case of
                        failure [default: 0]
*  `--task-retry-interval INTEGER` -
                        How many seconds to wait before each task is retried
                        [default: 1]
*  `--task-thread-pool-size INTEGER` -
                        The size of the thread pool to execute tasks in
                        [default: 1]

&nbsp;
#### Example

```markdown
$ cfy recover -f first_snapshot.zip
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
```