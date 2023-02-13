---
title: ssh
description: The `cfy ssh` command is used to connect to a Cloudify Manager via SSH.
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/ssh/
---

The `cfy ssh` command is used to connect to a {{< param cfy_manager_name >}} via SSH.

You can use the command to create a new terminal session, run a command, or connect to a shared tmux-based session.

#### Usage
`cfy ssh [OPTIONS]`

Connects to a running manager via SSH.

`host` starts a tmux session (e.g. tmux new -s "ssh_session_vi120m") after
which a command for a client is printed in the tmux session for the host
to send to the client (i.e. cfy ssh --sid ssh_session_vi120m).

When starting a new session, the host creates an alias for "exit" so that
when a client connects and exits, it will run "tmux detach" instead and
not terminate the session.

When the host exits the tmux session, a command will be executed to terminate
the session.

Passing a `command` simply executes it on the {{< param cfy_manager_name >}}, whereas omitting
a command connects to an interactive shell.

#### Optional flags

* `-c, --command TEXT` -
						Execute a command on the manager over SSH
* `--host` - 			Host an SSH tmux session
* `--sid TEXT` - 		Join an SSH tmux session
* `-l, --list-sessions` -
						List available SSH tmux sessions

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy ssh
...

Connecting to centos@10.239.2.241...
Last login: Tue Apr  4 05:51:20 2017 from 192.168.8.195
[centos@cloudify ~]$

...
{{< /highlight >}}
