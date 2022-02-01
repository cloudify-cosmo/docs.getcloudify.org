---
layout: bt_wiki
title: Deleting a Deployment
category: Manager Intro
draft: false
weight: 700
aliases: /manager/delete-deployment/
---

After you have uninstalled an application, you can delete it from {{< param cfy_manager_name >}}. After you uninstall an application, all of its static and runtime properties are still stored in the Manager's database and the deployment-specific agents continue to consume resources on the Manager. Deleting a deployment enables you to clean the environment of those excess artifacts.

To delete a deployment from the manager with the CLI, run:

{{< highlight bash >}}
cfy deployments delete nodecellar
{{< /highlight >}}

The delete options are:

    -v, --verbose - Show verbose output. You can supply this up to three times, for example -vvv.
    -t, --tenant-name - Specify the tenant where the blueprint in stored. (Default: current tenant)
    -f, --force flag - Delete the deployment even it contains active nodes.

To delete a deployment from the {{< param cfy_console_name >}} go to the [Services page]({{< relref 
"working_with/console/pages/services-page.md" >}}), select relevant deployment in the left pane, 
then click **Deployment actions** button and select **Delete** option.

    ![Delete deployment from deployments list]( /images/manager/delete_deployment.png )
