dev
%%%

The ``cfy dev`` command is used to run
`fabric <http://www.fabfile.org/>`__ tasks on a Cloudify manager via
SSH.

This supplies an easy way to run personalized, complex ssh scripts on
the manager without having to manually connect to it.

.. note::
    :class: summary

    The tasks do not have to be decorated with    the ``@task`` decorator, because they are directly called from the CLI
    code, as with any other python function. Also, as fabric is one of the
    CLI’s dependencies, you do not need to install it separately unless you
    are using the CLI as a binary, in which case you must install fabric
    yourself.
    
    For example, you could write a task that deploys and upgrades a
    monitoring agent you use to monitor your systems. During that manager’s
    lifecycle, you could rerun the same task to update that agent. {{%

Usage
^^^^^

``cfy dev [options] -p TASKS_FILE -t TASK``

Run fabric tasks on the manager.

Required flags
^^^^^^^^^^^^^^

-  ``-t, --task=TASK`` - The name of fabric task to run
-  ``-p, --tasks-file=TASKS_FILE`` - The path to the tasks file

Optional flags
^^^^^^^^^^^^^^

-  ``-a ..., --args ...`` - Arguments for the fabric task

Examples
--------

.. code:: bash

        $ cfy dev --tasks-file my_tasks.py -v -t my_task -a --arg1=something --arg2=otherthing ...
        $ cfy dev -v -t my_task -a arg1_value arg2_value ...
        ...

``--tasks-file my_tasks.py`` can be omitted if a ``tasks.py`` file
exists in your current working directory.

For example, to echo ``something`` in your currently running Manager,
you need only supply a ``tasks.py`` file with the following:

.. code:: python

        from fabric.api import run
        
        def echo(text):
          run('echo {0}'.format(text))

.. code:: markdown

        $ cfy dev -t echo -a something

Cloudify provides a tasks
`repository <https://github.com/cloudify-cosmo/cloudify-cli-fabric-tasks>`__
from which users can obtain tasks and to which developers should
contribute for the benefit of all.
