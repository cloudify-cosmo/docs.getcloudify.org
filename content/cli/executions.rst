executions
%%%%%%%%%%

The ``cfy executions`` command is used to manage workflow executions on
Cloudify mManager.

You can use the command to start, cancel and and list executions and to
retrieve information about a single execution.

Optional Flags
^^^^^^^^^^^^^^

These will work on each command:

-  ``-v, --verbose`` - Show verbose output. You can supply this up to
   three times (i.e. -vvv)

-  ``-h, --help`` - Show this message and exit.

Commands
--------

start
~~~~~

Usage
^^^^^

``cfy executions start [OPTIONS] WORKFLOW_ID``

Execute a workflow on a given deployment

``WORKFLOW_ID`` is the ID of the workflow to execute (e.g.
``uninstall``)

.. _optional-flags-1:

Optional flags
^^^^^^^^^^^^^^

-  ``-d, --deployment-id TEXT`` - The deployment ID to execute the
   workflow on
-  ``-p, --parameters TEXT`` - Parameters for the workflow execution
   (Can be provided as wildcard based paths (*.yaml, etc..) to YAML
   files, a JSON string or as “key1=value1;key2=value2”). This argument
   can be used multiple times.
-  ``--allow-custom-parameters`` - Allow passing custom parameters
   (which were not defined in the workflow’s schema in the blueprint) to
   the execution
-  ``-f, --force`` - Execute the workflow even if there is an ongoing
   execution for the given deployment
-  ``--timeout INTEGER`` - Operation timeout in seconds (The execution
   itself will keep going, but the CLI will stop waiting for it to
   terminate) (default: 900)
-  ``-l, --include-logs / --no-logs`` - Include logs in returned events
-  ``--json`` - Output events in a consumable JSON format
-  ``-t, --tenant-name TEXT`` The name of the tenant on which the
   execution will be executed. If unspecified, the current tenant is
   used.

  #### Example

.. code:: bash

        $ cfy executions start install -d cloudify-nodecellar-example
        ...
        
        Executing workflow install on deployment cloudify-nodecellar-example [timeout=900 seconds]
        2017-03-29 11:34:11.704  CFY <cloudify-nodecellar-example> Starting 'install' workflow execution
        2017-03-29 11:34:12.204  CFY <cloudify-nodecellar-example> [hos...
        .
        .
        .
        2017-03-29 11:36:47.537  CFY <cloudify-nodecellar-example> 'install' workflow execution succeeded
        Finished executing workflow install on deployment cloudify-nodecellar-example
        * Run 'cfy events list -e f38ad989-d09e-4b68-b041-ac63aeacb9ae' to retrieve the execution's events/logs
        
        ...

cancel
~~~~~~

.. _usage-1:

Usage
^^^^^

``cfy executions cancel [OPTIONS] EXECUTION_ID``

Cancel a workflow’s execution

``EXECUTION_ID`` - The ID of the execution to be canceled.

.. _optional-flags-2:

Optional flags
^^^^^^^^^^^^^^

-  ``-f, --force`` - Terminate the execution abruptly, rather than
   request an orderly termination.
-  ``-t, --tenant-name TEXT`` The name of the tenant on which the
   execution is to be canceled. If unspecified, the current tenant is
   used.

  #### Example

.. code:: bash

        $ cfy executions cancel eba71d2b-2456-4423-acb0-f8fc7324e793
        ...
        
        Cancelling execution eba71d2b-2456-4423-acb0-f8fc7324e793
        A cancel request for execution eba71d2b-2456-4423-acb0-f8fc7324e793 has been sent. To track the execution's status, use:
        cfy executions get eba71d2b-2456-4423-acb0-f8fc7324e793
        
        ...

list
~~~~

.. _usage-2:

Usage
^^^^^

``cfy executions list [options]``

List executions.

If ``DEPLOYMENT_ID`` is provided, lists executions for that deployment.
Otherwise, lists executions for all deployments.

.. _optional-flags-3:

Optional flags
^^^^^^^^^^^^^^

-  ``-d, --deployment-id TEXT`` - The ID of the deployment for which
   executions are to be listed.
-  ``--include-system-workflows`` -
   Include executions of system workflows.
-  ``--sort-by TEXT`` - Key for sorting the list.
-  ``--descending`` - Sort list in descending order. [default: False]
-  ``-t, --tenant-name TEXT`` The name of the tenant on which the
   executions occurred. If unspecified, the current tenant is used.

  #### Example

.. code:: bash

        $ cfy executions list
        ...
        
        Listing all executions...
        
        Executions:
        +--------------------------------------+-------------------------------+------------+---------------+--------------------------+-------+------------+----------------+------------+
        |                  id                  |          workflow_id          |   status   | deployment_id |        created_at        | error | permission |  tenant_name   | created_by |
        +--------------------------------------+-------------------------------+------------+---------------+--------------------------+-------+------------+----------------+------------+
        | fa330011-1f33-4e6c-82cb-a4537e13c950 |            install            | terminated |   nodecellar  | 2017-03-28 07:47:04.733  |       |  creator   | default_tenant |   admin    |
        | 261ac6f8-c75d-4e28-9c62-646925cd326c |           uninstall           | terminated |   nodecellar  | 2017-03-28 07:55:02.582  |       |  creator   | default_tenant |   admin    |
        +--------------------------------------+-------------------------------+------------+---------------+--------------------------+-------+------------+----------------+------------+
        
        ...

get
~~~

.. _usage-3:

Usage
^^^^^

``cfy executions get [OPTIONS] EXECUTION_ID``

Retrieve information for a specific execution.

``EXECUTION_ID`` is the execution about which to retrieve information.

.. _optional-flags-4:

Optional flags
^^^^^^^^^^^^^^

-  ``-t, --tenant-name TEXT`` The name of the tenant on which the
   execution occurred. If unspecified, the current tenant is used.

  #### Example

.. code:: bash

        $ cfy executions get f38ad989-d09e-4b68-b041-ac63aeacb9ae
        ...
        
        Retrieving execution f38ad989-d09e-4b68-b041-ac63aeacb9ae
        
        Execution:
        +--------------------------------------+-------------+------------+-----------------------------+--------------------------+-------+------------+----------------+------------+
        |                  id                  | workflow_id |   status   |        deployment_id        |        created_at        | error | permission |  tenant_name   | created_by |
        +--------------------------------------+-------------+------------+-----------------------------+--------------------------+-------+------------+----------------+------------+
        | f38ad989-d09e-4b68-b041-ac63aeacb9ae |   install   | terminated | cloudify-nodecellar-example | 2017-03-29 11:34:11.014  |       |  creator   | default_tenant |   admin    |
        +--------------------------------------+-------------+------------+-----------------------------+--------------------------+-------+------------+----------------+------------+
        
        Execution Parameters:
        ...
