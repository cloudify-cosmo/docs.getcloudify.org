---
layout: bt_wiki
title: Deleting a Blueprint
category: Manager Intro
draft: false
weight: 800
---

Deleting a blueprint removes its model from the database and deletes its resources from the fileserver. Deleting a blueprint does not delete the deployments created from that blueprint or resources of those deployments.

To delete a blueprint from the manager with the CLI, run:

{{< highlight bash >}}
cfy blueprints delete [OPTIONS] BLUEPRINT_ID
{{< /highlight >}}

The delete options are:

    -v, --verbose - Show verbose output. You can supply this up to three times, for example -vvv.
    -t, --tenant-name - Specify the tenant where the blueprint in stored. (Default: current tenant)

To delete a blueprint from the Cloudify Console, go to the Blueprints widget and click **Delete** on the relevant blueprint.

![Delete blueprint]( /images/manager/delete_blueprint.png )
