---
layout: bt_wiki
title: agents
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/agents/
---

The `cfy agents` command is used to manage Cloudify agents on existing deployments.

See [agents]({{< relref "install_maintain/agents/_index.md" >}}) for more information.


## Commands
### Common agents flags
* `--deployment-id TEXT` - The unique identifier for the deployment

* `--node-id TEXT` - The node id to be used for filtering

* `--node-instance-id TEXT` - The node instance id to be used for filtering

* `--install-method TEXT` - Only show agents installed with this install_method

* `--tenant-name TEXT` - The name of the tenant of the relevant deployments. 
                         If not specified, the current tenant will be used.
                         This option cannot be used simultaneously with the `all-tenants` flag
                         
* `-a, --all-tenants` - Include resources from all tenants associated with 
                        the user. This option cannot be used simultaneously with the `tenant-name` flag

The filtering flags can be passed multiple times or take comma separated values.


### list
List agents configured with the Manager.

When preparing to upgrade agents, if using the filtering options with `cfy agents install`,
use `cfy agents list` first with the same filtering options to verify which agents
are going to be installed.

#### Usage
`cfy agents list [OPTIONS]`

#### Optional Flags
This command supports the [common agent flags]({{< relref "#common-agents-flags" >}})
and the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


### install
After restoring a manager on a new host using a snapshot, this command installs new agents on the hosts for the new manager while also 
leaving the previous agents installed and running.

{{% warning title="Warning" %}}
This should only be used in very specific circumstances and should not be used to install agents for deployments using an existing manager. 
Instead, `cfy agents install` is to be used for upgrading the agents after the corresponding Manager upgrade.
{{% /warning %}}

#### Usage
`cfy agents install [OPTIONS]`

Install agents on the hosts of existing deployments.

{{% note title="Note" %}}
In case of an upgrade, you can use `cfy agents install -a` in order to update all the deployments' agents
in all tenants.  
The `-a` option will include deployments from all tenants associated with the user. Therefore, in order to
update all agents, you need to have access to all tenants.
{{% /note %}}

#### Optional Flags
This command supports the [common agent flags]({{< relref "#common-agents-flags" >}})
and the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

* `--stop-old-agent` - If set, after installing the new agent the old agent 
                       (that is connected to the old Cloudify Manager) will be stopped.
                       *IMPORTANT* if the deployment has monitoring
                       with auto-healing configured, you need to disable it first

* `--manager-ip TEXT` - The private IP of the current leader (master) Manager.
                        This IP is used to connect to the Manager's RabbitMQ.
                        (only relevant when using a cluster)

* `--manager_certificate TEXT` - A path to a file containing the SSL
                                 certificate of the current leader Manager.
                                 The certificate is available on the Manager:
                                 /etc/cloudify/ssl/cloudify_internal_ca_cert.pem

* `--wait / --no-wait` - Wait for agents operations to end, and show execution logs
				  
* `--install-agent-timeout INTEGER` - Agent installation timeout


### validate
Validates the connection between the Cloudify Manager and the live Cloudify Agents (installed on remote hosts).

#### Usage
`cfy agents validate [OPTIONS]`

#### Optional Flags
This command supports the [common agent flags]({{< relref "#common-agents-flags" >}})
and the and the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

* `--wait / --no-wait` - Wait for agents operations to end, and show execution logs
