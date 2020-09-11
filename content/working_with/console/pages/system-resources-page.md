---
layout: bt_wiki
title: System Resources Page
category: Cloudify Console
draft: false
weight: 150
aliases: ["/manager_webui/plugins-snapshots-page/", "/working_with/console/plugins-snapshots-page/", "/working_with/console/system-resources-page/"]
---

System Resources page displays Plugins, Secrets and Agents widgets.

![System Resources Page]( /images/ui/systemResourcesPage/system-resources-page.png )


## Plugins

By default, [plugins]({{< relref "working_with/official_plugins/_index.md" >}}) are tenant-specific, meaning that a blueprint on one tenant cannot access a plugin on a different tenant. You can also set a plugin as global or private when you upload it to the manager. The Plugins table lists the plugins are available to the current tenant.

### Uploading a Plugin

1. Click **Upload** above the Plugins table.
2. Either enter the URL of the wagon or select the wagon file from your file repository.
3. Either enter the URL of the plugin yaml file or select the plugin yaml file from your file repository.
4. Click **Upload**.<br>
The plugin details appear in the Plugins table.


## Secrets

Secret storage provides a tenant-wide variable store for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform. For more information about secret storage, [click here]({{< relref "working_with/manager/using-secrets.md" >}}).


## Agents

Agents are components installed on hosts that are part of your blueprint. The Agent executes orchestration operations locally, collects metrics and report them to the Cloudify Manager. 

For more information about agents widget, [click here]({{< relref "working_with/console/widgets/agents.md" >}}).

For more information about agents in general, [click here]({{< relref "install_maintain/agents/_index.md" >}}).
