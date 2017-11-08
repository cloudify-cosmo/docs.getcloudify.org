---
layout: bt_wiki
title: Uninstalling Cloudify
category: Installation
draft: false
weight: 500

---


 In the event that you need to uninstall Cloudify, use the following procedures to delete Cloudify Manager from a VM and then uninstall the CLI. 


## Deleting Cloudify Manager from a Virtual Machine

 You remove an instance of Cloudify Manager from a VM using the [`teardown` command]({{< relref "cli/teardown.md" >}}) in the CLI. This process removes Cloudify Manager without deleting the VM.

## Removing the Cloudify Command Line Interface

After tearing down Cloudify Manager, you can remove the CLI. Use the process below that is relevant to your platform. <br>
Uninstalling the package does not remove Python, pip or Virtualenv.

### Uninstall Cloudify from CentOS/RHEL

* From a terminal command prompt, run the following:<br>
{{< gsHighlight bash>}}
     $ rpm -e cloudify
     {{< /gsHighlight >}} 

### Uninstall Cloudify from Debian/Ubuntu

* From a terminal command prompt, run the following:<br>
{{< gsHighlight bash>}}
     $ sudo dpkg -r cloudify
     {{< /gsHighlight >}} 

### Uninstall Cloudify from Mac

* From a terminal command prompt, run the following:<br>
{{< gsHighlight bash>}}
     $ pkgutil --unlink test.gigaspaces.pkg.cloudify
     $ pkgutil --forget test.gigaspaces.pkg.cloudify
     {{< /gsHighlight >}} 

### Uninstall Cloudify from Windows

1. Open **Programs** from the **Control Panel**.
2. Select **Cloudify CLI**, then click **Uninstall**.




