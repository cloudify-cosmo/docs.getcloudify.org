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
     
2. (Optional) In case you're upgrading the manager on the same machine,
you need to make sure that the new manager will have the same certificate as the old one.
from Cloudify 4.0.1 it's being take care of, and the certificate is part of the snapshot.
For 4.0.0, you need to manually copy the certificate from the manager to some backup location.
By default, the certificate folder, that need to backup, is: `/etc/cloudify/ssl`


3. In case you're upgrading the manager on the same machine,
you need to make sure that the manager was completely removed from the machine.
If your manager is 4.0.0, on the Manager VM run the following commands to download the teardown script, and run it as `sudo`.
      ```curl -o ~/cfy_teardown_4_0_0.sh https://raw.githubusercontent.com/cloudify-cosmo/cloudify-dev/master/scripts/cfy_teardown_4_0_0.sh```<br>
      ```sudo bash cfy_teardown_4_0_0.sh```. You must supply an -f flag.
From Cloudify 4.0.1, no need for that script. Just need to run: `cfy teardown`. You must supply an -f flag.

4. It is recommended that you run the following command to remove the profile directory of this Manager from your local `~/.cloudify/profiles` directory.      
      ```rm -rf ~/.cloudify/profiles/{{ your Manager’s IP address }}```

      Cloudify Manager is removed from the VM.

5. [Bootstrap]({{< relref "installation/bootstrapping.md" >}}#option-2-bootstrapping-a-cloudify-manager)
a new Manager (version 4.0.0, or higher). You can bootstrap on the same VM, if you followed the relevant steps for it.

6. Run the following command to upload the previously created snapshot to the new Manager.
      ```cfy snapshots upload {{ /path/to/the/snapshot/file }} --snapshot-id my_snapshot```<br>
   Then, on Cloudify 4.0.1 and upper, run: <br>
      ```cfy snapshots restore my_snapshot --restore-certificates``` <br>
   And for Cloudify 4.0.0.0, run: <br>
      ```cfy snapshots restore my_snapshot```

   After the execution is complete, you can run the following command to check its status.
      ```cfy executions list --include-system-workflows```

7. (Optional) To apply the agents' certificates from the previous Manager, using SSH run the following command to replace the new SSL directory with the copied one.      
      ```sudo rm -rf /etc/cloudify/ssl```<br>
      ```sudo cp -r {{ the previously saved SSL directory. For example, `/home/centos/ssl` }} /etc/cloudify```

      To ensure that the directory has Read permissions, run:   
      ```sudo chmod -R 644 /etc/cloudify/ssl```

8. Reboot the VM on which the new Manager is installed.

9. In case of a live agents, need to run `cfy agents install`.
Before running this command, need to apply patch-4.








