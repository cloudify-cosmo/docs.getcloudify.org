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


Usage: `cfy ssh [options]`

Connect to a manager via SSH

#### Optional flags

* `-c, --command=COMMAND` - Execute a command over SSH
* `--sid=SESSION_ID` - Joins an SSH tmux session
* `-l, --list` - Lists available SSH tmux sessions
* `--host` - Hosts an SSH tmux session

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy ssh
...

Connecting to centos@52.31.106.71...
Last login: Wed Jun 29 07:55:53 2016 from 52.30.34.244
[centos@ip-172-31-46-107 ~]$

...
{{< /gsHighlight >}}