---
layout: bt_wiki
title: Deleting a Deployment
category: Manager Intro
draft: false
weight: 700
aliases: /manager/delete-deployment/
---

After you have uninstalled an application, you can delete it from Cloudify Manager. After you uninstall an application, all of its static and runtime properties are still stored in the Manager's database and the deployment-specific agents continue to consume resources on the Manager. Deleting a deployment enables you to clean the environment of those excess artifacts.

To delete a deployment from the manager with the CLI, run:

{{< highlight bash >}}
cfy deployments delete nodecellar
{{< /highlight >}}

The delete options are:

    -v, --verbose - Show verbose output. You can supply this up to three times, for example -vvv.
    -t, --tenant-name - Specify the tenant where the blueprint in stored. (Default: current tenant)
    -f, --force flag - Delete the deployment even it contains active nodes.

To delete a deployment from the Cloudify Console, you can:

* Go to the **Deployments** page and open action menu (![List icon]( /images/ui/icons/list-icon.png ) icon) on the relevant deployment and click **Delete**.

    ![Delete deployment from deployments list]( /images/manager/delete_deployment1.png )

* Go to the **Deployments** page, click on the relevant deployment and on deployment drill-down page click **Delete deployment**.

    ![Delete deployment from deployment details]( /images/manager/delete_deployment2.png )
