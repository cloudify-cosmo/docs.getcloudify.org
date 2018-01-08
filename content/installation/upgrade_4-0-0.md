---
layout: bt_wiki
title: Upgrading Cloudify Manager
category: Installation
draft: false
weight: 350

---

This topic describes how to upgrade Cloudify Manager.

{{% gsTip title="Version Relevance" %}}
You can use this process to replace an existing Cloudify Manager 4.x with a new one of version 4.0, or higher.
{{% /gsTip %}}

Upgrading Cloudify Manager entails tearing down the existing Manager and installing a new one on the same virtual machine. You can also restore data and agents' certificates from your existing instance to your new instance. 

The key elements of upgrading a Cloudify Manager are:

1. Creating a snapshot of your existing Cloud Manager instance.
2. (Optional) Saving the Cloudify agents' certificates.
3. Tearing down the existing Cloud Manager instance.
4. Installing a new version.
5. Restoring the snapshot to the new version.
6. (Optional) Restoring the agents' certificates to the new version.

{{% gsNote title="Upgrading an HA Cluster" %}}
Cloudify Manager snapshots do not include cluster information. If you restore the snapshot of a Cloudify Manager that was the active Manager in a cluster, to recreate a cluster you must create new Cloudify Managers (of the same version) and [join]({{< relref "cli/clusters.md" >}}) them to the restored Cloudify Manager. For more information, [click here]({{< relref "manager/high-availability-clusters.md#upgrading-clusters" >}}).
{{% /gsNote %}}

#### Procedure

1. To keep your existing data, run the following commands to take a snapshot of the existing Manager and download it.
      ```cfy snapshots create my_snapshot```<br>
      ```cfy snapshots download my_snapshot -o {{ /path/to/the/snapshot/file }}```
     
2. (Optional) If you are upgrading Cloudify Manager on the same VM,
make sure that the new Manager will have the same certificate as the old one.
From Cloudify version 4.0.1 the certificate is part of the snapshot.
For version 4.0.0, you must manually copy the certificate from the Manager to a backup location.
By default, the certificate folder to backup, is: `/etc/cloudify/ssl`.


3. If you are upgrading Cloudify Manager on the same VM,
make sure that the Manager was completely removed from the machine.
For Manager versioin 4.0.0, run the following commands on the Manager VM, to download the teardown script, and run it as `sudo`.
      ```curl -o ~/cfy_teardown_4_0_0.sh https://raw.githubusercontent.com/cloudify-cosmo/cloudify-dev/master/scripts/cfy_teardown_4_0_0.sh```<br>

      ```sudo bash cfy_teardown_4_0_0.sh```. You must supply an -f flag.<br>
      If you are using clusters for high availability, you must also run ```https://github.com/cloudify-cosmo/cloudify-dev/blob/master/scripts/delete_cluster_4_0_1.py```.


4. It is recommended that you run the following command to remove the profile directory of this Manager from your local `~/.cloudify/profiles` directory.      
      ```rm -rf ~/.cloudify/profiles/{{ your Manager’s IP address }}```

      Cloudify Manager is removed from the VM.

5. [Bootstrap]({{< relref "installation/installing-manager.md" >}}#option-2-bootstrapping-a-cloudify-manager)
a new Manager (version 4.0.0, or higher). You can bootstrap on the same VM, if you followed the relevant steps for removing the previous instance, as described in step 3.

6. Run the following command to upload the previously created snapshot to the new Manager.
      ```cfy snapshots upload {{ /path/to/the/snapshot/file }} --snapshot-id my_snapshot```<br>
   Then, for Cloudify 4.0.1 and later, run: <br>
      ```cfy snapshots restore my_snapshot --restore-certificates``` <br>
   OR, for Cloudify 4.0.0, run: <br>
      ```cfy snapshots restore my_snapshot```

   After the execution is complete, you can run the following command to check its status.
      ```cfy executions list --include-system-workflows```

7. (Optional) To apply the agents' certificates from the previous Manager, using SSH run the following command to replace the new SSL directory with the copied one.      
      ```sudo rm -rf /etc/cloudify/ssl```<br>
      ```sudo cp -r {{ the previously saved SSL directory. For example, `/home/centos/ssl` }} /etc/cloudify```

      To ensure that the directory has Read permissions, run:   
      ```sudo chmod -R 644 /etc/cloudify/ssl```

8. Reboot the VM on which the new Manager is installed.

9. If you have running agents, make sure that you have applied `patch-1`, then run `cfy agents install`.


#### Upgrading into the new roles system

While upgrading an older version of cloudify to 4.2 (or higher) version, there are some RBAC matters to consider.


In previous versions, Cloudify had only system-wide roles: user and admin. Upon restore of a snapshot of an older version (lower than 4.2) on a 4.2 Manager, users Roles will be changed as follow:

- `user` will now become `default`
- `admin` will now become `sys_admin`

Those roles are equivalent, in order to keep backward compatibility.


On top of that, in previous versions, a user or a group was associated to tenants without a role. Since version 4.2, user and user-group are added to a tenant with a specific role. The role affects the user’s or group’s permissions regarding resources inside this specific tenant. 

When restoring a snapshot of an older version on a 4.2 Manager, each user or user-group that were associated to any tenant, will now have the role “user” in this tenant. The role user was chosen from reasons of backward compatibility, since a user that has the role “user” in a tenant will have the same permissions on resources in this tenant as a user that was associated with a tenant in the previous versions.

