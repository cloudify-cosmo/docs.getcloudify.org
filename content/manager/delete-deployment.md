---
layout: bt_wiki
title: Deleting a Deployment
category: Manager Intro
draft: false
weight: 700
---

After uninstalling an application you can delete it from the Manager. Deleting a deployment has no functional value per se, but it does clean up the environment from excess artifacts. For example, all of its static and runtime properties are still stored in the Manager's database and the deployment specific agents are consuming resources on the Manager after the application has been uninstalled.

Assuming the uninstall process completed successfully, all of the application's resources should have been removed.

To clean up all the information related to the deployment on the manager, execute the following:

{{< gsHighlight  bash >}}
cfy deployments delete -d nodecellar
{{< /gsHighlight >}}

# What's Next

Next, you can [delete the blueprint]({{< relref "manager/delete-blueprint.md" >}}).