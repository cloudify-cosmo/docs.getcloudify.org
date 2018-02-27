---
layout: bt_wiki
title: Deleting a Blueprint
category: Manager Intro
draft: false
weight: 800
---

Deleting a blueprint removes its model from the database and deletes its resources from the fileserver. Deleting a blueprint does not delete the deployments created from that blueprint or resources of those deployments.

To delete a blueprint from the CLI, run

{{< highlight  bash >}}
cfy blueprints delete [OPTIONS] BLUEPRINT_ID
{{< /highlight >}}

To delight a blueprint from the Cloudify Web interface, on the Blueprints widget, click **Delete** on the relevant blueprint.

