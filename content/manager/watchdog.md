---
layout: bt_wiki
title: Watchdog
category: Manager
draft: false
weight: 900

---

# Overview

The Cloudify manager watchdog is a long-running Python process which monitors a Cloudify manager and periodically
creates snapshots of the manager.

# Usage

The manager watchdog requires connectivity to the manager machine.
{{% gsInfo title="Information" %}}
The manager watchdog is agnostic to Cloudify's security features, in the sense that it'll use them transparently when they're configured, without any additional setup or configuration to the watchdog itself.
{{% /gsInfo %}}

The manager watchdog is operated via `cfy-watchdog`, a command-line program which is deployed in the environment where the `cloudify_watchdog` package is installed (via pip or otherwise). The monitored manager's IP is a mandatory argument.

{{% gsNote title="Note" %}}
The `cfy-watchdog` program provides an option (similar to the one provided by the Cloudify CLI) to install any required plugins, by using the `--install-plugins` flag when launching the manager watchdog.
{{% /gsNote %}}

Additional configuration parameters include the watchdog's intervals and thresholds settings (e.g. watch interval, failure interval etc.), snapshots options, as well as logging options (by default, the watchdog will log all output inside the process' stdout).

{{% gsTip title="Tip" %}}
Use `-h` with any incomplete `cfy-watchdog` command to learn about the syntax and options.
{{% /gsTip %}}


The manager must be up and available at the time when the watchdog is first launched, since the watchdog requires context information from the manager.
It's important to note that the manager is not required to be so when the watchdog is re-launched (e.g. when the watchdog is installed as a service and its host rebooted). However, if the manager isn't available, checkups will fail and no snapshots will be created.

To view the watchdog's logs, you can SSH into the watchdog's host, and find the log at `<current_working_dir>/watchdog.log`. The `current_working_dir` is the directory from which the watchdog was started.
This log path is the default one, it can be configured using the `--logger-file-path` flag when launching the watchdog.

# Running as part of bootstrap
It's possible to augment the manager blueprint with a few more nodes, which will cause the
bootstrap process to also deploy one extra VM on which the watchdog will be installed and executed to monitor the bootstrapped manager.

A basic example of how to do this can be found in the [watchdog application blueprint](https://github.com/cloudify-cosmo/cloudify-watchdog/tree/3.3/system_tests/resources/watchdog-test-blueprint).
Simply extract the relevant watchdog nodes from the application blueprint, place them in the desired manager blueprint appropriately and copy the scripts (which are used by those nodes) to the
manager blueprint resources folder.


# Running as a service

It's recommended to run the manager watchdog as a service.
The following is an example configuration on Ubuntu Trusty (using Upstart)

{{< gsHighlight  bash  >}}
start on runlevel [2345]
stop on runlevel [016]

respawn
respawn limit 10 5

env CLOUDIFY_USERNAME=<username>
env CLOUDIFY_PASSWORD=<password>

/usr/local/bin/cfy-watchdog -t <manager_ip> --logger-enabled --logger-file-path <log_file_path>

{{< /gsHighlight >}}
