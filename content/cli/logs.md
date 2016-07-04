---
layout: bt_wiki
title: logs
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 120
---

The `cfy logs` command is used to manage log files on a Cloudify manager.

You can use the command to download, backup and purge a manager's service logs.

To use the command you must have the credentials (user and key) set in the local context and must `cfy use -t MANAGEMENT_IP` prior to running the command.


## Commands

### backup

Usage: `cfy logs backup`

Create a backup of all log files on the manager stored under `/var/log/cloudify` and the output of `journalctl` and stores them under `/var/log/cloudify-manager-logs_MANAGER_DATE_MANAGER_IP.tar.gz`

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy logs backup
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20160628T125946_52.31.106.71.tar.gz
Backing up manager logs to /var/log/cloudify-manager-logs_20160628T125946_52.31.106.71.tar.gz

...
{{< /gsHighlight >}}

### download

Usage: `cfy logs download [options]` 

Create an archive containing the manager's logs and download them. The output file will contain the same content as with `cfy logs backup`.

#### Optional flags

* `-o, --output=OUTPUT_PATH` - The output path for the downloaded file.

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy logs download
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20160623T070559_10.10.1.10.tar.gz
Downloading archive to: /home/nir0s/work/local-bootstrap-env
Removing archive from manager...

...
{{< /gsHighlight >}}



### purge

Usage: `cfy logs purge [options] -f`

Purge all log files on the manager.

#### Required flags

* `-f, --force` - This flag is mandatory to perform the purge.

#### Optional flags

* `--backup-first` - Executes a `cfy logs backup` first.

{{% gsNote title="Warning" %}}
USE WITH CARE! Log files in Cloudify manager are rotated. `cfy purge` is a safety measure in case disk space on the manager runs out for some reason and thus it should only be used in extreme situations.
{{% /gsNote %}}


&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy logs purge -f --backup-first
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20160628T130258_52.31.106.71.tar.gz
Backing up manager logs to /var/log/cloudify-manager-logs_20160628T130258_52.31.106.71.tar.gz
Purging manager logs...

...
{{< /gsHighlight >}}