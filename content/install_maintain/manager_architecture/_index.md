---
title: Manager Architecture
description:
weight: 400
alwaysopen: false
aliases: /manager_architecture/overview/
---

{{< param cfy_manager_name >}} comprises the following main parts:

* {{< param cfy_manager_name >}}
* Agents _optional_
* {{< param cfy_console_name >}}

## Cloudify Manager

{{< param cfy_manager_name >}} consists of the {{< param product_name >}} code and a set of open-source applications. For an in depth explanation of these applications, [click here]({{< relref "install_maintain/manager_architecture/components.md" >}}).

The {{< param cfy_manager_name >}} architecture is designed to support all potential operational workflows you might require when managing your applications, including:

* Event-stream processing
* Processing secured requests
* Metrics queueing, aggregation and analysis
* Logs/events queueing, aggregation and analysis
* Manual or automated task execution and queueing, based on live streams of events or aggregated data
* Interaction with {{< param cfy_agent_name >}}, for executing tasks on, and maintaining, application hosts

You can also communicate with {{< param cfy_manager_name >}} using the command-line interface, which uses the {{< param product_name >}} REST client module to interact with the {{< param product_name >}} REST service.

All requests are served via a proxy.

## {{< param cfy_agent_name >}}

{{< param cfy_agent_name >}}s are entities for executing tasks on application hosts. They listen to task queues and execute tasks when required.

The agents are designed to execute tasks using [plugins]({{< relref "working_with/official_plugins/_index.md" >}}).

In the background, the same agents that are used on the hosts are also used in {{< param cfy_manager_name >}}, but in a different context. For instance, every deployment has two agents, one of which talks to IaaS APIs to deploy resources.

{{% note title="Note" %}}
Note that {{< param product_name >}} can run in "agentless" mode, which means that agents can use specific plugins to manage hosts without the agents being installed on those hosts. You can specify which server nodes will have agents installed on them in the blueprint.
{{% /note %}}

For more information about agents, [click here]({{< relref "install_maintain/agents/_index.md" >}}).

## {{< param cfy_console_name >}}

{{< param product_name >}} includes a {{< param cfy_console_name >}} that provides the same features as the CLI, as well as others. For more information, [click here]({{< relref "working_with/console/_index.md" >}}).
