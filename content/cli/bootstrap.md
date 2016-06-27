---
layout: bt_wiki
title: bootstrap
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 30
---

The `cfy bootstrap` command is used to bootstrap Cloudify manager.

{{% gsNote title="Note" %}}
After bootstrapping a manager, the user and ssh-key provided to use it will be used to perform ssh related commands (e.g. `cfy logs`, `cfy ssh`) are saved on the machine which performed the bootstrap process. Running `cfy use` to control another manager will remove those settings and will NOT set the user and ssh-key to the manager you ran `cfy use` on.
{{% /gsNote %}}

See [bootstrapping]({{< relref "manager/bootstrapping.md" >}}) for more information.


Usage: `cfy bootstrap [options] -p BLUEPRINT_PATH`

Bootstrap Cloudify manager.

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the desired manager blueprint

#### Optional flags

*  `--task-thread-pool-size TASK_THREAD_POOL_SIZE` -
                        The size of the thread pool to execute tasks in
                        (default: 1)
*  `--install-plugins` -    Install the necessary plugins for the given blueprint
*  `--keep-up-on-failure` - Do not teardown the Manager even if the bootstrap
                        fails
*  `--validate-only` -     Validate without actually performing the bootstrap -
                        process
*  `--skip-validations` -   Bootstrap the manager without validating resources -
*  `-i, --inputs=INPUTS` -
                        Inputs for a Manager blueprint (Can be provided as
                        wildcard based paths (*.yaml, etc..) to YAML files, a
                        JSON string or as "key1=value1;key2=value2"). This
                        argument can be used multiple times.
*  `--task-retries=TASK_RETRIES` -
                        How many times should a task be retried in case of
                        failure (default: 5)
*  `--task-retry-interval=TASK_RETRY_INTERVAL` -
                        How many seconds to wait before each task is retried
                        (default: 30)

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy bootstrap --install-plugins -p aws-ec2-manager-blueprint.yaml -i aws-ec2-manager-blueprint-inputs.yaml
...

Executing bootstrap validation...
Collecting https://github.c
.
.
.
Bootstrap validation completed successfully
Executing manager bootstrap...
.
.
.
Processing inputs source: aws-ec2-manager-blueprint-inputs.yaml
2016-06-27 08:53:00 CFY <manager> Starting 'install' workflow execution
.
.
.
2016-06-27 09:04:21 CFY <manager> 'execute_operation' workflow execution succeeded
Bootstrap complete

...
{{< /gsHighlight >}}