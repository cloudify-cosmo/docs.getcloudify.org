Upgrading Cloudify Manager
%%%%%%%%%%%%%%%%%%%%%%%%%%

{{% gsTip title=“Version Relevance” %}} You can use this process to
upgrade an existing Cloudify Manager 4.x to a later version. {{% /gsTip
%}}

-  **Reinstall** - Replace Cloudify Manager with the same version on the
   same host
-  **Migration** - Replace Cloudify Manager with the same version on
   another host
-  **In-place upgrade** - Replace Cloudify Manager with a higher version
   on the same host
-  **Migration upgrade** - Replace Cloudify Manager with a higher
   version on another host

.. note::
    :class: summary
    :name: Version Relevance

    The upgrade process is    supported for upgrade from any currently supported version. To upgrade

.. note::
    :class: summary
    :name: Caution

    Make sure that no users are connected to
The upgrade or migration process includes:

-  Reinstall -

   1. Save snapshot of the Cloudify Manager.
   2. Uninstall the Cloudify Manager from the host
   3. Install the Cloudify Manager on the host.
   4. Restore snapshot of the Cloudify Manager to the host.

-  Migration -

   1. Save snapshot of the Cloudify Manager.
   2. Install the Cloudify Manager on the host.
   3. Restore snapshot of the Cloudify Manager to the host.
   4. (Optional) Uninstall (teardown in Cloudify 4.2 and below) the
      Cloudify Manager from the host.
   5. Migrate agents from the old Cloudify Manager.

-  In-place upgrade -

   1. Save snapshot of Cloudify Manager.
   2. Uninstall (teardown in Cloudify 4.2 and below) the Cloudify
      Manager from the host.
   3. Install the Cloudify Manager latest version on the host.
   4. Restore snapshot of the Cloudify Manager to the host.

-  Migration upgrade -

   1. Save snapshot of the the Cloudify Manager.
   2. Install the Cloudify Manager on the host.
   3. Restore snapshot of the Cloudify Manager to the host.
   4. (Optional) Uninstall (teardown in Cloudify 4.2 and below) the
      Cloudify Manager from the host.
   5. Migrate agents from the old Cloudify Manager.

.. note::
    :class: summary
    :name: Web interfaces

    Cloudify Composer and the Web UI    are restored to the snapshot state if the snapshot is from a Cloudify
    Manager 4.2. If you made changes to the Cloudify Manager components,
    such as creating blueprints in composer or adding widgets to Stage,
%}}

.. note::
    :class: summary
    :name: Premium users

    We recommend that premium users    contact Cloudify Support for additional assistance with upgrade and

By default, the certificate folder to backup, is: ``/etc/cloudify/ssl``.

1. (For in-place upgrade) Make sure that the Cloudify Manager is
   completely removed from the machine.

-  For Cloudify Manager 4.0.0, run these commands on the Cloudify
   Manager virtual instance to download the teardown script and run it
   as ``sudo``:
   ``curl -o ~/cfy_teardown_4_0_0.sh https://raw.githubusercontent.com/cloudify-cosmo/cloudify-dev/master/scripts/cfy_teardown_4_0_0.sh``\ 

   ``sudo bash cfy_teardown_4_0_0.sh``. You must supply an -f flag. For
   high availability clusters, you must also run
   ``https://github.com/cloudify-cosmo/cloudify-dev/blob/master/scripts/delete_cluster_4_0_1.py``.

1. (Optional) We recommend that you run this command to remove the
   profile directory of this Cloudify Manager from your local
   ``~/.cloudify/profiles`` directory:
   ``rm -rf ~/.cloudify/profiles/{{ your Manager’s IP address }}``

   Cloudify Manager is now completely removed from the virtual instance.

2. [Install]({{< relref “installation/installing-manager.md” >}}) a new
   Cloudify Manager.

3. To upload the previously created snapshot to the new Manager, run:
   ``cfy snapshots upload {{ /path/to/the/snapshot/file }} --snapshot-id my_snapshot``\ 

4. To restore the snapshot to Cloudify 4.x and above, run:

-  For Cloudify Manager 4.0.1 and above:
   ``cfy snapshots restore my_snapshot --restore-certificates``
-  For Cloudify Manager 4.0.0: ``cfy snapshots restore my_snapshot``

1. To check the status of the execution after it is complete, run:
   ``cfy executions list --include-system-workflows``

2. (Optional) To apply the agent certificates from the previous Manager,
   run these commands to replace the new SSL directory with the copied
   one. ``sudo rm -rf /etc/cloudify/ssl``\ 
   :literal:`sudo cp -r {{ the previously saved SSL directory. For example, `/home/centos/ssl` }} /etc/cloudify`

   To ensure that the directory has Read permissions, run:
   ``sudo chmod -R 644 /etc/cloudify/ssl``

3. Reboot the virtual instance with the new Cloudify Manager.

4. If you have running agents, make sure that you apply ``patch-1``,
   then run ``cfy agents install``.

Upgrading into the new roles system
-----------------------------------

While upgrading to Cloudify to 4.2 and above, you must also consider
user roles and permissions.

In previous versions, Cloudify had only system-wide roles: user and
admin. When you restore a snapshot from below Cloudify 4.2 on a Cloudify
Manager 4.2 and above, user roles are changed:

-  ``user`` becomes ``default``
-  ``admin`` becomes ``sys_admin``

These roles are equivalent in order to maintain backward compatibility.

Also, in versions below Cloudify 4.2, users and groups were associated
to tenants without a role. In Cloudify 4.2 and above, users and groups
are added to a tenant with a specific role. The role affects the user
and group permissions to access tenant resources.

When you restore a snapshot from below Cloudify 4.2 on a Cloudify
Manager 4.2 and above, each user or group that was associated to a
tenant now have the role “user” in this tenant. A user that has the role
“user” in a tenant has the same permissions on resources in this tenant
as a user that was associated with a tenant in previous versions.
