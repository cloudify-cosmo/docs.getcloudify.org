---
title: agents
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/agents/
---

The `cfy agents` command is used to manage {{< param product_name >}} agents on existing deployments.

See [agents]({{< relref "install_maintain/agents/_index.md" >}}) for more information.


## Commands
### Common agents arguments

* `-d, --deployment-id TEXT` - The unique identifier for the deployment
* `--node-id TEXT` - The node id to filter to be used for filtering
* `--node-instance-id TEXT` - The node instance id to be used for filtering
* `--install-method TEXT` - Only show agents installed with this
                            install_method
*  `-a, --all-tenants` - Include resources from all tenants associated with
                           the user. This option cannot be used simultaneously with the `tenant-name` argument.

The filtering flags can be passed multiple times or take comma separated values.

### list

List agents configured with the Manager.
When preparing to upgrade agents, if using the filtering options with `cfy agents install`,
use `cfy agents list` first with the same filtering options to verify which agents
are going to be installed.

#### Usage
`cfy agents list [OPTIONS]`

This command supports the [common agent flags]({{< relref "#common-agents-flags" >}})
and the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


### install
After restoring a manager on a new host using a snapshot, this command installs new agents on the hosts for the new manager while also leaving the previous agents installed and running.

{{% warning title="Warning" %}}
This should only be used in very specific circumstances and should not be used to install agents for deployments using an existing manager. Instead, `cfy agents install` is to be used for upgrading the agents after the corresponding Manager upgrade.
{{% /warning %}}

#### Usage
`cfy agents install [OPTIONS] [DEPLOYMENT_ID]`

Install agents on the hosts of existing deployments.


`DEPLOYMENT_ID` - The ID of the deployment you would like to install agents for.

#### Optional Flags

This command supports the [common agent flags]({{< relref "#common-agents-flags" >}})
and the and the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

* `--include-logs / --no-logs`  - Include logs in returned events  [default: `true`]

*  `--stop-old-agent` - If set, after installing the new agent the old agent will be stopped

*  `-s, --install-script TEXT` - Alternative location of the `install_agents.py` script

*  `-t, --tenant-name TEXT`    - The name of the tenant of the relevant
					deployment(s). If not specified, the current tenant is used.

*  `--manager-ip TEXT`    - The private IP of the current leader (master) Manager.
                            This IP is used to connect to the Manager's RabbitMQ.
                             (relevant only in HA cluser)

*  `--manager_certificate TEXT`    - A path to a file containing the SSL
                                     certificate of the current leader Manager.
                                     The certificate is available on the Manager:
                                      /etc/cloudify/ssl/cloudify_internal_ca_cert.pem

*  `--wait / --no-wait`    - Wait for agents operations to end, and show
                                  execution logs
				  
*  `--install-agent-timeout INTEGER`    - Agent installation timeout



### validate
Validates the connection between the {{< param cfy_manager_name >}} and the live
{{< param cfy_agent_name >}} (installed on remote hosts).
#### Usage
`cfy agents validate [OPTIONS] [DEPLOYMENT_ID]`


`DEPLOYMENT_ID` - The ID of the deployment you would like to validate agents for.

#### Optional Flags

This command supports the [common agent flags]({{< relref "#common-agents-flags" >}})
and the and the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

* `--include-logs / --no-logs`  - Include logs in returned events
								  [default: `true`]

*  `-s, --install-script TEXT` - Alternative location of the
								 `install_agents.py` script

*  `-t, --tenant-name TEXT`    - The name of the tenant of the relevant
								 deployment(s). If not specified, the
								 current tenant is used.
