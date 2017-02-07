---
layout: bt_wiki
title: dev
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 50
---

The `cfy dev` command is used to run [fabric](http://www.fabfile.org/) tasks on a Cloudify manager via SSH.

This supplies an easy way to run personalized, complex ssh scripts on the manager without having to manually connect to it.

{{% gsNote title="Note" %}}
The tasks don't have to be decorated with the ``@task`` decorator as they're directly called from the cli's code just like any other python function. Also, as fabric is one of the cli's dependencies, you don't have to install it separately unless you're using the cli as a binary in which case you'll have to install fabric yourself.
{{% /gsNote %}}

For instance, you could write a task that deploys and upgrades a monitoring agent you use to monitor your systems. During that manager's lifecycle, you could rerun the same task to update that agent.


Usage: `cfy dev [options] -p TASKS_FILE -t TASK`

Run fabric tasks on the manager.

#### Required flags

*  `-t, --task=TASK` -  The name of fabric task to run
*  `-p, --tasks-file=TASKS_FILE` - 
                        The path to the tasks file

#### Optional flags

*  `-a ..., --args ...` -    Arguments for the fabric task


## Examples

{{< gsHighlight  markdown  >}}
$ cfy dev --tasks-file my_tasks.py -v -t my_task -a --arg1=something --arg2=otherthing ...
$ cfy dev -v -t my_task -a arg1_value arg2_value ...
...
{{< /gsHighlight >}}

``--tasks-file my_tasks.py`` can be omitted if a ``tasks.py`` file exists in your current working directory.

So for instance, if you want to echo ``something`` in your currently running manager, all you have to do is supply a ``tasks.py`` file with the following:

{{< gsHighlight  python  >}}
from fabric.api import run

def echo(text):
  run('echo {0}'.format(text))
{{< /gsHighlight >}}

{{< gsHighlight  markdown  >}}
$ cfy dev -t echo -a something
{{< /gsHighlight >}}

Cloudify provides a tasks [repo](https://github.com/cloudify-cosmo/cloudify-cli-fabric-tasks) from which users can obtain tasks and to which developers should contribute for the benefit of all.