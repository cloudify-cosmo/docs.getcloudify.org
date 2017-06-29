---
layout: bt_wiki
title: Uninstalling Cloudify
category: Installation
draft: false
weight: 500

---

 In the event that you need to uninstall Cloudify, use the following procedure that is relevant to your platform. <br>
 Uninstalling the package does not remove Python, pip or Virtualenv.

 You can also remove an instance of Cloudify Manager using the [`teardown` command]({{< relref "cli/teardown.md" >}}) in the CLI.

### Uninstall Cloudify from CentOS/RHEL

* From a terminal command prompt, run the following:<br>
{{< gsHighlight bash>}}
     $ rpm -e cloudify
     {{< /gsHighlight >}} 

### Uninstall Cloudify from Debian/Ubuntu

* From a terminal command prompt, run the following:<br>
{{< gsHighlight bash>}}
     sudo dpkg -r cloudify
     {{< /gsHighlight >}} 


### Uninstall Cloudify from Windows

1. Open **Programs** from the **Control Panel**.
2. Select **Cloudify CLI**, then click **Uninstall**.

