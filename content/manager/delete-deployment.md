---
layout: bt_wiki
title: Deleting a Deployment
category: Manager Intro
draft: false
weight: 700
---

After you have uninstalled an application, you can delete it from Cloudify Manager. After you uninstall an application, all of its static and runtime properties are still stored in the Manager's database and the deployment-specific agents continue to consume resources on the Manager. Deleting a deployment enables you to clean the environment of those excess artifacts.

To remove the information related to a deployment on the Manager, run the following command.

{{< gsHighlight  bash >}}
cfy deployments delete nodecellar
{{< /gsHighlight >}}

While you deleting a deployment you can also:

Delete the deployment even if there are existing live nodes for it by using -f, —force flag.

Show verbose output. You can supply this up to three times (i.e. -vvv) by using -v, —verbose flag.

Choose The name of the tenant of the deployment. If not specified, the current tenant will be used by using -t, --tenant-name flag.

![Delete deployment]({{< img "manager/delete_deployment1.png" >}})

![Delete deployment]({{< img "manager/delete_deployment2.png" >}})

