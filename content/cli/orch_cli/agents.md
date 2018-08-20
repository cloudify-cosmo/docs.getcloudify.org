---
layout: bt_wiki
title: agents
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/agents/
---

The `cfy agents` command is used to manage Cloudify agents on existing deployments.


{{% warning title="Warning" %}}
This should only be used in very specific circumstances and should not be used to install agents for deployments using an existing manager. Instead, `cfy agents install` is to be used for upgrading the agents after the corresponding Manager upgrade.
{{% /warning %}}


See [agents]({{< relref "install_maintain/agents/_index.md" >}}) for more information.


## Commands

### install
After restoring a manager on a new host using a snapshot, this command installs new agents on the hosts for the new manager while also leaving the previous agents installed and running.

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
								 this up to three times (i.e. -vvv).

*  `-t, --tenant-name TEXT`    - The name of the tenant of the relevant
								 deployment(s). If not specified, the
								 current tenant is used.

*  `--manager-ip TEXT`    - The private IP of the current leader (master) Manager.
                            This IP is used to connect to the Manager's
                             RabbitMQ.
                             (relevant only in HA cluser)

*  `--manager_certificate TEXT`    - A path to a file containing the SSL
                                     certificate of the current leader
                                     Manager.
                                     The certificate is available on the Manager:
                                      /etc/cloudify/ssl/cloudify_internal_ca_cert.pem



### validate
Validates the connection between the Cloudify Manager and the live
Cloudify Agents (installed on remote hosts).
#### Usage
`cfy agents validate [OPTIONS] [DEPLOYMENT_ID]`


`DEPLOYMENT_ID` - The ID of the deployment you would like to validate agents for.

#### Optional Flags

* `--include-logs / --no-logs`  - Include logs in returned events
								  [default: `true`]

*  `-s, --install-script TEXT` - Alternative location of the
								 `install_agents.py` script

*  `-v, --verbose`             - Show verbose output. You can apply
								 this up to three times (i.e. -vvv).

*  `-t, --tenant-name TEXT`    - The name of the tenant of the relevant
								 deployment(s). If not specified, the
								 current tenant is used.