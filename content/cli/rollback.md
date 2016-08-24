---

title: rollback



weight: 180
---

The `cfy rollback` command is used to rollback a manager to the previous version of Cloudify.

{{% gsNote title="Note" %}}
You can only rollback to the version of Cloudify installed before the last `cfy upgrade`.
{{% /gsNote %}}

See [manager upgrade]({{< relref "manager/upgrade.md" >}}) for more information.


Usage: `cfy rollback [options] -p BLUEPRINT_PATH`

Rollback a manager to a previous version.

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the desired simple manager blueprint

#### Optional flags

*  `--install-plugins` -    Install the necessary plugins for the given blueprint
*  `-i, --inputs=INPUTS` - The required inputs for running the upgrade process
*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure (default: 5)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` -
                        How many seconds to wait before each task is retried
                        (default: 30)
