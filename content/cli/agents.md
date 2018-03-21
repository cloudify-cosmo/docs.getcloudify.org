---
layout: bt_wiki
title: agents
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 10
---

The `cfy agents` command is used to install Cloudify agents on existing deployments.

After restoring a manager on a new host using a snapshot, this command installs new agents on the hosts for the new manager while also leaving the previous agents installed and running.

{{% warning title="Warning" %}}
This should only be used in very specific circumstances and should not be used in the following situations:

* The same manager is upgraded using the `cfy upgrade` command.
* To install agents for deployments using an existing manager.
{{% /warning %}}


See [agents]({{< relref "install_maintain/agents/_index.md" >}}) for more information.


## Commands

### install

#### Usage 
`cfy agents install [OPTIONS] [DEPLOYMENT_ID]`

Install agents on the hosts of existing deployments.


`DEPLOYMENT_ID` - The ID of the deployment you would like to install agents for.

#### Optional Flags

* `--include-logs / --no-logs`  - Include logs in returned events  
								  [default: `true`]

*  `-s, --install-script TEXT` - Alternative location of the  
								 `install_agents.py` script

*  `-v, --verbose`             - Show verbose output. You can apply  
								 this up to three times (i.e. -vvv)

*  `-t, --tenant-name TEXT`    - The name of the tenant of the relevant  
								 deployment(s). If not specified, the 
								 current tenant is used

