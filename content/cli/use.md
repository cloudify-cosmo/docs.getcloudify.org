---
layout: bt_wiki
title: use
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 250
---

The `cfy use` command is used to control a specific manager.

Many of the commands in `cfy` (e.g. `cfy blueprints`, `cfy agents`) are used to perform actions on or using a Cloudify manager. To be able to perform those actions you must `cfy bootstrap` a manager and then `use` it. Note that after bootstrapping a manager, you will automatically `use` it. If you want to control another manager, you will have to use the `use` command.

{{% gsNote title="Note" %}}
After bootstrapping a manager, the user and SSH key provided to use it are used to perform SSH-related commands (e.g. `cfy logs`, `cfy ssh`) are saved on the machine which performed the bootstrap process. Running `cfy use` to control another manager removes those settings and will NOT set the user and SSH key to the manager on which you ran `cfy use`.
{{% /gsNote %}}

#### Usage 
`cfy use [OPTIONS] MANAGER_IP`

Control a specific manager

`MANAGEMENT_IP` is the IP of the manager to use.

Additional CLI commands will be added after a manager is used. To stop
using a manager, you can run `cfy init -r`.

#### Optional flags

*  `--alias TEXT` -		An alias to assign to the profile. This allows
                        you to use `cfy use PROFILE_ALIAS` on top of
                        `cfy use MANAGER_IP`.
*  `-u, --manager-username TEXT` -
						The user on the host machine with which you
                        bootstrapped.
*  `-k, --manager-key TEXT` - 
						The path to the SSH key-file to use when
                        connecting. This argument cannot be used simultaneously with `manager-password`. 
*  `-p, --manager-password TEXT` - 
						The password to use when connecting to Cloudify
                        Manager. This argument cannot be used simultaneously with `manager-key`.
*  `--manager-port INTEGER` - The port to use when connecting to Cloudify Manager.

*  `--rest-port INTEGER` - The REST server's port.


&nbsp;
#### Example

```markdown
$ cfy use -u centos -k ~/.ssh/new-cfy-manager-kp.pem 52.51.21.53
...

Attempting to connect...
Using manager 52.51.21.53 with port 80

...
```