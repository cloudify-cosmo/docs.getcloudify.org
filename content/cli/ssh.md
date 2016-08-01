---
layout: bt_wiki
title: ssh
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 200
---

The `cfy ssh` command is used to connect to a Cloudify manager via SSH.

You can use the command to create a new terminal session, run a command or connect to a shared tmux based session.

Usage: `cfy ssh [OPTIONS]`

Connects to a running manager via SSH.

`host` starts a tmux session (e.g. tmux new -s "ssh_session_vi120m") after
which a command for a client is printed in the tmux session for the host
to send to the client (i.e. cfy ssh --sid ssh_session_vi120m).

When starting a new session, the host creates an alias for "exit" so that
when a client connects and exits, it will run "tmux detach" instead and
not kill the session.

When the host exits the tmux session, a command will be executed to kill
the session.

Passing an `command` will simply execute it on the manager while omitting
a command will connect to an interactive shell.

#### Optional flags

* `-c, --command TEXT` - 
						Execute a command on the manager over SSH
* `--host` - 			Host an SSH tmux session
* `--sid TEXT` - 		Join an SSH tmux session
* `-l, --list-sessions` - 
						List available SSH tmux sessions

&nbsp;
#### Example

```markdown
$ cfy ssh
...

Connecting to centos@52.31.106.71...
Last login: Wed Jun 29 07:55:53 2016 from 52.30.34.244
[centos@ip-172-31-46-107 ~]$

...
```