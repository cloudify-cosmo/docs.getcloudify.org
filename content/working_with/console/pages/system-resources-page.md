---
layout: bt_wiki
title: System Resources Page
category: Console
draft: false
weight: 150
aliases: ["/manager_webui/plugins-snapshots-page/", "/working_with/console/plugins-snapshots-page/", "/working_with/console/system-resources-page/"]
---

System Resources page displays [Plugins]({{< relref "working_with/console/widgets/plugins.md" >}}), [Secrets]({{< relref "working_with/console/widgets/secrets.md" >}}) and [Agents]({{< relref "working_with/console/widgets/agents.md" >}}) widgets.

![System Resources Page]( /images/ui/pages/system-resources-page.png )


## Plugins

[Plugins widget]({{< relref "working_with/console/widgets/plugins.md" >}}) lists the plugins available to the current tenant.
By default, [plugins]({{< relref "working_with/official_plugins/_index.md" >}}) are tenant-specific, meaning that a blueprint on one tenant cannot access a plugin on a different tenant. You can also set a plugin as global or private when you upload it to the manager.


## Secrets

Secret storage provides a tenant-wide variable store for data that you do not want to expose in plain text in the {{< param product_name >}} blueprints, such as login credentials for a platform.

See [Secrets widget]({{< relref "working_with/console/widgets/secrets.md" >}}) page for details.


## Agents

Agents are components installed on hosts that are part of your blueprint. The Agent executes orchestration operations locally, collects metrics and report them to the {{< param cfy_manager_name >}}.

You can find more information on [Agents widget]({{< relref "working_with/console/widgets/agents.md" >}}) page.
