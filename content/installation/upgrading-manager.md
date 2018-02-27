---
layout: bt_wiki
title: Upgrading Cloudify Manager
category: Installation
draft: false
weight: 350

---

To get the latest features and benefits of Cloudify Manager, we recommend that you upgrade to the latest version of Cloudify. You can upgrade in one of these ways:

* **In-place upgrade** - Replace Cloudify Manager with a higher version on the same host
* **Migration upgrade** - Replace Cloudify Manager with a higher version on another host

{{% gsWarning %}}

* **Downtime** - Make sure that no users are connected to any manager services during the upgrade or migration.
* **Web Interface Customizations** - If you made changes to the web interfaces (Stage and Composer) after the snapshot was saved, contact support before you restore the snapshot.
* **Upgrade from Cloudify Manager 4.0.1** - Make sure that you apply update-3 to the Cloudify Manager before you upgrade.

{{% /gsWarning %}}

{{% gsNote %}}

* **Cloudify Premium Customers** - Please contact Cloudify Support for assistance with the reinstall or upgrade process.
* **Supported Upgrade Paths** - The upgrade process is supported for upgrade from Cloudify Manager 4.0.0 and above to the latest GA version. To upgrade from [other currently supported versions]( https://cloudify.co/product/cloudify-lifecycle/ ) or any unsupported versions, contact Cloudify Support. 
* **User Roles and Permissions** - When you upgrade to Cloudify to 4.2 and above, you must also consider [user roles and permissions]({{< relref "installation/upgrading-manager.md#upgrading-into-the-new-roles-system" >}}).

{{% /gsNote %}}

The upgrade process includes:

* In-place upgrade -

  1. [Backup a snapshot]({{< relref "installation/upgrading-manager.md#backup-a-snapshot" >}}) of the Cloudify Manager.
  1. (For upgrade from 4.1.0 and below) If you have multiple Cloudify users, [backup user database]({{< relref "installation/upgrading-manager.md#backup-user-database" >}}).
  1. (For upgrade from 4.0.0) [Backup the agent certificates]({{< relref "installation/upgrading-manager.md#backup-agent-certificates" >}}) from the Cloudify Manager.
  1. [Uninstall the Cloudify Manager]({{< relref "installation/upgrading-manager.md#uninstall-cloudify-manager" >}}) from the original host. In Cloudify 4.2 and below, this is called teardown.
  1. [Install the Cloudify Manager]({{< relref "installation/upgrading-manager.md#install-cloudify-manager" >}}) latest version on the host.
  1. [Restore the snapshot]({{< relref "installation/upgrading-manager.md#restore-snapshot" >}}) of the Cloudify Manager to the host.
  1. (For upgrade from 4.1.0 and below) If you have multiple Cloudify users, [restore user database]({{< relref "installation/upgrading-manager.md#restore-user-database" >}}).
  1. [Migrate agents]({{< relref "installation/upgrading-manager.md#migrate-agents" >}}) to the new Cloudify Manager.
<br>
* Migration upgrade -

  1. [Backup a snapshot]({{< relref "installation/upgrading-manager.md#backup-a-snapshot" >}}) of the Cloudify Manager.
  1. (For upgrade from 4.1.0 and below) If you have multiple Cloudify users, [backup user database]({{< relref "installation/upgrading-manager.md#backup-user-database" >}}).
  1. [Install the Cloudify Manager]({{< relref "installation/upgrading-manager.md#install-cloudify-manager" >}}) latest version on the host.
  1. [Restore the snapshot]({{< relref "installation/upgrading-manager.md#restore-snapshot" >}}) of the Cloudify Manager to the host.
  1. (For upgrade from 4.1.0 and below) If you have multiple Cloudify users, [restore user database]({{< relref "installation/upgrading-manager.md#restore-user-database" >}}).
  1. [Migrate agents]({{< relref "installation/upgrading-manager.md#migrate-agents" >}}) to the new Cloudify Manager.
  1. (Optional) [Uninstall the Cloudify Manager]({{< relref "installation/upgrading-manager.md#uninstall-cloudify-manager" >}}) from the original host. In Cloudify 4.2 and below, this is called teardown.
  {{% gsWarning %}}

  * **Uninstall in consultation with Cloudify Support** - Contact Cloudify Support before you uninstall the old Cloudify Manager.
  * **Prevent Auto-Heal** - If you do not uninstall the old manager for any reason and you use auto-heal policies, then you MUST disconnect the old manager from any networks that it can use to conduct healing workflows.

  {{% /gsWarning %}}

# Upgrade Procedures

## Backup a Snapshot

To backup a snapshot of the Cloudify Manager and all of its data:

1. Login to the Cloudify Manager with Cloudify CLI from a remote host.
1. To create the snapshot, run: ```cfy snapshot create```
  The snapshot is saved to the current tenant. The output of the command shows the snapshot ID. For example, snapshot_XLHCNV.
1. To download the snapshot, run: ```cfy snapshot download <snapshot_ID>```
  The snapshot is saved on the Cloudify CLI host.

For more about the snapshots command, go to: [snapshots]({{< relref "cli/snapshots.md" >}}).

## Backup User Database

When you upgrade from Cloudify Manager 4.1.0 and below and you have multiple Cloudify users, you must backup the Cloudify user database so that you can restore it in the new installation.

To backup the user database:

* Backup the `/opt/manager/rest-security.conf` file to a remote host.

## Backup Agent Certificates

To backup agent certificates:

* Backup the `/etc/cloudify/ssl` directory to a remote host.

## Uninstall Cloudify Manager

For instructions on how to uninstall the Cloudify Manager 4.3 and above, go to: [Uninstalling Cloudify Manager]({{< relref "installation/installing-manager.md#uninstalling-cloudify-manager" >}})

To uninstall Cloudify Manager 4.1 or above:

* To remove Cloudify Manager, run: ```cfy teardown -f```

To uninstall Cloudify Manager 4.0.x:

1. To download the teardown script, run: ```curl -o ~/cfy_teardown_4_0_0.sh https://raw.githubusercontent.com/cloudify-cosmo/cloudify-dev/master/scripts/cfy_teardown_4_0_0.sh```
1. To remove Cloudify Manager, run: ```sudo bash cfy_teardown_4_0_0.sh -f```
1. Apply ```patch-1```.
1. (For high availability clusters only) To download the script to delete the cluster configuration, run: ```https://github.com/cloudify-cosmo/cloudify-dev/blob/master/scripts/delete_cluster_4_0_1.py```
1. (For high availability clusters only) To run the script to delete the cluster configuration, run: ```sudo delete_cluster_4_0_1.py```
1. (Optional) We recommend that you remove the profile directory of this Cloudify Manager from your local `~/.cloudify/profiles` directory: ```rm -rf ~/.cloudify/profiles/{{ your Manager’s IP address }}```

## Install Cloudify Manager

For instructions on how to install the Cloudify Manager, go to: [Installing Cloudify Manager]({{< relref "installation/installing-manager.md" >}})

## Restore Snapshot

To restore the snapshot:

1. To upload the previously created snapshot to the new Manager, run:
   ```cfy snapshots upload {{ /path/to/the/snapshot/file }} --snapshot-id my_snapshot```

1. To restore the snapshot to Cloudify 4.x and above, run:

    * For Cloudify Manager 4.0.1 and above: ```cfy snapshots restore my_snapshot --restore-certificates```
    * For Cloudify Manager 4.0.0: ```cfy snapshots restore my_snapshot```

1. To check the status of the execution after it is complete, run:
   ```cfy executions list --include-system-workflows```

The manager REST service restarts soon after the workflow finishes (~10 seconds). You can run cfy executions list --include-system-workflows to see that the snapshot restore process is terminated.

## Restore User Database

(For upgrade from 4.1.0 and below) If you have multiple Cloudify users, either:

* Reset the passwords of all old users
* Contact support to restore the old users with the `/opt/manager/rest-security.conf` file.

## Migrate Agents

1. For in-place upgrade from Cloudify Manager 4.0.0 only:
  1. To apply the agent certificates from the previous Manager, run these commands to replace the new SSL directory with the copied one.
      ```sudo rm -rf /etc/cloudify/ssl```<br>
      ```sudo cp -r {{ the previously saved SSL directory. For example, `/home/centos/ssl` }} /etc/cloudify```
  1. To ensure that the directory has Read permissions, run:
      ```sudo chmod -R 755 /etc/cloudify/ssl```
  1. Reboot the virtual instance with the new Cloudify Manager.
1. If you have running agents, run `cfy agents install --all-tenants`.

# Upgrading into the new roles system

When you upgrade to Cloudify 4.2 and above, you must also consider user roles and permissions.

In previous versions, Cloudify had only system-wide roles: user and admin. When you restore a snapshot from Cloudify 4.1 and below on a Cloudify Manager 4.2 and above, user roles are changed:

* `user` becomes `default`
* `admin` becomes `sys_admin`

These roles are equivalent in order to maintain backward compatibility.

Also, in Cloudify 4.1 and below users and groups are associated to tenants without a role. In Cloudify 4.2 and above, users and groups are added to a tenant with a specific role. The role affects the user and group permissions to access tenant resources.

When you restore a snapshot from a Cloudify 4.1 and below manager on a Cloudify 4.2 and above manager, each user or group that was associated to a tenant now has the “user” role in this tenant. A user that has the “user” role in a tenant has the same permissions on resources in this tenant as a user that was associated with a tenant in previous versions.
