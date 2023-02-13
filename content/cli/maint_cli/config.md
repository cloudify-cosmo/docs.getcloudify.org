---
title: config
description: The `cfy config` command is used to manage the Cloudify Manager's configuration.
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/config/
---

The `cfy config` command is used to manage the {{< param cfy_manager_name >}}'s configuration.

#### Optional flags
`cfy config` commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### List

#### Usage
`cfy config list [OPTIONS]`

List all configurations


#### Example

{{< highlight  bash  >}}

$ cfy config list

Config:
+-----------------------------------+--------------------------------------------------+------------+------------+-------------+
|                name               |                      value                       |   scope    | updated_at | is_editable |
+-----------------------------------+--------------------------------------------------+------------+------------+-------------+
|        account_lock_period        |                        -1                        |    rest    |            |     True    |
|            broker_port            |                       5671                       |   agent    |            |     True    |
|     blueprint_folder_max_files    |                      10000                       |    rest    |            |     True    |
|    blueprint_folder_max_size_mb   |                        50                        |    rest    |            |     True    |
|         default_page_size         |                       1000                       |    rest    |            |     True    |
| failed_logins_before_account_lock |                        4                         |    rest    |            |     True    |
|          file_server_root         |              /opt/manager/resources              |    rest    |            |    False    |
|          file_server_url          |        https://172.20.0.2:53333/resources        |    rest    |            |    False    |
|             heartbeat             |                        30                        |   agent    |            |     True    |
|    insecure_endpoints_disabled    |                       True                       |    rest    |            |    False    |
|           ldap_dn_extra           |                                                  |    rest    |            |     True    |
|            ldap_domain            |                                                  |    rest    |            |     True    |
|      ldap_is_active_directory     |                       True                       |    rest    |            |     True    |
|         ldap_nested_levels        |                        1                         |    rest    |            |     True    |
|           ldap_password           |                                                  |    rest    |            |     True    |
|            ldap_server            |                                                  |    rest    |            |     True    |
|            ldap_timeout           |                       5.0                        |    rest    |            |     True    |
|           ldap_username           |                                                  |    rest    |            |     True    |
|             log_level             |                       INFO                       |   agent    |            |     True    |
|         maintenance_folder        |             /opt/manager/maintenance             |    rest    |            |    False    |
|            max_workers            |                        5                         |   agent    |            |     True    |
|            max_workers            |                       100                        | mgmtworker |            |     True    |
|      min_available_memory_mb      |                       100                        |    rest    |            |     True    |
|            min_workers            |                        2                         |   agent    |            |     True    |
|            min_workers            |                        2                         | mgmtworker |            |     True    |
|             public_ip             |                    172.20.0.2                    |    rest    |            |    False    |
|       rest_service_log_level      |                       INFO                       |    rest    |            |     True    |
|       rest_service_log_path       | /var/log/cloudify/rest/cloudify-rest-service.log |    rest    |            |    False    |
+-----------------------------------+--------------------------------------------------+------------+------------+-------------+

{{< /highlight >}}


### Update

#### Usage
`cfy config update [OPTIONS] INPUTS`

  Update the manager configuration.

  Pass INPUTS as a yaml-formatted dict with {"config name": "new value"}, or
  as a path to a file containing yaml.

  To resolve ambiguous names, config name can be prefixed with scope, eg.
  "rest.ldap_username".

#### Example

{{< highlight  bash  >}}

$ cfy config update '{"rest.ldap_username": "adminuser", "rest.ldap_password": "adminpassword"}'
...

{{< /highlight >}}
