---
layout: bt_wiki
title: logs
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 110
---

The `cfy logs` command is used to manage log files on a Cloudify manager.

You can use the command to download, backup and purge a manager's service logs.

To use the command you must have the credentials (user and key) set in the local context and must `cfy use -t MANAGEMENT_IP` prior to running the command.


## Commands

### backup

Usage: `cfy logs backup [OPTIONS]`

Create a backup of all logs under a single archive and save it on the manager under /var/log.

&nbsp;
#### Example

```markdown
$ cfy logs backup
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20160628T125946_52.31.106.71.tar.gz
Backing up manager logs to /var/log/cloudify-manager-logs_20160628T125946_52.31.106.71.tar.gz

...
```

### download

Usage: `cfy logs download [OPTIONS]`

Download an archive containing all of the manager's service logs

#### Optional flags

* `-o, --output-path TEXT` - 
						The local path to download to

&nbsp;
#### Example

```markdown
$ cfy logs download
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20160623T070559_10.10.1.10.tar.gz
Downloading archive to: /home/nir0s/work/local-bootstrap-env
Removing archive from manager...

...
```

### purge

Usage: `cfy logs purge [OPTIONS]`

Purge all log files on the manager.

Truncate all logs files under /var/log/cloudify.

This allows the user to take extreme measures to clean up data from the
manager. For instance, when the disk is full due to some bug causing the
logs to bloat up.

The `-f, --force` flag is mandatory as a safety measure.

#### Optional flags

* `-f, --force` - 		Force purge. This flag is mandatory
* `--backup-first` - 	Whether to backup before purging

{{% gsNote title="Warning" %}}
USE WITH CARE! Log files in Cloudify manager are rotated. `cfy purge` is a safety measure in case disk space on the manager runs out for some reason and thus it should only be used in extreme situations.
{{% /gsNote %}}


&nbsp;
#### Example

```markdown
$ cfy logs purge -f --backup-first
...

Creating logs archive in manager: /tmp/cloudify-manager-logs_20160628T130258_52.31.106.71.tar.gz
Backing up manager logs to /var/log/cloudify-manager-logs_20160628T130258_52.31.106.71.tar.gz
Purging manager logs...

...
```