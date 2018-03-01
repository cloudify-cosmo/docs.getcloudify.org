---
layout: bt_wiki
title: Deleting a Blueprint
category: Manager Intro
draft: false
weight: 800
---

Deleting a blueprint removes its model from the database and deletes its resources from the fileserver. Deleting a blueprint does not delete the deployments created from that blueprint or resources of those deployments.

To delete a blueprint run the following command.

{{< gsHighlight  bash >}}
cfy blueprints delete [OPTIONS] BLUEPRINT_ID
{{< /gsHighlight >}}

To delete a blueprint from the Cloudify Web interface, on the Blueprints widget, click **Delete** on the relevant blueprint.

While you deleting a blueprint you can also: 

Show verbose output. You can supply this up to three times (i.e. -vvv) by using -v, —verbose flag. 

Choose The name of the tenant of the deployment. If not specified, the current tenant will be used by using -t, --tenant-name flag. 

![Delete blueprint]({{< img "manager/delete_blueprint.png" >}})
