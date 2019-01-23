Using the debugger with cloudify
==============================

While some parts of cloudify do run locally (eg. the CLI, or the system tests
framework) and can be run under a regular debugger (eg.
`pudb <https://pypi.python.org/pypi/pudb>`_), most of the interesting parts
run in remote tasks on the Cloudify Manager, so a regular debugger won't work with that.


Remote debugger for executions
-------------------------

{{% tip title="Tip" %}}
   
  Cloudify does not use anymore celery for running executions 
  but for sake of backward compatibility we still install it in the environment.
{{% /tip %}}

We can use remote celery, use rdb, eg. use a text editor to

{{< highlight python >}}
    from celery.contrib import rdb
    rdb.set_trace()
{{< /highlight >}}

Then it will start listening on port 6899 (by default), or if that is already
in use, 6900, 6901, ...

Connect to the debugger using telnet or nc (on centos, you need to install
them using eg. `yum install telnet` or `yum install nc`), like
`telnet 127.0.0.1 6900`.

Sometimes it might be hard to guess which port it's using; you can simply guess
or look at the open ports and make a more informed guess.
The following command might be useful:

    $ netstat -tulpn | grep python

Shows ports that processes named "python" are listening on. (on a cloudify
manager usually it'll be just the REST service, and your debuggers)


{{% tip title="Tip" %}}
    Remember that after adding `.set_trace()`, you need to restart the process
    running that code (usually it'll be mgmtworker - or gunicorn if you're
    working on the REST service).
    `sudo systemctl restart cloudify-mgmtworker`
    `sudo systemctl restart cloudify-restservice`
{{% /tip %}}




Also read the `Celery RDB docs <http://docs.celeryproject.org/en/latest/tutorials/debugging.html>`_.


Where to put set_trace?
-----------------------

If you'd like to put a `set_trace` call inside cloudify code that will be
used by the management worker, edit files inside `/opt/mgmtworker/env/lib/python2.7/site-packages`,
eg. `/opt/mgmtworker/env/lib/python2.7/site-packages/cloudify/dispatch.py`

Restarting Cloudify workers
-----------------

After adding a `set_trace`, you need to restart Cloudify workers so it loads the new code.
To do it, best to simply do `sudo systemctl restart cloudify-mgmtworker`.

Anyway, it is a good idea to tail the mgmtworker logs to verify that it did
restart successfully (`/var/log/mgmtworker/cloudify-mgmtworker.log`)

Debugging on agent machines
------------------------

Celery is also installed on agent machines - the virtualenv is usually located
in `/home/<agent_user>/<node_name>/env/`, eg `/home/centos/vm_a1b2c3/env/lib/python2.7/site-packages/cloudify/dispatch.py`.

Restarting agent workers there depends on the process management method, but with the
most commonly used initd, you would do

    $ systemctl restart cloudify-worker-node_name
   


PDB primer
----------

rdb is simply pdb using a network socket; all the regular pdb commands can
still be used with it. See the [pdb docs](https://docs.python.org/2/library/pdb.html#debugger-commands)
and [this talk](https://www.youtube.com/watch?v=P0pIW5tJrRM) to learn how to use pdb.


Attaching remote debugger Pycharm
---------------------------

For attaching remote debugger in Pycharm you need to have Professional Edition license. You can follow [this instruction.](https://www.jetbrains.com/help/pycharm/remote-debugging-with-product.html#remote-debug-config)
