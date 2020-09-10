---
title: Manager Architecture
description:
weight: 400
alwaysopen: false
aliases: /manager_architecture/overview/
---

Cloudify Manager comprises the following main parts:

* [Cloudify Manager](#cloudify-manager)
* [Agents _optional_](#cloudify-agents)
* [Cloudify Console](#cloudify-console)

# Cloudify Manager

Cloudify Manager consists of the Cloudify code and a set of open-source applications. For an in depth explanation of these applications, [click here]({{< relref "install_maintain/manager_architecture/components.md" >}}).

The Cloudify Manager architecture is designed to support all potential operational workflows you might require when managing your applications, including:

* Event-stream processing
* Processing secured requests
* Metrics queueing, aggregation and analysis
* Logs/events queueing, aggregation and analysis
* Manual or automated task execution and queueing, based on live streams of events or aggregated data
* Interaction with Cloudify agents, for executing tasks on, and maintaining, application hosts

You can also communicate with Cloudify Manager using the command-line interface, which uses the Cloudify REST client module to interact with the Cloudify REST service.

All requests are served via a proxy.

# Cloudify Agents

Cloudify agents are entities for executing tasks on application hosts. They listen to task queues and execute tasks when required.

The agents are designed to execute tasks using [Cloudify-specific plugins]({{< relref "working_with/official_plugins/_index.md" >}}).

In the background, the same agents that are used on the hosts are also used in Cloudify Manager, but in a different context. For instance, every deployment has two agents, one of which talks to IaaS APIs to deploy resources.

{{% note title="Note" %}}
Note that Cloudify can run in "agentless" mode, which means that agents can use specific plugins to manage hosts without the agents being installed on those hosts. You can specify which server nodes will have agents installed on them in the blueprint.
{{% /note %}}

For more information about agents, [click here]({{< relref "install_maintain/agents/_index.md" >}}).

# Cloudify Console

Cloudify includes a Cloudify Console that provides the same features as the CLI, as well as others. Cloudify Console is deployed alongside Cloudify Manager and is accessible from the "Local Blueprints" menu inside the Cloudify Console by default.
