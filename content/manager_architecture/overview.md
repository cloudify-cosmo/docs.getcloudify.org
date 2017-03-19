---
layout: bt_wiki
title: Overview
category: Manager
draft: false
weight: 1
---
{{% gsSummary %}}{{% /gsSummary %}}


Cloudify Manager comprises the following main parts:

* [Cloudify Manager](#cloudify-manager)
* [Agents _optional_](#cloudify-agents) 
* [Web Interface](#cloudify-web-interface) (for Premiun version users)

# Cloudify Manager

Cloudify Manager consists of the Cloudify code and a set of open-source applications. For an indepth expalanation of these applications, [click here]({{< relref "manager_architecture/components.md" >}}).

The Cloudify Manager architecture is designed to support all potential operational flows you might require when managing your applications, including:

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

The agents are designed to execute tasks using [Cloudify-specific plugins]({{< relref "plugins/overview.md" >}}).

In the background, the same agents that are used on the hosts are also used in Cloudify Manager, but in a different context. For instance, everu deployment has two agents, one of which talks to IaaS APIs to deploy resources.

{{% gsNote title="Note" %}}
Note that Cloudify can run in "agentless" mode, which means that agents can use specific plugins to manage hosts without the agents being installed on those hosts. You can specify which server nodes will have agents installed on them in the blueprint.
{{% /gsNote %}}

For more information about agents, [click here]({{< relref "agents/overview.md" >}}).

# Cloudify Web Interface

Cloudify Premium version features a Web interface. The interface provides most of the features the CLI, and other features. The Cloudify Web interface is deployed alongside Cloudify Manager.
