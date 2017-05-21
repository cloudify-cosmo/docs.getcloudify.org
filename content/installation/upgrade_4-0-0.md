---
layout: bt_wiki
title: Upgrading Cloudify Manager
category: Installation
draft: false
weight: 350

---

This topic describes the methods for upgrading Cloudify Manager. You can also using the process if you need to replace an existing Cloudify Manager with a new one of the same version.

Upgrading Cloudify Manager entails tearing down the existing version and installing a new one on the same virtual machine. You can also restore data and agents' certificates from your existing instance to your new instance. You can upgrade using the CLI or from the Cloudify Web interface.

{{% gsNote title="Note" %}}
Upgrading Cloudify Manager 4.0.0 to a later version requires a specfic procedure for tearing down the existing instance and installing the upgrade. For more information, refer to the [Cloudify Release Notes for v.4.0.1](https://docs.google.com/document/u/1/d/1TaGle2AvOZn0VCI8aJNbWrJgNEcfKxK4Gq5YgeHFlPg/pub).
{{% /gsNote %}}



The key elements of upgrading a Cloudify Manager are:

1. (Optional) Creating a snapshot of your existing Cloud Manager instance.
2. (Optional) Saving the Cloudify agents' certificates.
3. Tearing down the existing Cloud Manager instance.
4. Installing a new version.
5. (Optional) Restoring the snapshot to the new version.
6. (Optional) Restoring the agents' certificates to the new version.



## Upgrading Using the CLI

1. (Optional) To keep your existing data, run the following commands to take a snapshot and download it.      
      ```cfy snapshots create my_snapshot
      cfy snapshots download my_snapshot -o {{ /path/to/the/snapshot/file }}```

2. (Optional) ) If you have Cloudify agents with which you want the new instance of Cloudify Manager to communicate, using SSH run the following command on the Manager VM to save the SSL directory in an alternative location, for example, the home directory.      
      ```cp -r /etc/cloudify/ssl {{ your home directory. For example /home/centos }}```

3. Using SSH, on the Manager VM run the following commands to download the teardown script, and run it as `sudo`.      
      ```curl -o ~/cfy_teardown_4_0_0.sh https://raw.githubusercontent.com/cloudify-cosmo/cloudify-dev/master/scripts/cfy_teardown_4_0_0.sh
      sudo bash cfy_teardown_4_0_0.sh```. You must supply an -f flag.

4. It is recommended that you run the following command to remove the profile directory of this Manager from your local `~/.cloudify/profiles` directory.      
      ```rm -rf ~/.cloudify/profiles/{{ your Manager’s IP address }}```

      Cloudify Manager is removed from the VM.

5. [Bootstrap]({{< relref "installation/bootstrapping.md" >}}#option-2-bootstrapping-a-cloudify-manager) a new Manager (version 4.0.0, or higher) on the same VM.

6. (Optional) If you created a snapshot from your original Manager, run the following command to restore it to the new Manager.      
      ```cfy snapshots upload {{ /path/to/the/snapshot/file }} --snapshot-id my_snapshot
      cfy snapshots restore my_snapshot```

   After the execution is complete, you can run the following command to check its status.   
      ```cfy executions list --include-system-workflows```

7. (Optional) If you want to apply the agents' certificates from the previous Manager, using SSH run the following command to replace the new SSL directory with the copied one.      
      ```sudo rm -rf /etc/cloudify/ssl
      sudo cp -r {{ the previously saved SSL directory. For example, `/home/centos/ssl` }} /etc/cloudify```   

   To ensure that the directory has Read permissions, run:   
      ```sudo chmod -R 644 /etc/cloudify/ssl```

8. Reboot the VM on which the new Manager is installed.



## Upgrading from Cloudify Manager Web Interface



