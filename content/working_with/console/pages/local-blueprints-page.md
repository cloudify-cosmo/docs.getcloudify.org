---
layout: bt_wiki
title: Blueprints Page
category: Console
draft: false
abstract: Blueprint Page Reference
weight: 130
aliases: ["/manager_webui/blueprints-page/", "/working_with/console/blueprints-page/", "/working_with/console/local-blueprints-page/"]
---

The Blueprints page acts as the catalog of services (blueprints) that are available for use on this {{< param cfy_console_name >}}.
It provides a list of the blueprints uploaded to the {{< param cfy_manager_name >}} and action buttons to upload, deploy and delete them.
It also allows to edit specific blueprint in [{{< param cfy_composer_name >}}]({{< param cfy_composer_link >}}).

{{% note %}}
The "edit in [{{< param cfy_composer_name >}}]({{< param cfy_composer_link >}})" option is only available in [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}).
{{% /note %}}

![Blueprints Page]( /images/ui/pages/local-blueprints-page.png )

## Blueprint marketplace

In addition to uploading a blueprint from a specified package it is possible to upload one of the blueprints predefined in the **Marketplace**.

The **Marketplace** contains blueprints organized in categories:

* AWS
* Azure
* GCP
* Terraform
* Helm
* Other

For more information check [blueprints widget documentation]({{< relref "working_with/console/widgets/blueprints.md" >}}).