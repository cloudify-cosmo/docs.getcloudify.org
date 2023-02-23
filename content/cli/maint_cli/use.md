---
title: use
description: The `cfy use` command is used to control a specific instance of the Manager.
category: Docs
draft: true
abstract: Command-Line Interface
aliases: /cli/use/
---

The `cfy use` command is used to control a specific instance of the {{< param cfy_manager_name >}}.

Many of the commands in `cfy` (e.g. `cfy blueprints`, `cfy agents`) are used to perform actions on the {{< param cfy_manager_name >}}. To perform those actions you must run `cfy bootstrap` a Manager and then `use` it. Note that after bootstrapping a Manager, you automatically `use` it. To control another Manager, you must use the `use` command.

{{% note title="Note" %}}
After bootstrapping a Manager, the user and SSH key provided to use it are saved on the machine which performed the bootstrap process. The SSH key is used to perform SSH-related commands (e.g. `cfy logs`, `cfy ssh`). Running `cfy use` to control another Manager removes those settings and do NOT set the user and SSH key to the Manager on which you ran `cfy use`.
{{% /note %}}

#### Usage
`cfy use [OPTIONS] MANAGER_IP`

Control a specific instance of the {{< param cfy_manager_name >}}.

`MANAGEMENT_IP` is the IP of the manager to use.

Additional CLI commands are added after a Manager is used. To stop
using a Manager, run `cfy init -r`.

#### Optional flags
This command supports the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

*  `--alias TEXT` -		An alias to assign to the profile. This enables
                        you to use `cfy use PROFILE_ALIAS` on top of
                        `cfy use MANAGER_IP`.
*  `-u, --manager-username TEXT` -
						The user on the host machine with which you
                        bootstrapped.
*  `-k, --manager-key TEXT` -
						The path to the SSH key-file to use when
                        connecting. This argument cannot be used simultaneously with `manager-password`.
*  `-p, --manager-password TEXT` -
						The password to use when connecting to the {{< param cfy_manager_name >}}. This argument cannot be used simultaneously with `manager-key`.
*  `--manager-port INTEGER` - The port to use when connecting to the {{< param cfy_manager_name >}}.

*  `--rest-port INTEGER` - The REST server's port.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy use -u centos -k ~/.ssh/new-cfy-manager-kp.pem 52.51.21.53
...

Attempting to connect...
Using manager 52.51.21.53 with port 80

...
{{< /highlight >}}
