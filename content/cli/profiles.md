---
layout: bt_wiki
title: profiles
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 160
---

The `cfy profiles` command is used to manage Cloudify profiles.

Each profile can have its own credentials for managers and Cloudify various enviromental settings

See [profiles]({{< relref "profiles/overview.md" >}}) for more information.


## Commands

### list

Usage: `cfy profiles list [OPTIONS]`

List all profiles

&nbsp;
#### Example

```markdown
$ cfy profiles list
...

Listing all profiles...

Profiles:
+--------------+-------+----------+--------------+----------+-----------+---------------+
|  manager_ip  | alias | ssh_user | ssh_key_path | ssh_port | rest_port | rest_protocol |
+--------------+-------+----------+--------------+----------+-----------+---------------+
| *52.51.21.53 |  None | Not Set  |   Not Set    |    22    |     80    |      http     |
+--------------+-------+----------+--------------+----------+-----------+---------------+

...
```

### get-active

Usage: `cfy profiles get-active [OPTIONS]`

Gets your current active profile

&nbsp;
#### Example

```markdown
$ cfy profiles get-active
...

Active profile:
+-------------+-------+----------+--------------+----------+-----------+---------------+
|  manager_ip | alias | ssh_user | ssh_key_path | ssh_port | rest_port | rest_protocol |
+-------------+-------+----------+--------------+----------+-----------+---------------+
| 52.51.21.53 |  None | Not Set  |   Not Set    |    22    |     80    |      http     |
+-------------+-------+----------+--------------+----------+-----------+---------------+

...
```


### export

Usage: `cfy profiles export [OPTIONS]`

Export all profiles to a file

WARNING: Including the ssh keys of your profiles in the archive means that
once the profiles are imported, the ssh keys will be put back in their
original locations!

If `-o / --output-path` is omitted, the archive's name will be `cfy-
profiles.tar.gz`.

#### Optional flags

*  `--include-keys` - 	Include ssh key files in archive
*  `-o, --output-path TEXT` - 
						The local path to download to

&nbsp;
#### Example

```markdown
$ cfy profiles export
...

Exporting profiles to /Users/assi/Work/repos/cloudify-cli/cfy-profiles.tar.gz...
Export complete!
You can import the profiles by running `cfy profiles import PROFILES_ARCHIVE`

...
```


### import

Usage: cfy profiles import [OPTIONS] ARCHIVE_PATH

Import profiles from a profiles archive

WARNING: If a profile exists both in the archive and locally it will be
overwritten (any other profiles will be left intact).

`ARCHIVE_PATH` is the path to the profiles archive to import.

&nbsp;
#### Example

```markdown
$ cfy profiles import cfy-profiles.tar.gz
...

Importing profiles from cfy-profiles.tar.gz...
Restoring profile ssh keys...
Attempting to connect...
Using manager 52.51.21.53 with port 80
Import complete!
You can list profiles using `cfy profiles list`

...
```

### delete

Usage: `cfy profiles delete [OPTIONS] PROFILE_NAME`

Delete a profile

`PROFILE_NAME` is the IP of the manager the profile manages.

&nbsp;
#### Example

```markdown
$ cfy profiles delete 52.51.21.53
...

Deleting profile 52.51.21.53...
Profile deleted

...
```