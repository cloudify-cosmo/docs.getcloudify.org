---
layout: bt_wiki
title: Deleting a Blueprint
category: Manager Intro
draft: false
weight: 800
aliases: /manager/delete-blueprint/
---

Deleting a blueprint removes its model from the database and deletes its resources from the fileserver. Deleting a blueprint does not delete the deployments created from that blueprint or resources of those deployments.
**Notice** that blueprints that are used in other blueprints are protected for deletion until it has no users or it's deleted with the force flag. 

To delete a blueprint from the manager with the CLI, run:

{{< highlight bash >}}
cfy blueprints delete [OPTIONS] BLUEPRINT_ID
{{< /highlight >}}

The delete options are:

    -v, --verbose     - Show verbose output. You can supply this up to three times, for example -vvv.
    -t, --tenant-name - Specify the tenant where the blueprint in stored. (Default: current tenant)
    -f, --force`      - Delete the blueprint, even if there are blueprints that are currently using it.

To delete a blueprint from the {{< param cfy_console_name >}} choose one of the options:

* Go to the [Blueprints page]({{< relref "working_with/console/pages/blueprints-page.md" >}}) and click **Delete** icon (![Delete blueprint]( /images/ui/icons/delete-icon.png )) on the relevant blueprint

* Go to the [Blueprints page]({{< relref "working_with/console/pages/blueprints-page.md" >}}), click on the relevant blueprint and on blueprint drill-down page click **Delete blueprint** button

![Delete blueprint]( /images/manager/delete_blueprint.png )
