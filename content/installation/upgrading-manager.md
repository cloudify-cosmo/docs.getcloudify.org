---
layout: bt_wiki
title: Upgrading Cloudify Manager
category: Installation
draft: false
weight: 350

---

{{% gsTip title="Version Relevance" %}}
You can use this process to upgrade an existing Cloudify Manager 4.x to a later version.
{{% /gsTip %}}

Upgrading Cloudify Manager tears down the existing Cloudify Manager and installs a new one on the same virtual instance. You can restore data and agent certificates from your existing instance to your new instance. 

The steps of the Cloudify Manager upgrade are:

1. Create a snapshot of your existing Cloudify Manager instance.
2. (Optional) Save the Cloudify agent certificates.
3. Tear down the existing Cloud Manager instance.
4. Install a new version.
5. Restore the snapshot to the new version.
6. (Optional) Restore the agent certificates to the new version.

{{% gsNote title="Upgrading an HA Cluster" %}}
Cloudify Manager snapshots do not include cluster information. If you restore the snapshot of a Cloudify Manager that was the active Manager in a cluster, you must create new Cloudify Managers (of the same version) and [join]({{< relref "cli/clusters.md" >}}) them to the restored Cloudify Manager to [recreate the cluster]({{< relref "manager/high-availability-clusters.md#upgrading-clusters" >}}).
{{% /gsNote %}}

## Procedure

1. To keep your existing data, run these commands to create and download a snapshot of the existing Manager:
      ```cfy snapshots create my_snapshot```<br>
      ```cfy snapshots download my_snapshot -o {{ /path/to/the/snapshot/file }}```
1. (For in-place upgrade) Make sure that the new Cloudify Manager has the same certificate as the old one:

  * For Cloudify Manager 4.0.1 and above, the certificate is part of the snapshot.
  * For Cloudify Manager 4.0.0, you must manually copy the certificate from the Cloudify Manager to a backup location. 

  By default, the certificate folder to backup, is: `/etc/cloudify/ssl`.

1. (For in-place upgrade) Make sure that the Cloudify Manager is completely removed from the machine.

  * For Cloudify Manager 4.0.0, run these commands on the Cloudify Manager virtual instance to download the teardown script and run it as `sudo`:
      ```curl -o ~/cfy_teardown_4_0_0.sh https://raw.githubusercontent.com/cloudify-cosmo/cloudify-dev/master/scripts/cfy_teardown_4_0_0.sh```<br>

      ```sudo bash cfy_teardown_4_0_0.sh```. You must supply an -f flag.<br>
      For high availability clusters, you must also run ```https://github.com/cloudify-cosmo/cloudify-dev/blob/master/scripts/delete_cluster_4_0_1.py```.

1. (Optional) We recommend that you run this command to remove the profile directory of this Cloudify Manager from your local `~/.cloudify/profiles` directory:
   ```rm -rf ~/.cloudify/profiles/{{ your Manager’s IP address }}```

    Cloudify Manager is now completely removed from the virtual instance.

1. [Install]({{< relref "installation/installing-manager.md" >}}) a new Cloudify Manager.

1. To upload the previously created snapshot to the new Manager, run:
   ```cfy snapshots upload {{ /path/to/the/snapshot/file }} --snapshot-id my_snapshot```<br>

1. To restore the snapshot to Cloudify 4.x and above, run: <br>

  * For Cloudify Manager 4.0.1 and above: ```cfy snapshots restore my_snapshot --restore-certificates```
  * For Cloudify Manager 4.0.0: ```cfy snapshots restore my_snapshot```

1. To check the status of the execution after it is complete, run:
   ```cfy executions list --include-system-workflows```

1. (Optional) To apply the agent certificates from the previous Manager, run these commands to replace the new SSL directory with the copied one.
      ```sudo rm -rf /etc/cloudify/ssl```<br>
      ```sudo cp -r {{ the previously saved SSL directory. For example, `/home/centos/ssl` }} /etc/cloudify```

      To ensure that the directory has Read permissions, run:
      ```sudo chmod -R 644 /etc/cloudify/ssl```

1. Reboot the virtual instance with the new Cloudify Manager.

1. If you have running agents, make sure that you apply `patch-1`, then run `cfy agents install`.


## Upgrading into the new roles system

While upgrading to Cloudify to 4.2 and above, you must also consider user roles and permissions.

In previous versions, Cloudify had only system-wide roles: user and admin. When you restore a snapshot from below Cloudify 4.2 on a Cloudify Manager 4.2 and above, user roles are changed:

- `user` becomes `default`
- `admin` becomes `sys_admin`

These roles are equivalent in order to maintain backward compatibility.

Also, in versions below Cloudify 4.2, users and groups were associated to tenants without a role. In Cloudify 4.2 and above, users and groups are added to a tenant with a specific role. The role affects the user and group permissions to access tenant resources.

When you restore a snapshot from below Cloudify 4.2 on a Cloudify Manager 4.2 and above, each user or group that was associated to a tenant now have the role “user” in this tenant. A user that has the role “user” in a tenant has the same permissions on resources in this tenant as a user that was associated with a tenant in previous versions.
