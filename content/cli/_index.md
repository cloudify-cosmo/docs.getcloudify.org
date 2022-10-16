+++
title = "Cloudify CLI Commands"
description = "CLI Commands for the Cloudify Manager"
weight = 90
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

## Prerequisites
The simplest way to get the {{< param cfy_cli_name >}} utility is through the {{< param product_name >}} docker image. See [this guide]({{< relref "trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli" >}}) to learn more on this option.

To install the {{< param cfy_cli_name >}} utility directly on your Linux, Windows or Mac environment refer to the [CLI installation guide] ({{< relref "cloudify_manager/cloudify_cli" >}}).

## Common options

These options are supported by all {{< param cfy_cli_name >}} Commands. They can be passed as
either an argument to the command itself, eg. `cfy blueprints list -v`, or as
an argument to `cfy` itself, eg. `cfy -v blueprints list`, which has the same
effect as the previous call.

* `-q, --quiet` - Show only critical logs
* `--format [plain|json]` - Choose the output format
* `-v, --verbose` - Show verbose output. You can supply this up to
                            three times (i.e. -vvv)
* `--json` - Force JSON output
* `--manager TEXT` - Connect to a specific manager by IP or host
* `-t, --tenant-name TEXT` - The name of the tenant of the deployment. If not
                            specified, the current tenant will be used
* `-o, --pagination-offset INTEGER` - The number of resources to skip;
                            e.g. `--pagination-offset=1` skips the first
                            resource
* `-s, --pagination-size INTEGER` - The max number of results to retrieve per
                                  page



### Verbose Output

The ``-v/--verbose`` flag is available for all commands. It sets the command verbosity level. There are five verbosity levels:

* Running a command with the ``--quiet`` flag limits the log output to critical logs only.
* Running a command without the verbose flag. (The default).
* Running a command with ``-v`` prints tracebacks where relevant, in addition to the normal output.
* Running a command with ``-vv`` in addition to the tracebacks, displays the ``DEBUG`` log statements of local/remote execution events.
* Running a command with ``-vvv`` in addition to the tracebacks and debug log statements, sets all loggers declared in the `config <https://github.com/cloudify-cosmo/cloudify-cli/blob/3.4/cloudify_cli/resources/config.yaml>`_ file to debug mode.

{{% note title="Note" %}}
``--debug`` is equivalent to ``-vvv``
{{% /note %}}
