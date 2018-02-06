groups
%%%%%%

The ``cfy groups`` command is used to view information on the different
groups in a deployment.

You can use the command to list all groups.

Optional Flags
^^^^^^^^^^^^^^

These will work on each command:

-  ``-v, --verbose`` - Show verbose output. You can supply this up to
   three times (i.e. -vvv)

-  ``-h, --help`` - Show this message and exit.

Commands
--------

list
~~~~

Usage
^^^^^

``cfy groups list [OPTIONS]``

Lists all groups for a deployment.

``DEPLOYMENT_ID`` is the ID of the deployment for which to list groups.

Required flags
^^^^^^^^^^^^^^

-  ``-d, --deployment-id TEXT`` - The ID of the deployment for which to
   list groups.
-  ``-t,  tenant-name TEXT`` - The name of the tenant on which the
   deployment is made. If unspecified, the current tenant is used.

  #### Example

.. code:: bash

        $ cfy groups list -d hello_world
        ...
        
        Listing groups for deployment hello_world...
        No groups defined for deployment hello_world
        
        ...
