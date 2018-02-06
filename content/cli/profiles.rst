profiles
%%%%%%%%

The ``cfy profiles`` command is used to manage Cloudify profiles.

Each profile can have its own credentials for managers and Cloudify
various enviromental settings

See [profiles]({{< relref “profiles/overview.md” >}}) for more
information.

Optional flags
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

``cfy profiles list [OPTIONS]``

List all profiles.

  #### Example

.. code:: bash

        $ cfy profiles list
        ...
        
        Listing all profiles...
        
        Profiles:
        +---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+
        |      name     |  manager_ip  | ssh_user |             ssh_key_path            | ssh_port | rest_port | rest_protocol | manager_username | manager_tenant | bootstrap_state |
        +---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+
        | *10.239.2.241 | 10.239.2.241 |  centos  | /Users/user/rackspace/key.pem       |    22    |     80    |      http     |      admin       | default_tenant |     Complete    |
        +---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+
        
        ...

show-current
~~~~~~~~~~~~

.. _usage-1:

Usage
^^^^^

``cfy profiles show-current [OPTIONS]``

Displays your current active profile and its properties.

  #### Example

.. code:: bash

        $ cfy profiles show-current
        ...
        
        Active profile:
        +---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+
        |      name     |  manager_ip  | ssh_user |             ssh_key_path            | ssh_port | rest_port | rest_protocol | manager_username | manager_tenant | bootstrap_state |
        +---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+
        | *10.239.2.241 | 10.239.2.241 |  centos  | /Users/user/rackspace/key.pem       |    22    |     80    |      http     |      admin       | default_tenant |     Complete    |
        +---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+
        
        ...

export
~~~~~~

.. _usage-2:

Usage
^^^^^

``cfy profiles export [OPTIONS]``

Export all profiles to a file

{{% gsWarning title=“Warning” %}} If you include the SSH keys of your
profiles in the archive, after the profiles are imported, the SSH keys
will returned in their original locations. {{% /gsWarning %}}

If ``-o / --output-path`` is omitted, the archive’s name will be
``cfy- profiles.tar.gz``.

.. _optional-flags-1:

Optional flags
^^^^^^^^^^^^^^

-  ``--include-keys`` - Include SSH key files in the archive.
-  ``-o, --output-path TEXT`` - The local path for the download.

  #### Example

.. code:: bash

        $ cfy profiles export
        ...
        
        Exporting profiles to /Users/assi/Work/repos/cfy-profiles.tar.gz...
        Export complete!
        You can import the profiles by running `cfy profiles import PROFILES_ARCHIVE`
        
        ...

import
~~~~~~

.. _usage-3:

Usage
^^^^^

``cfy profiles import [OPTIONS] ARCHIVE_PATH``

Import profiles from a profiles archive.

{{% gsWarning title=“Warning” %}} If a profile exists both in the
archive and locally it will be overwritten (any other profiles will be
left intact). {{% /gsWarning %}}

``ARCHIVE_PATH`` is the path to the profiles archive to import.

.. _optional-flags-2:

Optional flags
^^^^^^^^^^^^^^

-  ``--include-keys`` WARNING: Imports exported keys to their original
   locations.

  #### Example

.. code:: bash

        $ cfy profiles import cfy-profiles.tar.gz
        ...
        
        Importing profiles from cfy-profiles.tar.gz...
        Import complete!
        You can list profiles using `cfy profiles list`
        
        ...

delete
~~~~~~

.. _usage-4:

Usage
^^^^^

``cfy profiles delete [OPTIONS] PROFILE_NAME``

Delete a profile.

``PROFILE_NAME`` is the IP of the Cloudify Manager the profile manages.

  #### Example

.. code:: bash

        $ cfy profiles delete 10.239.2.241
        ...
        
        Deleting profile 10.239.2.241...
        Profile deleted
        
        ...

use
~~~

.. _usage-5:

Usage
^^^^^

``cfy profiles use [OPTIONS] MANAGER_IP``

Control a specific Cloudify Manager.

``PROFILE_NAME`` is the IP of the manager the profile manages.

Additional CLI commands are added after a Cloudify Manager is used. To
stop using Cloudify Manager, you can run ``cfy init -r``.

.. _optional-flags-3:

Optional flags
^^^^^^^^^^^^^^

-  ``--profile-name TEXT`` - Name of the profile to use.
-  ``-s, --ssh-user TEXT`` - The SSH user on the host machine with which
   to SSH into the manager.
-  ``-k, --ssh-key TEXT`` - The path to the SSH key-file to use when
   connecting.
-  ``--ssh-port INTEGER`` - The SSH port to use when connecting to the
   Manager.
-  ``-u, --manager-username TEXT`` - Manager username used to run
   commands on the Manager.
-  ``-p, --manager-password TEXT`` - Manager password used to run
   commands on the Manager.
-  ``-t, --manager-tenant TEXT`` - The tenant associated with the user
   currently operating the Manager.
-  ``--rest-port INTEGER`` - The REST server’s port.

  #### Example

.. code:: bash

        cfy profiles use 10.239.2.241 -t default_tenant -u admin -p admin
        ...
        
        Initializing local profile ...
        Initialization completed successfully
        Attempting to connect...
        Initializing profile 10.239.2.241...
        Initialization completed successfully
        Using manager 10.239.2.241 with port 80
        
        ...

purge-incomplete
~~~~~~~~~~~~~~~~

.. _usage-6:

Usage
^^^^^

``cfy profiles purge-incomplete [OPTIONS]``

Purge all profiles for which the bootstrap state is incomplete.

  #### Example

.. code:: bash

        $ cfy profiles purge-incomplete
        ...
        
        Purging incomplete bootstrap profiles...
        Purge complete
        
        ...

set
~~~

.. _usage-7:

Usage
^^^^^

``cfy profiles set [OPTIONS]``

Set the profile name, manager username and/or password and/or tenant in
the *current* profile

.. _optional-flags-4:

Optional flags
^^^^^^^^^^^^^^

-  ``--profile-name TEXT`` - Name of the profile to use.
-  ``-u, --manager-username TEXT`` - Manager username used to run
   commands on the manager.
-  ``-p, --manager-password TEXT`` - Manager password used to run
   commands on the manager.
-  ``-t, --manager-tenant TEXT`` - The tenant associated with the
   current user operating the manager.
-  ``--skip-credentials-validation`` - Do not check that the passed
   credentials are correct (default:False)

  #### Example

.. code:: bash

        $ cfy profiles set -u admin
        ...
        
        Validating credentials...
        Credentials validated
        Setting username to `admin`
        Settings saved successfully
        
        ...

unset
~~~~~

.. _usage-8:

Usage
^^^^^

``cfy profiles unset [OPTIONS]``

Clear the manager username and/or password and/or tenant from the
*current* profile.

.. _optional-flags-5:

Optional flags
^^^^^^^^^^^^^^

-  ``-u, --manager-username`` - Manager username used to run commands on
   the manager.
-  ``-p, --manager-password`` - Manager password used to run commands on
   the manager.
-  ``-t, --manager-tenant`` - The tenant associated with the current
   user operating the manager.
-  ``--skip-credentials-validation`` - Do not check that the passed
   credentials are correct. (default:False)

  #### Example

.. code:: bash

        $ cfy profiles unset -u
        ...
        
        Validating credentials...
        Credentials validated
        Clearing manager username
        Settings saved successfully
        
        ...
