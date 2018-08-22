+++
title = "Cloudify CLI Commands"
description = "CLI Commands for the Cloudify Manager"
weight = 90
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

### Common options

These options are supported by all Cloudify CLI Commands. They can be passed as
either an argument to the command itself, eg. `cfy blueprints list -v`, or as
an argument to `cfy` itself, eg. `cfy -v blueprints list`, which has the same
effect as the previous call.

* `-q, --quiet` - Show only critical logs
* `--format [plain|json]` - Choose the output format
* `-v, --verbose` - Show verbose output. You can supply this up to
                            three times (i.e. -vvv)
* `--json` - Force JSON output
