---
layout: bt_wiki
title: agents
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 10
---

The `cfy agents` command is used to install Cloudify agents on existing deployments.

After restoring a manager on a new host using a snapshot, this will install new agents on the hosts for the new manager while also leaving the previous agents installed and running.

{{% gsNote title="Warning" %}}
USE WITH CARE!

This should only be used in very specific circumstances and should not be used in case:

* The same manager is upgraded using the `cfy upgrade` command.
* To install agents for deployments using an existing manager.
{{% /gsNote %}}


See [agents]({{< relref "agents/overview.md" >}}) for more information.


## Commands

### install

Usage: `cfy agents install [options]`

Install agents for all or for selected deployments.

#### Optional flags

*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        The ID of the deployment to install agents for. If
                        omitted, this will install agents for all deployments
*  `-l, --include-logs` -    Include logs in returned events
*  `-s, --install-script` - Alternative location of the "install_agents.py" script.