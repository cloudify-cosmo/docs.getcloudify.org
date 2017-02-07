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
After bootstrapping a manager, the user and ssh-key provided to use it will be used to perform ssh related commands (e.g. `cfy logs`, `cfy ssh`) are saved on the machine which performed the bootstrap process. Running `cfy use` to control another manager will remove those settings and will NOT set the user and ssh-key to the manager you ran `cfy use` on.
{{% /gsNote %}}

Usage: `cfy use [options] -t MANAGEMENT_IP`

Control the manager accessible on the supplied IP address.

#### Required flags

*  `-t, --management-ip=MANAGEMENT_IP` - The Manager's ip address. Note that this might either be a publically available IP address or an address in a private network - depending on your bootstrap inputs.

#### Optional flags

* `--port=REST_PORT` - The REST server's port (default: 80). This is only relevant when using a secured manager which might then be available on port 443 instead.


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy use -t 52.31.106.71
...

Using manager 52.31.106.71 with port 80

...
{{< /gsHighlight >}}