---
layout: bt_wiki
title: logs
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 110
---

The `cfy logs` command is used to manage log files on Cloudify Manager.

You can use the command to download, backup and purge Cloudify Manager service logs.

To use the command you must have the credentials (user and key) set in the local context and must run `cfy use -t MANAGEMENT_IP` prior to running the command.

#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.

## Commands

### backup

#### Usage 
`cfy logs backup [OPTIONS]`

Create a backup of all logs under a single archive and save it on Cloudify Manager under /var/log.

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy logs backup
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20170330T122201_10.239.0.208.tar.gz
Backing up manager logs to /var/log/cloudify-manager-logs_20170330T122201_10.239.0.208.tar.gz

...
{{< /gsHighlight >}}

### download

#### Usage 
`cfy logs download [OPTIONS]`

Download an archive containing all of the Cloudify Manager service logs.

#### Optional flags

* `-o, --output-path TEXT` - 
						The local path to which to save the download.

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy logs download
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20160623T070559_10.10.1.10.tar.gz
Downloading archive to: /home/nir0s/work/local-bootstrap-env
Removing archive from manager...

...
{{< /gsHighlight >}}

### purge

#### Usage 
`cfy logs purge [OPTIONS]`

Purge all log files on Cloudify Manager.

Truncate all logs files under /var/log/cloudify.

This enables you to take extreme measures to clean up data from Cloudify Manager. For example, you might choose to run this command when the disk is full due to a bug that has caused the logs to bloat.

The `-f, --force` flag is mandatory as a safety measure.

#### Optional flags

* `--backup-first` - 	Creates a backup before purging.

{{% gsWarning title="Forced Prerequisites Installation" %}}
USE WITH CARE!<br>
Log files in Cloudify Manager are rotated. `cfy purge` is a safety measure in case disk space on Cloudify Manager runs out, and  should only be used in extreme situations.
{{% /gsWarning %}}


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy logs purge -f
...

Purging manager logs...

...
{{< /gsHighlight >}}